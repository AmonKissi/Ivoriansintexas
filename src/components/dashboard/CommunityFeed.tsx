import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Heart, MessageSquare, Send } from "lucide-react";
import API, { ENDPOINTS } from "@/lib/api-configs";

const CommunityFeed = ({ currentUser }: { currentUser: any }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  const fetchFeed = async () => {
    const { data } = await API.get(ENDPOINTS.POSTS.FEED);
    setPosts(data);
  };

  useEffect(() => { fetchFeed(); }, []);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    try {
      await API.post(ENDPOINTS.POSTS.CREATE, { 
        content: newPost, 
        location: currentUser?.city 
      });
      setNewPost("");
      fetchFeed();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Create Post */}
      <Card className="p-4 shadow-sm border-none">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser?.profileImage} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea 
              placeholder="What's happening in your part of Texas?" 
              className="min-h-[100px] bg-muted/30 border-none resize-none focus-visible:ring-1"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin size={12} /> {currentUser?.city || "Texas"}
              </span>
              <Button size="sm" onClick={handlePost} disabled={!newPost}>
                Post <Send size={14} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Feed List */}
      <div className="space-y-4">
        {posts.map((post: any) => (
          <Card key={post._id} className="p-4 border-none shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src={post.author?.profileImage} />
                  <AvatarFallback>{post.author?.firstName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-sm">{post.author?.firstName} {post.author?.lastName}</p>
                  <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                    <MapPin size={10} /> {post.location || post.author?.city}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm leading-relaxed">{post.content}</p>
            <div className="flex gap-4 pt-2 border-t text-muted-foreground">
              <button className="flex items-center gap-1 text-xs hover:text-primary transition-colors">
                <Heart size={16} /> {post.likes?.length || 0}
              </button>
              <button className="flex items-center gap-1 text-xs hover:text-primary transition-colors">
                <MessageSquare size={16} /> {post.comments?.length || 0}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;