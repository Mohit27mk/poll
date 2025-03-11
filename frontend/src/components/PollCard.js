import React from "react";
import { Link } from "react-router-dom";

const PollCard = ({ poll }) => {
  return (
    <div className="poll-card">
      <h3>{poll.question}</h3>
      <p>Created by: {poll.createdBy?.username}</p>
      <Link to={`/polls/${poll._id}`}>View Poll</Link>
    </div>
  );
};

export default PollCard;
