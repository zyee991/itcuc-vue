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
            <input type="hidden" v-model="node.id" />
            <div class="form-group">
              <label for="name">名称</label>
              <input
                v-model="node.name"
                required
                type="text"
                class="form-control"
                id="username"
                placeholder="请输入名称"
              />
            </div>
            <div class="form-group">
              <label for="workflowItemId">所属工作项</label>
              <select v-model="node.workflowItemId" class="form-control" id="workflowItemId" placeholder="请选择">
                <option :selected='node.workflowItemId == item.id' v-for="item in workflowItems" :key="item.id" :value="item.id">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="ownerGroup">节点序号</label>
              <input
                v-model="node.nodeNum"
                required
                type="number"
                class="form-control"
                id="ownerGroup"
                placeholder="请输入序号"
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
  name: "node_update",
  props: {
    obj: Object,
    recId: String
  },
  data: function() {
    return {
      title: "修改工作节点",
      node: {},
      workflowItems:[],
    };
  },
  created :function(){
    this.getWorkflowItems();
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
            that.node = result.data;
          } else {
            alert(result.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    save: function() {
      var item = this.item;
      var url = config.remote_site + "/" + this.obj.url;
      var that = this;
      var token = localStorage.getItem("token");
      // 保存
      this.axios
        .put(url, item, { headers: { token: token } })
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
    getWorkflowItems:function() {
      var url = config.remote_site + "/wf/items"; 
      var that = this;
      var token = localStorage.getItem("token");
      this.axios.get(url,{headers:{token:token}})
      .then(function(response) {
          var result = response.data;
          if (result.code == 0) {
            that.workflowItems = result.data;
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