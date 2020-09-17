export default function makeArticleSocket ({ makeSocketClient }) {
  // TODO
  const socketUrl = process.env.VUE_APP_ARTICLE_SOCKET_URL || 'http://localhost:8849/blog'
  
  /**
   * @type { SocketIOClient.Socket }
   */
  const client = makeSocketClient({ socketUrl })

  const listenEvents = {
    POST: 'POST',
    DELETE: 'DELETE',
    UPDATE: 'UPDATE',
  }

  return Object.freeze({
    listenPost,
    listenDelete,
    listenUpdate,
    openConnected,
    closeConnected,
    removeListener
  })

  function closeConnected () {
    if (client.connected) client.close()
  }
  
  function openConnected () {
    if (!client.connected) {
      clearListener()
      client.open()
    }
  }

  function removeListener ({
    event = '',
    callback = undefined
  }) {
    client.off(event, callback)
  }

  function clearListener () {
    for (const key in listenEvents) {
      const event = listenEvents[key]
      removeListener({ event })
    }
  }

  function listenDelete ({
    callback = (() => {})
  }) {
    client.on(listenEvents.DELETE, callback)
  }

  function listenUpdate ({
    callback = (() => {})
  }) {
    client.on(listenEvents.UPDATE, callback)
  }

  function listenPost ({
    callback = (() => {})
  }) {
    client.on(listenEvents.POST, callback)
  }
}