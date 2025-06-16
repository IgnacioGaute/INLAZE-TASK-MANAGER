export type ServiceName =
  | 'users'
  | 'projects'
  | 'tasks'
  | 'groupOfColaborators'

// Define the cache tags structure
export const CACHE_TAGS = {
  users: {
    all: 'users',
    single: (id: string) => `user-${id}`,
  },
  projects: {
    all: 'projects',
    single: (projectId: string) => `project-${projectId}`,
  },
  tasks: {
    all: 'tasks',
    projects: 'projects_tasks',
    single: (taskId: string) => `task-${taskId}`,
    project: (projectId: string) => `tasks-project-${projectId}`,
  },
  groupOfColaborators: {
    all: 'groupOfColaborators'
  },
} as const;

// Helper function to get cache tag
export const getCacheTag = <T extends ServiceName>(
  service: T,
  tag: keyof (typeof CACHE_TAGS)[T],
  ...params: string[]
): string => {
  const cacheTag = CACHE_TAGS[service][tag];
  if (typeof cacheTag === 'function') {
    return cacheTag(...params);
  }
  return cacheTag as string;
};
