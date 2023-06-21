<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
// import TheWelcome from './components/TheWelcome.vue'
import './app.css'
</script>

<template>
  <main class="h-full flex items-center bg-main">
    <div class="text-2xl text-center bg-black/30 rounded-md max-w-md px-4 py-8 w-full mx-auto backdrop-blur-sm">
      <!-- <TheWelcome /> -->
      Soon... 🦈
    </div>
  </main>
  <div class="overflow-hidden absolute max-w-3xl bottom-0 right-0 pointer-events-none">
    <img src="./assets/pic/20230522_170011-clear.webp" class="bg-pic-anim"/>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
