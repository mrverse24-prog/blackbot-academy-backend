const pool = require('../config/database');

const getQuizByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const quiz = await pool.query('SELECT * FROM quizzes WHERE lesson_id = $1', [lessonId]);
    if (quiz.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    
    const questions = await pool.query('SELECT * FROM quiz_questions WHERE quiz_id = $1', [quiz.rows[0].id]);
    res.json({ quiz: quiz.rows[0], questions: questions.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const questionsResult = await pool.query('SELECT * FROM quiz_questions WHERE quiz_id = $1', [quizId]);
    const questions = questionsResult.rows;
    let correctCount = 0;

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question && question.correct_answer === answer.userAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const quizResult = await pool.query('SELECT * FROM quizzes WHERE id = $1', [quizId]);
    const passingScore = quizResult.rows[0].passing_score;
    const isPassed = score >= passingScore;

    await pool.query(
      'INSERT INTO user_progress (user_id, quiz_id, quiz_score, is_completed) VALUES ($1, $2, $3, $4)',
      [req.userId, quizId, score, isPassed]
    );

    res.json({ score, passed: isPassed, correctAnswers: correctCount, totalQuestions: questions.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createQuiz = async (req, res) => {
  try {
    const { lessonId, title, description, passingScore, questions } = req.body;
    const quizResult = await pool.query(
      'INSERT INTO quizzes (lesson_id, title, description, passing_score) VALUES ($1, $2, $3, $4) RETURNING id',
      [lessonId, title, description, passingScore]
    );

    const quizId = quizResult.rows[0].id;
    for (const question of questions) {
      await pool.query(
        'INSERT INTO quiz_questions (quiz_id, question, question_type, options, correct_answer, explanation) VALUES ($1, $2, $3, $4, $5, $6)',
        [quizId, question.question, question.type, JSON.stringify(question.options), question.correctAnswer, question.explanation]
      );
    }

    res.status(201).json({ message: 'Created', quizId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getQuizByLesson, submitQuiz, createQuiz };