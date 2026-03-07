import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WatchPage from "./pages/WatchPage";
import CategoryPage, { CategoriesPage } from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminPlaylists from "./pages/admin/AdminPlaylists";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminFeatured from "./pages/admin/AdminFeatured";
import AdminViews from "./pages/admin/AdminViews";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/watch/:id" element={<WatchPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminAnalytics />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="playlists" element={<AdminPlaylists />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="featured" element={<AdminFeatured />} />
            <Route path="views" element={<AdminViews />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
