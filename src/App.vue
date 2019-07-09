<template>
  <div id="app">
    <Login v-if="!hasLogin" />
    <Page v-if="hasLogin" :hasLogin="hasLogin" />
  </div>
</template>

<script>
import Login from "./components/Login.vue";
import Page from './components/Page.vue'
import config from "./js/config.js";

export default {
  name: "app",
  components: {
    Page,
    Login
  },
  data: function() {
    return {
      hasLogin: false
    };
  },
  created: function() {
    var token = localStorage.getItem("token");
    if (!token) {
      this.hasLogin = false;
    } else {
      this.hasLogin = true;
    }
  },
  mounted:function() {
      
  },
  methods: {
    showLogin: function() {
      this.hasLogin = false;
    },
    hideLogin: function() {
      this.hasLogin = true;
    }
  },
};
</script>
