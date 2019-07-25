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
    <component :is="comp" :currentResource="currentResource"></component>
  </main>
</template>
<script>
import config from "../../../js/config.js";

export default {
  name: "workflow_main",
  props: {
    resId: String
  },
  components: {
    item: function(resolve) {
      require(["./item/list.vue"], resolve);
    },
    node: function(resolve) {
      require(["./node/list.vue"], resolve);
    },
    // record: function(resolve) {
    //   require(["./record/list.vue"], resolve);
    // }
  },
  data: function() {
    return {
      comp: "",
      currentResource: {},
      currentGroup:'workflow',
      allRes:[]
    };
  },
  mounted: function() {
    this.allRes = [];
    localStorage.setItem("currentGroup", this.currentGroup);
    var currentResourceId = localStorage.getItem("currentResource");
    var userinfo = JSON.parse(localStorage.getItem("userinfo"));
    var resources = userinfo.resources;
    var selected = false;
    for (var i in resources) {
      if (resources[i].groupEn == this.currentGroup) {
        this.allRes.push(resources[i]);
        if (resources[i].id == currentResourceId) {
          this.currentResource = resources[i];
          selected = true;
        }
      }
    }
    if(!selected) {
      this.currentResource = this.allRes[0];
    }
    this.comp = this.currentResource.shortName;
  },
  watch: {
    resId: function(value) {
      this.currentGroup = localStorage.getItem("currentGroup");
      var currentResourceId = value;
      var userinfo = JSON.parse(localStorage.getItem("userinfo"));
      var resources = userinfo.resources;
      for (var i in resources) {
        if (resources[i].id == currentResourceId) {
          this.currentResource = resources[i];
        }
      }
      this.comp = this.currentResource.shortName;
    }
  }
};
</script> 

