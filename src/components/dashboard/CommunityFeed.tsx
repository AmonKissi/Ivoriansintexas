import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, Heart, MessageSquare, Send, Trash2, 
  Image as ImageIcon, X, LayoutGrid, User, CornerDownRight,
  Loader2, Newspaper, Shield, ShieldCheck, ShieldAlert, Flag
} from "lucide-react";
import API, { ENDPOINTS } from "@/lib/api-configs";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import defaultProfile from "@/assets/default.png";
import { getRoleColor, getRoleName, useUserRole } from "@/hooks/useUserRole";

interface CommunityFeedProps {
  currentUser: any;
  activeFilter?: string; 
}

const RoleBadge = ({ level }: { level: number }) => {
  if (!level || level < 2) return null;
  const Icon = level >= 6 ? ShieldAlert : level >= 5 ? ShieldCheck : Shield;
  return (
    <span className={cn(
      "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8px] uppercase tracking-tighter border ml-2 shadow-sm",
      getRoleColor(level)
    )}>
      <Icon size={10} strokeWidth={3} />
      {getRoleName(level)}
    </span>
  );
};

const CommunityFeed = ({ currentUser }: CommunityFeedProps) => {
  const { isOwner, isAdmin, isModerator } = useUserRole();
  const [posts, setPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [newPost, setNewPost] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  
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

  // --- ACTIONS ---

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
      await fetchFeed();
      setActiveTab("all");
      toast({ title: "Akwaba!", description: "Your post is live in Texas." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Transmission Failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("CRITICAL: Permanently delete this post?")) return;
    try {
      await API.delete(`${ENDPOINTS.POSTS.BASE}/${postId}`);
      toast({ title: "Post Purged", description: "Registry updated." });
      fetchFeed();
    } catch (err) {
      toast({ variant: "destructive", title: "Delete Failed" });
    }
  };

  const handleReportPost = async (postId: string) => {
    const reason = window.prompt("Why are you flagging this content? (Spam, Harassment, etc.)");
    if (!reason) return;
    try {
      await API.post(`${ENDPOINTS.POSTS.BASE}/${postId}/report`, { reason });
      toast({ title: "Report Logged", description: "Admins have been notified." });
    } catch (err) {
      toast({ variant: "destructive", title: "Report Failed" });
    }
  };

  const handleComment = async (postId: string) => {
    const text = commentText[postId];
    if (!text?.trim()) return;
    try {
      const payload = { content: replyTo && replyTo.postId === postId ? `@${replyTo.name} ${text}` : text };
      await API.post(`${ENDPOINTS.POSTS.BASE}/${postId}/comment`, payload);
      setCommentText(prev => ({ ...prev, [postId]: "" }));
      setReplyTo(null);
      await fetchFeed();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Comment Failed" });
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!window.confirm("Delete this comment permanently?")) return;
    try {
      await API.delete(`${ENDPOINTS.POSTS.BASE}/${postId}/comments/${commentId}`);
      toast({ title: "Comment Erased" });
      fetchFeed();
    } catch (err) {
      toast({ variant: "destructive", title: "Delete Failed" });
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await API.put(`${ENDPOINTS.POSTS.BASE}/${postId}/like`);
      await fetchFeed();
    } catch (err) { console.error(err); }
  };

const handleLikeComment = async (postId: string, commentId: string) => {
  try {
    // Uses the new config: /api/posts/:postId/comment/:commentId/like
    await API.put(ENDPOINTS.POSTS.LIKE_COMMENT(postId, commentId));
    await fetchFeed();
  } catch (err) {
    console.error("Like comment failed:", err);
  }
};

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-10">
      {/* Create Post */}
      <Card className="p-5 shadow-lg border-none rounded-[2rem] bg-card/80 backdrop-blur-md border border-white/10">
        <div className="flex gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src={currentUser?.profileImage || defaultProfile} />
            <AvatarFallback>{currentUser?.firstName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Textarea 
              placeholder="Broadcast to Texas..." 
              className="min-h-[100px] bg-transparent border-none resize-none text-base focus-visible:ring-0 p-0 font-medium"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            {imagePreview && (
              <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-inner">
                <img src={imagePreview} className="w-full h-auto max-h-80 object-cover" alt="Preview" />
                <button onClick={() => {setSelectedImage(null); setImagePreview("");}} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white backdrop-blur-md"><X size={16}/></button>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-border/40">
              <input type="file" id="post-image" className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if(file) { setSelectedImage(file); setImagePreview(URL.createObjectURL(file)); }
              }} />
              <label htmlFor="post-image" className="p-2 text-primary hover:bg-primary/10 rounded-full cursor-pointer transition-colors"><ImageIcon size={20} /></label>
              <Button onClick={handlePost} disabled={loading || (!newPost.trim() && !selectedImage)} className="rounded-full px-8 font-black uppercase tracking-widest shadow-lg">
                {loading ? <Loader2 className="animate-spin" size={16} /> : "Send"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 rounded-full bg-muted/50 p-1 border border-border/20">
          <TabsTrigger value="all" className="rounded-full gap-2 text-[10px] font-bold uppercase"><LayoutGrid size={14} /> Global Pulse</TabsTrigger>
          <TabsTrigger value="mine" className="rounded-full gap-2 text-[10px] font-bold uppercase"><User size={14} /> My Transmissions</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {displayedPosts.map((post: any) => (
            <Card key={post._id} className="p-6 border-none shadow-xl rounded-[2.5rem] bg-card/60 backdrop-blur-sm overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 border border-primary/10"><AvatarImage src={post.author?.profileImage || defaultProfile} /></Avatar>
                  <div>
                    <div className="flex items-center">
                      <p className="font-black italic uppercase text-sm leading-tight tracking-tighter">{post.author?.firstName} {post.author?.lastName}</p>
                      <RoleBadge level={post.author?.level} />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase flex items-center gap-1 mt-0.5 opacity-60">
                      <MapPin size={10} className="text-primary" /> {post.location || "Texas"} • {post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) : ""} ago
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <button onClick={() => handleReportPost(post._id)} className="p-2 text-muted-foreground hover:text-amber-500 transition-colors opacity-40 hover:opacity-100">
                    <Flag size={14} />
                  </button>
                  {(post.author?._id === currentUser?._id || isModerator || isAdmin || isOwner) && (
                    <button onClick={() => handleDeletePost(post._id)} className="p-2 text-muted-foreground hover:text-red-600 transition-colors opacity-40 hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-4 whitespace-pre-wrap font-medium">{post.content}</p>
              {post.image && <img src={post.image} className="rounded-[1.5rem] mb-4 w-full h-auto max-h-[500px] object-cover border border-border/20" alt="Post content" />}

              <div className="flex gap-6 py-3 border-y border-border/10">
                <button onClick={() => handleLike(post._id)} className={cn("flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all", post.likes?.includes(currentUser?._id) ? "text-red-500" : "text-muted-foreground hover:text-primary")}>
                  <Heart size={18} fill={post.likes?.includes(currentUser?._id) ? "currentColor" : "none"} /> {post.likes?.length || 0}
                </button>
                <button onClick={() => setOpenComments(prev => ({ ...prev, [post._id]: !prev[post._id] }))} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                  <MessageSquare size={18} /> {post.comments?.length || 0}
                </button>
              </div>

              {openComments[post._id] && (
                <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {post.comments?.map((comment: any) => (
                      <div key={comment._id} className="flex gap-3 group">
                        <Avatar className="h-8 w-8"><AvatarImage src={comment.user?.profileImage || defaultProfile} /></Avatar>
                        <div className="flex-1">
                          <div className="bg-muted/30 p-3 rounded-2xl relative border border-border/5">
                            <div className="flex items-center mb-1">
                              <p className="text-[10px] font-black uppercase leading-none">{comment.user?.firstName} {comment.user?.lastName}</p>
                              <RoleBadge level={comment.user?.level} />
                            </div>
                            <p className="text-xs text-foreground/80">{comment.text}</p>
                            
                            {(comment.user?._id === currentUser?._id || isModerator || isAdmin || isOwner) && (
                              <button onClick={() => handleDeleteComment(post._id, comment._id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-red-500 transition-all">
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                          <div className="flex gap-4 items-center mt-1 ml-2">
                            <button onClick={() => setReplyTo({ postId: post._id, commentId: comment._id, name: comment.user?.firstName })} className="text-[9px] font-black text-primary uppercase hover:underline">Reply</button>
                            <button onClick={() => handleLikeComment(post._id, comment._id)} className={cn("text-[9px] font-black uppercase flex items-center gap-1", comment.likes?.includes(currentUser?._id) ? "text-red-500" : "text-muted-foreground")}>
                              <Heart size={10} fill={comment.likes?.includes(currentUser?._id) ? "currentColor" : "none"} /> {comment.likes?.length || 0}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border/10">
                    <Avatar className="h-8 w-8"><AvatarImage src={currentUser?.profileImage || defaultProfile} /></Avatar>
                    <div className="flex-1 relative">
                      {replyTo?.postId === post._id && (
                        <div className="flex items-center justify-between bg-primary/10 px-3 py-1.5 rounded-t-xl border-x border-t border-primary/20">
                          <span className="text-[9px] font-black text-primary italic flex items-center gap-1 uppercase tracking-tighter"><CornerDownRight size={10} /> Syncing with {replyTo.name}</span>
                          <button onClick={() => setReplyTo(null)} className="text-primary hover:text-red-500"><X size={10}/></button>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input 
                          placeholder="Broadcast a response..." 
                          className={cn("flex h-10 w-full bg-muted/20 border-none rounded-2xl px-4 text-xs focus:ring-1 focus:ring-primary/20 transition-all outline-none", replyTo?.postId === post._id && "rounded-t-none")}
                          value={commentText[post._id] || ""}
                          onChange={(e) => setCommentText({...commentText, [post._id]: e.target.value})}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleComment(post._id); }}
                        />
                        <Button size="icon" className="rounded-full shrink-0 shadow-md" onClick={() => handleComment(post._id)} disabled={!commentText[post._id]?.trim()}><Send size={14} /></Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityFeed;