<template>
  <div class="home container">
    <h1 class="title is-1">Netprops Viewer</h1>
    <p class="subtitle is-4">Click a valid netprops, or upload a custom one.</p>
    <div class="buttons ">
      <b-button tag="router-link" to="l4d2">View Left 4 Dead 2 Netprops</b-button>
      <b-button tag="router-link" to="csgo">View Counter-Strike: Global Offensive Netprops</b-button>
      <b-button tag="router-link" to="tf2">View Team Fortress 2 Netprops</b-button>
      <b-button tag="router-link" to="custom">Open Custom URL</b-button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
  }
}
</script>
