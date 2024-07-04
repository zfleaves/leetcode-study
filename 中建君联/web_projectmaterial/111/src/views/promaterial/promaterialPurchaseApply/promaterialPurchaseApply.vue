<!--
 * @Author: your name
 * @Date: 2020-07-24 15:23:44
 * @LastEditTime: 2022-08-08 09:34:43
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\demandPlan\promaterialPurchaseApply\promaterialPurchaseApply.vue
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
        <template slot="search" slot-scope="{configForm, searchFormValue}">
          <g-search-form :configForm="configForm"
                        :searchFormValue="searchFormValue"
                        @searchEvent="searchEvent"
                        v-on="$listeners">
            <template slot="form-totalEstimateAmount" slot-scope="{searchFormValue, item}">
              <div style="display: flex;align-items: center;">
                <el-number
                    v-model="searchFormValue[item.propStart]"
                    :size="item.size || 'small'"
                    clearable
                    :maxlength="Number(item.maxlength)"
                    :precision="Number(item.precision)"
                    @keyup.enter.native="handleSearch"
                    :placeholder="$t(item.placeholder) || ''"
                    show-word-limit
                  ><i slot="prefix-icon" class="icon"></i></el-number>
                <span style="margin: 0 10px;">-</span>
                <el-number
                    v-model="searchFormValue[item.propEnd]"
                    :size="item.size || 'small'"
                    clearable
                    :maxlength="Number(item.maxlength)"
                    :precision="Number(item.precision)"
                    @keyup.enter.native="handleSearch"
                    :placeholder="$t(item.placeholder) || ''"
                    show-word-limit
                  ><i slot="prefix-icon" class="icon"></i></el-number>
              </div>
            </template>
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
    name: 'promaterialPurchaseApply',
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
          applyDateFrom: '',
          applyDateTo: '',
          applyUserName: '',
          docNo: '',
          flowStatus: '',
          projectName: '',
          purchaseMethodCode: '',
          totalEstimateAmountFrom: '',
          totalEstimateAmountTo: ''
        }
      };
    },
    async created () {
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList('promaterialPurchaseApply/getPageList');
      },
      // 删除
      handleDelete(row) {
        const statusConfig = {
          keyId: 'purchaseApplyId',
          keyName: 'projectName',
          row,
          api: 'promaterialPurchaseApply/setDelete'
        };
        this.setDataDelete(statusConfig, row);
      },
      // 搜索季度
      handleSearch() {
        this.pageNo = 1;
        this._getTableDataList();
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
