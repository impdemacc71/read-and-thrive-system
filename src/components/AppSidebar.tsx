
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar
} from "@/components/ui/sidebar";
import { Book, BookOpen, LayoutDashboard, Library, LineChart, LogOut, Users } from "lucide-react";
import { Button } from "./ui/button";

const AppSidebar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const { toggleSidebar } = useSidebar();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader>
        <Link 
          to="/catalog" 
          className="flex items-center gap-2 px-4 py-3"
        >
          <Library className="h-6 w-6 text-library-accent" />
          <span className="font-semibold text-lg">UniLib</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/catalog")}>
                  <Link to="/catalog">
                    <Book className="mr-2" />
                    <span>Catalog</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {currentUser?.role === 'student' && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/my-books")}>
                    <Link to="/my-books">
                      <BookOpen className="mr-2" />
                      <span>My Books</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {(currentUser?.role === 'librarian' || currentUser?.role === 'admin') && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/manage-books")}>
                      <Link to="/manage-books">
                        <LayoutDashboard className="mr-2" />
                        <span>Manage Books</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/reports")}>
                      <Link to="/reports">
                        <LineChart className="mr-2" />
                        <span>Reports</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {currentUser?.role === 'admin' && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive("/user-management")}>
                        <Link to="/user-management">
                          <Users className="mr-2" />
                          <span>Users</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <div className="p-4">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
