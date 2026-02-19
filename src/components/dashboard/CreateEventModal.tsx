// src/components/dashboard/CreateEventModal.tsx
// src/components/dashboard/CreateEventModal.tsx
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Image as ImageIcon, 
  Loader2, 
  Plus 
} from "lucide-react";
import API, { ENDPOINTS } from "@/lib/api-configs";
import { useToast } from "@/hooks/use-toast"; // Ensure this matches your project structure

const CreateEventModal = ({ onEventCreated }: { onEventCreated: () => void }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "Social",
    image: null as File | null
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("date", formData.date);
    data.append("location", formData.location);
    data.append("category", formData.category);
    
    if (formData.image) {
      // Must match upload.single('image') in your backend routes
      data.append("image", formData.image);
    }

    try {
      // EXPLICIT HEADERS: Ensures the image is sent as a file stream
      await API.post(ENDPOINTS.EVENTS.BASE, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      toast({ 
        title: "Event Published! 🇨🇮", 
        description: "Your meetup is now live for the Texas community." 
      });
      
      // Reset form
      setFormData({ title: "", description: "", date: "", location: "", category: "Social", image: null });
      setImagePreview(null);
      setOpen(false);
      
      onEventCreated(); 
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Could not create event",
        description: err.response?.data?.message || "Check your member level and try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white font-bold gap-2 rounded-full px-6 shadow-lg transition-transform hover:scale-105 active:scale-95">
          <Plus size={18} /> Create Event
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-gradient-to-br from-green-600 via-green-500 to-orange-500 p-8 text-white relative">
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase leading-none">
              Host a Meetup
            </DialogTitle>
            <p className="text-green-50 text-xs font-medium mt-1 opacity-90">
              Gather the community and keep the culture alive.
            </p>
          </DialogHeader>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-card">
          {/* Image Upload Area */}
          <div 
            className="relative h-44 w-full rounded-2xl border-2 border-dashed border-muted flex flex-col items-center justify-center overflow-hidden bg-muted/30 group cursor-pointer transition-colors hover:border-primary/50"
            onClick={() => document.getElementById('event-img')?.click()}
          >
            {imagePreview ? (
              <>
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                  Change Photo
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <ImageIcon size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Add Event Banner</span>
              </div>
            )}
            <input id="event-img" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Event Title</Label>
              <Input 
                placeholder="e.g. Dallas Garba Night" 
                required 
                className="rounded-xl border-muted bg-muted/20 h-11 focus:ring-primary"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Date & Time</Label>
                <div className="relative">
                  <Input 
                    type="datetime-local" 
                    required 
                    className="rounded-xl border-muted bg-muted/20 h-11 pl-9"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                  <CalendarIcon className="absolute left-3 top-3 text-muted-foreground" size={16} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Location</Label>
                <div className="relative">
                  <Input 
                    placeholder="Houston, TX" 
                    required 
                    className="rounded-xl border-muted bg-muted/20 h-11 pl-9"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                  <MapPin className="absolute left-3 top-3 text-muted-foreground" size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Description</Label>
              <Textarea 
                placeholder="Share the details (food, music, dress code)..." 
                className="rounded-xl border-muted bg-muted/20 min-h-[90px] resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-xl font-bold shadow-lg shadow-primary/20 mt-2 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} /> Publishing...
              </>
            ) : (
              "Publish Event"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;