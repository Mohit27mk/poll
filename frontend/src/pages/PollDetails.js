import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api';
import PollComments from './PollComments';

const PollDetails = () => {
  const { pollId } = useParams();
  const { user } = useAuth(); // Optional: get logged-in user (or not if open)
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');
  const [voted, setVoted] = useState(false);

  // Fetch poll details
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await API.get(`/polls/${pollId}`);
        console.log('Poll fetched:', res.data);
        setPoll(res.data?.data || res.data); // depends on your API
      } catch (err) {
        console.error(err);
        setError('Poll not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [pollId]);

  const handleVote = async () => {
    if (!selectedOption) {
      alert('Please select an option.');
      return;
    }

    setVoting(true);

    try {
      const res = await API.post(`/polls/${pollId}/vote`, {
        optionIndex: selectedOption,
      });

      console.log('Vote response:', res.data);
      setPoll(res.data?.data || res.data); // Update poll with latest votes
      setVoted(true);
    } catch (err) {
      console.error('Error voting:', err);
      setError('Failed to submit vote.');
    } finally {
      setVoting(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading poll...</div>;

  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  if (!poll) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">{poll.question}</h2>

        {poll.options.map((option, index) => (
          <div key={index} className="mb-2">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="pollOption"
                value={option._id}
                checked={selectedOption === option._id}
                onChange={() => setSelectedOption(option._id)}
                className="h-4 w-4 text-indigo-600"
              />
              <span className="text-gray-700">{option.text}</span>
            </label>
          </div>
        ))}

        <button
          onClick={handleVote}
          disabled={voting}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {voting ? 'Voting...' : 'Submit Vote'}
        </button>

        {voted && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Results:</h3>
            {poll.options.map((option, index) => {
              const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
              const votePercentage = totalVotes
                ? ((option.votes / totalVotes) * 100).toFixed(1)
                : 0;

              return (
                <div key={index} className="mb-2">
                  <div className="flex justify-between">
                    <span>{option.text}</span>
                    <span>{votePercentage}% ({option.votes} votes)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded"
                      style={{ width: `${votePercentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

<div className="bg-white shadow rounded p-6 mt-8">
  <PollComments pollId={pollId} />
</div>


        <button
          onClick={() => navigate(-1)}
          className="mt-6 text-sm text-indigo-600 hover:underline"
        >
          &larr; Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PollDetails;
