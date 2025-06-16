import ProjectDetailPage from "./project-detail";


export default async function ProjectDetailPageWrapper({ params }: { params: { id: string } }) {
  const { id } = await params;  
  return <ProjectDetailPage projectId={id} />;
}
