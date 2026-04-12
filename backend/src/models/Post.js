import prisma from "../config/database.js";

const Post = {
  create: async (userId, content, imageUrl) => {
    return prisma.post.create({
      data: {
        userId,
        content,
        imageUrl,
      },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  },

  findAll: async (limit = 50, offset = 0) => {
    return prisma.post.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  findById: async (postId) => {
    return prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  findByUserId: async (userId, limit = 50, offset = 0) => {
    return prisma.post.findMany({
      where: { userId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  },

  delete: async (postId) => {
    return prisma.post.delete({
      where: { id: postId },
    });
  },

  addLike: async (userId, postId) => {
    return prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
  },

  removeLike: async (userId, postId) => {
    return prisma.like.deleteMany({
      where: { userId, postId },
    });
  },

  addComment: async (userId, postId, content) => {
    return prisma.comment.create({
      data: {
        userId,
        postId,
        content,
      },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
  },

  deleteComment: async (commentId) => {
    return prisma.comment.delete({
      where: { id: commentId },
    });
  },

  getPostStats: async (postId) => {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });
    return post;
  },
};

export default Post;
