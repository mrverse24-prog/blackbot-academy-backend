import React, { useState, useEffect } from 'react';
import '../styles/CourseList.css';

const CourseList = ({ token, refreshTrigger }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, [refreshTrigger]);

  const fetchCourses = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/courses`,
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

  const handleEdit = (course) => {
    setEditingId(course.id);
    setEditData({
      title: course.title,
      description: course.description,
      duration_hours: course.duration_hours,
    });
  };

  const handleSaveEdit = async (courseId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/courses/${courseId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to update course');
        return;
      }

      setCourses(courses.map(c => c.id === courseId ? data : c));
      setEditingId(null);
      setEditData({});
    } catch (err) {
      alert('Connection error');
    }
  };

  const handleDelete = async (courseId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/courses/${courseId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to delete course');
        return;
      }

      setCourses(courses.filter(c => c.id !== courseId));
      setDeleteConfirm(null);
    } catch (err) {
      alert('Connection error');
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  {editingId === course.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <textarea
                          value={editData.description || ''}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          className="edit-textarea"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editData.duration_hours || ''}
                          onChange={(e) => setEditData({ ...editData, duration_hours: e.target.value })}
                          className="edit-input"
                        />
                      </td>
                      <td>{new Date(course.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleSaveEdit(course.id)}
                          className="save-btn"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{course.title}</td>
                      <td>{course.description || 'N/A'}</td>
                      <td>{course.duration_hours || 'N/A'}</td>
                      <td>{new Date(course.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleEdit(course)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(course.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                        {deleteConfirm === course.id && (
                          <div className="delete-confirm">
                            <p>Sure?</p>
                            <button
                              onClick={() => handleDelete(course.id)}
                              className="confirm-delete-btn"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="cancel-delete-btn"
                            >
                              No
                            </button>
                          </div>
                        )}
                      </td>
                    </>
                  )}
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
