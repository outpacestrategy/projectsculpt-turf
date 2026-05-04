import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";

const DAYS = [
  { value: 0, label: "Monday", short: "MON" },
  { value: 1, label: "Tuesday", short: "TUE" },
  { value: 2, label: "Wednesday", short: "WED" },
  { value: 3, label: "Thursday", short: "THU" },
  { value: 4, label: "Friday", short: "FRI" },
  { value: 5, label: "Saturday", short: "SAT" },
  { value: 6, label: "Sunday", short: "SUN" },
];

type ScheduleClass = {
  id: string;
  day_of_week: number;
  day_name: string;
  day_tag: string;
  time: string;
  end_time: string;
  title: string;
  coach: string;
  sort_order: number;
};

const emptyForm = {
  day_of_week: 0,
  day_name: "Monday",
  day_tag: "",
  time: "",
  end_time: "",
  title: "",
  coach: "",
  sort_order: 0,
};

const AdminSchedule = () => {
  const [classes, setClasses] = useState<ScheduleClass[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ScheduleClass | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [dayTags, setDayTags] = useState<Record<number, string>>({});
  const { toast } = useToast();

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from("schedule_classes")
      .select("*")
      .order("day_of_week")
      .order("sort_order");
    if (data) {
      setClasses(data);
      // Extract day tags
      const tags: Record<number, string> = {};
      data.forEach((c) => { if (c.day_tag) tags[c.day_of_week] = c.day_tag; });
      setDayTags(tags);
    }
    if (error) toast({ title: "Error loading schedule", variant: "destructive" });
  };

  useEffect(() => { fetchClasses(); }, []);

  const dayClasses = classes.filter((c) => c.day_of_week === selectedDay);

  const openAdd = () => {
    const dayInfo = DAYS[selectedDay];
    setEditingClass(null);
    setForm({ ...emptyForm, day_of_week: selectedDay, day_name: dayInfo.label, day_tag: dayTags[selectedDay] || "", sort_order: dayClasses.length });
    setIsModalOpen(true);
  };

  const openEdit = (cls: ScheduleClass) => {
    setEditingClass(cls);
    setForm({
      day_of_week: cls.day_of_week,
      day_name: cls.day_name,
      day_tag: cls.day_tag,
      time: cls.time,
      end_time: cls.end_time,
      title: cls.title,
      coach: cls.coach,
      sort_order: cls.sort_order,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.time || !form.end_time || !form.title || !form.coach) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    if (editingClass) {
      const { error } = await supabase
        .from("schedule_classes")
        .update(form)
        .eq("id", editingClass.id);
      if (error) { toast({ title: "Update failed", variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("schedule_classes").insert(form);
      if (error) { toast({ title: "Insert failed", variant: "destructive" }); return; }
    }

    // Update day_tag for all classes on this day
    if (form.day_tag) {
      await supabase
        .from("schedule_classes")
        .update({ day_tag: form.day_tag })
        .eq("day_of_week", form.day_of_week);
    }

    toast({ title: editingClass ? "Class updated" : "Class added" });
    setIsModalOpen(false);
    fetchClasses();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("schedule_classes").delete().eq("id", id);
    if (error) { toast({ title: "Delete failed", variant: "destructive" }); return; }
    toast({ title: "Class deleted" });
    fetchClasses();
  };

  return (
    <div>
      {/* Day picker */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {DAYS.map((day) => (
          <button
            key={day.value}
            onClick={() => setSelectedDay(day.value)}
            className={`py-2 px-1 rounded-lg border text-center text-xs font-bold transition-all ${
              selectedDay === day.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:border-primary/50"
            }`}
          >
            {day.short}
            {dayTags[day.value] && (
              <span className={`block text-[9px] mt-0.5 font-medium ${selectedDay === day.value ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {dayTags[day.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Day Tag */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-xl">{DAYS[selectedDay].label}</h3>
          <Input
            placeholder="Day tag (e.g. UPPER)"
            value={dayTags[selectedDay] || ""}
            onChange={async (e) => {
              const newTag = e.target.value.toUpperCase();
              setDayTags((prev) => ({ ...prev, [selectedDay]: newTag }));
              await supabase
                .from("schedule_classes")
                .update({ day_tag: newTag })
                .eq("day_of_week", selectedDay);
            }}
            className="w-32 h-8 text-xs uppercase"
          />
        </div>
        <Button size="sm" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1" /> Add Class
        </Button>
      </div>

      {/* Classes list */}
      <div className="space-y-2">
        {dayClasses.length === 0 && (
          <p className="text-muted-foreground text-sm py-8 text-center">No classes for this day. Add one above.</p>
        )}
        {dayClasses.map((cls) => (
          <div key={cls.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
            <div>
              <span className="text-sm font-semibold">{cls.time} – {cls.end_time}</span>
              <span className="text-muted-foreground mx-2">·</span>
              <span className="font-display text-lg">{cls.title}</span>
              <span className="text-muted-foreground mx-2">·</span>
              <span className="text-sm text-muted-foreground">{cls.coach}</span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => openEdit(cls)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(cls.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingClass ? "Edit Class" : "Add Class"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Time</Label>
                <Input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="7:00 AM" />
              </div>
              <div>
                <Label>End Time</Label>
                <Input value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} placeholder="7:45 AM" />
              </div>
            </div>
            <div>
              <Label>Class Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Upper + Core" />
            </div>
            <div>
              <Label>Coach</Label>
              <Input value={form.coach} onChange={(e) => setForm({ ...form, coach: e.target.value })} placeholder="Coach Drew" />
            </div>
            <div>
              <Label>Sort Order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button className="btn-primary flex-1" onClick={handleSave}>
                {editingClass ? "Update" : "Add"}
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

export default AdminSchedule;
