<template>
  <v-form>
    <v-text-field label="username" prepend-icon="mdi-account"
      :value="username"
      @input="val => $emit('update:username', val)"
    >
    </v-text-field>
    <v-text-field label="password" prepend-icon="mdi-lock"
      :value="password"
      @input="val => $emit('update:password', val)"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showPassword ? 'text' : 'password'"
      @click:append="showPassword = !showPassword"
    >
    </v-text-field>
  </v-form>
</template>

<script>
export default {
  name: 'AuthForm',
  props: {
    username: { type: String, default: '' },
    password: { type: String, default: '' }
  },
  data () {
    return {
      showPassword: false
    }
  }
}
</script>