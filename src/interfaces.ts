export interface Transaction {
  amount: number
  description: string
  date: string
}

export interface Settings {
  balance: number
  init: boolean
}

export interface Backup {
  settings: Settings
  transactions: Transaction[]
}
