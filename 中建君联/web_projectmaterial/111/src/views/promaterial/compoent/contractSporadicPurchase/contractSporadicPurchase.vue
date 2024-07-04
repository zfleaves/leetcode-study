<!--
 * @Author: your name
 * @Date: 2021-06-15 15:26:04
 * @LastEditTime: 2022-09-23 11:58:37
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial-项目材料管理\src\views\promaterial\compoent\contractSporadicPurchase\contractSporadicPurchase.vue
-->
<template>
  <div style="height: 100%;">
    <query-page
        res="sysQueryPage"
        :page-config="pageConfig"
        :loading.sync="loading"
        :tableSeleList.sync="tableSeleList"
        :dialogHeight="dialogHeight - 10"
        @searchData="getSearchData"
        @fnName="pageConfigBtnFnName"
        @resetTableConfigList="pageConfigResetTableConfigList"
        @onRefresh="pageConfigOnRefresh"
        @pages="pageConfigPages"
        @dialogEvent="dialogEvent"
        @searchEvent="searchEvent">
        <template slot="mainTable" slot-scope="config">
          <g-query-table
            :config="config.scope"
            :tableList.sync="tableSeleList"
            @fnName="pageConfigEmitQueryTableButtonFnName">
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
    name: 'contractSporadicPurchase',
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
            classifyPropertyType: '',
            contractCode: '',
            contractName: '',
            partyBUnitName: '',
            executionStatus: ['01', '02'],
            projectId: 0
        },
        tempData: []
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
        // 选中的合同
        selectId: {
            default: ''
        },
        sourceType: {
            default: ''
        },
        projectId: {
            default: ''
        },
        type: {
            default: ''
        }
    },
    methods: {
        // // 搜索
        searchEvent () {
            const contractName = this.pageConfig.searchControls.searchData.contractName;
            this.pageConfig.mainTable.tableData = this.tempData.filter(v => {
                const supplierName = v.supplierName || '';
                const createByName = v.createByName || '';
                return v.contractName.indexOf(contractName) >= 0 ||
            supplierName.indexOf(contractName) >= 0 || createByName.indexOf(contractName) >= 0;
            });
        },
        // 获取表单
        _getTableDataList () {
            // console.log(this.selectId);
            this._setContractTableDataList((contractArr) => {
              this._setTableDataList(contractArr);
            });
        },
        // 合同
        _setContractTableDataList (callback) {
            this.loading = true;
            const data = {
                classifyPropertyType: 'CLHT',
                contractNatureCode: '02',
                contractCode: '',
                contractName: '',
                executionStatus: ['01', '02'],
                partyBUnitName: '',
                projectId: this.projectId
            };
            this.$store.dispatch('publicApi/getV1ContractExpendClassifyPage', data).then(res => {
                if (res.status === 0) {
                    res.results && res.results.forEach(item => {
                        item.sourceType = '01';
                        item.sourceTypeName = this.$t('dialog.contractSourceTypeName');
                        item.rowKey = `${item.sourceType}-${item.id}`;
                        item.contractId = item.id;
                        item.expendContractName = item.contractName;
                        item.expendContractId = item.id;
                        item.supplierName = item.partyBUnitName || '';
                        item.supplierId = item.partyBUnitId;
                        item.code = item.contractCode;
                        item.expendContractCode = item.code;
                        item.purchaseCode = item.contractCode;
                    });
                    // this.tempData = res.results;
                    // this.pageConfig.mainTable.tableData = this.$clone(this.tempData);
                    // this.selectId && (this.pageConfig.mainTable.selectedList = [{rowKey: `${this.selectId}`}]);
                    callback && callback(res.results || []);
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
                this.loading = false;
            }).catch(e => {
                this.loading = false;
            });
        },
        // 临时
        _setTableDataList (contractArr) {
            this.loading = true;
            const data = {
                flowStatus: ['02'],
                projectId: this.projectId,
                projectName: '',
                sporadicPurchaseReason: '',
                docNo: '',
                applyUserName: '',
                applyDateFrom: '',
                applyDateTo: ''
            };
            if (this.type === 'warIncoming') {
                data.incomingStatus = ['01', '02'];
            }
            this.$store.dispatch('sporadicPurchase/getSporadicPurchaseList', data).then(res => {
                if (res.status === 0) {
                    const results = res.results || [];
                    results && results.forEach(item => {
                        item.sourceType = '02';
                        item.code = item.docNo;
                        item.sourceTypeName = this.$t('dialog.purchaseSourceTypeName');
                        item.rowKey = `${item.sourceType}-${item.id}`;
                        item.contractName = item.purchaseContent;
                        item.contractId = item.id;
                        item.expendContractName = item.purchaseContent;
                        item.expendContractId = item.id;
                        item.partyBUnitName = item.supplierName || '';
                        item.partyBUnitId = item.supplierId || '';
                        // item.supplierName = item.partyBUnitName || '';
                        // item.supplierId = item.partyBUnitId || '';
                        item.expendContractCode = item.code;
                        item.purchaseCode = item.purchaseCode;
                    });
                    this.tempData = contractArr.concat(results);
                    // console.log(this.tempData, 'this.tempData');
                    this.pageConfig.mainTable.tableData = this.$clone(this.tempData);
                    this.selectId && (this.pageConfig.mainTable.selectedList = [{rowKey: `${this.selectId}`}]);
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
                this.loading = false;
            }).catch(e => {
                console.log(e);
                this.loading = false;
            });
        }
    }
  };
</script>

<style scoped lang="scss">
</style>
