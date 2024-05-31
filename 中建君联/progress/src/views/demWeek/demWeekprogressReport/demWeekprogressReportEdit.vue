<!--
 * @Author: your name
 * @Date: 2021-02-01 17:09:48
 * @LastEditTime: 2022-03-03 15:34:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demWeek\demWeekprogressReport\demWeekprogressReportEdit.vue
-->
<template>
  <div>
    <edit-page @editEvent="editEvent" v-loading="loading">
      <div slot="editPage">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" :type="type" :tableConfig="pageConfig.mainFormConfig"
          :projectForm="pageConfig.projectForm" @editFormEvent="editFormEvent">
        </g-edit-form>
        <!-- 明细清单 -->
        <div v-if="pageConfigLoading">
          <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
            <g-edit-title :title="$t(`demWeekprogressReport.${subTable.subTableName}`)">
              <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
              </g-button>
            </g-edit-title>
            <g-edit-table :ref="subTable.subTableName" :type="type" :isSelection="subTable.isSelection"
              :tableConfig="subTable.tableList" :subTable='subTable' :customRules="subTableCustomRules"
              :delete.sync="deleteList[subTable.subTableName]" @editTableEvent='editTableEvent'>
              <template slot="edit-table-alreadyFinishedProgress" slot-scope="{scope}">
                <span class="smallFont">{{scope.alreadyFinishedProgress | setFinishedProgress}}</span>
              </template>
              <template slot="edit-table-currentFinishProgress" slot-scope="{scope}">
                <span class="smallFont">{{scope.currentFinishProgress | setFinishedProgress}}</span>
              </template>
              <template slot="edit-table-realFinishProgress" slot-scope="{item, scope}">
                <el-number controls-position="right" size="small" v-if="item.inputStatus !== 'disable'"
                  :maxlength="Number(item.maxlength)" :precision="Number(item.precision)"
                  v-model.trim="scope.realFinishProgress" :placeholder="item.placeholder"
                  :clearable="item.clearable === undefined ? true : item.clearable" :max="100"
                  :min="Number(scope.alreadyFinishedProgress * 100)">
                </el-number>
                <span v-else class="smallFont">{{scope.realFinishProgress}}</span>
              </template>
              <!-- 劳务 -->
              <template slot="edit-table-children-weekprogressReportLabours" slot-scope="{item, scope, rowIndex}">
                <span class="smallFont set" @click="handleSelectResources(item, scope, rowIndex)">
                  {{scope[item.prop] |  setResources}} {{$t('fConfig.term')}}
                </span>
              </template>
              <!-- 材料 -->
              <template slot="edit-table-children-weekprogressReportMaterials" slot-scope="{item, scope, rowIndex}">
                <span class="smallFont set" @click="handleSelectResources(item, scope, rowIndex)">
                  {{scope[item.prop] |  setResources}} {{$t('fConfig.term')}}
                </span>
              </template>
              <!-- 机械 -->
              <template slot="edit-table-children-weekprogressReportMachineries" slot-scope="{item, scope, rowIndex}">
                <span class="smallFont set" @click="handleSelectResources(item, scope, rowIndex)">
                  {{scope[item.prop] |  setResources}} {{$t('fConfig.term')}}
                </span>
              </template>
              <!-- 其它 -->
              <template slot="edit-table-children-weekprogressReportOthers" slot-scope="{item, scope, rowIndex}">
                <span class="smallFont set" @click="handleSelectResources(item, scope, rowIndex)">
                  {{scope[item.prop] |  setResources}} {{$t('fConfig.term')}}
                </span>
              </template>
            </g-edit-table>
          </div>
        </div>
      </div>
    </edit-page>

    <!-- 选择资源投入 -->
    <g-dialog v-if="resourceVisible" :dialogConfig="resourceConfig" :isVisible.sync="resourceVisible">
                <!-- varietiesDateilUrl='demMasterPlan/getPlanWeekList' -->
        <progressDetail slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="resourceVisible" :type="type"
          :details="details"  :projectId='pageConfig.projectForm.projectId || 0'
          varietiesDateilUrl='demMasterPlan/getPlanWeekList' :nodeCode='nodeCode'
          :row="currentRow" :currentResources="currentResources"  @getData="getResourceData" v-if="resourceVisible">
        </progressDetail>
    </g-dialog>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';

export default {
  name: 'demWeekprogressReportEdit',
  mixins: [editPage],
  filters: {
    setFinishedProgress (val) {
      if (!val) return 0;
      const progress = val * 100;
      return Number(progress.toFixed(4));
    },
    setResources (val) {
      if (!val || val.length === 0) return 0;
      return val.length;
    }
  },
  components: {
    progressDetail (resolve) {
      require(['views/buildLog/components/progressDetail/progressDetail.vue'], resolve);
    }
  },
  data () {
    const numValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error(`${this.$t('demWeekprogressReport.realFinishProgress')} ${this.$t('tips.numTips')}`));
      } else {
        callback();
      }
    };
    return {
      page: new Page(),
      projectForm: {
        applyMonth: '',
        attachment: '',
        docNo: '',
        overallCompleteCode: '',
        overallCompleteValue: '',
        overallTaskOverview: '',
        projectId: '',
        remarks: '',
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      },
      // 选择资源
      dialogVisible: false,
      dialogConfig: {
        title: this.$t('dialog.selectResources'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      varietiesIdList: [],
      selectList: [],
      back: '',
      subTableRow: {},
      subTableCustomRules: {
        realFinishProgress: [{ required: true, validator: numValid, trigger: 'blur' }]
      },
      nodeCode: '',
      week: 1,
      currentResources: {},
      currentIndex: 0,
      currentRow: {},
      multitonColumns: '',
      // 选择材料
      resourceVisible: false,
      resourceConfig: {
        // 完善资源投入
        title: this.$t('dialog.finishResources'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      }
    };
  },
  props: {
    processParmas: {
      type: Object,
      default: () => { }
    }
  },
  methods: {
    // 选择资源投入
    handleSelectResources (item, row, index) {
      this.currentResources = this.$clone(item);
      this.currentIndex = index;
      this.currentRow = this.$clone(row);
      this.details = this.$clone(row[item.prop]);
      // this.resourceConfig.title = `${this.$t(item.label)} ${this.$t('tips.details')}`;
      this.resourceVisible = true;
    },
    // 获取信息
    getResourceData({details}) {
      const tableData = this.$clone(this.pageConfig.subTableConfig['progressWeekProgressReportDetail'].tableData);
      const tableIndex = tableData.findIndex(v => v.cid === this.currentRow.cid);
      if (tableIndex > -1) {
        const prop = this.currentResources.prop;
        this.$set(tableData[tableIndex].details[this.currentIndex], prop, details);
      }
      console.log(tableData, 'tableData');
      this.$set(this.pageConfig.subTableConfig['progressWeekProgressReportDetail'], 'tableData', []);
      this.$set(this.pageConfig.subTableConfig['progressWeekProgressReportDetail'], 'tableData', tableData);
      this.resourceVisible = false;
    },
    // 子表第二层删除
    sysHandleDelete(row, index) {
      const projectDetailName = row.details[index].projectDetailName;
      this.$confirm(`${this.$t('button.delete')} ${projectDetailName}?`, this.$t('button.delete'), {
          confirmButtonText: this.$t('button.determine'),
          cancelButtonText: this.$t('button.close'),
          type: 'warning'
      }).then(() => {
          const details = this.$clone(row.details);
          details.splice(index, 1);
          this.$set(row, 'details', details);
          const tableData = this.$clone(this.pageConfig.subTableConfig['progressWeekProgressReportDetail'].tableData);
          this.$set(this.pageConfig.subTableConfig['progressWeekProgressReportDetail'], 'tableData', []);
          this.$set(this.pageConfig.subTableConfig['progressWeekProgressReportDetail'], 'tableData', tableData);
      }).catch(() => { });
      // this.$forceUpdate();
    },
    // 获取info数据
    async _getInfoData (id = 0) {
      await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
        const tableData = this.pageConfig.subTableConfig['progressWeekProgressReportDetail'].tableData;
        for (const item of tableData) {
          const realFinishProgress = item.realFinishProgress * 100;
          // console.log(item.realFinishProgress);
          item.realFinishProgress = Number(realFinishProgress.toFixed(4));
        }
        this.$nextTick(() => {
          const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'applyDate');
          this.$refs.editForm.weekChange(this.pageConfig.mainFormConfig.formList[index], this.pageConfig.projectForm.applyDate);
        });
      });
    },
    // 校验项目
    handleCheckProject (params) {
      this.handleSelect(params, 'projectName', () => {
        if (params.selectList.length === 0) {
          this.$set(this.pageConfig.projectForm, 'projectCode', '');
          this.$set(this.pageConfig.projectForm, 'applyDate', '');
        }
      });
    },
    // 选择明细
    sysHandleSelectDetail (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      if (!this.pageConfig.projectForm.applyDate) {
        // 请选择填报月份
        this.$message.error(this.$t('demWeekprogressReport.pleaseSelectApplyWeek'));
        return;
      }
      this.chackProject(tableName);
    },
    // 校验项目是否已做周期
    chackProject (tableName) {
      this.week = this.getWeekInMonth(new Date(this.pageConfig.projectForm.applyDate));
      const data = {
        weekprogressReportId: this.id || null,
        projectId: this.pageConfig.projectForm.projectId,
        applyWeek: this.week,
        applyDate: `${this.$utils.commonUtil.formatDate(this.pageConfig.projectForm.applyDate)}`
      };
      this.$store.dispatch('demWeekprogressReport/checkAreadyProject', data).then(res => {
        if (res.results) {
          // 该项目已添加此月度需求计划，不能再次添加。
          this.$message.error(this.$t('demWeekprogressReport.checkWeekPlanTips'));
        } else {
          const tableData = this.pageConfig.subTableConfig[tableName].tableData;
          // this.selectList = this.$clone(tableData);
          if (tableData.length === 0) {
            this.getDetails(tableName);
            return;
          }
          const messageTips = this.$t('demWeekprogressReport.getDetailTips');
          this.$confirm(messageTips, this.$t('demWeekprogressReport.getDetail'), {
            confirmButtonText: this.$t('button.determine'),
            cancelButtonText: this.$t('button.close'),
            type: 'warning'
          })
            .then(() => {
              this.getDetails(tableName);
            })
            .catch(() => { });
        }
      });
    },
    // 获取计划
    async getDetails (tableName) {
      const data = {
        projectId: this.pageConfig.projectForm.projectId,
        applyWeek: this.week,
        applyDate: `${this.$utils.commonUtil.formatDate(this.pageConfig.projectForm.applyDate)}`
      };
      this.$store.dispatch('demWeekprogressReport/getProjectWeekInfo', data).then(res => {
        if (!res.results || res.results.length === 0) {
          this.$message.error(this.$t('demWeekprogressReport.getProjectWeekInfo'));
          this.$set(this.pageConfig.projectForm, 'projectId', '');
          this.$set(this.pageConfig.projectForm, 'projectName', '');
          this.$set(this.pageConfig.projectForm, 'projectCode', '');
          this.$set(this.pageConfig.projectForm, 'applyDate', '');
          return;
        }
        const results = res.results[0].demWeekPlanDetails;
        this.$set(this.pageConfig.projectForm, 'weekPlanId', res.results[0].id);
        for (const item of results) {
          item.alreadyFinishedProgress = item.totalProgress || 0;
          item.realFinishProgress = '';
          item.eId = item.id;
          item.remarks = '';
          for (const child of item.details) {
            child.weekResourceId = child.id;
            delete child.id;
            child.planDetailQuantity = child.currentDetailQuantity;
            child.currentDetailQuantity = '';
            child.weekprogressReportLabours = []; // 劳务
            child.weekprogressReportMaterials = []; // 材料
            child.weekprogressReportMachineries = []; // 机械
            child.weekprogressReportOthers = []; // 其它
          }
          // const realFinishProgress = item.currentFinishProgress * 100;
          // item.realFinishProgress = Number(realFinishProgress.toFixed(4));
        }
        this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', results);
        this.deletTableCallback(tableName);
      });
    },
    // 获取主要完成任务
    deletTableCallback (tableName) {
      const tableData = this.pageConfig.subTableConfig[tableName].tableData;
      const overallTaskOverviewList = [];
      for (const item of tableData) {
        const overallTaskOverviewItem = `${item.taskName}(${item.realFinishProgress}%)`;
        overallTaskOverviewList.push(overallTaskOverviewItem);
      }
      this.$set(this.pageConfig.projectForm, 'overallTaskOverview', overallTaskOverviewList.join(','));
    },
    // 获取日志数据
    sysHandleGetApplyData (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      if (!this.pageConfig.projectForm.applyDate) {
        // 请选择填报月份
        this.$message.error(this.$t('demWeekprogressReport.pleaseSelectApplyWeek'));
        return;
      }
      const tableData = this.pageConfig.subTableConfig[tableName].tableData;
      if (tableData.length === 0) {
        // 请选择填报月份
        this.$message.error(this.$t('demWeekprogressReport.pleaseGetDetails'));
        return;
      }
      // 申请周标识
      this.week = this.getWeekInMonth(new Date(this.pageConfig.projectForm.applyDate));
      const applyWeekIdentify = this.getDateWeek(this.pageConfig.projectForm.applyDate, this.week);
      const data = {
        cid: tableData.map(v => v.cid),
        projectId: this.pageConfig.projectForm.projectId,
        applyWeekIdentify
      };
      console.log(data, 'data');
      this.$store.dispatch('demWeekprogressReport/getProjectBuildLogApplyInfo', data).then(res => {
        console.log(res.results, 'results');
        // 如果本周内没有施工日志或者施工日志的任务完成明细没有
        const list = res.results.filter(v => v.currentFinishProgress);
        if (res.results.length === 0 || list.length === 0) {
          this.$message.error(this.$t('demWeekprogressReport.getApplyDataTips'));
          return;
        }
        for (const item of tableData) {
          const index = res.results.findIndex(v => v.cid === item.cid);
          if (index >= 0) {
            if (res.results[index].finishContent) {
              this.$set(item, 'realFinishContent', res.results[index].finishContent);
            }
            if (res.results[index].currentFinishProgress) {
              const currentFinishProgress = res.results[index].currentFinishProgress * 100;
              this.$set(item, 'realFinishProgress', Number(currentFinishProgress.toFixed(4)));
            }
            const details = [];
            for (const child of res.results[index].details) {
              const iNow = item.details.findIndex(v => v.gantResourceId === child.gantResourceId);
              if (iNow < 0) {
                child.weekResourceId = child.id;
                child.planDetailQuantity = 0;
                child.currentDetailQuantity = child.alreadyApplyQuantity;
                delete child.id;
                child.weekprogressReportLabours = []; // 劳务
                child.weekprogressReportMaterials = []; // 材料
                child.weekprogressReportMachineries = []; // 机械
                child.weekprogressReportOthers = []; // 其它
                for (const second of child.details) {
                  second.alreadyInputQuantity = second.alreadyQuantity;
                  second.resourceName = second.resourceDetailName;
                  second.inputQuantity = second.quantity;
                  if (second.resourceTypeCode === '01') {
                    child.weekprogressReportLabours.push(second);
                  }
                  if (second.resourceTypeCode === '02') {
                    child.weekprogressReportMaterials.push(second);
                  }
                  if (second.resourceTypeCode === '03') {
                    child.weekprogressReportMachineries.push(second);
                  }
                  if (second.resourceTypeCode === '05') {
                    child.weekprogressReportOthers.push(second);
                  }
                }
                details.push(child);
              } else {
                const current = item.details[iNow];
                current.projectDetailQuantity = child.projectDetailQuantity;
                current.alreadyDetailQuantity = child.alreadyDetailQuantity;
                current.currentDetailQuantity = child.alreadyApplyQuantity;
                current.weekprogressReportLabours = []; // 劳务
                current.weekprogressReportMaterials = []; // 材料
                current.weekprogressReportMachineries = []; // 机械
                current.weekprogressReportOthers = []; // 其它
                for (const second of child.details) {
                  second.alreadyInputQuantity = second.alreadyQuantity;
                  second.resourceName = second.resourceDetailName;
                  second.inputQuantity = second.quantity;
                  if (second.resourceTypeCode === '01') {
                    current.weekprogressReportLabours.push(second);
                  }
                  if (second.resourceTypeCode === '02') {
                    current.weekprogressReportMaterials.push(second);
                  }
                  if (second.resourceTypeCode === '03') {
                    current.weekprogressReportMachineries.push(second);
                  }
                  if (second.resourceTypeCode === '05') {
                    current.weekprogressReportOthers.push(second);
                  }
                }
              }
            }
            console.log(details, 'details');
            this.$set(item, 'details', item.details.concat(details));
          }
        }
      }).catch(e => {
        console.log(e);
      });
    },
    // 获取资源
    getData (val) {
      const tableData = this.pageConfig.subTableConfig['progressWeekProgressReportDetail'].tableData;
      this.$set(tableData[this.currentIndex], this.currentResources.prop, val || []);
      console.log(this.pageConfig.subTableConfig['progressWeekProgressReportDetail'].tableData, 'tableData');
      this.dialogVisible = false;
    },
    // ------------------------ 计算周 ---------------------------------------
    // 根据日期判断是月的第几周
    getWeekInMonth (t) {
      if (t === undefined || t === '' || t == null) {
        t = new Date();
      } else {
        const _t = new Date();
        _t.setYear(t.getFullYear());
        _t.setMonth(t.getMonth());
        _t.setDate(t.getDate());
        const date = _t.getDate(); // 给定的日期是几号
        _t.setDate(1);
        const d = _t.getDay(); // 1. 得到当前的1号是星期几。
        let fisrtWeekend = d;
        if (d === 0) {
          fisrtWeekend = 1;
          // 1号就是星期天
        } else {
          fisrtWeekend = 7 - d + 1; // 第一周的周未是几号
        }
        if (date <= fisrtWeekend) {
          return 1;
        } else {
          return 1 + Math.ceil((date - fisrtWeekend) / 7);
        }
      }
    },
    // 保存
    handleSave (isProcess = false) {
      console.log(this.pageConfig.projectForm.applyDate, 'applyDate');
      this.$refs.editForm.getValidateForm(() => {
        this.week = this.getWeekInMonth(new Date(this.pageConfig.projectForm.applyDate));
        const data = this.$clone(this.pageConfig.projectForm);
        data.applyWeek = this.week;
        data.applyDate = `${data.applyDate} 00:00:00`;
        // 申请周标识
        data.applyWeekIdentify = this.getDateWeek(data.applyDate, data.applyWeek);
        const progressWeekProgressReportDetail = this.$refs.progressWeekProgressReportDetail[0].validateTableData();
        if (!progressWeekProgressReportDetail || progressWeekProgressReportDetail.length === 0) {
          // 存在未填写或个数错误的数据
          this.$message.error(`${this.$t('demWeekprogressReport.progressWeekProgressReportDetail')} ${this.$t('tips.notFilledIn')}`);
          return;
        }
        for (const item of progressWeekProgressReportDetail) {
          const realFinishProgress = item.realFinishProgress / 100;
          item.realFinishProgress = Number(realFinishProgress.toFixed(4));
        }
        data.demWeekprogressReportDetails = progressWeekProgressReportDetail;
        this.handleSaveData(data, isProcess);
      });
    },
    // 通过日期获取第几周
    getDateWeek (date, week) {
      const year = date.slice(0, 4); // 获取年
      const month = date.slice(5, 7); // 获取年
      const weekIdentify = `${year}-${month}-${week}`;
      return weekIdentify;
    }
  }
};
</script>
