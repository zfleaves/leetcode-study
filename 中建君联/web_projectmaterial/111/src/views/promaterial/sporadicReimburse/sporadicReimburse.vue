<!--
 * @Author: your name
 * @Date: 2020-07-30 10:38:36
 * @LastEditTime: 2021-02-04 09:49:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\sporadicReimburse\sporadicReimburse.vue
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
              <!-- 是否取得发票 -->
              <template slot="table-ifAcquireInvoice" slot-scope="{row, item}">
                <span class="whether" :class="'status'+ row[item.prop]">
                  {{row.ifAcquireInvoice === 0 ? $t('tips.no') : $t('tips.yes')}}
                </span>
              </template>
              <!-- 补充发票 -->
              <template slot="table-buts" slot-scope="{ scope }">
                  <el-button
                    class="warning"
                    :disabled="scope.ifAcquireInvoice === 1"
                    v-if="authButtonList.indexOf('updateAttachment') >= 0"
                    @click.stop.prevent="handleUpdateAttachment(scope, 'sporadicReimburseId', 'attachment')"
                    type="text"
                    size="mini"
                    v-fast-click
                  >
                    {{ $t('button.updateAttachment') }}
                  </el-button>
              </template>
          </g-query-table>
        </template>
    </query-page>

    <!--补充发票 -->
    <g-dialog v-if="dialogAttachmentVisible" :dialogConfig="dialogAttachmentConfig"
      :isVisible.sync="dialogAttachmentVisible">
      <div slot="body" style="width: 100%; height: calc(100% - 100px); margin-top: 30px;">
          <g-edit-form
            ref="editAttachmentForm"
            type="add"
            :tableConfig="mainFormAttachmentConfig"
            :projectForm="projectAttachmentForm"
            @editFormEvent="editFormEvent"
          >
          </g-edit-form>
      </div>
      <div slot="footer" class="footer">
        <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small" @click="dialogAttachmentVisible = false">{{$t('button.close') }}</el-button>
        <el-button type="primary" icon="el-icon-circle-check" size="small" @click="handleAttachmentSubmit('sporadicReimburse/updateAttachment')">{{$t('button.determine') }}</el-button>
      </div>
    </g-dialog>
  </div>
</template>

<script>
  import Page from './config.js';
  import {search} from 'mixins/searchMixins';
  import Auth from 'util/auth';

  export default {
    name: 'sporadicReimburse',
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
          docNo: '',
          flowStatus: [],
          projectName: '',
          reimburseContent: '',
          reimburseDateFrom: '',
          reimburseDateTo: '',
          reimburseUserName: '',
          ifAcquireInvoice: ''
        }
      };
    },
    async created () {
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList('sporadicReimburse/getPageList');
      },
      // 删除
      handleDelete(row) {
        const statusConfig = {
          keyId: 'sporadicReimburseId',
          keyName: 'projectName',
          row,
          api: 'sporadicReimburse/setDelete'
        };
        this.setDataDelete(statusConfig, row);
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
