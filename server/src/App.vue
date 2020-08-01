<template>
  <div id="app"><router-view class="view"></router-view></div>
</template>

<style lang="scss">
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  color: #34495e;
  background-color: #ffffff;
  overflow-y: scroll;
}

a {
  color: inherit;
  text-decoration: none;
}

.view {
  margin: 0 auto;
  max-width: 800px;
  // border: 1px dashed #444
}
</style>