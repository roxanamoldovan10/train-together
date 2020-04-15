<template>
  <div id="app" class="columns">
    <div id="nav" class="navbar column is-1 is-light">
      <router-link to="/dashboard" class="navbar-item">
        <font-awesome-icon icon="home"></font-awesome-icon
      ></router-link>
      <router-link to="/settings" class="navbar-item">
        <font-awesome-icon icon="cog"></font-awesome-icon>
      </router-link>
      <router-link to="/find" class="navbar-item">
        <font-awesome-icon icon="search"></font-awesome-icon>
      </router-link>
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
