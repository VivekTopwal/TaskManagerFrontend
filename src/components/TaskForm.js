import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const TaskForm = ({ editingTask, onFinishEdit }) => {
  const { user } = useContext(AuthContext);

  const [task, setTask] = useState({
    title: "",
    description: "",
    category: "",
    dueDate: "",
    priority: "Medium",
  });

  const BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (editingTask) {
      setTask({
        ...editingTask,
        dueDate: editingTask.dueDate?.split("T")[0], // format date input
      });
    }
  }, [editingTask]);

  const handleChange = (e) => setTask({ ...task, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingTask
      ? `${BASE_URL}/api/tasks/${editingTask._id}`
      : `${BASE_URL}/api/tasks`;
    const method = editingTask ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(task),
    });

    const data = await res.json();
    if (res.ok) {
      setTask({ title: "", description: "", category: "", dueDate: "", priority: "Medium" });
      onFinishEdit(); // refresh task list in parent
    } else {
      alert(data.message || "Error submitting task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">{editingTask ? "Edit Task" : "Add New Task"}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input name="title" placeholder="Title" value={task.title} onChange={handleChange} className="input" required />
        <input name="category" placeholder="Category" value={task.category} onChange={handleChange} className="input" />
        <input name="dueDate" type="date" value={task.dueDate} onChange={handleChange} className="input" />
        <select name="priority" value={task.priority} onChange={handleChange} className="input">
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <textarea name="description" placeholder="Description" value={task.description} onChange={handleChange} className="input col-span-2" />
      </div>
      <button type="submit" className="btn mt-3">
        {editingTask ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;
