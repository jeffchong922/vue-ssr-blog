<template>
  <v-data-table class="elevation-1"
    :items="tableItems"
    :loading="fetching"
    :headers="tableHeaders"
    loading-text="正在加载..."
  >
    <template v-slot:item.options="{ item }">
      <table-opts-btn :item="item" @editData="editData" @deleteData="deleteData"/>
    </template>
  </v-data-table>
</template>

<script>
import TableOptsBtn from '../TableOptsBtn'
import { tryCatchFuncMix } from '../../utils/mixins'
import { deleteArticleById, getArticles } from '../../models/ArticleModel'
export default {
  name: 'ArticleListContent',
  mixins: [
    tryCatchFuncMix
  ],
  components: { TableOptsBtn },
  created () {
    this.fetchData()
  },
  computed: {
    tableHeaders: () => ([
      { text: 'ID', value: '_id' },
      { text: 'Title', value: 'title' },
      { text: 'Options', value: 'options' }
    ])
  },
  data: () => ({
    fetching: false,
    tableItems: []
  }),
  methods: {
    // 页面跳转
    editData ({ _id }) {
      this.$router.push(`/article/edit/${_id}`)
    },
    // 删除并重新获取数据
    async deleteData ({ _id }) {
      const result = await this.tryCatchFunc(deleteArticleById, _id)
      result && this.showSnackbar('success', '删除成功！！！', 1500)
      result && this.retakeItems()
    },
    retakeItems () {
      this.tableItems = []
      this.fetchData()
    },
    // 获取数据
    async fetchData () {
      this.fetching = true
      const result = await this.tryCatchFunc(getArticles)
      this.fetching = false
      result && this.pushItems(result.data)
    },
    pushItems ({ data }) {
      this.tableItems.push(...data)
    }
  }
}
</script>