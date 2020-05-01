<template>
  <div id="app" class="columns">
    <div id="nav" class="navbar column is-1 is-light">
      <router-link to="/dashboard" class="navbar-item">
        <font-awesome-icon icon="home"></font-awesome-icon
      ></router-link>
      <router-link to="/settings" class="navbar-item">
        <font-awesome-icon icon="cog"></font-awesome-icon
      ></router-link>
    </div>
    <div style="width:100%">
      <router-view />
    </div>
  </div>
</template>
