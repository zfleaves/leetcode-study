<!--
 * @Author: your name
 * @Date: 2021-01-26 10:02:56
 * @LastEditTime: 2021-03-01 16:53:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\inspect\inspectType\inspectType.vue
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
          <template slot="table-buts-suffix" slot-scope="{scope}">
            <el-button v-if="authButtonList.indexOf('disable') >= 0" @click.stop.prevent="handleWarStatus(scope.row)"
              type="text" size="mini" v-fast-click>
              {{scope.row.status === 0 ? $t('button.disable') : $t('button.enable')}}
            </el-button>
          </template>
          <!-- <template slot="table-buts" slot-scope="{scope}">
                  <el-button
                    v-if="authButtonList.indexOf('delete') >= 0"
                    class="danger"
                    :disabled="handleDeleteStatus(scope)"
                    @click.stop.prevent="handleDelete(scope)" type="text" size="mini" v-fast-click>
                    {{$t('button.delete')}}
                  </el-button>
                </template> -->
        </g-query-table>
      </template>
    </query-page>
    <!-- 添加仓库 -->
    <g-drawer :title="title + $t(`button.${type}`)" v-if="pageConfigLoading" :display.sync="pageConfigLoading"
      :inner="true" width="35%">
      <div slot="body">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" :type="type" :customRules="customRules"
          :tableConfig="pageConfig.mainFormConfig" :projectForm="projectForm">
        </g-edit-form>
      </div>
      <div slot="but">
        <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small"
          @click="warWarehouseDrawerClose">
          {{$t('button.close')}}
        </el-button>
        <el-button size="small" type="primary" :disabled="type === 'info'" icon="el-icon-circle-check"
          @click="warWarehouseDrawerSave" v-fast-click>
          {{$t('button.save')}}
        </el-button>
      </div>
    </g-drawer>
  </div>
</template>

<script>
import Page from './config.js';
import { search } from 'mixins/searchMixins';
import Auth from 'util/auth';

export default {
  name: 'inspectType',
  mixins: [search],
  data () {
    const logTypeCodeValid = (rule, value, callback) => {
      if (value) {
        const regular = /[\u4E00-\u9FA5]/g;
        if (regular.test(value)) {
          // 不能为汉字
          callback(new Error(this.$t('inspectType.inspectTypeCodeRuleTips')));
        } else {
          const params = {
            codeName: 'inspectType.inspectTypeCode',
            url: 'inspectType/checkCode',
            keyName: 'inspectTypeCode',
            keyId: 'inspectTypeId'
          };
          this.repeatCheckData(rule, value, callback, params);
        }
      } else {
        // callback();
        callback(new Error(`${this.$t('tips.pleaseEnter')} ${this.$t('inspectType.inspectTypeCode')}`));
      }
    };
    const logTypeNameValid = (rule, value, callback) => {
      if (value) {
        const params = {
          codeName: 'inspectType.inspectTypeName',
          url: 'inspectType/checkName',
          keyName: 'inspectTypeName',
          keyId: 'inspectTypeId'
        };
        this.repeatCheckData(rule, value, callback, params);
      } else {
        callback(new Error(`${this.$t('tips.pleaseEnter')} ${this.$t('inspectType.inspectTypeName')}`));
      }
    };
    return {
      // 查询页面基础参数
      page: new Page(),
      pageConfig: {},
      loading: false,
      // =====================
      tableSeleList: [],
      title: this.$t('menu.inspectType'),
      pageConfigLoading: false,
      projectForm: {
        'inspectTypeCode': '',
        'inspectTypeName': '',
        'remarks': '',
        'sort': 0,
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      },
      cloneProjectForm: {},
      customRules: {
        inspectTypeCode: [{ required: true, validator: logTypeCodeValid, trigger: 'blur' }],
        inspectTypeName: [{ required: true, validator: logTypeNameValid, trigger: 'blur' }]
      },
      // 搜索数据
      searchData: {
        'inspectTypeCode': '',
        'inspectTypeName': '',
        'remarks': '',
        'status': [],
        'updateTimeFrom': '',
        'updateTimeTo': ''
      },
      type: 'add'
    };
  },
  async created () {
    await this._getTableDataList();
    this.cloneProjectForm = this.$clone(this.projectForm);
  },
  methods: {
    repeatCheckData (rule, value, callback, params) {
      if (!value) {
        // 请输入
        callback(new Error(`${this.$t('tips.pleaseEnter')}${this.$t(params.codeName)}`));
      } else {
        this.$store.dispatch(params.url, { [params.keyName]: value, [params.keyId]: this.projectForm.id || '', projectId: this.projectForm.projectId || '' }).then(res => {
          if (res.results) {
            // 重复，请重新输入
            callback(new Error(`${this.$t(this.$t(params.codeName))}${this.$t('tips.repeat')}`));
          } else {
            callback();
          }
        });
      }
    },
    setDicData (value, selectList) {
      const index = selectList && selectList.findIndex(v => v.dataCode === value);
      if (index < 0) return '';
      return selectList ? this.$t(selectList[index].dataName) : '';
    },
    handleSetRouter (row) {
      this.type = 'info';
      this.projectForm = row;
      this.pageConfigLoading = true;
    },
    // 获取表单
    _getTableDataList () {
      this.handleGetTableDataList('inspectType/getPageList');
    },
    // 添加
    sysHandleAdd () {
      this.type = 'add';
      this.title = this.$t('menu.inspectType');
      this.projectForm = this.$clone(this.cloneProjectForm);
      this.projectForm.sort = this.pageConfig.mainTable.tableData.length + 1 || 1;
      this.pageConfigLoading = true;
    },
    // 修改
    handleEdit (row) {
      this.type = 'edit';
      this.title = this.$t('menu.inspectType');
      const data = this.$clone(row);
      this.projectForm = data;
      this.pageConfigLoading = true;
    },
    // 关闭弹出框
    warWarehouseDrawerClose () {
      this.pageConfigLoading = false;
      this.projectForm = this.$clone(this.cloneProjectForm);
    },
    // 保存
    warWarehouseDrawerSave () {
      this.$refs.editForm.getValidateForm(() => {
        const data = this.$clone(this.projectForm);
        this.handleSaveData(data);
        this.pageConfigLoading = false;
      });
    },
    // 删除
    handleDelete (row) {
      if (row.status === 0) return;
      const statusConfig = {
        keyId: 'inspectTypeId',
        keyName: 'inspectTypeName',
        row,
        api: 'inspectType/setDelete'
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
    // 启用/禁用
    handleWarStatus (row) {
      const statusTips = row.status === 0 ? this.$t('button.disable') : this.$t('button.enable');
      const status = row.status === 0 ? 1 : 0;
      this.$confirm(`${statusTips}${row.inspectTypeName}?`, statusTips, {
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('inspectType/setStatus', { inspectTypeId: row.id, status }).then(res => {
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
