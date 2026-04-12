import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Share2, Image as ImageIcon, Send, Sparkles, Loader } from 'lucide-react';
import { useUserContext } from '../context/UserContext';
import postService from '../services/postService';

const Community = () => {
    const { user, isAuthenticated } = useUserContext();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState("");
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const imageInputRef = React.useRef(null);

    // Fetch posts on component mount
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            console.log('[Community] Fetching posts from backend...');
            const response = await postService.getAllPosts(50, 0);
            const postsList = response.posts || response;
            console.log('[Community] Posts loaded:', postsList.length);
            setPosts(Array.isArray(postsList) ? postsList : []);
        } catch (error) {
            console.error('[Community] Error fetching posts:', error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadPostImage = async (file) => {
        try {
            setUploadingImage(true);
            console.log('[Community] Starting image upload...');
            const { imageUrl } = await postService.uploadImage(file);
            console.log('[Community] Image uploaded successfully:', imageUrl);
            return imageUrl;
        } catch (error) {
            console.error('[Community] Image upload failed:', error);
            alert('Image upload failed: ' + (error.message || 'Unknown error'));
            return null;
        } finally {
            setUploadingImage(false);
        }
    };

    const handleLike = async (id) => {
        if (!isAuthenticated) {
            alert('Please login to like posts');
            return;
        }

        try {
            console.log('[Community] Liking post:', id);
            await postService.toggleLike(id);
            setLikedPosts(prev => {
                const next = new Set(prev);
                if (next.has(id)) {
                    next.delete(id);
                } else {
                    next.add(id);
                }
                return next;
            });
        } catch (error) {
            console.error('[Community] Error liking post:', error);
            alert('Failed to like post');
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        if (!isAuthenticated) {
            alert('Please login to post');
            return;
        }

        try {
            setUploading(true);
            console.log('[Community] Creating post...');
            
            let imageUrl = null;
            if (selectedImage) {
                imageUrl = await uploadPostImage(selectedImage);
                if (!imageUrl) {
                    setUploading(false);
                    return;
                }
            }

            const response = await postService.createPost(newPost, imageUrl);
            console.log('[Community] Post created successfully');
            
            // Add new post to the top of the list
            setPosts([response.post || response, ...posts]);
            setNewPost("");
            setSelectedImage(null);
            setImagePreview(null);
            if (imageInputRef.current) {
                imageInputRef.current.value = '';
            }
        } catch (error) {
            console.error('[Community] Error creating post:', error);
            alert('Failed to create post: ' + (error.message || 'Unknown error'));
        } finally {
            setUploading(false);
        }
    };

    const handleAddComment = async (postId) => {
        if (!commentText.trim()) return;
        
        if (!isAuthenticated) {
            alert('Please login to comment');
            return;
        }

        try {
            console.log('[Community] Adding comment to post:', postId);
            await postService.addComment(postId, commentText);
            
            // Refresh posts to show new comment
            await fetchPosts();
            setCommentText("");
            setActiveCommentId(null);
        } catch (error) {
            console.error('[Community] Error adding comment:', error);
            alert('Failed to add comment');
        }
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
                    {isAuthenticated && (
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
                                        
                                        {/* Image Preview */}
                                        {imagePreview && (
                                            <div className="relative mt-3 mb-3 w-full h-48 rounded-lg overflow-hidden border border-white/10">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImagePreview(null);
                                                        setSelectedImage(null);
                                                        if (imageInputRef.current) imageInputRef.current.value = '';
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-bold"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center mt-3">
                                            <input 
                                                ref={imageInputRef}
                                                type="file" 
                                                accept="image/*" 
                                                onChange={handleImageSelect}
                                                className="hidden"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => imageInputRef.current?.click()}
                                                disabled={uploadingImage}
                                                className="text-gray-400 hover:text-neon-cyan disabled:opacity-50 transition-colors p-2 bg-space-800 rounded-full"
                                            >
                                                <ImageIcon size={18} />
                                            </button>
                                            <button 
                                                type="submit"
                                                disabled={!newPost.trim() || uploading || uploadingImage}
                                                className="bg-neon-purple hover:bg-fuchsia-600 disabled:opacity-50 disabled:bg-gray-600 text-white px-6 py-2 rounded-full text-sm font-bold tracking-wide flex items-center gap-2 transition-colors"
                                            >
                                                {uploading || uploadingImage ? (
                                                    <>
                                                        <Loader size={16} className="animate-spin" /> 
                                                        {uploadingImage ? 'Uploading Image...' : 'Posting...'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send size={16} /> Broadcast
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Posts Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center min-h-64">
                            <Loader size={32} className="animate-spin text-neon-cyan" />
                        </div>
                    )}

                    {/* Feed Posts */}
                    {!loading && posts.length === 0 && (
                        <div className="glass-panel p-8 rounded-xl text-center">
                            <p className="text-gray-400">No posts yet. Be the first to broadcast your thoughts!</p>
                        </div>
                    )}

                    {!loading && posts.map(post => {
                        const isLiked = likedPosts.has(post.id || post.postId);
                        return (
                            <motion.div key={post.id || post.postId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-5 rounded-xl">
                                {/* Post Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-space-800 rounded-full flex items-center justify-center text-xl border border-white/10">
                                            {post.avatar || "👨‍🚀"}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-white font-bold text-sm hover:text-neon-cyan cursor-pointer transition-colors">{post.author}</h3>
                                                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 uppercase tracking-widest">{post.species || 'Terran'}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {typeof post.timestamp === 'string' ? post.timestamp : new Date(post.timestamp).toLocaleDateString()}
                                            </p>
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
                                        onClick={() => handleLike(post.id || post.postId)} 
                                        className={`flex items-center gap-2 text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                                    >
                                        <Heart size={18} fill={isLiked ? "currentColor" : "none"} /> 
                                        {post.likes + (isLiked ? 1 : 0)}
                                    </button>
                                    <button 
                                        onClick={() => setActiveCommentId(activeCommentId === (post.id || post.postId) ? null : (post.id || post.postId))}
                                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-neon-cyan transition-colors"
                                    >
                                        <MessageSquare size={18} /> 
                                        {post.comments?.length || 0}
                                    </button>
                                    <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors ml-auto">
                                        <Share2 size={18} />
                                    </button>
                                </div>

                                {/* Comments Section */}
                                {activeCommentId === (post.id || post.postId) && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-white/5 space-y-3">
                                        {post.comments?.map((comment, idx) => (
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
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id || post.postId)}
                                            />
                                            <button 
                                                onClick={() => handleAddComment(post.id || post.postId)}
                                                className="bg-white/10 p-2 rounded-full hover:bg-neon-cyan/20 transition-colors text-neon-cyan"
                                            >
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
