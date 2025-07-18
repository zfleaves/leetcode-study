<!--
 * @Author: your name
 * @Date: 2020-07-30 20:17:32
 * @LastEditTime: 2021-12-21 15:26:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\components\basicComponents\global\dialog\partyBDialog\partyBDialog.VUE
-->
<template>
  <div style="height: 100%;">
    <query-page
        :page-config="pageConfig"
        :loading.sync="loading"
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

  export default {
    name: 'partyB',
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
        // 搜索数据
        searchData: {
          flowStatus: ['02'],
          partyBCode: '',
          partyBName: '',
          partyBProperties: [],
          propertyCode: '',
          appraiseStatus: '01',
          uscc: '',
          contactName: '',
          createTimeEnd: '',
          createTimeStart: ''
        }
      };
    },
    props: {
        dialogHeight: {
            type: Number,
            default: 300
        },
        // 选中的单位
        selectId: {
            default: ''
        },
        isCheckbox: {
          type: Boolean,
          default: false
        },
        doNotCheck: {
          type: Array,
          default: () => []
        }
        // partyBProperties: {
        //   type: Array,
        //   default: () => []
        // }
    },
    async created () {
      // this.pageConfig.mainTable.doNotCheck = this.doNotCheck;
      if (this.isCheckbox) {
        // const selectList = [];
        // for (const item of this.selectId) {
        //   selectList.push({
        //     id: item.partyBId
        //   });
        // }
        this.pageConfig.mainTable.isCheckbox = this.isCheckbox;
        this.pageConfig.mainTable.isRadio = false;
        this.pageConfig.mainTable.selectedList = this.selectId;
      } else {
        this.pageConfig.mainTable.isCheckbox = this.isCheckbox;
        this.pageConfig.mainTable.isRadio = true;
        this.pageConfig.mainTable.selectedList = [{id: this.selectId}];
      }
      // if (this.partyBProperties && this.partyBProperties.length) {
      //   const index = this.pageConfig.searchControls.formList.findIndex(v => v.prop === 'partyBProperties');
      //   if (index >= 0) {
      //     this.$set(this.pageConfig.searchControls.formList[index], 'inputStatus', 'hide');
      //   }
      // }
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        // this.pageConfig.searchControls.searchData.partyBProperties = this.partyBProperties;
        this.handleGetTableDataList('unitPartyB/getPartyBPageList');
      }
    }
  };
</script>

<style scoped lang="scss">
/deep/ .slot_btn{
  display: flex;
  justify-content: right;
  align-items: end;
}
</style>
