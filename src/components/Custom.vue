<template>
<div class="modal-card" style="width: auto">
    <header class="modal-card-head">
        <p class="modal-card-title">Upload a custom Netprops File</p>
    </header>
    <section class="modal-card-body">
        <div class="content">
            <p>
                If you want to use either an updated netprops file or a missing game, you can upload them here.
                Please feel free to also send them to me at <b>me@jackz.me</b>
            </p>
            <h5>How to acquire a netprops file</h5>
            <p>This assumes you to have a <a href="https://wiki.alliedmods.net/Installing_sourcemod">sourcemod</a> server already setup</p>
            <ul>
                <li>Run the command <code>sm_dump_netprops_xml netprops.xml</code></li>
                <li>In your game's inner folder (tf2 is 'tf', l4d2 is 'l4d2', etc) will be the <b>netprops.xml</b> file</li>
            </ul>
        </div>
        <div class="file is-boxed">
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
           Due to how large netprop files are, this may freeze your browser or your computer.
        </b-message>
    </section>
</div>
</template>

<script>
export default {
    data() {
        return {
            test: null
        }
    },
    methods: {
        onUpload(e) {
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