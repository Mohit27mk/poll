import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // No redirect, just fetch polls (even if not logged in)
  useEffect(() => {
    const fetchPolls = async () => {
        try {
          const res = await API.get('/polls');
          console.log('API response:', res.data);
      
          // Check if it's an array or an object with a data field
          console.log('Is array?', Array.isArray(res.data));
          const fetchedPolls = Array.isArray(res.data)
            ? res.data
            : res.data?.data || [];
      console.log('Fetched polls:', fetchedPolls);
          setPolls(fetchedPolls);
        } catch (error) {
          console.error('Error fetching polls:', error);
          setPolls([]); // Ensure it's always an array
        } finally {
          setLoading(false);
        }
      };

    fetchPolls();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreatePoll = () => {
    

    navigate('/create-poll');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-indigo-600">Poll Dashboard</h1>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-600">{user.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Available Polls</h2>
          <button
            onClick={handleCreatePoll}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create New Poll
          </button>
        </div>

        {loading ? (
          <div className="text-center">Loading polls...</div>
        ) : polls.length === 0 ? (
          <div className="text-center text-gray-500">No polls available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => (
              <div
                key={poll._id}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {poll.question}
                </h3>
                {/* <p className="text-sm text-gray-500 mb-1">
                  Created by: {poll.creator?.email || 'Unknown'}
                </p> */}
                <p className="text-xs text-gray-400 mb-4">
                  {new Date(poll.createdAt).toLocaleDateString()}
                </p>
                <div className="flex justify-between">
                  <Link
                    to={`/polls/${poll._id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    View & Vote
                  </Link>
                  <Link
                    to={`/results/${poll._id}`}
                    className="text-green-600 hover:text-green-800 text-sm"
                  >
                    View Results
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
