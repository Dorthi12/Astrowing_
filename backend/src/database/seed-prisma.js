import prisma from "../config/prisma.js";

const seedData = async () => {
  try {
    const planets = [
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

    for (const planet of planets) {
      await prisma.planet.upsert({
        where: { name: planet.name },
        update: {},
        create: planet,
      });
    }

    const planetsFromDb = await prisma.planet.findMany();

    if (planetsFromDb.length >= 2) {
      for (let i = 0; i < 20; i++) {
        const fromIdx = Math.floor(Math.random() * planetsFromDb.length);
        let toIdx = Math.floor(Math.random() * planetsFromDb.length);
        while (toIdx === fromIdx) {
          toIdx = Math.floor(Math.random() * planetsFromDb.length);
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

        await prisma.flight.create({
          data: {
            fromPlanetId: planetsFromDb[fromIdx].id,
            toPlanetId: planetsFromDb[toIdx].id,
            departureTime: departure,
            arrivalTime: arrival,
            totalSeats: 200,
            availableSeats: 200,
            basePrice: Math.round((Math.random() * 2000 + 500) * 100) / 100,
          },
        });
      }
    }

    console.log("Seed data inserted successfully");
  } catch (error) {
    console.error("Seed error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  seedData();
}

export { seedData };
