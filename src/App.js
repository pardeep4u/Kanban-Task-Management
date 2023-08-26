import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";

const columns = {
  todo: {
    id: "todo",
    title: "To-Do",
  },
  doing: {
    id: "doing",
    title: "Doing",
  },
  done: {
    id: "done",
    title: "Done",
  },
};

const initialItems = [
  {
    id: "item-1",
    heading: "force1",
    content:
      "This is just to see how this will work Now I will add more content to it",
    column: "todo",
  },
  {
    id: "item-2",
    heading: "force1",
    content:
      "This is just to see how this will work Now I will add more content to it",
    column: "todo",
  },
  {
    id: "item-3",
    heading: "force1",
    content:
      "This is just to see how this will work Now I will add more content to it",
    column: "doing",
  },
  {
    id: "item-4",
    heading: "force1",
    content:
      "This is just to see how this will work Now I will add more content to it",
    column: "done",
  },
];

function App() {
  const [items, setItems] = useState(initialItems);
  const [newHeading, setNewHeading] = useState("");
  const [newTask, setNewTask] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTaskId, setEditedTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState("");

  const handleEditTask = (taskId, taskTitle) => {
    setIsEditing(true);
    setEditedTaskId(taskId);
    setEditedTaskTitle(taskTitle);
  };

  const handleSaveChanges = () => {
    const updatedItems = items.map((item) => {
      if (item.id === editedTaskId) {
        return {
          ...item,
          content: editedTaskTitle,
        };
      }
      return item;
    });

    setItems(updatedItems);
    setIsEditing(false);
    setEditedTaskId(null);
    setEditedTaskTitle("");
  };

  const handleClosePopup = () => {
    setIsEditing(false);
    setEditedTaskId(null);
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newItems = [...items];
    const movedItem = newItems.find((item) => item.id === draggableId);
    movedItem.column = destination.droppableId;

    if (destination.droppableId !== source.droppableId) {
      newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, movedItem);
      console.log(newItems);
      setItems(newItems);
    } else {
      newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, movedItem);
      setItems(newItems);
      console.log(newItems);
    }
  };

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      const newItem = {
        id: `item-${Date.now()}`, // Using a timestamp to ensure unique IDs
        content: newTask,
        heading: newHeading,
        column: "todo",
      };
      setItems([...items, newItem]);
      setNewTask("");
      setNewHeading("");
    }
  };

  const handleDeleteTask = (taskId) => {
    const updatedItems = items.filter((item) => item.id !== taskId);
    setItems(updatedItems);
  };

  return (
    <div className="App">
      <h1>Task Board</h1>
      <div className="add-task">
        <input
          type="text"
          value={newHeading}
          onChange={(e) => setNewHeading(e.target.value)}
          placeholder="Add a new title"
        />
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={handleAddTask}>Add</button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="columns-container">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="column">
              <h2>{column.title}</h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="task-list"
                  >
                    {items.map((item, index) => {
                      if (item.column === column.id) {
                        return (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className="task"
                              >
                                <div className="content">
                                  <div className="headings">{item.heading}</div>
                                  <div>{item.content}</div>
                                </div>
                                <div>
                                  <button
                                    onClick={() => handleDeleteTask(item.id)}
                                    className="deleteButton"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    onClick={() => handleEditTask(item.id)}
                                    className="deleteButton"
                                  >
                                    Edit
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      }
                      return null;
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {isEditing && (
        <div className="popup">
          <div className="popupContent">
            <h2>Edit Task</h2>
            <input
              type="text"
              value={editedTaskTitle}
              onChange={(e) => setEditedTaskTitle(e.target.value)}
              className="popupinput"
            />
            <button
              onClick={handleSaveChanges}
              className="saveButton deleteButton"
            >
              Save Changes
            </button>
            <button
              onClick={handleClosePopup}
              className="closeButton deleteButton"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
