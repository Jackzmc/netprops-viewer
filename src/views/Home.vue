<template>
  <div class="home container">
    <h1 class="title is-1">Netprops & Datamaps Viewer</h1>
    <p class="subtitle is-4">Click a button to view the netprops/datamaps, or you can upload a file directly.</p>
    <div class="table is-size-4">
      <thead>
        <tr>
          <th>Game</th>
          <th>Netprops</th>
          <th>Datamaps</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Left 4 Dead 2</td>
          <td><router-link to="l4d2/netprops">View</router-link></td>
          <td><router-link to="l4d2/datamaps">View</router-link></td>
        </tr>
        <tr>
          <td>Team Fortress 2</td>
          <td><router-link to="tf2/netprops">View</router-link></td>
          <td></td>
        </tr>
        <tr>
          <td>CS:GO</td>
          <td><router-link to="csgo/netprops">View</router-link></td>
          <td></td>
        </tr>
      </tbody>
    </div>
    <br />
    <h4 class="title is-4">Outdated or Missing?</h4>
    <p>
      If any netprops / datamaps are outdated or missing, you can acquire the netprops/datamaps yourself (see below) and upload it to the site. In addition, feel free to email me at <a href="mailto:me+netprops@jackz.me">me+netprops@jackz.me</a> with the file, or open a pull request and I'll update/add it.
    </p>
    <br />
    <h5 class="title is-5">Acquiring Netprops Data</h5>
    <p>This requires you to have an up to date sourcemod server</p>
    <ul>
      <li><b>Netprops: </b> Run <code>sm_dump_netprops_xml netprops.xml</code> - will create a netprops.xml at for example <code>Left 4 Dead 2/l4d2/netprops.xml</code></li>
      <li><b>Datamaps: </b> Run <code>sm_dump_datamaps_xml datamaps.xml</code> - will create a datamaps.xml at for example
        <code>Left 4 Dead 2/l4d2/datamaps.xml</code></li>
    </ul>
    <br>
    <h5 class="title is-5">Source Code</h5>
    <p>
      <b-button tag="a" style="text-decoration: none;" class="is-dark" size="is-large"
        href="https://github.com/jackzmc/netprops-viewer">View on Github</b-button>
    </p>
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
