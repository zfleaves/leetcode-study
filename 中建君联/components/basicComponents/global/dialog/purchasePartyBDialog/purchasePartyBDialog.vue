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
        <template slot="search" slot-scope="{configForm, searchFormValue}">
          <g-search-form :configForm="configForm"
                          @searchEvent='searchEvent'
                          :searchFormValue="searchFormValue">
          </g-search-form>
        </template>
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
    name: 'purchasePartyBDialog',
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
          businessActivityCode: '',
          companyTypeCode: '',
          enterpriseStatus: ['04', '05'],
          entryDateFrom: '',
          entryDateTo: '',
          regDateFrom: '',
          regDateTo: '',
          supplierName: ''
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
        }
    },
    async created () {
      if (this.isCheckbox) {
        const selectList = [];
        for (const item of this.selectId) {
          selectList.push({
            supplierUscc: item.supplierUscc
          });
        }
        this.pageConfig.mainTable.isCheckbox = this.isCheckbox;
        this.pageConfig.mainTable.isRadio = false;
        this.pageConfig.mainTable.selectedList = selectList;
      } else {
        this.pageConfig.mainTable.isCheckbox = this.isCheckbox;
        this.pageConfig.mainTable.isRadio = true;
        this.pageConfig.mainTable.selectedList = [{supplierUscc: this.selectId}];
        console.log(this.pageConfig.mainTable.selectedList, 'this.pageConfig.mainTable.selectedList');
      }
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList('sysUserSupplier/getSupplierLibrarypage');
      }
    }
  };
</script>

<style scoped lang="scss">
.supplierLevel {
  font-size: 14px;
  width: 100%;
  padding: 2px 10px;
  &.supplierLevel01 {
    color: #54c489;
    background-color: rgba(211, 240, 225, 0.9);
  }
  &.supplierLevel02 {
    color: #54c489;
    background-color: rgba(143, 215, 177, 0.7);
  }
}
</style>
