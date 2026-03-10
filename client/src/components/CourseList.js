import React, { useState, useEffect } from 'react';
import '../styles/CourseList.css';

const CourseList = ({ token, refreshTrigger }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [refreshTrigger]);

  const fetchCourses = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/courses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load courses');
        setLoading(false);
        return;
      }

      setCourses(data);
      setLoading(false);
    } catch (err) {
      setError('Connection error');
      setLoading(false);
    }
  };

  if (loading) return <div className="course-list-container">Loading courses...</div>;
  if (error) return <div className="course-list-container error-message">{error}</div>;

  return (
    <div className="course-list-container">
      <h2>All Courses</h2>
      {courses.length === 0 ? (
        <p className="no-courses">No courses created yet.</p>
      ) : (
        <div className="courses-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Duration (Hours)</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.description || 'N/A'}</td>
                  <td>{course.duration_hours || 'N/A'}</td>
                  <td>{new Date(course.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseList;
