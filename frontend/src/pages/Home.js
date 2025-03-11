import React, { useState, useEffect } from "react";
import API from "../services/api";
import PollCard from "../components/PollCard";

const Home = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      const res = await API.get("/polls");
      setPolls(res.data);
    };
    fetchPolls();
  }, []);

  return (
    <div>
      <h2>Available Polls</h2>
      {polls.map((poll) => (
        <PollCard key={poll._id} poll={poll} />
      ))}
    </div>
  );
};

export default Home;
