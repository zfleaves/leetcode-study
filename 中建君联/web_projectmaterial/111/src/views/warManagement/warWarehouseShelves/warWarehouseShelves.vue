<template>
  <div>
    <query-page res="sysQueryPage" :page-config="pageConfig" :loading.sync="loading" :tableSeleList.sync="tableSeleList"
      @searchData="getSearchData" @fnName="pageConfigBtnFnName" @resetTableConfigList="pageConfigResetTableConfigList"
      @onRefresh="pageConfigOnRefresh" @pages="pageConfigPages" @searchEvent="searchEvent">
      <template slot="mainTable" slot-scope="config">
        <g-query-table :config="config.scope" :tableList.sync="tableSeleList"
          @fnName="pageConfigEmitQueryTableButtonFnName">
        </g-query-table>
      </template>
    </query-page>
    <!-- 添加仓库 -->
    <g-drawer :title="title" v-if="pageConfigLoading" :display.sync="pageConfigLoading" :inner="true" width="35%">
      <div slot="body">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" :type="type" :customRules="customRules"
          :tableConfig="pageConfig.mainFormConfig" :projectForm="projectForm" @editFormEvent="editFormEvent">
        </g-edit-form>
      </div>
      <div slot="but" v-if="type !== 'info'">
        <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small"
          @click="warWarehouseDrawerClose">
          {{$t('button.close')}}
        </el-button>
        <el-button size="small" type="primary" icon="el-icon-circle-check" @click="warWarehouseDrawerSave" v-fast-click>
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
  name: 'warWarehouseShelves',
  mixins: [search],
  data () {
    const warehouseCodeValid = (rule, value, callback) => {
      if (value) {
        const regular = /[\u4E00-\u9FA5]/g;
        if (regular.test(value)) {
          // 不能为汉字
          callback(new Error(this.$t('warWarehouseShelves.warehouseCodeRuleTips')));
        } else {
          const params = {
            codeName: 'warWarehouseShelves.warehouseShelvesCode',
            url: 'warWarehouseShelves/chackWarehouseShelvesCode',
            keyName: 'warehouseShelvesCode',
            keyId: 'warehouseShelvesId'
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
          codeName: 'fConfig.warehouseShelvesName',
          url: 'warWarehouseShelves/chackWarehouseShelvesName',
          keyName: 'warehouseShelvesName',
          keyId: 'warehouseShelvesId'
        };
        this.repeatCheckData(rule, value, callback, params);
      } else {
        callback(new Error(`${this.$t('tips.pleaseEnter')}${this.$t('fConfig.warehouseShelvesName')}`));
      }
    };
    return {
      // 查询页面基础参数
      page: new Page(),
      pageConfig: {},
      loading: false,
      // =====================
      tableSeleList: [],
      title: '',
      pageConfigLoading: false,
      projectForm: {
        address: '',
        materials: '',
        projectId: 0,
        remarks: '',
        warehouseShelvesCode: '',
        warehouseShelvesName: '',
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      },
      cloneProjectForm: {},
      customRules: {
        warehouseShelvesCode: [{ validator: warehouseCodeValid, trigger: 'blur' }],
        warehouseShelvesName: [{ required: true, validator: warehouseNameValid, trigger: 'blur' }]
      },
      warehouseId: 0,
      // 搜索数据
      searchData: {
        createByName: '',
        warehouseShelvesCode: '',
        warehouseShelvesName: ''
      },
      type: 'add',
      createBy: 0
    };
  },
  async created () {
    this.cloneProjectForm = this.$clone(this.projectForm);
    this.warehouseId = Number(this.$base64.decode(this.$route.params.id));
    this.createBy = Number(this.$base64.decode(this.$route.params.createBy));
    await this._getTableDataList();
  },
  methods: {
    repeatCheckData (rule, value, callback, params) {
      if (!value) {
        // 请输入
        callback(new Error(`${this.$t('tips.pleaseEnter')}${this.$t(params.codeName)}`));
      } else {
        this.$store.dispatch(params.url, { [params.keyName]: value, [params.keyId]: this.projectForm.id || '', warehouseId: this.warehouseId }).then(res => {
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
      return selectList[index].dataName;
    },
    handleSetRouter (type, row) {
      this.type = 'info';
      this.pageConfigLoading = true;
    },
    // 获取表单
    _getTableDataList () {
      this.pageConfig.searchControls.searchData.warehouseId = this.warehouseId;
      this.handleGetTableDataList('warWarehouseShelves/getPageList');
    },
    // 添加
    sysHandleAdd () {
      this.type = 'add';
      this.title = `${this.$t('button.add')}${this.$t('menu.warWarehouseShelves')}`;
      this.projectForm = this.$clone(this.cloneProjectForm);
      this.pageConfigLoading = true;
    },
    // 修改
    handleEdit (row) {
      this.type = 'edit';
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
        data.warehouseId = this.warehouseId;
        this.handleSaveData(data);
        this.pageConfigLoading = false;
      });
    },
    // 仓库库位/货架子目管理
    handleWarWarehouseShelves (row, item) {
      const id = this.$base64.encode(row.id || 0);
      this.$router.push(`/warWarehouseShelves/${id}`);
    },
    // 删除
    handleDelete (row) {
      const statusConfig = {
        keyId: 'warehouseShelvesId',
        keyName: 'warehouseShelvesName',
        row,
        api: 'warWarehouseShelves/setDelete'
      };
      this.setDataDelete(statusConfig, row);
    },
    // 获取编辑表单的项目
    editFormEvent ({ eventName, params }) {
      if (eventName === 'clearProjcet') {
        this.handleClearProject(params);
      }
      if (eventName === 'projcet') {
        this.handleSelectProject(params);
      }
    },
    // ----------------------------- 项目 -------------------------------
    // 清除项目
    handleClearProject (params) {
      this.handleSelectProject({ selectList: [], paramsConfig: params });
    },
    // 选择项目
    handleSelectProject (params) {
      this.handleSelect(params, 'projectName');
    },
    handleSelect (params, displayValue, callback) {
      const arr = params.selectList;
      const item = params.paramsConfig;
      this.setRelationData(item, arr, displayValue, callback);
    },
    // 主表联动赋值
    setRelationData (item, arr, displayValue, callback) {
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
    background-color: rgba(43, 116, 236, 0.2);
  }
  &.status1 {
    color: #24b568;
    background-color: rgba(36, 181, 104, 0.2);
  }
  &.status3 {
    color: #f73535;
    background-color: rgba(247, 53, 53, 0.2);
  }
}
</style>
