import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import TaskForm from "./TaskForm";

const TaskList = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const BASE_URL = process.env.REACT_APP_API_URL;

  const fetchTasks = async () => {
    const res = await fetch(`${BASE_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = await res.json();
    setTasks(data);
    setEditingTask(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await fetch(`${BASE_URL}/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    fetchTasks();
  };

  const handleEdit = (task) => setEditingTask(task);

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <TaskForm editingTask={editingTask} onFinishEdit={fetchTasks} />
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Your Tasks</h3>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task._id} className="border rounded p-3 flex flex-col md:flex-row justify-between gap-2">
                <div>
                  <h4 className="font-semibold">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <p className="text-xs text-gray-500">
                    {task.category} | Due: {task.dueDate?.split("T")[0]} | Priority: {task.priority}
                  </p>
                </div>
                <div className="flex gap-2 justify-end md:justify-start">
                  <button onClick={() => handleEdit(task)} className="text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(task._id)} className="text-red-500 hover:underline">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskList;
