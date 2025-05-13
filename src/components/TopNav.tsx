
import { useAuth } from "@/contexts/AuthContext";
import { SidebarTrigger } from "./ui/sidebar";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

const TopNav = () => {
  const { currentUser } = useAuth();

  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <SidebarTrigger />
      
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-500 mr-2">
          {currentUser?.name} 
          <span className="ml-2 bg-library-100 text-library-600 px-2 py-0.5 rounded text-xs font-medium">
            {currentUser?.role}
          </span>
        </div>
        <Avatar className="h-8 w-8 bg-library-200">
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default TopNav;
