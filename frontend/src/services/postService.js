import api from "./api";

const postService = {
  /**
   * Get all community posts
   * @param {object} filters - Query filters
   * @return {Promise} { posts }
   */
  getAllPosts: async (limit = 50, offset = 0) => {
    try {
      const response = await api.get("/posts", {
        params: { limit, offset },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create a new post
   * @param {string} content - Post content
   * @param {string} imageUrl - Optional image URL
   * @returns {Promise} { post }
   */
  createPost: async (content, imageUrl) => {
    try {
      const response = await api.post("/posts", {
        content,
        imageUrl,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get a single post by ID
   * @param {number} postId
   * @returns {Promise} { post }
   */
  getPostById: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a post
   * @param {number} postId
   * @returns {Promise}
   */
  deletePost: async (postId) => {
    try {
      const response = await api.delete(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Like/unlike a post
   * @param {number} postId
   * @returns {Promise}
   */
  toggleLike: async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Add a comment to a post
   * @param {number} postId
   * @param {string} content - Comment content
   * @returns {Promise}
   */
  addComment: async (postId, content) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, { content });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a comment
   * @param {number} commentId
   * @returns {Promise}
   */
  deleteComment: async (commentId) => {
    try {
      const response = await api.delete(`/posts/comments/${commentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default postService;
