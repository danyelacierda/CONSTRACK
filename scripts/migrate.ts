import fs from "fs";
import path from "path";
import { Client } from "pg";

async function runMigration() {
  const hosts = [
    { host: "db.laaquivgghngaikfhedl.supabase.co", port: 5432, ssl: { rejectUnauthorized: false } },
    { host: "aws-0-ap-southeast-1.pooler.supabase.com", port: 6543, ssl: { rejectUnauthorized: false } },
    { host: "aws-0-ap-southeast-1.pooler.supabase.com", port: 5432, ssl: { rejectUnauthorized: false } },
    { host: "aws-0-us-east-1.pooler.supabase.com", port: 6543, ssl: { rejectUnauthorized: false } },
  ];

  const sqlPath = path.join(__dirname, "schema.sql");
  const sql = fs.readFileSync(sqlPath, "utf-8");

  let connectedClient: Client | null = null;

  for (const config of hosts) {
    console.log(`Attempting connection to ${config.host}:${config.port}...`);
    const client = new Client({
      user: config.host.includes("pooler") ? "postgres.laaquivgghngaikfhedl" : "postgres",
      host: config.host,
      database: "postgres",
      password: process.env.SUPABASE_DB_PASSWORD || process.env.DATABASE_PASSWORD,
      port: config.port,
      ssl: config.ssl,
      connectionTimeoutMillis: 10000,
    });

    try {
      await client.connect();
      console.log(`Connected successfully to ${config.host}:${config.port}!`);
      connectedClient = client;
      break;
    } catch (err: any) {
      console.warn(`Connection failed for ${config.host}:${config.port}: ${err.message}`);
      await client.end().catch(() => {});
    }
  }

  if (!connectedClient) {
    throw new Error("Could not connect to Supabase PostgreSQL database on any known host.");
  }

  try {
    console.log("\nExecuting schema.sql...");
    await connectedClient.query(sql);
    console.log("✓ Successfully executed schema.sql!");

    // Verify tables
    const res = await connectedClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log("\nTables now in public schema:");
    for (const row of res.rows) {
      console.log(` - ${row.table_name}`);
    }
  } finally {
    await connectedClient.end();
  }
}

runMigration().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
