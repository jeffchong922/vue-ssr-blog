<template>
  <v-list nav dense class="py-0">
    <v-list-item two-line class="px-0">
      <v-list-item-avatar>
        <img src="@/assets/images/avatar.jpg">
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>Administer System</v-list-item-title>
        <v-list-item-subtitle>Jeff Chong</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>
    
    <v-list-item link
      :exact="true"
      :to="item.path"
      v-for="item of navItems"
      :key="item.title"
    >
      <v-list-item-icon>
        <v-icon v-text="item.icon"></v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-text="item.title"></v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list-item
      href="/"
    >
      <v-list-item-icon>
        <v-icon v-text="'mdi-lightbulb'"></v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-text="'Web Site'"></v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item
      @click="signOut"
    >
      <v-list-item-icon>
        <v-icon v-text="'mdi-logout-variant'"></v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-text="'Logout'"></v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { clearToken } from '../../utils/token'
export default {
  name: 'HomeNav',
  computed: {
    navItems: () => ([
        { title: 'Edit Article', icon: 'mdi-file-document-edit-outline', path: '/article/edit' },
        { title: 'Article List', icon: 'mdi-file-multiple-outline', path: '/article/list' }
      ])
  },
  methods: {
    signOut () {
      clearToken()
      this.$router.replace('/auth')
    }
  }
}
</script>
