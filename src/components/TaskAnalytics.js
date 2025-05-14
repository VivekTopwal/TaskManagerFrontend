import React, { useEffect, useState, useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { AuthContext } from "../context/AuthContext";

const TaskAnalytics = () => {
  const { user } = useContext(AuthContext);
  const [chartData, setChartData] = useState([]);

  const BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user?.token) return;

      try {
        const res = await fetch(`${BASE_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch tasks");

        const data = await res.json();
        const counts = { High: 0, Medium: 0, Low: 0 };

        data.forEach((task) => {
          if (counts.hasOwnProperty(task.priority)) counts[task.priority]++;
        });

        setChartData([
          { name: "High", value: counts.High },
          { name: "Medium", value: counts.Medium },
          { name: "Low", value: counts.Low },
        ]);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [user?.token]);

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h3 className="text-lg font-semibold mb-4">📊 Task Priority Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskAnalytics;