<!--
 * @Author: your name
 * @Date: 2021-04-14 14:37:37
 * @LastEditTime: 2021-04-15 11:37:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\compoent\supplyOrder\historySupplyOrder.vue
-->

<template>
 <div style="height: 100%;padding: 10px;box-sizing: border-box;">
    <query-page
        res="sysQueryPage"
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
            @tableList="getTableSeleList"
            @fnName="pageConfigEmitQueryTableButtonFnName">
          </g-query-table>
        </template>
    </query-page>
    <div class="footer" slot="footer">
        <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small" @click="handleClose">{{$t('button.close')}}</el-button>
        <el-button size="small" type="primary" icon="el-icon-circle-check" @click="getData" v-fast-click>{{$t('button.determine')}}</el-button>
    </div>
  </div>
</template>

<script>
  import Page from './historySupplyOrder.js';
  import {search} from 'mixins/searchMixins';

  export default {
    name: 'historySupplyOrder',
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
          orderName: '',
          projectId: 0
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
        // 选中的订单
        selectId: {
            default: []
        },
        projectId: {
            default: 0
        }
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.pageConfig.searchControls.searchData.projectId = this.projectId;
        this.pageConfig.mainTable.selectedList = this.selectId && [{id: this.selectId}];
        this.handleGetTableDataList('checkArrival/getHistorySupplyorderCheckarival', false);
      },
      getTableSeleList(arr) {
        this.tableSeleList = arr;
        this.$emit('getSelectData', this.tableSeleList);
      },
      getData() {
        this.$emit('getData', this.tableSeleList);
      },
      handleClose() {
        this.$emit('close', false);
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
