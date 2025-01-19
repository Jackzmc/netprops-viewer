<template>
<div class="modal-card" style="width: auto">
    <header class="modal-card-head">
        <p class="modal-card-title">Upload a Custom Netprops / Datamaps File</p>
        <b-button class="delete" aria-label="close" @click="$emit('close')"></b-button>
    </header>
    <section class="modal-card-body">
        <b-loading :active="uploading" />
        <div class="content">
            <p>
                If you want to use either an updated / missing netprops or datamaps file, you can upload them here.
                Please feel free to also send them to me at <b>me@jackz.me</b> or open a pull request to be included.
            </p>
            <h5>How to acquire a netprops / datamaps file</h5>
            <p>This assumes you to have a <a href="https://wiki.alliedmods.net/Installing_sourcemod">sourcemod</a> server already setup</p>
            <ul>
                <li>Run the command <code>sm_dump_netprops_xml netprops.xml</code></li>
                <li>Run the command <code>sm_dump_datamaps_xml datamaps.xml</code></li>
                <li>In your game's inner folder (tf2 is 'tf', l4d2 is 'l4d2', etc) will be the <b>netprops.xml</b> and <b>datamaps.xml</b> file</li>
            </ul>
            <h4>Upload</h4>
        </div>
        <div class="file is-boxed" v-if="!uploading">
            <label class="file-label">
                <input class="file-input" type="file" name="resume" accept=".xml" @change="onUpload">
                <span class="file-cta">
                <span class="file-icon">
                    <i class="fas fa-upload"></i>
                </span>
                <span class="file-label">
                    Choose a file…
                </span>
                </span>
            </label>
        </div>
        <br />
        <b-message type="is-warning">
            Netprops files are large, datamap files are even larger. Due to these large sizes, this may freeze your browser or your computer while its being parsed.
        </b-message>
    </section>
</div>
</template>

<script>
export default {
    data() {
        return {
            uploading: false
        }
    },
    methods: {
        onUpload(e) {
            this.uploading = true
            const file = e.target.files[0]
            const reader = new FileReader();
            reader.addEventListener("load", e => {
                this.$emit('upload', e.target.result)
                this.$parent.close()
            })
            reader.readAsText(file)
        }
    }
}
</script>