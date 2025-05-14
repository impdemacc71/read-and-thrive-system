
import { useAuth } from '@/contexts/AuthContext';
import { useLibrary } from '@/contexts/library';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Transaction } from '@/data/mockData';

const MyBooksPage = () => {
  const { currentUser } = useAuth();
  const { transactions, resources, returnResource } = useLibrary();
  
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Not Authorized</h1>
        <p className="mb-8">You need to log in to view your resources.</p>
        <Link to="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    );
  }
  
  // Get user transactions
  const userTransactions = transactions.filter(t => t.userId === currentUser.id);
  
  // Group transactions by status
  const borrowed = userTransactions.filter(t => t.status === 'borrowed');
  const overdue = userTransactions.filter(t => t.status === 'overdue');
  const returned = userTransactions.filter(t => t.status === 'returned');
  
  // Calculate fines for overdue books
  const calculateFine = (transaction: Transaction) => {
    if (transaction.status !== 'overdue') return 0;
    
    const dueDate = new Date(transaction.dueDate);
    const today = new Date();
    const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
    
    return daysOverdue * 1; // $1 per day
  };
  
  const totalFines = overdue.reduce((sum, transaction) => sum + calculateFine(transaction), 0);
  
  const handleReturn = (transactionId: string) => {
    returnResource(transactionId);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-library-800">My Resources</h1>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard title="Currently Borrowed" value={borrowed.length.toString()} />
        <SummaryCard title="Overdue" value={overdue.length.toString()} variant="warning" />
        <SummaryCard title="Total Fines" value={`$${totalFines.toFixed(2)}`} variant={totalFines > 0 ? "error" : "default"} />
      </div>
      
      {/* Resources sections */}
      <div className="space-y-10">
        {/* Borrowed resources */}
        <ResourcesSection
          title="Currently Borrowed"
          transactions={borrowed}
          resources={resources}
          onReturn={handleReturn}
          emptyMessage="You don't have any resources borrowed currently."
        />
        
        {/* Overdue resources */}
        {overdue.length > 0 && (
          <ResourcesSection
            title="Overdue Resources"
            transactions={overdue}
            resources={resources}
            onReturn={handleReturn}
            variant="warning"
            showFines
            calculateFine={calculateFine}
          />
        )}
        
        {/* Return history */}
        {returned.length > 0 && (
          <ResourcesSection
            title="Previously Borrowed"
            transactions={returned}
            resources={resources}
            showReturnDate
          />
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ 
  title, 
  value, 
  variant = 'default' 
}: { 
  title: string;
  value: string;
  variant?: 'default' | 'warning' | 'error';
}) => {
  let colorClass;
  switch (variant) {
    case 'warning':
      colorClass = 'bg-amber-50 border-amber-200 text-amber-700';
      break;
    case 'error':
      colorClass = 'bg-red-50 border-red-200 text-red-700';
      break;
    default:
      colorClass = 'bg-blue-50 border-blue-200 text-blue-700';
  }
  
  return (
    <Card className={`${colorClass} border`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};

const ResourcesSection = ({ 
  title, 
  transactions, 
  resources, 
  onReturn, 
  variant = 'default',
  emptyMessage = "No resources to display.",
  showReturnDate = false,
  showFines = false,
  calculateFine,
}: { 
  title: string;
  transactions: Transaction[];
  resources: any[];
  onReturn?: (id: string) => void;
  variant?: 'default' | 'warning' | 'error';
  emptyMessage?: string;
  showReturnDate?: boolean;
  showFines?: boolean;
  calculateFine?: (transaction: Transaction) => number;
}) => {
  let headerClass;
  switch (variant) {
    case 'warning':
      headerClass = 'text-amber-700';
      break;
    case 'error':
      headerClass = 'text-red-700';
      break;
    default:
      headerClass = 'text-library-700';
  }
  
  return (
    <section>
      <h2 className={`text-2xl font-semibold mb-4 ${headerClass}`}>{title}</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{emptyMessage}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Checkout Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                {showReturnDate && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>}
                {showFines && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine</th>}
                {onReturn && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => {
                const resource = resources.find(r => r.id === transaction.resourceId);
                if (!resource) return null;
                
                const fine = showFines && calculateFine ? calculateFine(transaction) : 0;
                
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 object-cover" src={resource.cover} alt={resource.title} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-library-800">{resource.title}</div>
                          <div className="text-sm text-gray-500">{resource.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{new Date(transaction.checkoutDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(transaction.dueDate).toLocaleDateString()}
                        {transaction.status === 'overdue' && (
                          <Badge variant="outline" className="ml-2 text-red-600 bg-red-50">Overdue</Badge>
                        )}
                      </div>
                    </td>
                    {showReturnDate && (
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {transaction.returnDate ? new Date(transaction.returnDate).toLocaleDateString() : '-'}
                        </div>
                      </td>
                    )}
                    {showFines && (
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-red-600">${fine.toFixed(2)}</div>
                      </td>
                    )}
                    {onReturn && (
                      <td className="px-6 py-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onReturn(transaction.id)}
                        >
                          Return
                        </Button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default MyBooksPage;
