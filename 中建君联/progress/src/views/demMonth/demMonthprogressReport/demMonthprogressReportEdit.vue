<!--
 * @Author: your name
 * @Date: 2021-01-29 17:28:19
 * @LastEditTime: 2022-03-03 15:34:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demMonth\demMonthprogressReport\demMonthprogressReportEdit.vue
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
            <g-edit-title :title="$t(`demMonthprogressReport.${subTable.subTableName}`)">
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
                  :min="scope.alreadyFinishedProgress * 100">
                </el-number>
                <span v-else class="smallFont">{{scope.realFinishProgress}}</span>
              </template>
              <!-- 劳务 -->
              <template slot="edit-table-children-monthprogressReportLabours" slot-scope="{item, scope, rowIndex}">
                <span class="smallFont set" @click="handleSelectResources(item, scope, rowIndex)">
                  {{scope[item.prop] |  setResources}} {{$t('fConfig.term')}}
                </span>
              </template>
              <!-- 材料 -->
              <template slot="edit-table-children-monthprogressReportMachineries" slot-scope="{item, scope, rowIndex}">
                <span class="smallFont set" @click="handleSelectResources(item, scope, rowIndex)">
                  {{scope[item.prop] |  setResources}} {{$t('fConfig.term')}}
                </span>
              </template>
              <!-- 机械 -->
              <template slot="edit-table-children-monthprogressReportMaterials" slot-scope="{item, scope, rowIndex}">
                <span class="smallFont set" @click="handleSelectResources(item, scope, rowIndex)">
                  {{scope[item.prop] |  setResources}} {{$t('fConfig.term')}}
                </span>
              </template>
              <!-- 其它 -->
              <template slot="edit-table-children-monthprogressReportOthers" slot-scope="{item, scope, rowIndex}">
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
        <progressDetail slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="resourceVisible" :type="type"
          :details="details"  :projectId='pageConfig.projectForm.projectId || 0'
          varietiesDateilUrl='demMasterPlan/getPlanMonthList'
          :nodeCode='nodeCode'
          :row="currentRow" :currentResources="currentResources"  @getData="getResourceData" v-if="resourceVisible">
        </progressDetail>
    </g-dialog>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';

export default {
  name: 'demMonthprogressReportEdit',
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
  data () {
    const numValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error(`${this.$t('demMonthprogressReport.realFinishProgress')} ${this.$t('tips.numTips')}`));
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
      // 选择材料
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
      currentResources: {},
      currentIndex: 0,
      currentRow: {},
      nodeCode: '',
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
  components: {
    progressDetail (resolve) {
      require(['views/buildLog/components/progressDetail/progressDetail.vue'], resolve);
    }
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
      console.log(this.details, 'details');
      // this.resourceConfig.title = `${this.$t(item.label)} ${this.$t('tips.details')}`;
      this.resourceVisible = true;
    },
    // 获取信息
    getResourceData({details}) {
      const tableData = this.$clone(this.pageConfig.subTableConfig['progressMonthProgressReportDetai'].tableData);
      const tableIndex = tableData.findIndex(v => v.cid === this.currentRow.cid);
      if (tableIndex > -1) {
        const prop = this.currentResources.prop;
        this.$set(tableData[tableIndex].details[this.currentIndex], prop, details);
      }
      console.log(tableData, 'tableData');
      this.$set(this.pageConfig.subTableConfig['progressMonthProgressReportDetai'], 'tableData', []);
      this.$set(this.pageConfig.subTableConfig['progressMonthProgressReportDetai'], 'tableData', tableData);
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
          const tableData = this.$clone(this.pageConfig.subTableConfig['progressMonthProgressReportDetai'].tableData);
          this.$set(this.pageConfig.subTableConfig['progressMonthProgressReportDetai'], 'tableData', []);
          this.$set(this.pageConfig.subTableConfig['progressMonthProgressReportDetai'], 'tableData', tableData);
      }).catch(() => { });
      // this.$forceUpdate();
    },
    // 获取info数据
    async _getInfoData (id = 0) {
      await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
        const tableData = this.pageConfig.subTableConfig['progressMonthProgressReportDetai'].tableData;
        for (const item of tableData) {
          const realFinishProgress = item.realFinishProgress * 100;
          item.realFinishProgress = Number(realFinishProgress.toFixed(4));
        }
      });
    },
    // 校验项目
    handleCheckProject (params) {
      this.handleSelect(params, 'projectName', () => {
        if (params.selectList.length === 0) {
          this.$set(this.pageConfig.projectForm, 'projectCode', '');
          this.$set(this.pageConfig.projectForm, 'applyMonth', '');
        }
      });
    },
    // 选择明细
    sysHandleSelectDetail (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      if (!this.pageConfig.projectForm.applyMonth) {
        // 请选择填报月份
        this.$message.error(this.$t('demMonthprogressReport.pleaseSelectApplyMonth'));
        return;
      }
      this.chackProject(tableName);
    },
    // 校验项目是否已做周期
    chackProject (tableName) {
      const data = {
        monthprogressReportId: this.id || null,
        projectId: this.pageConfig.projectForm.projectId,
        applyMonth: this.pageConfig.projectForm.applyMonth
      };
      this.$store.dispatch('demMonthprogressReport/checkAreadyProject', data).then(res => {
        if (res.results) {
          // 该项目已添加此月度需求计划，不能再次添加。
          this.$message.error(this.$t('demMonthprogressReport.checkMonthPlanTips'));
        } else {
          const tableData = this.pageConfig.subTableConfig[tableName].tableData;
          // this.selectList = this.$clone(tableData);
          if (tableData.length === 0) {
            this.getDetails(tableName);
            return;
          }
          const messageTips = this.$t('demMonthprogressReport.getDetailTips');
          this.$confirm(messageTips, this.$t('demMonthprogressReport.getDetail'), {
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
        applyMonth: this.pageConfig.projectForm.applyMonth
      };
      this.$store.dispatch('demMonthprogressReport/getProjectMonthInfo', data).then(res => {
        if (!res.results || res.results.length === 0) {
          this.$message.error(this.$t('demMonthprogressReport.getProjectMonthInfo'));
          this.$set(this.pageConfig.projectForm, 'projectId', '');
          this.$set(this.pageConfig.projectForm, 'projectName', '');
          this.$set(this.pageConfig.projectForm, 'projectCode', '');
          this.$set(this.pageConfig.projectForm, 'applyMonth', '');
          return;
        }
        this.$set(this.pageConfig.projectForm, 'monthPlanId', res.results[0].id);
        const results = res.results[0].demMonthPlanDetails;
        for (const item of results) {
          item.alreadyFinishedProgress = item.totalProgress || 0;
          item.realFinishProgress = '';
          item.eId = item.id;
          item.remarks = '';
          for (const child of item.details) {
            child.monthResourceId = child.id;
            delete child.id;
            child.planDetailQuantity = child.currentDetailQuantity;
            child.currentDetailQuantity = '';
            child.monthprogressReportLabours = []; // 劳务
            child.monthprogressReportMachineries = []; // 材料
            child.monthprogressReportMaterials = []; // 机械
            child.monthprogressReportOthers = []; // 其它
          }
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
    // 获取周完成上报
    sysHandleSelectWeekDetail (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      if (!this.pageConfig.projectForm.applyMonth) {
        // 请选择填报月份
        this.$message.error(this.$t('demMonthprogressReport.pleaseSelectApplyMonth'));
        return;
      }
      const tableData = this.pageConfig.subTableConfig[tableName].tableData;
      if (tableData.length === 0) {
        // 请选择填报月份
        this.$message.error(this.$t('demMonthprogressReport.pleaseGetDetails'));
        return;
      }
      const data = {
        cid: tableData.map(v => v.cid),
        // cid: ['5449c80d-7760-47b6-921b-f7e5f8e0aeea'],
        projectId: this.pageConfig.projectForm.projectId,
        applyMonth: this.pageConfig.projectForm.applyMonth
      };
      this.$store.dispatch('demMonthprogressReport/getProjectWeekReportInfo', data).then(res => {
        console.log(res.results, 'results');
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
            item.details = [];
            const details = [];
            for (const child of res.results[index].details) {
              child.monthResourceId = child.id;
              delete child.id;
              // child.planDetailQuantity = child.currentDetailQuantity;
              // child.currentDetailQuantity = '';
              child.monthprogressReportLabours = child.weekprogressReportLabours; // 劳务
              child.monthprogressReportMaterials = child.weekprogressReportMaterials; // 材料
              child.monthprogressReportMachineries = child.weekprogressReportMachineries; // 机械
              child.monthprogressReportOthers = child.weekprogressReportOthers; // 其它
              details.push(child);
            }
            console.log(details, 'details');
            this.$set(item, 'details', details);
          }
        }
      }).catch(e => {
        console.log(e);
      });
    },
    // 获取周资源
    sysHandleGetResourceData (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      if (!this.pageConfig.projectForm.applyMonth) {
        // 请选择填报月份
        this.$message.error(this.$t('demMonthprogressReport.pleaseSelectApplyMonth'));
        return;
      }
      const tableData = this.pageConfig.subTableConfig[tableName].tableData;
      if (tableData.length === 0) {
        // 请选择填报月份
        this.$message.error(this.$t('demMonthprogressReport.pleaseGetDetails'));
        return;
      }
      const data = {
        cid: tableData.map(v => v.cid),
        projectId: this.pageConfig.projectForm.projectId,
        applyMonth: this.pageConfig.projectForm.applyMonth,
        resourceTypeCode: ''
      };
      // 获取周资源后,之前存入的资源投入数据将会被替换
      const messageTips = this.$t('demMonthprogressReport.getResourceDataTips');
      this.$confirm(messageTips, this.$t('demMonthprogressReport.getResourceData'), {
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('demMonthprogressReport/getProjectWeekResourceInfo', data).then(res => {
          const resourceTypeList = [
            // 人工
            { label: 'dialog.reportLabour', prop: 'monthprogressReportLabours', code: '01' },
            // 材料
            { label: 'dialog.reportMaterial', prop: 'monthprogressReportMachineries', code: '02' },
            // 机械
            { label: 'dialog.reportMachinery', prop: 'monthprogressReportMaterials', code: '03' },
            // 其它
            { label: 'dialog.reportOther', prop: 'monthprogressReportOthers', code: '05' }
          ];
          console.log(res.results, 'results');
          for (const item of res.results) {
            // item.weekreportDocNo = item.docNo;
            item.weekreportDocNo = item.applyWeekIdentify;
            item.dataSourceCode = '03';
            item.dataSourceValue = 'dialog.dataSourceValue03';
          }
          for (const item of tableData) {
            const resourceList = res.results.filter(v => v.cid === item.cid);
            for (const child of resourceTypeList) {
              item[child.prop] = resourceList.filter(v => v.resourceTypeCode === child.code);
            }
          }
        }).catch(e => {
          console.log(e);
        });
      });
    },
    // 获取日志数据
    sysHandleGetApplyData (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      if (!this.pageConfig.projectForm.applyMonth) {
        // 请选择所属月份
        this.$message.error(this.$t('demMonthprogressReport.pleaseSelectMonth'));
        return;
      }
      const tableData = this.pageConfig.subTableConfig[tableName].tableData;
      if (tableData.length === 0) {
        // 请先获取计划
        this.$message.error(this.$t('demMonthprogressReport.pleaseGetDetails'));
        return;
      }
      const data = {
        'aplyMonth': this.pageConfig.projectForm.applyMonth,
        'applyMonthEnd': '',
        'applyMonthStart': '',
        'applyWeekIdentify': '',
        'cid': tableData.map(v => v.cid),
        'projectId': this.pageConfig.projectForm.projectId
      };
      console.log(data, 'data');
      this.$store.dispatch('demMonthprogressReport/getProjectBuildLogApplyInfo', data).then(res => {
        console.log(res.results, 'results');
        // 如果本月内没有施工日志或者施工日志的任务完成明细没有
        const list = res.results.filter(v => v.currentFinishProgress);
        if (res.results.length === 0 || list.length === 0) {
          this.$message.error(this.$t('demMonthprogressReport.getApplyDataTips'));
          return;
        }
        for (const item of tableData) {
          const index = res.results.findIndex(v => v.cid === item.cid);
          if (index >= 0) {
            if (res.results[index].currentFinishContent) {
              this.$set(item, 'realFinishContent', res.results[index].currentFinishContent);
            }
            if (res.results[index].currentFinishProgress) {
              const currentFinishProgress = res.results[index].currentFinishProgress * 100;
              this.$set(item, 'realFinishProgress', Number(currentFinishProgress.toFixed(4)));
            }
            const details = [];
            for (const child of res.results[index].details) {
              const iNow = item.details.findIndex(v => v.gantResourceId === child.gantResourceId);
              if (iNow < 0) {
                child.monthResourceId = child.id;
                child.planDetailQuantity = 0;
                child.currentDetailQuantity = child.alreadyApplyQuantity;
                delete child.id;
                child.monthprogressReportLabours = []; // 劳务
                child.monthprogressReportMaterials = []; // 材料
                child.monthprogressReportMachineries = []; // 机械
                child.monthprogressReportOthers = []; // 其它
                for (const second of child.details) {
                  second.alreadyInputQuantity = second.alreadyQuantity;
                  second.resourceName = second.resourceDetailName;
                  second.inputQuantity = second.quantity;
                  if (second.resourceTypeCode === '01') {
                    child.monthprogressReportLabours.push(second);
                  }
                  if (second.resourceTypeCode === '02') {
                    child.monthprogressReportMaterials.push(second);
                  }
                  if (second.resourceTypeCode === '03') {
                    child.monthprogressReportMachineries.push(second);
                  }
                  if (second.resourceTypeCode === '05') {
                    child.monthprogressReportOthers.push(second);
                  }
                }
                details.push(child);
              } else {
                const current = item.details[iNow];
                current.projectDetailQuantity = child.projectDetailQuantity;
                current.alreadyDetailQuantity = child.alreadyDetailQuantity;
                current.currentDetailQuantity = child.alreadyApplyQuantity;
                current.monthprogressReportLabours = []; // 劳务
                current.monthprogressReportMaterials = []; // 材料
                current.monthprogressReportMachineries = []; // 机械
                current.monthprogressReportOthers = []; // 其它
                for (const second of child.details) {
                  second.alreadyInputQuantity = second.alreadyQuantity;
                  second.resourceName = second.resourceDetailName;
                  second.inputQuantity = second.quantity;
                  if (second.resourceTypeCode === '01') {
                    current.monthprogressReportLabours.push(second);
                  }
                  if (second.resourceTypeCode === '02') {
                    current.monthprogressReportMaterials.push(second);
                  }
                  if (second.resourceTypeCode === '03') {
                    current.monthprogressReportMachineries.push(second);
                  }
                  if (second.resourceTypeCode === '05') {
                    current.monthprogressReportOthers.push(second);
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
      const tableData = this.pageConfig.subTableConfig['progressMonthProgressReportDetai'].tableData;
      this.$set(tableData[this.currentIndex], this.currentResources.prop, val || []);
      console.log(this.pageConfig.subTableConfig['progressMonthProgressReportDetai'].tableData, 'tableData');
      this.dialogVisible = false;
    },
    // 保存
    handleSave (isProcess = false) {
      this.$refs.editForm.getValidateForm(() => {
        const data = this.$clone(this.pageConfig.projectForm);
        const progressMonthProgressReportDetai = this.$refs.progressMonthProgressReportDetai[0].validateTableData();
        if (!progressMonthProgressReportDetai || progressMonthProgressReportDetai.length === 0) {
          // 存在未填写或个数错误的数据
          this.$message.error(`${this.$t('demMonthprogressReport.progressMonthProgressReportDetai')} ${this.$t('tips.notFilledIn')}`);
          return;
        }
        console.log(progressMonthProgressReportDetai, 'progressMonthProgressReportDetai');
        for (const item of progressMonthProgressReportDetai) {
          const realFinishProgress = item.realFinishProgress / 100;
          item.realFinishProgress = Number(realFinishProgress.toFixed(4));
        }
        data.demMonthprogressReportDetails = progressMonthProgressReportDetai;
        this.handleSaveData(data, isProcess);
      });
    }
  }
};
</script>
