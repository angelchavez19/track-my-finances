import { defineStore } from 'pinia'
import type { Settings, Transaction } from 'src/interfaces'
import { ref } from 'vue'

export const useFinancesStore = defineStore('finances', () => {
  const dbName = 'financesDB'
  const dbVersion = 1
  let db: IDBDatabase | null = null

  const balance = ref<number>(0)
  const settings = ref<Settings>()
  const transactions = ref<Transaction[]>([])

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
      balance.value = newBalance
      settings.value = { balance: newBalance, init }

      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(new Error(transaction.error?.message))
    })
  }

  const addTransaction = (amount: number, description: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      getBalance()
        .then((currentBalance) => {
          if (!db) return reject(new Error('DB no inicializada'))

          const transaction = db.transaction(['transactions', 'settings'], 'readwrite')
          const transactionsStore = transaction.objectStore('transactions')
          const settingsStore = transaction.objectStore('settings')

          const newTransaction = {
            amount,
            description,
            date: new Date().toISOString(),
          }

          const request = transactionsStore.add(newTransaction)
          request.onerror = () => reject(new Error(request.error?.message))

          const settingsRequest = settingsStore.put({
            id: 1,
            balance: currentBalance + amount,
            init: true,
          })
          balance.value = currentBalance + amount
          settings.value = { balance: currentBalance + amount, init: true }
          transactions.value.push(newTransaction)
          settingsRequest.onerror = () => reject(new Error(settingsRequest.error?.message))

          transaction.oncomplete = () => resolve()
          transaction.onerror = () => reject(new Error(transaction.error?.message))
        })
        .catch((err) => {
          reject(new Error(err.message))
        })
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

  const mount = async () => {
    await openDB()
    balance.value = await getBalance()
    settings.value = await getSettings()
    transactions.value = (await getTransactions()).reverse()
  }

  return {
    openDB,
    getBalance,
    getSettings,
    updateBalance,
    addTransaction,
    getTransactions,
    mount,
    balance,
    settings,
    transactions,
  }
})
