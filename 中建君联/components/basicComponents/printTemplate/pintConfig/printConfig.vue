<!--
 * @Author: your name
 * @Date: 2020-08-24 10:48:44
 * @LastEditTime: 2023-02-21 16:10:32
 * @LastEditors: zengqin 1058574586@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\printTemplate\pintConfig\printConfig.vue
-->
<template>
  <templateComponets
    :processList="processList"
    :list="list" :printMainList="printMainList"
    :form-code="formCode"
    :task-id="taskId"
    :customList="customList"
    :is-print="isPrint"
    :data-info="dataInfo"
    :data-code="dataCode"
    :DetailList="DetailList" :id="id"
    :printModelId="printModelId"
    :flowStatus='flowStatus'
    ></templateComponets>
</template>

<script>
  import templateComponets from './compoent/template';
  import {closeRoute} from 'mixins/index';
  import {printTemplate} from 'mixins/printMixins';
  import printConfigUrl from './printConfigUrl.js';

  export default {
    mixins: [closeRoute, printTemplate],
    components: {
      templateComponets
    },
    data() {
      return {
        printConfigUrl,
        DetailList: [],
        // 主表数据
        processList: [],
        // 子表数据
        list: [],
        // 自定义自表头数据
        customList: {},
        dataInfo: {},
        dataCode: '',
        // 表头
        printMainList: [
          {
            flag: true,
            defaultFlag: true,
            columnName: this.$t('print.headerDescription'),
            columnCode: 'companyFullName',
            columnValue: this.$utils.Auth.hasUserInfo().companyFullName,
            status: 0,
            sortPart: 'title'
          },
          {flag: true, defaultFlag: true, columnName: this.$t('print.documentName'), columnCode: 'title',
          sortPart: 'title',
          columnValue: this.$t(`menu.${printConfigUrl[this.formCode].translateName}`), status: 0},
          {flag: true, defaultFlag: true, columnName: this.$t('dialog.approvalRecord'), columnCode: 'approvalRecord',
          sortPart: 'title',
          columnValue: '', status: 0},
          {flag: true, defaultFlag: true, columnName: this.$t('print.logoShow'), columnCode: 'logoShow',
          sortPart: 'title',
          columnValue: '', status: 0}
        ],
        templateName: this.formCode === 'inquiryBidReport' ? 'templateMultiPrint' : 'templatePrint'
      };
    },
    props: {
        formCode: {
            type: String,
            default: ''
        },
        id: {
            default: 0
        },
        printModelId: {
            default: ''
        },
        taskId: {
            default: 0
        },
        isPrint: {
            type: Boolean,
            default: false
        },
        flowStatus: {
          type: String,
          default: ''
        }
    },
    created() {
      this.templateName = this.formCode === 'inquiryBidReport' ? 'templateMultiPrint' : 'templatePrint';
      this._setPageConfig();
    },
    methods: {
      // 挂载dome
      _setPageConfig() {
        const formConfig = this.printConfigUrl[this.formCode].printConfigUrl;
        const Page = require(`views/${formConfig}`).default;
        const page = new Page();
        this.pageConfig = page.PageConfig;
        this.dataCode = this.pageConfig.dataCode || 'docNo';
        this.handleGetInfoData(this.isPrint);
      }
    }
  };
</script>
