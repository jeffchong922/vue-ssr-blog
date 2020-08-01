<template>
  <div class="articles-view">
    <header>
      <h1 class="website-title"><router-link to="/">Jeff Chong 的简易博客</router-link></h1>
    </header>
    <main>
      <author-info/>
      <div class="article-tags"
        @click="changeTag"
        v-if="tags && tags.length"
      >
        <span class="tag"
          v-for="tag of tags" :key="tag"
          :class="{'active': activeTag === tag}"
        >
          <a href="javascript:;" :data-tag="tag">{{ tag }}</a>
        </span>
      </div>
      <div class="article-list">
        <transition-group tag="ul" name="article">
          <article-item class="article-item"
            :article="article"
            :key="article._id"
            v-for="article of activeArticleList"
          />
        </transition-group>
      </div>
    </main>
  </div>
</template>

<script>
import AuthorInfo from '../components/AuthorInfo.vue'
import ArticleItem from '../components/ArticleItem.vue'
import { watchArticles } from '../api'
export default {
  name: 'article-list',
  components: { AuthorInfo, ArticleItem },
  asyncData ({ store }) {
    return store.dispatch('FETCH_ARTICLE_LIST')
  },
  title: '全部文档',
  beforeMount () {
    this.loadTags()
  },
  mounted () {
    this.__unwatchList = watchArticles(() => {
       console.log('client socket got articlesChanged')
       this.$bar.start()
       this.$store.dispatch('FETCH_ARTICLE_LIST')
        .then(() => {
          this.loadTags()
          this.$bar.finish()
        })
    })
  },
  beforeDestroy () {
    this.__unwatchList()
  },
  computed: {
    tags () {
      const { articleTags } = this.$store.state
      return articleTags
    },
    activeArticleList () {
      const { activeArticleList } = this.$store.getters
      return activeArticleList
    }
  },
  watch: {
    activeTag () {
      this.$store.dispatch('SET_ACTIVE_TAG', { tag: this.activeTag })
    }
  },
  data: () => ({
    activeTag: ''
  }),
  methods: {
    loadTags () {
      this.$bar.start()
      this.$store.dispatch('FETCH_ARTICLE_TAGS')
        .then(() => this.$bar.finish())
    },
    changeTag (e) {
      const target = e.target || e.srcElement,
            tagName = target.tagName.toLowerCase()
      if (tagName === 'a') {
        const tag = target.getAttribute('data-tag')
        this.activeTag = this.activeTag === tag
          ? ''
          : tag
      }
    }
  }
}
</script>

<style lang="scss">
.articles-view {
  .website-title {
    margin: 2rem 0;
    font-size: 4em;
    color: #000;
  }

  .article-tags {
    display: flex;
    flex-wrap: wrap;
    margin: 1em 0;

    .tag {
      margin: .3em;
      padding: .2em .4em;
      font-size: 1.1em;
      font-weight: 500;
      background-color: #ddd;
      border-radius: .8em;

      &.active {
        color: #fff;
        background-color: #4a7490;
      }
    }
  }

  .article-list {
    ul {
      margin: 0;
      padding: 0;
      list-style-type: none;
    }
  }

  .article-item {
    transition: all .5s;
  }
  .article-leave-active {
    position: absolute;
  }
  .article-enter,
  .article-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
}



</style>