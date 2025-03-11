import React, { useEffect, useState } from 'react';
import API from '../services/api'; // Axios instance
import { useAuth } from '../contexts/AuthContext';
// Update with your backend URL
import { useSocket } from '../contexts/socketContext.js';

const PollComments = ({ pollId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
    const socket = useSocket();
  
  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await API.get(`/comments/${pollId}`);
        console.log('Comments fetched:', res.data.data);
        setComments(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch comments', err);
      }
    };

    fetchComments();
  }, [pollId]);

  useEffect(() => {
    if (!pollId) return;

    // Join the poll's room to listen for events specific to it
    socket.emit('joinPoll', pollId);

    // Listen for new comments and update state
    socket.on('newComment', (comment) => {
        console.log('Received new comment:', comment);
        setComments((prevComments) => {
          const updatedComments = [comment, ...prevComments];
         
          return updatedComments;
        });
      });
      

    // Clean up on unmount
    return () => {
      socket.emit('leavePoll', pollId);
      socket.off('newComment');
    };
  }, [pollId]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await API.post(`/comments/${pollId}`, { text: newComment });
      setNewComment('');
      // The socket will update the UI when the comment is received.
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };

  

 

  return (
    <div className="mt-8 bg-white p-6 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      {/* New Comment Input */}
      {user ? (
        <div className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border rounded p-2 mb-2"
          />
          <button
            onClick={handleCommentSubmit}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Post Comment
          </button>
        </div>
      ) : (
        <p className="text-gray-500">Please log in to comment.</p>
      )}

      {/* Comments List */}
      <div>
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="mb-4">
              <p className="text-gray-800">
                <strong>{comment.user?.username || 'Anonymous'}:</strong> {comment.text}
              </p>
              <p className="text-xs text-gray-400 mb-2">{new Date(comment.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PollComments;
