<template>
  <ld-page>
    <ld-header></ld-header>

    <ld-content :height="1200" style="margin-top: 0px;">
      <div class="header-content">
        认证中心
      </div>

      <div class="main-content">
        <div class="verity-title">
          企业认证
        </div>
        <div class="form-item">
          <div class="item-title">
            上传企业证照
          </div>
          <div class="item-content">
            <table class="data-list">
              <tr class="company-card">
                <th><i class="red_ico">*</i>营业执照上传</th>
                <td>
                  <el-upload
                          class="avatar-uploader"
                          :action="company_card_upload_url"
                          :show-file-list="false"
                          name="business_license_image"
                          :headers="upload_header"
                          :data="upload_data"
                          :on-success="handleCompanyOcrSuccess"
                          :before-upload="beforeAvatarUpload">
                    <img v-if="cert_img_url" :src="cert_img_url" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <p>点击添加图片</p>
                  </el-upload>
                  <p class="img-lint">支持jpg,jpeg,png格式</p>
                </td>
              </tr>
              <tr class="user-card-info">
                <th><i class="red_ico">*</i>法人代表身份证上传</th>
                <td>
                  <el-upload
                          class="avatar-uploader"
                          :action="upload_pic_url"
                          :show-file-list="false"
                          name="pic"
                          :headers="upload_header"
                          :data="upload_data"
                          :on-success="uploadFrontCardSuccess"
                          :before-upload="beforeAvatarUpload">
                    <img v-if="id_front_url" :src="id_front_url" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <p>点击添加图片</p>
                  </el-upload>
                  <p class="img-lint">支持jpg,jpeg,png格式</p>
                  <div class="img-title">人像面</div>
                </td>
                <td>
                  <el-upload
                          class="avatar-uploader"
                          :action="upload_pic_url"
                          :show-file-list="false"
                          :headers="upload_header"
                          :data="upload_data"
                          name="pic"
                          :on-success="uploadBackCardSuccess"
                          :before-upload="beforeAvatarUpload">
                    <img v-if="id_back_url" :src="id_back_url" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <p>点击添加图片</p>
                  </el-upload>
                  <p class="img-lint">支持jpg,jpeg,png格式</p>
                  <div class="img-title">国徽面</div>
                </td>
              </tr>
            </table>
          </div>

          <div class="item-title" style="margin-top: 45px;">
            确认企业信息
          </div>
          <div class="item-content">
            <table class="data-list">
              <tr class="company-info">
                <th>企业名称</th>
                <td>
                  <template v-if="company_fix_1">
                    {{company_name}}<a @click="toggle(1)">修改</a>
                  </template>
                  <template v-else>
                    <el-input placeholder="请输入企业名称" v-model="company_name"/>
                  </template>
                </td>
              </tr>

              <tr class="company-info">
                <th>注册号</th>
                <td>
                  <template v-if="company_fix_2">
                    {{company_reg_number}}<a @click="toggle(2)">修改</a>
                  </template>
                  <template v-else>
                    <el-input placeholder="请输入企业注册号" v-model="company_reg_number"/>
                  </template>
                </td>
              </tr>

              <tr class="company-info">
                <th>法人代表姓名</th>
                <td>
                  <template v-if="company_fix_3">
                    {{company_user_name}}<a @click="toggle(3)">修改</a>
                  </template>
                  <template v-else>
                    <el-input placeholder="请输入法人代表姓名" v-model="company_user_name"/>
                  </template>
                </td>
              </tr>

              <tr class="company-info">
                <th>法人代表身份证号</th>
                <td>
                  <template v-if="company_fix_4">
                    {{company_id_card}}<a @click="toggle(4)">修改</a>
                  </template>
                  <template v-else>
                    <el-input placeholder="请输入法人代表身份证号" v-model="company_id_card"/>
                  </template>
                </td>
              </tr>
            </table>
          </div>

          <div class="item-title" style="margin-top: 85px;">
            手机认证
          </div>
          <div class="item-content">
            <table class="data-list">
              <tr class="user-info">
                <th><i class="red_ico">*</i>手机号码</th>
                <td>
                  <el-input placeholder="请输入手机号码" v-model="mobile"/>
                </td>
              </tr>

              <tr class="user-info">
                <th>图片验证码</th>
                <td>
                  <el-input placeholder="请输入图片验证码" v-model="vcode">
                    <template slot="append"><div class="ld-vcode" style="width:50px;height:28px;"><img style="width:100%;height:100%;" @click="genNewVcode" :src="vcodeimg"/></div></template>
                  </el-input>
                </td>
              </tr>

              <tr class="user-info">
                <th>短信验证码</th>
                <td>
                  <el-input placeholder="请输入短信验证码" v-model="sms_code">
                    <template slot="append"><span style="color: #3f96f4; cursor:pointer;" @click="getSmsCode">获取验证码</span></template>
                  </el-input>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div style="margin-top: 60px; text-align: center;">
          <a class="ld-btn ld-btn-primary" @click="onSubmit">提交</a>
        </div>
      </div>
    </ld-content>
    <ld-footer></ld-footer>
  </ld-page>
</template>

<script>
    import {LdContent} from '../../../components/content'
    import LdPage from '../../../components/page'
    import LdHeader from '../../../components/header'
    import LdFooter from '../../../components/footer'
    import company from '../../../services/company'
    import vcode from '../../../services/vcode'
    import sms from '../../../services/sms'
    import {apis,baseUrl} from '../../../config/api'
    import localDb from '../../../db'

    export default {
        components: {
            LdContent,
            LdPage,
            LdHeader,
            LdFooter,
        },
        data () {
            return {
                //公司营业执照路径
                cert_img_url: '',
                id_front_url: '',
                id_back_url: '',

                //验证码相关
                sms_code: '',
                vcodeimg: '',
                vcode: '',
                mobile: '',

                //认证标识
                company_fix_1: 0,
                company_fix_2: 0,
                company_fix_3: 0,
                company_fix_4: 0,

                //企业四要素
                company_name:'',
                company_reg_number:'',
                company_user_name:'',
                company_id_card:'',

                //上传图片的路径
                upload_pic_url:'',
                //公司营业执照上传路径
                company_card_upload_url:'',

                //上传时携带的头部和data
                upload_header:{'session-id':''},
                upload_data:{'csrf-token':''},

                userinfo: [],
                companyId: 1,
            };
        },

        mounted () {
            //获取图片验证码
            this.genNewVcode()
            //上传图片相关
            this.company_card_upload_url = baseUrl + 'company/business-license-ocr'
            let sessionId = localDb.get('session-id')
            this.upload_header['session-id'] = sessionId
            let _csrf_token = localDb.get('csrf-token')
            this.upload_data['csrf-token'] = _csrf_token

            this.upload_pic_url = baseUrl + 'general/pics'

            this.userinfo = localDb.get('userinfo')
            if(!this.userinfo){
                this.$router.push({path: '/login'})
            }
            if(this.userinfo){
                if(this.userinfo.has_company){
                    this.companyId = this.userinfo.company_info.c_id
                }
            }else{
                this.$router.push({path: '/login'})
            }
        },

        methods: {
            handleCompanyOcrSuccess(res, file) {
                if(res.retCode){
                    this.$message(res.errMsg)
                }else{
                    this.company_name = res.data.company_name
                    this.company_reg_number = res.data.reg_code
                    this.company_user_name = res.data.legal_person
                    this.company_fix_1 = 1
                    this.company_fix_2 = 1
                    this.company_fix_3 = 1
                    this.cert_img_url = res.data.cert_img_url
                    this.$message('企业营业执照识别成功')
                }
            },
            uploadFrontCardSuccess(res, file) {
                if(res.retCode){
                    this.$message(res.errMsg)
                }else{

                    this.id_front_url = res.data.file_path
                    if(this.id_back_url){
                        this.companyUserCardOcr()
                    }
                }
            },
            uploadBackCardSuccess(res, file) {
                if(res.retCode){
                    this.$message(res.errMsg)
                }else{
                    this.id_back_url = res.data.file_path
                    if(this.id_front_url){
                        this.companyUserCardOcr()
                    }
                }
            },
            companyUserCardOcr(){
                let that = this
                company.cardocr({identity_image: that.id_front_url, identity_back_image: that.id_back_url}).then(function (res){
                    if(that.retCode){
                        this.$message(res.errMsg)
                    }else{
                        that.company_id_card = res.data.id_card_num
                        that.company_fix_4 = 1
                        that.$message('身份证识别成功');
                    }
                }).catch(function (err) {
                    console.log('短信发送失败', err)
                })
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt20M = file.size / 1024 / 1024 < 20;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!')
                }
                if (!isLt20M) {
                    this.$message.error('上传头像图片大小不能超过 20MB!')
                }
                return isJPG && isLt20M
            },
            getSmsCode(){
                if(!this.mobile){
                    this.$message('请输入手机号');
                    return
                }
                if(!this.vcode){
                    this.$message('请输入图片验证码结果');
                    return
                }

                let that = this
                sms.vcode({phone: this.mobile, cap_id: that.cap_id, cap_input: this.vcode,scenario:3}).then(function (res){
                    if(res.retCode){
                        that.$message(res.errMsg)
                    }else{
                        //TODO 防止重复发送短信
                        that.$message('短信验证码发送成功');
                    }
                }).catch(function (err) {
                    console.log('短信发送失败', err)
                })
            },

            genNewVcode(){
                let that = this
                vcode.gen({scenario: 'register'}).then(function (res) {
                    if(res.data.cap_id){
                        that.cap_id = res.data.cap_id
                        that.vcodeimg = apis.vcode.load(res.data.cap_id)
                    }else{
                        that.$message(res.errMsg)
                    }
                }).catch(function (err) {
                    console.log('获取验证码服务请求异常', err)
                })
            },

            toggle(index){
                switch (index){
                    case 1:
                        this.company_fix_1 = !this.company_fix_1
                        break;
                    case 2:
                        this.company_fix_2 = !this.company_fix_2
                        break;
                    case 3:
                        this.company_fix_3 = !this.company_fix_3
                        break;
                    case 4:
                        this.company_fix_4 = !this.company_fix_4
                        break;
                    default:
                        break;
                }
            },

            onSubmit(){
                if(!this.cert_img_url){
                    this.$message('请上传营业执照')
                    return
                }
                if(!this.id_front_url || !this.id_back_url){
                    this.$message('请上传身份证正反面照片')
                    return
                }
                if(!this.company_name || !this.company_reg_number || !this.company_user_name || !this.company_id_card){
                    this.$message('企业信息不完整，请重新识别或者手动填入')
                    return
                }
                if(!this.mobile){
                    this.$message('请输入手机号');
                    return
                }
                if(!this.sms_code){
                    this.$message('请输入短信验证码');
                    return
                }

                let params = {
                    company_id: this.companyId,
                    company_name: this.company_name,
                    identity: this.company_reg_number,
                    legal_person: this.company_user_name,
                    legal_person_identity: this.company_id_card,
                    phone: this.mobile,
                    code: this.sms_code
                }
                let that = this
                company.verify(params).then(function (res) {
                    if(res.retCode){
                        that.$message(res.errMsg)
                    }else{
                        localDb.set('refresh_user', 1)//需要更新用户信息
                        that.$router.push({path: '/usercenter'})
                    }
                }).catch(function (err) {
                    console.log('公司认证接口请求异常', err)
                })
            }
        }
    }
</script>

<style lang="less">
  @import '../../../components/variables.less';
  @import '../../../components/mixins.less';

  .header-content{
    height: 68px;
    line-height: 68px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    background-color: @color-blue3;
  }

  .main-content{
    text-align: center;
    .verity-title{
      color: @color-blue;
      margin: 40px auto;
    }
    .form-item{
      margin-left: 226px;
      width: 894px;
      .item-title{
        font-size: 16px;
        text-align: left;
        margin-bottom: 50px;
      }
      .item-content{
        font-size: 14px;
        th{
          width: 170px;
          padding-right: 10px;
          font-weight: normal;
          text-align: right;
        }
        .red_ico{
          color: red;
          margin-right: 5px;
        }
        .data-list{
          tr{
            margin-bottom: 30px;
          }
          td{
            float: left;
          }
          .el-input{
            width: 320px;
            .el-input__inner{
              height: 30px;
            }
          }
          //上传图片的样式
          .avatar-uploader {
            .el-upload {
              border: 1px dashed #d9d9d9;
              border-radius: 6px;
              width: 176px;
              height: 108px;
              font-size: 12px;
              cursor: pointer;
              overflow: hidden;
              text-align: center;
              &hover {
                border-color: #409EFF;
              }
              .avatar-uploader-icon {
                margin-top: 30px;
                margin-bottom: 10px;
                font-size: 24px;
                color: #8c939d;
              }
              p {
                font-size: 12px;
              }
              img{
                width: auto;
                height: 100%;
              }
            }
          }
          .img-lint{
            font-size: 12px;
            color: #94979a;
            margin-top: 10px;
            margin-bottom: 10px;
            text-align: left;
          }
          .company-card{
            .avatar-uploader {
              .el-upload {
                width: 300px;
                height: 80px;
                .avatar-uploader-icon {
                  margin-top: 16px;
                }
              }
            }
          }
          .user-card-info{
            td{
              &+td{
                margin-left: 20px;
              }
            }
          }
          .company-info{
            font-size: 14px;
            margin-bottom: 20px;
            color: #52575D;
            line-height: 40px;
            td{
              color: #272E35;
            }
            a{
              color: #0074f1;
              margin-left: 20px;
              cursor: pointer;
            }
          }
          .user-info{
            font-size: 14px;
            color: #52575D;
            line-height: 40px;
          }
        }
      }
    }
  }

</style>
