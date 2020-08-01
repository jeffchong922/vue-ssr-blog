<template>
  <li class="article-item">
    <header class="header">
      <h2 class="title">
        <router-link :to="`/article/${article._id}`">{{ article.title }}</router-link>
      </h2>
      <small>
        {{ new Date(article.created_time).toLocaleDateString() }}
        <span class="updated" v-if="article.updated_time !== article.created_time">
          updated: {{ new Date(article.updated_time).toLocaleDateString() }}
        </span>
      </small>
    </header>
    <section>
      <p class="description" v-if="article.description">{{ article.description }}</p>
    </section>
  </li>
</template>

<script>
export default {
  name: 'article-item',
  props: ['article']
}
</script>

<style lang="scss">
.article-item {
  margin-bottom: 2.5rem;

  .header {
    margin-bottom: .3rem;
  }

  .title {
    margin: 0;
    margin-bottom: .3rem;
    font-size: 2.2rem;
    color: #007ACC;
  }

  .updated {
    padding-left: .5rem;
  }

  .description {
    margin: 0;
    line-height: 1.5rem;
    font-weight: 600;
  }
}
</style>