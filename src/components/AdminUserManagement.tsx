
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { User } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Users, Search, X } from 'lucide-react';

interface AdminUserManagementProps {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
}

const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ users, addUser }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleCreateUser = () => {
    if (!email || !name) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and email.",
        variant: "destructive"
      });
      return;
    }

    if (!email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please provide a valid email address.",
        variant: "destructive"
      });
      return;
    }

    // Check for existing user with same email
    if (users.some(user => user.email === email)) {
      toast({
        title: "User Exists",
        description: "A user with this email already exists.",
        variant: "destructive"
      });
      return;
    }

    const newUser = {
      email,
      name,
      role: role as 'admin' | 'librarian' | 'student',
      fines: 0, // Initialize with zero fines
    };

    addUser(newUser);
    
    // Reset form
    setEmail('');
    setName('');
    setRole('student');
    
    toast({
      title: "User Created",
      description: `Successfully created user: ${name} (${email})`,
    });
  };

  // Filter users based on search query
  const filteredUsers = searchQuery 
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    : users;

  return (
    <Tabs defaultValue="users" className="space-y-4">
      <TabsList className="mb-4">
        <TabsTrigger value="users">
          <Users className="h-4 w-4 mr-2" />
          View Users
        </TabsTrigger>
        <TabsTrigger value="create">
          <UserPlus className="h-4 w-4 mr-2" />
          Create User
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User Management
            </CardTitle>
            <CardDescription>
              View and manage all users in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')} 
                    className="absolute right-2.5 top-2.5"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Role</th>
                      <th className="p-3 text-left">Fines</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">{user.name}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">
                            <Badge className={`${
                              user.role === 'admin' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
                              user.role === 'librarian' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                              'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-3">
                            {user.fines > 0 ? (
                              <Badge variant="outline" className="text-red-600">
                                ${user.fines.toFixed(2)}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-green-600">
                                No fines
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-3 text-center text-muted-foreground">
                          {searchQuery ? 'No users match your search' : 'No users found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Create New User
            </CardTitle>
            <CardDescription>
              Add a new user to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">User Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="librarian">Librarian</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleCreateUser} 
                className="w-full"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create User
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminUserManagement;
