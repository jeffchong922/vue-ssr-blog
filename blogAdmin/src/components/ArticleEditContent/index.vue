<template>
  <v-form @submit.native.prevent="editData">
    <v-container fluid>
      <v-tabs show-arrows>
        <v-tab href="#tab-info">Information</v-tab>
        <!-- <v-tab href="#tab-preview">Preview</v-tab> -->
        <!-- tab-item -->
        <v-tab-item value="tab-info">
          <article-info ref="articleInfo"
            :tags="tags"
            :selfTags="selfTags"
            @dispatch="dispatch"
            :articleDesc="articleDesc"
            :articleTitle="articleTitle"
            :created_time="created_time"
            :updated_time="updated_time"
            :articleContent="articleContent"
          />
        </v-tab-item>
        <!-- <v-tab-item value="tab-preview">
          <content-view
            :articleContent="articleContent"
          />
        </v-tab-item> -->
      </v-tabs>
      <div class="edit-form-btn-group">
        <v-btn color="primary" type="submit"
          :loading="submitting"
          v-text="'保存'"
        ></v-btn>
        <v-btn class="ml-1" color="info" type="button"
          @click="$router.replace('/article/list')"
          v-text="'列表页'"
        ></v-btn>
      </div>
    </v-container>
  </v-form>
</template>

<script>
import ArticleInfo from './ArticleInfo'
// import ContentView from './ContentView'
import articleDispatcher from '../../dispatchers/article'
import { tryCatchFuncMix, controlOverlayMix } from '../../utils/mixins'
import { createArticle, deleteArticleById, getArticleById, getArticleTags, updateArticleById } from '../../models/ArticleModel'
export default {
  name: 'ArticleEditContent',
  mixins: [
    tryCatchFuncMix,
    controlOverlayMix
  ],
  components: { ArticleInfo },
  props: {
    article_id: String
  },
  created () {
    this.fetchAlltag()
    this.article_id && this.fetchDataBydId(this.article_id)
  },
  data: () => ({
    tags: [],
    selfTags: [],
    submitting: false,
    articleDesc: '',
    articleTitle: '',
    articleContent: '',
    created_time: new Date().toISOString().substr(0, 10),
    updated_time: new Date().toISOString().substr(0, 10)
  }),
  methods: {
    dispatch (type, ...args) {
      articleDispatcher(this)(type, ...args)
    },
    // 获取已存tag
    async fetchAlltag () {
      const result = await this.tryCatchFunc(getArticleTags)
      result && this.pushTags(result.data)
    },
    pushTags ({ data }) {
      this.tags.push(...data)
    },
    // 获取特定数据
    async fetchDataBydId (id) {
      this.openOverlay()
      const result = await this.tryCatchFunc(getArticleById, id)
      this.closeOverlay()
      result && this.rplSelfData(result.data)
    },
    rplSelfData ({ data }) {
      const { title, description, content, tags, created_time, updated_time } = data
      this.selfTags = tags
      this.articleTitle = title
      this.articleContent = content
      this.articleDesc = description
      this.created_time = new Date(created_time).toISOString().substr(0, 10)
      // this.updated_time = new Date(updated_time).toISOString().substr(0, 10)
    },
    // 保存数据
    async editData () {
      if (!this.articleTitle) return this.showSnackbar('info', '请确保数据完整性')
      
      const { articleInfo } = this.$refs
      this.submitting = true
      
      const modelData = {
        title: this.articleTitle,
        description: this.articleDesc,
        tags: articleInfo.selectedTags,
        content: this.articleContent,
        created_time: new Date(this.created_time).getTime(),
        updated_time: new Date(this.updated_time).getTime()
      }

      let result = undefined
      if (!this.article_id) {
        result = await this.tryCatchFunc(createArticle, modelData)
      } else {
        result = await this.tryCatchFunc(updateArticleById, this.article_id, modelData)
      }

      this.submitting = false
      result && this.showSnackbar('success', `！！！`, 1500)
    }
  }
}
</script>
