import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLibrary } from '@/contexts/LibraryContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Resource, Transaction, User } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminUserManagement from '@/components/AdminUserManagement';
import UserFinesManagement from '@/components/UserFinesManagement';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

// Dummy function to add a user (would connect to authentication system in a real app)
const addUser = (newUser: Omit<User, 'id'>) => {
  // This would connect to a real authentication system in a production app
  console.log('Creating new user:', newUser);
  // Implementation would go here
};

const ReportsPage = () => {
  const { currentUser } = useAuth();
  const { resources, transactions, calculateFine } = useLibrary();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState('month');
  
  // Fetch users from Supabase
  const { data: profiles, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data as Profile[];
    },
    enabled: !!currentUser, // Fetch users if logged in
  });
  
  // Map fetched profiles to the User type expected by child components
  const users: User[] = (profiles || []).map(p => ({
    id: p.id,
    name: p.full_name || '',
    email: p.email || '',
    role: p.role,
    fines: p.fines || 0,
  }));
  
  // Check if user has librarian or admin role
  if (!currentUser || (currentUser.role !== 'librarian' && currentUser.role !== 'admin')) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
        <p className="mb-8">You don't have permission to access this page.</p>
        <Button onClick={() => navigate('/')}>Return to Homepage</Button>
      </div>
    );
  }

  // Generate borrowing data for chart
  const generateBorrowingData = () => {
    // Group resources by category
    const categoryCounts = resources.reduce((acc, resource) => {
      const category = resource.category;
      if (!acc[category]) acc[category] = 0;
      
      // Count transactions for this resource
      const resourceTransactions = transactions.filter(t => t.resourceId === resource.id);
      acc[category] += resourceTransactions.length;
      
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to chart data format
    return Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  };
  
  const borrowingData = generateBorrowingData();
  
  // Generate availability data for chart
  const availabilityData = [
    { name: 'Available', value: resources.filter(resource => resource.available).length },
    { name: 'Borrowed', value: resources.filter(resource => !resource.available).length },
  ];

  // Top borrowed resources
  const getTopBorrowedResources = (): { resource: Resource, count: number }[] => {
    const resourceCounts = transactions.reduce((acc, transaction) => {
      const { resourceId } = transaction;
      acc[resourceId] = (acc[resourceId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(resourceCounts)
      .map(([resourceId, count]) => ({
        resource: resources.find(r => r.id === resourceId)!,
        count
      }))
      .filter(item => item.resource) // Make sure the resource exists
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };
  
  const handleExport = (reportType: string) => {
    toast({
      title: "Report Exported",
      description: `The ${reportType} report has been downloaded.`,
    });
  };

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-library-800">Library Reports</h1>
      
      <Tabs defaultValue="dashboard">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="categories">Category Analysis</TabsTrigger>
          <TabsTrigger value="fines">User Fines</TabsTrigger>
          {currentUser.role === 'admin' && (
            <TabsTrigger value="users">User Management</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
            <div className="flex items-center gap-2">
              <Select
                value={timeframe}
                onValueChange={setTimeframe}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Summary Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Library Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-600">Total Resources</p>
                    <p className="text-2xl font-bold">{resources.length}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-md">
                    <p className="text-sm text-green-600">Available Resources</p>
                    <p className="text-2xl font-bold">{resources.filter(r => r.available).length}</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-md">
                    <p className="text-sm text-amber-600">Total Loans</p>
                    <p className="text-2xl font-bold">{transactions.length}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-md">
                    <p className="text-sm text-red-600">Overdue</p>
                    <p className="text-2xl font-bold">{transactions.filter(t => t.status === 'overdue').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resource Availability</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={availabilityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {availabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#F59E0B'} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Resources Borrowed by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={borrowingData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Number of Loans" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" onClick={() => handleExport('borrowing trends')}>
                Export Report
              </Button>
            </CardFooter>
          </Card>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Top Borrowed Resources</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrows</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getTopBorrowedResources().map((item, index) => (
                  <tr key={item.resource.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold">{index + 1}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 object-cover" src={item.resource.cover} alt={item.resource.title} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-library-800">{item.resource.title}</div>
                          <div className="text-sm text-gray-500">{item.resource.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{item.resource.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-library-700">{item.count}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Resources by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={borrowingData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, value}) => `${name}: ${value}`}
                  >
                    {borrowingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" onClick={() => handleExport('category analysis')}>
                Export Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="fines">
          <UserFinesManagement 
            users={users}
            transactions={transactions}
            calculateFine={calculateFine}
          />
        </TabsContent>
        
        {currentUser.role === 'admin' && (
          <TabsContent value="users">
            {isLoadingUsers ? (
              <Card>
                <CardHeader>
                  <CardTitle>Loading Users...</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            ) : (
              <AdminUserManagement 
                users={users}
              />
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ReportsPage;
