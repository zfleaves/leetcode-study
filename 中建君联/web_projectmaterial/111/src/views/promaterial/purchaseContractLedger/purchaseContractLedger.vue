<!--
 * @Author: your name
 * @Date: 2020-08-13 10:56:46
 * @LastEditTime: 2023-02-14 09:14:16
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\purchaseContractLedger\purchaseContractLedger.vue
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
            <template slot="table-executionStatus" slot-scope="{row, item}">
                <span class="executionStatus" :class="'executionStatus'+row[item.prop]">
                    {{setDicData(row[item.prop], item.selectList)}}
                </span>
            </template>
          </g-query-table>
        </template>
    </query-page>
    <g-dialog v-if="dialogInstructionsForUse" :dialogConfig="dialogConfigInstructionsForUse" :isVisible.sync="dialogInstructionsForUse">
        <div slot="body" class="instructionsForUse">
          <!-- 材料管理云不提供合同相关管理功能，仅提供查询和引用功能。如需使用合同相关功能请于合同管理系统中进行。 -->
          <p>1，{{$t('purchaseContractLedger.instructionsForUseTips1')}}</p>
          <!-- 如果没有购买合同管理云子系统，您也可以通过下达无合同的供货订单完成项目材料的后续管理工作。但：如果您拥有合同管理云子系统的使用权限，建议您将两个子系统良好衔接使用以保持数据的贯穿性。 -->
          <p>2，{{$t('purchaseContractLedger.instructionsForUseTips2')}}</p>
          <!-- 材料采购合同是自动获取合同管理子系统中的合同性质为‘材料采购合同’下的不同合同类型的合同信息。 -->
          <p>3，{{$t('purchaseContractLedger.instructionsForUseTips3')}}</p>
        </div>
    </g-dialog>
  </div>
</template>

<script>
  import Page from './config.js';
  import {search} from 'mixins/searchMixins';
  import Auth from 'util/auth';

  export default {
    name: 'purchaseContractLedger',
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
          classifyPropertyType: 'CLHT',
          contractCode: '',
          contractName: '',
          contractNatureCode: '02',
          partyBUnitName: '',
          projectName: '',
          signUserName: '',
          executionStatus: []
        },
        dialogInstructionsForUse: false,
        dialogConfigInstructionsForUse: {
            title: this.$t('purchaseContractLedger.instructionsForUse'),
            appendBody: false,
            center: true,
            top: '20vh',
            width: '50%',
            span: '0.3'
        }
      };
    },
    async created () {
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList('purchaseContractLedger/getPageList', true, () => {
          this.pageConfig.mainTable.tableData.forEach(item => {
            item.projectName = item.proProjectInfoDtos.map(v => v.projectName).join(',');
            item.payable = item.totalSettlementAmount - item.totalPaymentAmount;
          });
        });
      },
      // 使用须知
      handleInstructionsForUse() {
        this.dialogInstructionsForUse = true;
      }
    }
  };
</script>

<style scoped lang="scss">
.executionStatus{
    font-size: 14px;
    width: 100%;
    padding: 2px 10px;
    &.executionStatus01 {
        color: #f73535;
        background-color: rgba(247,53,53, 0.2);
    }
    &.executionStatus02 {
        color: #2b74ec;
        background-color: rgba(43,116,236, 0.2);
    }
    &.executionStatus03 {
        color: #24b568;
        background-color: rgba(36,181,104, 0.2);
    }
}
.instructionsForUse{
  p{
    padding: 10px 0;
  }
}
</style>
