import bcrypt from "bcryptjs";

import prisma from "../config/database.js";

const seedData = async () => {
  try {
    console.log("🌍 Starting database seed...");

    // Clear existing data (in reverse order of dependencies)
    await prisma.payment.deleteMany();
    await prisma.review.deleteMany();
    await prisma.bookingSeat.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.flight.deleteMany();
    await prisma.planet.deleteMany();
    await prisma.user.deleteMany();
    console.log("🗑️  Cleared existing data");

    // Seed Users
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: "john@example.com",
          password: await bcrypt.hash("password123", 10),
          firstName: "John",
          lastName: "Doe",
          phone: "+1-555-0101",
        },
      }),
      prisma.user.create({
        data: {
          email: "jane@example.com",
          password: await bcrypt.hash("password123", 10),
          firstName: "Jane",
          lastName: "Smith",
          phone: "+1-555-0102",
        },
      }),
      prisma.user.create({
        data: {
          email: "alex@example.com",
          password: await bcrypt.hash("password123", 10),
          firstName: "Alex",
          lastName: "Johnson",
          phone: "+1-555-0103",
        },
      }),
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Seed Planets
    const planets = await Promise.all([
      prisma.planet.create({
        data: {
          name: "Zephyr-7",
          description:
            "A crystalline wonder with floating cities and aurora skies",
          imageUrl: "https://via.placeholder.com/400x300?text=Zephyr-7",
          basePrice: "1200.00",
          features: ["Aurora Displays", "Crystal Caves", "Zero Gravity Zones"],
          averageRating: 4.5,
          totalReviews: 12,
        },
      }),
      prisma.planet.create({
        data: {
          name: "Kepler Prime",
          description:
            "Ancient ruins and advanced civilization intertwined in harmony",
          imageUrl: "https://via.placeholder.com/400x300?text=Kepler+Prime",
          basePrice: "1500.00",
          features: ["Ancient Ruins", "Tech Hubs", "Museums"],
          averageRating: 4.8,
          totalReviews: 25,
        },
      }),
      prisma.planet.create({
        data: {
          name: "Proxima Oasis",
          description:
            "Lush green planet with vast ecosystems and exotic wildlife",
          imageUrl: "https://via.placeholder.com/400x300?text=Proxima+Oasis",
          basePrice: "950.00",
          features: ["Rainforests", "Safari Tours", "Biodiversity"],
          averageRating: 4.3,
          totalReviews: 18,
        },
      }),
      prisma.planet.create({
        data: {
          name: "Nova Station",
          description:
            "Massive space station hub with entertainment and commerce",
          imageUrl: "https://via.placeholder.com/400x300?text=Nova+Station",
          basePrice: "800.00",
          features: ["Shopping", "Restaurants", "Entertainment"],
          averageRating: 4.6,
          totalReviews: 35,
        },
      }),
      prisma.planet.create({
        data: {
          name: "Celestia",
          description:
            "Paradise planet with pristine beaches and tropical climate",
          imageUrl: "https://via.placeholder.com/400x300?text=Celestia",
          basePrice: "2000.00",
          features: ["Beaches", "Resorts", "Water Sports"],
          averageRating: 4.9,
          totalReviews: 42,
        },
      }),
    ]);
    console.log(`✅ Created ${planets.length} planets`);

    // Seed Flights
    const flights = [];
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
      arrival.setHours(arrival.getHours() + Math.floor(Math.random() * 24) + 4);

      const basePrice = (Math.random() * 2000 + 500).toFixed(2);

      const flight = await prisma.flight.create({
        data: {
          fromPlanetId: planets[fromIdx].id,
          toPlanetId: planets[toIdx].id,
          departureTime: departure,
          arrivalTime: arrival,
          totalSeats: 200,
          availableSeats: Math.floor(Math.random() * 150) + 50,
          basePrice: basePrice,
        },
      });
      flights.push(flight);
    }
    console.log(`✅ Created ${flights.length} flights`);

    // Seed Reviews
    const reviewsData = [
      {
        userId: users[0].id,
        planetId: planets[0].id,
        rating: 5,
        title: "Amazing aurora displays!",
        content:
          "The crystal caves were breathtaking and the floating cities are surreal.",
      },
      {
        userId: users[1].id,
        planetId: planets[1].id,
        rating: 5,
        title: "Historical and modern blend",
        content:
          "Perfect combination of ancient ruins and cutting-edge technology.",
      },
      {
        userId: users[2].id,
        planetId: planets[2].id,
        rating: 4,
        title: "Wildlife paradise",
        content:
          "The safari tour was incredible, saw species never documented before.",
      },
      {
        userId: users[0].id,
        planetId: planets[3].id,
        rating: 4,
        title: "Great shopping and dining",
        content: "Nova Station has everything - shops, restaurants, and shows.",
      },
      {
        userId: users[1].id,
        planetId: planets[4].id,
        rating: 5,
        title: "Paradise found!",
        content:
          "Best vacation spot ever, pristine beaches and perfect weather.",
      },
    ];

    await Promise.all(
      reviewsData.map((review) =>
        prisma.review.create({
          data: review,
        }),
      ),
    );
    console.log(`✅ Created ${reviewsData.length} reviews`);

    // Seed Bookings with Booking Seats
    if (flights.length >= 3) {
      const booking1 = await prisma.booking.create({
        data: {
          userId: users[0].id,
          flightId: flights[0].id,
          passengers: 2,
          totalPrice: "2400.00",
          status: "confirmed",
          seats: {
            create: [
              { seatNumber: 1, status: "booked" },
              { seatNumber: 2, status: "booked" },
            ],
          },
        },
      });

      const booking2 = await prisma.booking.create({
        data: {
          userId: users[1].id,
          flightId: flights[1].id,
          passengers: 1,
          totalPrice: "1500.00",
          status: "pending",
          seats: {
            create: [{ seatNumber: 5, status: "booked" }],
          },
        },
      });

      const booking3 = await prisma.booking.create({
        data: {
          userId: users[2].id,
          flightId: flights[2].id,
          passengers: 3,
          totalPrice: "3600.00",
          status: "confirmed",
          seats: {
            create: [
              { seatNumber: 10, status: "booked" },
              { seatNumber: 11, status: "booked" },
              { seatNumber: 12, status: "booked" },
            ],
          },
        },
      });

      console.log(`✅ Created 3 bookings with seats`);

      // Seed Payments
      await Promise.all([
        prisma.payment.create({
          data: {
            bookingId: booking1.id,
            userId: users[0].id,
            amount: "2400.00",
            method: "stripe",
            stripePaymentId:
              "pi_test_" + Math.random().toString(36).substr(2, 9),
            status: "completed",
          },
        }),
        prisma.payment.create({
          data: {
            bookingId: booking2.id,
            userId: users[1].id,
            amount: "1500.00",
            method: "credit_card",
            status: "pending",
          },
        }),
        prisma.payment.create({
          data: {
            bookingId: booking3.id,
            userId: users[2].id,
            amount: "3600.00",
            method: "paypal",
            status: "completed",
          },
        }),
      ]);
      console.log(`✅ Created 3 payments`);
    }

    console.log("🎉 Database seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

seedData();
