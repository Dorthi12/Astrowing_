import db from "../config/database.js";

const seedData = async () => {
  try {
    const planets = [
      {
        name: "Zephyr-7",
        description:
          "A crystalline wonder with floating cities and aurora skies",
        image_url: "https://via.placeholder.com/400x300?text=Zephyr-7",
        base_price: 1200,
        features: JSON.stringify([
          "Aurora Displays",
          "Crystal Caves",
          "Zero Gravity Zones",
        ]),
      },
      {
        name: "Kepler Prime",
        description:
          "Ancient ruins and advanced civilization intertwined in harmony",
        image_url: "https://via.placeholder.com/400x300?text=Kepler+Prime",
        base_price: 1500,
        features: JSON.stringify(["Ancient Ruins", "Tech Hubs", "Museums"]),
      },
      {
        name: "Proxima Oasis",
        description:
          "Lush green planet with vast ecosystems and exotic wildlife",
        image_url: "https://via.placeholder.com/400x300?text=Proxima+Oasis",
        base_price: 950,
        features: JSON.stringify([
          "Rainforests",
          "Safari Tours",
          "Biodiversity",
        ]),
      },
      {
        name: "Nova Station",
        description:
          "Massive space station hub with entertainment and commerce",
        image_url: "https://via.placeholder.com/400x300?text=Nova+Station",
        base_price: 800,
        features: JSON.stringify(["Shopping", "Restaurants", "Entertainment"]),
      },
      {
        name: "Celestia",
        description:
          "Paradise planet with pristine beaches and tropical climate",
        image_url: "https://via.placeholder.com/400x300?text=Celestia",
        base_price: 2000,
        features: JSON.stringify(["Beaches", "Resorts", "Water Sports"]),
      },
    ];

    for (const planet of planets) {
      await db.query(
        "INSERT INTO planets (name, description, image_url, base_price, features) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (name) DO NOTHING",
        [
          planet.name,
          planet.description,
          planet.image_url,
          planet.base_price,
          planet.features,
        ],
      );
    }

    const planetsResult = await db.query("SELECT id FROM planets");
    const planetIds = planetsResult.rows.map((r) => r.id);

    if (planetIds.length >= 2) {
      const flights = [];
      for (let i = 0; i < 20; i++) {
        const fromIdx = Math.floor(Math.random() * planetIds.length);
        let toIdx = Math.floor(Math.random() * planetIds.length);
        while (toIdx === fromIdx) {
          toIdx = Math.floor(Math.random() * planetIds.length);
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

        flights.push({
          from_planet_id: planetIds[fromIdx],
          to_planet_id: planetIds[toIdx],
          departure_time: departure,
          arrival_time: arrival,
          total_seats: 200,
          available_seats: 200,
          base_price: (Math.random() * 2000 + 500).toFixed(2),
        });
      }

      for (const flight of flights) {
        await db.query(
          "INSERT INTO flights (from_planet_id, to_planet_id, departure_time, arrival_time, total_seats, available_seats, base_price) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          [
            flight.from_planet_id,
            flight.to_planet_id,
            flight.departure_time,
            flight.arrival_time,
            flight.total_seats,
            flight.available_seats,
            flight.base_price,
          ],
        );
      }
    }

    console.log("Seed data inserted successfully");
  } catch (error) {
    console.error("Seed error:", error);
  }
};

if (require.main === module) {
  seedData().then(() => {
    process.exit(0);
  });
}

export { seedData };
