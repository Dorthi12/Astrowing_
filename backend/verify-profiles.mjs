import prisma from "./src/config/database.js";

const verifyProfiles = async () => {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      firstName: true,
      species: true,
      avatar: true,
    },
    take: 10,
  });

  console.log("\n👽 ALIEN PROFILES SEEDED:\n");
  users.forEach((u) => {
    console.log(`  ${u.avatar} ${u.firstName} (${u.species}): ${u.email}`);
  });
  console.log("\n");
  process.exit(0);
};

await verifyProfiles();
