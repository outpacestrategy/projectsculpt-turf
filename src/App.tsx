import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useRouteTracking } from "@/hooks/useRouteTracking";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Index from "./pages/Index";
import Schedule from "./pages/Schedule";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import Hyrox from "./pages/Hyrox";
import PersonalTraining from "./pages/PersonalTraining";
import GroupFitness from "./pages/GroupFitness";
import Running from "./pages/Running";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminGuide from "./pages/AdminGuide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Route-change pageview tracking + scroll-to-top must live inside <BrowserRouter>
const AppRoutes = () => {
  useScrollToTop();
  useRouteTracking();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/hyrox" element={<Hyrox />} />
      <Route path="/personal-training" element={<PersonalTraining />} />
      <Route path="/group-fitness" element={<GroupFitness />} />
      <Route path="/running" element={<Running />} />
      <Route path="/team" element={<Team />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/guide" element={<AdminGuide />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
