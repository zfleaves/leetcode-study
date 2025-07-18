<!--
 * @Author: your name
 * @Date: 2020-12-23 14:14:06
 * @LastEditTime: 2020-12-23 15:33:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectsecurity\src\components\secPlan\secPlan.vue
-->
<template>
  <div style="height: 100%;">
    <query-page res="sysQueryPage" :page-config="pageConfig" :loading.sync="loading" :dialogHeight="dialogHeight"
      :tableSeleList.sync="tableSeleList" @searchData="getSearchData" @fnName="pageConfigBtnFnName"
      @resetTableConfigList="pageConfigResetTableConfigList" @onRefresh="pageConfigOnRefresh" @pages="pageConfigPages"
      @dialogEvent="dialogEvent" @searchEvent="searchEvent">
      <template slot="mainTable" slot-scope="config">
        <g-query-table :config="config.scope" :tableList.sync="tableSeleList"
          @fnName="pageConfigEmitQueryTableButtonFnName">
          <template slot="table-projectStatus" slot-scope="{row, item}">
            <div class="projectStatus">
              <span :class="'projectStatus'+ row.projectStatus">{{setDicData(row.projectStatus, item.selectList)}}
              </span>
            </div>
          </template>
        </g-query-table>
      </template>
    </query-page>
  </div>
</template>

<script>
import Page from './config.js';
import { search } from 'mixins/searchMixins';
import Auth from 'util/auth';

export default {
  name: 'secPlan',
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
        code: '',
        nameChs: '',
        papernumber: ''

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
      default: 0
    },
    // 选中的项目
    projectId: {
      default: 0
    }
  },
  async created () {
    await this._getTableDataList();
  },
  methods: {
    // 获取表单
    _getTableDataList () {
      this.pageConfig.mainTable.selectedList = [{ id: this.selectId }];
      this.handleGetTableDataList('expertDeclaration/getExpertName', true, () => {
        // console.log(this.pageConfig.mainTable.tableData, '查看结果');
        // gender
        this.pageConfig.mainTable.tableData.forEach(item => {
          if (item.gender === '男') {
            this.$set(item, 'genderCode', '01');
          } else {
            this.$set(item, 'genderCode', '02');
          }
        });
      });
    }
  }
};
</script>

<style scoped lang="scss">
.projectStatus {
  width: 100%;
  span {
    width: 100%;
    padding: 2px 10px;
    &.projectStatus0 {
      color: #ff4a4a;
      background-color: rgba(247, 53, 53, 0.2);
    }
    &.projectStatus1 {
      color: #40bb5a;
      background-color: rgba(36, 181, 104, 0.2);
    }
    &.projectStatus2 {
      color: rgb(49, 120, 237);
      background-color: rgba(213, 227, 251, 1);
    }
    &.projectStatus3 {
      color: rgb(134, 91, 235);
      background-color: rgb(225, 221, 233);
    }
    &.projectStatus4 {
      color: #40bb5a;
      background-color: rgba(36, 181, 104, 0.2);
    }
  }
}
</style>
