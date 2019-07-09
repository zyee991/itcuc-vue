<template>
  <div id="page">
    <Navigation :title="title" :hasLogin="hasLogin" />
    <div class="container-fluid">
      <div class="row">
        <NavVertical v-if="navLoaded"/>
        <Main />
     </div>
    </div>
  </div>
</template>
<script>
import Navigation from "./page/Navigation.vue";
import NavVertical from "./page/NavVertical.vue";
import Main from "./page/Main.vue";
import config from "../js/config.js";

export default {
  name: "page",
  props: {
    hasLogin: Boolean
  },
  components: {
    Navigation,
    NavVertical,
    Main
  },
  data: function() {
    return {
      title: config.project_name,
      navLoaded:false,
    };
  },
  methods:{
    loadSideBar:function() {
      this.navLoaded = true;
    }
  }
};
</script>
