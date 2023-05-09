<template>
  <div id="app">
    <div id="nav">
      <router-link to="/l4d2">L4D2</router-link> |
      <router-link to="/csgo">CSGO</router-link> |
      <router-link to="/tf2">TF2</router-link> |
      <router-link to='/custom'>Custom</router-link>

      <span v-if="selection" style="margin-left: 20em">
        <b>Selected class:</b> {{selection}}
      </span>
    </div>
    <router-view @select='sel => selection = sel' />
  </div>
</template>

<script>
export default {
  data() {
    return {
      selection: null,
    }
  }
}
</script>

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

#nav a.router-link-active {
  color: #42b983;
}
</style>
