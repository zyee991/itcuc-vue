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
            <input type="hidden" v-model="resource.id" />
            <div class="form-group">
              <label for="name">名称</label>
              <input
                v-model="resource.name"
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
                v-model="resource.shortName"
                type="text"
                class="form-control"
                id="shortName"
                placeholder="请输入简称"
              />
            </div>
            <div class="form-group">
              <label for="url">地址</label>
              <input
                v-model="resource.url"
                required
                type="text"
                class="form-control"
                id="url"
                placeholder="请输入地址"
              />
            </div>
            <div class="form-group">
              <label for="group">组</label>
              <input
                v-model="resource.group"
                required
                type="text"
                class="form-control"
                id="group"
                placeholder="请输入组"
              />
            </div>
            <div class="form-group">
              <label for="groupEn">组简称</label>
              <input
                v-model="resource.groupEn"
                required
                type="text"
                class="form-control"
                id="groupEn"
                placeholder="请输入组简称"
              />
            </div>
            <div class="form-group">
              <label for="sort">排序标识</label>
              <input
                v-model="resource.sort"
                required
                type="number"
                class="form-control"
                id="sort"
                placeholder="请输入排序标识"
              />
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
import config from "../../../../js/config";

export default {
  name: "resource_update",
  props: {
    obj: Object,
    recId: String
  },
  data: function() {
    return {
      title: "编辑资源",
      resource: {},
    };
  },
  methods: {
    close: function() {
      this.$parent.hideModal();
    },
    save: function() {
      var resource = this.resource;
      var url = config.remote_site + "/" + this.obj.url;
      var that = this;
      var token = localStorage.getItem("token");
      // 保存
      this.axios
        .put(url, resource, { headers: { token: token } })
        .then(function(response) {
          var result = response.data;
          if (result.code == 0) {
            that.$parent.hideModal();
            that.$parent.getMainData();
          } else {
            alert(result.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getResourceDetail: function(id) {
      var url = config.remote_site + "/" + this.obj.url + "/" + id;
      var that = this;
      var token = localStorage.getItem("token");
      this.axios
        .get(url, { headers: { token: token } })
        .then(function(response) {
          var result = response.data;
          if (result.code == 0) {
            that.resource = result.data;
          } else {
            alert(result.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
  mounted: function() {
    this.getResourceDetail(this.recId);
  },
  watch: {
    // 监控传入参数的变化
    recId: function(val) {
      this.getResourceDetail(val);
    }
  }
};
</script>

