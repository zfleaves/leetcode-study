<!--
 * @Author: your name
 * @Date: 2020-07-30 10:35:01
 * @LastEditTime: 2023-02-24 14:15:37
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\warIncoming\warIncoming.vue
-->
<template>
  <div>
    <query-page
        res="sysQueryPage"
        :page-config="pageConfig"
        :loading.sync="loading"
        :tableSeleList.sync="tableSeleList"
        @searchData="getSearchData"
        @fnName="pageConfigBtnFnName"
        @resetTableConfigList="pageConfigResetTableConfigList"
        @onRefresh="pageConfigOnRefresh"
        @pages="pageConfigPages"
        @searchEvent="searchEvent">
        <template slot="mainTable" slot-scope="config">
          <g-query-table
            :config="config.scope"
            :tableList.sync="tableSeleList"
            @fnName="pageConfigEmitQueryTableButtonFnName">
            <template slot="table-buts" slot-scope="{scope}">
              <el-button
                class="warning"
                v-if="authButtonList.indexOf('delivery') >= 0"
                @click.stop.prevent="handleDelivery(scope)"
                type="text" size="mini" v-fast-click>
                {{$t('warIncoming.delivery')}}
              </el-button>
            </template>
          </g-query-table>
        </template>
    </query-page>
  </div>
</template>

<script>
  import Page from './config.js';
  import {search} from 'mixins/searchMixins';
  import Auth from 'util/auth';

  export default {
    name: 'warIncoming',
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
            incomingDateFrom: '',
            incomingDateTo: '',
            incomingTypeCode: '',
            projectName: '',
            supplierName: ''
        }
      };
    },
    async created () {
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList('warIncoming/getPageList');
      },
      // 删除
      handleDelete(row) {
        const statusConfig = {
          keyId: 'incomingId',
          keyName: 'projectName',
          row,
          api: 'warIncoming/setDelete'
        };
        this.setDataDelete(statusConfig, row);
      },
      // 一键出库
      handleDelivery(row) {
        if (row.flowStatus !== '02') {
          // 流程审批完成后才可一键出库
          this.$message.error(this.$t('warIncoming.flowStatusDelivery'));
          return;
        }
        // 当前单据已存在一键出库数据，是否继续？ 一键出库会跳转到材料出库页面，您确定要跳转吗？
        let message = '';
        if (row.ifOneClickOutbound) {
          message = `<span style="color: red">${this.$t('warIncoming.deliveryTips2')}</span></br>${this.$t('warIncoming.deliveryTips')}`;
        } else {
          message = this.$t('warIncoming.deliveryTips');
        }
        this.$confirm(message, this.$t('warIncoming.delivery'), {
          confirmButtonText: this.$t('button.determine'),
          cancelButtonText: this.$t('button.close'),
          dangerouslyUseHTMLString: true,
          type: 'warning'
        })
        .then(() => {
          this.outboundJump(row, 'add');
        })
        .catch(() => {});
      },
      outboundJump(row, type) {
        if (row.id) {
          if (!this.judgeSamePerson(row)) {
            this.editError(this.$t('warIncoming.delivery'));
            return;
          }
        }
        const translateType = type;
        type = this.$base64.encode(type);
        const inComingId = this.$base64.encode(row.id);
        const id = this.$base64.encode(row.id || 0);
        const routeName = 'warOutbound';
        const RouteTitleObj = {name: `${routeName}Edit`, loadRouteName: routeName, translateType};
        localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
        this.$router.push(`/${routeName}Edit/${type}/${id}/${inComingId}/${routeName}`);
      },
      sysHandlePrintLabel() {
        if (this.tableSeleList.length === 0) {
          this.$message({
            message: this.$t('print.selePrintLabelTips'),
            type: 'info'
          });
          return;
        }
        if (this.tableSeleList.length > 1) {
            // 数据选择过多，请选择一条数据进行处理！
            this.$message.error(this.$t('tips.selectDataTips'));
            return;
        }
        if (this.tableSeleList[0].flowStatus === '0') {
          this.$message({
            message: this.$t('print.printProcessNot'),
            type: 'info'
          });
          return;
        }
        if (this.tableSeleList[0].flowStatus === '01') {
          this.$message({
            message: this.$t('print.dataApproval'),
            type: 'info'
          });
          return;
        }
        this.$store.dispatch('warIncoming/getInfo', {incomingId: this.tableSeleList[0].id}).then(res => {
          if (res.status === 0) {
            const tenantId = Auth.hasUserInfo().tenantId;
            const labelPrint = {
              tenantId,
              details: res.results.incomingDetails,
              materialIds: res.results.incomingDetails.map(v => v.materialId) || []
            };
            labelPrint.materialCodes = res.results.incomingDetails.map(v => v.materialCode);
            Auth.setLabelPrint(labelPrint);
            this.$router.push('/labelPrint');
          }
        });
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
        const checkArrivalId = this.$base64.encode(0);
        const RouteTitleObj = {name: `${this.$route.name}Edit`, loadRouteName: this.$route.name, translateType};
        localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
        this.$router.push(`/${this.$route.name}Edit/${type}/${id}/warIncoming/${checkArrivalId}/${this.$route.name}`);
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
