import { ref } from 'vue'

const logs = ref([])
let isSwReady = false

const logMsg = (msg) => {
  logs.value.push({
    message: msg,
    time: new Date()
  })
}

const sendMessage = (msg) => {
  if (!isSwReady) return
  if (typeof msg.message === 'string') {
    logMsg(`[app]: ${msg.message}`)
    navigator.serviceWorker.controller.postMessage(msg)
  } else {
    const newMsg = {
      type: msg.type,
      message: JSON.parse(JSON.stringify(msg.message))
    }
    logMsg(`[app]: ${JSON.stringify(newMsg.message)}`)
    navigator.serviceWorker.controller.postMessage(newMsg)
  }
}

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/autosave-sw/service-worker.js')
      .then((registration) => {
        if (registration.installing || registration.waiting) {
          logMsg('[app]: Service worker registering')
        }
      })
      .catch((error) => {
        logMsg(`[app]: Registration failed with ${error}`)
      })
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.active) {
        isSwReady = true
        logMsg('[app]: Service worker active')
        setTimeout(() => {
          sendMessage({
            type: 'HELLO',
            message: 'Hello from app!'
          })
        }, 100)
      }
    })
    navigator.serviceWorker.addEventListener('message', (event) => logMsg(event.data))
  } else {
    logMsg('[app]: Service workers are not supported')
  }
}

function queryLastRecords() {
  const DB = new Promise((resolve, reject) => {
    indexedDB
      .databases()
      .then((databases) => {
        const dbExists = databases.find((db) => db.name === 'RequestDB')
        if (dbExists) {
          const openRequest = indexedDB.open('RequestDB', 1)

          openRequest.onsuccess = (event) => {
            resolve(event.target.result)
          }

          openRequest.onerror = (event) => {
            reject(event.target.error)
          }
        } else {
          reject(new Error('IndexedDB database does not exist.'))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
  return new Promise((resolve, reject) => {
    DB.then((db) => {
      const transaction = db.transaction('requests', 'readonly')
      const objectStore = transaction.objectStore('requests')
      const index = objectStore.index('time')

      // Open a cursor and query the last 5 records
      const request = index.openCursor(null, 'prev')
      let count = 0
      const result = []

      request.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor && count < 5) {
          result.push(cursor.value)
          cursor.continue()
          count++
        }
      }

      transaction.oncomplete = () => {
        resolve(result)
      }

      transaction.onerror = (event) => {
        reject(event.target.error) // Reject the promise if an error occurs
      }
    }).catch((error) => {
      console.error(error)
      resolve([])
    })
  })
}

export { logs, sendMessage, queryLastRecords, registerServiceWorker }
