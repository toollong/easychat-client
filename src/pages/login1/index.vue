<template>
  <div class="account-pages my-5 pt-sm-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-5">
          <div class="text-center mb-4">
            <a href="index.html" class="auth-logo mb-5 d-block">
              <img src="" alt="" height="30" class="logo logo-light" />
            </a>

            <h4>登录</h4>
            <p class="text-muted mb-4"></p>
          </div>

          <div class="card">
            <div class="card-body p-4">
              <div class="p-3">
                <form>
                  <div class="form-group">
                    <label>用户名</label>
                    <div
                      class="
                        input-group
                        mb-3
                        bg-soft-light
                        input-group-lg
                        rounded-lg
                      "
                    >
                      <div class="input-group-prepend">
                        <span class="input-group-text border-light text-muted">
                          <i class="ri-user-2-line"></i>
                        </span>
                      </div>
                      <input
                        type="text"
                        class="form-control bg-soft-light border-light"
                        placeholder="请输入用户名"
                        v-model.trim="loginForm.username"
                      />
                    </div>
                  </div>

                  <div class="form-group mb-4">
                    <div class="float-right">
                      <a
                        href="auth-recoverpw.html"
                        class="text-muted font-size-13"
                        >忘记密码?</a
                      >
                    </div>
                    <label>密码</label>
                    <div
                      class="
                        input-group
                        mb-3
                        bg-soft-light
                        input-group-lg
                        rounded-lg
                      "
                    >
                      <div class="input-group-prepend">
                        <span class="input-group-text border-light text-muted">
                          <i class="ri-lock-2-line"></i>
                        </span>
                      </div>
                      <input
                        type="password"
                        class="form-control bg-soft-light border-light"
                        placeholder="请输入密码"
                        v-model.trim="loginForm.password"
                      />
                    </div>
                  </div>

                  <div class="custom-control custom-checkbox mb-4">
                    <input
                      type="checkbox"
                      class="custom-control-input"
                      id="remember-check"
                    />
                    <label class="custom-control-label" for="remember-check"
                      >记住我</label
                    >
                  </div>

                  <div>
                    <button
                      class="btn btn-primary btn-block waves-effect waves-light"
                      type="submit"
                      @click="login"
                    >
                      登录
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div class="mt-5 text-center">
            <p>
              没有账号?
              <router-link
                to="/register"
                class="font-weight-medium text-primary"
              >
                立即注册
              </router-link>
            </p>
            <p>
              © 2022 ChatApp. Crafted with
              <i class="mdi mdi-heart text-danger"></i> by toollong
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reqLogin } from "@/api";

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    async login() {
      let result = await reqLogin(this.loginForm);
      if (result.status == 200 && result.data.success) {
        alert("登录成功！");
        this.$router.push({ name: "home" });
      } else {
        alert("登录失败，用户名或密码不正确！");
      }
    },
  },
};
</script>

<style scoped>
/*! CSS Used from: http://localhost:8080/css/bootstrap.min.css */
.account-pages {
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  text-align: left;
}
h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}
p {
  margin-top: 0;
  margin-bottom: 1rem;
}
a {
  color: #7269ef;
  text-decoration: none;
  background-color: transparent;
}
a:hover {
  color: #3124e8;
  text-decoration: underline;
}
img {
  vertical-align: middle;
  border-style: none;
}
label {
  display: inline-block;
  margin-bottom: 0.5rem;
}
button {
  border-radius: 0;
}
button:focus {
  outline: 1px dotted;
  outline: 5px auto -webkit-focus-ring-color;
}
button,
input {
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}
button,
input {
  overflow: visible;
}
button {
  text-transform: none;
}
[type="submit"],
button {
  -webkit-appearance: button;
}
[type="submit"]::-moz-focus-inner,
button::-moz-focus-inner {
  padding: 0;
  border-style: none;
}
input[type="checkbox"] {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0;
}
h4 {
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
}
h4 {
  font-size: 1.3125rem;
}
.container {
  width: 100%;
  padding-right: 12px;
  padding-left: 12px;
  margin-right: auto;
  margin-left: auto;
}
@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}
@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}
@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}
@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}
@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}
@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}
@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}
@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}
.row {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-right: -12px;
  margin-left: -12px;
}
.col-xl-5 {
  position: relative;
  width: 100%;
  padding-right: 12px;
  padding-left: 12px;
}
@media (min-width: 1200px) {
  .col-xl-5 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 41.66667%;
    flex: 0 0 41.66667%;
    max-width: 41.66667%;
  }
}
.form-control {
  display: block;
  width: 100%;
  height: calc(1.5em + 0.94rem + 2px);
  padding: 0.47rem 0.75rem;
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #e6ebf5;
  border-radius: 0.25rem;
  -webkit-transition: border-color 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  transition: border-color 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
}
@media (prefers-reduced-motion: reduce) {
  .form-control {
    -webkit-transition: none;
    transition: none;
  }
}
.form-control::-ms-expand {
  background-color: transparent;
  border: 0;
}
.form-control:-moz-focusring {
  color: transparent;
  text-shadow: 0 0 0 #495057;
}
.form-control:focus {
  color: #495057;
  background-color: #fff;
  border-color: #c2cee6;
  outline: 0;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.form-control::-webkit-input-placeholder {
  color: #7a7f9a;
  opacity: 1;
}
.form-control::-moz-placeholder {
  color: #7a7f9a;
  opacity: 1;
}
.form-control:-ms-input-placeholder {
  color: #7a7f9a;
  opacity: 1;
}
.form-control::-ms-input-placeholder {
  color: #7a7f9a;
  opacity: 1;
}
.form-control::placeholder {
  color: #7a7f9a;
  opacity: 1;
}
.form-control:disabled {
  background-color: #fff;
  opacity: 1;
}
.form-group {
  margin-bottom: 1rem;
}
.btn {
  display: inline-block;
  font-weight: 400;
  color: #495057;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.47rem 0.75rem;
  font-size: 0.9375rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  -webkit-transition: color 0.15s ease-in-out,
    background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
}
@media (prefers-reduced-motion: reduce) {
  .btn {
    -webkit-transition: none;
    transition: none;
  }
}
.btn:hover {
  color: #495057;
  text-decoration: none;
}
.btn:focus {
  outline: 0;
  -webkit-box-shadow: 0 0 0 0.15rem rgba(114, 105, 239, 0.25);
  box-shadow: 0 0 0 0.15rem rgba(114, 105, 239, 0.25);
}
.btn:disabled {
  opacity: 0.65;
}
.btn-primary {
  color: #fff;
  background-color: #7269ef;
  border-color: #7269ef;
}
.btn-primary:hover {
  color: #fff;
  background-color: #5246eb;
  border-color: #473bea;
}
.btn-primary:focus {
  color: #fff;
  background-color: #5246eb;
  border-color: #473bea;
  -webkit-box-shadow: 0 0 0 0.15rem rgba(135, 128, 241, 0.5);
  box-shadow: 0 0 0 0.15rem rgba(135, 128, 241, 0.5);
}
.btn-primary:disabled {
  color: #fff;
  background-color: #7269ef;
  border-color: #7269ef;
}
.btn-block {
  display: block;
  width: 100%;
}
.input-group {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-align: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
  width: 100%;
}
.input-group > .form-control {
  position: relative;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  width: 1%;
  min-width: 0;
  margin-bottom: 0;
}
.input-group > .form-control:focus {
  z-index: 3;
}
.input-group > .form-control:not(:first-child) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.input-group-prepend {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
.input-group-prepend {
  margin-right: -1px;
}
.input-group-text {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 0.47rem 0.75rem;
  margin-bottom: 0;
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  text-align: center;
  white-space: nowrap;
  background-color: #f5f7fb;
  border: 1px solid #e6ebf5;
  border-radius: 0.25rem;
}
.input-group-lg > .form-control:not(textarea) {
  height: calc(1.5em + 1rem + 6px);
}
.input-group-lg > .form-control,
.input-group-lg > .input-group-prepend > .input-group-text {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.4rem;
}
.input-group > .input-group-prepend > .input-group-text {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.custom-control {
  position: relative;
  display: block;
  min-height: 1.40625rem;
  padding-left: 1.5rem;
}
.custom-control-input {
  position: absolute;
  left: 0;
  z-index: -1;
  width: 1rem;
  height: 1.20313rem;
  opacity: 0;
}
.custom-control-input:checked ~ .custom-control-label::before {
  color: #fff;
  border-color: #7269ef;
  background-color: #7269ef;
}
.custom-control-input:focus ~ .custom-control-label::before {
  -webkit-box-shadow: none;
  box-shadow: none;
}
.custom-control-input:disabled ~ .custom-control-label {
  color: #7a7f9a;
}
.custom-control-input:disabled ~ .custom-control-label::before {
  background-color: #fff;
}
.custom-control-label {
  position: relative;
  margin-bottom: 0;
  vertical-align: top;
}
.custom-control-label::before {
  position: absolute;
  top: 0.20313rem;
  left: -1.5rem;
  display: block;
  width: 1rem;
  height: 1rem;
  pointer-events: none;
  content: "";
  background-color: #fff;
  border: #adb5bd solid 1px;
}
.custom-control-label::after {
  position: absolute;
  top: 0.20313rem;
  left: -1.5rem;
  display: block;
  width: 1rem;
  height: 1rem;
  content: "";
  background: no-repeat 50%/50% 50%;
}
.custom-checkbox .custom-control-label::before {
  border-radius: 0.25rem;
}
.custom-checkbox .custom-control-input:checked ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
}
.custom-checkbox
  .custom-control-input:disabled:checked
  ~ .custom-control-label::before {
  background-color: rgba(114, 105, 239, 0.5);
}
.custom-control-label::before {
  -webkit-transition: background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
}
@media (prefers-reduced-motion: reduce) {
  .custom-control-label::before {
    -webkit-transition: none;
    transition: none;
  }
}
.card {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 0 solid #f5f7fb;
  border-radius: 0.25rem;
}
.card-body {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  min-height: 1px;
  padding: 1.25rem;
}
.border-light {
  border-color: #e6ebf5 !important;
}
.rounded-lg {
  border-radius: 0.4rem !important;
}
.d-block {
  display: block !important;
}
.justify-content-center {
  -webkit-box-pack: center !important;
  -ms-flex-pack: center !important;
  justify-content: center !important;
}
.float-right {
  float: right !important;
}
.mb-3 {
  margin-bottom: 1rem !important;
}
.mb-4 {
  margin-bottom: 1.5rem !important;
}
.mt-5,
.my-5 {
  margin-top: 3rem !important;
}
.mb-5,
.my-5 {
  margin-bottom: 3rem !important;
}
.p-3 {
  padding: 1rem !important;
}
.p-4 {
  padding: 1.5rem !important;
}
@media (min-width: 576px) {
  .pt-sm-5 {
    padding-top: 3rem !important;
  }
}
.text-center {
  text-align: center !important;
}
.text-primary {
  color: #7269ef !important;
}
a.text-primary:focus,
a.text-primary:hover {
  color: #3124e8 !important;
}
.text-danger {
  color: #ef476f !important;
}
.text-muted {
  color: #7a7f9a !important;
}
@media print {
  *,
  ::after,
  ::before {
    text-shadow: none !important;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
  }
  a:not(.btn) {
    text-decoration: underline;
  }
  img {
    page-break-inside: avoid;
  }
  p {
    orphans: 3;
    widows: 3;
  }
  .container {
    min-width: 992px !important;
  }
}
h4 {
  color: #495057;
  font-weight: 600;
}
a {
  text-decoration: none !important;
}
label {
  font-weight: 500;
}
.bg-soft-light {
  background-color: rgba(230, 235, 245, 0.25) !important;
}
a,
button {
  outline: 0 !important;
}
.card {
  margin-bottom: 24px;
}
/*! CSS Used from: http://localhost:8080/css/icons.min.css */
.mdi:before {
  display: inline-block;
  font: normal normal normal 24px/1 "Material Design Icons";
  font-size: inherit;
  text-rendering: auto;
  line-height: inherit;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.mdi-heart::before {
  content: "\F02D1";
}
[class^="ri-"] {
  font-family: remixicon !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.ri-lock-2-line:before {
  content: "\ee67";
}
.ri-user-2-line:before {
  content: "\f18c";
}
/*! CSS Used from: Embedded */
.auth-logo .logo[data-v-247e7dd8] {
  margin: 0 auto;
}
.font-size-13[data-v-247e7dd8] {
  font-size: 13px !important;
}
.custom-control-label[data-v-247e7dd8] {
  cursor: pointer;
}
.custom-control-label[data-v-247e7dd8]::before {
  background-color: #fff;
}
.waves-effect[data-v-247e7dd8] {
  position: relative;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.font-weight-medium[data-v-247e7dd8] {
  font-weight: 500;
}
</style>