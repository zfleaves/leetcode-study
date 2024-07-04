<!--
 * @Author: your name
 * @Date: 2021-05-25 09:30:40
 * @LastEditTime: 2021-06-16 09:16:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial-项目材料管理\src\views\promaterial\compoent\returnMultiple\returnMultiple.vue
-->
<template>
  <div style="height: 100%;">
    <query-page
        res="incomingMultiple"
        :page-config="pageConfig"
        :loading.sync="loading"
        :tableSeleList.sync="tableSeleList"
        :dialogHeight="dialogHeight"
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
    name: 'returnMultiple',
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
            projectId: 0,
            materialName: '',
            sourceType: '',
            expendContractId: ''
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
        selectList: {
            default: () => []
        },
        projectId: {
            default: 0
        },
        sourceType: {
          default: '01'
        },
        contractId: {
          default: ''
        }
    },
    methods: {
        // 获取表单
        _getTableDataList () {
            this.pageConfig.searchControls.searchData.projectId = this.projectId;
            this.pageConfig.searchControls.searchData.sourceType = this.sourceType;
            this.pageConfig.searchControls.searchData.expendContractId = this.contractId;
            this.handleGetTableDataList('purchaseSettlement/getReturngoodsList', false, () => {
                this.pageConfig.mainTable.tableData.forEach(item => {
                  item.returngoodsDocNo = item.docNo;
                  item.returngoodsId = item.id;
                });
                this.pageConfig.mainTable.selectedList = this.selectList;
            });
        }
    }
  };
</script>

<style scoped lang="scss">
</style>
