export interface DbConnection<Db> {
  connect: (connectionString: string) => Promise<Db>
  disconnect: (db: Db) => Promise<void>
}
