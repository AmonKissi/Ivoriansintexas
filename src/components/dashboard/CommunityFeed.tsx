// src/components/dashboard/CommunityFeed.tsx
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Heart, MessageSquare, Send, Trash2, Image as ImageIcon, X } from "lucide-react";
import API, { ENDPOINTS } from "@/lib/api-configs";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns"; // Recommended for timestamps

const CommunityFeed = ({ currentUser }: { currentUser: any }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchFeed = async () => {
    const { data } = await API.get(ENDPOINTS.POSTS.FEED);
    setPosts(data);
  };

  useEffect(() => { fetchFeed(); }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePost = async () => {
    if (!newPost.trim() && !selectedImage) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("content", newPost);
    formData.append("location", currentUser?.city || "Texas");
    if (selectedImage) formData.append("image", selectedImage);

    try {
      await API.post(ENDPOINTS.POSTS.CREATE, formData);
      setNewPost("");
      setSelectedImage(null);
      setImagePreview("");
      fetchFeed();
    } catch (err) {
      toast({ variant: "destructive", title: "Post failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      await API.delete(`${ENDPOINTS.POSTS.BASE}/${postId}`);
      fetchFeed();
    } catch (err) {
      toast({ variant: "destructive", title: "Delete failed" });
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await API.put(`${ENDPOINTS.POSTS.BASE}/${postId}/like`);
      fetchFeed();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-10">
      {/* Create Post Card */}
      <Card className="p-5 shadow-lg border-none rounded-[2rem] bg-card/80 backdrop-blur-md">
        <div className="flex gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src={currentUser?.profileImage} />
            <AvatarFallback>{currentUser?.firstName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Textarea 
              placeholder="What's happening in your part of Texas?" 
              className="min-h-[120px] bg-muted/20 border-none resize-none text-base focus-visible:ring-0 p-0"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            
            {imagePreview && (
              <div className="relative rounded-2xl overflow-hidden border">
                <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-80 object-cover" />
                <button 
                  onClick={() => {setSelectedImage(null); setImagePreview("");}}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-border/40">
              <div className="flex gap-2">
                <input type="file" id="post-image" className="hidden" accept="image/*" onChange={handleImageSelect} />
                <label htmlFor="post-image" className="p-2 text-primary hover:bg-primary/10 rounded-full cursor-pointer transition-colors">
                  <ImageIcon size={20} />
                </label>
              </div>
              <Button 
                onClick={handlePost} 
                disabled={loading || (!newPost && !selectedImage)}
                className="rounded-full px-6 font-bold"
              >
                {loading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Feed List */}
      <div className="space-y-4">
        {posts.map((post: any) => (
          <Card key={post._id} className="p-6 border-none shadow-md rounded-[2rem] hover:shadow-lg transition-shadow bg-card relative">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={post.author?.profileImage} />
                  <AvatarFallback>{post.author?.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black italic uppercase text-sm tracking-tighter">
                      {post.author?.firstName} {post.author?.lastName}
                    </p>
                    <span className="text-[10px] text-muted-foreground">• {formatDistanceToNow(new Date(post.createdAt))} ago</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 uppercase">
                    <MapPin size={10} className="text-primary" /> {post.location}
                  </p>
                </div>
              </div>
              
              {currentUser?._id === post.author?._id && (
                <button onClick={() => handleDelete(post._id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* Content */}
            <p className="text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
            
            {post.image && (
              <div className="rounded-2xl overflow-hidden mb-4 border border-border/50">
                <img src={post.image} className="w-full h-auto object-cover" alt="Post content" />
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex gap-6 pt-4 border-t border-border/40">
              <button 
                onClick={() => handleLike(post._id)}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${post.likes?.includes(currentUser?._id) ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
              >
                <Heart size={18} fill={post.likes?.includes(currentUser?._id) ? "currentColor" : "none"} />
                {post.likes?.length || 0}
              </button>
              <button className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                <MessageSquare size={18} />
                {post.comments?.length || 0}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;