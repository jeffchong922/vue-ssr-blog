<template>
  <div :key="articleContent"
    v-markdown
    class="markdown-container"
    :style="{
      padding: '10px',
      marginTop: '20px',
      border: '1px dashed #aaa'
    }"
  >{{ articleContent }}</div>
</template>

<script>
import { markdown } from '../../diractives'
export default {
  name: 'ContentView',
  directives: {
    markdown
  },
  props: {
    articleContent: String
  }
}
</script>

<style lang="scss">
.markdown-container {
  font-size: 12px;
  line-height: 1.85;

  code {
    padding: 0;
    background: none;
    color: #C0341D;
  }

  @media screen and (min-width: 384px) and (max-width: 576px) {
    font-size: 15px;
  }
  @media screen and (min-width: 576px) {
    font-size: 16px;
  }

  p,
  .air-p {
    font-size: 1em;
    margin-bottom: 1.3em;
  }

  h1,
  .air-h1,
  h2,
  .air-h2,
  h3,
  .air-h3,
  h4,
  .air-h4 {
    margin: 1.414rem 0 0.5em;
    font-weight: inherit;
    line-height: 1.42;
  }

  h1,
  .air-h1 {
    margin-top: 0;
    font-size: 3.998em;
  }

  h2,
  .air-h2 {
    font-size: 2.827em;
  }

  h3,
  .air-h3 {
    font-size: 1.999em;
  }

  h4,
  .air-h4 {
    font-size: 1.414em;
  }

  h5,
  .air-h5 {
    font-size: 1.121em;
  }

  h6,
  .air-h6 {
    font-size: .88em;
  }

  small,
  .air-small {
    font-size: .707em;
  }

  img,
  canvas,
  iframe,
  video,
  svg,
  select,
  textarea {
    max-width: 100%;
  }

  @import url(http://fonts.googleapis.com/css?family=Open+Sans:300italic,300);
  color: #444;
  font-family: 'Open Sans', Helvetica, sans-serif;
  font-weight: 300;
  margin: 6em auto 1em;
  max-width: 48em;
  text-align: left;

  img {
    border-radius: 50%;
    height: 200px;
    margin: 0 auto;
    width: 200px;
  }

  a,
  a:visited {
    color: #3498db;
  }
  a:hover,
  a:focus,
  a:active {
    color: #2980b9;
  }

  pre {
    background-color: #fafafa;
    padding: 1em;
    text-align: left;
  }

  blockquote {
    margin: 0;
    border-left: 5px solid #7a7a7a;
    font-style: italic;
    padding: 1.33em;
    text-align: left;
  }

  ul,
  ol,
  li {
    text-align: left;
  }

  p {
    color: #777;
  }
}
</style>