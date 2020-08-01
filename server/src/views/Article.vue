<template>
  <div class="article-view">
    <h1 class="website-title"><router-link to="/" exact>Jeff Chong 的简易博客</router-link></h1>
    <div class="article">
      <template v-if="article">
        <header class="header">
          <h2 class="title">{{ article.title }}</h2>
          <small>
            {{ new Date(article.created_time).toLocaleDateString() }}
            <span class="updated" v-if="article.updated_time !== article.created_time">
              updated: {{ new Date(article.updated_time).toLocaleDateString() }}
            </span>
          </small>
        </header>
        <section ref="markdownContent" class="markdown-content" v-html="articleContent"></section>
        <aside class="topic" v-if="topic && topic.length > 0">
          <div class="topic-wrap">
            <li class="topic-item"
              v-for="(item, index) of topic"
              :key="index"
            >
              <a :href="`#${item.href}`">{{ `${String('--').repeat(item.level)}${item.title}` }}</a>
            </li>
          </div>
        </aside>
      </template>
    </div>
    <div class="line"></div>
    <author-info/>
  </div>
</template>

<script>
import AuthorInfo from '../components/AuthorInfo.vue'
import { getHtmlContent, getHtmlTopic } from '../utils/markdown'
import { watchArticle } from '../api/index'
export default {
  name: 'article-content',
  components: { AuthorInfo },
  asyncData ({ store, route }) {
    const { id } = route.params
    return store.dispatch('FETCH_ARTICLE', { id })
  },
  title () {
    return this.article
      ? `${this.article.title}`
      : `404`
  },
  mounted () {
    this.__unwatchArticle = watchArticle(({ id }) => {
       console.log('client socket got articleChanged, id: ', id)
       if (this.$route.params.id === id) {
         console.log('开始请求')
          this.$bar.start()
          this.$store.dispatch('FETCH_ARTICLE', { id, force: true })
            .then(this.$bar.finish())
       }
    })
  },
  beforeDestroy () {
    this.__unwatchArticle()
  },
  computed: {
    article () {
      const { articles } = this.$store.state
      const article = articles[this.$route.params.id]
      return article
        ? article
        : null
    },
    articleContent () {
      return this.article && this.article.content
        ? getHtmlContent(this.article.content)
        : ''
    }
  },
  watch: {
    articleContent: {
      immediate: true,
      handler (newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.topic = getHtmlTopic(this.$refs['markdownContent']) || []
          })
        }
      }
    }
  },
  data: () => ({
    topic: []
  })
}
</script>

<style lang="scss">
@import '@/assets/styles/markdown.scss';
.article-view {
  padding: 0 1rem;

  .website-title {
    margin: 1.5rem 0;
    font-size: 1.3rem;
    // font-style: italic;
  }

  .article {
    color: #304455;

    .header {
      margin-bottom: .3rem;
    }

    .title {
      margin: 0;
      margin-bottom: .3rem;
      font-size: 2rem;
    }

    .updated {
      padding-left: .5rem;
    }

    .topic {
      position: fixed;
      z-index: 995;
      left: 0;
      top: 15%;
      transform: translate(-98%);
      margin: 0;
      padding: .3em 0;
      background-color: #282C34;
      transition: all .3s ease;
      // border-radius: .4em;
      list-style-type: none;
      overflow: hidden;

      &:hover {
        transform: translate(0);
      }

      .topic-wrap {
        margin-left: -14px;
        transform: translateX(14px);
        max-height: 50vh;
        overflow-y: scroll;
      }

      .topic-item {
        padding: 0 .8em 0 .2em;
        color: #399BC2;
        line-height: 1.5em;
      }
    }
  }
  
  .line {
    height: 1px;
    background-color: #ccc;
  }
}
</style>