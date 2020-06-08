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
// Import and use own colors instead of Bluma's
@import '~bulma/sass/utilities/_all';
@import './scss/colors';

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
  'white': (
    $white,
    $black,
  ),
  'black': (
    $black,
    $white,
  ),
  'light': (
    $light,
    $light-invert,
  ),
  'dark': (
    $dark,
    $dark-invert,
  ),
  'primary': (
    $primary,
    $primary-invert,
  ),
  'info': (
    $info,
    $info-invert,
  ),
  'success': (
    $success,
    $success-invert,
  ),
  'warning': (
    $warning,
    $warning-invert,
  ),
  'danger': (
    $danger,
    $danger-invert,
  ),
);

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

// Import Bulma and Buefy styles
@import '~bulma';
@import '~buefy/src/scss/buefy';
.routers {
  width: 100%;
  height: 100%;
}
</style>
