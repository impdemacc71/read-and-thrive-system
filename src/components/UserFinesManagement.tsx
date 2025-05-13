
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Transaction, User } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface UserFinesManagementProps {
  users: User[];
  transactions: Transaction[];
  calculateFine: (transaction: Transaction) => number;
}

const UserFinesManagement: React.FC<UserFinesManagementProps> = ({ users, transactions, calculateFine }) => {
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = () => {
    const foundUser = users.find(user => user.email.toLowerCase() === searchEmail.toLowerCase());
    
    if (foundUser) {
      setSelectedUserId(foundUser.id);
    } else {
      toast({
        title: "User Not Found",
        description: "No user found with that email address.",
        variant: "destructive"
      });
      setSelectedUserId(null);
    }
  };

  // Get user transactions if a user is selected
  const userTransactions = selectedUserId
    ? transactions.filter(t => t.userId === selectedUserId)
    : [];

  // Calculate total fines
  const totalFines = userTransactions.reduce((sum, t) => sum + calculateFine(t), 0);
  
  // Get user info
  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>User Fines Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="email-search">Search User by Email</Label>
              <Input 
                id="email-search" 
                placeholder="user@email.com" 
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedUser.name}'s Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 border rounded-md bg-slate-50">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Total Fines</p>
                  <p className={`font-bold ${totalFines > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${totalFines.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {userTransactions.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left">Resource</th>
                      <th className="p-2 text-left">Checkout Date</th>
                      <th className="p-2 text-left">Due Date</th>
                      <th className="p-2 text-left">Return Date</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userTransactions.map((transaction) => {
                      const fine = calculateFine(transaction);
                      return (
                        <tr key={transaction.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">{transaction.resourceId}</td>
                          <td className="p-2">{transaction.checkoutDate}</td>
                          <td className="p-2">{transaction.dueDate}</td>
                          <td className="p-2">{transaction.returnDate || "Not returned"}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              transaction.status === 'borrowed' ? 'bg-blue-100 text-blue-800' :
                              transaction.status === 'returned' ? 'bg-green-100 text-green-800' :
                              transaction.status === 'reserved' ? 'bg-purple-100 text-purple-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="p-2">
                            {fine > 0 ? (
                              <span className="text-red-600 font-medium">${fine.toFixed(2)}</span>
                            ) : (
                              <span className="text-green-600">$0.00</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">No transactions found for this user.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserFinesManagement;
