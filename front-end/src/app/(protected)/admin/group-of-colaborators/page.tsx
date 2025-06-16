
import { User } from 'lucide-react';
import { getGroupOfColaborators, getUsers } from '@/services/users.service';
import { GroupOfColaboratorsTable } from './components/groups-of-colaborators-table';
import { groupOfColaboratorsColumns } from './components/group-of-colaborators-columns';


export default async function GropuOfColaboratorsPage() {
  const groupOfColaborators = await getGroupOfColaborators();
  const users = await getUsers();  

  return (
    <div className="container mx-auto px-4 py-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3 mb-6 sm:mb-8 bg-secondary/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm">
        <User className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Administrar Grupos de Colaboradores</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gestiona todos los Grupos de Colaboradores.
          </p>
        </div>
      </div>
      <GroupOfColaboratorsTable
        columns={groupOfColaboratorsColumns}
        data={groupOfColaborators?.data || []}
        users={users?.data || []}
      />
    </div>
  );
}
