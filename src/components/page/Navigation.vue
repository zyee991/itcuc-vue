<template>
    <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-primary">
      <a class="navbar-brand" href="javascript:void(0);">{{title}}</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item" :key="group.en" v-for="group in groups" :class="{active:current == group.en}" >
            <a class="nav-link" href="javascript:void(0);" :id="group.en">{{group.zh}}</a>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="javascript:void(0);"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >{{username}}</a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="javascript:void(0);" @click="logout();">注销</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
</template>

<script>
import config from "../../js/config.js";

export default {
  name: "Navigation",
  props: {
    title: String,
    hasLogin: Boolean
  },
  data: function() {
    return {
      groups: [],
      username: "",
      current:'',
    };
  },
  created:function() {
    var current = localStorage.getItem("currentGroup");
    this.current = current;
  },
  mounted: function() {
    // 登录后属性变化，加载导航栏内容
    var userinfo = localStorage.getItem("userinfo");
    if (userinfo) {
      var userJson = JSON.parse(userinfo);
      var groups = userJson.groups;
      this.groups = groups;
      this.username = userJson.username;
      this.$parent.loadSideBar();
    } else {
      var token = localStorage.getItem("token");
      var url = config.remote_site + "/sso/token";
      var that = this;
      this.axios
        .get(url + "/" + token)
        .then(function(response) {
          var result = response.data;
          if (result.code == 0) {
            var userinfo = result.data;
            localStorage.setItem("userinfo", userinfo);
            var userJson = JSON.parse(userinfo);
            var groups = userJson.groups;
            if(!that.current) {
              that.current = groups[0].en;
              localStorage.setItem("currentGroup",that.current);
            }
            that.groups = groups;
            that.username = userJson.username;
            that.$parent.loadSideBar();
          } else {
            alert(result.msg);
            that.$parent.showLogin();
          }
        })
        .catch(function(error) {
          console.error(error);
          that.$parent.showLogin();
        });
    }
  },
  methods: {
    loadFunctions: function() {
    },
    logout:function() {
      var token = localStorage.getItem("token");
      var url = config.remote_site + "/sso/logout?token=" + token;
      var that = this;
      this.axios.get(url,{headers:{"token":token}}).then(function (response){
        var result = response.data;
        if(result.code == 0) {
          localStorage.removeItem("token");
          localStorage.removeItem("userinfo");
          that.$parent.$parent.showLogin();
        } else {
          alert(result.msg);
        }
      }).catch(function(error){
        console.error(error);
      });
    }
  },
  watch:{
    // 监控当前活动菜单
    current:function(val) {
      localStorage.setItem("currentGroup",val);
    }
  }
};
</script>
<style scoped>
nav{
  z-index: 1;
}

.navbar-expand-lg .navbar-nav .dropdown-menu {
    position: absolute;
    /* top: 40px; */
    left: -20px;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    float: left;
    min-width: 0;
    padding: 0.5rem 0;
    margin: 0.125rem 0 0;
    font-size: 1rem;
    color: #212529;
    text-align: left;
    list-style: none;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 0.25rem;
    border-color: #007bff;
}

.dropdown-item {
  color:#007bff;
}
</style>
