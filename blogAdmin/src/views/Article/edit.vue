<template>
  <v-container fluid class="fill-height">
    <h2 style="width: 100%; text-align: center;">记录是良好的习惯</h2>
    <v-row>
      <v-col cols="12">
        <article-edit-content :article_id="id"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArticleEditContent from '../../components/ArticleEditContent'
export default {
  name: 'ArticleEdit',
  components: { ArticleEditContent },
  props: {
    id: { type: String, defalut: '' }
  }
}
</script>