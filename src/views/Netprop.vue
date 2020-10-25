<template>
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
                <b-table-column field="property" label="Name" searchable sortable>
                  <strong v-if="props.row.hasChildTable">*</strong>
                  <span>{{ props.row.property.trim() }}</span>
                </b-table-column>
                <b-table-column label="Class" :visible="allSelected">
                  <span>{{ props.row.class }}</span>
                </b-table-column>
                <b-table-column label="Parent" searchable>
                    {{ props.row.parents.length > 0 ? props.row.parents[0].trim() : 'No parents' }}
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
        <p class="has-text-centered">Netprop data was fetched {{meta.timestamp}}</p><br>
        <div class="box classview" :style="classListHeight">
          <b-menu>
            <b-menu-list label="Classes">
              <b-menu-item label="[ALL CLASSES]" @click="selectClass('all')" />
              <b-menu-item v-for="(properties, key) in classes" :key="key" :label="key" @click="selectClass(key)" />
            </b-menu-list>
          </b-menu>
        </div>

        <div class="box classview" style="height: 30em" v-if="selectedClass">
          <b-menu>
            <b-menu-list :label="propText">
              <b-menu-item v-for="(prop, index) in selectedClass.properties" :key="index" :label="formatPropItem(prop)" />
            </b-menu-list>
          </b-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Converter from '../js/converter';
export default {
  name: 'Netprops',
  data() {
    return {
      classes: null,
      meta: {},
      selectedClass: {
        key: null,
        properties: [],
      },
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
    const hashClass = window.location.hash.length > 2 ? window.location.hash.substring(1) : null
    this.loadXML(hashClass);
  },
  methods: {
    async loadXML(hashClass) {
      this.loading = true;
      console.info(`Loading ${this.$route.params.game}.netprops.xml...`)
      try {
        const response = await fetch(`data/${this.$route.params.game}.netprops.xml`)
        const body = await response.text();
        const xml = await Converter(body);
        this.meta = xml._meta
        delete xml._meta;
        this.classes = xml;
        if(hashClass)
          this.selectClass(hashClass)
      }catch(err) {
        console.error(`Failed to properly load and parse netprops XML. `, err)
        this.$buefy.dialog.alert({
          type: 'is-danger',
          title: 'Failed to parse netprops XML',
          message: `Attempted to load <b>${window.location}/data/${this.$route.params.game}.netprops.xml</b>. The netprops xml may be invalid or does not exist.`
        })
      }
      this.loading = false;
    },
    selectClass(key) {
      if(this.classes && this.classes[key]) {
        this.selectedClass.key = key;
        this.loading = true;
        if(key === "all") {
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
          for(let i = 0; i < this.classes[key].length; i++) {
            this.selectedClass.properties.push(this.classes[key][i]);
          }
          window.location.hash = `#${key}`
        }
        this.loading = false;
        
      }else {
        console.error('Unknown class:', key);
        this.selectedClass.key = null;
        this.selectedClass.properties = [];
        
      }
    },
    formatPropItem(prop) {
      if(prop.hasChildTable) return `* ${prop.property}`
      return prop.property;
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
      if(row.hasChildTable) return 'has-background-dark has-text-light'
      return ''
    }
  },
  computed: {
    classListHeight() {
      return this.selectedClass.key ? {height: '20em'} : {height: `${this.windowHeight-40}px` } 
    },
    allSelected() {
      return this.selectedClass.key === "all";
    },
    propText() {
      return this.selectedClass.key ? `PROPERTIES for ${this.selectedClass.key}` : 'Properties'
    }
  }
}
</script>

<style scoped>
.classview {
  overflow: auto;
}
</style>