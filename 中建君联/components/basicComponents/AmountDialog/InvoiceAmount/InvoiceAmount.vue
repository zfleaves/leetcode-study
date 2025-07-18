<!--
 * @Author: your name
 * @Date: 2020-08-12 17:05:47
 * @LastEditTime: 2020-11-14 16:34:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\compoent\approachMultiple\approachMultiple.vue
-->
<template>
  <div style="height: 100%;">
    <query-page res="approachMultiple" :page-config="pageConfig" :loading.sync="loading"
      :tableSeleList.sync="tableSeleList" :dialogHeight="dialogHeight" @searchData="getSearchData"
      @fnName="pageConfigBtnFnName" @resetTableConfigList="pageConfigResetTableConfigList"
      @onRefresh="pageConfigOnRefresh" @pages="pageConfigPages" @dialogEvent="dialogEvent" @searchEvent="searchEvent">
      <template slot="mainTable" slot-scope="config">
        <g-query-table :config="config.scope" :tableList.sync="tableSeleList"
          @fnName="pageConfigEmitQueryTableButtonFnName">
        </g-query-table>
      </template>
    </query-page>
  </div>
</template>

<script>
import Page from './config.js';
import { search } from 'mixins/searchMixins';
import Auth from 'util/auth';

export default {
  name: 'approachMultiple',
  mixins: [search],
  data () {
    return {
      // 查询页面基础参数
      page: new Page(),
      pageConfig: {},
      loading: false,
      // =====================
      tableSeleList: [],
      // 搜索数据
      searchData: {
        belongOrgName: '',
        classifyPropertyType: '',
        contractNatureCode: '',
        docNo: '',
        flowStatus: ['02'],
        invoiceCode: '',
        invoiceContent: '',
        invoiceDateFrom: '',
        invoiceDateTo: '',
        invoiceNo: '',
        invoiceUnitName: '',
        projectId: null,
        projectIds: [],
        projectName: ''
      }
    };
  },
  async created () {
    await this._getTableDataList();
  },
  props: {
    dialogHeight: {
      type: Number,
      default: 300
    },
    // 选中
    InvoiceSelect: {
      default: () => {}
    }
  },
  methods: {
    // 获取表单
    _getTableDataList () {
      this.pageConfig.searchControls.searchData.contractId = this.InvoiceSelect.contractId;
      this.pageConfig.searchControls.searchData.projectIds = this.InvoiceSelect.projectId ? [this.InvoiceSelect.projectId] : [];
      this.pageConfig.searchControls.searchData.createTimeTo = this.InvoiceSelect.createTime;
      this.handleGetTableDataList(this.InvoiceSelect.url);
    },
    handleInfo(row, type = 'info') {
      this.$store.dispatch('publicApi/checkSubSystemMenusPublic', { subSystemCode: 'contract' }).then(res => {
        if (res.status === 0) {
            if (res.results) {
              const routeName = this.InvoiceSelect.jumpToUrl ? this.InvoiceSelect.jumpToUrl : 'contractExpendInvoice';
              const jumpUrl = `${this.$utils.config.jumpUrl}${'/contract'}/#/${routeName}`;
              // window.open(jumpUrl, '_blank');
              this.handleRouter(row, type);
            } else {
                // 您没有此子系统权限，请联系管理员授权
                this.$message.warning(this.$t('dialog.noPermission'));
            }
        } else {
            this.$message.error(this.$t('res.errorMessage'));
        }
      });
    },
    // http://121.196.105.62:8800/contract/#/contractExpendInvoiceEdit/aW5mbw==/MTA1/contractExpendInvoice
    handleRouter(row, type) {
     const translateType = type;
     type = this.$base64.encode(type);
     const id = this.$base64.encode(row.id || 0);
     const routeName = this.InvoiceSelect.jumpToUrl ? this.InvoiceSelect.jumpToUrl : 'contractExpendInvoice';
     const RouteTitleObj = { name: `${routeName}Edit`, loadRouteName: routeName, translateType };
     localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
     const jumpUrl = `${this.$utils.config.jumpUrl}${'/contract'}`;
     const jumpUrlEdit = `/#/${routeName}Edit/${type}/${id}/${routeName}`;
     window.open(`${jumpUrl}${jumpUrlEdit}`, '_blank');
     this.$emit('dialogClose', false);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
