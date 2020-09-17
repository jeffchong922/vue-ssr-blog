<template>
  <div id="app" class="max-w-4xl mx-auto px-3">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { articleSocket } from './_socket'
export default {
  name: 'app',

  beforeMount () {
    articleSocket.openConnected()
    articleSocket.listenPost({
      callback: (article) => {
        this.addArticle({ data: article })
      }
    })
    articleSocket.listenUpdate({
      callback: (article) => {
        this.updateArticle({ data: article })
      }
    })
    articleSocket.listenDelete({
      callback: (id) => {
        this.removeArticle({ id })
      }
    })
  },

  beforeDestroy () {
    articleSocket.closeConnected()
  },

  methods: {
    ...mapActions({
      addArticle: 'addArticle',
      removeArticle: 'removeArticle',
      updateArticle: 'updateArticle'
    })
  }
}
</script>

<style src="./assets/styles/tailwind.css"></style>