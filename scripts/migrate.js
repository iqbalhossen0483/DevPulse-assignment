"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const pg_1 = require("pg");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
async function migrate() {
    const migrationsDir = path_1.default.join(__dirname, '..', 'migrations');
    const files = fs_1.default.readdirSync(migrationsDir).sort();
    for (const file of files) {
        if (!file.endsWith('.sql'))
            continue;
        const sql = fs_1.default.readFileSync(path_1.default.join(migrationsDir, file), 'utf8');
        console.log(`Running migration: ${file}`);
        await pool.query(sql);
        console.log(`  ✓ ${file}`);
    }
    console.log('All migrations completed.');
    await pool.end();
}
migrate().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
//# sourceMappingURL=migrate.js.map