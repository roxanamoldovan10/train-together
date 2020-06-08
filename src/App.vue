<template>
  <div id="app" class="columns">
    <Navigation></Navigation>
    <!-- -->
    <div class="routers">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navigation from './components/navigation/navigation.vue';
export default {
  name: 'app',
  components: {
    Navigation: Navigation,
  },
};
</script>

<style lang="scss">
.routers {
  width: 100%;
  height: 100%;
}
</style>
