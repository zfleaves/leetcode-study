<!--
 * @Author: your name
 * @Date: 2020-07-24 15:16:55
 * @LastEditTime: 2020-08-08 14:41:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\demandPlan\quarterPlan\quarterPlan.vue
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
            <template slot="form-applyQuarterValue" slot-scope="{searchFormValue, item}">
              <el-cascader :props="propsQuarter"
                  v-model="searchFormValue[item.prop]" :options="options"
                  style="width: 100%"
                  @change="handleSearch"
                  clearable
                  :size="item.size || 'small'">
              </el-cascader>
            </template>
          </g-search-form>
        </template>
        <template slot="mainTable" slot-scope="config">
          <g-query-table
            :config="config.scope"
            :tableList.sync="tableSeleList"
            @fnName="pageConfigEmitQueryTableButtonFnName">
            <span slot="table-applyQuarter" slot-scope="{row, item}">
              {{row[item.prop].substring(0, 4)}} / {{setDicData(row[item.prop].substring(4, 6), item.selectList)}}
            </span>
            <span slot="table-detailItem" slot-scope="{row, item}">
              {{row[item.prop]}}{{$t('quarterPlan.term')}}
            </span>
          </g-query-table>
        </template>
    </query-page>
  </div>
</template>

<script>
  import Page from './config.js';
  import {search} from 'mixins/searchMixins';
  import {basicList} from 'mixins/index';
  import Auth from 'util/auth';

  export default {
    name: 'quarterPlan',
    mixins: [search, basicList],
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
          applyQuarter: '',
          applyQuarterValue: [],
          createByName: '',
          createTimeFrom: '',
          createTimeTo: '',
          docNo: '',
          flowStatus: '',
          projectName: ''
        },
        propsQuarter: {
            value: 'value',
            label: 'label',
            lazy: false
        }
      };
    },
    async created () {
      await this._getTableDataList();
    },
    computed: {
        options() {
            const year = 1997;
            const options = [];
            const nodes = [];
            const applyQuarterList = this.$clone(this.page.PageConfig.applyQuarterList);
            for (const item of applyQuarterList) {
                nodes.push({
                    label: item.dataName,
                    value: item.dataCode,
                    leaf: true
                });
            }
            for (let i = 0 ; i <= 100; i++) {
                options.push({
                    label: `${year + i}`,
                    value: `${year + i}`,
                    leaf: false,
                    children: nodes
                });
            }
            return options;
        }
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        const applyQuarter = this.pageConfig.searchControls.searchData.applyQuarterValue;
        if (applyQuarter.length) {
          this.pageConfig.searchControls.searchData.applyQuarter = applyQuarter[0] + applyQuarter[1];
        } else {
          this.pageConfig.searchControls.searchData.applyQuarter = '';
        }
        this.handleGetTableDataList('quarterPlan/getPageList');
      },
      // 搜索季度
      handleSearch() {
        this._getTableDataList();
      },
      // 删除
      handleDelete(row) {
        const statusConfig = {
          keyId: 'quarterPlanId',
          keyName: 'projectName',
          row,
          api: 'quarterPlan/setDelete'
        };
        this.setDataDelete(statusConfig, row);
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
