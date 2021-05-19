<template>
<!-- todo: auto focus on search, tab on list -->
  <div class="container is-fluid">
    <b-loading :active="loading" />
    <div class="columns">
      <div class="column">
        <div class="content">
            <b-table 
              :data="selectedClass.properties"
              :row-class="checkRowClass"
              paginated
              per-page="20"
              narrowed
              detailed
              detail-key="id"
              custom-row-key="id"
            >
              <template slot-scope="props">
                <b-table-column field="name" label="Property Name" searchable sortable>
                  <b>{{ props.row.name}}</b>
                </b-table-column>
                <b-table-column label="Class" :visible="allSelected">
                  <span>{{ props.row.class }}</span>
                </b-table-column>
                <b-table-column label="Parent Property" searchable>
                    {{ props.row.parents.length > 0 ? props.row.parents[0] : 'No parents' }}
                </b-table-column>
                <b-table-column field="fields.type" label="Type">
                  <span :class="formatTypeClass(props.row.fields.type)">{{props.row.fields.type}}</span>
                </b-table-column>
                <b-table-column label="Flags">
                  {{ props.row.fields.flags.join(", ") }}
                </b-table-column>
              </template>
              <template slot="empty">
                <section class="section">
                    <div class="content has-text-grey has-text-centered">
                      <br>
                      <p v-if="selectedClass.key == null">Select a class on the right to view its properties.</p>
                      <p v-else>No properties were found for this class.</p>
                    </div>
                </section>
              </template>
              <template slot="detail" slot-scope="props">
                <nav class="breadcrumb is-small" aria-label="breadcrumbs">
                  <ul>
                    <li v-for="parent in props.row.parents" :key="parent"><a href="#">{{parent}}</a></li>
                    <li class="is-active"><a href="#" aria-current="page">{{props.row.property}}</a></li>
                  </ul>
                </nav>
                <hr>
                <table>
                  <tr>
                    <th>Field Name</th>
                    <th>Field Value</th>
                  </tr>
                  <tr v-for="(field,key) in props.row.fields" :key="key">
                    <td>{{key}}</td>
                    <td>{{field}}</tD>
                  </tr>
                  <tr v-if="allSelected">
                    <td>Class</td>
                    <td>{{props.row.class}}</td>
                  </tr>
                </table>
              </template>
            </b-table>
          </div>
      </div>
      <div class="column is-4">
        <p class="has-text-centered">Netprop data was last updated {{meta.timestamp}}</p><br>
        <div class="box classview" >
          <p class="subtitle is-5" style="margin-bottom: 1em">Select a class</p>
          <b-input type="text" placeholder="Search classnames..." v-model="search" autofocus />
          <b-menu>
            <b-menu-list>
              <b-menu-item label="[ALL CLASSES]" @click="selectClass('all')" />
              <b-menu-item v-for="(key) in visibleClasses" :key="key" :label="key" @click="selectClass(key)" tabindex="0" />
            </b-menu-list>
          </b-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Converter from '../js/converter';
import Fuse from 'fuse.js'

export default {
  name: 'Netprops',
  data() {
    return {
      classes: null,
      meta: {},
      search: null,
      selectedClass: {
        key: null,
        properties: [],
      },
      fuse: null,
      windowHeight: window.innerHeight,
      loading: true,
    }
  },
  watch:{
    '$route.path': function() {
      this.loadXML();
    }
  },
  created() {
    window.addEventListener('resize', () => {
      this.windowHeight = window.innerHeight
    })
    if(this.$route.name == 'CustomNetprops' && !this.$route.query.url) {
      this.loading = false
      this.promptForURL()
      return;
    }
    const hashClass = window.location.hash.length > 2 ? window.location.hash.substring(1) : null
    this.loadXML(hashClass);
  },
  methods: {
    promptForURL() {
      this.$buefy.dialog.prompt({
        message: `Enter a URL to a netprops.xml file`,
        inputAttrs: {
          placeholder: 'https://example.com/netprops.xml',
        },
        trapFocus: true,
        onConfirm: (value) => {
          this.$router.replace({path: '/custom', query: { url: value}})
          if(!this.loadXML()) {
            this.promptForURL()
          }
        },
        canCancel: false
      })
    },
    async loadXML(hashClass) {
      this.loading = true;
      console.info(`Loading ${this.url}...`)
      try {
        const response = await fetch(this.url)
        const body = await response.text();
        const xml = await Converter(body);
        this.meta = xml._meta
        delete xml._meta;
        this.classes = xml;
        this.fuse = new Fuse(Object.keys(xml), {
          includeScore: true,
          distance: 40,
          threshold: 0.5,
          minMatchCharLength: 3,
        })
        if(hashClass)
          this.selectClass(hashClass)
        this.loading = false;
        return true
      }catch(err) {
        this.$buefy.dialog.alert({
          type: 'is-danger',
          title: 'Failed to parse netprops XML',
          message: `Attempting to parse <b>${window.location}/data/${this.$route.params.game}.netprops.xml</b> resulted in an error. The netprops xml may be invalid or does not exist.`
        })
        console.error('parse error', err)
        this.loading = false;
        return false
      }
    },
    selectClass(key) {
      this.$emit('select', key)
      if(this.classes && this.classes[key]) {
        this.selectedClass.key = key;
        this.loading = true;
        if(key === "all") {
          this.selectedClass.properties = []
          for(const classkey in this.classes) {
            //todo: improve
            for(let i = 0; i < this.classes[classkey].length; i++) {
              if(!this.classes[classkey][i].class) {
                this.classes[classkey][i].class = classkey;
                this.selectedClass.properties.push(this.classes[classkey][i]);
              }
            }
          }
          window.location.hash = `#all`
        } else {
          this.selectedClass.properties = this.classes[key]
          window.location.hash = `#${key}`
        }
        this.loading = false;
        
      }else {
        console.error('Unknown class:', key);
        this.selectedClass.key = null;
        this.selectedClass.properties = [];
        window.location.hash = ''
      }
    },
    formatTypeClass(type) {
      if(type.includes("float")) {
        return 'has-text-info'
      }else if(type.includes("vector")) {
        return 'has-text-success'
      } else if(type.includes("int")) {
        return 'has-text-link'
      } else {
        return ''
      }
    },
    checkRowClass(row) {
      if(row.hasChildTable) return row.hasChildTable ? 'has-background-dark has-text-light' : ''
    }
  },
  computed: {
    allSelected() {
      return this.selectedClass.key === "all";
    },
    visibleClasses() {
      if(!this.search) return this.classes ? Object.keys(this.classes) : []
      const result = this.fuse.search(this.search)
      return result.map(result => result.item)
    },
    url() {
      return this.$route.query.url || `data/${this.$route.params.game}.netprops.xml`
    }
  }
}
</script>

<style scoped>
.classview {
  overflow: auto;
}
</style>