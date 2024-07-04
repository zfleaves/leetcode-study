<template>
  <div>
    <query-page
        res="sysQueryPage"
        :page-config="pageConfig"
        :loading.sync="loading"
        :tableSeleList.sync="tableSeleList"
        @fnName="pageConfigBtnFnName"
        @resetTableConfigList="pageConfigResetTableConfigList"
        @onRefresh="pageConfigOnRefresh"
        @pages="pageConfigPages"
        @searchEvent="searchEvent">
        <div slot="mainBtnSlot"  slot-scope="{pageConfig}">
          <g-button :operationButtons="pageConfig.mainOperateBtn" @butFnName="mainOperateBtn">
            <div slot="button-sysHandleImport" slot-scope="{parameter}" class="imgUrlList">
              <label for="uploads" @click="uploads">
                <el-button
                  style="margin: 0 10px;"
                  :name="parameter.code"
                  :size="parameter.size"
                  :type="parameter.type"
                  :plain="parameter.plain"
                  :disabled="parameter.disabled"
                  :icon="parameter.icon"
                  :class="parameter.class"
                  :style="parameter.style">
                  {{$t(parameter.name)}}
                </el-button>
              </label>
              <input type="file" id="uploads" :disabled="butDisabled" ref="file"
              style="position:absolute;z-index:99;opacity: 0;line-height: 36px;width: 100px;display: none;" @change="_getCheckMaterial($event)">
            </div>
            <query-table-header
              :info="pageConfig.mainTable.tableHeader"
              :columns="pageConfig.mainTable.tableList || []"
              @onColumnChange="onColumnChange"
              @onRefresh="onRefresh">
            </query-table-header>
          </g-button>
        </div>
        <template slot="mainTable" slot-scope="config">
          <div class="cons-table-t content" ref="cons"  :style="{height: `${tableHeight + 56}px`}">
            <div class="fixed-scroll" style="display: flex;flex-direction: column;">
              <div class="treeTitle">
                <div v-for="item in config.scope.tableList" :key="item.prop" :class="item.prop">
                  {{$t(item.label)}}
                </div>
              </div>
              <div class="treeCons">
                  <div class="fixed-scroll">
                      <el-tree
                          :data="config.scope.tableData" ref="tree"
                          node-key="id" props='props'
                          class="tree-content"
                          :default-expanded-keys="treeExpandData"
                          :filter-node-method="filterNode"
                          :expand-on-click-node="false">
                          <template slot="empty">
                            <no-data>
                            </no-data>
                          </template>
                            <div class="custom-tree-node" slot-scope="{data }" :class="'level' + data.level">
                                <div class="classifyName">
                                    <tooltips :isCustomWidth="true" :value="data.classifyName">
                                    </tooltips>
                                </div>
                                <div class="classifyCode">{{data.classifyCode}}</div>
                                <div class="sorts">{{data.sorts}}</div>
                                <div class="classifyDiscription">
                                    <tooltips :isCustomWidth="true" :value="data.classifyDiscription">
                                    </tooltips>
                                </div>
                                <div class="createByName">
                                    <tooltips :isCustomWidth="true" :value="data.createByName">
                                    </tooltips>
                                </div>
                                <div class="updateByName">
                                    <tooltips :isCustomWidth="true" :value="data.updateByName">
                                    </tooltips>
                                </div>
                                <div class="updateTime">
                                    <tooltips :isCustomWidth="true" :value="data.updateTime | setDate">
                                    </tooltips>
                                </div>
                                <div class="operate" v-if="data.levels > 0">
                                    <template  v-for="but in config.scope.operateButs">
                                        <el-button :key="but.id" :class="but.class"
                                            v-if="!but.noAuth ? authButtonList.indexOf(but.authCode) >= 0 : true"
                                            @click.stop.prevent="setSlotFn(but, data)" type="text" size="mini" v-fast-click>
                                            {{$t(but.name)}}
                                        </el-button>
                                    </template>
                                </div>
                                <div v-else>
                                  <el-button
                                      v-if="authButtonList.indexOf('addSubordinate') >= 0"
                                      @click.stop.prevent="handleAddSubordinate(data)" type="text"
                                      size="mini" v-fast-click>
                                      {{$t('classifyWarehouse.addSubordinate')}}
                                  </el-button>
                                </div>
                              </div>
                      </el-tree>
                  </div>
              </div>
            </div>
          </div>
        </template>
    </query-page>
    <!-- 添加分类 -->
    <g-drawer :title="$t(`button.${type}`) + $t('classifyWarehouse.classify')"
      v-if="pageConfigLoading" :display.sync="pageConfigLoading" :inner="true" width="35%">
      <div slot="body">
            <g-edit-form
                ref="editForm"
                v-if="pageConfigLoading"
                type="add"
                :tableConfig="pageConfig.mainFormConfig"
                :projectForm="projectForm"
                :customRules="customRules">
            </g-edit-form>
      </div>
      <div slot="but">
        <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small" @click="classifyDrawerClose">
          {{$t('button.close')}}
        </el-button>
        <el-button size="small" type="primary" icon="el-icon-circle-check"
                   @click="classifyDrawerSave" v-fast-click>
          {{$t('button.save')}}
        </el-button>
      </div>
    </g-drawer>
    <!-- 导入提示 -->
    <el-dialog :title="$t('classifyWarehouse.tips')" center top="15%"
    :showClose="false" :closeOnClickModal="false" :closeOnPressEscape="false"
    :visible.sync="dialogFormVisible">
      <div style="line-height: 80px; font-size: 18px;text-align: left;margin-left:20px">
        {{$t('classifyWarehouse.ImportingTips')}}
        <span style="color:red">{{wait_time}}</span>S</div>
      <div slot="footer" class="footer">
        <el-button :disabled="wait_time > 0" type="primary" @click="importRefresh">{{$t('button.refresh')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Page from './config.js';
  import {search} from 'mixins/searchMixins';
  import Auth from 'util/auth';

  export default {
    name: 'classifyWarehouse',
    mixins: [search],
    data () {
      const classifyCodeValid = (rule, value, callback) => {
        if (value) {
          const regular = /^[0-9a-zA-Z._-]*$/;
          if (!regular.test(value)) {
            callback(new Error(this.$t('classifyWarehouse.pleaseEnterANumber')));
          } else {
            this.$store.dispatch('classifyWarehouse/checkClassifycode', { classifyCode: value, classifyId: this.projectForm.id || '' }).then(res => {
              if (res.results) {
                // 重复，请重新输入
                callback(new Error(`${this.$t(this.$t('fConfig.classifyCode'))}${this.$t('tips.repeat')}`));
              } else {
                callback();
              }
            });
          }
        } else {
          callback(new Error(`${this.$t('tips.pleaseEnter')}${this.$t('fConfig.classifyCode')}`));
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
          classifyDiscription: '',
          classifyName: '',
          classifyCode: '',
          costType: '01',
          dataSources: '1',
          levels: 0,
          parentId: 0,
          sorts: 0,
          orgId: this.$utils.Auth.hasUserInfo().orgId,
          parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
          createTime: this.$utils.commonUtil.formatTime(new Date()),
          createByName: this.$utils.Auth.hasUserInfo().userName
        },
        cloneProjectForm: {},
        // 搜索数据
        searchData: {
          classifyCode: '',
          classifyDiscription: '',
          classifyName: '',
          createByName: '',
          updateByName: ''
        },
        butDisabled: false,
        importUrl: '',
        dialogFormVisible: false,
        wait_time: 10,
        auth_timetimer: null,
        buildClassify: false,
        treeExpandData: [],
        type: 'add',
        customRules: {
          classifyCode: [{ required: true, validator: classifyCodeValid, trigger: 'blur' }]
        }
      };
    },
    async created () {
      await this._getTableDataList();
      this.cloneProjectForm = this.$clone(this.projectForm);
    },
    components: {
        queryTableHeader(resolve) {
            require(['components/basicComponents/global/table/queryTable/queryTableHeader.vue'], resolve);
        }
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList('classifyWarehouse/getClassifyTree', false, () => {
          this.treeExpandData = this.pageConfig.mainTable.tableData.length && [this.pageConfig.mainTable.tableData[0].id];
        });
      },
      // 搜索
      searchEvent({eventName, params}) {
        if (eventName === 'search') {
          this.loading = true;
          this.$refs.tree.filter(this.pageConfig.searchControls.searchData);
        }
        if (eventName === 'clear') {
          for (const key in this.cloneSearchData) {
            this.$set(this.pageConfig.searchControls.searchData, key, this.cloneSearchData[key]);
          }
          this._getTableDataList();
        }
      },
      // 同步国标库
      sysHandleAdd() {
        // 已存在材料分类，不能同步国标库
        this.chackClassify('synchroGBDatabase', this.$t('classifyWarehouse.syncErrorTips'));
      },
      // 一键清除
      sysHandleDeleteAll() {
        // 已引用材料分类，不能一键清除
        this.chackClassify('deleteAll', this.$t('classifyWarehouse.deleteErrorTips'));
      },
      // 校验是否能删或同步
      chackClassify(type, errorMessage) {
        const url = type === 'synchroGBDatabase' ? 'classifyWarehouse/checkClassifyMaterial' : 'classifyWarehouse/checkDeleteClassifyMaterial';
        const classifyMessage = type === 'synchroGBDatabase' ? this.$t('classifyWarehouse.classifyMessageSynchroGBDatabase') : this.$t('classifyWarehouse.classifyMessageDeleteAll');
        this.$store.dispatch(url).then(res => {
            if (res.status === 0) {
                if (res.results) {
                  this.$confirm(classifyMessage, this.$t(`classifyWarehouse.${type}`), {
                    confirmButtonText: this.$t('button.determine'),
                    cancelButtonText: this.$t('button.close'),
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                  }).then(() => {
                    if (type === 'synchroGBDatabase') {
                      this.syncClassify();
                    }
                    if (type === 'deleteAll') {
                      this.deleteClassify();
                    }
                  }).catch(() => {});
                } else {
                  this.$message.error(errorMessage);
                }
            } else {
                this.$message.error(this.$t(`exception.${res.errorCode}`));
            }
        });
      },
      // 一键同步
      syncClassify() {
        this.$store.dispatch('classifyWarehouse/syncClassifyMaterial').then(res => {
            if (res.status === 0) {
              // 同步国标库材料分类成功
              this.$message.success(this.$t('classifyWarehouse.syncClassifyMaterialTips'));
              this._getTableDataList();
            } else {
              this.$message.error(this.$t(`exception.${res.errorCode}`));
            }
        });
      },
      // 一键删除
      deleteClassify() {
        this.$store.dispatch('classifyWarehouse/deleteClassifyMaterial').then(res => {
            if (res.status === 0) {
              // 一键清除材料分类成功
              this.$message.success(this.$t('classifyWarehouse.deleteClassifyTips'));
              this._getTableDataList();
            } else {
              this.$message.error(this.$t(`exception.${res.errorCode}`));
            }
        });
      },
      // 添加下级
      handleAddSubordinate(row) {
        const data = this.$clone(row);
        this.projectForm = this.$clone(this.cloneProjectForm);
        this.projectForm.levels = data.levels + 1;
        this.projectForm.parentId = data.id;
        this.projectForm.sorts = data.children.length ? data.children.length * 4 : 1;
        this.type = 'add';
        this.pageConfigLoading = true;
      },
      // 修改分类
      handleEdit(row) {
        const data = this.$clone(row);
        this.projectForm = data;
        this.type = 'edit';
        this.pageConfigLoading = true;
      },
      // 关闭添加弹出框
      classifyDrawerClose() {
        this.pageConfigLoading = false;
        this.projectForm = this.$clone(this.cloneProjectForm);
      },
      // 保存分类
      classifyDrawerSave() {
        this.$refs.editForm.getValidateForm(() => {
          this.handleSaveData(this.projectForm);
          this.pageConfigLoading = false;
        });
      },
      // 删除
      handleDelete(row) {
        const statusConfig = {
          keyId: 'classifyId',
          keyName: 'classifyName',
          row,
          api: 'classifyWarehouse/setClassifyDelete'
        };
        this.setDataDelete(statusConfig, row);
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
      // 条件过滤
      filterNode(value, data) {
        const arr = ['classifyCode', 'classifyDiscription', 'classifyName', 'createByName', 'updateByName'];
        const tableData = [];
        const showList = [];
        for (const item of arr) {
          if (value[item]) {
            tableData.push(item);
          if (data[item] && (data[item].indexOf(value[item]) !== -1)) {
            showList.push(item);
          }
          }
        }
        this.loading = false;
        if (tableData.length === 0) {
          return true;
        }
        if (tableData.length === showList.length) {
          return true;
        } else {
          return false;
        }
      },
      // 插槽点击事件
      setSlotFn(btnParameter, row) {
          this[btnParameter.fn](row);
      },
       // 操作按钮
      mainOperateBtn(fnName) {
        console.log(fnName, 'fnName');
        fnName && this[fnName]();
      },
      // 下载模板
      sysHandleDownloadTemplate() {
        this.handleDownloadTemplate('classifyWarehouse/classifyDownloadTemplate', this.$t('menu.classifyWarehouse'));
      },
      // 列的显示与隐藏
      onColumnChange(list) {
          // 将list传出重置 tableList 配置
          this.pageConfigResetTableConfigList(list);
      },
      // 刷新 列表数据
      onRefresh() {
          this._getTableDataList();
      },
      uploads() {
        // 第一次导入时尽量保证数据齐全，已导入数据后，不再支持直接导入第三层级数据，如需补录三层及以下数据，请通过手动添加完成！
        // 注意：表头文字如果为红色，则必填，请务必正确填写。
        // const varietiesDownloadTemplateMessage = `${this.$t('tips.classifyWarehouseImportTips1')}<br/>
        //       <span style="color: red">${this.$t('tips.classifyWarehouseImportTips2')}</span>`;
        // this.$confirm(varietiesDownloadTemplateMessage, this.$t('tips.tips'), {
        //   confirmButtonText: this.$t('button.gotIt'),
        //   cancelButtonText: this.$t('button.close'),
        //   dangerouslyUseHTMLString: true,
        //   type: 'warning'
        // }).then(() => {
          this.$refs.file.dispatchEvent(new MouseEvent('click'));
        // }).catch(() => { });
      },
      _getCheckMaterial(e) {
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
      _getImportMaterialClassfy(formData) {
          this.dialogFormVisible = true;
          this.auth_timetimer = setInterval(() => {
            this.wait_time--;
            if (this.wait_time <= 0) {
              clearInterval(this.auth_timetimer);
            }
          }, 1000);
           this.$store.dispatch('classifyWarehouse/setImportExcelData', formData).then(res => {
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
.cons {
  background-color: #fff;
  color: #303133;
  padding: 10px;
  transition: .3s;
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
    border: 1px solid #EBEEF5;
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
    .classifyDiscription{
      width: 200px;
    }
    .createByName{
      width: 100px;
    }
    .updateByName{
      width: 100px;
    }
    .updateTime{
      width: 120px;
    }
    .sorts{
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
    border: 1px solid #EBEEF5;
    border-top: 0;
    /deep/ .el-tree-node__content {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #EBEEF5;
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
        .classifyDiscription{
          width: 200px;
          height: 100%;
          float: left;
        }
        .createByName{
          width: 100px;
          height: 100%;
          float: left;
        }
        .updateByName{
          width: 100px;
          height: 100%;
          float: left;
        }
        .updateTime{
          width: 120px;
          height: 100%;
          float: left;
        }
        .sorts{
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
.imgUrlList{
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
}
</style>
