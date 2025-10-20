import React, { useState, useEffect, useContext } from 'react';
import { ElderlyContext } from '../context/context'; // Adjust path if needed

const Tasks = () => {
  // --- Context Integration ---
  const { user, getTasks, addTasks, error: contextError } = useContext(ElderlyContext);

  // --- State ---
  const [tasksList, setTasksList] = useState([]);
  const [localError, setLocalError] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', time: '' }); // Matches backend: title, time

  // --- Fetch Tasks on Mount ---
  useEffect(() => {
    const fetchTasks = async () => {
      setLocalError(null);
      try {
        const fetchedTasks = await getTasks();
        // Ensure backend returns an array
        setTasksList(Array.isArray(fetchedTasks) ? fetchedTasks : []);
      } catch (err) {
        setLocalError('Failed to load tasks.');
        console.error(err);
      }
    };

    if (user) { // Only fetch if user is loaded
      fetchTasks();
    }
  }, [user, getTasks]); // Refetch if user or function changes

  // --- Handlers ---
  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.time) {
      setLocalError('Please enter both a task title and time.');
      return;
    }
    setLocalError(null);
    try {
      await addTasks(newTask);
      setNewTask({ title: '', time: '' }); // Clear form
      // Refetch tasks list
      const updatedTasks = await getTasks();
      setTasksList(Array.isArray(updatedTasks) ? updatedTasks : []);
    } catch (err) {
      setLocalError('Failed to add task.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Scheduled Tasks
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'family' ? 'Add and manage scheduled tasks' : 'View upcoming tasks'}
          </p>
        </div>

        {/* Error Display */}
        {(localError || contextError) && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{localError || contextError}</span>
          </div>
        )}

        {/* Add Task Form (Family Only) */}
        {user?.role === 'family' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">Add New Task</h2>
            <form onSubmit={handleAddTask} className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
              <div>
                <label htmlFor="title" className="block mb-1 font-medium text-gray-700 text-sm">Task Description</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Blood Pressure Check"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label htmlFor="time" className="block mb-1 font-medium text-gray-700 text-sm">Time</label>
                <input
                  // Using 'text' allows flexible time formats like "9:00 AM" or "Evening"
                  // Use 'time' if you strictly want HH:MM format
                  type="text"
                  id="time"
                  name="time"
                  value={newTask.time}
                  onChange={handleInputChange}
                  placeholder="e.g., 9:00 AM, Afternoon"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2.5 rounded-lg font-semibold hover:shadow-md transition-all duration-200"
              >
                Add Task
              </button>
            </form>
          </div>
        )}

        {/* Task List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
           <h2 className="text-xl font-semibold text-gray-800 p-4 border-b">
             Task Schedule
           </h2>
          <ul className="divide-y divide-gray-200">
            {tasksList && tasksList.length > 0 ? (
              tasksList.map((task, index) => (
                <li
                  key={task._id || `task-${index}`} // Use _id if available
                  // Removed urgent styling, add back if your backend provides 'urgent' field
                  className="p-5 transition-all bg-white hover:bg-gray-50"
                >
                  <div className="flex items-start">
                    {/* Task Info - using 'title' and 'time' from backend */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">{task.time || 'N/A'}</span>
                        {/* Optional: Add Urgent flag display if backend provides it */}
                        {/* {task.urgent && (
                           <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded">URGENT</span>
                        )} */}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mt-1">{task.title || 'No Title'}</h3>
                      {/* Optional: Add patient name if backend provides it */}
                      {/* <p className="text-gray-600 mt-1">Patient: {task.patient}</p> */}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-5 text-center text-gray-500">No tasks scheduled yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Tasks;