<template>
    <div
        id="exampleModalCenter"
        class="modal fade show"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        style="display: block; padding-right: 15px;"
    >
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalCenterTitle">选择人员</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span @click="close();" aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="btn-toolbar justify-content-end" role="toolbar">
                        <div>
                            <form class="form-inline">
                                <label class="sr-only" for="username-search">用户名</label>
                                <input
                                    type="text"
                                    class="form-control mb-2 mr-sm-2"
                                    id="username-search"
                                    placeholder="请输入用户名"
                                    v-model="pageInfo.otherParam.username"
                                />

                                <label class="sr-only" for="realname-search">姓名</label>
                                <input
                                    type="text"
                                    class="form-control mb-2 mr-sm-2"
                                    id="realname-search"
                                    placeholder="姓名"
                                    v-model="pageInfo.otherParam.realname"
                                />

                                <button
                                    type="button"
                                    class="btn btn-success mb-2"
                                    @click="gotoSearch();"
                                >查找</button>
                                <button
                                    type="button"
                                    class="btn btn-warning mb-2"
                                    @click="clear();"
                                >清空</button>
                            </form>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-striped table-sm">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>用户名</th>
                                    <th>姓名</th>
                                    <th>职务</th>
                                    <th>备注</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="row in pageInfo.rows" :key="row.id">
                                    <td><input type="checkbox" :value="{row}" v-model="selectedUsers"/></td>
                                    <td>{{row.username}}</td>
                                    <td>{{row.realname}}</td>
                                    <td>{{row.title}}</td>
                                    <td>{{row.remark}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <nav aria-label="Page navigation example">
                            <ul class="pagination">
                                <li
                                    class="page-item"
                                    :class="pageInfo.pageIndex == 0 ? disabled :''"
                                >
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
                                    <a
                                        class="page-link"
                                        @click="gotoPage(i-1);"
                                        href="javascript:void(0);"
                                    >{{i}}</a>
                                </li>
                                <li
                                    class="page-item"
                                    :class="pageInfo.pageIndex == pageInfo.pages - 1 ? disabled :''"
                                >
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
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="close();">关闭</button>
                        <button type="button" class="btn btn-primary" @click="commit();">提交</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import config from "../../js/config.js";

export default {
    name: "userSelect",
    props: {
        selected: []
    },
    data: function() {
        return {
            selectedUsers: [],
            pageInfo: {
                pageSize: 5,
                pageIndex: 0,
                total: 0,
                pages: 0,
                rows: [],
                otherParam: {
                    username: "",
                    phone: "",
                    email: "",
                    realname: ""
                },
                asc: [],
                desc: []
            },
            disabled: "disabled",
            active:"active"
        };
    },
    created: function() {
        this.getMainData();
    },
    methods: {
        getMainData: function() {
            let token = localStorage.getItem("token");
            let url = config.remote_site + "/sso/users/page";
            var that = this;
            var pageInfo = encodeURI(JSON.stringify(this.pageInfo));
            this.axios
                .get(url, {
                    params: { pageInfo: pageInfo },
                    headers: { token: token }
                })
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
        /** 关闭 */
        close: function() {
            this.$parent.closeUserSelect();
        },
        /** 提交 父组件需要提供关闭和确定的响应函数 */
        commit: function() {
            this.$parent.selectUsers(this.selectedUsers);
            this.close();
        },
        gotoPage: function(index) {
            this.pageInfo.pageIndex = index;
            this.getMainData();
        },
        clear: function() {
            this.pageInfo.otherParam = {
                username: "",
                realname: "",
                phone: "",
                email: ""
            };
        },
        gotoSearch: function() {
            this.pageInfo.pageIndex = 0;
            this.getMainData();
        }
    }
};
</script>

