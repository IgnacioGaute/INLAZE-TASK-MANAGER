'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Task } from '@/types/task.type';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { updateTaskStatusAction } from '@/actions/tasks/update-task-status.action';
import { Button } from '@/components/ui/button';
import { TaskDropdownMenu } from './task-drop-down-menu';
import { User } from '@/types/user.type';
import { GroupOfColaborators } from '@/types/group-of-colaborators.type';
import { createCommentAction } from '@/actions/tasks/comments/create-comment.action';
import { useSession } from 'next-auth/react';

type TaskAccordionProps = {
  tasks: Task[];
  users: User[];
  groups: GroupOfColaborators[]
  onTaskCreated: () => void;
};

export function TaskAccordion({ tasks, users, groups, onTaskCreated }: TaskAccordionProps) {
  const [tasksState, setTasksState] = useState<Task[]>([]);
  
const [commentContent, setCommentContent] = useState('');
const [loadingCommentTaskId, setLoadingCommentTaskId] = useState<string | null>(null);
const { data: session } = useSession();
const userId = session?.user?.id;

useEffect(() => {
  if (tasks.length > 0) {
    setTasksState(tasks);
  }
}, [tasks]);
  if (!tasksState || tasksState.length === 0) {
    return <p className="text-muted-foreground text-sm">No hay tareas disponibles.</p>;
  }

const toggleStatus = async (taskId: string) => {
  const task = tasksState.find((t) => t.id === taskId);
  if (!task) return;

  const newStatus = task.status === 'PENDING' ? 'DONE' : 'PENDING';

  const result = await updateTaskStatusAction(task.id, { status: newStatus });

  if (result.error) {
    toast.error(result.error);
    return;
  }

  const updatedTasks = tasksState.map((t) =>
    t.id === taskId ? { ...t, status: newStatus as 'PENDING' | 'DONE' } : t
  );

  updatedTasks.sort((a, b) => (a.status === 'DONE' ? 1 : -1));

  setTasksState(updatedTasks);

  onTaskCreated();

  toast.success(`Estado cambiado a ${newStatus === 'DONE' ? 'Realizado' : 'Pendiente'}`);
};


  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {tasksState.map((task) => {
        return (
          <AccordionItem
            key={task.id}
            value={task.id}
            className="bg-[#121826] text-white rounded-xl px-6 py-4"
          >
            <AccordionTrigger>
              <span className="text-2xl font-semibold cursor-pointer">{task.title}</span>
            </AccordionTrigger>

            <div className="flex justify-end mt-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStatus(task.id);
                }}
                className={
                  task.status === 'DONE'
                    ? 'bg-green-900 text-white hover:bg-green-600'
                    : 'bg-red-900 text-white hover:bg-red-600'
                }
              >
                {task.status === 'DONE' ? 'Realizado' : 'Pendiente'}
              </Button>
              <div className="ml-5">
                <TaskDropdownMenu task={task} users={users} groups={groups} onTaskCreated={onTaskCreated}/>
              </div>
            </div>

            <AccordionContent>
              <div className="flex flex-col gap-4">
                <p className="text-lg">{task.description}</p>

                <div className="flex justify-end flex-col items-end gap-1 text-sm text-gray-400">
                  <p>Fecha de entrega: {format(new Date(task.date), 'dd/MM/yyyy')}</p>
                  <div className="flex flex-wrap justify-end gap-5 mt-5 w-full">
                    <div>
                      <p className="font-semibold mb-1">Usuarios asignados:</p>
                      <div className="flex flex-col space-y-2">
                        {task.users && task.users.length > 0 ? (
                          task.users.map((user) => (
                            <span
                              key={user.id}
                              className="bg-gray-700 text-white px-2 py-0.5 rounded-md text-xs"
                            >
                              {user.firstName} {user.lastName}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            No hay usuarios asignados a esta tarea
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold mb-1 text-green-400">Grupos asignados:</p>
                      <div className="flex flex-col space-y-3">
                        {task.groupOfColaborators?.map((group) => {
                          const groupUsers = users.filter((user) =>
                            group.users?.some((groupUser) => groupUser.id === user.id)
                          );

                          return (
                            <div key={group.id} className="bg-green-900 rounded-md p-2 w-full">
                              <p className="text-green-300 font-medium">{group.name}</p>
                              <div className="ml-4 mt-1 flex flex-col space-y-1">
                                {groupUsers.length > 0 ? (
                                  groupUsers.map((gu) => (
                                    <span
                                      key={gu.id}
                                      className="bg-green-700 text-green-100 px-2 py-0.5 rounded text-xs"
                                    >
                                      {gu.firstName} {gu.lastName}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-green-300 text-xs italic">
                                    No hay usuarios en este grupo
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {(!task.groupOfColaborators || task.groupOfColaborators.length === 0) && (
                          <span className="text-green-300 text-xs italic">
                            No hay grupos asignados a esta tarea
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full mt-6 border-t border-gray-600 pt-4">
                  <h4 className="text-md font-semibold mb-2 text-white">Comentarios</h4>

                  <div className="space-y-3 mb-4 w-full">
                    {task.comments?.length > 0 ? (
                      task.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="w-full text-sm text-gray-300 border-b border-gray-700 pb-2"
                        >
                          <p className="font-medium text-white">
                            {comment.author.firstName} {comment.author.lastName}
                          </p>
                          <p>{comment.content}</p>
                          <p className="text-xs text-gray-400">
                            {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm')}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic">No hay comentarios aún.</p>
                    )}
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!commentContent.trim()) return;

                      setLoadingCommentTaskId(task.id);

                      const res = await createCommentAction({
                        content: commentContent,
                        taskId: task.id,
                        userId: userId!,
                      });

                      if (res.error) {
                        toast.error(res.error);
                      } else {
                        toast.success('Comentario agregado');
                        onTaskCreated();
                        setCommentContent('');
                      }

                      setLoadingCommentTaskId(null);
                    }}
                    className="flex items-center gap-2 w-full"
                  >
                    <input
                      type="text"
                      placeholder="Escribe un comentario..."
                      value={task.id === loadingCommentTaskId ? '' : commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      className="flex-1 px-3 py-1 rounded bg-gray-800 text-white text-sm"
                    />
                    <Button type="submit" size="sm" disabled={loadingCommentTaskId === task.id}>
                      {loadingCommentTaskId === task.id ? 'Enviando...' : 'Comentar'}
                    </Button>
                  </form>
                </div>
              </div>
            </AccordionContent>

          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
