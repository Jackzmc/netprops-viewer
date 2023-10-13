<template>
  <div class="home container">
    <h1 class="title is-1">Netprops & Datamaps Viewer</h1>
    <p class="subtitle is-4">Click a valid netprops, or upload a custom one.</p>
    <div class="buttons ">
      <b-button tag="router-link" to="l4d2">View Left 4 Dead 2 Netprops</b-button>
      <b-button tag="router-link" to="l4d2">View Left 4 Dead 2 Datamaps</b-button>
    </div>
    <div class="buttons">
      <b-button tag="router-link" to="csgo">View CS:GO Netprops</b-button>
      <b-button tag="router-link" to="tf2">View Team Fortress 2 Netprops</b-button>
      <b-button tag="router-link" class="is-primary" to="custom">Upload Custom Netprops</b-button>
    </div>
    <hr />
    <h4 class="title is-4">Outdated?</h4>
    <p>
      If any netprops / datamaps are outdated or missing, feel free to email me at <b>me@jackz.me</b>. If you want (it helps), you can update the netprops data yourself, and send that to my email or make a pull request, or upload it to use it in the meantime
    </p>
    <br />
    <h5 class="title is-5">Source Code</h5>
    <p>
      <b-button tag="a" class="is-dark" href="https://github.com/jackzmc/netprops-viewer">View on Github</b-button>
    </p>
    <br>
    <h5 class="title is-5">Acquiring Netprops Data</h5>
    <p>This requires to have an up to date sourcemod server</p>
    <p>Run the command <code>sm_dump_netprops_xml netprops.xml</code>, this will create the <b>netprops.xml</b> file in your game's inner folder</p>
    <p>Run the command <code>sm_dump_dataprops_xml dataprops.xml</code>, this will create the <b>dataprops.xml</b> file in your game's inner folder</p>
    <br>
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
