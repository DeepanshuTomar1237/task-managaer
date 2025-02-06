import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';  
import { Link } from 'react-router-dom';  
import useFetch from '../hooks/useFetch';  
import Loader from './utils/Loader';  
import Tooltip from './utils/Tooltip';  
const Tasks = () => {

  const authState = useSelector(state => state.authReducer);  // Access Redux state for authentication status and token
  const [tasks, setTasks] = useState([]);  
  const [fetchData, { loading }] = useFetch();  
  // Callback to fetch tasks from the API
  const fetchTasks = useCallback(() => {
    const config = { url: "/tasks", method: "get", headers: { Authorization: authState.token } };
    fetchData(config, { showSuccessToast: false }).then(data => setTasks(data.tasks));  // Update tasks state with fetched data
  }, [authState.token, fetchData]);

  // Fetch tasks when the component mounts and the user is logged in
  useEffect(() => {
    if (!authState.isLoggedIn) return;  // Don't fetch if the user is not logged in
    fetchTasks();  // Call the fetchTasks function
  }, [authState.isLoggedIn, fetchTasks]);

  // Handle task deletion
  const handleDelete = (id) => {
    const config = { url: `/tasks/${id}`, method: "delete", headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchTasks());  // Re-fetch tasks after deletion
  };

  // Get task status based on due date
  const getTaskStatus = (dueDate) => {
    const today = new Date();
    const taskDueDate = new Date(dueDate);
    if (taskDueDate < today) return 'Overdue';  // Task is overdue
    else if (taskDueDate.toDateString() === today.toDateString()) return 'Present';  // Task is due today
    else return 'Future';  // Task is due in the future
  };

  return (
    <div className="my-2 mx-auto max-w-[700px] py-4">
      {tasks.length !== 0 && <h2 className='my-2 ml-2 md:ml-0 text-xl'>Your tasks ({tasks.length})</h2>}
      
      {loading ? (
        <Loader />  
      ) : (
        <div>
          {tasks.length === 0 ? (
            <div className='w-[600px] h-[300px] flex items-center justify-center gap-4'>
              <span>No tasks found</span>
              <Link to="/tasks/add" className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2">+ Add new task </Link>  {/* Link to add a new task */}
            </div>
          ) : (
            // Map through tasks and display each one
            tasks.map((task, index) => (
              <div key={task._id} className='bg-white my-4 p-4 text-gray-600 rounded-md shadow-md'>
                <div className='flex'>
                  <span className='font-medium'>Task #{index + 1}</span>
                  <span className={`ml-2 text-sm ${getTaskStatus(task.dueDate) === 'Overdue' ? 'text-red-600' : getTaskStatus(task.dueDate) === 'Present' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {getTaskStatus(task.dueDate)}  {/* Display task status */}
                  </span>

                  {/* Edit button with Tooltip */}
                  <Tooltip text={"Edit this task"} position={"top"}>
                    <Link to={`/tasks/${task._id}`} className='ml-auto mr-2 text-green-600 cursor-pointer'>
                      <i className="fa-solid fa-pen"></i> 
                    </Link>
                  </Tooltip>

                  {/* Delete button with Tooltip */}
                  <Tooltip text={"Delete this task"} position={"top"}>
                    <span className='text-red-500 cursor-pointer' onClick={() => handleDelete(task._id)}>
                      <i className="fa-solid fa-trash"></i>  
                    </span>
                  </Tooltip>
                </div>

                <div className='whitespace-pre'>{task.description}</div>  {/* Task description */}

                <div className="text-sm mt-2">
                  <strong>Priority:</strong> {task.priority} |  
                  <strong> Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}  
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Tasks;
