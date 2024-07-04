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
                <template slot="table-status" slot-scope="{row, item}">
                  <span class="war-status" :class="'status'+row[item.prop]">
                    {{setDicData(row[item.prop], item.selectList)}}
                  </span>
                </template>
                <template slot="table-warWarehouseShelves" slot-scope="{row, item}">
                  <div class="ellipsis midFont set" @click="handleWarWarehouseShelves(row, item)">
                    {{$t('warWarehouse.warWarehouseShelves')}}
                  </div>
                </template>
                <template slot="table-buts-suffix" slot-scope="{scope}">
                  <el-button
                    v-if="authButtonList.indexOf('disable') >= 0"
                    @click.stop.prevent="handleWarStatus(scope.row)" type="text" size="mini" v-fast-click>
                    {{scope.row.status === 0 ? $t('button.disable') : $t('button.enable')}}
                  </el-button>
                </template>
                <template slot="table-buts" slot-scope="{scope}">
                  <el-button
                    v-if="authButtonList.indexOf('delete') >= 0"
                    class="danger"
                    :disabled="handleDeleteStatus(scope)"
                    @click.stop.prevent="handleDelete(scope)" type="text" size="mini" v-fast-click>
                    {{$t('button.delete')}}
                  </el-button>
                </template>
            </g-query-table>
        </template>
    </query-page>
    <!-- 添加仓库 -->
    <g-drawer :title="title + $t(`button.${type}`)"
      v-if="pageConfigLoading" :display.sync="pageConfigLoading" :inner="true" width="35%">
      <div slot="body">
            <g-edit-form
                ref="editForm"
                v-if="pageConfigLoading"
                :type="type"
                :customRules="customRules"
                :tableConfig="pageConfig.mainFormConfig"
                :projectForm="projectForm"
                @editFormEvent="editFormEvent">
            </g-edit-form>
      </div>
      <div slot="but">
        <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small" @click="warWarehouseDrawerClose">
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
  import {search} from 'mixins/searchMixins';
  import Auth from 'util/auth';

  export default {
    name: 'warWarehouse',
    mixins: [search],
    data () {
      const warehouseCodeValid = (rule, value, callback) => {
        if (value) {
          const regular = /[\u4E00-\u9FA5]/g;
          if (regular.test(value)) {
            // 不能为汉字
            callback(new Error(this.$t('warWarehouse.warehouseCodeRuleTips')));
          } else {
            const params = {
              codeName: 'fConfig.warehouseCode',
              url: 'warWarehouse/chackWarehouseCode',
              keyName: 'warehouseCode',
              keyId: 'warehouseId'
            };
            this.repeatCheckData(rule, value, callback, params);
          }
        } else {
          callback();
        }
      };
      const warehouseNameValid = (rule, value, callback) => {
        if (value) {
          const params = {
            codeName: 'fConfig.warehouseName',
            url: 'warWarehouse/chackWarehouseName',
            keyName: 'warehouseName',
            keyId: 'warehouseId'
          };
          this.repeatCheckData(rule, value, callback, params);
        } else {
          callback(new Error(`${this.$t('tips.pleaseEnter')}${this.$t('fConfig.warehouseName')}`));
        }
      };
      return {
        // 查询页面基础参数
        page: new Page(),
        pageConfig: {},
        loading: false,
        // =====================
        tableSeleList: [],
        title: this.$t('menu.warWarehouse'),
        pageConfigLoading: false,
        projectForm: {
            address: '',
            materials: '',
            projectId: 0,
            remarks: '',
            warehouseCode: '',
            warehouseName: '',
            orgId: this.$utils.Auth.hasUserInfo().orgId,
            parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
            createTime: this.$utils.commonUtil.formatTime(new Date()),
            createByName: this.$utils.Auth.hasUserInfo().userName
        },
        cloneProjectForm: {},
        customRules: {
          warehouseCode: [{validator: warehouseCodeValid, trigger: 'blur' }],
          warehouseName: [{ required: true, validator: warehouseNameValid, trigger: 'blur' }]
        },
        // 搜索数据
        searchData: {
            createByName: '',
            projectName: '',
            status: '',
            updateTimeFrom: '',
            updateTimeTo: '',
            warehouseCode: '',
            warehouseName: ''
        },
        type: 'add'
      };
    },
    async created () {
      await this._getTableDataList();
      this.cloneProjectForm = this.$clone(this.projectForm);
    },
    methods: {
      repeatCheckData(rule, value, callback, params) {
        if (!value) {
          // 请输入
          callback(new Error(`${this.$t('tips.pleaseEnter')}${this.$t(params.codeName)}`));
        } else {
          this.$store.dispatch(params.url, {[params.keyName]: value, [params.keyId]: this.projectForm.id || '', projectId: this.projectForm.projectId || ''}).then(res => {
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
        const index = selectList && selectList.findIndex(v => v.dataCode === `0${value}`);
        if (index < 0) return '';
        return selectList ? selectList[index].dataName : '';
      },
      handleSetRouter (row) {
        this.type = 'info';
        this.projectForm = row;
        this.pageConfigLoading = true;
      },
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList('warWarehouse/getPageList');
      },
      // 添加
      sysHandleAdd() {
        this.type = 'add';
        this.title = this.$t('menu.warWarehouse');
        this.projectForm = this.$clone(this.cloneProjectForm);
        const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'projectName');
        if (index >= 0) {
          this.$set(this.pageConfig.mainFormConfig.formList[index], 'inputStatus', 'edit');
        }
        this.pageConfigLoading = true;
      },
      // 修改
      handleEdit(row) {
        this.type = 'edit';
        this.title = this.$t('menu.warWarehouse');
        const data = this.$clone(row);
        this.projectForm = data;
        const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'projectName');
        if (index >= 0) {
          this.$set(this.pageConfig.mainFormConfig.formList[index], 'inputStatus', 'disable');
        }
        this.pageConfigLoading = true;
      },
      // 关闭弹出框
      warWarehouseDrawerClose() {
        this.pageConfigLoading = false;
        this.projectForm = this.$clone(this.cloneProjectForm);
      },
      // 保存
      warWarehouseDrawerSave() {
        this.$refs.editForm.getValidateForm(() => {
          const data = this.$clone(this.projectForm);
          this.handleSaveData(data);
          this.pageConfigLoading = false;
        });
      },
      // 仓库库位/货架子目管理
      handleWarWarehouseShelves(row, item) {
        const id = this.$base64.encode(row.id || 0);
        const createBy = this.$base64.encode(row.createBy || 0);
        this.$router.push(`/warWarehouseShelves/${id}/${createBy}`);
      },
      // 删除
      handleDelete(row) {
        if (row.status !== 3) return;
        const statusConfig = {
          keyId: 'warehouseId',
          keyName: 'warehouseName',
          row,
          api: 'warWarehouse/setDelete'
        };
        this.setDataDelete(statusConfig, row);
      },
      // 删除按钮状态
      handleDeleteStatus(row) {
        if (row.status === 3) {
          return false;
        } else {
          return true;
        }
      },
      // 启用/禁用
      handleWarStatus(row) {
        const statusTips = row.status === 0 ? this.$t('button.disable') : this.$t('button.enable');
        const status = row.status === 0 ? 1 : 0;
        this.$confirm(`${statusTips}${row.warehouseName}?`, statusTips, {
          confirmButtonText: this.$t('button.determine'),
          cancelButtonText: this.$t('button.close'),
          type: 'warning'
        })
        .then(() => {
          this.$store.dispatch('warWarehouse/setStatus', {warehouseId: row.id, status}).then(res => {
            if (res.status === 0) {
              this._getTableDataList();
              this.$message.success(`${statusTips}${this.$t('tips.success')}!`);
            } else {
              this.$message.error(`${statusTips}${this.$t('tips.fail')}!`);
            }
          });
        })
        .catch(() => {});
      },
      // 获取编辑表单的项目
      editFormEvent({eventName, params}) {
        if (eventName === 'clearProjcet') {
          this.handleClearProject(params);
        }
        if (eventName === 'projcet') {
          this.handleSelectProject(params);
        }
      },
      // ----------------------------- 项目 -------------------------------
      // 清除项目
      handleClearProject(params) {
        this.handleSelectProject({selectList: [], paramsConfig: params});
      },
      // 选择项目
      handleSelectProject(params) {
        this.handleSelect(params, 'projectName');
      },
      handleSelect(params, displayValue, callback) {
        const arr = params.selectList;
        const item = params.paramsConfig;
        this.setRelationData(item, arr, displayValue, callback);
      },
      // 主表联动赋值
      setRelationData(item, arr, displayValue, callback) {
        this.$set(this.projectForm, item.prop, arr.length > 0 ? arr[0][displayValue] : ''); // 显示值
        this.$set(this.projectForm, item.key, arr.length > 0 ? arr[0].id : ''); // 关键值
        if (item.isRelation) {
          item.relationList.forEach(row => {
            let value = '';
            if (arr.length) {
              value = arr[0][row.value] === undefined ? '' : arr[0][row.value];
            } else {
              value = '';
            }
            this.$set(this.projectForm, row.receive, value); // 显示值
          });
        }
      }
      // 禁用/启用
    }
  };
</script>

<style scoped lang="scss">
.war-status {
  font-size: 14px;
  width: 100%;
  padding: 2px 10px;
  &.status0 {
    color: #2b74ec;
    background-color: rgba(43,116,236, 0.2);
  }
  &.status1 {
    color: #24b568;
    background-color: rgba(36,181,104, 0.2);
  }
  &.status3 {
    color: #f73535;
    background-color: rgba(247,53,53, 0.2);
  }
}
</style>
