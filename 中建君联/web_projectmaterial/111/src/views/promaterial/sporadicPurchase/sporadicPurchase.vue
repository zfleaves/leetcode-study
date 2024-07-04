<!--
 * @Author: your name
 * @Date: 2020-07-30 10:37:35
 * @LastEditTime: 2022-07-04 11:56:52
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\sporadicPurchase\sporadicPurchase.vue
-->
<template>
  <div>
    <query-page res="sysQueryPage" :page-config="pageConfig" :loading.sync="loading" :tableSeleList.sync="tableSeleList"
      @searchData="getSearchData" @fnName="pageConfigBtnFnName" @resetTableConfigList="pageConfigResetTableConfigList"
      @onRefresh="pageConfigOnRefresh" @pages="pageConfigPages" @searchEvent="searchEvent">
      <template slot="mainTable" slot-scope="config">
        <g-query-table :config="config.scope" :tableList.sync="tableSeleList"
          @fnName="pageConfigEmitQueryTableButtonFnName">
             <template slot="table-buts" slot-scope="{scope}">
              <el-button
                class="primary"
                v-if="authButtonList.indexOf('quickInWarehouse') >= 0"
                @click.stop.prevent="sysHandleQuickInWarehouse(scope)"
                type="text" size="mini" v-fast-click>
                {{$t('sporadicPurchase.quickInWarehouse')}}
              </el-button>
            </template>
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
  name: 'sporadicPurchase',
  mixins: [search],
  data () {
    return {
      // 查询页面基础参数
      page: new Page(),
      pageConfig: {},
      loading: false,
      // =====================
      tableSeleList: [],
      partyATypeTitle: '',
      dialogVisible: false,
      // 搜索数据
      searchData: {
        docNo: '',
        flowStatus: '',
        projectName: '',
        applyUserName: '',
        applyDateFrom: '',
        applyDateTo: '',
        sporadicPurchaseReason: '',
        purchaseContent: '',
        sporadicPurchaseStatus: []
      }
    };
  },
  async created () {
    await this._getTableDataList();
  },
  methods: {
    // 获取表单
    _getTableDataList () {
      this.handleGetTableDataList('sporadicPurchase/getPageList');
    },
    // 删除
    handleDelete (row) {
      const statusConfig = {
        keyId: 'sporadicPurchaseId',
        keyName: 'projectName',
        row,
        api: 'sporadicPurchase/setDelete'
      };
      this.setDataDelete(statusConfig, row);
    },
    // 快速入库
    sysHandleQuickInWarehouse(row, type = 'add') {
      if (row.flowStatus !== '02') {
        // 流程审批完成后才可快速入库
        this.$message.error(this.$t('sporadicPurchase.flowStatusDelivery'));
        return;
      }
      if (row.id) {
        if (!this.judgeSamePerson(row)) {
          this.editError(this.$t('sporadicPurchase.quickInWarehouse'));
          return;
        }
      }
      // 此单据已经办理过快速入库，确定要再次入库吗？
      // 快速入库会跳转到材料入库页面，您确定要跳转吗
      const message = `${this.$t('sporadicPurchase.quickInWarehouseTips')}？<br><span style="color:red">${row.ifFastIncoming ? this.$t('sporadicPurchase.quickInWarehouseTips1') : ''}</span>`;
      this.$confirm(message, this.$t('sporadicPurchase.quickInWarehouse'), {
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        dangerouslyUseHTMLString: true,
        type: 'warning'
      })
      .then(() => {
        this.toInWarehouse(row, type);
      })
      .catch(() => {});
    },
    toInWarehouse(row, type) {
        const translateType = type;
        type = this.$base64.encode(type);
        const checkArrivalId = this.$base64.encode(row.id);
        const id = this.$base64.encode(row.id || 0);
        const routeName = 'warIncoming';
        const RouteTitleObj = {name: `${routeName}Edit`, loadRouteName: routeName, translateType};
        localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
        this.$router.push(`/${routeName}Edit/${type}/${id}/sporadicPurchase/${checkArrivalId}/${routeName}`);
    },
    // 增、改、查 路由跳转设置
    handleSetRouter(type, row = {}) {
      if (row.id) {
        if (!this.judgeSamePerson(row) && type === 'edit') {
          this.editError(this.$t('button.edit'));
          return;
        }
      }
      const translateType = type;
      type = this.$base64.encode(type);
      const id = this.$base64.encode(row.id || 0);
      const orderSource = this.$base64.encode('sporadicPurchase');
      const orderSourceId = this.$base64.encode(0);
      const RouteTitleObj = { name: `${this.$route.name}Edit`, loadRouteName: this.$route.name, translateType };
      localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
      this.$router.push(`/${this.$route.name}Edit/${type}/${id}/${this.$route.name}/${orderSourceId}/${orderSource}`);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
