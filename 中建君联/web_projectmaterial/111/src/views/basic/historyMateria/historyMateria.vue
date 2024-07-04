
<template>
  <div>
    <query-page res="sysQueryPage" :page-config="pageConfig" :loading.sync="loading" :tableSeleList.sync="tableSeleList"
      @searchData="getSearchData" @fnName="pageConfigBtnFnName" @resetTableConfigList="pageConfigResetTableConfigList"
      @onRefresh="pageConfigOnRefresh" @pages="pageConfigPages" @searchEvent="searchEvent">
      <template slot="mainOperateBtn">
        <div class="approvalStateTips">
          <!-- 说明 -->
          {{$t('historyMateria.content')}}
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content" style="line-height: 24px;">
              <!-- 此功能仅仅用于查询，与任何业务无逻辑关系。作用：对使用施工管理云之前的历史材料数据进行导入，便于查询。 -->
              {{$t('historyMateria.contentTips1')}}
            </div>
            <span class="tips-item"><i class="el-icon-question"></i></span>
          </el-tooltip>
        </div>
      </template>
      <div slot="mainBtnSlot" slot-scope="{pageConfig}">
        <g-button :operationButtons="pageConfig.mainOperateBtn" @butFnName="mainOperateBtn">
          <div slot="button-sysHandleImport" slot-scope="{parameter}" class="imgUrlList">
            <label for="uploads" @click="uploads">
              <el-button style="margin: 0 10px;" :name="parameter.code" :size="parameter.size" :type="parameter.type"
                :plain="parameter.plain" :disabled="parameter.disabled" :icon="parameter.icon" :class="parameter.class"
                :style="parameter.style">
                {{$t(parameter.name)}}
              </el-button>
            </label>
            <input type="file" id="uploads" :disabled="butDisabled" ref="file"
              style="position:absolute;z-index:99;opacity: 0;line-height: 36px;width: 100px;display: none;"
              @change="_getCheckMaterial($event)">
          </div>
          <query-table-header :info="pageConfig.mainTable.tableHeader" :columns="pageConfig.mainTable.tableList || []"
            @onColumnChange="onColumnChange" @onRefresh="onRefresh">
          </query-table-header>
        </g-button>
      </div>
      <template slot="mainTable" slot-scope="config">
        <g-query-table :config="config.scope" :tableList.sync="tableSeleList"
          @fnName="pageConfigEmitQueryTableButtonFnName">
          <template slot="table-attachment" slot-scope="{row}">
            <el-image v-if="row.src" style="width: 100%; height: 23px" :src="row.src" fit='contain'
              :preview-src-list="[row.src]">
            </el-image>
          </template>
        </g-query-table>
      </template>
    </query-page>
    <!-- 添加分类 -->
    <g-drawer :title="title" v-if="pageConfigLoading" :display.sync="pageConfigLoading" :inner="true" width="35%">
      <div slot="body">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" type="add" :customRules="customRules"
          :tableConfig="pageConfig.mainFormConfig" :projectForm="projectForm"  @editFormEvent="editFormEvent">
        </g-edit-form>
      </div>
      <div slot="but">
        <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small" @click="classifyDrawerClose">
          {{$t('button.close')}}
        </el-button>
        <el-button size="small" type="primary" icon="el-icon-circle-check" @click="classifyDrawerSave" v-fast-click>
          {{$t('button.save')}}
        </el-button>
      </div>
    </g-drawer>
    <!-- 导入提示 -->
    <el-dialog :title="$t('tips.tips')" center top="15%" :showClose="false" :closeOnClickModal="false" :closeOnPressEscape="false"
      :visible.sync="dialogFormVisible">
      <div style="line-height: 80px; font-size: 18px;text-align: left;margin-left:20px">
        {{$t('historyMateria.ImportingTips')}}
        <span style="color:red">{{wait_time}}</span>S
      </div>
      <div slot="footer" class="footer">
        <el-button :disabled="wait_time > 0" type="primary" @click="importRefresh">{{$t('button.refresh')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Page from './config.js';
import { search } from 'mixins/searchMixins';
import config from 'util/config';

export default {
  name: 'historyMateria',
  mixins: [search],
  data () {
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
        'projectCode': '',
        'projectId': '',
        'projectName': '',
        brand: '',
        classifyName: '',
        includeTaxAmount: '',
        includeUnitPrice: '',
        materialName: '',
        models: '',
        qualityStandard: '',
        quantity: '',
        remarks: '',
        sorts: '',
        standards: '',
        supplierName: '',
        unit: '',
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      },
      cloneProjectForm: {},
      dialogVisible: false,
      dialogConfig: {
        title: this.$t('historyMateria.build'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.8'
      },
      customRules: {
      },
      classifyRow: {},
      butDisabled: false,
      importUrl: '',
      dialogFormVisible: false,
      wait_time: 10,
      auth_timetimer: null,
      buildClassify: false,
      // 搜索数据
      searchData: {
        brand: '',
        classifyName: '',
        materialName: '',
        models: '',
        projectName: '',
        qualityStandard: '',
        standards: '',
        supplierName: '',
        unit: ''
      },
      type: 'add'
    };
  },
  components: {
    queryTableHeader (resolve) {
      require(['components/basicComponents/global/table/queryTable/queryTableHeader.vue'], resolve);
    }
  },
  async created () {
    await this._getTableDataList();
    this.cloneProjectForm = this.$clone(this.projectForm);
  },
  methods: {
    // 获取表单
    _getTableDataList () {
      this.handleGetTableDataList('historyMateria/getVarietiesPage', true);
    },
    // 添加
    sysHandleAdd () {
      this.type = 'add';
      this.title = `${this.$t('button.add')}${this.$t('menu.historyMateria')}`;
      this.projectForm = this.$clone(this.cloneProjectForm);
      this.pageConfigLoading = true;
    },
    // 修改分类
    handleEdit (row) {
      this.type = 'edit';
      const data = this.$clone(row);
      this.projectForm = data;
      this.pageConfigLoading = true;
    },
    // 关闭添加弹出框
    classifyDrawerClose () {
      this.pageConfigLoading = false;
      this.projectForm = this.$clone(this.cloneProjectForm);
    },
    // 保存分类
    classifyDrawerSave () {
      this.$refs.editForm.getValidateForm(() => {
        this.handleSaveData(this.projectForm);
        this.pageConfigLoading = false;
      });
    },
    // 删除
    handleDelete (row) {
      const statusConfig = {
        keyId: 'materialHistoryId',
        keyName: 'materialName',
        row,
        api: 'historyMateria/setVarietiesDelete'
      };
      this.setDataDelete(statusConfig, row);
    },
    hanldeSetMoney () {
      const quantity = Number(this.projectForm.quantity) || 0;
      const includeUnitPrice = Number(this.projectForm.includeUnitPrice) || 0;
      const includeTaxAmount = quantity * includeUnitPrice; // 含税总价
      this.$set(this.projectForm, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));
    },
    // 删除
    setDataDelete(statusConfig, row) {
      this.$confirm(`${this.$t('button.delete')} ${statusConfig.row[statusConfig.keyName]}?`, this.$t('button.delete'), {
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch(statusConfig.api, { [statusConfig.keyId]: statusConfig.row.id }).then(res => {
            if (res.status === 0) {
              this._getTableDataList();
              this.$message.success(`${this.$t('button.delete')}${this.$t('tips.success')}!`);
            } else {
              this.$message.error(`${this.$t(`exception.${res.errorCode}`)}${this.$t('button.delete')}${this.$t('tips.fail')}!`);
            }
          });
        })
        .catch(() => { });
    },
    // 下载模板
    sysHandleDownloadTemplate () {
      this.handleDownloadTemplate('historyMateria/varietiesDownloadTemplate', '历史材料明细模板');
    },
    // 批量删除
    sysHandleDeletaBatch() {
      if (!this.tableSeleList.length) {
        this.$message.warning(this.$t('tips.pleaseSelectData'));
        return;
      }
      // 您确定要删除所选品种吗吗？只能删除没被引用的品种，删除数据后无法找回，请谨慎考虑是否删除！
      this.$confirm(this.$t('historyMateria.batchDeletionTips'), this.$t('button.batchDeletion'), {
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      }).then(() => {
        const materialHistoryIds = this.tableSeleList.map(v => v.id);
        this.$store.dispatch('historyMateria/deletaBatchVarieties', materialHistoryIds).then(res => {
          if (res.status === 0) {
            // 一键清除材料品种库成功
            this.$message.success(`${this.$t('button.batchDeletion')}${this.$t('tips.success')}`);
            this.pageNo = 1;
            this._getTableDataList();
          } else {
            this.$message.error(this.$t(`exception.${res.errorCode}`));
          }
        });
      }).catch(() => { });
    },
    // 获取编辑表单的项目
    editFormEvent({eventName, params}) {
      if (eventName === 'clearProjcet') {
        this.handleClearProject(params);
      }
      if (eventName === 'projcet') {
        this.handleSelectProject(params);
      }
      if (eventName === 'relationTable') {
        this.handleOtherSelect(params);
      }
    },
    // 清除项目
    handleClearProject(params) {
      this.handleSelectProject({selectList: [], paramsConfig: params});
    },
    // 选择项目
    handleSelectProject(params) {
      this.handleSelect(params, 'projectName');
    },
    // 确认选择
    handleSelect(params, displayValue, callback) {
      const arr = params.selectList;
      const item = params.paramsConfig;
      if (!callback) { // 弹窗选择后的下拉框回调
        if (item.otherOperate && item.otherOperateFun) {
          callback = this[item.otherOperateFun];
        }
      }
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
      if (item.clearRelation && item.clearRelation.length) {
        this.clearRelationData(item.clearRelation);
      }
      callback && callback();
    },
    // 下拉选择框
    handleOtherSelect(params) {
      const arr = params.selectList;
      const item = params.paramsConfig;
      this.setSelectValue(item, this.projectForm[item.prop]);
    },
    // 下拉框联动赋值
    setSelectValue(item, event, cancleFlag = true) {
      if (item.otherOperate && cancleFlag) {
        item.otherOperateFun && this[item.otherOperateFun]();
      }
    },
    // 操作按钮
    mainOperateBtn (fnName) {
      this[fnName]();
    },
    // 列的显示与隐藏
    onColumnChange (list) {
      // 将list传出重置 tableList 配置
      this.pageConfigResetTableConfigList(list);
    },
    // 刷新 列表数据
    onRefresh () {
      this._getTableDataList();
    },
    uploads () {
      this.$refs.file.dispatchEvent(new MouseEvent('click'));
    },
    _getCheckMaterial (e) {
      this.wait_time = 10;
      const file = e.target.files[0];
      if (!file) return;
      const fileType = file && file.name.split('.')[1];
      const regex = /(xls|xlsx)$/;
      if (!regex.test(fileType)) {
        this.$message.error(this.$t('tips.importTips'));
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      this._getImportMaterialClassfy(formData);
    },
    _getImportMaterialClassfy (formData) {
      this.dialogFormVisible = true;
      this.auth_timetimer = setInterval(() => {
        this.wait_time--;
        if (this.wait_time <= 0) {
          clearInterval(this.auth_timetimer);
        }
      }, 1000);
      this.$store.dispatch('historyMateria/varietiesImportExcel', formData).then(res => {
        if (res.status === 1) {
          this.$message.error(res.errorMsg ? res.errorMsg : res.errList[0].errMsg);
          this.$refs.file.value = '';
          this.dialogFormVisible = false;
        } else {
          if (res.data && res.data.length) {
            this.$message.success(`${this.$t('button.Import')}${this.$t('tips.success')}`);
          } else {
            // 无导入数据，请查看导入表格是否正确。
            this.$message.info(this.$t('tips.unllImport'));
          }
          this.$refs.file.value = '';
          this._getTableDataList();
          this.dialogFormVisible = false;
        }
      }).catch(e => {
        this.$refs.file.value = '';
        this.dialogFormVisible = false;
      });
    },
    // 刷新导入
    importRefresh () {
      clearInterval(this.auth_timetimer);
      this._getTableDataList();
      this.dialogFormVisible = false;
    }
  }
};
</script>

<style scoped lang="scss">
.approvalStateTips {
  position: absolute;
  left: 0;
  top: 0;
  line-height: 40px;
  font-size: 14px;
}
/deep/ .el-image-viewer__close {
  color: white;
}
.cons {
  background-color: #fff;
  color: #303133;
  padding: 10px;
  transition: 0.3s;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  position: relative;
  .content {
    position: relative;
    width: 100%;
  }
}
.treeTitle {
  height: 40px;
  width: calc(100% - 2px);
  display: flex;
  border: 1px solid #ebeef5;
  background: #fafafa;
  line-height: 40px;
  color: #909399;
  text-align: left;
  font-size: 14px;
  font-weight: bold;
  .classifyName {
    width: calc(100% - 950px);
    padding-left: 10px;
    box-sizing: border-box;
  }
  .classifyCode {
    width: 150px;
  }
  .classifyDiscription {
    width: 200px;
  }
  .createByName {
    width: 100px;
  }
  .updateByName {
    width: 100px;
  }
  .updateTime {
    width: 120px;
  }
  .sorts {
    width: 100px;
  }
  .operate {
    width: 180px;
    text-align: center;
  }
}
.treeCons {
  flex: 1;
  width: calc(100% - 2px);
  position: relative;
  // background: pink;
  border: 1px solid #ebeef5;
  border-top: 0;
  /deep/ .el-tree-node__content {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ebeef5;
  }
  .custom-tree-node {
    // display: flex;
    flex-direction: row;
    height: 100%;
    flex: 1;
    text-align: left;
    .classifyName {
      float: left;
      height: 100%;
      width: calc(100% - 950px);
    }
    .classifyCode {
      width: 150px;
      height: 100%;
      float: left;
    }
    .classifyDiscription {
      width: 200px;
      height: 100%;
      float: left;
    }
    .createByName {
      width: 100px;
      height: 100%;
      float: left;
    }
    .updateByName {
      width: 100px;
      height: 100%;
      float: left;
    }
    .updateTime {
      width: 120px;
      height: 100%;
      float: left;
    }
    .sorts {
      width: 100px;
      height: 100%;
      float: left;
    }
    .operate {
      width: 180px;
      height: 100%;
    }
  }
}
.imgUrlList {
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
}
</style>
