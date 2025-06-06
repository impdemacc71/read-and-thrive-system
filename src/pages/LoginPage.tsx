
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { users } from '@/data/mockData';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/catalog');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex">
      {/* Login form section - left side */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">UniLib Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the library system
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="your.email@university.edu"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-library-accent hover:bg-library-accent-dark"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6">
              <p className="text-sm text-center text-gray-500">
                Demo accounts (use any password):
              </p>
              <div className="mt-2 grid grid-cols-1 gap-2">
                {users.map(user => (
                  <Button
                    key={user.id}
                    variant="outline"
                    size="sm"
                    className="justify-start"
                    onClick={() => setEmail(user.email)}
                  >
                    <span className="mr-2">{user.email}</span>
                    <Badge role={user.role} />
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-xs text-gray-500">
              This is a demo application. No real authentication is performed.
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Background image section - right side */}
      <div className="hidden md:block md:w-1/2 bg-cover bg-center" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80')",
        }}
      >
        <div className="h-full w-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center p-8 max-w-lg">
            <h1 className="text-4xl font-bold text-white mb-4">Welcome to UniLib</h1>
            <p className="text-xl text-white">Your complete university library management system</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Badge = ({ role }: { role: string }) => {
  let bgColor;
  switch (role) {
    case 'admin':
      bgColor = 'bg-red-100 text-red-800';
      break;
    case 'librarian':
      bgColor = 'bg-blue-100 text-blue-800';
      break;
    default:
      bgColor = 'bg-green-100 text-green-800';
  }

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${bgColor}`}>
      {role}
    </span>
  );
};

export default LoginPage;
