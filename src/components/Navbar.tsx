
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-library-accent"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span className="text-xl font-bold text-library-700">University Library</span>
        </Link>

        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex gap-4">
                <Link to="/catalog" className="text-library-600 hover:text-library-800">
                  Catalog
                </Link>
                {currentUser?.role === 'student' && (
                  <Link to="/my-books" className="text-library-600 hover:text-library-800">
                    My Books
                  </Link>
                )}
                {(currentUser?.role === 'librarian' || currentUser?.role === 'admin') && (
                  <>
                    <Link to="/manage-books" className="text-library-600 hover:text-library-800">
                      Manage Books
                    </Link>
                    <Link to="/reports" className="text-library-600 hover:text-library-800">
                      Reports
                    </Link>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <span className="hidden md:inline text-sm text-library-500">
                  {currentUser?.name} ({currentUser?.role})
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <Link to="/login">
              <Button variant="default">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
