<template>
  <!-- buttonName: '', //文字
      size: 'small', //尺寸
      type: 'primary', //类型
      plain: false, //是否朴素按钮
      disabled: false, //是否禁用状态
      icon: '', //图标类名
      class: '', //类名
      style: '', //样式
      fnName: '', //函数名称 -->
  <div>
    <!-- 付款账户说明 -->
    <el-tooltip v-if="paymentAccountDescription" placement="top" style="margin: 0 8px;">
      <div slot="content" style="line-height: 24px;">
        <!-- 数据来源及维护路径：业财融合→公司账户管理； -->
        <!-- 您可以在此路径菜单中添加公司账户以供选择。 -->
        <div>
          {{$t('tips.paymentAccountDescriptionTips1')}}
        </div>
        <div>
          {{$t('tips.paymentAccountDescriptionTips2')}}
        </div>
      </div>
      <span
        class="tips-item midFont set">{{$t(isCollection ? 'tips.collectionAccountDescription' : 'tips.paymentAccountDescription')}}
        <i class="el-icon-question"></i>
      </span>
    </el-tooltip>
    <el-tooltip v-if="otherPayments" placement="top" style="margin: 0 8px;">
      <div slot="content" style="line-height: 24px;">
        <!-- 如果存在补充费用，例如运费，则填写运费金额，例如5000.00； -->
        <!-- 如果存在扣款费用，例如检测费，则填写负数的扣款金额，例如-20000.00； -->
        <div>
          {{$t('tips.otherPaymentsTips1')}}
        </div>
        <div>
          {{$t('tips.otherPaymentsTips2')}}
        </div>
      </div>
      <!-- 其他款项 -->
      <span class="tips-item midFont set">{{$t('tips.otherPaymentsAmount')}}
        <i class="el-icon-question"></i>
      </span>
    </el-tooltip>
    <slot name="first"></slot>
    <el-button v-if="deleteNum > 0" size="small" type="primary" icon="el-icon-delete" class="urgent" v-fast-click
      @click="handleFn('sysHandleDeletaBatch')">
      <span class="midFont set">({{$t('dialog.selected')}}{{deleteNum}}{{$t('dialog.individual')}})</span>
    </el-button>
    <template v-for="(parameter, index) in getButtonList(buttonListOpera)">
      <template v-if="!parameter.slot">
        <el-button v-if="!parameter.noAuth ? authButtonList.indexOf(parameter.authCode) >= 0 : true" :key="index"
          :name="parameter.code" :size="parameter.size || buttonConfig.size" :type="parameter.type || buttonConfig.type"
          :plain="parameter.plain || buttonConfig.plain"
          :disabled="(parameter.code === 'sysHandleExport' || parameter.code === 'sysHandleExportDetail') ? false: parameter.disabled"
          :icon="parameter.icon || buttonConfig.icon" :class="parameter.class || buttonConfig.class"
          :style="parameter.style || buttonConfig.style" v-fast-click @click="handleFn(parameter)">
          {{$t(parameter.name)}}
        </el-button>
      </template>
      <template v-else>
        <slot v-if="!parameter.noAuth ? authButtonList.indexOf(parameter.authCode) >= 0 : true"
          :name="`button-${parameter.code}`" :parameter="parameter" :buttonConfig='buttonConfig'></slot>
      </template>
    </template>
    <slot>
    </slot>
  </div>
</template>
<script>
export default {
  data () {
    const buttonConfig = {
      has: '',
      show: true,
      size: 'small',
      type: 'primary',
      plain: false,
      disabled: false,
      icon: '',
      class: '',
      style: '',
      isDelete: false,
      code: 'sysHandleAdd'
    };

    return {
      buttonConfig,
      deleteNum: 0,
      // 上传
      sysHandleUpload: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'el-icon-upload2',
        class: 'more',
        name: 'button.upload',
        code: 'sysHandleUpload',
        slot: false
      },
      // 添加
      sysHandleAdd: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'el-icon-plus',
        name: 'button.add',
        code: 'sysHandleAdd',
        slot: false
      },
      // 导出
      sysHandleExport: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'iconfont icon-xiazaidaoru',
        class: 'more',
        name: 'button.export',
        code: 'sysHandleExport',
        slot: false
      },
      // 导入
      sysHandleImport: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'el-icon-folder-opened',
        class: 'other',
        name: 'button.Import',
        code: 'sysHandleImport',
        slot: false
      },
      // 下载模板
      sysHandleDownloadTemplate: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'el-icon-document',
        class: 'other',
        name: 'button.downloadTemplate',
        code: 'sysHandleDownloadTemplate',
        slot: false
      },
      // 提交流程
      sysHandleStartProcess: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'el-icon-upload2',
        class: 'other',
        name: 'button.startProcess',
        code: 'sysHandleStartProcess',
        slot: false
      },
      // 流程监控
      sysHandleMonitorProcess: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'el-icon-aim',
        class: 'other',
        name: 'button.monitorProcess',
        code: 'sysHandleMonitorProcess',
        slot: false
      },
      // 场景流程提交
      sysHandleScenarioFlowSubmit: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'el-icon-upload2',
        class: 'urgent',
        name: 'button.stepStartProcess',
        code: 'sysHandleScenarioFlowSubmit',
        slot: false
      },
      // 场景流程监控
      sysHandleScenarioFlowMonitor: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'el-icon-aim',
        class: 'urgent',
        name: 'button.stepMonitorProcess',
        code: 'sysHandleScenarioFlowMonitor',
        slot: false
      },
      // 打印
      sysHandlePrint: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'el-icon-printer',
        class: 'other',
        name: 'button.print',
        code: 'sysHandlePrint',
        slot: false
      },
      // 套打
      sysHandleBatchPrint: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'el-icon-printer',
        class: 'other',
        name: 'button.batchPrint',
        code: 'sysHandleBatchPrint',
        slot: false
      },
      // 打印标签
      sysHandlePrintLabel: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'el-icon-printer',
        class: 'other',
        name: 'button.printLable',
        code: 'sysHandlePrintLabel',
        slot: false
      },
      // 取消/关闭
      sysCancelSave: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'el-icon-circle-close',
        class: 'urgent',
        name: 'button.close',
        code: 'sysCancelSave',
        slot: false
      },
      // 全部删除
      sysHandleDeleteAll: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'el-icon-delete',
        isDelete: true,
        class: 'urgent',
        name: 'button.deleteAll',
        code: 'sysHandleDeleteAll',
        slot: false
      },
      // 批量删除
      sysHandleDeletaBatch: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'el-icon-delete',
        isDelete: true,
        class: 'urgent',
        name: 'button.batchDeletion',
        code: 'sysHandleDeletaBatch',
        slot: false
      },
      // 添加明细
      sysHandleDeletaAdd: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'el-icon-plus',
        name: 'button.addDetails',
        code: 'sysHandleDeletaAdd',
        slot: false
      },
      // 选择明细
      sysHandleSelectDetail: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'el-icon-plus',
        name: 'button.selectDetails',
        code: 'sysHandleSelectDetail',
        slot: false
      },
      // 导出明细
      sysHandleExportDetail: {
        size: 'small',
        type: '',
        class: 'more',
        plain: false,
        icon: 'iconfont icon-xiazaidaoru',
        name: 'button.exportDetails',
        code: 'sysHandleExportDetail',
        slot: false
      },
      // 保存
      sysSaveData: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'el-icon-circle-check',
        class: '',
        name: 'button.save',
        code: 'sysSaveData',
        slot: false
      },
      // 重置
      sysHandleResetForm: {
        size: 'small',
        type: 'primary',
        plain: false,
        icon: 'el-icon-magic-stick',
        class: 'more',
        name: 'button.reset',
        code: 'sysHandleResetForm',
        slot: false
      },
      // 搜索
      sysHandleSearch: {
        size: 'small',
        type: '',
        plain: true,
        icon: 'el-icon-search',
        class: 'search',
        name: 'button.search',
        code: 'sysHandleSearch',
        slot: false
      },
      buttonList: [],
      buttonListOpera: [],
      // 判断页面类型是什么
      type: 'add',

      authButtonList: []
    };
  },
  props: {
    operationButtons: {
      default: () => [],
      type: Array
    },
    // 需要删除的数据个数
    deleteLength: {
      type: Number,
      default: 0
    },
    paymentAccountDescription: {
      type: Boolean,
      default: false
    },
    isCollection: {
      type: Boolean,
      default: false
    },
    otherPayments: {
      type: Boolean,
      default: false
    }
  },
  created () {
    this.authButtonList = this.$route.meta.authButtonList && this.$route.meta.authButtonList.map(v => v.resUrl);
  },
  watch: {
    deleteLength: {
      handler () {
        this.deleteNum = JSON.parse(JSON.stringify(this.deleteLength));
      },
      immediate: true
    },
    operationButtons: {
      handler () {
        this.buttonListOpera = [];
        this.type = this.$route.params.type;
        this.buttonList = JSON.parse(JSON.stringify(this.operationButtons));
        this.buttonList.forEach(item => {
          //   是否自定义按钮
          if (!item.isCustom) {
            if (this.type === 'info') {
              item.disabled = true;
            } else {
              this[item.code].disabled = item.disabled;
            }
            this[item.code].authCode = item.authCode;
            this[item.code].noAuth = item.noAuth;
            this[item.code].subTableCode = item.subTableCode;
            this[item.code].name = item.name ? item.name : this[item.code].name;
            this[item.code].slot = item.slot || false;
            this[item.code].importSubTableName = item.importSubTableName || item.subTableCode;
            this.buttonListOpera.push(this[item.code]);
          } else {
            this.$set(item, 'class', item.class || 'more');
            this.buttonListOpera.push(item);
          }
        });
      },
      immediate: true
    }
  },
  methods: {
    handleFn (parameter) {
      this.$emit('butFnName', parameter.code);
      this.$emit('editTableBut', parameter);
    },
    disabledStatus (disabled) {
      if (disabled) {
        return true;
      } else {
        return false;
      }
    },
    getButtonList (buttonListOpera) {
      const sysHandleAdd = buttonListOpera.filter(v => v.code === 'sysHandleAdd' || v.code === 'sysHandleDeletaAdd');
      const selectDetail = buttonListOpera.filter(v => v.code === 'sysHandleSelectDetail');
      const deletaBatch = buttonListOpera.filter(v => v.code === 'sysHandleDeletaBatch');
      const otherButton = buttonListOpera.filter(v => v.code !== 'sysHandleDeletaBatch' && v.code !== 'sysHandleSelectDetail' && v.code !== 'sysHandleAdd' && v.code !== 'sysHandleDeletaAdd');
      const buttonList = [];
      const list = sysHandleAdd.concat(selectDetail).concat(otherButton).concat(deletaBatch);
      for (const item of list) {
        if (!buttonList.some(v => v.code === item.code)) {
          buttonList.push(item);
        }
      }
      // return sysHandleAdd.concat(selectDetail).concat(otherButton).concat(deletaBatch);
      return buttonList;
    }
  }
};
</script>
