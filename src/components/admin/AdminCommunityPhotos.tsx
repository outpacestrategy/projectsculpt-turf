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
import { Plus, Pencil, Trash2, Upload } from "lucide-react";

type CommunityPhoto = {
  id: string;
  image_url: string;
  name: string;
  age: number | null;
  testimonial: string;
  sort_order: number;
};

const AdminCommunityPhotos = () => {
  const [photos, setPhotos] = useState<CommunityPhoto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<CommunityPhoto | null>(null);
  const [form, setForm] = useState({ image_url: "", name: "", age: "" as string, testimonial: "", sort_order: 0 });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from("community_photos")
      .select("*")
      .order("sort_order");
    if (data) setPhotos(data);
  };

  useEffect(() => { fetchPhotos(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ image_url: "", name: "", age: "", testimonial: "", sort_order: photos.length });
    setIsModalOpen(true);
  };

  const openEdit = (p: CommunityPhoto) => {
    setEditing(p);
    setForm({ image_url: p.image_url, name: p.name, age: p.age?.toString() || "", testimonial: p.testimonial, sort_order: p.sort_order });
    setIsModalOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
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
    if (!form.image_url || !form.name) {
      toast({ title: "Image and name are required", variant: "destructive" });
      return;
    }

    const payload = {
      image_url: form.image_url,
      name: form.name,
      age: form.age ? parseInt(form.age) : null,
      testimonial: form.testimonial,
      sort_order: form.sort_order,
    };

    if (editing) {
      const { error } = await supabase.from("community_photos").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Update failed", variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("community_photos").insert(payload);
      if (error) { toast({ title: "Insert failed", variant: "destructive" }); return; }
    }

    toast({ title: editing ? "Photo updated" : "Photo added" });
    setIsModalOpen(false);
    fetchPhotos();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("community_photos").delete().eq("id", id);
    toast({ title: "Photo deleted" });
    fetchPhotos();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl">Community Photos & Testimonials</h3>
        <Button size="sm" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1" /> Add Photo
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group bg-card border border-border rounded-lg overflow-hidden">
            <img src={photo.image_url} alt={photo.name} className="w-full aspect-square object-cover" />
            <div className="p-2">
              <p className="text-sm font-semibold truncate">{photo.name}</p>
              <p className="text-xs text-muted-foreground truncate">{photo.testimonial}</p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => openEdit(photo)}>
                <Pencil className="w-3 h-3" />
              </Button>
              <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => handleDelete(photo.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editing ? "Edit Photo" : "Add Photo"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Image</Label>
              {form.image_url && (
                <img src={form.image_url} alt="Preview" className="w-full aspect-square object-cover rounded-lg mb-2" />
              )}
              <div className="flex gap-2">
                <label className="flex items-center gap-1.5 px-3 py-2 bg-secondary rounded-md cursor-pointer text-sm hover:bg-secondary/80 transition-colors">
                  <Upload className="w-4 h-4" />
                  {uploading ? "Uploading..." : "Upload"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                </label>
                <Input
                  placeholder="Or paste image URL"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Sarah K." />
              </div>
              <div>
                <Label>Age (optional)</Label>
                <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="26" />
              </div>
            </div>
            <div>
              <Label>Testimonial</Label>
              <Textarea value={form.testimonial} onChange={(e) => setForm({ ...form, testimonial: e.target.value })} placeholder="What they said..." />
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

export default AdminCommunityPhotos;
