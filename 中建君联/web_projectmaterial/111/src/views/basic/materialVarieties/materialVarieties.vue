<template>
  <div>
    <query-page res="sysQueryPage" :page-config="pageConfig" :loading.sync="loading" :tableSeleList.sync="tableSeleList"
      @searchData="getSearchData" @fnName="pageConfigBtnFnName" @resetTableConfigList="pageConfigResetTableConfigList"
      @onRefresh="pageConfigOnRefresh" @pages="pageConfigPages" @searchEvent="searchEvent">
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
          <template slot="table-status" slot-scope="{row, item}">
            <span class="varieties-status" :class="'status'+ row[item.prop]">
              {{row.status === 0 ? $t('button.enable') : $t('button.disable')}}
            </span>
          </template>
          <template slot="table-attachment" slot-scope="{row}">
            <el-image v-if="row.src" style="width: 100%; height: 23px" :src="row.src" fit='contain'
              :preview-src-list="[row.src]">
            </el-image>
          </template>
          <template slot="table-buts" slot-scope="{scope}">
            <el-button
              v-if="authButtonList.indexOf('disableEnable') >= 0"
              @click.stop.prevent="handleStatus(scope)" type="text" size="mini" v-fast-click
              :class="scope.status === 0 ? 'danger' : ''">
              {{scope.status === 0 ? $t('button.disable') : $t('button.enable')}}
            </el-button>
          </template>
        </g-query-table>
      </template>
    </query-page>
    <!-- 添加分类 -->
    <g-drawer :title="title" v-if="pageConfigLoading" :display.sync="pageConfigLoading" :inner="true" width="35%">
      <div slot="body">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" type="add" :customRules="customRules"
          :tableConfig="pageConfig.mainFormConfig" :projectForm="projectForm">
          <!-- 关联分类 -->
          <template slot="form-classifyName" slot-scope="{scope, item}">
            <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
              :title="$t(item.label)">
              <div class="slot-input">
                <el-input v-model.trim="scope[item.prop]" :size="item.size || 'small'" clearable readonly>
                  <template slot="suffix">
                    <i class="multiple-choice-icon iconfont icon-menu" @click="handleBindClassify(scope)"></i>
                  </template>
                </el-input>
              </div>
            </el-form-item>
          </template>
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
    <!-- 选择材料分类 -->
    <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
      <selectClassify slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogVisible"
        :selectClassifyId="classifyRow.classifyId" @getData="getData" v-if="dialogVisible">
      </selectClassify>
    </g-dialog>
    <!-- 导入提示 -->
    <el-dialog title="提示" center top="15%" :showClose="false" :closeOnClickModal="false" :closeOnPressEscape="false"
      :visible.sync="dialogFormVisible">
      <div style="line-height: 80px; font-size: 18px;text-align: left;margin-left:20px">
        {{$t('materialVarieties.ImportingTips')}}
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
  name: 'materialVarieties',
  mixins: [search],
  data () {
    const varietiesCodeValid = (rule, value, callback) => {
      if (value) {
        const regular = /^[0-9a-zA-Z._-]*$/;
        if (!regular.test(value)) {
          callback(new Error(this.$t('materialVarieties.pleaseEnterANumber')));
        } else {
          this.$store.dispatch('materialVarieties/checkVarietitescode', { varietiesCode: value, materialVarietiesId: this.projectForm.id || '' }).then(res => {
            if (res.results) {
              // 重复，请重新输入
              callback(new Error(`${this.$t(this.$t('fConfig.varietiesCode'))}${this.$t('tips.repeat')}`));
            } else {
              callback();
            }
          });
        }
      } else {
        callback(new Error(`${this.$t('tips.pleaseEnter')}${this.$t('fConfig.varietiesCode')}`));
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
        classifyCode: '',
        classifyId: 0,
        classifyName: '',
        models: '',
        remarks: '',
        standards: '',
        status: 0,
        unit: '',
        varietiesCode: '',
        varietiesName: '',
        aliasName: '',
        referencePrice: '',
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      },
      cloneProjectForm: {},
      dialogVisible: false,
      dialogConfig: {
        title: this.$t('materialVarieties.build'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.8'
      },
      customRules: {
        varietiesCode: [{ required: true, validator: varietiesCodeValid, trigger: 'blur' }]
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
        classifyCode: '',
        classifyName: '',
        createByName: '',
        varietiesCode: '',
        varietiesName: '',
        standards: ''
      },
      type: 'add'
    };
  },
  components: {
    selectClassify (resolve) {
      require(['../compoent/selectClassify/selectClassify.vue'], resolve);
    },
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
      this.handleGetTableDataList('materialVarieties/getVarietiesPage', true, () => {
        this.setPageFileUrl();
      });
    },
    // 设置文件
    setPageFileUrl () {
      const data = this.pageConfig.mainTable.tableData;
      const attachment = this.pageConfig.mainTable.tableData.filter(item => {
        if (item.attachment && item.attachment.split(',').length > 1) {
          return item.attachment.split(',')[0];
        } else {
          return item.attachment;
        }
      });
      const attachments = attachment.map(v => v.attachment);
      this.$store.dispatch('publicApi/getFilepath', { fileIds: attachments }).then(res => {
        for (const item of data) {
          for (const val of res.results) {
            if (val.id === Number(item.attachment)) {
              this.$set(item, 'src', config.imageUrl + val.filePath);
            }
          }
        }
      });
    },
    // 添加
    sysHandleAdd () {
      this.type = 'add';
      this.title = `${this.$t('button.add')}${this.$t('menu.materialVarieties')}`;
      this.projectForm = this.$clone(this.cloneProjectForm);
      const formList = this.pageConfig.mainFormConfig.formList;
      for (const item of formList) {
        if (item.isEdit) {
          this.$set(item, 'inputStatus', 'edit');
        }
      }
      this.pageConfigLoading = true;
    },
    // 修改分类
    handleEdit (row) {
      this.$store.dispatch('materialVarieties/checkDeleteVarieties', { materialVarietiesId: row.id }).then(res => {
        if (res.status === 0) {
          const formList = this.pageConfig.mainFormConfig.formList;
          if (!res.results) {
            for (const item of formList) {
              if (item.isEdit) {
                this.$set(item, 'inputStatus', 'disable');
              }
            }
          } else {
            for (const item of formList) {
              if (item.isEdit) {
                this.$set(item, 'inputStatus', 'edit');
              }
            }
          }
          this.type = 'edit';
          const data = this.$clone(row);
          this.projectForm = data;
          this.pageConfigLoading = true;
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
      });
    },
    // 关闭添加弹出框
    classifyDrawerClose () {
      this.pageConfigLoading = false;
      this.projectForm = this.$clone(this.cloneProjectForm);
    },
    // 保存分类
    classifyDrawerSave () {
      this.$refs.editForm.getValidateForm(() => {
        const data = {
          varietiesName: this.projectForm.varietiesName,
          standards: this.projectForm.standards,
          unit: this.projectForm.unit,
          materialVarietiesId: this.projectForm.id || ''
        };
        this.$store.dispatch('materialVarieties/checkVarietitesRepeat', data).then(res => {
          if (res.status === 0 && !res.results) {
            this.handleSaveData(this.projectForm);
            this.pageConfigLoading = false;
          } else {
            this.$message.error(this.$t('tips.varietitesRepeatTips'));
          }
        });
      });
    },
    // 绑定分类
    handleBindClassify (row) {
      const data = this.$clone(row);
      this.classifyRow = data;
      this.buildClassify = false;
      this.dialogVisible = true;
    },
    // 按钮绑定
    handleBindClassifyBtn () {
      if (!this.tableSeleList.length) {
        this.$message.warning(this.$t('tips.pleaseSelectData'));
        return;
      }
      this.buildClassify = true;
      const data = this.$clone(this.tableSeleList[0]);
      this.classifyRow = data;
      this.dialogVisible = true;
    },
    // 获取勾选的分类
    getData (row) {
      if (!row.id) {
        this.$message.warning(this.$t('materialVarieties.nullClassify'));
      }
      if (this.buildClassify) {
        const data = {
          materialVarietiesIds: this.tableSeleList.map(v => v.id),
          classifyId: row.id,
          classifyCode: row.classifyCode,
          classifyName: row.parentClassifyName
        };
        this.$store.dispatch('materialVarieties/setBindClassify', data).then(res => {
          if (res.status === 1) {
            this.$message.error(`${this.$t('materialVarieties.build')}${this.$t('tips.fail')}`);
          } else {
            this.$message.success(`${this.$t('materialVarieties.build')}${this.$t('tips.success')}`);
            this._getTableDataList();
          }
          this.dialogVisible = false;
        });
      } else {
        this.projectForm.classifyId = row.id || 0;
        this.projectForm.classifyCode = row.classifyCode || '';
        this.projectForm.classifyName = row.parentClassifyName || '';
        this.dialogVisible = false;
      }
    },
    // 删除
    handleDelete (row) {
      const statusConfig = {
        keyId: 'materialVarietiesId',
        keyName: 'varietiesName',
        row,
        api: 'materialVarieties/setVarietiesDelete',
        isCreate: false
      };
      this.$store.dispatch('materialVarieties/checkDeleteVarieties', { materialVarietiesId: row.id }).then(res => {
        if (res.status === 0) {
          if (res.results) {
            this.setDataDelete(statusConfig, row);
          } else {
            // 已引用品种材料，不能一键清除
            this.$message.error(this.$t('materialVarieties.deleteErrorTips'));
          }
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
      });
    },
    // 启用/禁用
    handleStatus(row) {
      const statusTips = row.status === 0 ? this.$t('button.disable') : this.$t('button.enable');
      const status = row.status === 0 ? 1 : 0;
      this.$confirm(`${statusTips}${row.varietiesName}?`, statusTips, {
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      })
      .then(() => {
        this.$store.dispatch('materialVarieties/updateVarietitesStatus', {materialVarietiesId: row.id, status}).then(res => {
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
    // 下载模板
    sysHandleDownloadTemplate () {
      // 编辑模板内容时，请务必保证材料名称少于64个字。否则会影响后续数据引用后保存。
      // 注意：表头文字如果为红色，则必填，请务必正确填写。
      // 如材料名称的原内容较长，建议您拆解为规格来表达。
      const varietiesDownloadTemplateMessage = `${this.$t('materialVarieties.varietiesDownloadTemplateTips1')}<br/>
      <span style="color: red">${this.$t('materialVarieties.varietiesDownloadTemplateTips2')}</span><br/>
      ${this.$t('materialVarieties.varietiesDownloadTemplateTips3')}<br/>`;
      this.$confirm(varietiesDownloadTemplateMessage, this.$t('tips.tips'), {
        confirmButtonText: this.$t('button.gotIt'),
        cancelButtonText: this.$t('button.close'),
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.handleDownloadTemplate('materialVarieties/varietiesDownloadTemplate', this.$t('menu.materialVarieties'));
      }).catch(() => { });
    },
    // 一键清除
    sysHandleDeleteAll () {
      this.$store.dispatch('materialVarieties/checkDeleteAllVarieties').then(res => {
        if (res.status === 0) {
          if (res.results) {
            const varietiesMessage = `${this.$t('materialVarieties.varietiesMessage')}<br><span style='color:red'>${this.$t('materialVarieties.varietiesMessageDelete')}</span>`;
            this.$confirm(varietiesMessage, this.$t('button.oneClickClear'), {
              confirmButtonText: this.$t('button.determine'),
              cancelButtonText: this.$t('button.close'),
              dangerouslyUseHTMLString: true,
              type: 'warning'
            }).then(() => {
              this.$store.dispatch('materialVarieties/deleteAllVarieties').then(res => {
                if (res.status === 0) {
                  // 一键清除材料品种库成功
                  this.$message.success(this.$t('materialVarieties.deleteAllVarietiesTips'));
                  this._getTableDataList();
                } else {
                  this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
              });
            }).catch(() => { });
          } else {
            // 已引用材料分类，不能一键清除
            this.$message.error(this.$t('materialVarieties.deleteErrorTips'));
          }
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
      });
    },
    // 批量删除
    sysHandleDeletaBatch() {
      if (!this.tableSeleList.length) {
        this.$message.warning(this.$t('tips.pleaseSelectData'));
        return;
      }
      // <span style='color:red'>已引用过的品种无法删除，只能删除没被引用的品种！</span><br>您确定要删除所选品种吗？删除数据后无法找回，请谨慎考虑是否删除！
      this.$confirm(this.$t('tips.batchDeletionTips'), this.$t('button.batchDeletion'), {
        dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      }).then(() => {
        const materialVarietiesIds = this.tableSeleList.map(v => v.id);
        this.$store.dispatch('materialVarieties/deletaBatchVarieties', materialVarietiesIds).then(res => {
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
      this.$store.dispatch('materialVarieties/varietiesImportExcel', formData).then(res => {
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
.varieties-status {
  font-size: 14px;
  width: 100%;
  padding: 2px 10px;
  &.status0 {
    color: #24b568;
    background-color: rgba(36,181,104, 0.2);
  }
  &.status1 {
    color: #f73535;
    background-color: rgba(247,53,53, 0.2);
  }
}
</style>
