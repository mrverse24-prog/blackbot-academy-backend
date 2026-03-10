import React, { useState } from 'react';
import '../styles/CourseForm.css';

const CourseForm = ({ token, onCourseCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/courses`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            duration_hours: durationHours || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create course');
        setLoading(false);
        return;
      }

      setSuccess('Course created successfully!');
      setTitle('');
      setDescription('');
      setDurationHours('');
      setLoading(false);
      onCourseCreated(data);
    } catch (err) {
      setError('Connection error');
      setLoading(false);
    }
  };

  return (
    <div className="course-form-container">
      <h2>Create New Course</h2>
      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-group">
          <label>Course Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter course title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter course description"
            rows="4"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Duration (Hours)</label>
          <input
            type="number"
            value={durationHours}
            onChange={(e) => setDurationHours(e.target.value)}
            placeholder="e.g., 10"
            min="0"
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Creating...' : 'Create Course'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default CourseForm;
