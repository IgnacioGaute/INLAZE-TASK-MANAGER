import { getProjects } from "@/services/project.service";
import { projectColumns } from "./components/project-columns";
import { ProjectsTable } from "./components/projects-table";

export default async function ProjectPage() {
  const projects = await getProjects();

  return (
    <div className="container mx-auto px-4 py-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3 mb-6 sm:mb-8 bg-secondary/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Proyectos</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gestiona todos los proyectos.
          </p>
        </div>
      </div>
        <ProjectsTable
        columns={projectColumns}
        data={projects?.data || []}
      />
    </div>
  );
}
