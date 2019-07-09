<template>
<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">{{title}}</h5>
        <button type="button" class="close"  @click="close();" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="username">用户名</label>
            <input v-model="username" required type="text" class="form-control" id="username" placeholder="请输入用户名">
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input v-model="password" required type="password" class="form-control" id="password" placeholder="请输入密码">
          </div>
          <div class="form-group">
            <label for="email">邮箱</label>
            <input v-model="email" required type="email" class="form-control" id="email"  placeholder="请输入邮箱">
          </div>
          <div class="form-group">
            <label for="phone">手机号</label>
            <input v-model="phone" required type="email" class="form-control" id="phone"  placeholder="请输入手机号">
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
  name:"user_create",
  props:{
    obj:Object,
  },
  data:function(){
    return {
      title:"新建用户",
      username:"",
      password:"",
      email:"",
      phone:"",
    }
  },
  methods:{
    close:function(){
      this.$parent.hideModal();
    },
    save:function() {
      var username = this.username;
      var password = this.password;
      var email = this.email;
      var phone = this.phone;
      var url = config.remote_site + "/" +this.obj.url;
      var params = {
        username:username,
        password:password,
        email:email,
        phone:phone
      }
      var that = this;
      var token = localStorage.getItem("token");
      this.axios
        .post(url, params,{ headers: { token: token } })
        .then(function(response) {
          var result = response.data;
          if (result.code == 0) {
            var ret = confirm("保存成功");
            if(ret) {
              window.location.reload();
            }
          } else {
            alert(result.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
}
</script>

