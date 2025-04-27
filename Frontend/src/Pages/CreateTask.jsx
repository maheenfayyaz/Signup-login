import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const initialTasks = {
  todo: [
    { id: '1', title: 'Sample Task 1', description: 'Description 1', assignedTo: 'todo' },
  ],
  inprogress: [
    { id: '2', title: 'Sample Task 2', description: 'Description 2', assignedTo: 'inprogress' },
  ],
  done: [
    { id: '3', title: 'Sample Task 3', description: 'Description 3', assignedTo: 'done' },
  ],
};

const assignedToOptions = ['todo', 'inprogress', 'done'];

const CreateTask = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: 'todo',
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', assignedTo: 'todo' });
    setEditingTask(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignedToChange = (e) => {
    setFormData((prev) => ({ ...prev, assignedTo: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      const newTasks = { ...tasks };
      for (const status in newTasks) {
        newTasks[status] = newTasks[status].map((task) =>
          task.id === editingTask.id ? { ...task, ...formData } : task
        );
      }
      setTasks(newTasks);
    } else {
      const newTask = {
        id: Date.now().toString(),
        ...formData,
      };
      setTasks((prev) => ({
        ...prev,
        [formData.assignedTo]: [newTask, ...prev[formData.assignedTo]],
      }));
    }
    resetForm();
    setShowForm(false);
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
    const destinationList = Array.from(tasks[destination.droppableId]);
    destinationList.splice(destination.index, 0, movedTask);
  
    setTasks((prev) => ({
      ...prev,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList,
    }));
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
    });
    setShowForm(true);
  };

  const handleDelete = (taskId) => {
    const newTasks = {};
    for (const status in tasks) {
      newTasks[status] = tasks[status].filter((task) => task.id !== taskId);
    }
    setTasks(newTasks);
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
            <select
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleAssignedToChange}
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            >
              {assignedToOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
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
                    <Draggable draggableId={task.id} index={index} key={task.id}>
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
                              onClick={() => handleDelete(task.id)}
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
