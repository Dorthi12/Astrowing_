import pkg from "../src/generated/index.js";
const { PrismaClient } = pkg;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

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

async function seedPlanets() {
  try {
    console.log("🚀 Starting planet seeding process...\n");

    // Read planet and route data
    const planetsDataPath = path.join(
      __dirname,
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
      "frontend",
      "src",
      "data",
      "routes.json",
    );

    if (!fs.existsSync(planetsDataPath)) {
      throw new Error(`Planets data file not found: ${planetsDataPath}`);
    }
    if (!fs.existsSync(routesDataPath)) {
      throw new Error(`Routes data file not found: ${routesDataPath}`);
    }

    const planetsData = JSON.parse(fs.readFileSync(planetsDataPath, "utf-8"));
    const routesData = JSON.parse(fs.readFileSync(routesDataPath, "utf-8"));

    const planetImagesDir = path.join(
      __dirname,
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
          basePrice: planet.price || 0,
          galaxy: planet.galaxy,
          type: planet.type,
          distance: planet.distance || 0,
          color: planet.color,
          coordinatesX: planet.coordinates.x,
          coordinatesY: planet.coordinates.y,
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
          cost: edge.cost,
          distanceLY: edge.distanceLY,
        },
      });

      routeCount++;
    }

    console.log(`✅ Created ${routeCount} routes\n`);

    // Summary
    console.log("========================================");
    console.log("🎉 Seeding complete!");
    console.log("========================================");
    console.log(`✅ Planets created: ${planetMap.size}`);
    console.log(`✅ Routes created: ${routeCount}`);
    console.log("========================================\n");
  } catch (error) {
    console.error("❌ Seeding error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedPlanets();
