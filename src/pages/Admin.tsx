import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Calendar, Users, UserCog, HelpCircle } from "lucide-react";
import AdminSchedule from "@/components/admin/AdminSchedule";
import AdminCommunityPhotos from "@/components/admin/AdminCommunityPhotos";
import AdminCoaches from "@/components/admin/AdminCoaches";
import NoIndex from "@/components/NoIndex";

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login", { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <NoIndex title="Admin Dashboard | Project Sculpt" />
      {/* Header */}
      <header className="border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-wide">Admin Dashboard</h1>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/guide")}>
            <HelpCircle className="w-4 h-4 mr-1" /> Guide
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            View Site
          </Button>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-1" /> Sign Out
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-5xl">
        <Tabs defaultValue="schedule">
          <TabsList className="mb-6 w-full sm:w-auto">
            <TabsTrigger value="schedule" className="gap-1.5">
              <Calendar className="w-4 h-4" /> Schedule
            </TabsTrigger>
            <TabsTrigger value="community" className="gap-1.5">
              <Users className="w-4 h-4" /> Community
            </TabsTrigger>
            <TabsTrigger value="coaches" className="gap-1.5">
              <UserCog className="w-4 h-4" /> Coaches
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <AdminSchedule />
          </TabsContent>
          <TabsContent value="community">
            <AdminCommunityPhotos />
          </TabsContent>
          <TabsContent value="coaches">
            <AdminCoaches />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
