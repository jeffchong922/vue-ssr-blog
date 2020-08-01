<template>
  <div class="fill-height">
    <v-navigation-drawer app expand-on-hover permanent>
      <home-nav/>
    </v-navigation-drawer>
    <v-main>
      <router-view :key="$route.path"></router-view>
    </v-main>
    <!-- 遮罩层 -->
    <v-overlay
      :value="isShowOverlay"
    >
      <v-progress-circular indeterminate
        :size="70"
        :width="7"
      ></v-progress-circular>
    </v-overlay>
  </div>  
</template>

<script>
import HomeNav from '../components/HomeNav'
export default {
  name: 'HomePage',
  components: { HomeNav },
  data () {
    return {
      drawer: true,
      isShowOverlay: false
    }
  },
  methods: {
    /* 控制遮罩层 */
    closeOverlay () {
      this.isShowOverlay = false
    },
    openOverlay () {
      this.isShowOverlay = true
    }
  }
}
</script>
