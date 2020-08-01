<template>
  <div class="author-info">
    <div class="avatar">
      <img src="@/assets/avatar.jpg" alt="avatar">
    </div>
    <div class="info">
      <span>作者：Jeff Chong</span>
      <br>
      <span>技术点：
        <a href="https://cn.vuejs.org/" target="_blank" rel="noopener">Vue</a>、
        <a href="https://ssr.vuejs.org/zh/" target="_blank" rel="noopener">Vue-SSR</a>、
        <a href="https://www.expressjs.com.cn/" target="_blank" rel="noopener">Express</a>、
        <a href="https://www.mongodb.com/" target="_blank" rel="noopener">MongoDB</a></span>
      <br>
      <span>作用：收录所学知识</span>
      <br>
      <span>
        Github：<a href="https://github.com/Jeff-Chong/vue-ssr-blog" target="_blank" rel="noopener">源码</a>，
        Email：<a href="mailto:zifzhong@yeah.net">zifzhong@yeah.net</a>
      </span>
      <br>
      <span>后台：<a href="/admin">Click me</a></span>
    </div>
  </div>
</template>

<style lang="scss">
.author-info {
  position: relative;
  margin: 40px 0;
  padding-left: 66px;
  min-height: 80px;
  font-size: 1rem;
  font-weight: bolder;
  line-height: 1.4rem;

  a {
    color: #444;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      z-index: -1;
      top: 90%;
      left: -0.1em;
      right: -0.1em;
      bottom: 0;
      transition: top 200ms cubic-bezier(0, .8, .13, 1);
      background-color: rgba(93, 100, 143, .3);
    }

    &:hover::after {
      top: 15%;
    }
  }

  .avatar {
    position: absolute;
    top: 0;
    left: 0;
    width: 66px;
    height: 66px;
    font-size: 0;
    border-radius: 50%;
    overflow: hidden;
    
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 100%;
    }
  }

  .info {
    padding: 0 1rem;
  }
}
</style>