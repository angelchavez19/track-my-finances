export interface Transaction {
  amount: number
  description: string
  date: string
  category: string
  method: string
}

export interface Settings {
  balance: number
  init: boolean
}
