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
            <label for="shortName">简称</label>
            <input v-model="shortName" required type="text" class="form-control" id="password" placeholder="请输入简称">
          </div>
          <div class="form-group">
            <label for="url">地址</label>
            <input v-model="url" required type="text" class="form-control" id="url" placeholder="请输入地址">
          </div>
          <div class="form-group">
            <label for="group">组</label>
            <input v-model="group" required type="text" class="form-control" id="group" placeholder="请输入组">
          </div>
          <div class="form-group">
            <label for="groupEn">组简称</label>
            <input v-model="groupEn" required type="text" class="form-control" id="groupEn" placeholder="请输入组简称">
          </div>
          <div class="form-group">
            <label for="sort">排序标识</label>
            <input v-model="sort" required type="number" class="form-control" id="sort" placeholder="请输入排序标识">
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
  name:"resource_create",
  props:{
    obj:Object,
  },
  data:function(){
    return {
      title:"新建资源",
      name:"",
      shortName:"",
      url:'',
      group:'',
      groupEn:'',
      sort:'',
    }
  },
  methods:{
    close:function(){
      this.$parent.hideModal();
    },
    save:function() {
      var name = this.name;
      var shortName = this.shortName;
      var reUrl = this.url;
      var group = this.group;
      var groupEn = this.groupEn;
      var sort = this.sort;
      var url = config.remote_site + "/" +this.obj.url;
      var params = {
        name:name,
        shortName:shortName,
        url:reUrl,
        group:group,
        groupEn:groupEn,
        sort:sort,
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

