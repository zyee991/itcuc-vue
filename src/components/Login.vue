<template>
  <div class="text-center">
    <form class="form-signin" id="signin" v-show="isSignin">
      <img class="mb-4" src="../assets/logo.png" alt width="72" height="72" />
      <h1 class="h3 mb-3 font-weight-normal">{{project_name}}</h1>
      <label for="i_username" class="sr-only">用户名/手机号/邮箱</label>
      <input
        v-model="i_username"
        name="username"
        type="text"
        id="i_username"
        class="form-control"
        placeholder="用户名/手机号/邮箱"
        required
        autofocus
      />
      <label for="i_password" class="sr-only">密码</label>
      <input
        v-model="i_password"
        name="password"
        type="password"
        id="i_password"
        class="form-control"
        placeholder="密码"
        required
      />
      <div class="btn-group btn-group-lg" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-primary" @click="signin">登录</button>
        <button type="button" class="btn btn-outline-primary" @click="toSignup">注册</button>
      </div>
      <p class="mt-5 mb-3 text-muted">{{copyright}}</p>
    </form>
    <form class="form-signin" id="signup" v-show="!isSignin">
      <img class="mb-4" src="../assets/logo.png" alt width="72" height="72" />
      <h1 class="h3 mb-3 font-weight-normal">{{project_name}}</h1>
      <label for="u_username" class="sr-only">用户名</label>
      <input
        v-model="u_username"
        name="username"
        type="text"
        id="u_username"
        class="form-control"
        placeholder="用户名"
        required
        autofocus
      />
      <label for="u_phone" class="sr-only">手机号</label>
      <input
        v-model="u_phone"
        name="phone"
        type="text"
        id="u_phone"
        class="form-control"
        placeholder="手机号"
        required
        autofocus
      />
      <label for="u_email" class="sr-only">邮箱</label>
      <input
        v-model="u_email"
        name="email"
        type="email"
        id="u_email"
        class="form-control"
        placeholder="邮箱"
        required
        autofocus
      />
      <label for="u_password" class="sr-only">密码</label>
      <input
        v-model="u_password"
        name="password"
        type="password"
        id="u_password"
        class="form-control"
        placeholder="密码"
        required
      />
      <div class="btn-group btn-group-lg" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-primary"  @click="signup">注册</button>
        <button type="button" class="btn btn-outline-primary" @click="toSignin">登录</button>
      </div>
      <p class="mt-5 mb-3 text-muted">{{copyright}}</p>
    </form>
  </div>
</template>

<script>
import config from "../js/config.js";
export default {
  name: "Login",
  data: function() {
    return {
      project_name: config.project_name,
      copyright: config.copyright,
      isSignin: true,
      i_username: "",
      i_password: "",
      u_username: "",
      u_password: "",
      u_email: "",
      u_phone: ""
    };
  },
  methods: {
    signin: function() {
      var username = this.i_username;
      var password = this.i_password;
      var url = config.remote_site + "/sso/signin";
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);
      var that = this;
      this.axios
        .post(url, params)
        .then(function(response) {
          var result = response.data;
          if (result.code == 0) {
            var token = result.data;
            localStorage.setItem("token",token);
            that.$parent.hideLogin();
            window.location.reload();
          } else {
            alert(result.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    signup: function() {},
    toSignin: function() {
      this.isSignin = true;
    },
    toSignup: function() {
      this.isSignin = false;
    }
  }
};
</script>

<style scoped>
html,
body {
  height: 100%;
}

body {
  display: -ms-flexbox;
  display: -webkit-box;
  display: flex;
  -ms-flex-align: center;
  -ms-flex-pack: center;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>

