<template>
  <div id="app" class="columns">
    <Navigation></Navigation>
    <!-- -->
    <div style="width:100%">
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
