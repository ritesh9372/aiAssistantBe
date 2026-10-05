/**
 * Database connection setup.
 * Currently uses an in-memory repository architecture, ready to be swapped
 * with PostgreSQL (Prisma/TypeORM) or MongoDB (Mongoose) without changing controllers or services.
 */
export async function connectDatabase(): Promise<void> {
  // In-memory mock storage is initialized on startup
  console.log('[Database] In-memory storage initialized (Database-ready architecture)');
}
