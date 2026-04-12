import prisma from "./src/config/database.js";

const alienProfiles = [
  { email: "zorblax@zorgon.space", species: "Zorgon", avatar: "👽" },
  { email: "human_dave@terra.com", species: "Terran", avatar: "🧑‍🚀" },
  { email: "unit734@synthetic.ai", species: "Silicon-Synth", avatar: "🤖" },
  { email: "kael_nomad@explorer.io", species: "Kepler", avatar: "👾" },
  { email: "luna_starlight@traveler.com", species: "Celestian", avatar: "✨" },
  { email: "cosmic_chad@adventure.org", species: "Nova", avatar: "🌟" },
  { email: "nova_nova@station.net", species: "Station-Born", avatar: "🛸" },
  { email: "zephyr_wind@crystal.com", species: "Crystal-Being", avatar: "💎" },
  { email: "oasis_traveler@nature.bio", species: "Bio-Organic", avatar: "🌿" },
  {
    email: "celestial_vibes@paradise.sky",
    species: "Energy-Form",
    avatar: "⚡",
  },
];

console.log("🔄 Updating alien profiles...\n");

for (const profile of alienProfiles) {
  await prisma.user.update({
    where: { email: profile.email },
    data: { species: profile.species, avatar: profile.avatar },
  });
}

console.log("✅ All alien profiles updated!\n");

const updated = await prisma.user.findMany({
  where: { email: { in: alienProfiles.map((p) => p.email) } },
  select: { email: true, firstName: true, species: true, avatar: true },
});

console.log("👽 UPDATED ALIEN PROFILES:\n");
updated.forEach((u) => {
  console.log(`  ${u.avatar} ${u.firstName} (${u.species}): ${u.email}`);
});
console.log("\n");

process.exit(0);
