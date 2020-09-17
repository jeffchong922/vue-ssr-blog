<template>
  <div>
    <site-title></site-title>
    
    <!-- tagList start -->
    <ul class="clearfix sm:text-xl mb-8 sm:mb-10" @click="setFilterTag">
      <li class="float-left m-2 cursor-pointer select-none" v-for="tag in Object.keys(articleTags)" :key="tag" :data-tag="tag">
        <span class="border border-r-0 px-1 rounded-l" :class="{ 'bg-indigo-700': tag === filterTag }">{{tag}}</span>
        <span class="border border-l-0 px-1 rounded-r bg-gray-100 text-black">{{articleTags[tag]}}</span>
      </li>
    </ul>
    <!-- tagList end -->

    <div class="mb-8 sm:mb-10">
      <p class="text-gray-600">根据输入内容进行标题过滤</p>
      <input class="text-black w-full py-1 px-3 text-2xl leading-none rounded outline-none" type="text" v-model="filterTitle">
    </div>

    <!-- articleList start -->
    <transition-group tag="main" name="articles">
      <section v-for="article in filterArticleList" :key="article.id" class="mb-8 sm:mb-12 md:mb-16 transition-all duration-500">
        <header class="mb-2">
          <h2 class="font-bold text-2xl md:text-3xl text-blue-300 b">
            <router-link :to="`/articles/${article.id}`">{{article.title}}</router-link>
          </h2>
          <small class="text-xs text-gray-500">{{ new Date(article.createdOn).toLocaleDateString() }}</small>
          <small v-if="article.createdOn !== article.modifiedOn" class="text-xs text-gray-500 pl-5">更新于：{{ new Date(article.modifiedOn).toLocaleDateString() }}</small>

          <!-- tags start -->
            <ul class="clearfix">
              <li v-for="tag in article.tags" :key="tag" class="float-left rounded border border-gray-600 mr-2 text-xs px-1 text-gray-500">{{tag}}</li>
            </ul>
          <!-- tags end -->
        </header>
        <main>
          <p class="text-sm md:text-base">{{article.description}}</p>
        </main>
      </section>
    </transition-group>
    <!-- articleList end -->
  </div>
</template>

<script>
import SiteTitle from '../components/SiteTitle.vue'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'article-list',
  asyncData ({ store }) {
    return store.dispatch('fetchArticleList')
  },
  title: '😊全部文档',
  components: { SiteTitle },
  computed: {
    ...mapState({
      articleList: state => state.list
    }),
    ...mapGetters({
      articleTags: 'articleTags'
    }),
    filterArticleList () {

      const articlesByTag = this.filterTag
        ? this.articleList.filter(article => article.tags.includes(this.filterTag))
        : this.articleList

      const articlesByTitle = this.filterTitle
        ? articlesByTag.filter(article => article.title.includes(this.filterTitle))
        : articlesByTag

      return articlesByTitle
    }
  },
  data: () => ({
    filterTag: '',
    filterTitle: ''
  }),
  methods: {
    setFilterTag (e) {
      new Date().to
      const target = e.target
      const tagName = target.tagName.toLowerCase()
      if (tagName === 'span') {
        const tag = target.parentNode.getAttribute('data-tag')
        this.filterTag = this.filterTag === tag
          ? ''
          : tag
      }
    }
  }
}
</script>

<style>
.articles-leave-active {
  position: fixed;
}
.articles-enter,
.articles-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>