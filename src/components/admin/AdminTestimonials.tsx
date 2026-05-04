import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type Testimonial = {
  id: string;
  quote: string;
  author_name: string;
  author_role: string;
  avatar_url: string;
  is_visible: boolean;
  sort_order: number;
};

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ quote: "", author_name: "", author_role: "", avatar_url: "", is_visible: true, sort_order: 0 });
  const { toast } = useToast();

  const fetchTestimonials = async () => {
    // Admin needs to see all testimonials including hidden ones
    // RLS only shows visible ones to anon, so we query as authenticated admin
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order");
    if (data) setTestimonials(data);
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ quote: "", author_name: "", author_role: "", avatar_url: "", is_visible: true, sort_order: testimonials.length });
    setIsModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ quote: t.quote, author_name: t.author_name, author_role: t.author_role || "", avatar_url: t.avatar_url || "", is_visible: t.is_visible, sort_order: t.sort_order });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.quote || !form.author_name) {
      toast({ title: "Quote and author name are required", variant: "destructive" });
      return;
    }

    if (editing) {
      const { error } = await supabase.from("testimonials").update(form).eq("id", editing.id);
      if (error) { toast({ title: "Update failed", variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("testimonials").insert(form);
      if (error) { toast({ title: "Insert failed", variant: "destructive" }); return; }
    }

    toast({ title: editing ? "Testimonial updated" : "Testimonial added" });
    setIsModalOpen(false);
    fetchTestimonials();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("testimonials").delete().eq("id", id);
    toast({ title: "Testimonial deleted" });
    fetchTestimonials();
  };

  const toggleVisibility = async (t: Testimonial) => {
    await supabase.from("testimonials").update({ is_visible: !t.is_visible }).eq("id", t.id);
    fetchTestimonials();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl">Text Testimonials</h3>
        <Button size="sm" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1" /> Add Testimonial
        </Button>
      </div>

      <div className="space-y-2">
        {testimonials.length === 0 && (
          <p className="text-muted-foreground text-sm py-8 text-center">No testimonials yet. Add your first one.</p>
        )}
        {testimonials.map((t) => (
          <div key={t.id} className={`flex items-start justify-between p-4 bg-card border border-border rounded-lg ${!t.is_visible ? "opacity-50" : ""}`}>
            <div className="flex-1 min-w-0">
              <p className="text-sm mb-1">"{t.quote}"</p>
              <p className="text-xs text-primary font-semibold">{t.author_name}</p>
              {t.author_role && <p className="text-xs text-muted-foreground">{t.author_role}</p>}
            </div>
            <div className="flex gap-1 ml-3 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleVisibility(t)}>
                {t.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(t.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editing ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Quote</Label>
              <Textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} placeholder="What they said..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Author Name</Label>
                <Input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} placeholder="Sarah K." />
              </div>
              <div>
                <Label>Role (optional)</Label>
                <Input value={form.author_role} onChange={(e) => setForm({ ...form, author_role: e.target.value })} placeholder="Member since 2024" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_visible} onCheckedChange={(v) => setForm({ ...form, is_visible: v })} />
              <Label>Visible on website</Label>
            </div>
            <div>
              <Label>Sort Order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button className="btn-primary flex-1" onClick={handleSave}>
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

export default AdminTestimonials;
