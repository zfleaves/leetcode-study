<!--
 * @Author: your name
 * @Date: 2021-04-14 09:40:17
 * @LastEditTime: 2021-04-25 15:19:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\durationRisk\durationRiskConfig\durationRiskConfig.vue
-->
<template>
  <div>
    <query-page res="sysQueryPage" :page-config="pageConfig" :loading.sync="loading" :tableSeleList.sync="tableSeleList"
      @searchData="getSearchData" @fnName="pageConfigBtnFnName" @resetTableConfigList="pageConfigResetTableConfigList"
      @onRefresh="pageConfigOnRefresh" @pages="pageConfigPages" @searchEvent="searchEvent">
      <template slot="mainTable" slot-scope="config">
        <g-query-table :config="config.scope" :tableList.sync="tableSeleList"
          @fnName="pageConfigEmitQueryTableButtonFnName">
          <template slot="table-status" slot-scope="{row, item}">
            <span class="war-status" :class="'status'+row[item.prop]">
              {{setDicData(row[item.prop], item.selectList)}}
            </span>
          </template>
          <!-- 禁用启用 -->
          <template slot="table-buts-suffix" slot-scope="{scope}">
            <el-button v-if="authButtonList.indexOf('enable') >= 0" :disabled="scope.row.logTypeCode === '01'"
              @click.stop.prevent="handleWarStatus(scope.row)" type="text" size="mini" v-fast-click>
              {{scope.row.status === 0 ? $t('button.disable') : $t('button.enable')}}
            </el-button>
            <!-- 修改 -->
            <el-button v-if="authButtonList.indexOf('update') >= 0" :disabled="scope.row.logTypeCode === '01'"
              class="warning" @click.stop.prevent="handleEdit(scope.row)" type="text" size="mini" v-fast-click>
              {{$t('button.edit')}}
            </el-button>
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
  name: 'durationRiskConfig',
  mixins: [search],
  data () {
    return {
      // 查询页面基础参数
      page: new Page(),
      pageConfig: {},
      loading: false,
      // =====================
      tableSeleList: [],
      pageConfigLoading: false,
      cloneProjectForm: {},
      // 搜索数据
      searchData: {
        planTimeContent: '',
        riskContent: '',
        stauts: []
      },
      type: 'add'
    };
  },
  async created () {
    await this._getTableDataList();
  },
  methods: {
    setDicData (value, selectList) {
      const index = selectList && selectList.findIndex(v => v.dataCode === value);
      if (index < 0) return '';
      return selectList ? this.$t(selectList[index].dataName) : '';
    },
    // 获取表单
    _getTableDataList () {
      this.handleGetTableDataList('durationRiskConfig/getPageList');
    },
    // 删除
    handleDelete (row) {
      if (row.status === 0) return;
      const statusConfig = {
        keyId: 'riskConfigId',
        keyName: 'riskContent',
        row,
        api: 'durationRiskConfig/setDelete'
      };
      this.setDataDelete(statusConfig, row);
    },
    // 删除按钮状态
    handleDeleteStatus (row) {
      if (row.status !== 0) {
        return false;
      } else {
        return true;
      }
    },
    handleEdit (row) {
      this.handleSetRouter('edit', row);
    },
    // 增、改、查 路由跳转设置
    handleSetRouter (type, row = {}) {
      const translateType = type;
      type = this.$base64.encode(type);
      const id = this.$base64.encode(row.id || 0);
      const RouteTitleObj = { name: `${this.$route.name}Edit`, loadRouteName: this.$route.name, translateType };
      localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
      this.$router.push(`/${this.$route.name}Edit/${type}/${id}/${this.$route.name}`);
    },
    // 启用/禁用
    handleWarStatus (row) {
      const statusTips = row.status === 0 ? this.$t('button.disable') : this.$t('button.enable');
      const status = row.status === 0 ? 1 : 0;
      this.$confirm(`${statusTips}${row.riskContent}?`, statusTips, {
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('durationRiskConfig/setStatus', { riskConfigId: row.id, status }).then(res => {
            if (res.status === 0) {
              this._getTableDataList();
              this.$message.success(`${statusTips}${this.$t('tips.success')}!`);
            } else {
              this.$message.error(`${statusTips}${this.$t('tips.fail')}!`);
            }
          });
        })
        .catch(() => { });
    }
  }
};
</script>

<style scoped lang="scss">
.key-tips {
  color: red;
  position: absolute;
  left: 10px;
  height: 36px;
  line-height: 36px;
  top: 0px;
  font-size: 12px;
}
.war-status {
  font-size: 14px;
  width: 100%;
  padding: 2px 10px;
  &.status0 {
    color: #24b568;
    background-color: rgba(36, 181, 104, 0.2);
  }
  &.status1 {
    color: #f73535;
    background-color: rgba(247, 53, 53, 0.2);
  }
}
</style>
