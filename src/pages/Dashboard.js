import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import TaskList from "../components/TaskList";
import "../index.css"; 
import TaskAnalytics from "../components/TaskAnalytics";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);




  
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 md:px-8">
   <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Welcome, {user?.name}!</h2>
      <TaskList />
      <TaskAnalytics />

     
        <button onClick={() => { logout(); navigate("/"); }} className="btn">
          Logout
        </button>
      </div>

    
    </div>
  );
};

export default Dashboard;
