import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";
import prisma from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload image to Cloudinary
async function uploadToCloudinary(imagePath, publicId) {
  try {
    if (!fs.existsSync(imagePath)) {
      console.warn(`⚠️  Image not found: ${imagePath}`);
      return null;
    }

    const result = await cloudinary.v2.uploader.upload(imagePath, {
      public_id: `botrush/planets/${publicId}`,
      folder: "botrush/planets",
      overwrite: true,
      resource_type: "auto",
    });

    console.log(`✅ Uploaded ${publicId}: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Failed to upload ${publicId}:`, error.message);
    return null;
  }
}

async function seedPlanets(req, res) {
  try {
    console.log("🚀 Starting planet seeding process...\n");

    // Read planet and route data
    const planetsDataPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "frontend",
      "src",
      "data",
      "planets.json",
    );
    const routesDataPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "frontend",
      "src",
      "data",
      "routes.json",
    );

    if (!fs.existsSync(planetsDataPath)) {
      return res.status(400).json({
        success: false,
        message: `Planets data file not found: ${planetsDataPath}`,
      });
    }
    if (!fs.existsSync(routesDataPath)) {
      return res.status(400).json({
        success: false,
        message: `Routes data file not found: ${routesDataPath}`,
      });
    }

    const planetsData = JSON.parse(fs.readFileSync(planetsDataPath, "utf-8"));
    const routesData = JSON.parse(fs.readFileSync(routesDataPath, "utf-8"));

    const planetImagesDir = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "frontend",
      "public",
      "planets",
    );

    // Clear existing data
    console.log("🗑️  Clearing existing planets and routes...");
    await prisma.route.deleteMany({});
    await prisma.planet.deleteMany({});
    console.log("✅ Existing data cleared\n");

    // Upload images and seed planets
    console.log("📤 Uploading planet images to Cloudinary...\n");
    const planetMap = new Map();

    for (const planet of planetsData.planets) {
      let imageUrl = null;

      // Upload image if available
      if (planet.image) {
        const imageFileName = planet.image.split("/").pop();
        const imagePath = path.join(planetImagesDir, imageFileName);
        imageUrl = await uploadToCloudinary(imagePath, planet.id);
      }

      // Create planet in database
      const createdPlanet = await prisma.planet.create({
        data: {
          externalId: planet.id,
          name: planet.name,
          description: planet.shortDesc,
          shortDesc: planet.shortDesc,
          imageUrl: imageUrl,
          basePrice: parseFloat(planet.price) || 0,
          galaxy: planet.galaxy,
          type: planet.type,
          distance: parseFloat(planet.distance) || 0,
          color: planet.color,
          coordinatesX: parseFloat(planet.coordinates.x),
          coordinatesY: parseFloat(planet.coordinates.y),
          risks: planet.risks || {},
          compatibility: planet.compatibility || {},
          timeDilation: planet.timeDilation,
          lore: planet.lore,
          features: {
            color: planet.color,
            galaxy: planet.galaxy,
            type: planet.type,
          },
        },
      });

      planetMap.set(planet.id, createdPlanet.id);
      console.log(
        `✅ Created planet: ${planet.name} (ID: ${createdPlanet.id})`,
      );
    }

    console.log(`\n📍 Created ${planetMap.size} planets\n`);

    // Seed routes
    console.log("🛣️  Seeding routes...\n");
    let routeCount = 0;

    for (const edge of routesData.edges) {
      const sourcePlanetId = planetMap.get(edge.source);
      const destPlanetId = planetMap.get(edge.target);

      if (!sourcePlanetId || !destPlanetId) {
        console.warn(
          `⚠️  Skipping route: ${edge.source} -> ${edge.target} (planet not found)`,
        );
        continue;
      }

      await prisma.route.create({
        data: {
          sourcePlanetId,
          destPlanetId,
          cost: parseFloat(edge.cost),
          distanceLY: parseFloat(edge.distanceLY),
        },
      });

      routeCount++;
    }

    console.log(`✅ Created ${routeCount} routes\n`);

    // Return success response
    return res.status(200).json({
      success: true,
      message: "🎉 Seeding complete!",
      data: {
        planetsCreated: planetMap.size,
        routesCreated: routeCount,
      },
    });
  } catch (error) {
    console.error("❌ Seeding error:", error);
    return res.status(500).json({
      success: false,
      message: "Seeding failed",
      error: error.message,
    });
  }
}

export { seedPlanets };
