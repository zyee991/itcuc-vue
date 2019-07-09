<template>
  <main
    role="main"
    class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4"
    style="padding-top:5rem !important"
  >
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">{{currentResource.group}}</li>
        <li class="breadcrumb-item active" aria-current="page">{{currentResource.name}}</li>
      </ol>
    </nav>
    <button
      v-if="crCreate"
      type="button"
      @click="create();"
      class="btn btn-primary mb-2 mr-0"
    >新建{{currentResource.name}}</button>
    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th v-for="key in keys" :key="key">{{dic[key]}}</th>
            <th v-if="crOperate">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td v-for="key in keys" :key="key">{{row[key]}}</td>
            <td v-if="crOperate">
              <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
                <button type="button" v-if="crRead" class="btn btn-success" @click="view(row.id)">查看</button>
                <button
                  type="button"
                  v-if="crUpdate"
                  class="btn btn-warning"
                  @click="update(row.id)"
                >修改</button>
                <button
                  type="button"
                  v-if="crDelete"
                  class="btn btn-danger"
                  @click="remove(row.id)"
                >删除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <component :is="comp" :style="mdStyle" :class="mdClass" :obj="currentResource" :recId="recId"></component>
  </main>
</template>
<script>
import config from "../../js/config.js";

export default {
  name: "Main",
  components: {
    user_create: function(resolve) {
      require(["./user/create.vue"], resolve);
    },
    user_update: function(resolve) {
      require(["./user/update.vue"], resolve);
    },
    user_view: function(resolve) {
      require(["./user/view.vue"], resolve);
    },
    role_create: function(resolve) {
      require(["./role/create.vue"], resolve);
    },
    role_update: function(resolve) {
      require(["./role/update.vue"], resolve);
    },
    role_view: function(resolve) {
      require(["./role/view.vue"], resolve);
    },
    resource_create: function(resolve) {
      require(["./resource/create.vue"], resolve);
    },
    resource_update: function(resolve) {
      require(["./resource/update.vue"], resolve);
    },
    resource_view: function(resolve) {
      require(["./resource/view.vue"], resolve);
    },
  },
  data: function() {
    return {
      dic: {
        username: "用户名",
        phone: "手机号",
        email: "电子邮箱",
        created: "创建时间",
        updated: "更新时间",
        name: "名称",
        shortName: "简称",
        url: "地址",
        group: "群组",
        groupEn: "群组简称",
        sort:"排序标识"
      },
      currentGroup: "",
      currentResource: {},
      keys: [],
      rows: [],
      crCreate: false,
      crUpdate: false,
      crRead: false,
      crDelete: false,
      crOperate: false,
      comp: "",
      sHide: "display:none",
      sShow: "display: block;",
      cHide: "modal fade",
      cShow: "modal fade show",
      mdClass: this.cHide,
      mdStyle: this.cShow,
      recId: ""
    };
  },
  mounted: function() {
    this.currentGroup = localStorage.getItem("currentGroup");
    var currentResourceId = localStorage.getItem("currentResource");
    var userinfo = JSON.parse(localStorage.getItem("userinfo"));
    var resources = userinfo.resources;
    for (var i in resources) {
      if (resources[i].id == currentResourceId) {
        this.currentResource = resources[i];
      }
    }
    // 获取操作权限
    this.getOperate();
    // 获取数据列表
    this.getMainData(currentResourceId);
  },
  methods: {
    getMainData: function(id) {
      var url = config.remote_site + "/" + this.currentResource.url;
      var token = localStorage.getItem("token");
      var that = this;
      this.axios
        .get(url, { headers: { token: token } })
        .then(function(response) {
          var result = response.data;
          if (result.code == 0) {
            var data = result.data;
            var data0 = data[0];
            var keys = Object.keys(data0);
            var arr = new Array();
            for (var i in keys) {
              if (
                keys[i] != "id" &&
                keys[i] != "password" &&
                keys[i] != "deleteFlag"
              ) {
                arr.push(keys[i]);
              }
            }
            that.keys = arr;
            that.rows = data;
          } else {
            alert(result.msg);
          }
        });
    },
    getOperate: function() {
      var resource = this.currentResource;
      if (!resource || !resource.operate) {
        this.crCreate = false;
        this.crUpdate = false;
        this.crRead = false;
        this.crDelete = false;
        this.crOperate = false;
      } else {
        var operate = resource.operate;
        this.crOperate = true;
        for (var i in operate) {
          if (operate[i] == "C") {
            this.crCreate = true;
          } else if (operate[i] == "U") {
            this.crUpdate = true;
          } else if (operate[i] == "R") {
            this.crRead = true;
          } else if (operate[i] == "D") {
            this.crDelete = true;
          }
        }
      }
    },
    showModal: function() {
      this.mdClass = this.cShow;
      this.mdStyle = this.sShow;
    },
    hideModal: function() {
      this.mdClass = this.cHide;
      this.mdStyle = this.sHide;
    },
    view: function(id) {
      var resource = this.currentResource;
      var compName = resource.shortName + "_view";
      this.comp = compName;
      this.recId = id;
      this.showModal();
    },
    update: function(id) {
      var resource = this.currentResource;
      var compName = resource.shortName + "_update";
      this.comp = compName;
      this.recId = id;
      this.showModal();
    },
    remove: function(id) {
      var url = config.remote_site + "/" + this.currentResource.url + "/" + id;
      if (confirm("确定删除记录?")) {
        var token = localStorage.getItem("token");
        this.axios
          .delete(url, { headers: { token: token } })
          .then(function(response) {
            var result = response.data;
            if (result.code == 0) {
              if(confirm("删除记录成功")){
                window.location.reload();
              }
            } else {
              alert(result.msg);
            }
          });
      }
    },
    create: function() {
      var resource = this.currentResource;
      var compName = resource.shortName + "_create";
      this.comp = compName;
      this.showModal();
    }
  }
};
</script> 

