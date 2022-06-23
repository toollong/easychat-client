<template>
  <div
    class="modal fade"
    id="editProfileModal"
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-zoom"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i data-feather="edit-2" class="mr-2"></i> 编辑资料
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti-close"></i>
          </button>
        </div>
        <div class="modal-body">
          <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item">
              <a
                class="nav-link active"
                data-toggle="tab"
                href="#personal"
                role="tab"
                aria-controls="personal"
                aria-selected="true"
                >我的信息</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                data-toggle="tab"
                href="#about"
                role="tab"
                aria-controls="about"
                aria-selected="false"
                >个人介绍</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                data-toggle="tab"
                href="#social-links"
                role="tab"
                aria-controls="social-links"
                aria-selected="false"
                >社交账号</a
              >
            </li>
          </ul>
          <div class="tab-content">
            <div class="tab-pane show active" id="personal" role="tabpanel">
              <form>
                <div class="form-group">
                  <label for="nickname" class="col-form-label">昵称</label>
                  <div class="input-group">
                    <input
                      type="text"
                      id="nickname"
                      class="form-control"
                      v-model.trim="profile.nickName"
                    />
                    <div class="input-group-append">
                      <span class="input-group-text">
                        <i data-feather="user"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-form-label">头像</label>
                  <div class="d-flex align-items-center">
                    <div>
                      <figure class="avatar mr-3 item-rtl">
                        <img
                          src="@/assets/images/avatar2.jpg"
                          class="rounded-circle"
                          alt="image"
                        />
                      </figure>
                    </div>

                    <div class="custom-file">
                      <input
                        type="file"
                        class="custom-file-input"
                        id="customFile"
                      />
                      <label class="custom-file-label" for="customFile"
                        >选择文件</label
                      >
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-form-label">性别</label>
                  <div class="gender">
                    <input
                      type="radio"
                      hidden
                      id="male"
                      value="1"
                      v-model="profile.gender"
                    />
                    <label for="male">男 </label>
                    <input
                      type="radio"
                      hidden
                      id="female"
                      value="0"
                      v-model="profile.gender"
                    />
                    <label for="female">女 </label>
                    <input
                      type="radio"
                      hidden
                      id="unknown"
                      value="2"
                      v-model="profile.gender"
                    />
                    <label for="unknown">保密</label>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-form-label">生日</label>
                  <input
                    type="date"
                    class="form-control"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    v-model="profile.birthday"
                  />
                </div>
                <div class="form-group">
                  <label for="email" class="col-form-label">邮箱</label>
                  <div class="input-group">
                    <input
                      type="text"
                      id="email"
                      class="form-control"
                      v-model.trim="profile.email"
                    />
                    <div class="input-group-append">
                      <span class="input-group-text">
                        <i data-feather="mail"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="phone" class="col-form-label">联系方式</label>
                  <div class="input-group">
                    <input
                      type="text"
                      id="phone"
                      class="form-control"
                      v-model.trim="profile.phone"
                    />
                    <div class="input-group-append">
                      <span class="input-group-text">
                        <i data-feather="phone"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-form-label">地区</label>
                  <div>
                    <select
                      class="region prov"
                      v-model="profile.province"
                      @change="showCities"
                    >
                      <option disabled value="">请选择省份</option>
                      <option
                        v-for="(item, index) in provinceList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></option>
                    </select>
                    <select class="region city" v-model="profile.city">
                      <option disabled value="">请选择城市</option>
                      <option
                        v-for="(item, index) in selectCityList"
                        :key="index"
                        :label="item.label"
                        :value="item.label"
                      ></option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div class="tab-pane" id="about" role="tabpanel">
              <form>
                <div class="form-group">
                  <div class="alert alert-info">用一句话来介绍一下自己吧！</div>
                  <textarea
                    class="form-control introduction"
                    v-model.trim="profile.introduction"
                  ></textarea>
                  <span>{{ profile.introduction.length }} / 40</span>
                </div>
              </form>
            </div>
            <div class="tab-pane" id="social-links" role="tabpanel">
              <form>
                <div class="form-group">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Facebook"
                    />
                    <div class="input-group-append">
                      <span class="input-group-text bg-facebook">
                        <i class="ti-facebook"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Twitter"
                    />
                    <div class="input-group-append">
                      <span class="input-group-text bg-twitter">
                        <i class="ti-twitter"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Instagram"
                    />
                    <div class="input-group-append">
                      <span class="input-group-text bg-instagram">
                        <i class="ti-instagram"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Linkedin"
                    />
                    <div class="input-group-append">
                      <span class="input-group-text bg-linkedin">
                        <i class="ti-linkedin"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Dribbble"
                    />
                    <div class="input-group-append">
                      <span class="input-group-text bg-dribbble">
                        <i class="ti-dribbble"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Youtube"
                    />
                    <div class="input-group-append">
                      <span class="input-group-text bg-youtube">
                        <i class="ti-youtube"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Google"
                    />
                    <div class="input-group-append">
                      <span class="input-group-text bg-google">
                        <i class="ti-google"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Whatsapp"
                    />
                    <div class="input-group-append">
                      <span class="input-group-text bg-whatsapp">
                        <i class="fa fa-whatsapp"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="updateUserInfo">
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, onMounted, reactive, ref, toRefs, watch } from "vue";
import { reqEditUserInfo } from "@/api";

export default {
  name: "ProfileEdit",
  props: {
    userInfo: Object,
  },
  setup(props) {
    const { userInfo } = toRefs(props);

    const user = inject("user");
    const profile = reactive({
      nickName: "",
      gender: "",
      birthday: "",
      email: "",
      phone: "",
      province: "",
      city: "",
      introduction: "",
    });
    const provinceList = ref([]);
    const cityList = ref([]);
    const selectCityList = ref([]);
    const showCities = () => {
      selectCityList.value = cityList.value.filter(
        (city) => city.prov == profile.province
      );
    };
    const updateUserInfo = async () => {
      if (profile.nickName.length > 11) {
        alert("昵称的长度不能超过11个字符！");
      } else if (profile.email.length > 30) {
        alert("邮箱的长度不能超过30个字符！");
      } else if (profile.phone.length > 20) {
        alert("手机号码的长度不能超过20个字符！");
      } else if (profile.introduction.length > 40) {
        alert("个人介绍的长度不能超过40个字符！");
      } else {
        let result = await reqEditUserInfo({
          nickName: profile.nickName,
          gender: profile.gender,
          birthday: profile.birthday,
          email: profile.email,
          phone: profile.phone,
          region: profile.province + " " + profile.city,
          introduction: profile.introduction,
        });
        if (result.code === 200 && result.success) {
          alert("保存成功！");
        } else {
          alert("保存失败！");
        }
      }
    };

    onMounted(() => {
      provinceList.value = [
        { label: "北京市", value: "北京" },
        { label: "天津市", value: "天津" },
        { label: "河北省", value: "河北" },
        { label: "山西省", value: "山西" },
        { label: "内蒙古自治区", value: "内蒙古" },
        { label: "辽宁省", value: "辽宁" },
        { label: "吉林省", value: "吉林" },
        { label: "黑龙江省", value: "黑龙江" },
        { label: "上海市", value: "上海" },
        { label: "江苏省", value: "江苏" },
        { label: "浙江省", value: "浙江" },
        { label: "安徽省", value: "安徽" },
        { label: "福建省", value: "福建" },
        { label: "江西省", value: "江西" },
        { label: "山东省", value: "山东" },
        { label: "河南省", value: "河南" },
        { label: "湖北省", value: "湖北" },
        { label: "湖南省", value: "湖南" },
        { label: "广东省", value: "广东" },
        { label: "广西壮族自治区", value: "广西" },
        { label: "海南省", value: "海南" },
        { label: "重庆市", value: "重庆" },
        { label: "四川省", value: "四川" },
        { label: "贵州省", value: "贵州" },
        { label: "云南省", value: "云南" },
        { label: "西藏自治区", value: "西藏" },
        { label: "陕西省", value: "陕西" },
        { label: "甘肃省", value: "甘肃" },
        { label: "青海省", value: "青海" },
        { label: "宁夏回族自治区", value: "宁夏" },
        { label: "新疆维吾尔自治区", value: "新疆" },
        { label: "台湾省", value: "中国台湾" },
        { label: "香港特别行政区", value: "香港" },
        { label: "澳门特别行政区", value: "澳门" },
      ];
      cityList.value = [
        {
          prov: "北京",
          label: "北京市",
        },
        {
          prov: "天津",
          label: "天津市",
        },
        {
          prov: "河北",
          label: "石家庄市",
        },
        {
          prov: "河北",
          label: "唐山市",
        },
        {
          prov: "河北",
          label: "秦皇岛市",
        },
        {
          prov: "河北",
          label: "邯郸市",
        },
        {
          prov: "河北",
          label: "邢台市",
        },
        {
          prov: "河北",
          label: "保定市",
        },
        {
          prov: "河北",
          label: "张家口市",
        },
        {
          prov: "河北",
          label: "承德市",
        },
        {
          prov: "河北",
          label: "沧州市",
        },
        {
          prov: "河北",
          label: "廊坊市",
        },
        {
          prov: "河北",
          label: "衡水市",
        },
        {
          prov: "山西",
          label: "太原市",
        },
        {
          prov: "山西",
          label: "大同市",
        },
        {
          prov: "山西",
          label: "阳泉市",
        },
        {
          prov: "山西",
          label: "长治市",
        },
        {
          prov: "山西",
          label: "晋城市",
        },
        {
          prov: "山西",
          label: "朔州市",
        },
        {
          prov: "山西",
          label: "晋中市",
        },
        {
          prov: "山西",
          label: "运城市",
        },
        {
          prov: "山西",
          label: "忻州市",
        },
        {
          prov: "山西",
          label: "临汾市",
        },
        {
          prov: "山西",
          label: "吕梁市",
        },
        {
          prov: "内蒙古",
          label: "呼和浩特市",
        },
        {
          prov: "内蒙古",
          label: "包头市",
        },
        {
          prov: "内蒙古",
          label: "乌海市",
        },
        {
          prov: "内蒙古",
          label: "赤峰市",
        },
        {
          prov: "内蒙古",
          label: "通辽市",
        },
        {
          prov: "内蒙古",
          label: "鄂尔多斯市",
        },
        {
          prov: "内蒙古",
          label: "呼伦贝尔市",
        },
        {
          prov: "内蒙古",
          label: "巴彦淖尔市",
        },
        {
          prov: "内蒙古",
          label: "乌兰察布市",
        },
        {
          prov: "内蒙古",
          label: "兴安盟",
        },
        {
          prov: "内蒙古",
          label: "锡林郭勒盟",
        },
        {
          prov: "内蒙古",
          label: "阿拉善盟",
        },
        {
          prov: "辽宁",
          label: "沈阳市",
        },
        {
          prov: "辽宁",
          label: "大连市",
        },
        {
          prov: "辽宁",
          label: "鞍山市",
        },
        {
          prov: "辽宁",
          label: "抚顺市",
        },
        {
          prov: "辽宁",
          label: "本溪市",
        },
        {
          prov: "辽宁",
          label: "丹东市",
        },
        {
          prov: "辽宁",
          label: "锦州市",
        },
        {
          prov: "辽宁",
          label: "营口市",
        },
        {
          prov: "辽宁",
          label: "阜新市",
        },
        {
          prov: "辽宁",
          label: "辽阳市",
        },
        {
          prov: "辽宁",
          label: "盘锦市",
        },
        {
          prov: "辽宁",
          label: "铁岭市",
        },
        {
          prov: "辽宁",
          label: "朝阳市",
        },
        {
          prov: "辽宁",
          label: "葫芦岛市",
        },
        {
          prov: "吉林",
          label: "长春市",
        },
        {
          prov: "吉林",
          label: "吉林市",
        },
        {
          prov: "吉林",
          label: "四平市",
        },
        {
          prov: "吉林",
          label: "辽源市",
        },
        {
          prov: "吉林",
          label: "通化市",
        },
        {
          prov: "吉林",
          label: "白山市",
        },
        {
          prov: "吉林",
          label: "松原市",
        },
        {
          prov: "吉林",
          label: "白城市",
        },
        {
          prov: "吉林",
          label: "延边朝鲜族自治州",
        },
        {
          prov: "黑龙江",
          label: "哈尔滨市",
        },
        {
          prov: "黑龙江",
          label: "齐齐哈尔市",
        },
        {
          prov: "黑龙江",
          label: "鸡西市",
        },
        {
          prov: "黑龙江",
          label: "鹤岗市",
        },
        {
          prov: "黑龙江",
          label: "双鸭山市",
        },
        {
          prov: "黑龙江",
          label: "大庆市",
        },
        {
          prov: "黑龙江",
          label: "伊春市",
        },
        {
          prov: "黑龙江",
          label: "佳木斯市",
        },
        {
          prov: "黑龙江",
          label: "七台河市",
        },
        {
          prov: "黑龙江",
          label: "牡丹江市",
        },
        {
          prov: "黑龙江",
          label: "黑河市",
        },
        {
          prov: "黑龙江",
          label: "绥化市",
        },
        {
          prov: "黑龙江",
          label: "大兴安岭地区",
        },
        {
          prov: "上海",
          label: "上海市",
        },
        {
          prov: "江苏",
          label: "南京市",
        },
        {
          prov: "江苏",
          label: "无锡市",
        },
        {
          prov: "江苏",
          label: "徐州市",
        },
        {
          prov: "江苏",
          label: "常州市",
        },
        {
          prov: "江苏",
          label: "苏州市",
        },
        {
          prov: "江苏",
          label: "南通市",
        },
        {
          prov: "江苏",
          label: "连云港市",
        },
        {
          prov: "江苏",
          label: "淮安市",
        },
        {
          prov: "江苏",
          label: "盐城市",
        },
        {
          prov: "江苏",
          label: "扬州市",
        },
        {
          prov: "江苏",
          label: "镇江市",
        },
        {
          prov: "江苏",
          label: "泰州市",
        },
        {
          prov: "江苏",
          label: "宿迁市",
        },
        {
          prov: "浙江",
          label: "杭州市",
        },
        {
          prov: "浙江",
          label: "宁波市",
        },
        {
          prov: "浙江",
          label: "温州市",
        },
        {
          prov: "浙江",
          label: "嘉兴市",
        },
        {
          prov: "浙江",
          label: "湖州市",
        },
        {
          prov: "浙江",
          label: "绍兴市",
        },
        {
          prov: "浙江",
          label: "金华市",
        },
        {
          prov: "浙江",
          label: "衢州市",
        },
        {
          prov: "浙江",
          label: "舟山市",
        },
        {
          prov: "浙江",
          label: "台州市",
        },
        {
          prov: "浙江",
          label: "丽水市",
        },
        {
          prov: "安徽",
          label: "合肥市",
        },
        {
          prov: "安徽",
          label: "芜湖市",
        },
        {
          prov: "安徽",
          label: "蚌埠市",
        },
        {
          prov: "安徽",
          label: "淮南市",
        },
        {
          prov: "安徽",
          label: "马鞍山市",
        },
        {
          prov: "安徽",
          label: "淮北市",
        },
        {
          prov: "安徽",
          label: "铜陵市",
        },
        {
          prov: "安徽",
          label: "安庆市",
        },
        {
          prov: "安徽",
          label: "黄山市",
        },
        {
          prov: "安徽",
          label: "滁州市",
        },
        {
          prov: "安徽",
          label: "阜阳市",
        },
        {
          prov: "安徽",
          label: "宿州市",
        },
        {
          prov: "安徽",
          label: "六安市",
        },
        {
          prov: "安徽",
          label: "亳州市",
        },
        {
          prov: "安徽",
          label: "池州市",
        },
        {
          prov: "安徽",
          label: "宣城市",
        },
        {
          prov: "福建",
          label: "福州市",
        },
        {
          prov: "福建",
          label: "厦门市",
        },
        {
          prov: "福建",
          label: "莆田市",
        },
        {
          prov: "福建",
          label: "三明市",
        },
        {
          prov: "福建",
          label: "泉州市",
        },
        {
          prov: "福建",
          label: "漳州市",
        },
        {
          prov: "福建",
          label: "南平市",
        },
        {
          prov: "福建",
          label: "龙岩市",
        },
        {
          prov: "福建",
          label: "宁德市",
        },
        {
          prov: "江西",
          label: "南昌市",
        },
        {
          prov: "江西",
          label: "景德镇市",
        },
        {
          prov: "江西",
          label: "萍乡市",
        },
        {
          prov: "江西",
          label: "九江市",
        },
        {
          prov: "江西",
          label: "新余市",
        },
        {
          prov: "江西",
          label: "鹰潭市",
        },
        {
          prov: "江西",
          label: "赣州市",
        },
        {
          prov: "江西",
          label: "吉安市",
        },
        {
          prov: "江西",
          label: "宜春市",
        },
        {
          prov: "江西",
          label: "抚州市",
        },
        {
          prov: "江西",
          label: "上饶市",
        },
        {
          prov: "山东",
          label: "济南市",
        },
        {
          prov: "山东",
          label: "青岛市",
        },
        {
          prov: "山东",
          label: "淄博市",
        },
        {
          prov: "山东",
          label: "枣庄市",
        },
        {
          prov: "山东",
          label: "东营市",
        },
        {
          prov: "山东",
          label: "烟台市",
        },
        {
          prov: "山东",
          label: "潍坊市",
        },
        {
          prov: "山东",
          label: "济宁市",
        },
        {
          prov: "山东",
          label: "泰安市",
        },
        {
          prov: "山东",
          label: "威海市",
        },
        {
          prov: "山东",
          label: "日照市",
        },
        {
          prov: "山东",
          label: "莱芜市",
        },
        {
          prov: "山东",
          label: "临沂市",
        },
        {
          prov: "山东",
          label: "德州市",
        },
        {
          prov: "山东",
          label: "聊城市",
        },
        {
          prov: "山东",
          label: "滨州市",
        },
        {
          prov: "山东",
          label: "菏泽市",
        },
        {
          prov: "河南",
          label: "郑州市",
        },
        {
          prov: "河南",
          label: "开封市",
        },
        {
          prov: "河南",
          label: "洛阳市",
        },
        {
          prov: "河南",
          label: "平顶山市",
        },
        {
          prov: "河南",
          label: "安阳市",
        },
        {
          prov: "河南",
          label: "鹤壁市",
        },
        {
          prov: "河南",
          label: "新乡市",
        },
        {
          prov: "河南",
          label: "焦作市",
        },
        {
          prov: "河南",
          label: "濮阳市",
        },
        {
          prov: "河南",
          label: "许昌市",
        },
        {
          prov: "河南",
          label: "漯河市",
        },
        {
          prov: "河南",
          label: "三门峡市",
        },
        {
          prov: "河南",
          label: "南阳市",
        },
        {
          prov: "河南",
          label: "商丘市",
        },
        {
          prov: "河南",
          label: "信阳市",
        },
        {
          prov: "河南",
          label: "周口市",
        },
        {
          prov: "河南",
          label: "驻马店市",
        },
        {
          prov: "河南",
          label: "省直辖县级行政区划",
        },
        {
          prov: "湖北",
          label: "武汉市",
        },
        {
          prov: "湖北",
          label: "黄石市",
        },
        {
          prov: "湖北",
          label: "十堰市",
        },
        {
          prov: "湖北",
          label: "宜昌市",
        },
        {
          prov: "湖北",
          label: "襄阳市",
        },
        {
          prov: "湖北",
          label: "鄂州市",
        },
        {
          prov: "湖北",
          label: "荆门市",
        },
        {
          prov: "湖北",
          label: "孝感市",
        },
        {
          prov: "湖北",
          label: "荆州市",
        },
        {
          prov: "湖北",
          label: "黄冈市",
        },
        {
          prov: "湖北",
          label: "咸宁市",
        },
        {
          prov: "湖北",
          label: "随州市",
        },
        {
          prov: "湖北",
          label: "恩施土家族苗族自治州",
        },
        {
          prov: "湖北",
          label: "省直辖县级行政区划",
        },
        {
          prov: "湖北",
          label: "仙桃市",
        },
        {
          prov: "湖北",
          label: "潜江市",
        },
        {
          prov: "湖北",
          label: "天门市",
        },
        {
          prov: "湖北",
          label: "神农架林区",
        },
        {
          prov: "湖南",
          label: "长沙市",
        },
        {
          prov: "湖南",
          label: "株洲市",
        },
        {
          prov: "湖南",
          label: "湘潭市",
        },
        {
          prov: "湖南",
          label: "衡阳市",
        },
        {
          prov: "湖南",
          label: "邵阳市",
        },
        {
          prov: "湖南",
          label: "岳阳市",
        },
        {
          prov: "湖南",
          label: "常德市",
        },
        {
          prov: "湖南",
          label: "张家界市",
        },
        {
          prov: "湖南",
          label: "益阳市",
        },
        {
          prov: "湖南",
          label: "郴州市",
        },
        {
          prov: "湖南",
          label: "永州市",
        },
        {
          prov: "湖南",
          label: "怀化市",
        },
        {
          prov: "湖南",
          label: "娄底市",
        },
        {
          prov: "湖南",
          label: "湘西土家族苗族自治州",
        },
        {
          prov: "广东",
          label: "广州市",
        },
        {
          prov: "广东",
          label: "韶关市",
        },
        {
          prov: "广东",
          label: "深圳市",
        },
        {
          prov: "广东",
          label: "珠海市",
        },
        {
          prov: "广东",
          label: "汕头市",
        },
        {
          prov: "广东",
          label: "佛山市",
        },
        {
          prov: "广东",
          label: "江门市",
        },
        {
          prov: "广东",
          label: "湛江市",
        },
        {
          prov: "广东",
          label: "茂名市",
        },
        {
          prov: "广东",
          label: "肇庆市",
        },
        {
          prov: "广东",
          label: "惠州市",
        },
        {
          prov: "广东",
          label: "梅州市",
        },
        {
          prov: "广东",
          label: "汕尾市",
        },
        {
          prov: "广东",
          label: "河源市",
        },
        {
          prov: "广东",
          label: "阳江市",
        },
        {
          prov: "广东",
          label: "清远市",
        },
        {
          prov: "广东",
          label: "东莞市",
        },
        {
          prov: "广东",
          label: "中山市",
        },
        {
          prov: "广东",
          label: "潮州市",
        },
        {
          prov: "广东",
          label: "揭阳市",
        },
        {
          prov: "广东",
          label: "云浮市",
        },
        {
          prov: "广西",
          label: "南宁市",
        },
        {
          prov: "广西",
          label: "柳州市",
        },
        {
          prov: "广西",
          label: "桂林市",
        },
        {
          prov: "广西",
          label: "梧州市",
        },
        {
          prov: "广西",
          label: "北海市",
        },
        {
          prov: "广西",
          label: "防城港市",
        },
        {
          prov: "广西",
          label: "钦州市",
        },
        {
          prov: "广西",
          label: "贵港市",
        },
        {
          prov: "广西",
          label: "玉林市",
        },
        {
          prov: "广西",
          label: "百色市",
        },
        {
          prov: "广西",
          label: "贺州市",
        },
        {
          prov: "广西",
          label: "河池市",
        },
        {
          prov: "广西",
          label: "来宾市",
        },
        {
          prov: "广西",
          label: "崇左市",
        },
        {
          prov: "海南",
          label: "海口市",
        },
        {
          prov: "海南",
          label: "三亚市",
        },
        {
          prov: "海南",
          label: "三沙市",
        },
        {
          prov: "海南",
          label: "省直辖县级行政区划",
        },
        {
          prov: "海南",
          label: "五指山市",
        },
        {
          prov: "海南",
          label: "琼海市",
        },
        {
          prov: "海南",
          label: "儋州市",
        },
        {
          prov: "海南",
          label: "文昌市",
        },
        {
          prov: "海南",
          label: "万宁市",
        },
        {
          prov: "海南",
          label: "东方市",
        },
        {
          prov: "海南",
          label: "定安县",
        },
        {
          prov: "海南",
          label: "屯昌县",
        },
        {
          prov: "海南",
          label: "澄迈县",
        },
        {
          prov: "海南",
          label: "临高县",
        },
        {
          prov: "海南",
          label: "白沙黎族自治县",
        },
        {
          prov: "海南",
          label: "昌江黎族自治县",
        },
        {
          prov: "海南",
          label: "乐东黎族自治县",
        },
        {
          prov: "海南",
          label: "陵水黎族自治县",
        },
        {
          prov: "海南",
          label: "保亭黎族苗族自治县",
        },
        {
          prov: "海南",
          label: "琼中黎族苗族自治县",
        },
        {
          prov: "重庆",
          label: "重庆市",
        },
        {
          prov: "四川",
          label: "成都市",
        },
        {
          prov: "四川",
          label: "自贡市",
        },
        {
          prov: "四川",
          label: "攀枝花市",
        },
        {
          prov: "四川",
          label: "泸州市",
        },
        {
          prov: "四川",
          label: "德阳市",
        },
        {
          prov: "四川",
          label: "绵阳市",
        },
        {
          prov: "四川",
          label: "广元市",
        },
        {
          prov: "四川",
          label: "遂宁市",
        },
        {
          prov: "四川",
          label: "内江市",
        },
        {
          prov: "四川",
          label: "乐山市",
        },
        {
          prov: "四川",
          label: "南充市",
        },
        {
          prov: "四川",
          label: "眉山市",
        },
        {
          prov: "四川",
          label: "宜宾市",
        },
        {
          prov: "四川",
          label: "广安市",
        },
        {
          prov: "四川",
          label: "达州市",
        },
        {
          prov: "四川",
          label: "雅安市",
        },
        {
          prov: "四川",
          label: "巴中市",
        },
        {
          prov: "四川",
          label: "资阳市",
        },
        {
          prov: "四川",
          label: "阿坝藏族羌族自治州",
        },
        {
          prov: "四川",
          label: "甘孜藏族自治州",
        },
        {
          prov: "四川",
          label: "凉山彝族自治州",
        },
        {
          prov: "贵州",
          label: "贵阳市",
        },
        {
          prov: "贵州",
          label: "六盘水市",
        },
        {
          prov: "贵州",
          label: "遵义市",
        },
        {
          prov: "贵州",
          label: "安顺市",
        },
        {
          prov: "贵州",
          label: "毕节市",
        },
        {
          prov: "贵州",
          label: "铜仁市",
        },
        {
          prov: "贵州",
          label: "黔西南布依族苗族自治州",
        },
        {
          prov: "贵州",
          label: "黔东南苗族侗族自治州",
        },
        {
          prov: "贵州",
          label: "黔南布依族苗族自治州",
        },
        {
          prov: "云南",
          label: "昆明市",
        },
        {
          prov: "云南",
          label: "曲靖市",
        },
        {
          prov: "云南",
          label: "玉溪市",
        },
        {
          prov: "云南",
          label: "保山市",
        },
        {
          prov: "云南",
          label: "昭通市",
        },
        {
          prov: "云南",
          label: "丽江市",
        },
        {
          prov: "云南",
          label: "普洱市",
        },
        {
          prov: "云南",
          label: "临沧市",
        },
        {
          prov: "云南",
          label: "楚雄彝族自治州",
        },
        {
          prov: "云南",
          label: "红河哈尼族彝族自治州",
        },
        {
          prov: "云南",
          label: "文山壮族苗族自治州",
        },
        {
          prov: "云南",
          label: "西双版纳傣族自治州",
        },
        {
          prov: "云南",
          label: "大理白族自治州",
        },
        {
          prov: "云南",
          label: "德宏傣族景颇族自治州",
        },
        {
          prov: "云南",
          label: "怒江傈僳族自治州",
        },
        {
          prov: "云南",
          label: "迪庆藏族自治州",
        },
        {
          prov: "西藏",
          label: "拉萨市",
        },
        {
          prov: "西藏",
          label: "昌都地区",
        },
        {
          prov: "西藏",
          label: "山南地区",
        },
        {
          prov: "西藏",
          label: "日喀则地区",
        },
        {
          prov: "西藏",
          label: "那曲地区",
        },
        {
          prov: "西藏",
          label: "阿里地区",
        },
        {
          prov: "西藏",
          label: "林芝地区",
        },
        {
          prov: "陕西",
          label: "西安市",
        },
        {
          prov: "陕西",
          label: "铜川市",
        },
        {
          prov: "陕西",
          label: "宝鸡市",
        },
        {
          prov: "陕西",
          label: "咸阳市",
        },
        {
          prov: "陕西",
          label: "渭南市",
        },
        {
          prov: "陕西",
          label: "延安市",
        },
        {
          prov: "陕西",
          label: "汉中市",
        },
        {
          prov: "陕西",
          label: "榆林市",
        },
        {
          prov: "陕西",
          label: "安康市",
        },
        {
          prov: "陕西",
          label: "商洛市",
        },
        {
          prov: "甘肃",
          label: "兰州市",
        },
        {
          prov: "甘肃",
          label: "嘉峪关市",
        },
        {
          prov: "甘肃",
          label: "金昌市",
        },
        {
          prov: "甘肃",
          label: "白银市",
        },
        {
          prov: "甘肃",
          label: "天水市",
        },
        {
          prov: "甘肃",
          label: "武威市",
        },
        {
          prov: "甘肃",
          label: "张掖市",
        },
        {
          prov: "甘肃",
          label: "平凉市",
        },
        {
          prov: "甘肃",
          label: "酒泉市",
        },
        {
          prov: "甘肃",
          label: "庆阳市",
        },
        {
          prov: "甘肃",
          label: "定西市",
        },
        {
          prov: "甘肃",
          label: "陇南市",
        },
        {
          prov: "甘肃",
          label: "临夏回族自治州",
        },
        {
          prov: "甘肃",
          label: "甘南藏族自治州",
        },
        {
          prov: "青海",
          label: "西宁市",
        },
        {
          prov: "青海",
          label: "海东市",
        },
        {
          prov: "青海",
          label: "海北藏族自治州",
        },
        {
          prov: "青海",
          label: "黄南藏族自治州",
        },
        {
          prov: "青海",
          label: "海南藏族自治州",
        },
        {
          prov: "青海",
          label: "果洛藏族自治州",
        },
        {
          prov: "青海",
          label: "玉树藏族自治州",
        },
        {
          prov: "青海",
          label: "海西蒙古族藏族自治州",
        },
        {
          prov: "宁夏",
          label: "银川市",
        },
        {
          prov: "宁夏",
          label: "石嘴山市",
        },
        {
          prov: "宁夏",
          label: "吴忠市",
        },
        {
          prov: "宁夏",
          label: "固原市",
        },
        {
          prov: "宁夏",
          label: "中卫市",
        },
        {
          prov: "新疆",
          label: "乌鲁木齐市",
        },
        {
          prov: "新疆",
          label: "克拉玛依市",
        },
        {
          prov: "新疆",
          label: "吐鲁番地区",
        },
        {
          prov: "新疆",
          label: "哈密地区",
        },
        {
          prov: "新疆",
          label: "昌吉回族自治州",
        },
        {
          prov: "新疆",
          label: "博尔塔拉蒙古自治州",
        },
        {
          prov: "新疆",
          label: "巴音郭楞蒙古自治州",
        },
        {
          prov: "新疆",
          label: "阿克苏地区",
        },
        {
          prov: "新疆",
          label: "克孜勒苏柯尔克孜自治州",
        },
        {
          prov: "新疆",
          label: "喀什地区",
        },
        {
          prov: "新疆",
          label: "和田地区",
        },
        {
          prov: "新疆",
          label: "伊犁哈萨克自治州",
        },
        {
          prov: "新疆",
          label: "塔城地区",
        },
        {
          prov: "新疆",
          label: "阿勒泰地区",
        },
        {
          prov: "新疆",
          label: "自治区直辖县级行政区划",
        },
        {
          prov: "新疆",
          label: "石河子市",
        },
        {
          prov: "新疆",
          label: "阿拉尔市",
        },
        {
          prov: "新疆",
          label: "图木舒克市",
        },
        {
          prov: "新疆",
          label: "五家渠市",
        },
        {
          prov: "中国台湾",
          label: "台北市",
        },
        {
          prov: "中国台湾",
          label: "高雄市",
        },
        {
          prov: "中国台湾",
          label: "基隆市",
        },
        {
          prov: "中国台湾",
          label: "台中市",
        },
        {
          prov: "中国台湾",
          label: "台南市",
        },
        {
          prov: "中国台湾",
          label: "新竹市",
        },
        {
          prov: "中国台湾",
          label: "嘉义市",
        },
        {
          prov: "中国台湾",
          label: "省直辖",
        },
        {
          prov: "香港",
          label: "香港岛",
        },
        {
          prov: "香港",
          label: "九龙",
        },
        {
          prov: "香港",
          label: "新界",
        },
        {
          prov: "澳门",
          label: "花地玛堂区",
        },
        {
          prov: "澳门",
          label: "圣安多尼堂区",
        },
        {
          prov: "澳门",
          label: "大堂区",
        },
        {
          prov: "澳门",
          label: "望德堂区",
        },
        {
          prov: "澳门",
          label: "风顺堂区",
        },
        {
          prov: "澳门",
          label: "氹仔",
        },
        {
          prov: "澳门",
          label: "路环",
        },
      ];
    });

    watch(userInfo, () => {
      profile.nickName = userInfo.value.nickName;
      profile.gender = userInfo.value.gender;
      profile.birthday = userInfo.value.birthday;
      profile.email = userInfo.value.email;
      profile.phone = userInfo.value.phone;
      if (userInfo.value.region) {
        profile.province = userInfo.value.region.split(" ")[0];
        profile.city = userInfo.value.region.split(" ")[1];
        selectCityList.value = cityList.value.filter(
          (city) => city.prov == profile.province
        );
      }
      profile.introduction = userInfo.value.introduction;
    });

    return {
      user,
      profile,
      provinceList,
      selectCityList,
      showCities,
      updateUserInfo,
    };
  },
};
</script>

<style scoped>
.modal-title {
  font-weight: 600;
}
.nav-link {
  font-size: 16px;
}
.form-group {
  margin-bottom: 0.6rem;
}
.col-form-label {
  font-size: 15px;
  padding-left: 1;
}
.tab-content {
  padding-top: 10px;
}
.custom-file{
  font-size: 14px;
}
.gender {
  height: 25px;
  padding-top: 3px;
  padding-left: 2px;
}
input[type="radio"] + label::before {
  content: "";
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  box-sizing: border-box;
  border-radius: 50%;
  margin-bottom: 4px;
  border: 1px solid #ced4da;
}
input[type="radio"]:checked + label::before {
  background-color: #178fe6;
  background-clip: content-box;
  padding: 5px;
}
input[type="radio"] + label {
  font-size: 14px;
  margin-right: 30px;
}
body.dark input[type="date"],
body.dark select {
  background-color: #293145;
  color: rgba(255, 255, 255, 0.7);
  border-color: #424a5e;
}
.region {
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 14px;
  line-height: 25px;
  padding: 0.375rem 0.75rem;
}
.prov {
  width: 40%;
}
.city {
  width: 60%;
}
.alert-info{
  font-size: 14px;
}
.introduction {
  height: 200px;
  font-size: 16px;
}
</style>