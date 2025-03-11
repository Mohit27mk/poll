import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api'; // Axios instance
import { useSocket } from '../contexts/socketContext.js';



const PollResults = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch poll data once
  useEffect(() => {
    const fetchPollResults = async () => {
      try {
        const res = await API.get(`/polls/${pollId}`);
        setPoll(res.data?.data || res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load poll results.');
      } finally {
        setLoading(false);
      }
    };

    fetchPollResults();
  }, [pollId]);

  // Handle socket connection & vote updates
  useEffect(() => {
    if (!pollId) return;

    // Join the poll room
    socket.emit('joinPoll', pollId);

    // Listen for vote updates
    socket.on('voteUpdate', (updatedPoll) => {
      console.log('Received vote update:', updatedPoll);
      setPoll(updatedPoll); // Updates poll with real-time data
    });

    return () => {
      socket.emit('leavePoll', pollId); // Optional room leaving
      socket.off('voteUpdate');
    };
  }, [pollId]);

  if (loading) return <div>Loading results...</div>;
  if (error) return <div>{error}</div>;
  if (!poll) return null;

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">Poll Results</h2>

        <h3 className="text-lg font-semibold text-gray-800 mb-6">{poll.question}</h3>

        {poll.options.map((option) => {
          const votePercentage = totalVotes
            ? ((option.votes / totalVotes) * 100).toFixed(1)
            : 0;

          return (
            <div key={option._id} className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">{option.text}</span>
                <span className="text-gray-600">
                  {votePercentage}% ({option.votes} votes)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded h-3">
                <div
                  className="bg-indigo-500 h-3 rounded"
                  style={{ width: `${votePercentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}

        <div className="text-sm text-gray-500 mt-6">
          Total Votes: <strong>{totalVotes}</strong>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default PollResults;
