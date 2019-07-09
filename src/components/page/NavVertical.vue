<template>
  <nav class="col-md-2 d-none d-md-block bg-light sidebar">
    <div class="sidebar-sticky">
      <ul class="nav flex-column">
        <li class="nav-item" :key="resource.id" v-for="resource in resources">
          <a class="nav-link" href="javascript:void(0);" :class="{active:current == resource.id}" @click="detail(resource.id);">
            <span data-feather="file"></span>
            {{resource.name}}
          </a>
          <hr>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
export default {
  name: "NavVertical",
  data: function(){
    return {
      currentGroup:'',
      current:'',
      resources:[]
    }
  },
  mounted:function(){
    var currentGroup = localStorage.getItem("currentGroup");
    var userinfo = localStorage.getItem("userinfo");
    var userJson = JSON.parse(userinfo);
    var allResources = userJson.resources;
    var arr = new Array();
    for(var i in allResources) {
      if(allResources[i].groupEn == currentGroup) {
        arr.push(allResources[i]);
      }
    }
    this.resources = arr;
    this.current = localStorage.getItem("currentResource");
    if(!this.current) {
      this.current = arr[0].id;
    }
  },
  methods:{
    detail:function(id){
      this.current = id;
      window.location.reload();
    }
  },
  watch:{
    current:function(val){
      localStorage.setItem("currentResource",val);
    }
  }
};
</script>
<style scoped>
/*
 * Sidebar
 */

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  padding: 0;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
}

.sidebar-sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 48px; /* Height of navbar */
  height: calc(100vh - 48px);
  padding-top: 0.5rem;
  overflow-x: hidden;
  overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
}

.sidebar .nav-link {
  color: #007bff;
}

.sidebar .nav-link .feather {
  margin-right: 4px;
  color: #999;
}

.sidebar .nav-link.active {
  font-style: italic;
  font-weight: 500;
}

.sidebar .nav-link:hover .feather,
.sidebar .nav-link.active .feather {
  color: inherit;
}

.sidebar-heading {
  font-size: 0.75rem;
  text-transform: uppercase;
}

hr {
    margin-top: 0rem;
    margin-bottom: 0rem;
    border-top: 1px solid rgba(29, 8, 8, 0.1);
}
</style>


