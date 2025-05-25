
import { useAuth } from '@/contexts/AuthContext';
import { useLibrary } from '@/contexts/library';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Transaction } from '@/data/mockData';
import DigitalPlayer from '@/components/DigitalPlayer';
import { Clock } from 'lucide-react';

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

  // Get usage time for a digital resource
  const getUsageTime = (resourceId: string) => {
    const savedUsage = localStorage.getItem(`usage-${resourceId}`);
    if (savedUsage) {
      const seconds = parseInt(savedUsage, 10);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else if (minutes > 0) {
        return `${minutes}m`;
      } else {
        return `${seconds}s`;
      }
    }
    return '0m';
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
          showPlayOption
          getUsageTime={getUsageTime}
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
            showPlayOption
            getUsageTime={getUsageTime}
          />
        )}
        
        {/* Return history */}
        {returned.length > 0 && (
          <ResourcesSection
            title="Previously Borrowed"
            transactions={returned}
            resources={resources}
            showReturnDate
            getUsageTime={getUsageTime}
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
  showPlayOption = false,
  getUsageTime,
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
  showPlayOption?: boolean;
  getUsageTime?: (resourceId: string) => string;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.map((transaction) => {
            const resource = resources.find(r => r.id === transaction.resourceId);
            if (!resource) return null;
            
            const fine = showFines && calculateFine ? calculateFine(transaction) : 0;
            const usageTime = getUsageTime ? getUsageTime(resource.id) : null;
            
            return (
              <Card key={transaction.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="h-16 w-12 flex-shrink-0">
                      <img className="h-16 w-12 object-cover rounded" src={resource.cover} alt={resource.title} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-library-800 truncate">{resource.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{resource.author}</p>
                      
                      <div className="mt-2 space-y-1 text-xs text-gray-600">
                        <p>Borrowed: {new Date(transaction.checkoutDate).toLocaleDateString()}</p>
                        <p>Due: {new Date(transaction.dueDate).toLocaleDateString()}</p>
                        {showReturnDate && transaction.returnDate && (
                          <p>Returned: {new Date(transaction.returnDate).toLocaleDateString()}</p>
                        )}
                        {resource.digital && usageTime && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <Clock className="h-3 w-3" />
                            <span>Usage: {usageTime}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {transaction.status === 'overdue' && (
                          <Badge variant="outline" className="text-red-600 bg-red-50">Overdue</Badge>
                        )}
                        
                        {resource.digital && (
                          <Badge variant="secondary" className="text-xs">Digital</Badge>
                        )}
                      </div>
                      
                      {showFines && fine > 0 && (
                        <p className="text-sm font-semibold text-red-600 mt-2">${fine.toFixed(2)} fine</p>
                      )}
                      
                      <div className="mt-3 space-y-2">
                        {showPlayOption && resource.digital && (
                          <DigitalPlayer resource={resource} />
                        )}
                        
                        {onReturn && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onReturn(transaction.id)}
                            className="w-full"
                          >
                            Return
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MyBooksPage;
