<template>
  <div class="container">
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
                    {{ props.row.property }}
                </b-table-column>
                <b-table-column label="Class" v-if="allSelected">
                    {{ props.row.class }}
                </b-table-column>
                <b-table-column label="Parent" searchable>
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
                      <p v-if="selectedClass.key == null">No class was selected</p>
                      <p v-else>No properties were found for this class.</p>
                    </div>
                </section>
              </template>
              <template slot="detail" slot-scope="props">
                  <nav class="breadcrumb is-small" aria-label="breadcrumbs">
                  <ul>
                    <li v-for="parent in props.row.parents" :key="parent">
                      <a href="#">{{parent}}</a>
                    </li>
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
        <br>
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
            <b-menu-list label="Properties">
              <b-menu-item v-for="(prop, index) in selectedClass.properties" :key="index" :label="formatPropItem(prop)" />
            </b-menu-list>
          </b-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Converter from './js/converter';
import netprops from './assets/l4d2.netprops.xml'
export default {
  name: 'App',
  data() {
    return {
      classes: null,
      selectedClass: {
        key: null,
        properties: [],
      },
      windowHeight: window.innerHeight,
      loading: true,
    }
  },
  created() {
    window.addEventListener('resize', () => {
      this.windowHeight = window.innerHeight
    })
  },
  mounted() {
    this.loadXML()
  },
  methods: {
    loadXML() {
      this.loading = true;
      Converter(netprops)
      .then(data => {
        this.classes = data
      })
      .finally(() => this.loading = false)
    },
    selectClass(key) {
      if(this.classes) {
        this.selectedClass.key = key;
        this.loading = true;
        if(key === "all") {
          for(const classkey in this.classes) {
            for(let i = 0; i < this.classes[classkey].length; i++) {
              this.classes[classkey][i].class = classkey;
              this.selectedClass.properties.push(this.classes[classkey][i]);
            }
          }
        } else {
          for(let i = 0; i < this.classes[key].length; i++) {
            this.selectedClass.properties.push(this.classes[key][i]);
          }
        }
        this.loading = false;
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
    }
  }
}
</script>

<style scoped>
.classview {
  overflow: auto;
}
</style>