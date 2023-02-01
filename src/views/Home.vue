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
    <hr />
    <h4 class="title is-4">Outdated?</h4>
    <p>
      If any netprops are outdated, feel free to email me at <b>me@jackz.me</b>. If you want (it helps), you can update the netprops data yourself, and send that to me, or upload it somewhere to use it in the meantime
    </p>
    <br />
    <h5 class="title is-5">Acquiring Netprops Data</h5>
    <p>This requires to have an up to date sourcemod server</p>
    <p>Run the command <code>sm_dump_netprops_xml tf2.netprops.xml</code>, this will create the <b>tf2.netprops.xml</b> file in your TF2/tf game folder</p>
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
