import { Vue, Component, Ref, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { userUpPass } from '@/network/account'
import { Message } from 'view-design'
import { toAccountSystem } from '@/utils/index'

const formInline = {
  oldPass: '',
  newPass: '',
  confirmPass: ''
}

@Component({})
export default class FindPassword extends Vue {
  get changePwdModalStatus() {
    return UserModule.changePwdModalStatus
  }

  set changePwdModalStatus(v) {
    UserModule.setChangePwdModalStatus(v)
  }

  @Watch('changePwdModalStatus')
  changePwdModalStatusChange(v: boolean) {
    if (!v && this.formInlineEl) {
      this.formInlineEl.resetFields()
    }
  }

  @Ref('formInline') public formInlineEl!: any

  public loading = false

  public formInline = formInline

  public ruleInline = {
    oldPass: [
      { required: true, message: '请输入旧密码', trigger: 'blur' }
    ],
    newPass: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { type: 'string', min: 6, message: '登录密码不能少于6位', trigger: 'blur' }
    ],
    confirmPass: [
      { validator: this.confirmPassValidtor, trigger: 'blur' }
    ]
  }

  public confirmPassValidtor(rule: any, value: string, callback: (p?: any) => void) {
    if (value === '') {
      callback(new Error('请输入确认密码'))
    } else if (value.length < 6) {
      callback(new Error('确认密码不能少于6位!'))
    } else if (value !== this.formInline.newPass) {
      callback(new Error('请重复确认密码'))
    } else {
      callback()
    }
  }

  public onOkHandle() {
    this.formInlineEl.validate((valid: boolean) => {
      if (valid) {
        const { oldPass, newPass, confirmPass } = this.formInline
        const { loading } = this
        if (loading) { return }
        this.loading = true
        userUpPass(oldPass, newPass, confirmPass).then(() => {
          this.loading = false
          Message.success('密码修改成功, 将重新登录！')
          UserModule.setChangePwdModalStatus(false)
          setTimeout(() => {
            UserModule.setLogout().then(() => {
              toAccountSystem()
              // this.$router.push({ path: '/account/login' })
            })
          }, 400)
        }).catch(() => {
          UserModule.setChangePwdModalStatus(false)
          this.loading = false
        })
      }
    })
  }
}
