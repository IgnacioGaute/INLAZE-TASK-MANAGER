'use client';

import { useEffect, useState, useTransition } from 'react';
import { getProjectById } from '@/services/project.service';
import { notFound } from 'next/navigation';
import { CreateTaskDialog } from './tasks/create-task-dialog';
import { getGroupOfColaborators, getUsers } from '@/services/users.service';
import { TaskListSection } from './tasks/task-list-seccion';
import { useSession } from 'next-auth/react';
import { Task } from '@/types/task.type';
import { User } from '@/types/user.type';
import { GroupOfColaborators } from '@/types/group-of-colaborators.type';

type ProjectDetailPageProps = {
  projectId: string;
};

export default function ProjectDetailPage({ projectId }: ProjectDetailPageProps) {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<GroupOfColaborators[]>([]);
  const [isPending, startTransition] = useTransition();

  const fetchProject = async () => {
    if (!session?.token) return;

    const project = await getProjectById(projectId, session.token);

    if (!project) {
      notFound();
      return;
    }

    setProjectTitle(project.title);
    setTasks(project.tasks || []);
  };

  useEffect(() => {
    if (!session?.token) return;

    startTransition(() => {
      fetchProject();
      getUsers(session?.token).then((res) => setUsers(res?.data || []));
      getGroupOfColaborators(session?.token).then((res) => setGroups(res?.data || []));
    });
  }, [projectId, session?.token]);

  return (
    <div className="container mx-auto px-6 py-10 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl font-semibold text-white mb-2">{projectTitle}</h1>
        <p className="text-gray-400 text-lg">Tareas asociadas a este proyecto</p>
      </header>

      <section className="mb-6">
        <CreateTaskDialog
          projectId={projectId}
          users={users}
          groups={groups}
          onTaskCreated={fetchProject}
        />
      </section>

      <TaskListSection tasks={tasks} users={users} groups={groups} onTaskCreated={fetchProject}/>
    </div>
  );
}
