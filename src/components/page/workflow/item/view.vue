<template>
  <!-- Modal -->
  <div
    class="modal fade bd-example-modal-lg"
    id="exampleModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{title}}</h5>
          <button type="button" class="close" @click="close();" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <input type="hidden" v-model="item.id" />
            <div class="form-group">
              <label for="name">名称</label>
              <input
                v-model="item.name"
                required
                type="text"
                class="form-control"
                id="username"
                placeholder="请输入名称"
                readonly
              />
            </div>
            <div class="form-group">
              <label for="workflowKey">标识</label>
              <input
                v-model="item.workflowKey"
                type="text"
                class="form-control"
                id="workflowKey"
                placeholder="请输入简称"
                readonly
              />
            </div>
            <div class="form-group">
              <label for="ownerGroup">业务组</label>
              <input
                v-model="item.ownerGroup"
                required
                type="text"
                class="form-control"
                id="ownerGroup"
                placeholder="请输入地址"
                readonly
              />
            </div>
            <div class="form-group">
              <span v-for="(node,index) in item.workflowNodes" :key="node.id">
                <span v-if="index != 0">-></span>
                <span class="badge badge-primary">{{node.nodeNum}}</span>
                <span class="badge badge-warning">{{node.name}}</span>
              </span>
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
  name: "item_view",
  props: {
    obj: Object,
    recId: String
  },
  data: function() {
    return {
      title: "查看工作项",
      item: {}
    };
  },
  methods: {
    close: function() {
      this.$parent.hideModal();
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
            that.item = result.data;
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