<template>
  <div id="app" class="columns">
    <div id="nav" class="navbar column is-1 is-light">
      <router-link to="/">Home</router-link> |
      <router-link to="/dashboard">Dashboard</router-link> |
      <router-link to="/settings">Settings</router-link> |
      <router-link to="/find">Find</router-link>
    </div>
    <div class="column main-section">
      <div class="columns">
        <div class="column is-2"></div>
        <div class="column is-8">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
