export interface Migration {
  id: number
  name: string
  executedAt: Date
}

export interface MigrationRepository {
  list: () => Promise<Migration[]>
}
