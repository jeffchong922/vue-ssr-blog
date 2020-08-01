<template>
  <v-row justify="center">
    <v-col cols="12" md="8" lg="5">
      <v-text-field solo rounded
        prefix="文章标题"
        :value="articleTitle"
        placeholder="click here"
        @input="(val) => $emit('dispatch', actionTypes.SET_TITLE, val)"
      ></v-text-field>
      <date-picker :dateTitle="'创建日期'" :ISOTime="created_time"
        @update:ISOTime="val => $emit('dispatch', actionTypes.SET_CREATED_TIME, val)"
      />
      <date-picker :dateTitle="'修改日期'" :ISOTime="updated_time"
        @update:ISOTime="val => $emit('dispatch', actionTypes.SET_UPDATED_TIME, val)"
      />
    </v-col>
    <v-col cols="12" md="8" lg="5">
      <v-textarea solo rounded no-resize
        rows="3"
        prefix="文章描述"
        :value="articleDesc"
        placeholder="click here"
        @input="(val) => $emit('dispatch', actionTypes.SET_DESC, val)"
      ></v-textarea>
      <div>
        <v-file-input outlined show-size persistent-hint
          label="图片上传"
          accept="image/*"
          @change="handleImageUpload"
          :hint="uploadedPath"
        >
        </v-file-input>
      </div>
    </v-col>
    <v-col cols="12">
      <v-combobox chips multiple
        v-model="selectedTags"
        :items="tags"
        label="选择或创建 Tags"
      ></v-combobox>
    </v-col>
    <v-col cols="12">
      <v-textarea outlined no-resize
        rows="20"
        label="文章内容"
        class="markdown-input"
        :value="articleContent"
        placeholder="请使用Markdown语法编写"
        @keydown="handleContentKeyup"
        @input="(val) => $emit('dispatch', actionTypes.SET_CONTENT, val)"
      ></v-textarea>
    </v-col>
  </v-row>
</template>

<script>
import DatePicker from './DatePicker'
import { uploadImg } from '../../models/UploadModel'
import * as actionTypes from '../../actions/article'
import { tryCatchFuncMix } from '../../utils/mixins'
export default {
  name: 'ArticleInfo',
  mixins: [
    tryCatchFuncMix
  ],
  components: { DatePicker },
  props: {
    articleDesc: String,
    created_time: String,
    updated_time: String,
    articleTitle: String,
    articleContent: String,
    tags: { type: Array, default: () => [] },
    selfTags: { type: Array, default: () => [] } // 用于获取特定文章时替换 selectedTags
  },
  created () {
    this.actionTypes = actionTypes
  },
  watch: {
    selfTags () {
      this.selfTags.length && this.selectedTags.splice(0, this.selectedTags.length, ...this.selfTags)
    }
  },
  data: () => ({
    uploadedPath: '',
    selectedTags: []
  }),
  methods: {
    handleContentKeyup (e) {
      if (e.keyCode === 9) {
        const target = e.target,
              selectionStart = target.selectionStart,
              selectionEnd = target.selectionEnd
        
        this.$emit('dispatch', actionTypes.SET_CONTENT, (
          this.articleContent.slice(0, selectionStart) + '  ' + this.articleContent.slice(selectionStart)
        ))
        this.$nextTick(() => {
          target.selectionStart = selectionStart + 2
          target.selectionEnd = selectionEnd + 2
        })
        e.preventDefault()
      }
    },
    /* 上传图片 */
    async handleImageUpload (file) {
      if (!file) return
      const formData = new FormData()
      formData.append('image', file)
      const result = await this.tryCatchFunc(uploadImg, formData)
      if (result) {
        console.log(`上传图片成功，结果：`, result)
        const { data } = result
        this.uploadedPath = data.data.imagePath
      }
    }
  }
}
</script>

<style>
.markdown-input textarea {
  line-height: 1.1;
}
</style>