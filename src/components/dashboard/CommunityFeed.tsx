import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, Heart, MessageSquare, Send, Trash2, 
  Image as ImageIcon, X, LayoutGrid, User, CornerDownRight 
} from "lucide-react";
import API, { ENDPOINTS } from "@/lib/api-configs";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

// --- THE FIX: Define Props at the top ---
interface CommunityFeedProps {
  currentUser: any;
  activeFilter?: string; // Optional if you're using internal tabs instead
}

const CommunityFeed = ({ currentUser }: CommunityFeedProps) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [newPost, setNewPost] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Comment/Reply States
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [replyTo, setReplyTo] = useState<{postId: string, commentId: string, name: string} | null>(null);

  const { toast } = useToast();

  const fetchFeed = async () => {
    try {
      const { data } = await API.get(ENDPOINTS.POSTS.FEED);
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch feed", err);
    }
  };

  useEffect(() => { fetchFeed(); }, []);

  const displayedPosts = activeTab === "all" 
    ? posts 
    : posts.filter((post: any) => post.author?._id === currentUser?._id);

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
      setActiveTab("all");
    } catch (err) {
      toast({ variant: "destructive", title: "Post failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (postId: string) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    try {
      const payload = {
        content: replyTo ? `@${replyTo.name} ${text}` : text,
        parentCommentId: replyTo?.commentId || null
      };

      await API.post(`${ENDPOINTS.POSTS.BASE}/${postId}/comments`, payload);
      setCommentText({ ...commentText, [postId]: "" });
      setReplyTo(null);
      fetchFeed();
    } catch (err) {
      toast({ variant: "destructive", title: "Comment failed" });
    }
  };

  const toggleComments = (postId: string) => {
    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
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
              className="min-h-[100px] bg-transparent border-none resize-none text-base focus-visible:ring-0 p-0"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            {imagePreview && (
              <div className="relative rounded-2xl overflow-hidden border border-border/50">
                <img src={imagePreview} className="w-full h-auto max-h-80 object-cover" />
                <button onClick={() => {setSelectedImage(null); setImagePreview("");}} className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"><X size={16}/></button>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-border/40">
              <input type="file" id="post-image" className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if(file) { setSelectedImage(file); setImagePreview(URL.createObjectURL(file)); }
              }} />
              <label htmlFor="post-image" className="p-2 text-primary hover:bg-primary/10 rounded-full cursor-pointer"><ImageIcon size={20} /></label>
              <Button onClick={handlePost} disabled={loading || (!newPost && !selectedImage)} className="rounded-full px-6 font-bold">Post</Button>
            </div>
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 rounded-full bg-muted/50 p-1">
          <TabsTrigger value="all" className="rounded-full gap-2 text-[10px] font-bold"><LayoutGrid size={14} /> Feed</TabsTrigger>
          <TabsTrigger value="mine" className="rounded-full gap-2 text-[10px] font-bold"><User size={14} /> My Posts</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {displayedPosts.map((post: any) => (
          <Card key={post._id} className="p-6 border-none shadow-md rounded-[2rem] bg-card overflow-hidden">
            {/* Post Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <Avatar><AvatarImage src={post.author?.profileImage} /></Avatar>
                <div>
                  <p className="font-black italic uppercase text-sm">{post.author?.firstName} {post.author?.lastName}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase flex items-center gap-1">
                    <MapPin size={10} className="text-primary" /> {post.location || "Texas"} • {post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) : ""} ago
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-4">{post.content}</p>
            {post.image && <img src={post.image} className="rounded-2xl mb-4 w-full h-auto max-h-[400px] object-cover" />}

            {/* Actions */}
            <div className="flex gap-6 py-3 border-y border-border/40">
              <button onClick={() => handleLike(post._id)} className={cn("flex items-center gap-1.5 text-xs font-bold", post.likes?.includes(currentUser?._id) ? "text-red-500" : "text-muted-foreground")}>
                <Heart size={18} fill={post.likes?.includes(currentUser?._id) ? "currentColor" : "none"} /> {post.likes?.length || 0}
              </button>
              <button onClick={() => toggleComments(post._id)} className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <MessageSquare size={18} /> {post.comments?.length || 0}
              </button>
            </div>

            {/* Comments Section */}
            {openComments[post._id] && (
              <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  {post.comments?.map((comment: any) => (
                    <div key={comment._id} className="flex gap-3">
                      <Avatar className="h-7 w-7"><AvatarImage src={comment.author?.profileImage} /></Avatar>
                      <div className="flex-1">
                        <div className="bg-muted/30 p-3 rounded-2xl">
                          <p className="text-[10px] font-black uppercase mb-1">{comment.author?.firstName} {comment.author?.lastName}</p>
                          <p className="text-xs">{comment.content}</p>
                        </div>
                        <button 
                          onClick={() => setReplyTo({ postId: post._id, commentId: comment._id, name: comment.author?.firstName })}
                          className="text-[9px] font-bold text-primary mt-1 ml-2 uppercase"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment Input */}
                <div className="flex gap-2 pt-2">
                  <Avatar className="h-8 w-8"><AvatarImage src={currentUser?.profileImage} /></Avatar>
                  <div className="flex-1 relative">
                    {replyTo?.postId === post._id && (
                      <div className="flex items-center justify-between bg-primary/5 px-3 py-1 rounded-t-xl border-x border-t border-primary/20">
                        <span className="text-[9px] font-bold text-primary italic flex items-center gap-1">
                          <CornerDownRight size={10} /> Replying to {replyTo.name}
                        </span>
                        <button onClick={() => setReplyTo(null)}><X size={10}/></button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Write a comment..." 
                        className={cn("bg-muted/30 border-none rounded-2xl text-xs", replyTo?.postId === post._id && "rounded-t-none")}
                        value={commentText[post._id] || ""}
                        onChange={(e) => setCommentText({...commentText, [post._id]: e.target.value})}
                        onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                      />
                      <Button size="icon" className="rounded-full shrink-0" onClick={() => handleComment(post._id)}>
                        <Send size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

// Simple Input shim if not imported
const Input = ({ className, ...props }: any) => (
  <input className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />
);

export default CommunityFeed;