import React, { useState, useEffect } from 'react';
import CourseForm from './CourseForm';
import CourseList from './CourseList';
import '../styles/AdminDashboard.css';

const AdminDashboard = ({ token, onLogout }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshCourses, setRefreshCourses] = useState(0);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load dashboard');
        setLoading(false);
        return;
      }

      setDashboardData(data);
      setLoading(false);
    } catch (err) {
      setError('Connection error');
      setLoading(false);
    }
  };

  const handleCourseCreated = (newCourse) => {
    setRefreshCourses(refreshCourses + 1);
    fetchDashboard();
  };

  if (loading) return <div className="dashboard">Loading...</div>;
  if (error) return <div className="dashboard error-message">{error}</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Black Bot Admin Dashboard</h1>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{dashboardData?.totalUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Courses</h3>
          <p className="stat-number">{dashboardData?.totalCourses || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Enrollments</h3>
          <p className="stat-number">{dashboardData?.totalEnrollments || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Premium Users</h3>
          <p className="stat-number">{dashboardData?.premiumUsers || 0}</p>
        </div>
      </div>

      <CourseForm token={token} onCourseCreated={handleCourseCreated} />
      <CourseList token={token} refreshTrigger={refreshCourses} />
    </div>
  );
};

export default AdminDashboard;
