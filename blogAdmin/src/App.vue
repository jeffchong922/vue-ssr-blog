<template>
  <v-app>
    <router-view/>
    <v-snackbar top vertical
      v-model="snackBarStatus"
      :color="snackBarColor"
      :timeout="snackBarTimeout"
    >
      {{snackBarText}}
      <template v-slot:action="{ attrs }">
        <v-btn text
          v-bind="attrs"
          @click="snackBarStatus = false"
        >
          关闭
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { Bus, BusEvent } from './api/Bus'
export default {
  name: 'App',
  created () {
    Bus.$on(BusEvent.SNACKBAR, ({color, message, timeout}) => {
      this.showSnackbar(color, message, timeout)
    })
  },
  data () {
    return {
      snackBarText: '',
      snackBarColor: 'info',
      snackBarStatus: false,
      snackBarTimeout: 3000
    }
  },
  methods: {
    showSnackbar (color, message, timeout) {
      this.snackBarColor = color
      this.snackBarText = message
      this.snackBarStatus = true,
      this.snackBarTimeout = timeout
    },
  }
};
</script>
