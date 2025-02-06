import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; 
import { Link } from 'react-router-dom'; 
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader'; 
import Tooltip from './utils/Tooltip'; 

const Tasks = () => {
  // Accessing the auth state from Redux to get user authentication info
  const authState = useSelector((state) => state.authReducer);
  
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    description: '',
    dueDate: '',
    priority: 'Medium',
  });
  
  
  const [fetchData, { loading }] = useFetch();

  // Function to fetch all tasks for the logged-in user
  const fetchTasks = useCallback(() => {
    const config = { 
      url: '/tasks', 
      method: 'get', 
      headers: { Authorization: authState.token } 
    };
    // Calling fetchData hook with the config and updating the tasks state with the fetched tasks
    fetchData(config, { showSuccessToast: false }).then((data) => setTasks(data.tasks));
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return; 
    fetchTasks(); 
  }, [authState.isLoggedIn, fetchTasks]);

  const handleDelete = (id) => {
    const config = { 
      url: `/tasks/${id}`, 
      method: 'delete', 
      headers: { Authorization: authState.token } 
    };
    
    fetchData(config).then(() => fetchTasks());
  };

  
  const handleAddTask = () => {
    const config = {
      url: '/tasks', 
      method: 'post', 
      headers: { Authorization: authState.token }, 
      data: newTask 
    };
    // Make the POST request, reset the new task form, and re-fetch tasks
    fetchData(config).then(() => {
      setNewTask({ description: '', dueDate: '', priority: 'Medium' });
      fetchTasks();
    });
  };

  // Function to determine the status of the task based on its due date
  const getTaskStatus = (dueDate) => {
    const today = new Date();
    const taskDueDate = new Date(dueDate);
    
    if (taskDueDate < today) return 'Overdue';
    else if (taskDueDate.toDateString() === today.toDateString()) return 'Present';
    return 'Future';
  };

  return (
    <div className="my-2 mx-auto max-w-[700px] py-4">
      <h2 className="my-2 ml-2 md:ml-0 text-xl">Your tasks ({tasks.length})</h2>
      
      {loading ? (
        <Loader />
      ) : (
        <div>
          {/* Form to add a new task */}
          <div className="bg-white p-4 mb-6 rounded-md shadow-md">
            <h3 className="text-lg font-medium mb-4">Add New Task</h3>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Task Description</label>
              <textarea
                className="w-full border rounded-md px-3 py-2"
                rows="3"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="datetime-local"
                className="w-full border rounded-md px-3 py-2"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <button
              className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2"
              onClick={handleAddTask}
            >
              Add Task
            </button>
          </div>

          {/* Displaying all the tasks */}
          {tasks.map((task, index) => (
            <div key={task._id} className="bg-white my-4 p-4 text-gray-600 rounded-md shadow-md">
              <div className="flex">
                <span className="font-medium">Task #{index + 1}</span>
                
                <span
                  className={`ml-2 text-sm ${
                    getTaskStatus(task.dueDate) === 'Overdue'
                      ? 'text-red-600'
                      : getTaskStatus(task.dueDate) === 'Present'
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {getTaskStatus(task.dueDate)}
                </span>

                {/* Tooltip and icons for edit and delete actions */}
                <Tooltip text="Edit this task" position="top">
                  <Link to={`/tasks/${task._id}`} className="ml-auto mr-2 text-green-600 cursor-pointer">
                    <i className="fa-solid fa-pen"></i>
                  </Link>
                </Tooltip>

                <Tooltip text="Delete this task" position="top">
                  <span className="text-red-500 cursor-pointer" onClick={() => handleDelete(task._id)}>
                    <i className="fa-solid fa-trash"></i>
                  </span>
                </Tooltip>
              </div>
              <div className="whitespace-pre">{task.description}</div>
              <div className="text-sm mt-2">
                <strong>Priority:</strong> {task.priority} |{' '}
                <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
