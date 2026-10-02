import mongoose from 'mongoose';
import { connectDB } from '../src/utils/db';
import { User } from '../src/models';

const TOTAL_USERS = 100_000;
const BATCH_SIZE = 1_000;
// Marks generated documents so a re-run only clears earlier seeded users, never real accounts.
const SEED_EMAIL_PATTERN = /^seed-user\d+@example\.com$/;

async function seed() {
  await connectDB();

  const removed = await User.deleteMany({ email: SEED_EMAIL_PATTERN });
  console.log(`Removed ${removed.deletedCount} previously seeded users`);

  for (let start = 0; start < TOTAL_USERS; start += BATCH_SIZE) {
    const end = Math.min(start + BATCH_SIZE, TOTAL_USERS);
    const users = [];

    for (let i = start; i < end; i++) {
      users.push({
        name: `Seed User ${i}`,
        email: `seed-user${i}@example.com`,
        phoneNumber: `9${String(i).padStart(9, '0')}`,
        age: 18 + (i % 60),
      });
    }

    await User.insertMany(users, { ordered: false });
    console.log(`Inserted ${end}/${TOTAL_USERS}`);
  }

  await mongoose.disconnect();
  console.log('Seeding complete');
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
