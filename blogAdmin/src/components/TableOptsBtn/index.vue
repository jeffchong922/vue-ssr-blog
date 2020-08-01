<template>
  <div>
    <v-btn small color="blue lighten-5" class="ml-2" @click="handleItem('edit')">编辑</v-btn>
    <v-btn small color="red lighten-2" class="ml-2" @click="showDialog = true">删除</v-btn>
    <v-dialog max-width="290" v-model="showDialog">
      <v-card>
        <v-card-title class="headline">
          {{ `你确定删除 '${item.title || item.name || ''}' 吗？` }}
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error darken-1" text @click="() => { showDialog = false; handleItem('delete') }">确认</v-btn>
          <v-btn color="green darken-1" text @click="showDialog = false">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'TableOptsBtn',
  props: {
    item: { type: Object, required: true }
  },
  data: () => ({
    showDialog: false
  }),
  methods: {
    handleItem (type) {
      type === 'delete'
        ? this.$emit('deleteData', this.item)
        : this.$emit('editData', this.item)
    }
  }
}
</script>