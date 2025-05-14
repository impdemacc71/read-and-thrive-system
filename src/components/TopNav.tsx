
import { useAuth } from "@/contexts/AuthContext";
import { SidebarTrigger } from "./ui/sidebar";
import { User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TopNav = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <SidebarTrigger />
      
      <div className="flex items-center gap-3">
        <span className="text-sm mr-2 hidden sm:inline">
          {currentUser?.name}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
              <Avatar className="h-8 w-8 bg-library-200">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="flex justify-between">
              <span>{currentUser?.name}</span>
              <span className="bg-library-100 text-library-600 px-2 py-0.5 rounded text-xs font-medium">
                {currentUser?.role}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>{currentUser?.email}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNav;
