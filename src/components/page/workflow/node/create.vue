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
            <label for="workflowItemId">所属工作项</label>
            <select v-model="workflowItemId" class="form-control" id="workflowItemId" placeholder="请选择">
              <option v-for="item in workflowItems" :key="item.id" :value="item.id">{{item.name}}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="nodeNum">节点序号</label>
            <input v-model="nodeNum" required type="number" class="form-control" id="nodeNum"  placeholder="请输入节点序号">
          </div>
          <div class="form-group">
            <label for="users">审批人</label>
            <div class="input-group">
              <input v-model="displays" readonly type="text" class="form-control" id="users"  placeholder="">
              <div class="input-group-append">
                <button type="button" class="btn btn-primary" @click="choose();">选人</button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="close();">关闭</button>
        <button type="button" class="btn btn-primary" @click="save();">保存</button>
      </div>
    </div>
  </div>
  <UserSelect v-if="showSelect"/>
</div>
</template>
<script>
import config from "../../../../js/config";
import UserSelect from "../..//../common/UserSelect.vue";

export default {
  name:"node_create",
  props:{
    obj:Object,
  },
  components:{
    UserSelect
  },
  data:function(){
    return {
      title:"新建工作流节点",
      name:"",
      workflowItemId:"",
      workflowItemName:"",
      nodeNum:"",
      workflowItems:[],
      showSelect:false,
      users:[],
      displays:[],
    }
  },
  created:function(){
    this.getWorkflowItems();
  },
  methods:{
    close:function(){
      this.$parent.hideModal();
    },
    save:function() {
      var name = this.name;
      var workflowItemId = this.workflowItemId;
      var nodeNum = this.nodeNum;
      var users = this.users;
      var url = config.remote_site + "/" +this.obj.url + "/user";
      var params = {
        name:name,
        workflowItemId:workflowItemId,
        nodeNum:nodeNum,
        users:users,
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
    },
    choose:function(){
      this.showSelect = true;
    },
    closeUserSelect:function(){
      this.showSelect = false;
    },
    selectUsers:function(users){
      var displays = new Array();
      for(var i in users) {
        displays.push(users[i].row.realname);
      }
      this.displays = displays;
      this.users = users;
    }
  },
}
</script>

