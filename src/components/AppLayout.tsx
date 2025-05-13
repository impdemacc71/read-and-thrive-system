
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import HomePage from "@/pages/HomePage";
import CatalogPage from "@/pages/CatalogPage";
import BookDetailsPage from "@/pages/BookDetailsPage";
import MyBooksPage from "@/pages/MyBooksPage";
import ManageBooksPage from "@/pages/ManageBooksPage";
import ReportsPage from "@/pages/ReportsPage";
import NotFound from "@/pages/NotFound";
import AppSidebar from "./AppSidebar";
import TopNav from "./TopNav";

const AppLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav />
        <div className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/book/:id" element={<BookDetailsPage />} />
            <Route path="/my-books" element={<MyBooksPage />} />
            <Route path="/manage-books" element={<ManageBooksPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
