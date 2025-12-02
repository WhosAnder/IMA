import "dotenv/config";
import { db } from "../src/db/client";
import { users, accounts } from "../src/db/schema";
import { nanoid } from "nanoid";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

// Better Auth uses scrypt with these parameters: keylen=64, cost=16384, blockSize=8, parallelization=1
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const keylen = 64;
  const cost = 16384;
  const blockSize = 8;
  const parallelization = 1;
  
  const buf = (await scryptAsync(password, salt, keylen, {
    N: cost,
    r: blockSize,
    p: parallelization,
  })) as Buffer;
  
  // Better Auth stores as: hash.salt (both hex encoded)
  return `${buf.toString("hex")}.${salt.toString("hex")}`;
}

async function createAdminUser() {
  const email = "admin@ima.com";
  const password = "adminUser123";
  const name = "Admin User";
  const role = "admin";

  try {
    // Check if user already exists
    const existingUsers = await db.select().from(users).where(eq(users.email, email));
    const existingUser = existingUsers[0];

    if (existingUser) {
      console.log(`User with email ${email} already exists.`);
      process.exit(0);
    }

    // Hash the password using scrypt (same as Better Auth)
    const hashedPassword = await hashPassword(password);

    // Create user ID
    const userId = nanoid();

    // Insert user
    await db.insert(users).values({
      id: userId,
      email,
      name,
      role,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Insert account with hashed password
    await db.insert(accounts).values({
      id: nanoid(),
      userId,
      accountId: email,
      providerId: "credential",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${role}`);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser();

