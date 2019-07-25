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
            <input type="hidden" v-model="role.id" />
            <div class="form-group">
              <label for="name">名称</label>
              <input
                readonly
                v-model="role.name"
                required
                type="text"
                class="form-control"
                id="username"
                placeholder="请输入名称"
              />
            </div>
            <div class="form-group">
              <label for="shortName">简称</label>
              <input
                readonly
                v-model="role.shortName"
                type="text"
                class="form-control"
                id="shortName"
                placeholder="请输入简称"
              />
            </div>
            <div class="form-group">
              <label for="sort">排序标识</label>
              <input
                readonly
                v-model="role.sort"
                type="text"
                class="form-control"
                id="sort"
                placeholder="请输入简称"
              />
            </div>
            <div class="form-check" v-for="resource in resources" :key="resource.id">
              <div class="row">
                <div class="col-sm-4">
                  <input
                    disabled
                    :value="resource.id"
                    v-model="selectedResource"
                    class="form-check-input"
                    type="checkbox"
                    :id="resource.id+'cb'"
                  />
                  <label class="form-check-label" :for="resource.id+'cb'">{{resource.name}}</label>
                </div>
                <div class="col-sm-8">
                  <div class="form-check form-check-inline" v-for="ope in operateAll" :key="ope.id">
                    <input
                      disabled
                      class="form-check-input"
                      type="checkbox"
                      v-model="operate[resource.id]"
                      :value="ope.id"
                    />
                    <label class="form-check-label">{{ope.name}}</label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close();">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import config from "../../../../js/config";

export default {
  name: "role_update",
  props: {
    obj: Object,
    recId: String
  },
  data: function() {
    return {
      title: "查看角色",
      role: {},
      resources: [],
      selectedResource: [],
      operate: {},
      operateAll: [
        {
          id: "C",
          name: "创建"
        },
        {
          id: "U",
          name: "编辑"
        },
        {
          id: "R",
          name: "查看"
        },
        {
          id: "D",
          name: "删除"
        }
      ]
    };
  },
  methods: {
    close: function() {
      this.$parent.hideModal();
    },
    getRoleDetail: function(id) {
      var url = config.remote_site + "/" + this.obj.url + "/" + id;
      var that = this;
      var token = localStorage.getItem("token");
      this.axios
        .get(url, { headers: { token: token } })
        .then(function(response) {
          var result = response.data;
          if (result.code == 0) {
            that.role = result.data;
          } else {
            alert(result.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });

      // 获取已关联的角色列表
      this.axios
        .get(config.remote_site + "/sso/permissionsByRoleId?roleId=" + id, {
          headers: { token: token }
        })
        .then(function(response) {
          var result = response.data;
          if (result.code == 0) {
            var arr = new Array();
            var dataArray = result.data;
            // var ope = {};
            for (var i in dataArray) {
              arr.push(dataArray[i].resourceId);
              that.operate [dataArray[i].resourceId] = dataArray[i].operate.split("");
            }
            // that.operate = ope;
            that.selectedResource = arr;
          } else {
            alert(result.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    loadResources: function() {
      // 获取资源列表
      var that = this;
      var token = localStorage.getItem("token");
      this.axios
        .get(config.remote_site + "/sso/resources", {
          headers: { token: token }
        })
        .then(function(response) {
          var result = response.data;
          if (result.code == 0) {
            var resources = result.data;
            that.resources = resources;
            // 初始化操作权限
            var ope = {};
            for (var i in resources) {
              var arr = new Array();
              ope[resources[i].id] = arr;
            }
            that.operate = ope;
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
    this.loadResources();
    this.getRoleDetail(this.recId);
  },
  watch: {
    // 监控传入参数的变化
    recId: function(val) {
      this.loadResources();
      this.getRoleDetail(val);
    }
  }
};
</script>

