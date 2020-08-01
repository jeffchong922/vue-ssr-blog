<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="12">
        <article-list-content/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArticleListContent from '../../components/ArticleListContent'
export default {
  name: 'ItemList',
  components: { ArticleListContent }
}
</script>