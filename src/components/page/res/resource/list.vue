<template>
  <div>
    <div class="btn-toolbar justify-content-between" role="toolbar">
      <button
        v-if="crCreate"
        type="button"
        @click="create();"
        class="btn btn-primary mb-2 mr-0"
      >新建{{currentResource.name}}</button>
      <div class="justify-content-end">
        <form class="form-inline">
          <label class="sr-only" for="username-search">名称</label>
          <input
            type="text"
            class="form-control mb-2 mr-sm-2"
            id="username-search"
            placeholder="请输入名称"
            v-model="pageInfo.otherParam.name"
          />

          <label class="sr-only" for="phone-search">简称</label>
          <input
            type="text"
            class="form-control mb-2 mr-sm-2"
            id="phone-search"
            placeholder="请输入简称"
            v-model="pageInfo.otherParam.shortName"
          />

          <label class="sr-only" for="phone-search">群组</label>
          <input
            type="text"
            class="form-control mb-2 mr-sm-2"
            id="phone-search"
            placeholder="请输入群组"
            v-model="pageInfo.otherParam.group"
          />

          <label class="sr-only" for="phone-search">群组简称</label>
          <input
            type="text"
            class="form-control mb-2 mr-sm-2"
            id="phone-search"
            placeholder="请输入群组简称"
            v-model="pageInfo.otherParam.groupEn"
          />

          <!-- <div class="form-check mb-2 mr-sm-2">
            <input class="form-check-input" type="checkbox" id="inlineFormCheck" />
            <label class="form-check-label" for="inlineFormCheck">Remember me</label>
          </div>-->

          <button type="button" class="btn btn-success mb-2" @click="gotoSearch();">查找</button>
          <button type="button" class="btn btn-warning mb-2" @click="clear();">清空</button>
        </form>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th>名称</th>
            <th>简称</th>
            <th>地址</th>
            <th>群组</th>
            <th>群组简称</th>
            <th>排序标识</th>
            <!-- <th>创建时间</th> -->
            <!-- <th>更新时间</th> -->
            <th v-if="crOperate">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in pageInfo.rows" :key="row.id">
            <td>{{row.name}}</td>
            <td>{{row.shortName}}</td>
            <td>{{row.url}}</td>
            <td>{{row.group}}</td>
            <td>{{row.groupEn}}</td>
            <td>{{row.sort}}</td>
            <!-- <td>{{row.created}}</td> -->
            <!-- <td>{{row.updated}}</td> -->
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
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item" :class="pageInfo.pageIndex == 0 ? disabled :''">
            <a
              class="page-link"
              @click="gotoPage(pageInfo.pageIndex-1);"
              href="javascript:void(0);"
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
              <span class="sr-only">Previous</span>
            </a>
          </li>
          <li
            class="page-item"
            v-for="i in pageInfo.pages"
            :key="i"
            :class="pageInfo.pageIndex+1 == i ? active:''"
          >
            <a class="page-link" @click="gotoPage(i-1);" href="javascript:void(0);">{{i}}</a>
          </li>
          <li class="page-item" :class="pageInfo.pageIndex == pageInfo.pages - 1 ? disabled :''">
            <a
              class="page-link"
              @click="gotoPage(pageInfo.pageIndex+1);"
              href="javascript:void(0);"
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
              <span class="sr-only">Next</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
    <component :is="comp" :style="mdStyle" :class="mdClass" :obj="currentResource" :recId="recId"></component>
  </div>
</template>
<script>
import config from "../../../../js/config.js";

export default {
  name: "list",
  components: {
    vue_create: function(resolve) {
      require(["./create.vue"], resolve);
    },
    vue_update: function(resolve) {
      require(["./update.vue"], resolve);
    },
    vue_view: function(resolve) {
      require(["./view.vue"], resolve);
    }
  },
  props:{
    currentResource:Object
  },
  data: function() {
    return {
      rows: [],
      disabled: "disabled",
      active: "active",
      pageInfo: {
        pageSize: 10,
        pageIndex: 0,
        total: 0,
        pages: 0,
        rows: [],
        otherParam: {
          name: "",
          shortName: "",
          group:"",
          groupEn:"",
        },
        asc: ["sort"],
        desc: []
      },
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
    // 获取操作权限
    this.getOperate();
    // 获取数据列表
    this.getMainData();
  },
  methods: {
    getMainData: function() {
      var url = config.remote_site + "/" + this.currentResource.url + "/page";
      var token = localStorage.getItem("token");
      var that = this;
      var pageInfo = encodeURI(JSON.stringify(this.pageInfo));
      this.axios
        .get(url, { params: { pageInfo: pageInfo }, headers: { token: token } })
        .then(function(response) {
          var result = response.data;
          if (result.code == 0) {
            var data = result.data;
            that.pageInfo = data;
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
      var compName = "vue_view";
      this.comp = compName;
      this.recId = id;
      this.showModal();
    },
    update: function(id) {
      var resource = this.currentResource;
      var compName = "vue_update";
      this.comp = compName;
      this.recId = id;
      this.showModal();
    },
    remove: function(id) {
      var url = config.remote_site + "/" + this.currentResource.url + "/" + id;
      if (confirm("确定删除记录?")) {
        var token = localStorage.getItem("token");
        var that = this;
        this.axios
          .delete(url, { headers: { token: token } })
          .then(function(response) {
            var result = response.data;
            if (result.code == 0) {
              that.hideModal();
            } else {
              alert(result.msg);
            }
          });
      }
    },
    create: function() {
      var resource = this.currentResource;
      var compName = "vue_create";
      this.comp = compName;
      this.showModal();
    },
    gotoPage: function(index) {
      this.pageInfo.pageIndex = index;
      this.getMainData();
    },
    clear: function() {
      this.pageInfo.otherParam = {
          name: "",
          shortName: "",
          group:"",
          groupEn:"",
      };
    },
    gotoSearch: function() {
      this.pageInfo.pageIndex = 0;
      this.getMainData();
    }
  }
};
</script>

