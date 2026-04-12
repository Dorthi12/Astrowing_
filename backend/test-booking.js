import axios from "axios";

async function testBooking() {
  try {
    // Test 1: Get flights
    console.log("\n[TEST 1] Searching flights...");
    const searchRes = await axios.get(
      "http://localhost:5000/api/flights/search",
      {
        params: {
          fromPlanetId: 3,
          toPlanetId: 1,
          departureDate: "2026-05-10",
        },
      },
    );
    console.log("✅ Found", searchRes.data.flights.length, "flight(s)");
    const flight = searchRes.data.flights[0];

    // Test 2: Register user
    console.log("\n[TEST 2] Registering user...");
    const regRes = await axios.post("http://localhost:5000/api/auth/register", {
      email: `test-${Date.now()}@example.com`,
      password: "TestPass123",
      firstName: "Test",
      lastName: "User",
    });
    const token = regRes.data.tokens.accessToken;
    console.log("✅ User registered, token obtained");

    // Test 3: Create booking
    console.log("\n[TEST 3] Creating booking...");
    const bookingRes = await axios.post(
      "http://localhost:5000/api/bookings",
      {
        flightId: flight.id,
        passengers: 2,
        seatSelectedIndices: [1, 2],
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    console.log("✅ Booking created successfully");
    console.log("   Booking ID:", bookingRes.data.booking?.id);
    console.log("   Flight ID:", bookingRes.data.booking?.flightId);
    console.log("   Passengers:", bookingRes.data.booking?.numberOfPassengers);

    // Test 4: Get bookings
    console.log("\n[TEST 4] Fetching user bookings...");
    const bookingsRes = await axios.get("http://localhost:5000/api/bookings", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(
      "✅ Retrieved",
      bookingsRes.data.bookings?.length,
      "booking(s)",
    );

    console.log("\n✅ ALL TESTS PASSED!\n");
  } catch (error) {
    console.error("❌ ERROR:", error.response?.data || error.message);
  }
}

testBooking();
