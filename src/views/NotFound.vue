<template>
  <div class="flex justify-center items-center absolute inset-0">
    <div class="text-center">
      <p class="text-4xl font-bold tracking-wider text-red-400 p-2">资源未找到</p>
      <router-link to="/" class="p-1 rounded px-2 border-b-2 bg-indigo-700">返回主页</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'not-found',
  title: '😟资源为空',
}
</script>