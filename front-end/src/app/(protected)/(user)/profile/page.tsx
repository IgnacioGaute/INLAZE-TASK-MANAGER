

import { useCurrentUser } from '@/hooks/auth/use-current-user';
import { UpdateUserCard } from './components/profile-card';

export default function UserPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Perfil de usuario</h1>
      <UpdateUserCard />
    </div>
  );
}
