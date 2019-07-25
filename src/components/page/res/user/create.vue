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
                        <div class="form-group row">
                            <label for="username" class="col-sm-2 col-form-label">用户名</label>
                            <div class="col-sm-10">
                                <input
                                    v-model="username"
                                    required
                                    type="text"
                                    class="form-control"
                                    id="username"
                                    placeholder="请输入用户名"
                                />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="password" class="col-sm-2 col-form-label">密码</label>
                            <div class="col-sm-10">
                                <input
                                    v-model="password"
                                    required
                                    type="password"
                                    class="form-control"
                                    id="password"
                                    placeholder="请输入密码"
                                />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="username" class="col-sm-2 col-form-label">姓名</label>
                            <div class="col-sm-10">
                                <input
                                    v-model="realname"
                                    required
                                    type="text"
                                    class="form-control"
                                    id="realname"
                                    placeholder="请输入姓名"
                                />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="username" class="col-sm-2 col-form-label">职务</label>
                            <div class="col-sm-10">
                                <input
                                    v-model="userTitle"
                                    required
                                    type="text"
                                    class="form-control"
                                    id="userTitle"
                                    placeholder="请输入职务"
                                />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="email" class="col-sm-2 col-form-label">邮箱</label>
                            <div class="col-sm-10">
                                <input
                                    v-model="email"
                                    required
                                    type="email"
                                    class="form-control"
                                    id="email"
                                    placeholder="请输入邮箱"
                                />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="phone" class="col-sm-2 col-form-label">手机号</label>
                            <div class="col-sm-10">
                                <input
                                    v-model="phone"
                                    required
                                    type="text"
                                    class="form-control"
                                    id="phone"
                                    placeholder="请输入手机号"
                                />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="phone" class="col-sm-2 col-form-label">备注</label>
                            <div class="col-sm-10">
                                <input
                                    v-model="remark"
                                    required
                                    type="text"
                                    class="form-control"
                                    id="remark"
                                    placeholder="请输入备注"
                                />
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
    </div>
</template>
<script>
import config from "../../../../js/config";

export default {
    name: "user_create",
    props: {
        obj: Object
    },
    data: function() {
        return {
            title: "新建用户",
            username: "",
            password: "",
            email: "",
            phone: "",
            userTitle: "",
            remark: "",
            realname: ""
        };
    },
    methods: {
        close: function() {
            this.$parent.hideModal();
        },
        save: function() {
            var username = this.username;
            var password = this.password;
            var email = this.email;
            var phone = this.phone;
            var title = this.userTitle;
            var remark = this.remark;
            var realname = this.realname;
            var url = config.remote_site + "/" + this.obj.url;
            var params = {
                username: username,
                password: password,
                email: email,
                phone: phone,
                title: title,
                remark: remark,
                realname: realname
            };
            var that = this;
            var token = localStorage.getItem("token");
            this.axios
                .post(url, params, { headers: { token: token } })
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
    }
};
</script>

