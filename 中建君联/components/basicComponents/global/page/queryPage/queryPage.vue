<template>
  <div class="generalPage">
    <div class="roleCons">
      <div class="content">
        <div class="cons">
          <div class="search_cons" ref="searchCons" v-if="pageConfig.searchControls.formShow">
            <template v-if="pageConfig.searchControls.searchSlotShow">
              <slot name="search" :configForm="pageConfig.searchControls" :isSearch="isSearch"
                :searchFormValue="pageConfig.searchControls.searchData">
              </slot>
            </template>
            <g-search-form :configForm="pageConfig.searchControls" v-else :isSearch="isSearch"
              :searchFormValue="pageConfig.searchControls.searchData" :searchData.sync="searchData" v-on="$listeners">
            </g-search-form>
          </div>
          <div class="table_cons">
            <div class="table_cons_table" ref="table_cons">
              <div class="table-fixed-content">
                <div class="fixed">
                  <slot name="otherOperateTips"></slot>
                  <div class="table_btn slot_btn" ref="table_btn"
                    v-if="pageConfig.mainOperateBtn.length || pageConfig.mainBtnSlotShow || pageConfig.mainTable.tableHeader.showColumnCtrl">
                    <slot name="mainOperateBtnTips"></slot>
                    <div v-if="pageConfig.mainBtnSlotShow">
                      <slot name="mainBtnSlot" :pageConfig="pageConfig"></slot>
                    </div>
                    <g-button v-else :operationButtons="pageConfig.mainOperateBtn" @butFnName="mainOperateBtn">
                      <!-- 初始化查询页面 -->
                      <el-button size='small' type='primary' icon='el-icon-plus' class="other" @click='handleAddLanguageInit'
                          v-if='btnInitShow()'>
                          初始化页面翻译
                      </el-button>
                      <query-table-header :tableHeight="pageConfig.mainTable.maxHeight"
                        :info="pageConfig.mainTable.tableHeader" :columns="pageConfig.mainTable.tableList || []"
                        :customShow="pageConfig.mainTable.customShow" @onColumnChange="onColumnChange"
                        @onRefresh="onRefreshPage" @onFixedColumnChange="onFixedColumnChange"></query-table-header>
                    </g-button>
                    <slot name="mainOperateBtn"></slot>
                  </div>
                  <div class="table_content" v-loading="loading">
                    <slot name="mainTable" :scope="pageConfig.mainTable"></slot>
                  </div>
                  <div class="table_pages" v-if="pageConfig.mainTable.paging">
                    <g-to-page ref="Page" :page-sizes="pageConfig.mainTable.pageSizes"
                      :pager-count="pageConfig.mainTable.pagerCount" :page-size="pageSize"
                      :total="pageConfig.mainTable.total" @sentPages="getPages">
                    </g-to-page>
                  </div>
                  <div class="footer" v-if="pageConfig.isFooterShow">
                    <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small"
                      @click="handleDialogStatus('close')">{{$t('button.close')}}</el-button>
                    <el-button size="small" type="primary" icon="el-icon-circle-check"
                      @click="handleDialogStatus('save')" v-fast-click>{{$t('button.determine')}}</el-button>
                  </div>
                  <slot name="footer"></slot>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 流程审批弹出框 -->
    <el-dialog v-dialogDrag
      :title="`${config.subSystemCode === 'oa' ? title : $t(`menu.${this.$route.name}`)}${$t('tips.processSubmission')}`"
      v-if="dialogProcess" :top="processName==='sendProcess'?'3vh':'25vh'"
      :width="processName==='sendProcess'?'800px':'400px'" center :visible.sync="dialogProcess">
      <component @closeDialog="handleCloseDialog" :is="processName" :startForm="sendProcessForm"
        :processSubmitApi="processParmas" v-if="dialogProcess">
      </component>
    </el-dialog>
    <!-- 打印提示 -->
    <el-dialog v-dialogDrag :visible.sync="printFlag" v-if="printFlag" :title="$t('print.printPlugIn')"
      @close='handleClose' :close-on-click-modal="false" top="25vh" width="70%">
      <div style="height: 300px;padding: 40px;">
        <div style="padding: 40px;">
          <p style="line-height: 40px;" v-for="(item,index) in printStr" :key="index">
            <span style="color: #FF00FF">{{item.title}}</span>
            <el-button @click.stop="handleDownload(item)" type="text" size="small">
              {{item.tips}}
            </el-button>
          </p>
          <p style="line-height: 40px;">
            {{$t('print.restartBrowserAfterDownload')}}
          </p>
        </div>
      </div>
    </el-dialog>

    <!-- 选择打印模板 -->
    <el-dialog v-dialogDrag :visible.sync="printShow" v-if="printShow" :title="$t('print.setPrintTemplate')" center
      top="15%" width="40%">
      <el-form :model="printForm" :rules="rules" status-icon class="demo-ruleForm dialog-form" ref="printForm">
        <!-- 打印模板 -->
        <el-form-item :label="$t('print.printModelName')" prop="printModelId" label-width="100px">
          <el-select v-model.trim="printForm.printModelId" size="small" clearable :filterable="true"
            style="width: 100%">
            <el-option v-for="(child, i) in printTemplateList" :key="i" :label="child.printModelName" :value="child.id">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="footer">
          <el-button icon="el-icon-circle-check" type="primary" class="urgent" size="small"
            @click.native.prevent="() => printShow = false">{{$t('print.close')}}
          </el-button>
          <el-button size="small" icon="el-icon-circle-check" type="primary"
            @click.native.prevent="submitLoginPass('printForm')">
            <!-- 配置打印模板 -->
            {{$t('button.determine')}}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { closeRoute } from 'mixins/index';
import { templatePrint } from 'mixins/templatePrint';
import config from 'util';

export default {
  name: 'queryPage',
  mixins: [closeRoute, templatePrint],
  data () {
    return {
      config,
      tableHeaderCon: [],
      pageSize: 10,
      pageNo: 1,
      searchData: {},
      processName: 'sendProcess',
      dialogProcess: false,
      shortMsssage: true,
      assigneeUsersList: [], // 处理人
      copyPersonArr: [], // 抄送人
      selectedUsersList: [], // 选中的人员
      selectedUserDialog: false,
      sendProcessForm: {},
      printFlag: false,
      title: '',
      printShow: false,
      printTemplateList: [],
      printForm: {
        printModelId: ''
      },
      rules: {
        printModelId: [{ required: true, message: `${this.$t('tips.pleaseSelect')}${this.$t('print.printModelName')}`, trigger: 'change' }]
      },
      chromatographyPrinting: false
    };
  },
  props: {
    // 配置数据
    pageConfig: {
      type: Object,
      default: () => {
        const parmas = {
          // 搜索配置
          searchControls: {},
          // 操作按钮
          mainOperateBtn: [],
          mainTable: {},
          // 流程提交
          processParmas: {}
        };
        return parmas;
      }
    },
    // 列表选中的数据
    tableSeleList: {
      type: Array,
      default: () => []
    },
    isSearch: {
      type: Boolean,
      default: true
    },
    // 加载动画
    loading: {
      type: Boolean,
      default: false
    },
    dialogHeight: {
      type: Number,
      default: 300
    }
  },
  created () {
    this.pageSize = this.pageConfig.mainTable.pageSize;
    this.processParmas = this.pageConfig.processParmas;
  },
  computed: {
    printStr () {
      const printStr = this.$store.state.diaLog.printStr || [];
      this.printStrFn(printStr);
      return printStr;
    }
  },
  components: {
    queryTableHeader (resolve) {
      require(['../../table/queryTable/queryTableHeader.vue'], resolve);
    },
    // 提交流程
    sendProcess (resolve) {
      require(['components/basicComponents/process/sendProcess'], resolve);
    },
    // 无流程时提交弹出框
    noProcess (resolve) {
      require(['components/basicComponents/process/noProcess.vue'], resolve);
    }
  },
  mounted () {
    this.$nextTick(() => {
      const consHeight = this.$refs.table_cons ? this.$refs.table_cons.offsetHeight : 522;
      const searchCons = this.$refs.searchCons ? this.$refs.searchCons.offsetHeight : 0;
      let tableHeight = 0;
      const pagingHeight = this.pageConfig.mainTable.paging ? 60 : 20;
      const reduceHeight = this.pageConfig.mainTable.reduceHeight || 0;
      if (this.pageConfig.isFooterShow) {
        tableHeight = this.dialogHeight - searchCons - 70 - pagingHeight - reduceHeight;
      } else {
        tableHeight = consHeight - pagingHeight - reduceHeight;
      }
      if (this.$refs.table_btn) {
        tableHeight = tableHeight - 60;
      }
      if (this.$route.name === 'regulatoryArchiveLibrary') {
        tableHeight = tableHeight - 20;
      }
      this.pageConfig.mainTable.height = this.$clone(tableHeight);
      this.pageConfig.mainTable.maxHeight = this.$clone(tableHeight);
    });
  },
  watch: {
    searchData: {
      handler () {
        this.$emit('searchData', this.searchData);
      },
      deep: true
    }
  },
  methods: {
    btnInitShow() {
        return window.location.href.indexOf('http://localhost') !== -1;
    },
    // 操作按钮
    mainOperateBtn (fnName) {
      if (fnName === 'sysHandleStartProcess' || fnName === 'sysHandleScenarioFlowSubmit' ||
        fnName === 'noAuthHandleStartProcess' || fnName === 'sysHandleMonitorProcess' || fnName === 'sysHandleScenarioFlowMonitor' ||
        fnName === 'sysHandlePrint' || fnName === 'sysHandleBatchPrint') {
        this[fnName]();
      } else {
        this.$emit('fnName', fnName);
      }
    },
    // 列的显示与隐藏
    onColumnChange (list) {
      // 将list传出重置 tableList 配置
      this.$emit('resetTableConfigList', list);
    },
    // 刷新 列表数据
    onRefreshPage () {
      this.$emit('onRefresh', true);
    },
    onFixedColumnChange () {
    },
    // 分页
    getPages (obj) {
      if (obj.isSzieChange) {
        this.pageSize = obj.pageSize;
      } else {
        this.pageNo = obj.pageNo;
      }
      this.$emit('pages', { pageSize: this.pageSize, pageNo: this.pageNo });
    },
    // =========== 流程
    // 不判断数据填写人
    noAuthHandleStartProcess () {
      // 判断是否勾选
      if (this.tableSeleList.length === 0) {
        this.$message.warning(this.$t('tips.processTips1'));
        return;
      }
      if (this.tableSeleList.length > 1) {
        // 数据选择过多，请选择一条数据进行处理！
        this.$message.error(this.$t('tips.selectDataTips'));
        return;
      }
      // 判断是否否已提交
      if (this.tableSeleList[0].flowStatus !== '0') {
        this.$message.warning(this.$t('tips.selectDataTips'));
        return;
      }
      // 获取开始流程信息
      const startInfo = this.processParmas.startInfo;
      const nextParmas = {};
      if (startInfo.parmasList && startInfo.parmasList.length) {
        for (const item of startInfo.parmasList) {
          nextParmas[item.receive] = this.tableSeleList[0][item.value] || '';
        }
      } else {
        nextParmas[startInfo.parmas] = this.tableSeleList[0].id || '';
      }
      startInfo.formCode && this.$set(nextParmas, 'formCode', startInfo.formCode);
      this.$store.dispatch(startInfo.url, nextParmas).then(res => {
        this.sendProcessForm = res.results;
        if (this.sendProcessForm.workflowNextNodes === null) {
          this.processName = 'noProcess';
        } else {
          this.processName = 'sendProcess';
        }
        // 将当前行存储于缓存中
        localStorage.setItem('dataInfo', JSON.stringify(this.tableSeleList[0]));
        this.dialogProcess = true;
      });
    },
    // 流程提交
    sysHandleStartProcess () {
      // 判断是否勾选
      if (this.tableSeleList.length === 0) {
        this.$message.warning(this.$t('tips.processTips1'));
        return;
      }
      if (this.tableSeleList.length > 1) {
        // 数据选择过多，请选择一条数据进行处理！
        this.$message.error(this.$t('tips.selectDataTips'));
        return;
      }
      // 判断是否本人
      if (this.tableSeleList[0].createBy !== this.$utils.Auth.hasUserInfo().userId) {
        this.$message.warning(this.$t('tips.processTips2'));
        return;
      }
      // 判断是否否已提交
      if (this.tableSeleList[0].flowStatus !== '0') {
        this.$message.warning(this.$t('tips.processTips3'));
        return;
      }
      // 该数据未分配状态， 不能提交流程
      if (this.$route.name === 'qualityTaskDistribute' && this.tableSeleList[0].distributeStatus !== 1) {
        this.$message.warning(this.$t('qualityTaskDistribute.processTips4'));
        return;
      }
      // 获取开始流程信息
      const startInfo = this.processParmas.startInfo;
      const nextParmas = {};
      if (startInfo.parmasList && startInfo.parmasList.length) {
        for (const item of startInfo.parmasList) {
          nextParmas[item.receive] = this.tableSeleList[0][item.value] || '';
        }
      } else {
        nextParmas[startInfo.parmas] = this.tableSeleList[0].id || '';
      }
      startInfo.formCode && this.$set(nextParmas, 'formCode', startInfo.formCode);
      this.$store.dispatch(startInfo.url, nextParmas).then(res => {
        this.sendProcessForm = res.results;
        if (this.sendProcessForm.workflowNextNodes === null) {
          this.processName = 'noProcess';
        } else {
          this.processName = 'sendProcess';
        }
        // 将当前行存储于缓存中
        localStorage.setItem('dataInfo', JSON.stringify(this.tableSeleList[0]));
        this.dialogProcess = true;
      });
    },
    // 事项提交
    sysHandleScenarioFlowSubmit () {
      // 判断是否勾选
      if (this.tableSeleList.length === 0) {
        this.$message.warning(this.$t('tips.processTips1'));
        return;
      }
      if (this.tableSeleList.length > 1) {
        // 数据选择过多，请选择一条数据进行处理！
        this.$message.error(this.$t('tips.selectDataTips'));
        return;
      }
      // 判断是否本人
      if (this.tableSeleList[0].createBy !== this.$utils.Auth.hasUserInfo().userId) {
        this.$message.warning(this.$t('tips.processTips2'));
        return;
      }
      // 判断是否否已提交
      if (this.tableSeleList[0].flowStatus !== '0') {
        this.$message.warning(this.$t('tips.stepProcessTips3'));
        return;
      }
      // 获取开始流程信息
      const startInfo = this.processParmas.startInfo;
      const nextParmas = {};
      if (startInfo.parmasList && startInfo.parmasList.length) {
        for (const item of startInfo.parmasList) {
          nextParmas[item.receive] = this.tableSeleList[0][item.value] || '';
        }
      } else {
        nextParmas[startInfo.parmas] = this.tableSeleList[0].id || '';
      }
      startInfo.formCode && this.$set(nextParmas, 'formCode', startInfo.formCode);
      this.$store.dispatch(startInfo.url, nextParmas).then(res => {
        this.sendProcessForm = res.results;
        if (this.sendProcessForm.workflowNextNodes === null) {
          this.processName = 'noProcess';
        } else {
          this.processName = 'sendProcess';
        }
        // 将当前行存储于缓存中
        localStorage.setItem('dataInfo', JSON.stringify(this.tableSeleList[0]));
        this.dialogProcess = true;
      });
    },
    // 流程监控
    sysHandleMonitorProcess () {
      // 判断是否勾选
      if (this.tableSeleList.length === 0) {
        // 请勾选一条数据查看流程审批
        this.$message.warning(this.$t('tips.monitorProcessTips1'));
        return;
      }
      if (this.tableSeleList.length > 1) {
        // 数据选择过多，请选择一条数据进行处理！
        this.$message.error(this.$t('tips.selectDataTips'));
        return;
      }
      // 判断是否否已提交
      if (this.tableSeleList[0].flowStatus === '0') {
        // 该流程未提交
        this.$message.warning(this.$t('tips.monitorProcessTips2'));
        return;
      }
      // 判断是否否已提交
      if (!this.tableSeleList[0].taskId) {
        // 该数据没有流程
        this.$message.warning(this.$t('tips.monitorProcessTips3'));
        return;
      }
      // 将当前行存储于缓存中 是否为场景流程
      localStorage.setItem('processType', this.pageConfig.processType);
      this.$store.commit('diaLog/set_process_dialog', this.tableSeleList[0].taskId);
    },
    // 事项监控
    sysHandleScenarioFlowMonitor () {
      // 判断是否勾选
      if (this.tableSeleList.length === 0) {
        // 请勾选一条数据查看事项审批
        this.$message.warning(this.$t('tips.stepMonitorProcessTips1'));
        return;
      }
      if (this.tableSeleList.length > 1) {
        // 数据选择过多，请选择一条数据进行处理！
        this.$message.error(this.$t('tips.selectDataTips'));
        return;
      }
      // 判断是否否已提交
      if (this.tableSeleList[0].flowStatus === '0') {
        // 该事项未提交
        this.$message.warning(this.$t('tips.stepMonitorProcessTips2'));
        return;
      }
      // 判断是否否已提交
      if (!this.tableSeleList[0].taskId) {
        // 该数据没有事项
        this.$message.warning(this.$t('tips.stepMonitorProcessTips3'));
        return;
      }
      // 将当前行存储于缓存中 是否为场景流程
      localStorage.setItem('processType', this.pageConfig.processType);
      this.$store.commit('diaLog/set_process_dialog', this.tableSeleList[0].taskId);
    },
    // 打印
    async sysHandlePrint () {
      if (this.tableSeleList.length === 0) {
        // 请您先选中想要提打印标签的一行数据
        this.$message({
          message: this.$t('print.selePrintLabelTips'),
          type: 'info'
        });
        return;
      }
      if (this.tableSeleList.length > 1) {
        // 数据选择过多，请选择一条数据进行处理！
        this.$message.error(this.$t('tips.selectDataTips'));
        return;
      }
      this.chromatographyPrinting = false;
      const row = this.tableSeleList[0];
      let businessCompanyId = row.businessCompanyId || '';
      if (!row.businessCompanyId) {
        const params = {
          projectStatus: [1, 2, 3],
          projectName: row.projectName
        };
        await this.$store.dispatch('proProject/getProjectPermissonPage', params).then(res => {
          if (res.status === 0) {
            businessCompanyId = res.results.length > 0 ? res.results[0].belongCompanyId : '';
          }
        });
      }
      const printModelCode = this.pageConfig.formCode;
      await this.$store.dispatch('publicApi/getPrintModelPrintcodeList', { belongCompanyIds: [businessCompanyId], printModelCode }).then(res => {
        if (res.status === 0 && res.results && res.results.length) {
          if (res.results.length === 1) {
            const printModelId = this.$base64.encode(res.results[0].id);
            this.jumpPrintDesign(row, printModelId);
          } else {
            this.printTemplateList = res.results;
            this.printShow = true;
          }
        } else {
          // 未配置打印模板，将使用默认模板打印！
          this.$confirm(this.$t('tips.selectPrintDataTips'), this.$t('tips.tips'), {
            cancelButtonClass: 'button-close',
            confirmButtonText: this.$t('button.determine'),
            cancelButtonText: this.$t('button.close'),
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }).then(() => {
            const printModelId = this.$base64.encode(0);
            this.jumpPrintDesign(row, printModelId);
          }).catch();
        }
      });
    },
    jumpPrintDesign (row, printModelId) {
      const printModelCode = this.$base64.encode(this.pageConfig.formCode);
      const taskId = this.$base64.encode(row.taskId); // 打印
      const id = this.$base64.encode(row.id);
      let loadRouteName = this.$route.name;
      if (this.pageConfig.formCode === 'adSealUse') {
        loadRouteName = 'usingApplication';
      } else if (this.pageConfig.formCode === 'otherCostReimburse') {
        loadRouteName = 'otherCostReimburse';
      } else if (this.pageConfig.formCode === 'oReimburseOther') {
        loadRouteName = 'otherCostReimburseDirectFree';
      }
      const RouteTitleObj = { name: 'printDesign', loadRouteName, translateType: 'print' };
      localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
      const flowStatus = this.$base64.encode(row.flowStatus);
      this.$router.push(`/printDesign/${printModelCode}/${taskId}/${id}/${loadRouteName}?printModelId=${printModelId}&flowStatus=${flowStatus}`);
      this.printShow = false;
    },
    // 选择打印模板
    submitLoginPass (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.chromatographyPrinting) {
            this.getPrintInit(this.printForm.printModelId);
          } else {
            const row = this.tableSeleList[0];
            const printModelId = this.$base64.encode(this.printForm.printModelId);
            this.jumpPrintDesign(row, printModelId);
          }
        }
      });
    },
    // 导出
    sysHandleExport (row) { },
    // 关闭 流程审批弹出框
    handleCloseDialog (status) {
      if (status) {
        this.onRefreshPage();
      }
      localStorage.removeItem('dataInfo');
      this.dialogProcess = false;
    },
    // 弹出框页面按钮
    handleDialogStatus (status) {
      this.$emit('dialogEvent', status);
    },
    printStrFn (printStr) {
      if (printStr.length) {
        this.printFlag = true;
      } else {
        this.printFlag = false;
      }
    },
    // 关闭弹出框
    handleClose () {
      this.$store.commit('diaLog/SET_PRINT_STR');
      this.setRoute();
    },
    // 下载打印插件
    handleDownload (item) {
      const url = item.url;
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      document.body.appendChild(link);
      link.click();
      this.$message({
        message: this.$t('print.restartBrowserAfterDownload'),
        type: 'error'
      });
    },
    // 初始化页面翻译
    handleAddLanguageInit () {
      const data = {
          Language: 'zh',
          subSystemCode: this.$utils.config.subSystemCode,
          pageCode: this.$route.name
      };
      this.$store.dispatch('publicApi/languageValuesPublicApi', data).then(res => {
          if (res.status === 0 && res.results && res.results.length > 0) {
              this.$confirm('当前页面已存在翻译，是否继续进行初始化？', '提示', {
                  cancelButtonClass: 'button-close',
                  confirmButtonText: this.$t('button.determine'),
                  cancelButtonText: this.$t('button.close'),
                  dangerouslyUseHTMLString: true,
                  type: 'warning'
              }).then(() => {
                  this.initLanguage();
              }).catch((e) => {
              });
          } else {
              this.$confirm('确定进行翻译初始化吗？', '提示', {
                  cancelButtonClass: 'button-close',
                  confirmButtonText: this.$t('button.determine'),
                  cancelButtonText: this.$t('button.close'),
                  dangerouslyUseHTMLString: true,
                  type: 'warning'
              }).then(() => {
                  this.initLanguage();
              }).catch((e) => {
              });
          }
      });
  },
  initLanguage() {
      // 通用
      const currencyList = ['button', 'tips', 'dialog', 'time', 'fConfig', 'tagsView', 'subSystemType', 'subSystem',
      'print', 'exception', 'login', 'supplierLogin', 'app'];
      const pageConfig = this.pageConfig;
      const details = [];
      const tableList = pageConfig.mainTable.tableList;
      for (const item of tableList) {
          const key = currencyList.findIndex(v => v === item.label.split('.')[0]);
          const prop = item.label.split('.')[1];
          key < 0 && prop && item.name && details.push({
              columnCode: prop,
              columnName: item.name
          });
          if (item.children && item.children.length) {
              for (const val of item.children) {
                  const key = currencyList.findIndex(v => v === val.label.split('.')[0]);
                  const prop = val.label.split('.')[1];
                  key < 0 && prop && val.name && details.push({
                      columnCode: prop,
                      columnName: val.name
                  });
              }
          }
      }
      const data = {
          subSystemCode: this.$utils.config.subSystemCode,
          pageCode: this.$route.name,
          details
      };
      this.$store.dispatch('publicApi/initLanguagePublicApi', data).then(res => {
          if (res.status === 0) {
              this.$message.success('初始化成功');
              this.languageClear();
          } else {
              this.$message.error('初始化失败');
          }
      });
  },
  languageClear() {
      this.$store.dispatch('publicApi/languageClearPublicApi').then(res => {
          if (res.status === 0) {
              this.$message.success('清除缓存成功');
          } else {
              this.$message.error('清除缓存失败');
          }
      });
  }
  }
};
</script>

<style scoped lang="scss">
.dialog-form {
  height: 100px;
  padding: 20px;
}
@import "components/basicComponents/styles/generalPage.scss";
</style>
