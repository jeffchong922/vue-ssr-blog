<template>
  <v-menu offset-y transition="scale-transition"
    v-model="showMenu"
    min-width="290px"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field readonly prepend-icon="mdi-calendar-edit"
        :label="dateTitle"
        :value="ISOTime"
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker no-title scrollable locale="zh-CN"
      :value="ISOTime"
      @input="dateChanged"
    ></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
    dateTitle: { type: String, default: '请设置标题' },
    ISOTime: { type: String, default: '' }
  },
  data: () => ({
    showMenu: false
  }),
  methods: {
    dateChanged (val) {
      this.$emit('update:ISOTime', val)
      this.showMenu = false
    }
  }
}
</script>