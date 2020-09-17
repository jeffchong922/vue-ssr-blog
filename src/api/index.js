// this is aliased in webpack config based on server/client build
import makeRequestClient from 'request-client'

import makeArticleApi from './article'

import { articleSocket } from '../_socket'

const articleApi = makeArticleApi({ makeRequestClient, articleSocket })

export {
  articleApi
}