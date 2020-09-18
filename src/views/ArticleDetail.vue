<template>
  <div>
    <site-title></site-title>

    <div v-if="article" class="my-6">
      <h2 class="text-3xl sm:text-4xl font-bold">{{article.title}}</h2>
      <small>最后更新于: {{new Date(article.modifiedOn).toLocaleDateString()}}</small>
    </div>

    <section ref="markdown-content" class="markdown-content" v-html="articleContent"></section>

    <!-- 目录清单 start -->
    <div class="fixed right-0 bottom-0 mr-8 mb-8 w-16 h-16 rounded-full bg-blue-900">

      <!-- 目录 start -->
      <div class="absolute right-0 bottom-0 mb-20 whitespace-no-wrap opacity-0 h-0 overflow-hidden transition-opacity duration-500 rounded-md bg-gray-600 "
        :class="{ 'opacity-100 h-auto overflow-y-auto overflow-x-auto p-1': showTopic }"
        style="max-height: 50vh"
      >
        <nav>
          <!-- a 标签使用  :href="`#${topic.href}`" -->
          <span class="block px-1 hover:bg-gray-800 rounded-md cursor-pointer" v-for="(topic, i) in articleTopics" :key="i"
            @click="handleSelectTopic(topic)"
            :class="{
              'bg-gray-800': topic.href === currentTopic,
              'ml-5': topic.level == 3,
              'ml-10': topic.level == 4
            }"
          >
            {{topic.title}}
          </span>
          <!-- 回到顶部 -->
          <span class="block px-1 hover:bg-gray-800 rounded-md cursor-pointer text-center text-blue-300"
            @click="goToTop"
          >
            &lt;回到顶部&gt;
          </span>
        </nav>
      </div>
      <!-- 目录 end -->
      
      <!-- ICON start -->
      <ul class="w-full h-full flex flex-col justify-center items-center cursor-pointer" @click="showTopic = !showTopic">
        <!-- transform origin-left rotate-45 translate-x-1 -translate-y-1 -->
        <li class="w-4/6 h-1 my-1 bg-gray-500 transition duration-500 transform origin-left"
          :class="{ 'rotate-45 translate-x-1 -translate-y-1': showTopic }"
        ></li>
        <!-- opacity-0 -->
        <li class="w-4/6 h-1 bg-gray-500 transition-opacity duration-500"
          :class="{ 'opacity-0': showTopic }"
        ></li>
        <!-- transform origin-left -rotate-45 translate-x-1 translate-y-1 -->
        <li class="w-4/6 h-1 my-1 bg-gray-500 transition duration-500 transform origin-left"
          :class="{ '-rotate-45 translate-x-1 translate-y-1': showTopic }"
        ></li>
      </ul>
      <!-- ICON end -->
    </div>
    <!-- 目录清单 end -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SiteTitle from '../components/SiteTitle.vue'
import {
  throttle,
  getHtmlTopic,
  getHtmlContent,
  getHtmlClientHeight,
  smoothScrollForWindow,
  getBoundingClientRectById,
} from '../_helpers'
export default {
  name: 'article-detail',
  asyncData ({ store, route }) {
    const { id } = route.params
    return store.dispatch('fetchArticle', { id })
  },
  title () {
    return this.article.title || '😊标题未加载'
  },
  mounted () {
    this.__scrollHanlder = throttle(this.handleScroll, 500, true)
    window.addEventListener('scroll', this.__scrollHanlder)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.__scrollHanlder)
  },
  components: { SiteTitle },
  computed: {
    ...mapGetters({
      article: 'currentArticle'
    }),
    articleContent () {
      const markdownText = this.article && this.article.content
      return getHtmlContent(markdownText)
    }
  },
  watch: {
    articleContent: {
      immediate: true,
      handler (contentText) {
        if (contentText) {
          this.$nextTick(() => {
            this.articleTopics = getHtmlTopic(this.$refs['markdown-content'])
          })
        }
      }
    }
  },
  data: () => ({
    showTopic: false,
    articleTopics: [],
    currentTopic: ''
  }),
  methods: {
    goToTop () {
      const duration = 500
      const top = -(window.pageYOffset)
      smoothScrollForWindow(top, duration)
    },
    handleSelectTopic (topic) {
      const id = topic.href
      const duration = 500

      const { top } = getBoundingClientRectById(id)
      smoothScrollForWindow(top, duration)
    },

    handleScroll () {
      const htmlClientH = getHtmlClientHeight(),
            activeDistance = htmlClientH / 4

      const topicsTop = this.articleTopics.map(topic => {
        const id = topic.href
        const { top = -99999 } = getBoundingClientRectById(id)
        return {
          id,
          distance: top,
        }
      })

      const currentIdx = topicsTop.findIndex(({ distance }) => distance > 0)
      if (~currentIdx) {
        const { distance, id } = topicsTop[currentIdx]

        let currentId = ''
        if (distance < activeDistance) {
          currentId = id
        }
        if (distance > activeDistance && (currentIdx !== 0)) {
          const prevIdx = currentIdx - 1
          currentId = topicsTop[prevIdx].id
        }
        this.currentTopic = currentId
      }
    }
  }
}
</script>

<style lang="scss">
.markdown-content {
  @apply my-10;
  h2 {
    @apply mb-6 mt-8 text-2xl border-b;
    @screen sm {
      @apply text-3xl;
    }
  }

  h3 {
    @apply mb-4 mt-6 text-xl;
    @screen sm {
      @apply text-2xl;
    }
  }

  h4 {
    @apply mb-3 mt-5 text-lg;
    @screen sm {
      @apply text-xl;
    }
  }

  h2,h3,h4 {
    @apply font-bold text-blue-700;
    &::before {
      content: '';
      display: block;
      margin-top: -2rem;
      height: 2rem;
      visibility: hidden;
    }
  }

  p {
    @apply my-3 text-base;
    @screen sm {
      @apply text-lg;
    }
  }

  code {
    @apply px-2 text-sm rounded-lg text-yellow-500 bg-gray-800;
    @screen sm {
      @apply text-base;
    }
  }

  em {
    @apply text-purple-400;
  }

  strong {
    @apply text-red-600;
  }

  pre {
    background-color: #2d2d2d;
    @apply my-3 text-sm rounded-lg px-2;

    @screen sm {
      @apply text-base;
    }

    & > code {
      // padding-left: 0;
      // padding-right: 0;
      font-size: inherit;
      background: none;
      color: #abb2bf;
    }
  }

  blockquote {
    @apply border-l-4 pl-4 italic;
  }

  ul,ol {
    @apply pl-8;
  }
  ul {
    @apply list-disc;
  }
  ol {
    @apply list-decimal;
  }
  li {
    @apply my-3;
  }

  .inline-link {
    @apply text-teal-500 border-b border-teal-500;
  }

  img {
    @apply mx-auto;
  }
}
</style>