
<!--
 * @Author: your name
 * @Date: 2020-07-13 15:00:46
 * @LastEditTime: 2022-12-08 17:06:36
 * @LastEditors: zengqin 1058574586@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_unit\src\views\partyA\partyAInformation\partyAInformationEdit.vue
-->
<template>
  <div class='page-edit'>
    <div class='roleCons'>
      <!-- 企业基本信息 -->
      <g-edit-title :title="getEditTitle()" :titleTips="titleTips">
        <div v-if="!isCustomButton">
          <!-- <el-button v-if="initFormShow" class="other" type="primary" @click="handlePrintPage" icon="el-icon-printer"
              size="small">
              打印页面结构
          </el-button> -->
          <el-button size='small' type='primary' icon='el-icon-plus'
            @click='handleAddLanguageInit'
            v-if="initFormShow">
            初始化页面翻译
          </el-button>
          <!-- 流程监控 -->
          <el-button class="other" type="primary" v-if='(type !== "add" && type !== "edit" && isHasProcess)' @click="sysHandleMonitorProcess"
            icon="el-icon-aim" size="small">
            {{isMatter ? $t('button.stepMonitorProcess') : $t('button.monitorProcess')}}
          </el-button>
          <!-- 初始化表单 -->
          <!-- <el-button class="other" v-if="initFormShow" type="primary" @click="initForm" icon="el-icon-share"
            size="small">
            {{$t('button.initForm')}}
          </el-button> -->
          <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small"
            @click="handleClose">{{$t('button.close')}}
          </el-button>
          <el-button v-if="isSave"
            :disabled="(($route.name === 'processApprovalPage' || $route.name === 'sceneProcessApprovalPage') && type === 'undo') ? false : !pageDisabled"
            size="small" type="primary" icon="el-icon-circle-check" @click="handleSave"
            v-fast-click>{{$t('button.saveData')}}
          </el-button>
          <el-button v-if="isSave && isHasProcess && authButtonList.indexOf('startProcess') >= 0"
            :disabled="!pageDisabled" size="small" type="primary" icon="el-icon-upload2" @click="sysHandleStartProcess"
            v-fast-click class="other">
            {{isMatter ? $t('button.stepStartProcess') : $t('button.startProcess')}}
          </el-button>
          <!-- 打印 -->
          <el-button class="other" type="primary" @click="sysHandlePrint" icon="el-icon-printer" size="small"
            v-if="authButtonList.indexOf('print') >= 0 && isPrint">
            {{$t('button.print')}}
          </el-button>
          <slot name="editHeadButton" :pageDisabled='pageDisabled'></slot>
        </div>
        <div v-else>
          <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small"
            @click="handleClose">{{$t('button.close')}}
          </el-button>
          <el-button v-if="isSave"
            :disabled="(($route.name === 'processApprovalPage' || $route.name === 'sceneProcessApprovalPage') && type === 'undo') ? false : !pageDisabled"
            size="small" type="primary" icon="el-icon-circle-check" @click="handleSave"
            v-fast-click>{{$t(isCustomButtonName)}}
          </el-button>
          <slot name="editHeadButton" :pageDisabled='pageDisabled'></slot>
        </div>
      </g-edit-title>
      <div class='content'>
        <div class='cons'>
          <div></div>
          <slot class="edit-page-slot" name="editPage" :pageDisabled='pageDisabled'></slot>
        </div>
      </div>
    </div>

    <!-- 流程审批弹出框 -->
    <el-dialog v-dialogDrag :title="`${$t(`menu.${$route.params.translateName}`)} ${$t('tips.processSubmission')}`"
      v-if="dialogProcess" :top="processName==='sendProcess'?'10vh':'25vh'" @close="handleCloseDialog"
      :width="processName==='sendProcess'?'600px':'400px'" center :visible.sync="dialogProcess">
      <component @closeDialog="handleCloseDialog" :is="processName" :startForm="sendProcessForm"
        :processSubmitApi="processParmas">
      </component>
    </el-dialog>
  </div>
</template>
<script>
import { closeRoute } from 'mixins/index';
import config from 'util';

export default {
  name: 'editPage',
  mixins: [closeRoute],
  components: {
    // 提交流程
    sendProcess (resolve) {
      require(['components/basicComponents/process/sendProcess'], resolve);
    },
    // 无流程时提交弹出框
    noProcess (resolve) {
      require(['components/basicComponents/process/noProcess.vue'], resolve);
    }
  },
  data () {
    return {
      config,
      pageDisabled: false,
      isProcess: false,
      translateName: '',
      authButtonList: [],
      processName: '',
      sendProcessForm: {},
      dialogProcess: false,
      // 流程提交
      processParmas: {},
      initFormShow: false,
      isPrint: false,
      sharePageShow: false,
      sharePageLink: '',
      taskDetailId: '',
      infoId: ''
    };
  },
  props: {
    isSave: {
      default: true
    },
    isHasProcess: {
      default: true
    },
    customTitle: {
      default: ''
    },
    titleTips: {
      default: ''
    },
    // 是否是自定义按钮
    isCustomButton: {
      default: false
    },
    isCustomButtonName: {
      default: 'button.saveData'
    },
    // 是否为事项流程
    isMatter: {
      default: false
    }
  },
  created () {
    this.authButtonList = this.$route.meta.authButtonList && this.$route.meta.authButtonList.map(v => v.resUrl);
    this.initFormShow = window.location.href.indexOf('http://localhost') !== -1;
    const type = this.$base64.decode(this.$route.params.type);
    const translateType = type === 'info' ? 'detailsInfo' : type;
    this.type = translateType;
    if (this.$route.name === 'processApprovalPage' || this.$route.name === 'sceneProcessApprovalPage') {
      this.translateName = this.$route.params.translateName;
      this.taskDetailId = Number(this.$base64.decode(this.$route.params.taskDetailId));
      this.isProcess = true;
      this.isPrint = true;
    } else {
      this.id = Number(this.$base64.decode(this.$route.params.id));
      this.infoId = this.id;
      this.translateName = this.$route.params.translateName;
      this.authButtonList = this.$route.meta.authButtonList && this.$route.meta.authButtonList.map(v => v.resUrl);
    }
    this.pageStatus();
  },
  methods: {
    getEditTitle () {
      if (this.customTitle) return this.$t(this.customTitle);
      if (this.isProcess) return `${this.$t(`menu.${this.translateName}`)}`;
      return `${this.$t(`menu.${this.translateName}`)}${this.$t(`button.${this.type}`)}`;
    },
    // 页面状态
    pageStatus () {
      if (this.customTitle) {
        this.pageDisabled = false;
        return;
      }
      this.pageDisabled = (this.type === 'add' || this.type === 'edit' || this.type === 'renew' || this.type === 'order');
    },
    // 分享页面的按钮状态
    sharePageStatus () {
      if (this.type !== 'add' && (this.infoId || this.taskDetailId)) {
        return true;
      }
      return false;
    },
    // 取消保存
    handleClose () {
      this.$emit('editEvent', { eventName: 'close', editPage: this });
    },
    // 保存
    handleSave () {
      this.$emit('editEvent', { eventName: 'save', editPage: this });
    },
    // 提交流程
    sysHandleStartProcess () {
      this.$emit('editEvent', { eventName: 'startProcess', editPage: this });
    },
    // 初始化表单
    initForm () {
      this.$emit('editEvent', { eventName: 'initForm', editPage: this });
    },
    // 开始流程提交
    handleStartProcess ({ data, id, processParmas }) {
      this.processParmas = processParmas;
      // // 获取开始流程信息
      const startInfo = processParmas.startInfo;
      const nextParmas = {};
      if (startInfo.parmasList && startInfo.parmasList.length) {
        for (const item of startInfo.parmasList) {
          nextParmas[item.receive] = data[item.value] || '';
        }
      } else {
        nextParmas[startInfo.parmas] = id || '';
      }
      startInfo.formCode && this.$set(nextParmas, 'formCode', startInfo.formCode);
      this.$store.dispatch(startInfo.url, nextParmas).then(res => {
        this.sendProcessForm = res.results;
        if (this.sendProcessForm.workflowNextNodes === null) {
          this.processName = 'noProcess';
        } else {
          this.processName = 'sendProcess';
        }
        // 将当前行存储于缓存中
        localStorage.setItem('dataInfo', JSON.stringify(data));
        this.dialogProcess = true;
      });
    },
    // 关闭 流程审批弹出框
    handleCloseDialog (status) {
      if (status) {
        this.$emit('editEvent', { eventName: 'startProcessSaveSuccess', editPage: this });
      } else {
        this.$emit('editEvent', { eventName: 'startProcessSaveFail', editPage: this });
      }
      this.dialogProcess = false;
    },
    // 初始化翻译
    handleAddLanguageInit() {
        this.$emit('editEvent', { eventName: 'languageInit', editPage: this });
    },
    // 打印页面
    handlePrintPage() {
        this.$emit('editEvent', { eventName: 'logPage', editPage: this });
    },
    // 打印
    sysHandlePrint () {
      this.$emit('editEvent', { eventName: 'sysHandlePrint', editPage: this });
    },
    // 流程监控
    sysHandleMonitorProcess () {
      this.$emit('editEvent', { eventName: 'monitorProcess', editPage: this });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "components/basicComponents/styles/pageEdit.scss";
.share_page_tips {
  padding: 40px 20px;
  .footer {
    margin-top: 40px;
  }
}
</style>

