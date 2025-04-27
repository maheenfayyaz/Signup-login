import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const initialTasks = {
  todo: [],
  inprogress: [],
  done: [],
};

const CreateTask = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'To Do',
  });

  const token = localStorage.getItem('token');
  const apiUrl = import.meta.env.VITE_API_TASK_BASE_URL;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const tasksData = response.data;
      const groupedTasks = { todo: [], inprogress: [], done: [] };
      if (Array.isArray(tasksData)) {
        tasksData.forEach((task) => {
          if (task.status === 'To Do') groupedTasks.todo.push(task);
          else if (task.status === 'In Progress') groupedTasks.inprogress.push(task);
          else if (task.status === 'Completed') groupedTasks.done.push(task);
        });
      } else {
        console.error('Expected an array but got:', tasksData);
      }
      setTasks(groupedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', assignedTo: '', status: 'To Do' });
    setEditingTask(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await axios.put(`${apiUrl}/update/${editingTask._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(`${apiUrl}/create`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      resetForm();
      setShowForm(false);
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceList = Array.from(tasks[source.droppableId]);
    const [movedTask] = sourceList.splice(source.index, 1);
    movedTask.status =
      destination.droppableId === 'todo'
        ? 'To Do'
        : destination.droppableId === 'inprogress'
        ? 'In Progress'
        : 'Completed';
    const destinationList = Array.from(tasks[destination.droppableId]);
    destinationList.splice(destination.index, 0, movedTask);

    const newTasks = {
      ...tasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList,
    };
    setTasks(newTasks);

    axios
      .put(
        `${apiUrl}/update/${movedTask._id}`,
        {
          title: movedTask.title,
          description: movedTask.description,
          assignedTo: movedTask.assignedTo,
          status: movedTask.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch((error) => {
        console.error('Error updating task status:', error);
      });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      status: task.status || 'To Do',
    });
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`${apiUrl}/delete/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
      <h1>Task Board</h1>
      <button
        onClick={() => {
          setShowForm((prev) => !prev);
          if (showForm) resetForm();
        }}
        style={{
          marginBottom: '1rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {showForm ? 'Cancel' : editingTask ? 'Edit Task' : 'Create New Task'}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: '2rem',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="assignedTo" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Assigned To
            </label>
            <input
              type="text"
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="status" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button
            type="submit"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {editingTask ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
          }}
        >
          {['todo', 'inprogress', 'done'].map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    flex: '1 1 0',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '1rem',
                    minHeight: '300px',
                    backgroundColor: '#f9f9f9',
                    boxSizing: 'border-box',
                    overflowY: 'auto',
                    maxHeight: '80vh',
                  }}
                >
                  <h2 style={{ textTransform: 'capitalize' }}>
                    {status === 'todo'
                      ? 'To Do'
                      : status === 'inprogress'
                      ? 'In Progress'
                      : 'Done'}
                  </h2>
                  {tasks[status].length === 0 && <p>No tasks</p>}
                  {tasks[status].map((task, index) => (
                    <Draggable draggableId={task._id} index={index} key={task._id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            backgroundColor: '#fff',
                            padding: '0.75rem',
                            marginBottom: '0.75rem',
                            borderRadius: '6px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            ...provided.draggableProps.style,
                            cursor: 'default',
                          }}
                        >
                          <h3>{task.title}</h3>
                          <p>{task.description}</p>
                          <p>
                            <strong>Assigned To:</strong> {task.assignedTo}
                          </p>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => handleEdit(task)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                backgroundColor: '#ffc107',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(task._id)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                backgroundColor: '#dc3545',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default CreateTask;
