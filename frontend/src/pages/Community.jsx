import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Share2, Image as ImageIcon, Send, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const INITIAL_POSTS = [
  {
    id: 1,
    author: "Zorblax_99",
    species: "Zorgon",
    avatar: "👽",
    content: "Just touched down on Glacio. The ice rings are absolutely stunning this time of year cycle! Anyone know a good place to get some liquid methane coffee?",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop",
    likes: 124,
    comments: [
        { author: "Kael_Nomad", text: "Try the frozen geyser cafe near sector 4!" }
    ],
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    author: "Human_Dave",
    species: "Terran",
    avatar: "🧑‍🚀",
    content: "First time experiencing 3x gravity on Kepler-186f. My bones hurt but the view of the binary sunset is worth it! 🌅 #InterstellarTravel",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop",
    likes: 892,
    comments: [],
    timestamp: "5 hours ago"
  },
  {
    id: 3,
    author: "Unit_734",
    species: "Silicon-Synth",
    avatar: "🤖",
    content: "Volcania's magnetic interference is disrupting my logic circuits. Very unpleasant. Would not recommend for synthetic individuals.",
    image: null,
    likes: 42,
    comments: [
        { author: "Zorblax_99", text: "lol upgrade your shielding scrub" },
        { author: "Human_Dave", text: "Stay safe out there! Avoid the active calderas." }
    ],
    timestamp: "1 cycle ago"
  }
];

const Community = () => {
    const { currentUser } = useAppContext();
    const [posts, setPosts] = useState(INITIAL_POSTS);
    const [newPost, setNewPost] = useState("");
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [commentText, setCommentText] = useState("");

    const handleLike = (id) => {
        setLikedPosts(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleCreatePost = (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        const post = {
            id: Date.now(),
            author: currentUser?.name || "Guest_Explorer",
            species: "Human", // Defaulting for demo
            avatar: "👨‍🚀",
            content: newPost,
            image: null,
            likes: 0,
            comments: [],
            timestamp: "Just now"
        };

        setPosts([post, ...posts]);
        setNewPost("");
    };

    const handleAddComment = (postId) => {
        if (!commentText.trim()) return;
        
        setPosts(posts.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    comments: [...p.comments, { author: currentUser?.name || "Guest", text: commentText }]
                };
            }
            return p;
        }));
        setCommentText("");
        setActiveCommentId(null);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-display font-bold text-white flex items-center gap-3">
                    <Sparkles className="text-neon-cyan" size={32} />
                    Holo-Net Feed
                </h1>
                <div className="text-xs uppercase tracking-widest text-gray-400 bg-space-800 px-4 py-2 rounded-full border border-white/10">
                    Intergalactic Community
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Create Post */}
                    <div className="glass-panel p-4 rounded-xl">
                        <form onSubmit={handleCreatePost}>
                            <div className="flex gap-3">
                                <div className="text-2xl mt-1">👨‍🚀</div>
                                <div className="flex-1">
                                    <textarea 
                                        value={newPost}
                                        onChange={(e) => setNewPost(e.target.value)}
                                        placeholder="Transmit your thoughts across the galaxy..."
                                        className="w-full bg-space-900 border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-neon-cyan resize-none"
                                        rows={3}
                                    />
                                    <div className="flex justify-between items-center mt-3">
                                        <button type="button" className="text-gray-400 hover:text-neon-cyan transition-colors p-2 bg-space-800 rounded-full">
                                            <ImageIcon size={18} />
                                        </button>
                                        <button type="submit" disabled={!newPost.trim()} className="bg-neon-purple hover:bg-fuchsia-600 disabled:opacity-50 disabled:bg-gray-600 text-white px-6 py-2 rounded-full text-sm font-bold tracking-wide flex items-center gap-2 transition-colors">
                                            <Send size={16} /> Broadcast
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Feed Posts */}
                    {posts.map(post => {
                        const isLiked = likedPosts.has(post.id);
                        return (
                            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-5 rounded-xl">
                                {/* Post Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-space-800 rounded-full flex items-center justify-center text-xl border border-white/10">
                                            {post.avatar}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-white font-bold text-sm hover:text-neon-cyan cursor-pointer transition-colors">{post.author}</h3>
                                                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 uppercase tracking-widest">{post.species}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">{post.timestamp}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                    {post.content}
                                </p>

                                {/* Post Image */}
                                {post.image && (
                                    <div className="w-full h-64 bg-space-900 rounded-lg mb-4 overflow-hidden border border-white/5">
                                        <img src={post.image} alt="Holo-Net visual" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                    </div>
                                )}

                                {/* Post Actions */}
                                <div className="flex items-center gap-6 pt-3 border-t border-white/10">
                                    <button 
                                        onClick={() => handleLike(post.id)} 
                                        className={`flex items-center gap-2 text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                                    >
                                        <Heart size={18} fill={isLiked ? "currentColor" : "none"} /> 
                                        {post.likes + (isLiked ? 1 : 0)}
                                    </button>
                                    <button 
                                        onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
                                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-neon-cyan transition-colors"
                                    >
                                        <MessageSquare size={18} /> 
                                        {post.comments.length}
                                    </button>
                                    <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors ml-auto">
                                        <Share2 size={18} />
                                    </button>
                                </div>

                                {/* Comments Section */}
                                {activeCommentId === post.id && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-white/5 space-y-3">
                                        {post.comments.map((comment, idx) => (
                                            <div key={idx} className="bg-space-900/50 p-3 rounded-lg flex items-start gap-2">
                                                <div className="font-bold text-white text-xs">{comment.author}:</div>
                                                <div className="text-gray-300 text-xs flex-1">{comment.text}</div>
                                            </div>
                                        ))}
                                        
                                        <div className="flex gap-2 mt-2">
                                            <input 
                                                type="text" 
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                placeholder="Add a transmission..."
                                                className="flex-1 bg-space-900 border border-white/10 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-neon-cyan"
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                            />
                                            <button onClick={() => handleAddComment(post.id)} className="bg-white/10 p-2 rounded-full hover:bg-neon-cyan/20 transition-colors text-neon-cyan">
                                                <Send size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="glass-panel p-5 rounded-xl">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Trending Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {['#WormholeTravel', '#GlacioIceRings', '#ZeroG', '#Terraforming', '#XenoBiology'].map(tag => (
                                <span key={tag} className="text-xs text-neon-cyan bg-neon-cyan/10 px-2 py-1 rounded cursor-pointer hover:bg-neon-cyan/20 transition-colors">{tag}</span>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-5 rounded-xl">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Top Explorers</h3>
                        <div className="space-y-3">
                            {['Zorblax_99', 'Nova_Rider', 'Unit_734'].map((user, i) => (
                                <div key={user} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-space-800 border border-white/10 flex items-center justify-center text-xs">
                                            {i === 0 ? '👽' : i === 1 ? '👩‍🚀' : '🤖'}
                                        </div>
                                        <span className="text-sm text-gray-300">{user}</span>
                                    </div>
                                    <button className="text-[10px] uppercase font-bold text-neon-purple hover:text-fuchsia-400 transition-colors tracking-widest">Follow</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;
