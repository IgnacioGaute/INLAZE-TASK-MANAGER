'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user.type';
import { getGroupOfColaboratorsById } from '@/services/users.service';
import { useSession } from 'next-auth/react';


interface Props {
  groupId: string;
}

export function GroupUsersDialog({ groupId }: Props) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { data: session } = useSession();
  

  useEffect(() => {
    if (!open) return;

    const fetchUsers = async () => {
      const group = await getGroupOfColaboratorsById(groupId, session?.token);
      if (group?.users) {
        setUsers(group.users);
      } else {
        setUsers([]);
      }
    };

    fetchUsers();
  }, [open, groupId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button
        variant="ghost"
        className="w-full justify-start"
        size="sm"
        onClick={() => setOpen(true)}
      >
        Ver Usuarios
      </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Usuarios del grupo</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {users.length > 0 ? (
            users.map(user => (
              <div key={user.id} className="flex items-center justify-between border-b py-1">
                <span>{user.firstName} {user.lastName}</span>
                <span className="text-muted-foreground text-sm">{user.email}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No hay usuarios en este grupo.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
