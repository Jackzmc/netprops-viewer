<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Selection Home</router-link> |
      <router-link to="/l4d2">L4D2</router-link> |
      <router-link to="/csgo">CSGO</router-link> |
      <router-link to="/tf2">TF2</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
