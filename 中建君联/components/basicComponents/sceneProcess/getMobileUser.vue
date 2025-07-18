<template>
  <div class="approval">
    <el-form ref="form" class="demo-ruleForm" :model="form" :rules="rules" label-width="150px">
      <el-form-item :label="$t('dialog.userMobile')" prop="assigneeMobile">
        <el-input v-model.trim="form.assigneeMobile" size="small" maxlength="32" clearable>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('dialog.userName')" prop="surname">
        <el-input v-model.trim="form.surname" :disabled="!form.assigneeMobile" size="small" maxlength="1" clearable>
          <span class="surname" slot="suffix">{{userName}}</span>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="footer">
      <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small"
        @click="handleClose">{{$t('button.close')}}
      </el-button>
      <el-button size="small" type="primary" icon="el-icon-circle-check" @click="confirm"
        v-fast-click>{{$t('button.determine')}}
      </el-button>
    </span>
  </div>
</template>
<script>
export default {
  name: 'getMobileUser',
  data () {
    const assigneeMobileValid = (rule, value, callback) => {
      if (!value) {
        this.form.assigneeName = '';
        this.form.assigneeEmail = '';
        this.form.assigneeId = '';
        this.userName = '';
        callback(new Error(`${this.$t('tips.pleaseEnter')}${this.$t('dialog.userMobile')}`));
      } else {
        this.$store.dispatch('publicApi/getUserInfoMobile', { mobile: value }).then(res => {
          if (res.status === 0) {
            if (res.results && res.results.id) {
              this.userName = res.results.userName.slice(1, res.results.userName.length);
              this.form.assigneeName = res.results.userName;
              this.form.assigneeEmail = res.results.email;
              this.form.assigneeId = res.results.id;
              callback();
            } else {
              // 未找到用户，请核对用户手机号！
              this.form.assigneeName = '';
              this.form.assigneeEmail = '';
              this.form.assigneeId = '';
              this.userName = '';
              callback(new Error(this.$t('dialog.userMobileErrorTips')));
            }
          }
        }).catch(e => {
          // 未找到用户，请核对用户手机号！
          callback(new Error(this.$t('dialog.userMobileErrorTips')));
        });
      }
    };
    const surnameValid = (rule, value, callback) => {
      if (!value) {
        // 请输入用户姓名的第一个字
        callback(new Error(`${this.$t('dialog.surnameTips')}!`));
      } else {
        if (`${value}${this.userName}` === this.form.assigneeName) {
          callback();
        } else {
          // 手机号或者姓名不正确，请核对后正确填写！
          callback(new Error(this.$t('dialog.surnameErrorTips')));
        }
      }
    };
    return {
      // =====================
      form: {
        assigneeEmail: '',
        assigneeId: '',
        assigneeMobile: '',
        assigneeName: ''
      },
      userName: '',
      rules: {
        assigneeMobile: [{ required: true, validator: assigneeMobileValid, trigger: 'blur' }],
        surname: [{ required: true, validator: surnameValid, trigger: 'blur' }]
      }
    };
  },
  props: {
    nodeSourceCode: {
      default: ''
    }
  },
  methods: {
    // 关闭
    handleClose () {
      this.$emit('update:closeDialog', false);
    },
    // 发票核准
    confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            assigneeEmail: this.form.assigneeEmail,
            assigneeId: this.form.assigneeId,
            assigneeMobile: this.form.assigneeMobile,
            assigneeName: this.form.assigneeName,
            isChecked: true
          };
          this.$emit('getData', data);
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.approval {
  padding: 20px;
  .footer {
    margin-top: 40px;
  }
}
.surname {
  color: gray;
  margin-right: 20px;
}
</style>
