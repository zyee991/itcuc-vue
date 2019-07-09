<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{title}}</h5>
          <button type="button" class="close" @click="close();" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <input type="hidden" v-model="user.id" />
            <div class="form-group">
              <label for="username">用户名</label>
              <input
                v-model="user.username"
                required
                type="text"
                class="form-control"
                id="username"
                placeholder="请输入用户名"
              />
            </div>
            <div class="form-group">
              <label for="password">密码</label>
              <input
                v-model="user.password"
                readonly
                value="123456"
                type="password"
                class="form-control"
                id="password"
                placeholder="请输入密码"
              />
            </div>
            <div class="form-group">
              <label for="email">邮箱</label>
              <input
                v-model="user.email"
                required
                type="email"
                class="form-control"
                id="email"
                placeholder="请输入邮箱"
              />
            </div>
            <div class="form-group">
              <label for="phone">手机号</label>
              <input
                v-model="user.phone"
                required
                type="email"
                class="form-control"
                id="phone"
                placeholder="请输入手机号"
              />
            </div>
            <div class="form-check form-check-inline" v-for="role in roles" :key="role.id">
              <input
                class="form-check-input"
                type="checkbox"
                :id="role.id+'cb'"
                :value="role.id"
                v-model="selectedRole"
              />
              <label class="form-check-label" :for="role.id+'cb'">{{role.name}}</label>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close();">关闭</button>
          <button type="button" class="btn btn-primary" @click="save();">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import config from "../../../js/config";

export default {
  name: "user_update",
  props: {
    obj: Object,
    recId: String
  },
  data: function() {
    return {
      title: "编辑用户",
      user: {},
      roles: [],
      selectedRole: []
    };
  },
  methods: {
    close: function() {
      this.$parent.hideModal();
    },
    saveRelative: function() {
      var that = this;
      var token = localStorage.getItem("token");
      const params = new URLSearchParams();
      params.append("userId", that.user.id);
      params.append("roleIds", that.selectedRole);
      // 保存关联信息
      this.axios
        .post(config.remote_site + "/sso/saveUserRole", params, {
          headers: { token: token }
        })
        .then(function(response) {
          var result = response.data;
          if (result.code == 0) {
            var ret = confirm("保存成功");
            if (ret) {
              window.location.reload();
            }
          } else {
            alert(result.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    save: function() {
      var user = this.user;
      var url = config.remote_site + "/" + this.obj.url;
      var that = this;
      var token = localStorage.getItem("token");
      // 保存用户信息
      this.axios
        .put(url, user, { headers: { token: token } })
        .then(function(response) {
          var result = response.data;
          if (result.code == 0) {
            that.saveRelative();
          } else {
            alert(result.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getUserDetail: function(id) {
      var url = config.remote_site + "/" + this.obj.url + "/" + id;
      var that = this;
      var token = localStorage.getItem("token");
      this.axios
        .get(url, { headers: { token: token } })
        .then(function(response) {
          var result = response.data;
          if (result.code == 0) {
            that.user = result.data;
          } else {
            alert(result.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });

      // 获取已关联的角色列表
      this.axios
        .get(config.remote_site + "/sso/rolesByUserId?userId=" + id, {
          headers: { token: token }
        })
        .then(function(response) {
          var result = response.data;
          if (result.code == 0) {
            that.selectedRole = result.data;
          } else {
            alert(result.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  mounted: function() {
    this.getUserDetail(this.recId);
    // 获取角色列表
    var that = this;
    var token = localStorage.getItem("token");
    this.axios
      .get(config.remote_site + "/sso/roles", { headers: { token: token } })
      .then(function(response) {
        var result = response.data;
        if (result.code == 0) {
          that.roles = result.data;
        } else {
          alert(result.msg);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  watch: {
    // 监控传入参数的变化
    recId: function(val) {
      this.getUserDetail(val);
    }
  }
};
</script>

