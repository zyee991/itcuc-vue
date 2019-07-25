<template>
  <div id="page">
    <Navigation :title="title" :hasLogin="hasLogin" />
    
  </div>
</template>
<script>
import Navigation from "./page/Navigation.vue";
import config from "../js/config.js";

export default {
  name: "page",
  props: {
    hasLogin: Boolean
  },
  components: {
    Navigation,
  },
  data: function() {
    return {
      title: config.project_name,
    };
  },
  methods:{

  }
};
</script>
