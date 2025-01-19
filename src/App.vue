<template>
  <div id="app">
    <div id="nav">
      <router-link exact to="/" >Home</router-link> |
      <router-link to="/l4d2/netprops">L4D2: Netprops</router-link> |
      <router-link to="/l4d2/datamaps">L4D2: Datamaps</router-link> |
      <router-link to="/csgo/netprops">CSGO: Netprops</router-link> |
      <router-link to="/tf2/netprops">TF2: Netprops</router-link> |
      <router-link to='/custom'>Upload Custom</router-link>

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
  },
  watch:{
    '$route.path': function() {
      this.selection = null
    }
  },
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
