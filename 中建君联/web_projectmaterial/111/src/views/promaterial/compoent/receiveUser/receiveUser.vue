<!--
 * @Author: your name
 * @Date: 2020-07-31 09:18:48
 * @LastEditTime: 2021-05-25 10:41:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\compoent\expendRegister\expendRegister.vue
-->
<template>
    <div style="height: 100%;">
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
      name: 'receiveUser',
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
            projectId: '',
            belongPageCode: '01',
            dutyPersonId: '',
            dutyPersonName: '',
            dutyPersonMobile: ''
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
          // 选中的负责人
          receiveUserId: {
              default: ''
          },
          projectId: {
              default: 0
          }
      },
      methods: {
        // 获取表单
        _getTableDataList () {
            this.pageConfig.searchControls.searchData.projectId = this.projectId;
            this.pageConfig.mainTable.selectedList = this.receiveUserId && [{id: this.receiveUserId}];
            console.log(this.pageConfig.mainTable.selectedList, 'this.pageConfig.mainTable.selectedList');
            const url = 'supplyOrder/getProjectLeaderValidInfo';
            this.handleGetTableDataList(url, false, () => {});
        }
      }
    };
  </script>

  <style scoped lang="scss">
  </style>
