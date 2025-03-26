import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaHome, FaNewspaper, FaUsers, FaComments, FaTags, FaCog, FaSignOutAlt, FaPlus } from 'react-icons/fa';
import ThemeContext from '../../context/ThemeContext';
import AuthContext from '../../context/AuthContext';
import PostsList from './PostsList';
import CreatePost from './CreatePost';
import EditPost from './EditPost';
import UsersList from './UsersList';
import CommentsList from './CommentsList';
import Settings from './Settings';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/admin/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className={`w-full md:w-64 md:min-h-screen ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 md:p-6`}>
          <div className="flex justify-between items-center md:block">
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-0 md:mb-6">Admin Dashboard</h2>
            <button className="md:hidden" onClick={() => document.querySelector('.sidebar-menu').classList.toggle('hidden')}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
          
          <nav className="sidebar-menu hidden md:block mt-6 md:mt-0">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/admin" 
                  className={`flex items-center p-2 rounded-md ${isActive('/admin') && !isActive('/admin/posts') && !isActive('/admin/create-post') ? 'bg-blue-600 text-white' : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}`}
                >
                  <FaHome className="mr-3" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/posts" 
                  className={`flex items-center p-2 rounded-md ${isActive('/admin/posts') ? 'bg-blue-600 text-white' : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}`}
                >
                  <FaNewspaper className="mr-3" />
                  Posts
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/create-post" 
                  className={`flex items-center p-2 rounded-md ${isActive('/admin/create-post') ? 'bg-blue-600 text-white' : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}`}
                >
                  <FaPlus className="mr-3" />
                  Create Post
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/users" 
                  className={`flex items-center p-2 rounded-md ${isActive('/admin/users') ? 'bg-blue-600 text-white' : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}`}
                >
                  <FaUsers className="mr-3" />
                  Users
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/comments" 
                  className={`flex items-center p-2 rounded-md ${isActive('/admin/comments') ? 'bg-blue-600 text-white' : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}`}
                >
                  <FaComments className="mr-3" />
                  Comments
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/settings" 
                  className={`flex items-center p-2 rounded-md ${isActive('/admin/settings') ? 'bg-blue-600 text-white' : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}`}
                >
                  <FaCog className="mr-3" />
                  Settings
                </Link>
              </li>
            </ul>
            
            <div className="mt-8 pt-4 border-t border-gray-300 dark:border-gray-700">
              <button 
                onClick={handleLogout}
                className={`flex items-center w-full p-2 rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                <FaSignOutAlt className="mr-3" />
                Logout
              </button>
            </div>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <Routes>
            <Route path="/" element={
              <DashboardHome stats={stats} loading={loading} darkMode={darkMode} />
            } />
            <Route path="/posts" element={<PostsList />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/comments" element={<CommentsList />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const DashboardHome = ({ stats, loading, darkMode }) => {
  if (loading) {
    return (
      <div className="h-64 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Total Posts</h3>
          <p className="text-3xl font-bold mt-2">{stats?.postsCount || 0}</p>
          <div className="mt-2 text-sm text-green-500">
            +{stats?.newPostsThisWeek || 0} this week
          </div>
        </div>
        
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Total Users</h3>
          <p className="text-3xl font-bold mt-2">{stats?.usersCount || 0}</p>
          <div className="mt-2 text-sm text-green-500">
            +{stats?.newUsersThisWeek || 0} this week
          </div>
        </div>
        
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Comments</h3>
          <p className="text-3xl font-bold mt-2">{stats?.commentsCount || 0}</p>
          <div className="mt-2 text-sm text-green-500">
            +{stats?.newCommentsThisWeek || 0} this week
          </div>
        </div>
        
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Page Views</h3>
          <p className="text-3xl font-bold mt-2">{stats?.pageViews || 0}</p>
          <div className="mt-2 text-sm text-green-500">
            +{stats?.pageViewsIncrease || 0}% from last week
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        
        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-start`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getActivityIconBg(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className={darkMode ? 'text-white' : 'text-gray-900'}>
                    {activity.message}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No recent activity
          </p>
        )}
      </div>
    </div>
  );
};

// Helper functions for activity icons
const getActivityIcon = (type) => {
  switch (type) {
    case 'post':
      return <FaNewspaper className="text-white" />;
    case 'user':
      return <FaUsers className="text-white" />;
    case 'comment':
      return <FaComments className="text-white" />;
    default:
      return <FaCog className="text-white" />;
  }
};

const getActivityIconBg = (type) => {
  switch (type) {
    case 'post':
      return 'bg-blue-600';
    case 'user':
      return 'bg-green-600';
    case 'comment':
      return 'bg-purple-600';
    default:
      return 'bg-gray-600';
  }
};

export default Dashboard;