
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminUserManagement from '@/components/AdminUserManagement';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { User } from '@/data/mockData';

const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('profiles').select('*');

  if (error) {
    throw new Error(error.message);
  }

  // Map Supabase profiles to the User type expected by AdminUserManagement
  return data.map(profile => ({
    id: profile.id,
    name: profile.full_name || '',
    email: profile.email || '',
    role: profile.role,
    fines: profile.fines || 0,
  }));
};

const UserManagementPage = () => {
  const { data: users, isLoading, error, isSuccess } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Skeleton className="h-12 w-full max-w-lg" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error Loading Users</AlertTitle>
        <AlertDescription>
          There was a problem fetching user data: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      {isSuccess && <AdminUserManagement users={users} />}
    </div>
  );
};

export default UserManagementPage;
