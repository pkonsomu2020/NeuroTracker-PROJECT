import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical, Plus, Trash2, Edit } from 'lucide-react';
import { useRoutineStore } from '../../store/useRoutineStore';
import { useTaskStore } from '../../store/useTaskStore';
import { Routine, Task } from '../../types';
import { formatDuration } from '../../utils/helpers';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import AddTaskModal from '../planner/AddTaskModal';

interface RoutineDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  routine: Routine;
}

const RoutineDetailModal: React.FC<RoutineDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  routine 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [name, setName] = useState(routine.name);
  const [description, setDescription] = useState(routine.description);
  
  const { updateRoutine, deleteRoutine, reorderTasksInRoutine, removeTaskFromRoutine } = useRoutineStore();
  const { addTask } = useTaskStore();
  
  const handleSaveChanges = () => {
    if (!name.trim()) return;
    
    updateRoutine(routine.id, {
      name,
      description,
    });
    
    setIsEditing(false);
  };
  
  const handleDeleteRoutine = () => {
    deleteRoutine(routine.id);
    onClose();
  };
  
  const handleAddTaskToPlanner = (task: Task) => {
    addTask({
      name: task.name,
      duration: task.duration,
      colorCode: task.colorCode,
      icon: task.icon,
      scheduledTime: new Date(),
      order: 0,
    });
  };
  
  const handleAddAllTasks = () => {
    routine.tasks.forEach(task => {
      handleAddTaskToPlanner(task);
    });
    
    onClose();
  };
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    const taskId = routine.tasks[sourceIndex].id;
    reorderTasksInRoutine(routine.id, taskId, destinationIndex);
  };
  
  const handleRemoveTask = (taskId: string) => {
    removeTaskFromRoutine(routine.id, taskId);
  };
  
  const totalDuration = routine.tasks.reduce((total, task) => total + task.duration, 0);
  
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEditing ? "Edit Routine" : routine.name}
        size="lg"
        footer={
          isEditing ? (
            <>
              <Button variant="danger\" onClick={handleDeleteRoutine}>
                Delete Routine
              </Button>
              <div className="flex-1"></div>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="mr-2">
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveChanges} disabled={!name.trim()}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Routine
              </Button>
              <Button variant="primary" onClick={handleAddAllTasks} disabled={routine.tasks.length === 0}>
                Add All Tasks to Planner
              </Button>
            </>
          )
        }
      >
        {isEditing ? (
          <div className="space-y-4">
            <Input
              label="Routine Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 focus:ring-primary-500 focus:border-primary-500"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {routine.description}
            </p>
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Tasks ({routine.tasks.length})</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Duration: {formatDuration(totalDuration)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingTask(true)}
                  icon={<Plus className="h-4 w-4" />}
                >
                  Add Task
                </Button>
              </div>
            </div>
            
            {routine.tasks.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  This routine doesn't have any tasks yet
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAddingTask(true)}
                  icon={<Plus className="h-4 w-4" />}
                >
                  Add First Task
                </Button>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tasks">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {routine.tasks
                        .sort((a, b) => a.order - b.order)
                        .map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center justify-between p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                              >
                                <div className="flex items-center">
                                  <span
                                    {...provided.dragHandleProps}
                                    className="mr-3 text-gray-400 cursor-grab"
                                  >
                                    <GripVertical className="h-5 w-5" />
                                  </span>
                                  <div 
                                    className="w-3 h-3 rounded-full mr-3" 
                                    style={{ backgroundColor: task.colorCode }}
                                  ></div>
                                  <span>{task.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500">
                                    {formatDuration(task.duration)}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-1"
                                    onClick={() => handleAddTaskToPlanner(task)}
                                    icon={<Plus className="h-4 w-4 text-gray-600" />}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-1"
                                    onClick={() => handleRemoveTask(task.id)}
                                    icon={<Trash2 className="h-4 w-4 text-error-500" />}
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        )}
      </Modal>
      
      {isAddingTask && (
        <AddTaskModal
          isOpen={isAddingTask}
          onClose={() => setIsAddingTask(false)}
        />
      )}
    </>
  );
};

export default RoutineDetailModal;