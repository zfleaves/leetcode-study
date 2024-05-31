<!--
 * @Author: your name
 * @Date: 2021-04-14 09:35:22
 * @LastEditTime: 2021-04-25 14:41:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demMaster\projectResource\projectResource.vue
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
        <template slot="mainOperateBtn">
          <span class="tips">
            <tooltips :value="$t('projectResource.tips')">
            </tooltips>
          </span>
        </template>
        <template slot="mainTable" slot-scope="config">
          <g-query-table
            :config="config.scope"
            :tableList.sync="tableSeleList"
            @fnName="pageConfigEmitQueryTableButtonFnName">
            <!-- 数据来源 -->
            <template slot="table-dataSourceValue" slot-scope="{row, item}">
              <span>{{$t(row[item.prop])}}</span>
            </template>
            <!-- 资源类型 -->
            <template slot="table-resourceTypeValue" slot-scope="{row, item}">
              <span>{{$t(row[item.prop])}}</span>
            </template>
            <!-- 所属周期/月份 -->
            <template slot="table-applyWeekIdentify" slot-scope="{row, item}">
              <span v-if="row.applyWeekIdentify">
                  {{row[item.prop].slice(0, 4)}}{{$t('time.year')}}{{row[item.prop].slice(5, 7)}}{{$t('time.month')}}
                  {{row[item.prop].slice(8)}}{{$t('time.week')}}
              </span>
              <span v-if="row.applyMonth">
                  {{row.applyMonth.slice(0, 4)}}{{$t('time.year')}}{{row.applyMonth.slice(5, 7)}}{{$t('time.month')}}
                  {{row.applyMonth.slice(8)}}
              </span>
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
    name: 'projectResource',
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
          'accountType': '',
          'orgName': '',
          'projectName': '',
          'resourceName': '',
          'resourceTypeCode': ''
        }
      };
    },
    async created () {
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        if (!this.pageConfig.searchControls.searchData.accountType) {
          // this.$message.error(`${this.$t('tips.pleaseSelect')} ${this.$t('projectResource.accountType')}`);
          return;
        }
        this.handleGetTableDataList2('projectResource/getPageList');
      },
      // 根据url获取数据
      handleGetTableDataList2(url, paging = true, callBack) {
        this.pageConfig.mainTable.tableDat = [];
        this.pageConfig.mainTable.total = 0;
        this.loading = true;
        const data = {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            ...this.pageConfig.searchControls.searchData
        };
        this.$store.dispatch(url, data).then(res => {
          if (res.status === 0) {
            for (const item of res.results.records) {
              item.rowKey = `${item.id}/${item.cid}/${item.resourceName}`;
              // item.applyWeekIdentify = item.applyMonth;
            }
            this.pageConfig.mainTable.tableData = res.results ? res.results.records : [];
            this.pageConfig.mainTable.total = res.results ? res.results.total : 0;
          } else {
            this.$message.error(this.$t(`exception.${res.errorCode}`));
          }
          this.loading = false;
        }).catch(e => {
          this.loading = false;
        });
      },
      searchEvent({eventName, params}) {
        if (eventName === 'clear') {
          for (const key in this.cloneSearchData) {
            this.$set(this.pageConfig.searchControls.searchData, key, this.cloneSearchData[key]);
          }
          this.pageConfig.mainTable.tableData = [];
          this.pageConfig.mainTable.total = 0;
        }
        for (const item of this.pageConfig.searchControls.formList) {
          if (item.formType === 'daterange-split' && item.type !== 'time') {
            const value = this.pageConfig.searchControls.searchData[item.propEnd];
            this.pageConfig.searchControls.searchData[item.propEnd] = value ? value.replace('00:00:00', '23:59:59') : '';
          }
        }
        for (let i = 0; i < this.$children.length; i++) {
          if (this.$children[i].$el && this.$children[i].$el.className === 'generalPage') {
            this.$children[i].$refs.Page && this.$children[i].$refs.Page.setCurrentPage();
          }
        }
        if (!this.pageConfig.searchControls.searchData.accountType) {
          this.$message.error(`${this.$t('tips.pleaseSelect')} ${this.$t('projectResource.accountType')}`);
          // return;
        }
        this._getTableDataList();
      }
    }
  };
</script>

<style scoped lang="scss">
.entryTypeValue {
  font-size: 14px;
  width: 100%;
  padding: 2px 10px;
  &.entryTypeValue01 {
    color: #2b74ec;
    background-color: rgba(43,116,236, 0.2);
  }
  &.entryTypeValue02 {
    color: rgb(246,141,91);
    background-color: rgb(253,223,208);
  }
  &.entryTypeValue03 {
    color: #24b568;
    background-color: rgba(36,181,104, 0.2);
  }
  &.entryTypeValue04 {
    color: #f73535;
    background-color: rgba(247,53,53, 0.2);
  }
}
.tips {
  position: absolute;
  left: 0;
  line-height: 36px;
  top: 0;
  font-size: 12px;
  color: red;
  display: inline-block;
  width: calc(100% - 300px);
  text-align: left;
}
</style>
