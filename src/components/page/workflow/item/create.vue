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
            <label for="name">名称</label>
            <input v-model="name" required type="text" class="form-control" id="name" placeholder="请输入名称">
          </div>
          <div class="form-group">
            <label for="workflowKey">标识</label>
            <input v-model="workflowKey" required type="text" class="form-control" id="workflowKey" placeholder="请输入标识">
          </div>
          <div class="form-group">
            <label for="ownerGroup">业务组</label>
            <input v-model="ownerGroup" required type="text" class="form-control" id="ownerGroup"  placeholder="请输入业务组">
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
  name:"item_create",
  props:{
    obj:Object,
  },
  data:function(){
    return {
      title:"新建工作项",
      name:"",
      workflowKey:"",
      ownerGroup:"",
    }
  },
  methods:{
    close:function(){
      this.$parent.hideModal();
    },
    save:function() {
      var name = this.name;
      var workflowKey = this.workflowKey;
      var ownerGroup = this.ownerGroup;
      var url = config.remote_site + "/" +this.obj.url;
      var params = {
        name:name,
        workflowKey:workflowKey,
        ownerGroup:ownerGroup,
      }
      var that = this;
      var token = localStorage.getItem("token");
      this.axios
        .post(url, params,{ headers: { token: token } })
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
    }
  },
}
</script>

