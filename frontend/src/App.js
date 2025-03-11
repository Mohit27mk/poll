import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PollDetails from "./pages/PollDetails";
import { AuthProvider } from "./contexts/AuthContext";
import './index.css'; // or wherever you put the Tailwind directives
import Dashboard from './pages/Dashboard';
import CreatePoll from "./pages/CreatePoll";
import PollResults from "./pages/PollResults";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/polls/:pollId" element={<PollDetails />} />
          <Route path="/register" element={<Register />} />
          <Route
  path="/dashboard"
  element={
      <Dashboard />
  }
/>
<Route path="/create-poll" element={<CreatePoll />} />
<Route path="/results/:pollId" element={<PollResults />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
