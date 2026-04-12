import Post from "../models/Post.js";
import { validate, schemas } from "../utils/validators.js";
import { HTTP_STATUS, ERRORS } from "../config/constants.js";

const PostController = {
  // Create a new post
  createPost: async (req, res, next) => {
    try {
      const { content, imageUrl } = req.body;

      if (!content || content.trim().length === 0) {
        const error = new Error("Post content is required");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
      }

      const post = await Post.create(req.userId, content, imageUrl || null);

      res.status(HTTP_STATUS.CREATED).json({ post });
    } catch (error) {
      next(error);
    }
  },

  // Get all posts
  getAllPosts: async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const posts = await Post.findAll(limit, offset);

      // Transform posts to match frontend format
      const transformedPosts = posts.map((post) => ({
        id: post.id,
        author: post.user.email.split("@")[0],
        species: "Terran", // Default, could be extended
        avatar: "👨‍🚀", // Default, could be user-based
        content: post.content,
        image: post.imageUrl,
        likes: post.likes.length,
        comments: post.comments.map((c) => ({
          author: c.user.email.split("@")[0],
          text: c.content,
          id: c.id,
        })),
        timestamp: new Date(post.createdAt),
        postId: post.id,
        userId: post.userId,
      }));

      res.json({ posts: transformedPosts });
    } catch (error) {
      next(error);
    }
  },

  // Get single post
  getPostById: async (req, res, next) => {
    try {
      const post = await Post.findById(parseInt(req.params.postId));

      if (!post) {
        const error = new Error(ERRORS.NOT_FOUND);
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
      }

      const transformedPost = {
        id: post.id,
        author: post.user.email.split("@")[0],
        species: "Terran",
        avatar: "👨‍🚀",
        content: post.content,
        image: post.imageUrl,
        likes: post.likes.length,
        comments: post.comments.map((c) => ({
          author: c.user.email.split("@")[0],
          text: c.content,
          id: c.id,
        })),
        timestamp: new Date(post.createdAt),
      };

      res.json({ post: transformedPost });
    } catch (error) {
      next(error);
    }
  },

  // Delete post
  deletePost: async (req, res, next) => {
    try {
      const postId = parseInt(req.params.postId);
      const post = await Post.findById(postId);

      if (!post) {
        const error = new Error(ERRORS.NOT_FOUND);
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
      }

      if (post.userId !== req.userId) {
        const error = new Error("You can only delete your own posts");
        error.statusCode = HTTP_STATUS.FORBIDDEN;
        throw error;
      }

      await Post.delete(postId);

      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      next(error);
    }
  },

  // Like a post
  likePost: async (req, res, next) => {
    try {
      const postId = parseInt(req.params.postId);
      const post = await Post.findById(postId);

      if (!post) {
        const error = new Error(ERRORS.NOT_FOUND);
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
      }

      // Check if already liked
      const existingLike = post.likes.find((l) => l.userId === req.userId);
      if (existingLike) {
        await Post.removeLike(req.userId, postId);
        res.json({ message: "Like removed" });
      } else {
        await Post.addLike(req.userId, postId);
        res.json({ message: "Post liked" });
      }
    } catch (error) {
      next(error);
    }
  },

  // Add comment to post
  addComment: async (req, res, next) => {
    try {
      const postId = parseInt(req.params.postId);
      const { content } = req.body;

      if (!content || content.trim().length === 0) {
        const error = new Error("Comment content is required");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
      }

      const post = await Post.findById(postId);
      if (!post) {
        const error = new Error(ERRORS.NOT_FOUND);
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
      }

      const comment = await Post.addComment(req.userId, postId, content);

      res.status(HTTP_STATUS.CREATED).json({
        comment: {
          id: comment.id,
          author: comment.user.email.split("@")[0],
          text: comment.content,
          timestamp: new Date(comment.createdAt),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete comment
  deleteComment: async (req, res, next) => {
    try {
      const commentId = parseInt(req.params.commentId);

      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment) {
        const error = new Error(ERRORS.NOT_FOUND);
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
      }

      if (comment.userId !== req.userId) {
        const error = new Error("You can only delete your own comments");
        error.statusCode = HTTP_STATUS.FORBIDDEN;
        throw error;
      }

      await Post.deleteComment(commentId);

      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default PostController;
