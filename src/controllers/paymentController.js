const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../config/database');

const createPaymentIntent = async (req, res) => {
  try {
    const { courseId, isBundle } = req.body;
    let amount, description;

    if (isBundle) {
      amount = 9900;
      description = 'Black Bot Coding Academy - All 3 Courses Bundle';
    } else {
      const courseResult = await pool.query('SELECT price FROM courses WHERE id = $1', [courseId]);
      if (courseResult.rows.length === 0) return res.status(404).json({ error: 'Not found' });
      amount = Math.round(courseResult.rows[0].price * 100);
      description = 'Black Bot Coding Academy - Single Course';
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      description,
      metadata: { userId: req.userId, courseId: courseId || 'bundle', isBundle }
    });

    res.json({ clientSecret: paymentIntent.client_secret, amount, description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, courseId, isBundle } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') return res.status(400).json({ error: 'Failed' });

    const paymentResult = await pool.query(
      'INSERT INTO payments (user_id, stripe_payment_id, amount, course_id, bundle, payment_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.userId, paymentIntentId, paymentIntent.amount / 100, courseId, isBundle, 'completed']
    );

    if (isBundle) {
      await pool.query(
        'UPDATE users SET is_premium = true, premium_courses = ARRAY[\'Python\', \'JavaScript\', \'SQL\'] WHERE id = $1',
        [req.userId]
      );
    } else {
      const courseResult = await pool.query('SELECT language FROM courses WHERE id = $1', [courseId]);
      const language = courseResult.rows[0].language;
      await pool.query(
        'UPDATE users SET premium_courses = array_append(premium_courses, $1) WHERE id = $2',
        [language, req.userId]
      );
    }

    res.json({ message: 'Payment successful', payment: paymentResult.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPaymentIntent, confirmPayment };
