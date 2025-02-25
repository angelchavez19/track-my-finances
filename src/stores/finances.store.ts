import { defineStore } from 'pinia'
import type { Settings, Transaction } from 'src/interfaces'

export const useFinancesStore = defineStore('finances', () => {
  const dbName = 'financesDB'
  const dbVersion = 1
  let db: IDBDatabase | null = null

  const openDB = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, dbVersion)

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        db = (event.target as IDBOpenDBRequest).result

        const settingsStore = db.createObjectStore('settings', { keyPath: 'id' })

        const transactionsStore = db.createObjectStore('transactions', {
          keyPath: 'id',
          autoIncrement: true,
        })
        transactionsStore.createIndex('date', 'date', { unique: false })

        settingsStore.transaction.oncomplete = () => {
          const settingsTransaction = db!.transaction('settings', 'readwrite')
          const settings = settingsTransaction.objectStore('settings')
          settings.add({ id: 1, balance: 0, init: false })
        }
      }

      request.onsuccess = (event) => {
        db = (event.target as IDBOpenDBRequest).result
        resolve()
      }

      request.onerror = () => reject(new Error(request.error?.message))
    })
  }

  const getSettings = (): Promise<Settings> => {
    return new Promise((resolve, reject) => {
      if (!db) return reject(new Error('DB no inicializada'))

      const transaction = db.transaction('settings', 'readonly')
      const store = transaction.objectStore('settings')
      const request = store.get(1)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () =>
        reject(new Error(request.error?.message || 'Error al obtener las configuraciones'))
    })
  }

  const getBalance = (): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!db) return reject(new Error('DB no inicializada'))

      const transaction = db.transaction('settings', 'readonly')
      const store = transaction.objectStore('settings')
      const request = store.get(1)

      request.onsuccess = () => resolve(request.result?.balance ?? 0)
      request.onerror = () =>
        reject(new Error(request.error?.message || 'Error al obtener el saldo'))
    })
  }

  const updateBalance = (newBalance: number, init: boolean = true): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!db) return reject(new Error('DB no inicializada'))
      const transaction = db.transaction('settings', 'readwrite')
      const store = transaction.objectStore('settings')
      store.put({ id: 1, balance: newBalance, init })

      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(new Error(transaction.error?.message))
    })
  }

  const addTransaction = (
    amount: number,
    description: string,
    category = 'Otro',
    method = 'Efectivo',
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!db) return reject(new Error('DB no inicializada'))

      const transaction = db.transaction(['transactions', 'settings'], 'readwrite')
      const transactionsStore = transaction.objectStore('transactions')
      const settingsStore = transaction.objectStore('settings')

      getBalance()
        .then((currentBalance) => {
          const newTransaction = {
            amount,
            description,
            date: new Date().toISOString(),
            category,
            method,
          }

          transactionsStore.add(newTransaction)
          settingsStore.put({ id: 1, balance: currentBalance + amount })

          transaction.oncomplete = () => resolve()
          transaction.onerror = () => reject(new Error(transaction.error?.message))
        })
        .catch((err) => reject(new Error(err.error?.message)))
    })
  }

  const getTransactions = (): Promise<Transaction[]> => {
    return new Promise((resolve, reject) => {
      if (!db) return reject(new Error('DB no inicializada'))

      const transaction = db.transaction('transactions', 'readonly')
      const store = transaction.objectStore('transactions')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error(request.error?.message))
    })
  }

  return {
    openDB,
    getBalance,
    getSettings,
    updateBalance,
    addTransaction,
    getTransactions,
  }
})
