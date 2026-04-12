import prisma from "../config/database.js";

const seedCommunityPosts = async () => {
  console.log("🌱 Seeding community posts...");

  // Get all users
  const users = await prisma.user.findMany({
    take: 10,
  });

  if (users.length === 0) {
    console.log("❌ No users found. Seed users first.");
    return;
  }

  const posts = [
    {
      userId: users[0].id,
      content:
        "Just touched down on Glacio. The ice rings are absolutely stunning this time of year cycle! Anyone know a good place to get some liquid methane coffee?",
      imageUrl:
        "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop",
    },
    {
      userId: users[1]?.id || users[0].id,
      content:
        "First time experiencing 3x gravity on Kepler-186f. My bones hurt but the view of the binary sunset is worth it! 🌅 #InterstellarTravel",
      imageUrl:
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop",
    },
    {
      userId: users[2]?.id || users[0].id,
      content:
        "Volcania's magnetic interference is disrupting my logic circuits. Very unpleasant. Would not recommend for synthetic individuals.",
      imageUrl: null,
    },
    {
      userId: users[3]?.id || users[0].id,
      content:
        "Just booked my 5th interstellar journey! Starport Nexus made it so easy. The booking process was seamless and security checks were quick. 10/10 would recommend!",
      imageUrl: null,
    },
    {
      userId: users[4]?.id || users[0].id,
      content:
        "Anyone else experiencing that new zero-gravity sports arena on Nova Station? Game changer! Literally floating around playing graviton ball 🎾",
      imageUrl:
        "https://images.unsplash.com/photo-1516567867251-b7ef52d7e95f?q=80&w=1000&auto=format&fit=crop",
    },
    {
      userId: users[5]?.id || users[0].id,
      content:
        "The terran colonies are thriving! Just visited New Earth Settlement and the biodiversity is incredible. Best vacation ever!",
      imageUrl:
        "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=1000&auto=format&fit=crop",
    },
    {
      userId: users[6]?.id || users[0].id,
      content:
        "Looking for travel buddies for an expedition to the Andromeda sector! Departing next cycle, need 2-3 adventurous souls. Anyone interested?",
      imageUrl: null,
    },
    {
      userId: users[7]?.id || users[0].id,
      content:
        "My review of the new Cryogenic Sleep Pods: Absolutely phenomenal! Woke up refreshed without a single complaint. 5 stars ⭐⭐⭐⭐⭐",
      imageUrl: null,
    },
    {
      userId: users[8]?.id || users[0].id,
      content:
        "Crystal City on Proxima Oasis is the most beautiful place I've ever seen. The crystalline formations glow under the twin moons. A must-visit!",
      imageUrl:
        "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1000&auto=format&fit=crop",
    },
    {
      userId: users[9]?.id || users[0].id,
      content:
        "PSA: Always check your wormhole permits before traveling! Just had a minor hiccup at the Zephyr-7 checkpoint. Don't make my mistake! 😅",
      imageUrl: null,
    },
  ];

  // Create posts
  const createdPosts = await Promise.all(
    posts.map((post) =>
      prisma.post.create({
        data: post,
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
          likes: true,
          comments: true,
        },
      }),
    ),
  );

  console.log(`✅ Created ${createdPosts.length} posts`);

  // Add likes to posts
  const likePairs = [
    { postIndex: 0, userIndex: 1 },
    { postIndex: 0, userIndex: 2 },
    { postIndex: 0, userIndex: 3 },
    { postIndex: 1, userIndex: 0 },
    { postIndex: 1, userIndex: 3 },
    { postIndex: 1, userIndex: 4 },
    { postIndex: 1, userIndex: 5 },
    { postIndex: 2, userIndex: 0 },
    { postIndex: 2, userIndex: 6 },
    { postIndex: 3, userIndex: 1 },
    { postIndex: 3, userIndex: 2 },
    { postIndex: 3, userIndex: 4 },
    { postIndex: 4, userIndex: 0 },
    { postIndex: 4, userIndex: 2 },
    { postIndex: 4, userIndex: 5 },
    { postIndex: 4, userIndex: 7 },
    { postIndex: 5, userIndex: 1 },
    { postIndex: 5, userIndex: 3 },
    { postIndex: 5, userIndex: 8 },
    { postIndex: 6, userIndex: 0 },
    { postIndex: 6, userIndex: 2 },
    { postIndex: 6, userIndex: 8 },
    { postIndex: 7, userIndex: 0 },
    { postIndex: 7, userIndex: 1 },
    { postIndex: 7, userIndex: 3 },
    { postIndex: 7, userIndex: 5 },
    { postIndex: 7, userIndex: 6 },
    { postIndex: 8, userIndex: 0 },
    { postIndex: 8, userIndex: 2 },
    { postIndex: 8, userIndex: 4 },
    { postIndex: 8, userIndex: 7 },
    { postIndex: 9, userIndex: 1 },
    { postIndex: 9, userIndex: 5 },
  ];

  const likeCount = await Promise.all(
    likePairs.map((pair) =>
      prisma.like
        .create({
          data: {
            userId: users[pair.userIndex].id,
            postId: createdPosts[pair.postIndex].id,
          },
        })
        .catch(() => null),
    ),
  );

  console.log(`✅ Added ${likeCount.filter((l) => l).length} likes`);

  // Add comments
  const commentData = [
    {
      postIndex: 0,
      userIndex: 1,
      content: "Try the frozen geyser cafe near sector 4!",
    },
    {
      postIndex: 0,
      userIndex: 2,
      content: "That sounds amazing! Adding it to my bucket list.",
    },
    {
      postIndex: 1,
      userIndex: 0,
      content: "lol upgrade your shielding scrub",
    },
    { postIndex: 1, userIndex: 3, content: "Stay safe out there!" },
    {
      postIndex: 2,
      userIndex: 0,
      content: "Consider upgrading to latest synthetic models",
    },
    {
      postIndex: 3,
      userIndex: 2,
      content: "Same! I just booked my 3rd trip. The UI is so intuitive.",
    },
    {
      postIndex: 4,
      userIndex: 1,
      content: "Graviton ball looks insane! Is it hard to learn?",
    },
    {
      postIndex: 4,
      userIndex: 3,
      content: "Actually pretty easy once you get used to zero-g. Let's play!",
    },
    { postIndex: 5, userIndex: 2, content: "When can we visit together?" },
    {
      postIndex: 6,
      userIndex: 4,
      content: "I'm interested! When do you depart?",
    },
    { postIndex: 6, userIndex: 5, content: "Count me in!" },
    {
      postIndex: 7,
      userIndex: 2,
      content: "Agreed! Best sleep I've had in years!",
    },
    { postIndex: 8, userIndex: 1, content: "On my bucket list now!" },
    {
      postIndex: 9,
      userIndex: 3,
      content: "Thanks for the heads up! I'll check my permits.",
    },
  ];

  const comments = await Promise.all(
    commentData.map((comment) =>
      prisma.comment.create({
        data: {
          userId: users[comment.userIndex].id,
          postId: createdPosts[comment.postIndex].id,
          content: comment.content,
        },
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
      }),
    ),
  );

  console.log(`✅ Added ${comments.length} comments`);

  return { posts: createdPosts, comments, likes: likeCount };
};

export default seedCommunityPosts;
