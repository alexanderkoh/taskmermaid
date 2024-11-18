'use client'

import React, { useState, DragEvent } from 'react'

interface Task {
  id: string
  text: string
  parentId: string | null
  projectId: string
  completed: boolean
}

interface Project {
  id: string
  name: string
}

interface DragItem {
  taskId: string
  parentId: string | null
}

interface TaskWriterProps {
  taskList: string
  setTaskList: (value: string) => void
}

const TaskWriter: React.FC<TaskWriterProps> = ({ taskList, setTaskList }) => {
  const [newTaskText, setNewTaskText] = useState('')
  const [newProjectName, setNewProjectName] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingTaskText, setEditingTaskText] = useState('')
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null)
  const [dragOverItem, setDragOverItem] = useState<string | null>(null)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [editingProjectName, setEditingProjectName] = useState('')

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const getCurrentProject = () => {
    return projects.find(p => p.id === selectedProjectId)
  }

  const addProject = () => {
    if (!newProjectName.trim()) return

    const newProject: Project = {
      id: generateId(),
      name: newProjectName
    }

    setProjects([...projects, newProject])
    setNewProjectName('')
    setSelectedProjectId(newProject.id)
    setIsCreatingProject(false)
  }

  const addTask = () => {
    if (!newTaskText.trim() || !selectedProjectId) return

    const newTask: Task = {
      id: generateId(),
      text: newTaskText,
      parentId: null,
      projectId: selectedProjectId,
      completed: false
    }

    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    updateTaskList(updatedTasks)
    setNewTaskText('')
  }

  const addSubtask = () => {
    if (!newTaskText.trim() || !selectedTaskId || !selectedProjectId) return

    const newTask: Task = {
      id: generateId(),
      text: newTaskText,
      parentId: selectedTaskId,
      projectId: selectedProjectId,
      completed: false
    }

    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    updateTaskList(updatedTasks)
    setNewTaskText('')
  }

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
    setTasks(updatedTasks)
    updateTaskList(updatedTasks)
  }

  const updateTaskList = (taskArray: Task[]) => {
    if (!selectedProjectId) return

    let formattedList = ''
    const projectTasks = taskArray.filter(task => task.projectId === selectedProjectId)
    
    // Add project name as the root node
    const currentProject = projects.find(p => p.id === selectedProjectId)
    if (currentProject) {
      formattedList = `- ${currentProject.name}\n`
    }
    
    // Add parent tasks
    projectTasks.filter(task => !task.parentId).forEach(task => {
      const taskText = task.completed ? `~~${task.text}~~` : task.text
      formattedList += `  - ${taskText}\n`
      // Add child tasks
      projectTasks.filter(subtask => subtask.parentId === task.id).forEach(subtask => {
        const subtaskText = subtask.completed ? `~~${subtask.text}~~` : subtask.text
        formattedList += `    - ${subtaskText}\n`
      })
    })

    setTaskList(formattedList)
  }

  const handleDragStart = (e: DragEvent<HTMLDivElement>, task: Task) => {
    setDraggedItem({
      taskId: task.id,
      parentId: task.parentId
    })
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>, taskId: string) => {
    e.preventDefault()
    setDragOverItem(taskId)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetTask: Task) => {
    e.preventDefault()
    if (!draggedItem) return

    const updatedTasks = [...tasks]
    const draggedTaskIndex = updatedTasks.findIndex(t => t.id === draggedItem.taskId)
    const draggedTask = updatedTasks[draggedTaskIndex]

    if (draggedTask.id === targetTask.id) return

    updatedTasks.splice(draggedTaskIndex, 1)
    const targetIndex = updatedTasks.findIndex(t => t.id === targetTask.id)

    if (!targetTask.parentId) {
      draggedTask.parentId = targetTask.id
      updatedTasks.splice(targetIndex + 1, 0, draggedTask)
    } else {
      draggedTask.parentId = targetTask.parentId
      updatedTasks.splice(targetIndex + 1, 0, draggedTask)
    }

    setTasks(updatedTasks)
    updateTaskList(updatedTasks)
  }

  const goBackToProjects = () => {
    setSelectedProjectId(null)
    setSelectedTaskId(null)
  }

  const startEditingProject = (project: Project) => {
    setEditingProjectId(project.id)
    setEditingProjectName(project.name)
  }

  const saveEditedProject = () => {
    if (!editingProjectId || !editingProjectName.trim()) return

    const updatedProjects = projects.map(project =>
      project.id === editingProjectId
        ? { ...project, name: editingProjectName.trim() }
        : project
    )
    
    setProjects(updatedProjects)
    setEditingProjectId(null)
    setEditingProjectName('')
    
    // Update task list to reflect new project name
    updateTaskList(tasks)
  }

  const deleteProject = (projectId: string) => {
    // Delete project and all its tasks
    setProjects(projects.filter(p => p.id !== projectId))
    setTasks(tasks.filter(t => t.projectId !== projectId))
    
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null)
      setSelectedTaskId(null)
      setTaskList('')
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Back to Projects Button - Always at the top when in a project */}
      {selectedProjectId && (
        <div className="mb-4">
          <button
            onClick={goBackToProjects}
            className="btn btn-sm btn-ghost gap-2 text-base-content"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Projects
          </button>
        </div>
      )}

      {/* Show Current Project when selected */}
      {selectedProjectId && getCurrentProject() && (
        <div className="mb-4">
          <div className="p-3 rounded-lg border border-base-300">
            <h3 className="text-sm text-base-content mb-1">Current Project:</h3>
            {editingProjectId === selectedProjectId ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingProjectName}
                  onChange={(e) => setEditingProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveEditedProject()
                    }
                  }}
                  className="input input-bordered input-sm flex-1"
                  autoFocus
                />
                <button
                  onClick={saveEditedProject}
                  className="btn btn-sm btn-primary"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingProjectId(null)}
                  className="btn btn-sm btn-ghost"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-base-content">
                  {getCurrentProject()?.name}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditingProject(getCurrentProject()!)}
                    className="btn btn-ghost btn-sm"
                    title="Edit project name"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this project and all its tasks?')) {
                        deleteProject(selectedProjectId)
                      }
                    }}
                    className="btn btn-ghost btn-sm text-error"
                    title="Delete project"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Project Creation Section */}
      {!isCreatingProject && !selectedProjectId && (
        <button
          onClick={() => setIsCreatingProject(true)}
          className="btn btn-primary w-full mb-4"
        >
          Create New Project
        </button>
      )}

      {isCreatingProject && (
        <div className="mb-4">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="input input-bordered w-full mb-2"
            placeholder="Enter project name..."
          />
          <div className="flex gap-2">
            <button
              onClick={addProject}
              className="btn btn-primary flex-1"
            >
              Create Project
            </button>
            <button
              onClick={() => setIsCreatingProject(false)}
              className="btn btn-ghost flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Project List with Edit/Delete */}
      {projects.length > 0 && !selectedProjectId && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-base-content">Your Projects:</h3>
          <div className="space-y-2">
            {projects.map(project => (
              <div
                key={project.id}
                className="flex items-center justify-between p-2 rounded hover:bg-base-200"
              >
                {editingProjectId === project.id ? (
                  <div className="flex gap-2 w-full">
                    <input
                      type="text"
                      value={editingProjectName}
                      onChange={(e) => setEditingProjectName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          saveEditedProject()
                        }
                      }}
                      className="input input-bordered input-sm flex-1"
                      autoFocus
                    />
                    <button
                      onClick={saveEditedProject}
                      className="btn btn-sm btn-primary"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProjectId(null)}
                      className="btn btn-sm btn-ghost"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className="flex-1 cursor-pointer text-base-content"
                      onClick={() => setSelectedProjectId(project.id)}
                    >
                      {project.name}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditingProject(project)}
                        className="btn btn-ghost btn-sm"
                        title="Edit project name"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this project and all its tasks?')) {
                            deleteProject(project.id)
                          }
                        }}
                        className="btn btn-ghost btn-sm text-error"
                        title="Delete project"
                      >
                        ×
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Management Section */}
      {selectedProjectId && (
        <>
          <div className="mb-4">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (selectedTaskId) {
                    addSubtask()
                  } else {
                    addTask()
                  }
                }
              }}
              className="input input-bordered w-full mb-2"
              placeholder={selectedTaskId ? "Press Enter to add child task..." : "Press Enter to add parent task..."}
            />
            <div className="flex gap-2">
              <button
                onClick={addTask}
                className="btn btn-primary flex-1"
              >
                Add Parent Task
              </button>
              {tasks.filter(task => task.projectId === selectedProjectId && !task.parentId).length > 0 && (
                <button
                  onClick={addSubtask}
                  disabled={!selectedTaskId}
                  className={`btn flex-1 ${selectedTaskId ? 'btn-secondary' : 'btn-disabled'}`}
                >
                  Add Child Task
                </button>
              )}
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-2">
            {tasks
              .filter(task => task.projectId === selectedProjectId && !task.parentId)
              .map(parentTask => (
                <div key={parentTask.id} className="space-y-1">
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, parentTask)}
                    onDragOver={(e) => handleDragOver(e, parentTask.id)}
                    onDrop={(e) => handleDrop(e, parentTask)}
                    className={`p-2 rounded cursor-move hover:bg-base-200 ${
                      selectedTaskId === parentTask.id ? 'bg-base-200' : ''
                    }`}
                    onClick={() => setSelectedTaskId(parentTask.id)}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={parentTask.completed}
                        onChange={() => toggleTaskCompletion(parentTask.id)}
                        className="checkbox checkbox-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className={parentTask.completed ? 'line-through opacity-50' : ''}>
                        {parentTask.text}
                      </span>
                    </div>
                  </div>
                  
                  {/* Child Tasks */}
                  <div className="ml-6 space-y-1">
                    {tasks
                      .filter(task => task.parentId === parentTask.id)
                      .map(childTask => (
                        <div
                          key={childTask.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, childTask)}
                          onDragOver={(e) => handleDragOver(e, childTask.id)}
                          onDrop={(e) => handleDrop(e, childTask)}
                          className={`p-2 rounded cursor-move hover:bg-base-200 ${
                            selectedTaskId === childTask.id ? 'bg-base-200' : ''
                          }`}
                          onClick={() => setSelectedTaskId(childTask.id)}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={childTask.completed}
                              onChange={() => toggleTaskCompletion(childTask.id)}
                              className="checkbox checkbox-sm"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className={childTask.completed ? 'line-through opacity-50' : ''}>
                              {childTask.text}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  )
}

export default TaskWriter 