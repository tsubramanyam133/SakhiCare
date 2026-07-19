'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { useDataStore } from '@/store/dataStore';

const MOCK_POSTS = [
  {
    id: 1,
    author: "Dr. Ananya Sharma",
    role: "Gynecologist",
    time: "2 hours ago",
    content: "Just a reminder: Cramps that prevent you from doing your daily activities are NOT normal. If you experience severe pain, please get checked for Endometriosis.",
    likes: 245,
    comments: 42,
    tags: ["HealthTip", "Endometriosis"]
  },
  {
    id: 2,
    author: "Priya Patel",
    role: "Community Member",
    time: "5 hours ago",
    content: "Has anyone tried yoga for PCOS management? I've been doing it for 3 months and my cycles are finally becoming regular! Would love to share my routine.",
    likes: 182,
    comments: 56,
    tags: ["PCOS", "Yoga", "Wellness"]
  },
  {
    id: 3,
    author: "NGO SAKHI",
    role: "Verified Organization",
    time: "1 day ago",
    content: "We are conducting a free menstrual hygiene camp in Dharavi tomorrow at 10 AM. Free sanitary pads will be distributed. Spread the word!",
    likes: 540,
    comments: 12,
    tags: ["Camp", "Mumbai", "Hygiene"]
  }
];

export default function CommunityPage() {
  const { user } = useUIStore();
  const { addNotification } = useDataStore();
  const [posts, setPosts] = useState<any[]>(MOCK_POSTS.map((p, index) => ({
    ...p,
    isLiked: false,
    commentsList: index === 1 ? [{ author: "Riya M.", content: "This is so helpful, thank you for sharing!", time: "1 hour ago" }] : []
  })));
  const [newPost, setNewPost] = useState('');
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const handlePost = () => {
    if (!newPost.trim()) return;

    const post = {
      id: Date.now(),
      author: user?.name ? `${user.name} (You)` : "Nyra (You)",
      role: "Community Member",
      time: "Just now",
      content: newPost,
      likes: 0,
      comments: 0,
      commentsList: [],
      tags: ["Discussion"],
      isLiked: false
    };

    setPosts([post, ...posts]);
    setNewPost('');

    // Add a notification so others can see it (simulated global notification)
    addNotification({
      message: `${user?.name || "A user"} just published a new post in the Community Forum!`,
      type: 'info'
    });
  };

  const handleLike = (id: number) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  const handleCommentToggle = (id: number) => {
    if (activeCommentId === id) {
      setActiveCommentId(null);
    } else {
      setActiveCommentId(id);
      setCommentText('');
    }
  };

  const submitComment = (id: number) => {
    if (!commentText.trim()) return;
    setPosts(posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          comments: p.comments + 1,
          commentsList: [...(p.commentsList || []), { author: user?.name || "Nyra", content: commentText, time: "Just now" }]
        };
      }
      return p;
    }));
    setCommentText('');
  };

  const handleDeletePost = (id: number) => {
    setPosts(posts.filter(p => p.id !== id));
    setMenuOpenId(null);
  };

  const handleEditPost = (id: number) => {
    alert('Edit post functionality would open a modal here in the full version!');
    setMenuOpenId(null);
  };

  const handleShare = async (content: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'SAKHI AI Community', text: content, url: window.location.href });
      } catch (err) {
        console.log('Share cancelled', err);
      }
    } else {
      alert('Demo: Post link copied to clipboard!');
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Forum</h1>
          <p className="text-muted-foreground mt-1">A safe space to share, ask, and support each other.</p>
        </div>
      </div>

      <Card className="border-pink-100 shadow-sm">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <Textarea
            placeholder="Share your experience or ask a question..."
            className="min-h-[100px] resize-none border-muted-foreground/20 focus-visible:ring-pink-500"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-full text-xs">Add Topic</Button>
              <Button variant="outline" size="sm" className="rounded-full text-xs">Anonymous</Button>
            </div>
            <Button onClick={handlePost} className="bg-pink-600 hover:bg-pink-700 text-white shadow-md rounded-full px-6">Post</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {posts.map(post => (
          <Card key={post.id} className="shadow-sm border-muted-foreground/10 hover:border-pink-200 transition-colors">
            <CardHeader className="pb-3 flex flex-row justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-300 flex items-center justify-center text-white font-bold text-lg">
                  {post.author[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base">{post.author}</h3>
                    {post.role !== "Community Member" && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0 text-[10px] px-1.5 py-0">
                        {post.role}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{post.time}</p>
                </div>
              </div>

              {/* Only show 3 dots if logged in user is the author */}
              {(user?.name && (post.author === user.name || post.author === `${user.name} (You)` || post.author.includes('(You)'))) && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => setMenuOpenId(menuOpenId === post.id ? null : post.id)}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>

                  {menuOpenId === post.id && (
                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-pink-100 py-1 z-10 animate-in fade-in zoom-in-95">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-pink-50 transition-colors"
                        onClick={() => handleEditPost(post.id)}
                      >
                        Edit Post
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        Delete Post
                      </button>
                    </div>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {post.isFeatured ? (
                <div className="bg-pink-50/50 backdrop-blur-sm rounded-xl p-6 border border-pink-100 shadow-inner mt-2 animate-in fade-in zoom-in-95 duration-500">
                  {post.title && (
                    <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <span className="text-2xl">👩‍⚕️</span> {post.title}
                    </h3>
                  )}
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs text-muted-foreground bg-muted/50">#{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex flex-col items-stretch border-t p-4 pb-4">
              <div className="flex justify-between w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className={post.isLiked ? "text-pink-600" : "text-muted-foreground hover:text-pink-600"}
                  onClick={() => handleLike(post.id)}
                >
                  <Heart className={cn("h-4 w-4 mr-2", post.isLiked && "fill-current")} /> {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-pink-600" onClick={() => handleCommentToggle(post.id)}>
                  <MessageCircle className="h-4 w-4 mr-2" /> {post.comments}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-pink-600" onClick={() => handleShare(post.content)}>
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
              </div>

              {activeCommentId === post.id && (
                <div className="mt-4 w-full animate-in fade-in slide-in-from-top-2 border-t pt-4">
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
                    {post.commentsList && post.commentsList.length > 0 ? (
                      post.commentsList.map((c: any, i: number) => (
                        <div key={i} className="flex flex-col gap-0.5 text-sm">
                          <div className="flex gap-2 items-baseline">
                            <span className="font-semibold text-slate-900">{c.author}</span>
                            <span className="text-slate-700">{c.content}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{c.time}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic text-center py-2">Comment </p>
                    )}
                  </div>
                  <div className="flex gap-2 w-full mt-2 relative">
                    <Input
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 focus-visible:ring-pink-500 rounded-full bg-muted/50 border-transparent hover:border-pink-200 pr-16"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') submitComment(post.id);
                      }}
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => submitComment(post.id)}
                      className="absolute right-1 top-1 text-pink-600 hover:text-pink-700 hover:bg-transparent font-semibold"
                      disabled={!commentText.trim()}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
