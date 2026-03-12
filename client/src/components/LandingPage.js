import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Header/Nav */}
      <header className="landing-header">
        <div className="header-content">
          <h1 className="logo">BLACK BOT ACADEMY</h1>
          <button className="btn-login" onClick={() => navigate('/login')}>Login</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Learn Code. Build Real Skills. No Corporate BS.</h2>
          <p>Master Python, JavaScript, Web Development, and more — taught by real developers who actually know the game.</p>
          <button className="btn-cta" onClick={() => navigate('/login')}>Get Started Free</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h3>What You Get</h3>
        <div className="features-grid">
          <div className="feature-card">
            <h4>📚 Real Curriculum</h4>
            <p>Step-by-step courses built for actual developers. No fluff, just knowledge.</p>
          </div>
          <div className="feature-card">
            <h4>🎯 Hands-On Projects</h4>
            <p>Build real projects. Get a portfolio. Actually learn something.</p>
          </div>
          <div className="feature-card">
            <h4>🏆 Certificates</h4>
            <p>Earn certificates that prove you know what you're doing.</p>
          </div>
          <div className="feature-card">
            <h4>💬 Community</h4>
            <p>Real people. Real feedback. No bots pretending to help.</p>
          </div>
          <div className="feature-card">
            <h4>⚡ Self-Paced</h4>
            <p>Learn on your schedule. No pressure. Real flexibility.</p>
          </div>
          <div className="feature-card">
            <h4>💪 Premium Support</h4>
            <p>Get help when you need it. Actual humans answering questions.</p>
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="courses-preview">
        <h3>Featured Courses</h3>
        <div className="courses-grid">
          <div className="course-card">
            <div className="course-header">Python Basics</div>
            <p>Start from zero. Learn Python fundamentals the right way.</p>
            <span className="price">Free</span>
          </div>
          <div className="course-card">
            <div className="course-header">JavaScript Mastery</div>
            <p>Build interactive web apps. Become a real JavaScript developer.</p>
            <span className="price">$49</span>
          </div>
          <div className="course-card">
            <div className="course-header">Full Stack Development</div>
            <p>Frontend + Backend + Database. Build complete applications.</p>
            <span className="price">$99</span>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="social-proof">
        <div className="proof-card">
          <h4>500+</h4>
          <p>Students Learning</p>
        </div>
        <div className="proof-card">
          <h4>20+</h4>
          <p>Active Courses</p>
        </div>
        <div className="proof-card">
          <h4>95%</h4>
          <p>Completion Rate</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <h2>Ready to Level Up?</h2>
        <p>Join hundreds of developers building real skills.</p>
        <button className="btn-cta-large" onClick={() => navigate('/login')}>Start Learning Free</button>
        <p className="cta-subtext">No credit card required. Full access to free courses.</p>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 Black Bot Academy. Built by real developers, for real developers.</p>
      </footer>
    </div>
  );
}
