self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', async function (event) {
  const register = async () => {
    await self.clients.claim()
    sendMessage('[sw]: Register success')
  }

  event.waitUntil(register())
})

self.addEventListener('message', async (event) => {
  if (!event.data) return
  const client = await self.clients.get(event.clientId || event.source.id)
  switch (event.data.type) {
    case 'HELLO':
      sendMessage('[sw]: Hello from service worker!', client)
      break

    default:
      sendMessage('[sw]: unkown message', client)
      break
  }
})

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'POST') {
    event.respondWith(
      fetch(event.request.clone()).then((response) => {
        // Check if the response is an error
        if (!response.ok) {
          saveRequest(event.clientId, event.request)
        }
        return response
      })
    )
  }
})

async function sendMessage(message, client) {
  if (client) {
    client.postMessage(message)
  } else {
    const clients = await self.clients.matchAll()
    clients.forEach(function (_client) {
      _client.postMessage(message)
    })
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('RequestDB', 1)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      const objectStore = db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true })
      objectStore.createIndex('url', 'url', { unique: false })
      objectStore.createIndex('clientId', 'clientId', { unique: false })
      objectStore.createIndex('time', 'time', { unique: false })
      objectStore.createIndex('body', 'body', { unique: false })
    }

    request.onsuccess = (event) => {
      resolve(event.target.result)
    }

    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

async function saveRequest(clientId, request) {
  try {
    const db = await openDB()
    const body = await request.text()
    const client = await self.clients.get(clientId)
    const transaction = db.transaction('requests', 'readwrite')
    const objectStore = transaction.objectStore('requests')

    const requestInfo = {
      body: body,
      url: request.url,
      clientId: clientId,
      time: new Date().toISOString()
    }

    objectStore.add(requestInfo)

    transaction.oncomplete = () => {
      sendMessage('[sw]: request failed ' + request.url, client)
      sendMessage('[sw]: ' + body, client)
    }

    transaction.onerror = () => {
      sendMessage('[sw]: error saving request data to IndexedDB:', client)
    }
  } catch (error) {
    sendMessage('[sw]: error opening IndexedDB')
  }
}
