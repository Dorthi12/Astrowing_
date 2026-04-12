import prisma from "../config/database.js";

// Simple password hash (in production, use bcryptjs)
const hashedPassword =
  "$2a$10$YQvzKdLKXIvT/NSHD5H4GejfZ7KSs8b5Zj7KzJ/KXEeKf5K5K6L4G";

const seedAllData = async () => {
  console.log("🌱 Starting comprehensive seed...\n");

  try {
    // 1. SEED PLANETS
    console.log("[1/5] 🌍 Seeding planets...");
    const planetsData = [
      {
        name: "Zephyr-7",
        description:
          "A crystalline wonder with floating cities and aurora skies",
        imageUrl: "https://via.placeholder.com/400x300?text=Zephyr-7",
        basePrice: 1200,
        features: {
          attractions: [
            "Aurora Displays",
            "Crystal Caves",
            "Zero Gravity Zones",
          ],
        },
      },
      {
        name: "Kepler Prime",
        description:
          "Ancient ruins and advanced civilization intertwined in harmony",
        imageUrl: "https://via.placeholder.com/400x300?text=Kepler+Prime",
        basePrice: 1500,
        features: { attractions: ["Ancient Ruins", "Tech Hubs", "Museums"] },
      },
      {
        name: "Proxima Oasis",
        description:
          "Lush green planet with vast ecosystems and exotic wildlife",
        imageUrl: "https://via.placeholder.com/400x300?text=Proxima+Oasis",
        basePrice: 950,
        features: {
          attractions: ["Rainforests", "Safari Tours", "Biodiversity"],
        },
      },
      {
        name: "Nova Station",
        description:
          "Massive space station hub with entertainment and commerce",
        imageUrl: "https://via.placeholder.com/400x300?text=Nova+Station",
        basePrice: 800,
        features: { attractions: ["Shopping", "Restaurants", "Entertainment"] },
      },
      {
        name: "Celestia",
        description:
          "Paradise planet with pristine beaches and tropical climate",
        imageUrl: "https://via.placeholder.com/400x300?text=Celestia",
        basePrice: 2000,
        features: { attractions: ["Beaches", "Resorts", "Water Sports"] },
      },
    ];

    for (const planet of planetsData) {
      await prisma.planet.upsert({
        where: { name: planet.name },
        update: {},
        create: planet,
      });
    }
    console.log("✅ Planets seeded\n");

    // 2. SEED USERS
    console.log("[2/5] 👥 Seeding users with alien profiles...");
    const usersData = [
      {
        email: "zorblax@zorgon.space",
        firstName: "Zorblax",
        lastName: "99",
        species: "Zorgon",
        avatar: "👽",
      },
      {
        email: "human_dave@terra.com",
        firstName: "Dave",
        lastName: "Johnson",
        species: "Terran",
        avatar: "🧑‍🚀",
      },
      {
        email: "unit734@synthetic.ai",
        firstName: "Unit",
        lastName: "734",
        species: "Silicon-Synth",
        avatar: "🤖",
      },
      {
        email: "kael_nomad@explorer.io",
        firstName: "Kael",
        lastName: "Nomad",
        species: "Kepler",
        avatar: "👾",
      },
      {
        email: "luna_starlight@traveler.com",
        firstName: "Luna",
        lastName: "Starlight",
        species: "Celestian",
        avatar: "✨",
      },
      {
        email: "cosmic_chad@adventure.org",
        firstName: "Chad",
        lastName: "Cosmic",
        species: "Nova",
        avatar: "🌟",
      },
      {
        email: "nova_nova@station.net",
        firstName: "Nova",
        lastName: "Nova",
        species: "Station-Born",
        avatar: "🛸",
      },
      {
        email: "zephyr_wind@crystal.com",
        firstName: "Zephyr",
        lastName: "Wind",
        species: "Crystal-Being",
        avatar: "💎",
      },
      {
        email: "oasis_traveler@nature.bio",
        firstName: "Oasis",
        lastName: "Traveler",
        species: "Bio-Organic",
        avatar: "🌿",
      },
      {
        email: "celestial_vibes@paradise.sky",
        firstName: "Celestial",
        lastName: "Vibes",
        species: "Energy-Form",
        avatar: "⚡",
      },
    ];

    const hashedPassword =
      "$2a$10$YQvzKdLKXIvT/NSHD5H4GejfZ7KSs8b5Zj7KzJ/KXEeKf5K5K6L4G";
    const createdUsers = [];

    for (const user of usersData) {
      const existing = await prisma.user.findUnique({
        where: { email: user.email },
      });
      if (!existing) {
        const created = await prisma.user.create({
          data: {
            email: user.email,
            password: hashedPassword,
            firstName: user.firstName,
            lastName: user.lastName,
            species: user.species,
            avatar: user.avatar,
          },
        });
        createdUsers.push(created);
      } else {
        createdUsers.push(existing);
      }
    }
    console.log(`✅ ${createdUsers.length} users seeded\n`);

    // 3. SEED FLIGHTS
    console.log("[3/5] ✈️  Seeding flights...");
    const planets = await prisma.planet.findMany();

    if (planets.length >= 2) {
      for (let i = 0; i < 20; i++) {
        const fromIdx = Math.floor(Math.random() * planets.length);
        let toIdx = Math.floor(Math.random() * planets.length);
        while (toIdx === fromIdx) {
          toIdx = Math.floor(Math.random() * planets.length);
        }

        const departure = new Date();
        departure.setDate(
          departure.getDate() + Math.floor(Math.random() * 30) + 1,
        );
        departure.setHours(Math.floor(Math.random() * 20), 0, 0, 0);

        const arrival = new Date(departure);
        arrival.setHours(
          arrival.getHours() + Math.floor(Math.random() * 24) + 4,
        );

        await prisma.flight
          .upsert({
            where: {
              id: 9999 + i, // This won't exist, but we use it for uniqueness
            },
            update: {},
            create: {
              fromPlanetId: planets[fromIdx].id,
              toPlanetId: planets[toIdx].id,
              departureTime: departure,
              arrivalTime: arrival,
              totalSeats: 200,
              availableSeats: 150 + Math.floor(Math.random() * 50),
              basePrice: Math.round((Math.random() * 2000 + 500) * 100) / 100,
            },
          })
          .catch(() => null);
      }
    }
    console.log("✅ Flights seeded\n");

    // 4. SEED BOOKINGS
    console.log("[4/5] 🎫 Seeding bookings...");
    const flights = await prisma.flight.findMany({ take: 10 });
    let bookingCount = 0;

    for (
      let i = 0;
      i < Math.min(createdUsers.length - 1, flights.length);
      i++
    ) {
      const booking = await prisma.booking.create({
        data: {
          userId: createdUsers[i].id,
          flightId: flights[i].id,
          passengers: Math.floor(Math.random() * 3) + 1,
          totalPrice:
            parseFloat(flights[i].basePrice) *
            (Math.floor(Math.random() * 3) + 1),
          status: ["pending", "confirmed", "completed"][
            Math.floor(Math.random() * 3)
          ],
        },
      });
      bookingCount++;
    }
    console.log(`✅ ${bookingCount} bookings seeded\n`);

    // 5. SEED PLANET REVIEWS
    console.log("[5/6] ⭐ Seeding planet reviews...");
    const reviews = [
      {
        userId: createdUsers[0].id,
        planetId: planets[0].id,
        rating: 5,
        title: "Spectacular Crystal Formations",
        content:
          "The most beautiful place I've ever visited. Aurora displays at night are incredible!",
      },
      {
        userId: createdUsers[1].id,
        planetId: planets[1].id,
        rating: 4,
        title: "Ancient History Lover's Paradise",
        content: "Fascinating ruins everywhere. Museums are world-class.",
      },
      {
        userId: createdUsers[2].id,
        planetId: planets[2].id,
        rating: 5,
        title: "Bio-Diversity Heaven",
        content:
          "So many exotic species to catalog and study. Paradise for researchers.",
      },
      {
        userId: createdUsers[3].id,
        planetId: planets[3].id,
        rating: 4,
        title: "Great Hub for Commerce",
        content:
          "Modern entertainment facilities. A bit crowded but excellent service.",
      },
      {
        userId: createdUsers[4].id,
        planetId: planets[4].id,
        rating: 5,
        title: "The Ultimate Vacation",
        content:
          "Pristine beaches and world-class resorts. Worth every credit!",
      },
      {
        userId: createdUsers[5].id,
        planetId: planets[0].id,
        rating: 4,
        title: "Stunning But Cold",
        content: "Beautiful landscapes but bring warm clothes!",
      },
      {
        userId: createdUsers[6].id,
        planetId: planets[2].id,
        rating: 5,
        title: "Nature at its Best",
        content: "Rainforests are magical. Safari tours exceeded expectations.",
      },
      {
        userId: createdUsers[7].id,
        planetId: planets[1].id,
        rating: 3,
        title: "Interesting but Touristy",
        content: "Good destination but very crowded during peak season.",
      },
    ];

    let reviewCount = 0;
    for (const review of reviews) {
      await prisma.review.create({
        data: review,
      });
      reviewCount++;
    }
    console.log(`✅ ${reviewCount} reviews seeded\n`);

    // 6. SEED COMMUNITY POSTS
    console.log("[6/7] 💬 Seeding community posts...");
    const posts = [
      {
        userId: createdUsers[0].id,
        content:
          "Just touched down on Glacio. The ice rings are absolutely stunning this time of year cycle! Anyone know a good place to get some liquid methane coffee?",
        imageUrl:
          "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop",
      },
      {
        userId: createdUsers[1]?.id || createdUsers[0].id,
        content:
          "First time experiencing 3x gravity on Kepler-186f. My bones hurt but the view of the binary sunset is worth it! 🌅 #InterstellarTravel",
        imageUrl:
          "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop",
      },
      {
        userId: createdUsers[2]?.id || createdUsers[0].id,
        content:
          "Volcania's magnetic interference is disrupting my logic circuits. Very unpleasant. Would not recommend for synthetic individuals.",
        imageUrl: null,
      },
      {
        userId: createdUsers[3]?.id || createdUsers[0].id,
        content:
          "Just booked my 5th interstellar journey! Starport Nexus made it so easy. The booking process was seamless and security checks were quick. 10/10 would recommend!",
        imageUrl: null,
      },
      {
        userId: createdUsers[4]?.id || createdUsers[0].id,
        content:
          "Anyone else experiencing that new zero-gravity sports arena on Nova Station? Game changer! Literally floating around playing graviton ball 🎾",
        imageUrl:
          "https://images.unsplash.com/photo-1516567867251-b7ef52d7e95f?q=80&w=1000&auto=format&fit=crop",
      },
    ];

    const createdPosts = await Promise.all(
      posts.map((post) =>
        prisma.post.create({
          data: post,
        }),
      ),
    );
    console.log(`✅ ${createdPosts.length} posts seeded\n`);

    // Add likes
    const likeCombos = [
      { postIdx: 0, userIdx: 1 },
      { postIdx: 0, userIdx: 2 },
      { postIdx: 1, userIdx: 0 },
      { postIdx: 1, userIdx: 3 },
      { postIdx: 2, userIdx: 1 },
      { postIdx: 3, userIdx: 2 },
      { postIdx: 3, userIdx: 4 },
      { postIdx: 4, userIdx: 0 },
    ];

    for (const combo of likeCombos) {
      await prisma.like
        .create({
          data: {
            userId: createdUsers[combo.userIdx].id,
            postId: createdPosts[combo.postIdx].id,
          },
        })
        .catch(() => null);
    }

    // Add comments
    const comments = [
      {
        userId: createdUsers[1].id,
        postId: createdPosts[0].id,
        content: "Try the frozen geyser cafe near sector 4!",
      },
      {
        userId: createdUsers[0].id,
        postId: createdPosts[1].id,
        content: "Stay safe out there! Avoid the active calderas.",
      },
      {
        userId: createdUsers[2].id,
        postId: createdPosts[3].id,
        content: "Same! I just booked my 3rd trip. The UI is so intuitive.",
      },
      {
        userId: createdUsers[1].id,
        postId: createdPosts[4].id,
        content: "Graviton ball looks insane! Is it hard to learn?",
      },
    ];

    for (const comment of comments) {
      await prisma.comment.create({
        data: comment,
      });
    }

    console.log(`✅ ${comments.length} comments added\n`);

    console.log("✅✅✅ All data seeded successfully! ✅✅✅\n");
    console.log("📊 Summary:");
    console.log(`   - ${planetsData.length} planets`);
    console.log(`   - ${createdUsers.length} users with alien profiles`);
    console.log(`   - ${20} flights`);
    console.log(`   - ${bookingCount} bookings`);
    console.log(`   - ${reviewCount} planet reviews`);
    console.log(`   - ${createdPosts.length} community posts`);
    console.log(`   - 8 likes`);
    console.log(`   - 4 comments`);
    console.log(`   - 20 flights`);
    console.log(`   - ${bookingCount} bookings`);
    console.log(`   - ${createdPosts.length} community posts`);
    console.log(`   - ${likeCombos.length} likes`);
    console.log(`   - ${comments.length} comments\n`);
  } catch (error) {
    console.error("❌ Seed error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAllData();
}

export { seedAllData };
