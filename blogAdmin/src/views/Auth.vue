<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="3">
        <auth-content/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthContent from '../components/AuthContent'
export default {
  name: 'AuthPage',
  components: { AuthContent }
}
</script>