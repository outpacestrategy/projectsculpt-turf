import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Upload } from "lucide-react";

type Coach = {
  id: string;
  name: string;
  role: string;
  certifications: string;
  bio: string;
  image_url: string;
  sort_order: number;
};

const AdminCoaches = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coach | null>(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    certifications: "",
    bio: "",
    image_url: "",
    sort_order: 0,
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchCoaches = async () => {
    const { data } = await supabase
      .from("coaches")
      .select("*")
      .order("sort_order");
    if (data) setCoaches(data);
  };

  useEffect(() => {
    fetchCoaches();

    const channel = supabase
      .channel("coaches-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "coaches" }, () => {
        fetchCoaches();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", role: "", certifications: "", bio: "", image_url: "", sort_order: coaches.length });
    setIsModalOpen(true);
  };

  const openEdit = (c: Coach) => {
    setEditing(c);
    setForm({
      name: c.name,
      role: c.role,
      certifications: c.certifications,
      bio: c.bio,
      image_url: c.image_url,
      sort_order: c.sort_order,
    });
    setIsModalOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileName = `coaches/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("community-photos")
      .upload(fileName, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: publicUrl } = supabase.storage
      .from("community-photos")
      .getPublicUrl(data.path);
    setForm((prev) => ({ ...prev, image_url: publicUrl.publicUrl }));
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.role) {
      toast({ title: "Name and role are required", variant: "destructive" });
      return;
    }

    const payload = {
      name: form.name,
      role: form.role,
      certifications: form.certifications,
      bio: form.bio,
      image_url: form.image_url,
      sort_order: form.sort_order,
    };

    if (editing) {
      const { error } = await supabase.from("coaches").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("coaches").insert(payload);
      if (error) { toast({ title: "Insert failed", description: error.message, variant: "destructive" }); return; }
    }

    toast({ title: editing ? "Coach updated" : "Coach added" });
    setIsModalOpen(false);
    fetchCoaches();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("coaches").delete().eq("id", id);
    toast({ title: "Coach deleted" });
    fetchCoaches();
  };

  const moveCoach = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= coaches.length) return;

    const a = coaches[index];
    const b = coaches[swapIndex];

    await Promise.all([
      supabase.from("coaches").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("coaches").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);

    fetchCoaches();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl">Coaches</h3>
        <Button size="sm" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1" /> Add Coach
        </Button>
      </div>

      <div className="space-y-3">
        {coaches.map((coach, index) => (
          <div key={coach.id} className="flex items-center gap-3 bg-card border border-border rounded-lg p-3">
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveCoach(index, "up")} disabled={index === 0}>
                <ArrowUp className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveCoach(index, "down")} disabled={index === coaches.length - 1}>
                <ArrowDown className="w-3 h-3" />
              </Button>
            </div>
            {coach.image_url && (
              <img src={coach.image_url} alt={coach.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{coach.name}</p>
              <p className="text-xs text-primary truncate">{coach.role}</p>
              <p className="text-xs text-muted-foreground truncate">{coach.certifications}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => openEdit(coach)}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(coach.id)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editing ? "Edit Coach" : "Add Coach"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Marcus Johnson" />
            </div>
            <div>
              <Label>Role</Label>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Head Coach" />
            </div>
            <div>
              <Label>Certifications</Label>
              <Input value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} placeholder="NSCA-CSCS, HYROX Pro Coach" />
            </div>
            <div>
              <Label>Photo</Label>
              {form.image_url && (
                <img src={form.image_url} alt="Preview" className="w-20 h-20 rounded-full object-cover mb-2" />
              )}
              <div className="flex gap-2">
                <label className="flex items-center gap-1.5 px-3 py-2 bg-secondary rounded-md cursor-pointer text-sm hover:bg-secondary/80 transition-colors">
                  <Upload className="w-4 h-4" />
                  {uploading ? "Uploading..." : "Upload"}
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleUpload} disabled={uploading} />
                </label>
                <Input
                  placeholder="Or paste image URL"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Coach bio..." rows={3} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button className="flex-1" onClick={handleSave}>
                {editing ? "Update" : "Add"}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCoaches;
