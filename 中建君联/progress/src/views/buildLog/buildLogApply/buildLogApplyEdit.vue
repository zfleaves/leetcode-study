<!--
 * @Author: your name
 * @Date: 2021-01-26 09:58:04
 * @LastEditTime: 2022-03-03 16:34:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\buildLog\buildLogApply\buildLogApplyEdit.vue
-->
<template>
  <div>
    <edit-page @editEvent="editEvent" v-loading="loading">
      <div slot="editPage">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" :type="type" :tableConfig="pageConfig.mainFormConfig"
          :projectForm="pageConfig.projectForm" @editFormEvent="editFormEvent">
          <!-- 选择项目 -->
          <template slot="form-projectName" slot-scope="{scope, item}">
            <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
              :title="$t(item.label)">
              <div class="slot-input">
                <el-input v-model.trim="scope[item.prop]" :size="item.size || 'small'" readonly>
                  <template slot="suffix" v-if="item.inputStatus !== 'disable' && pageDisabled">
                    <i v-if="scope[item.prop]" class="slot-close el-icon-circle-close"
                      @click="handleClearProject(scope, item)"></i>
                    <i class="multiple-choice-icon iconfont icon-menu" @click="handleSelectProject(scope, item)"></i>
                  </template>
                </el-input>
              </div>
            </el-form-item>
          </template>
          <!-- 施工生产情况记录 -->
          <template slot="tips-finishedSituation">
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content" style="line-height: 24px;">
                <p>{{$t('buildLogApply.finishedSituationTips1')}}</p>
                <p>{{$t('buildLogApply.finishedSituationTips2')}}</p>
                <p>{{$t('buildLogApply.finishedSituationTips3')}}</p>
                <p>{{$t('buildLogApply.finishedSituationTips4')}}</p>
                <p>{{$t('buildLogApply.finishedSituationTips5')}}</p>
                <p>{{$t('buildLogApply.finishedSituationTips6')}}</p>
              </div>
              <span class="tips-item"><i class="el-icon-question"></i></span>
            </el-tooltip>
          </template>
          <template slot="tips-safeWorkRecord">
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content" style="line-height: 24px;">
                <p>{{$t('buildLogApply.safeWorkRecordTips1')}}</p>
                <p>{{$t('buildLogApply.safeWorkRecordTips2')}}</p>
                <p>{{$t('buildLogApply.safeWorkRecordTips3')}}</p>
                <p>{{$t('buildLogApply.safeWorkRecordTips4')}}</p>
                <p>{{$t('buildLogApply.safeWorkRecordTips5')}}</p>
                <p>{{$t('buildLogApply.safeWorkRecordTips6')}}</p>
                <p>{{$t('buildLogApply.safeWorkRecordTips7')}}</p>
                <p>{{$t('buildLogApply.safeWorkRecordTips8')}}</p>
                <p>{{$t('buildLogApply.safeWorkRecordTips9')}}</p>
              </div>
              <span class="tips-item"><i class="el-icon-question"></i></span>
            </el-tooltip>
          </template>
          <template slot="form-formTips" slot-scope="{item}">
            <tooltips :value="$t(item.label)" style="color: red;line-height: 40px;">
            </tooltips>
          </template>
          <template slot="form-morningTemperature" slot-scope="{item, scope}">
            <el-form-item :label="$t(item.label)" :prop="item.prop" :title="$t(item.label)">
              <div class="temperature">
                <el-number v-model.trim="scope.morningTemperaturesForm" :size="item.size || 'small'"
                  :clearable="item.clearable === undefined ? true : item.clearable"
                  :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)" :precision="Number(2)"
                  :max="scope.morningTemperaturesTo || 100" show-word-limit>
                </el-number>
                <span class="sp">~</span>
                <el-number v-model.trim="scope.morningTemperaturesTo"
                  :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'"
                  :clearable="item.clearable === undefined ? true : item.clearable"
                  :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)" :precision="Number(2)"
                  :max="100" show-word-limit
                  :min="scope.morningTemperaturesForm ? Number(scope.morningTemperaturesForm) : -100">
                </el-number>
              </div>
            </el-form-item>
          </template>
          <template slot="form-afternoonTemperature" slot-scope="{item, scope}">
            <el-form-item :label="$t(item.label)" :prop="item.prop" :title="$t(item.label)">
              <div class="temperature">
                <el-number v-model.trim="scope.afternoonTemperaturesForm"
                  :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'"
                  :clearable="item.clearable === undefined ? true : item.clearable"
                  :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)" :precision="Number(2)"
                  :max="scope.afternoonTemperaturesTo || 100" show-word-limit>
                </el-number>
                <span class="sp">~</span>
                <el-number v-model.trim="scope.afternoonTemperaturesTo"
                  :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'"
                  :clearable="item.clearable === undefined ? true : item.clearable"
                  :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)" :precision="Number(2)"
                  :max="100" show-word-limit
                  :min="scope.afternoonTemperaturesForm ? Number(scope.afternoonTemperaturesForm) : -100">
                </el-number>
              </div>
            </el-form-item>
          </template>
        </g-edit-form>
        <!-- 明细清单 -->
        <div v-if="pageConfigLoading">
          <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
            <g-edit-title :title="$t(`buildLogApply.${subTable.subTableName}`)"
              :titleTips="$t('buildLogApply.titleTips')">
              <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
              </g-button>
            </g-edit-title>
            <g-edit-table :ref="subTable.subTableName" :type="type" :isSelection="subTable.isSelection"
              :tableConfig="subTable.tableList" :subTable='subTable' :customRules="subTableCustomRules"
              :delete.sync="deleteList[subTable.subTableName]" @editTableEvent='editTableEvent'>
              <template slot="edit-table-alreadyFinishedProgress" slot-scope="{scope}">
                <span class="smallFont">{{scope.alreadyFinishedProgress | setFinishedProgress}}</span>
              </template>
              <template slot="edit-table-currentFinishProgress" slot-scope="{item, scope}">
                <el-number controls-position="right" size="small" :disabled="item.inputStatus === 'disable'"
                  :maxlength="Number(item.maxlength)" :precision="Number(item.precision)"
                  v-model.trim="scope[item.prop]" :placeholder="item.placeholder"
                  :clearable="item.clearable === undefined ? true : item.clearable" :max="100"
                  :min="scope.alreadyFinishedProgress * 100">
                </el-number>
              </template>
              <!-- 子表头 -->
              <template slot="edit-table-children-reportLabour" slot-scope="{item, scope, rowIndex}">
                <span class="smallFont set" @click="handleSelectResources(item, scope, rowIndex)">
                    {{getItems(scope, '01')}} {{$t('fConfig.term')}}
                </span>
              </template>
              <template slot="edit-table-children-reportMaterial" slot-scope="{item, scope, rowIndex}">
                <span class="smallFont set" @click="handleSelectResources(item, scope, rowIndex)">
                    {{getItems(scope, '02')}} {{$t('fConfig.term')}}
                </span>
              </template>
              <template slot="edit-table-children-reportMachinery" slot-scope="{item, scope, rowIndex}">
                <span class="smallFont set" @click="handleSelectResources(item, scope, rowIndex)">
                    {{getItems(scope, '03')}} {{$t('fConfig.term')}}
                </span>
              </template>
              <template slot="edit-table-children-other" slot-scope="{item, scope, rowIndex}">
                <span class="smallFont set" @click="handleSelectResources(item, scope, rowIndex)">
                    {{getItems(scope, '05')}} {{$t('fConfig.term')}}
                </span>
              </template>
            </g-edit-table>
          </div>
        </div>
      </div>
    </edit-page>

    <!-- 选择材料分类 -->
    <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
      <ganttDetail slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogVisible"
        :selectList="selectList" :isParentCanCheck="false" :projectId="pageConfig.projectForm.projectId"
        varietiesTitle="buildLogApply.ganttDetail" @getData="getData" v-if="dialogVisible">
      </ganttDetail>
    </g-dialog>
    <!-- 选择项目 -->
    <g-dialog v-if="dialogProject" :dialogConfig="dialogConfigProjectName" :isVisible.sync="dialogProject">
      <projectDialog slot="body" slot-scope="{height}" :dialogHeight="height" v-if="dialogProject"
        :close.sync="dialogProject" :projectId='pageConfig.projectForm.projectId || 0' style="height:100%;"
        @getProject="getProject"></projectDialog>
    </g-dialog>

    <!-- 选择资源投入 -->
    <g-dialog v-if="resourceVisible" :dialogConfig="resourceConfig" :isVisible.sync="resourceVisible">
        <resourceDetail slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="resourceVisible" :type="type"
          :details="details"  :projectId='pageConfig.projectForm.projectId || 0'
          :nodeCode='nodeCode'
          :row="currentRow" :currentResources="currentResources"  @getData="getResourceData" v-if="resourceVisible">
        </resourceDetail>
    </g-dialog>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';

export default {
  name: 'buildLogApplyEdit',
  mixins: [editPage],
  filters: {
    setFinishedProgress (val) {
      if (!val) return 0;
      const progress = val * 100;
      return Number(progress.toFixed(4));
    }
  },
  components: {
    ganttDetail (resolve) {
      require(['../components/ganttDetail/ganttDetail.vue'], resolve);
    },
    resourceDetail (resolve) {
      require(['../components/resourceDetail/resourceDetail.vue'], resolve);
    },
    projectDialog (resolve) {
      require(['components/basicComponents/global/dialog/projectDialog/projectDialog'], resolve);
    }
  },
  data () {
    const numValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error(`${this.$t('buildLogApply.currentFinishProgress')} ${this.$t('tips.numTips')}`));
      } else {
        callback();
      }
    };
    return {
      page: new Page(),
      projectForm: {
        afternoonTemperature: '',
        afternoonTemperaturesForm: '',
        afternoonTemperaturesTo: '',
        afternoonWeather: '',
        afternoonWindDirection: '',
        afternoonWindPower: '',
        applyDate: '',
        attachment: '',
        docNo: '',
        finishedSituation: '',
        logTypeId: '',
        morningTemperature: '',
        morningTemperaturesForm: '',
        morningTemperaturesTo: '',
        morningWeather: '',
        morningWindDirection: '',
        morningWindPower: '',
        projectId: '',
        projectName: '',
        remarks: '',
        tomorrowPlanSituation: '',
        logTypeName: '施工日志',
        logTypeCode: '01',
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      },
      // 选择材料
      dialogVisible: false,
      dialogConfig: {
        title: this.$t('buildLogApply.selectTask'),
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
        currentFinishProgress: [{ required: true, validator: numValid, trigger: 'blur' }]
      },
      nodeCode: '',
      week: 1,
      // 选择项目
      dialogProject: false,
      dialogConfigProjectName: {
        title: this.$t('dialog.projectName'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      projectConfig: {},
      currentResources: {},
      currentIndex: 0,
      currentRow: {},
      dialogDetailVisible: false,
      dialogDetailConfig: {
        title: this.$t('dialog.selectResources'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '70%',
        span: '0.75'
      },
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
      },
      details: []
    };
  },
  props: {
    processParmas: {
      type: Object,
      default: () => { }
    }
  },
  methods: {
    getItems(row, code) {
      if (!row.details) return 0;
      return row.details.filter(v => v.resourceTypeCode === code).length;
    },
    // 选择资源
    handleSelectResources(item, row, index) {
      console.log(row, 'row');
      console.log(index, 'index');
      this.currentResources = this.$clone(item);
      this.currentIndex = index;
      this.currentRow = this.$clone(row);
      this.details = this.$clone(row.details);
      // this.resourceConfig.title = `${this.$t(item.label)} ${this.$t('tips.details')}`;
      this.resourceVisible = true;
    },
    // 获取信息
    getResourceData({details}) {
      const tableData = this.$clone(this.pageConfig.subTableConfig['progressBulildlogapplyDetail'].tableData);
      const tableIndex = tableData.findIndex(v => v.cid === this.currentRow.cid);
      if (tableIndex > -1) {
        this.$set(tableData[tableIndex].details[this.currentIndex], 'details', details);
      }
      console.log(tableData, 'tableData');
      this.$set(this.pageConfig.subTableConfig['progressBulildlogapplyDetail'], 'tableData', []);
      this.$set(this.pageConfig.subTableConfig['progressBulildlogapplyDetail'], 'tableData', tableData);
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
          const tableData = this.$clone(this.pageConfig.subTableConfig['progressBulildlogapplyDetail'].tableData);
          this.$set(this.pageConfig.subTableConfig['progressBulildlogapplyDetail'], 'tableData', []);
          this.$set(this.pageConfig.subTableConfig['progressBulildlogapplyDetail'], 'tableData', tableData);
      }).catch(() => { });
      // this.$forceUpdate();
    },
    // 获取info数据
    async _getInfoData (id = 0) {
      await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
        this.pageConfig.projectForm.logTypeName = '施工日志';
        this.pageConfig.projectForm.logTypeCode = '01';
        // 上午温度
        if (this.pageConfig.projectForm.morningTemperature.indexOf(',') >= 0) {
          const list = this.pageConfig.projectForm.morningTemperature.split(',');
          //   console.log(list, 'list');
          this.$set(this.pageConfig.projectForm, 'morningTemperaturesForm', Number(list[0]));
          this.$set(this.pageConfig.projectForm, 'morningTemperaturesTo', Number(list[1]));
        }
        // 下午温度
        if (this.pageConfig.projectForm.afternoonTemperature.indexOf(',') >= 0) {
          const list = this.pageConfig.projectForm.afternoonTemperature.split(',');
          //   console.log(list, 'list');
          this.$set(this.pageConfig.projectForm, 'afternoonTemperaturesForm', Number(list[0]));
          this.$set(this.pageConfig.projectForm, 'afternoonTemperaturesTo', Number(list[1]));
        }
        const tableData = this.pageConfig.subTableConfig['progressBulildlogapplyDetail'].tableData;
        for (const item of tableData) {
          const currentFinishProgress = item.currentFinishProgress * 100;
          item.currentFinishProgress = Number(currentFinishProgress.toFixed(4));
        }
        // console.log(this.pageConfig.projectForm);
      });
    },
    // 选择明细
    sysHandleSelectDetail (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      if (!this.pageConfig.projectForm.applyDate) {
        this.$message.error(`${this.$t('tips.pleaseSelect')}${this.$t('buildLogApply.applyDate')}`);
        return;
      }
      const tableData = this.pageConfig.subTableConfig[tableName].tableData;
      this.selectList = this.$clone(tableData);
      this.dialogVisible = true;
    },
    handleCheckProjectApply() {
      if (!this.pageConfig.projectForm.projectName || !this.pageConfig.projectForm.applyDate) return;
      const params = {
        buildLogApplyId: this.pageConfig.projectForm.id ? this.pageConfig.projectForm.id : '',
        projectId: this.pageConfig.projectForm.projectId,
        applyDate: this.pageConfig.projectForm.applyDate
      };
      this.$store.dispatch('buildLogApply/checkProjectApply', params).then(res => {
        if (res.results) {
          this.$message.error(`${this.$t('buildLogApply.projectNameTips')}`);
          this.$set(this.pageConfig.projectForm, 'projectName', '');
          this.$set(this.pageConfig.projectForm, 'projectId', '');
          this.$set(this.pageConfig.projectForm, 'applyDate', '');
        }
      });
    },
    // 获取选中的数据
    getData (arr) {
      const data = [];
      for (const item of arr) {
        for (const child of item.details) {
          delete child.id;
          child.currentDetailQuantity = '';
          child.details = [];
          // for (const second of child.details) {
          //   second.dataSourceValue = '主计划';
          //   second.dataSourceCode = '03';
          //   second.resourceQuantity = second.quantity;
          //   second.quantity = '';
          //   second.gantResourceDetailId = item.id;
          //   second.cid = second.id;
          //   delete second.id;
          //   second.includeTaxAmount = '';
          //   second.includeUnitPrice = '';
          //   second.taxAmount = '';
          //   second.taxRate = '';
          //   second.excludeTaxAmount = '';
          //   second.excludeUnitPrice = '';
          // }
        }
        data.push(
          {
            alreadyFinishedProgress: item.alreadyFinishedProgress,
            cid: item.cid,
            id: item.id,
            createTime: this.$utils.commonUtil.formatTime(new Date()),
            currentFinishProgress: item.currentFinishProgress || '',
            dutyUserId: item.dutyUserId,
            dutyUserName: item.dutyUserName,
            monthPlanId: item.monthPlanId,
            planDuration: item.planDuration,
            currentFinishContent: '',
            planStartDate: item.planStartDate,
            realStartDate: item.realStartDate,
            remarks: '',
            taskName: item.taskNameList.join('/'),
            taskNumber: item.taskNumber || '',
            details: item.details
          }
        );
      }
      console.log(data, 'data');
      this.setSubTable('progressBulildlogapplyDetail', data);
    },
    setSubTable (tableName, arr) {
      const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
      const selectTableList = [];
      if (!tableData.length || !arr.length) {
        this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', arr);
      }
      if (tableData.length) {
        for (const item of tableData) {
          for (const val of arr) {
            if (item.cid === val.cid) {
              selectTableList.push(item);
            }
          }
        }
        for (const item of arr) {
          const index = tableData.findIndex(v => v.cid === item.cid);
          if (index < 0) {
            selectTableList.push(item);
          }
        }
        this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', selectTableList);
      }
      this.dialogVisible = false;
    },
    // 清除项目
    handleClearProject (row, item) {
      const params = {
        paramsConfig: item,
        selectList: []
      };
      this.handleSelect(params, 'projectName');
    },
    // 打开项目弹窗
    handleSelectProject (row, item) {
      this.projectConfig = item;
      this.dialogProject = true;
    },
    // 获取选中的项目并校验是否做过填报
    getProject (arr) {
      const params = {
        paramsConfig: this.projectConfig,
        selectList: arr
      };
      this.handleSelect(params, 'projectName', () => {
        this.handleCheckProjectApply();
        // const params = {
        //   buildLogApplyId: this.pageConfig.projectForm.id ? this.pageConfig.projectForm.id : '',
        //   projectId: this.pageConfig.projectForm.projectId,
        //   applyDate: this.pageConfig.projectForm.applyDate
        // };
        // this.$store.dispatch('buildLogApply/checkProjectApply', params).then(res => {
        //   if (res.results) {
        //     this.$message.error(`${this.$t('buildLogApply.projectNameTips')}`);
        //     this.$set(this.pageConfig.projectForm, 'projectName', '');
        //     this.$set(this.pageConfig.projectForm, 'projectId', '');
        //     this.$set(this.pageConfig.projectForm, 'applyDate', '');
        //   }
        // });
        this.dialogProject = false;
      });
    },
    // 保存
    handleSave (isProcess = false) {
      this.$refs.editForm.getValidateForm(() => {
        const data = this.$clone(this.pageConfig.projectForm);
        data.morningTemperature = `${data.morningTemperaturesForm},${data.morningTemperaturesTo}`;
        data.afternoonTemperature = `${data.afternoonTemperaturesForm},${data.afternoonTemperaturesTo}`;
        // 通过日期获取第几周
        const applyWeekIdentify = this.getDateWeek(this.pageConfig.projectForm.applyDate);
        data.applyWeekIdentify = applyWeekIdentify;
        // 获取明细
        const progressBulildlogapplyDetail = this.$refs.progressBulildlogapplyDetail[0].validateTableData();
        const tableData = this.$clone(this.pageConfig.subTableConfig['progressBulildlogapplyDetail'].tableData);
        if (!progressBulildlogapplyDetail && tableData.length) {
          // 存在未填写或个数错误的数据
          this.$message.error(`${this.$t('buildLogApply.progressBulildlogapplyDetail')} ${this.$t('tips.notFilledIn')}`);
          return;
        }
        for (const item of progressBulildlogapplyDetail) {
          const currentFinishProgress = item.currentFinishProgress / 100;
          item.currentFinishProgress = Number(currentFinishProgress.toFixed(4));
        }
        data.details = progressBulildlogapplyDetail;
        this.handleSaveData(data, isProcess);
      });
    },
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
    // 通过日期获取第几周
    getDateWeek (date) {
      const currentWeekDate = this.getCurrentWeekFirstDay(date); // 获取当前周第二天日期
      const week = this.getWeekInMonth(new Date(currentWeekDate)); // 获取当前周
      const year = currentWeekDate.slice(0, 4); // 获取年
      const month = currentWeekDate.slice(5, 7); // 获取年
      const weekIdentify = `${year}-${month}-${week}`;
      return weekIdentify;
    },
    // 获取本周的第一天
    getCurrentWeekFirstDay (date) {
      const t = new Date(date);
      const week = t.getDay();
      //   console.log(week);
      const diffDay = week - 2; // 算周二
      const timestamp = new Date(date).getTime();
      const diffDayTimestamp = timestamp - diffDay * 24 * 60 * 60 * 1000;
      const diffDate = this.$utils.commonUtil.formatTime(diffDayTimestamp);
      //   console.log(diffDate);
      return diffDate;
    }
  }
};
</script>
<style lang="scss" scoped>
.temperature {
  width: 100%;
  display: flex;
  .sp {
    display: inline-block;
    margin: 0 8px;
  }
  /deep/ .el-number {
    flex: 1;
  }
}

.tips-item {
  left: -70px !important;
  top: 40px !important;
}
</style>
