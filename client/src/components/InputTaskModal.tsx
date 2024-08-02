import { cn } from '@/lib/utils';
import Text from './Text';
import { Task, User } from '@prisma/client';
import { useMemo, useState } from 'react';
import StatusChip from './StatusChip';
import { StatusType, TaskInput } from '@/lib';
import { TASK_STATUS } from '@/constants/TaskStatus';
import ModalController from '@/controllers/ModalController';
import {
  ArrowLeft01Icon,
  ArrowLeft02Icon,
  ArtificialIntelligence04Icon,
} from 'hugeicons-react';
import { useProjectContext } from '@/providers/projectProvider';

interface InputTaskModalProps {
  task?: Task;
  status?: StatusType;
  onRequestClose?: () => void;
}

enum InputType {
  TITLE,
  DESCRIPTION,
  ASSIGNEE,
  STATUS,
}

enum LoadingType {
  AI,
  CREATE,
}

export default function InputTaskModal({
  task,
  status,
  onRequestClose,
}: InputTaskModalProps): JSX.Element {
  const { createTask } = useProjectContext();
  const [isLoading, setIsLoading] = useState<LoadingType | null>(null);
  const [suggestedUser, setSuggestedUser] = useState<User | null>(null);
  const [input, setInput] = useState<TaskInput>({
    title: task?.title || '',
    description: task?.description || '',
    assigneeId: task?.assigneeId || '',
    status: task?.status
      ? TASK_STATUS[task.status]
      : status || TASK_STATUS.ToDo,
  });

  const validInput = useMemo(() => {
    return input.title.trim() && input.description.trim();
  }, [input]);

  const isUpdate = !!task;

  const handleSuggestion = async () => {
    setIsLoading(LoadingType.AI);
    setSuggestedUser({
      createdAt: new Date(),
      email: 'fabian.simon98@gmail.com',
      expertise: '',
      id: '2',
      name: 'Fabian Simon',
      updatedAt: new Date(),
      role: '',
    });
    setIsLoading(null);
  };

  const handleAddTask = async () => {
    setIsLoading(LoadingType.CREATE);
    await createTask(input);
    setIsLoading(null);
    ModalController.close();
  };

  const handleUpdateTask = async () => {
    setIsLoading(LoadingType.CREATE);
    await updateTask();
    setIsLoading(null);
    if (onRequestClose) onRequestClose();
  };

  const chooseSuggestion = () => {
    if (!suggestedUser) return;
    handleInput(InputType.ASSIGNEE, suggestedUser.id);
  };

  const handleInput = (type: InputType, value?: string) => {
    setInput((prev) => {
      switch (type) {
        case InputType.TITLE:
          return { ...prev, title: value ?? '' };

        case InputType.DESCRIPTION:
          return { ...prev, description: value ?? '' };

        default:
          return prev;
      }
    });
  };

  return (
    <div
      className={cn(
        'bg-white grow flex max-w-[60%] flex-col text-start px-3 py-4 rounded-xl space-y-2'
      )}
    >
      <div className="flex justify-between">
        <div className="space-y-2">
          {isUpdate && (
            <ArrowLeft02Icon
              onClick={onRequestClose}
              className="text-black cursor-pointer"
            />
          )}
          <Text.Headline className="text-black font-medium text-[15px]">
            {isUpdate ? 'Update new task' : 'Create new task'}
          </Text.Headline>
        </div>
        <StatusChip
          onSelect={(status) => setInput((prev) => ({ ...prev, status }))}
          className="hover:scale-[104%]"
          status={input.status}
        />
      </div>

      <div className="divider" />

      {/* Title Part  */}
      <Text.Body className="font-medium">Title</Text.Body>
      <input
        onInput={({ currentTarget: { value } }) =>
          handleInput(InputType.TITLE, value)
        }
        value={input.title}
        type="text"
        className="input text-sm bg-white text-black input-bordered w-full"
        placeholder="Deploy Backend"
      />

      {/* Description Part  */}
      <Text.Body className="font-medium pt-4">Description</Text.Body>
      <textarea
        value={input.description}
        onInput={({ currentTarget: { value } }) =>
          handleInput(InputType.DESCRIPTION, value)
        }
        className="input text-sm bg-white text-black input-bordered w-full pt-2 h-20"
        placeholder="Add as much detail as possible for the AI Suggestions to work properly"
      ></textarea>

      <div className="divider" />

      {/* Assignee Part */}
      <Text.Body className="font-medium">Assign</Text.Body>
      <div className="flex justify-between space-x-2">
        <select
          value={input.assigneeId}
          onChange={(e) => handleInput(InputType.ASSIGNEE, e.target.value)}
          className="select text-xs text-start select-sm text-black select-bordered bg-transparent w-full h-12"
        >
          <option
            disabled
            value=""
          >
            Pick an assignee
          </option>
          {Array.from({ length: 4 }, () => 'hello').map((user, index) => (
            <option
              key={index}
              value={index.toString()}
            >
              {user}
            </option>
          ))}
        </select>
        <button
          disabled={isLoading !== null}
          onClick={handleSuggestion}
          className="btn btn-primary max-h-12"
        >
          <ArtificialIntelligence04Icon
            size={18}
            className="text-white"
          />
          <Text.Subtitle className="text-white">AI Suggestion</Text.Subtitle>
        </button>
      </div>

      {suggestedUser && (
        <div className="w-full bg-primary p-4 rounded-md mt-2">
          <Text.Body className="text-white">
            AI suggests the user{' '}
            <strong
              className="cursor-pointer"
              onClick={chooseSuggestion}
            >
              {suggestedUser.email}
            </strong>
          </Text.Body>
          <Text.Subtitle className="text-white mt-2">
            This is the conclusion after analyzing the expertise and roles of
            each participant.
          </Text.Subtitle>
        </div>
      )}

      <div className="divider" />

      <button
        onClick={isUpdate ? handleAddTask : handleUpdateTask}
        disabled={!validInput || isLoading === LoadingType.CREATE}
        className="btn btn-primary max-h-12"
      >
        {isLoading ? (
          <span className="loading text-white"></span>
        ) : (
          <Text.Subtitle className="text-white">
            {isUpdate ? 'Update' : 'Create'}
          </Text.Subtitle>
        )}
      </button>
    </div>
  );
}
