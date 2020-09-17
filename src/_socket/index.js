import makeSocketIOClient from './socket-io'

import makeArticleSocket from './article'

const articleSocket = makeArticleSocket({ makeSocketClient: makeSocketIOClient })

export {
  articleSocket
}