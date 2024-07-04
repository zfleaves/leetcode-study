<!--
 * @Author: your name
 * @Date: 2020-07-24 15:23:51
 * @LastEditTime: 2022-12-02 15:32:20
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\demandPlan\tempPlan\tempPlanEdit.vue
-->
<template>
  <div>
    <edit-page @editEvent="editEvent" v-loading="loading">
      <div slot="editPage">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" :type="type" :tableConfig="pageConfig.mainFormConfig"
          :projectForm="pageConfig.projectForm" @editFormEvent="editFormEvent">
          <!-- 申请班组 -->
          <template slot="tips-projectUnitId">
            <el-tooltip placement="top">
              <div slot="content" style="line-height: 24px;">
                <div>
                  {{$t('tips.applicationTeamTips')}}
                </div>
              </div>
              <span class="tips-item"><i class="el-icon-question"></i></span>
            </el-tooltip>
          </template>
          <!-- 专业 如需添加或者修改选项值，请前往【项目规划云-项目专业设置】模块操作，如无权限，请联系贵公司管理员。 -->
          <template slot="tips-majorCode">
            <el-tooltip placement="top">
              <div slot="content" style="line-height: 24px;">
                <div>
                  {{$t('tips.majorCodeTips')}}
                </div>
              </div>
              <span class="tips-item"><i class="el-icon-question"></i></span>
            </el-tooltip>
          </template>
          <template slot="form-expendContractName" slot-scope="{scope, item}">
            <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
              :title="$t(item.label)">
              <div class="slot-input">
                <el-input v-model.trim="scope[item.prop]" :size="item.size || 'small'" readonly>
                  <template slot="suffix" v-if="item.inputStatus !== 'disable' && pageDisabled">
                    <i v-if="scope[item.prop]" class="slot-close el-icon-circle-close"
                      @click="handleClearContract(scope, item)"></i>
                    <i class="multiple-choice-icon iconfont icon-menu" @click="handleSelectContract(scope, item)"></i>
                  </template>
                </el-input>
              </div>
            </el-form-item>
          </template>
        </g-edit-form>
        <!-- 明细清单 -->
        <div v-if="pageConfigLoading">
          <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
            <g-edit-title :title="$t(`tempPlan.${subTable.subTableName}`)"
              :titleTips="$t(`tempPlan.${subTable.titleTips}`)">
              <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
                <!-- 添加明细 -->
                <template v-if="sysHandleDeletaAddShow" slot-scope="{parameter}" slot='button-sysHandleDeletaAdd'>
                  <el-button
                    size="small"
                    type="primary"
                    :plain="false"
                    :disabled="parameter.disabled"
                    icon="el-icon-plus"
                    v-fast-click
                    @click="sysHandleDeletaAdd(parameter.subTableCode)">
                    {{$t('button.addDetails')}}
                  </el-button>
                </template>
                <template slot-scope="{parameter, buttonConfig}" slot='button-sysHandleImport'>
                  <importFile :parameter='parameter' :buttonConfig='buttonConfig' @importData='getImportData'
                    :projectId="pageConfig.projectForm && (pageConfig.projectForm.projectId || 0)" :editPage='that'
                    :subTable='subTable' :flowStatus='parameter.disabled' :importUrl='importUrl'>
                  </importFile>
                </template>
              </g-button>
            </g-edit-title>
            <g-edit-table :ref="subTable.subTableName" :type="type" :isSelection="subTable.isSelection"
              :tableConfig="subTable.tableList" :subTable='subTable' :delete.sync="deleteList[subTable.subTableName]"
              :customRules="subTableCustomRules" :getRowClassName="getRowClassName" @editTableEvent='editTableEvent'>
              <!-- 名称 -->
              <template slot="edit-table-executeVarietiesName" slot-scope="{item, scope}">
                <el-input
                  :class="changeStyle(scope, item.prop, 'varietiesName')"
                  size="small"
                  :disabled="$route.name === 'processApprovalPage' ? item.inputStatus === 'disable' : !scope.varietiesId ? false : item.inputStatus === 'disable'"
                  :maxlength="Number(item.maxlength)"
                  :clearable="item.clearable === undefined ? true : item.clearable" v-model.trim="scope[item.prop]"
                  :placeholder="item.placeholder">
                  <el-tooltip v-if="scope.varietiesId && scope[item.prop] !== scope.varietiesName"
                    slot="suffix" class="item" effect="dark" :content="`${$t('tips.primary')}：${scope.varietiesName}`" placement="top">
                    <!-- 变 -->
                    <span class="changeStatus"><i class="el-icon-view smallFont error" style="right: 5px;"></i></span>
                  </el-tooltip>
                </el-input>
              </template>
              <!-- 规格 -->
              <template slot="edit-table-executeStandards" slot-scope="{item, scope}">
                <el-input
                  :class="changeStyle(scope, item.prop, 'standards')"
                  size="small"
                  :disabled="$route.name === 'processApprovalPage' ? item.inputStatus === 'disable' : !scope.varietiesId ? false : item.inputStatus === 'disable'"
                  :maxlength="Number(item.maxlength)"
                  :clearable="item.clearable === undefined ? true : item.clearable" v-model.trim="scope[item.prop]"
                  :placeholder="item.placeholder">
                  <el-tooltip v-if="scope.varietiesId && scope[item.prop] !== scope.standards"
                    slot="suffix" class="item" effect="dark" :content="`${$t('tips.primary')}：${scope.standards}`" placement="top">
                    <!-- 变 -->
                    <span class="changeStatus"><i class="el-icon-view smallFont error" style="right: 5px;"></i></span>
                  </el-tooltip>
                </el-input>
              </template>
              <!-- 单位 -->
              <template slot="edit-table-executeUnit" slot-scope="{item, scope}">
                <el-input
                  :class="changeStyle(scope, item.prop, 'unit')"
                  size="small"
                  :disabled="$route.name === 'processApprovalPage' ? item.inputStatus === 'disable' : !scope.varietiesId ? false : item.inputStatus === 'disable'"
                  :maxlength="Number(item.maxlength)"
                  :clearable="item.clearable === undefined ? true : item.clearable" v-model.trim="scope[item.prop]"
                  :placeholder="item.placeholder">
                  <el-tooltip v-if="scope.varietiesId && scope[item.prop] !== scope.unit" slot="suffix" class="item" effect="dark" :content="`${$t('tips.primary')}：${scope.unit}`" placement="top">
                    <!-- 变 -->
                    <span class="changeStatus"><i class="el-icon-view smallFont error" style="right: 5px;"></i></span>
                  </el-tooltip>
                </el-input>
              </template>
              <!-- 所属工程量名称 -->
              <template slot="edit-table-quantitiesName" slot-scope="{item, scope, rowIndex}">
                <div class="slot-input" v-if='pageConfig.projectForm.costControlRuleCode === "01" || pageConfig.projectForm.costControlRuleCode === "03"'>
                  <el-input v-if="!scope[item.prop]"
                    v-model.trim="scope[item.prop]" :size="item.size || 'small'" readonly>
                    <template slot="suffix" v-if="item.inputStatus !== 'disable' && pageDisabled">
                      <i v-if="scope[item.prop]" class="slot-close el-icon-circle-close"
                        @click="handleSubTableClearProjectChild(item, scope, rowIndex, subTable.subTableName)"></i>
                      <i class="multiple-choice-icon iconfont icon-menu"
                        @click="handleSubTableSelectProjectChild(item, scope, rowIndex, subTable.subTableName)"></i>
                    </template>
                  </el-input>
                  <div v-else style="font-size: 12px">{{scope[item.prop]}}</div>
                </div>
              </template>
              <!-- 所属费用科目 -->
              <template slot="edit-table-expenseName" slot-scope="{item, scope, rowIndex}">
                <div class="slot-input" v-if='pageConfig.projectForm.costControlRuleCode === "02"'>
                  <el-input v-if="!scope[item.prop]"
                    v-model.trim="scope[item.prop]" :size="item.size || 'small'" readonly>
                    <template slot="suffix" v-if="item.inputStatus !== 'disable' && pageDisabled">
                      <i v-if="scope[item.prop]" class="slot-close el-icon-circle-close"
                        @click="handleSubTableClearProjectChild(item, scope, rowIndex, subTable.subTableName)"></i>
                      <i class="multiple-choice-icon iconfont icon-menu"
                        @click="handleSubTableSelectProjectChild(item, scope, rowIndex, subTable.subTableName)"></i>
                    </template>
                  </el-input>
                  <div v-else style="font-size: 12px">{{scope[item.prop]}}</div>
                </div>
              </template>
              <template slot="edit-table-materialClassifyCode" slot-scope="{item, scope, rowIndex}">
                <el-select v-if="item.inputStatus !== 'disable' && pageDisabled && scope.demandType === '02'"
                  v-model.trim="scope[item.prop]" :placeholder="item.placeholder" :size="item.size || 'small'"
                  :disabled="item.inputStatus === 'disable'" :filterable="item.filterable || true" style="width:100%"
                  :clearable="item.clearable === undefined ? true : item.clearable"
                  @change="handleChange(item, scope, $event, rowIndex, subTable)">
                  <el-option v-for="(child, i) in item.selectList" :key="i"
                    :label="child.isTranslate ? $t(child.dataName) : child.dataName"
                    :value="item.isNumber ? Number(child.dataCode) : child.dataCode">
                  </el-option>
                </el-select>
                <div class="ellipsis smallFont grey" v-else>
                  {{setDicData(scope[item.prop], item.selectList || [], item)}}
                </div>
              </template>
              <template slot="edit-table-supplySourceCode" slot-scope="{item, scope, rowIndex}">
                <el-select v-if="item.inputStatus !== 'disable' && pageDisabled && scope.demandType === '02'"
                  v-model.trim="scope[item.prop]" :placeholder="item.placeholder" :size="item.size || 'small'"
                  :disabled="item.inputStatus === 'disable'" :filterable="item.filterable || true" style="width:100%"
                  :clearable="item.clearable === undefined ? true : item.clearable"
                  @change="handleChange(item, scope, $event, rowIndex, subTable)">
                  <el-option v-for="(child, i) in item.selectList" :key="i"
                    :label="child.isTranslate ? $t(child.dataName) : child.dataName"
                    :value="item.isNumber ? Number(child.dataCode) : child.dataCode">
                  </el-option>
                </el-select>
                <div class="ellipsis smallFont grey" v-else>
                  {{setDicData(scope[item.prop], item.selectList || [], item)}}
                </div>
              </template>
              <template slot="edit-table-majorCode" slot-scope="{item, scope, rowIndex}">
                <el-select v-if="item.inputStatus !== 'disable'"
                  v-model.trim="scope[item.prop]" :placeholder="item.placeholder" :size="item.size || 'small'"
                  :disabled="item.inputStatus === 'disable'" :filterable="item.filterable || true" style="width:100%"
                  :clearable="item.clearable === undefined ? true : item.clearable"
                  @change="handleChange(item, scope, $event, rowIndex, subTable)">
                  <el-option v-for="(child, i) in item.selectList" :key="i" :label="child[item.nameCode]"
                    :value="child[item.valueCode]">
                  </el-option>
                </el-select>
                <div class="ellipsis smallFont grey" v-else>
                  {{setSelectData(scope[item.prop], item.selectList || [], item)}}
                </div>
              </template>
              <!-- 所属进度工序 -->
              <template slot="edit-table-taskName" slot-scope="{item, scope, rowIndex}">
                  <div class="slot-input">
                      <el-input
                          v-model.trim="scope[item.prop]" :size="item.size || 'small'" readonly>
                          <template slot="suffix" v-if="item.inputStatus !== 'disable' && pageDisabled">
                          <i v-if="scope[item.prop]" class="slot-close el-icon-circle-close"
                              @click="handleSubTableClearWbs(item, scope, rowIndex, subTable.subTableName)"></i>
                          <i class="multiple-choice-icon iconfont icon-menu"
                              @click="handleSubTableSelectWbs(item, scope, rowIndex, subTable.subTableName)"></i>
                          </template>
                      </el-input>
                  </div>
              </template>
            </g-edit-table>
          </div>
        </div>
      </div>
    </edit-page>
    <!-- 选择材料分类 -->
    <g-dialog v-dialogDrag v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
      <innerOuterPlanDetials slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogVisible"
        :selectId="varietiesIdList" :selectList="selectList" :projectId="pageConfig.projectForm.projectId"
        varietiesTitle="tempPlan.masterPlan" @getData="getData" v-if="dialogVisible">
      </innerOuterPlanDetials>
    </g-dialog>
    <!-- 选择子工程 -->
    <g-dialog v-if="projectChildFlag" :dialogConfig="projectChildDialogConfig" :isVisible.sync="projectChildFlag">
      <usePlaceDialog slot="body" slot-scope="{height}" :dialogHeight="height"
        :selectId='subTableRow.row.usePlaceId || 0' :projectId="pageConfig.projectForm.projectId || 0"
        :close.sync="projectChildFlag" @getData="getProjectChild" v-if="projectChildFlag"></usePlaceDialog>
    </g-dialog>
    <!-- 导入 -->
    <g-import-dialog v-if="dialogImportFlag" @dialogEvent='dialogEvent' :dialogConfig="dialogConfig"
      :isVisible.sync="dialogImportFlag">
      <template slot="body" slot-scope='{height}'>
        <g-edit-pl-table slot="body" ref="importTable" :height='height' :type="type"
          :isSelection="subImportTable.isSelection" :tableConfig="subImportTable.tableList" :subTable='subImportTable'
          :delete.sync="deleteImportList" @editTableEvent='editImportTableEvent'>
          <!-- 名称 -->
          <template slot="edit-table-executeVarietiesName" slot-scope="{item, scope}">
            <el-input
              :class="changeStyle(scope, item.prop, 'varietiesName')"
              size="small"
              :disabled="$route.name === 'processApprovalPage' ? item.inputStatus === 'disable' : !scope.varietiesId ? false : item.inputStatus === 'disable'"
              :maxlength="Number(item.maxlength)"
              :clearable="item.clearable === undefined ? true : item.clearable" v-model.trim="scope[item.prop]"
              :placeholder="item.placeholder">
              <el-tooltip v-if="scope.varietiesId && scope[item.prop] !== scope.varietiesName"
                slot="suffix" class="item" effect="dark" :content="`${$t('tips.primary')}：${scope.varietiesName}`" placement="top">
                <!-- 变 -->
                <span class="changeStatus"><i class="el-icon-view smallFont error" style="right: 5px;"></i></span>
              </el-tooltip>
            </el-input>
          </template>
          <!-- 规格 -->
          <template slot="edit-table-executeStandards" slot-scope="{item, scope}">
            <el-input
              :class="changeStyle(scope, item.prop, 'standards')"
              size="small"
              :disabled="$route.name === 'processApprovalPage' ? item.inputStatus === 'disable' : !scope.varietiesId ? false : item.inputStatus === 'disable'"
              :maxlength="Number(item.maxlength)"
              :clearable="item.clearable === undefined ? true : item.clearable" v-model.trim="scope[item.prop]"
              :placeholder="item.placeholder">
                <el-tooltip v-if="scope.varietiesId && scope[item.prop] !== scope.standards"
                slot="suffix" class="item" effect="dark" :content="`${$t('tips.primary')}：${scope.standards}`" placement="top">
                  <!-- 变 -->
                  <span class="changeStatus"><i class="el-icon-view smallFont error" style="right: 5px;"></i></span>
                </el-tooltip>
            </el-input>
          </template>
          <!-- 单位 -->
          <template slot="edit-table-executeUnit" slot-scope="{item, scope}">
            <el-input
              :class="changeStyle(scope, item.prop, 'unit')"
              size="small"
              :disabled="$route.name === 'processApprovalPage' ? item.inputStatus === 'disable' : !scope.varietiesId ? false : item.inputStatus === 'disable'"
              :maxlength="Number(item.maxlength)"
              :clearable="item.clearable === undefined ? true : item.clearable" v-model.trim="scope[item.prop]"
              :placeholder="item.placeholder">
              <el-tooltip v-if="scope.varietiesId && scope[item.prop] !== scope.unit" slot="suffix" class="item" effect="dark" :content="`${$t('tips.primary')}：${scope.unit}`" placement="top">
                <!-- 变 -->
                <span class="changeStatus"><i class="el-icon-view smallFont error" style="right: 5px;"></i></span>
              </el-tooltip>
            </el-input>
          </template>
          <!-- <template slot="edit-table-varietiesName" slot-scope="{item, scope}">
            <el-input v-if="!scope.varietiesId" size="small" :disabled="item.inputStatus === 'disable'"
              :maxlength="Number(item.maxlength)" :clearable="item.clearable === undefined ? true : item.clearable"
              v-model.trim="scope[item.prop]" :placeholder="item.placeholder">
            </el-input>
            <div v-else class="ellipsis">{{scope[item.prop]}}</div>
          </template>
          <template slot="edit-table-standards" slot-scope="{item, scope}">
            <el-input v-if="!scope.varietiesId" size="small" :disabled="item.inputStatus === 'disable'"
              :maxlength="Number(item.maxlength)" :clearable="item.clearable === undefined ? true : item.clearable"
              v-model.trim="scope[item.prop]" :placeholder="item.placeholder">
            </el-input>
            <div v-else class="ellipsis">{{scope[item.prop]}}</div>
          </template>
          <template slot="edit-table-unit" slot-scope="{item, scope}">
            <el-input v-if="!scope.varietiesId" size="small" :disabled="item.inputStatus === 'disable'"
              :maxlength="Number(item.maxlength)" :clearable="item.clearable === undefined ? true : item.clearable"
              v-model.trim="scope[item.prop]" :placeholder="item.placeholder">
            </el-input>
            <div v-else class="ellipsis">{{scope[item.prop]}}</div>
          </template> -->
          <template slot="edit-table-supplySourceCode" slot-scope="{item, scope, rowIndex}">
            <el-select v-if="item.inputStatus !== 'disable' && pageDisabled && scope.demandType === '02'"
              v-model.trim="scope[item.prop]" :placeholder="item.placeholder" :size="item.size || 'small'"
              :disabled="item.inputStatus === 'disable'" :filterable="item.filterable || true" style="width:100%"
              :clearable="item.clearable === undefined ? true : item.clearable"
              @change="handleImportChange(item, scope, $event, rowIndex, subImportTable)">
              <el-option v-for="(child, i) in item.selectList" :key="i"
                :label="child.isTranslate ? $t(child.dataName) : child.dataName"
                :value="item.isNumber ? Number(child.dataCode) : child.dataCode">
              </el-option>
            </el-select>
            <div class="ellipsis smallFont grey" v-else>
              {{setDicData(scope[item.prop], item.selectList || [], item)}}
            </div>
          </template>
          <template slot="edit-table-materialClassifyCode" slot-scope="{item, scope, rowIndex}">
            <el-select v-if="item.inputStatus !== 'disable' && pageDisabled && scope.demandType === '02'"
              v-model.trim="scope[item.prop]" :placeholder="item.placeholder" :size="item.size || 'small'"
              :disabled="item.inputStatus === 'disable'" :filterable="item.filterable || true" style="width:100%"
              :clearable="item.clearable === undefined ? true : item.clearable"
              @change="handleChange(item, scope, $event, rowIndex, subImportTable)">
              <el-option v-for="(child, i) in item.selectList" :key="i"
                :label="child.isTranslate ? $t(child.dataName) : child.dataName"
                :value="item.isNumber ? Number(child.dataCode) : child.dataCode">
              </el-option>
            </el-select>
            <div class="ellipsis smallFont grey" v-else>
              {{setDicData(scope[item.prop], item.selectList || [], item)}}
            </div>
          </template>
          <template slot="edit-table-majorCode" slot-scope="{item, scope, rowIndex}">
            <el-select v-if="item.inputStatus !== 'disable'"
              v-model.trim="scope[item.prop]" :placeholder="item.placeholder" :size="item.size || 'small'"
              :disabled="item.inputStatus === 'disable'" :filterable="item.filterable || true" style="width:100%"
              :clearable="item.clearable === undefined ? true : item.clearable"
              @change="handleChange(item, scope, $event, rowIndex, subImportTable)">
              <el-option v-for="(child, i) in item.selectList" :key="i" :label="child[item.nameCode]"
                :value="child[item.valueCode]">
              </el-option>
            </el-select>
            <div class="ellipsis smallFont grey" v-else>
              {{setSelectData(scope[item.prop], item.selectList || [], item)}}
            </div>
          </template>
        </g-edit-pl-table>
      </template>
    </g-import-dialog>
    <g-dialog v-if="dialogContract" :dialogConfig="dialogConfigContract" :isVisible.sync="dialogContract">
      <contract slot="body" slot-scope="{height}" :dialogHeight="height"
        :selectId='pageConfig.projectForm.expendContractId' :projectId="pageConfig.projectForm.projectId"
        :projectName="pageConfig.projectForm.projectName" :close.sync="dialogContract" @getData="getContractData"
        v-if="dialogContract">
      </contract>
    </g-dialog>
    <!-- 所属进度工序 -->
    <g-dialog v-if="wbsFlag" :dialogConfig="wbsDialogConfig" :isVisible.sync="wbsFlag">
        <wbsDataDialog slot="body" slot-scope="{height}" :dialogHeight="height"
            :selectId='subTableWbsRow.row.wbs'
            :projectId="pageConfig.projectForm.projectId"
            :close.sync="wbsFlag" @getData="getWbs" v-if="wbsFlag"></wbsDataDialog>
    </g-dialog>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';
import { importPage } from 'mixins/importMixins';

export default {
  name: 'tempPlanEdit',
  mixins: [editPage, importPage],
  data () {
    const currentApplyQuantityValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('tempPlan.currentApplyQuantityTips')));
      } else {
        callback();
      }
    };
    return {
      page: new Page(),
      projectForm: {
        attachment: '',
        budgetTotalAmount: 0,
        currencyCode: '',
        currencyValue: '',
        incomeContractCode: '',
        incomeContractId: 0,
        incomeContractName: '',
        partyAUnitId: 0,
        partyAUnitName: '',
        projectId: 0,
        remarks: '',
        usePlaceCode: '',
        costControlRuleCode: '',
        costControlRuleValue: '',
        majorCode: '',
        majorValue: '',
        projectUnitName: '',
        projectUnitId: '',
        expendContractName: '',
        expendContractId: '',
        expendContractCode: '',
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      },
      // 选择材料
      dialogVisible: false,
      dialogConfig: {
        title: this.$t('tempPlan.seleMaterialVarieties'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '95%',
        span: '0.85'
      },
      varietiesIdList: [],
      selectList: [],
      back: '',
      // 子工程
      projectChildFlag: false,
      projectChildDialogConfig: {
        title: this.$t('dialog.selectProjectChild'),
        appendBody: false,
        center: true,
        top: '80px',
        width: '60%',
        span: '0.7'
      },
      projectChildConfig: '',
      subTableRow: {},
      subTableCustomRules: {
        currentApplyQuantity: [{ required: true, validator: currentApplyQuantityValid, trigger: 'blur' }]
      },
      importUrl: '/promaterial/demand/month/details/importExcel',
      that: '',
      dialogImportFlag: false,
      sysHandleDeletaAddShow: false,
      // 选择合同
      dialogContract: false,
      dialogConfigContract: {
        title: this.$t('tips.pleaseSelectContract'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      contractConfig: null
    };
  },
  props: {
    processParmas: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    innerOuterPlanDetials (resolve) {
      require(['components/material/innerOuterPlanDetials/innerOuterPlanDetials.vue'], resolve);
    },
    usePlaceDialog (resolve) {
      require(['components/basicComponents/global/dialog/usePlaceDialog/usePlaceDialog.vue'], resolve);
    },
    wbsDataDialog (resolve) {
      require(['components/basicComponents/global/dialog/wbsDataDialog/wbsDataDialog.vue'], resolve);
    },
    importFile (resolve) {
      require(['components/basicComponents/global/upload/importFile.vue'], resolve);
    },
    contract (resolve) {
      require(['../components/contract/contract.vue'], resolve);
    }
  },
  created() {
    this._mastercheckList();
  },
  methods: {
    // 获取info数据
    async _getInfoData (id = 0) {
      await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
        // 获取专业
        this.getProjectMajorlist();
        this.getUnitList();
        this.displayFieldsAccordingToProjectControlType('demandTempPlanDetail');
      });
    },
    // 获取校验规则
    _mastercheckList() {
        this.$store.dispatch('ruleSetting/mastercheckList').then(res => {
            if (res.status === 0) {
              if (res.results.length === 0) {
                this.sysHandleDeletaAddShow = false;
              } else {
                const butStatus = res.results[0];
                this.sysHandleDeletaAddShow = butStatus.status !== 0;
              }
            } else {
                this.$message.error(this.$t(`exception.${res.errorCode}`));
            }
        });
    },
    // 主表选择需要日期和拟使用部位后得回调
    handleSetRequiredDateUsePlace () {
      const costControlRuleCode = this.pageConfig.projectForm.costControlRuleCode;
      const { requiredDate, usePlaceId, usePlaceName, usePlaceCode } = this.pageConfig.projectForm;
      const tableData = this.pageConfig.subTableConfig['demandTempPlanDetail'].tableData;
      for (const item of tableData) {
        if (!item.requiredDate && requiredDate) {
          this.$set(item, 'requiredDate', requiredDate);
        }
        this.$set(item, 'usePlaceName', usePlaceName);
        this.$set(item, 'usePlaceCode', usePlaceCode);
        this.$set(item, 'usePlaceId', usePlaceId);
        if (costControlRuleCode === '01' || costControlRuleCode === '03') {
          !item.quantitiesName && this.$set(item, 'quantitiesName', usePlaceName);
          !item.quantitiesCode && this.$set(item, 'quantitiesCode', usePlaceCode);
        }
        if (costControlRuleCode === '02') {
          !item.expenseName && this.$set(item, 'expenseName', usePlaceName);
          !item.expenseCode && this.$set(item, 'expenseCode', usePlaceCode);
        }
      }
    },
    // 字段变化后
    changeStyle(row, after, before) {
      if (row.varietiesId && row[after] !== row[before]) {
        return 'afterStatus';
      }
    },
    checkRow (row) {
      if (row.demandType === '02' || row.demandType === '03') {
        return true;
      }
      const tableData = this.pageConfig.subTableConfig['demandTempPlanDetail'].tableData;
      const reaptTableData = {};
      for (const i in tableData) {
        const item = tableData[i];
        const data = reaptTableData[item.eId];
        if (data && data.length) {
          reaptTableData[item.eId].push(item); // 通过 eId 分组
        } else {
          this.$set(reaptTableData, item.eId, [item]);
        }
      }
      const arr = reaptTableData[row.eId]; //  当前行
      let totalQuantity = 0;
      for (const val of arr) {
        // 总月度需求数量
        totalQuantity += Number(((val.currentApplyQuantity || 0)).toFixed(4));
      }
      // 月度需求数量之和 > 预算数量 - 已申请数量
      const deleteNumber = Number(((row.budgetQuantity || 0) - (row.alreadyApplyQuantity || 0)).toFixed(4));
      if (totalQuantity > deleteNumber) {
        return true;
      } else {
        return false;
      }
    },
    // 校验项目
    handleCheckProject (params) {
      this.handleSelect(params, 'projectName', () => {
        if (params.selectList.length) {
          this._getProjectInfo();
          this.displayFieldsAccordingToProjectControlType('demandTempPlanDetail');

        } else {
          this.$set(this.pageConfig.projectForm, 'partyAUnitId', '');
          this.$set(this.pageConfig.projectForm, 'partyAUnitName', '');
          this.$set(this.pageConfig.projectForm, 'projectUnitName', '');
          this.$set(this.pageConfig.projectForm, 'projectUnitId', '');
        }
      });
    },
    // 获取项目详细信息
    _getProjectInfo () {
      const data = {
        projectId: this.pageConfig.projectForm.projectId
      };
      this.$store.dispatch('tempPlan/getProjectInfo', data).then(res => {
        if (res.results && res.results.length) {
          this.back = '';
          // this.$set(this.pageConfig.projectForm, 'partyAUnitId', res.results.partyAUnitId);
          // this.$set(this.pageConfig.projectForm, 'partyAUnitName', res.results.partyAUnitName);
          // 获取专业
          this.getProjectMajorlist();
        } else {
          // 未添加需求总计划
          this.$message.error(this.$t('tempPlan.backTips'));
          this.back = this.$t('tempPlan.backTips');
          this.$set(this.pageConfig.projectForm, 'partyAUnitId', '');
          this.$set(this.pageConfig.projectForm, 'partyAUnitName', '');
          this.$set(this.pageConfig.projectForm, 'projectUnitName', '');
          this.$set(this.pageConfig.projectForm, 'projectUnitId', '');
        }
        this.getUnitList();
      });
    },
    getUnitList() {
      if (!this.pageConfig.projectForm.projectId) return;
        // 获取施工单位
        const data1 = {
            projectId: this.pageConfig.projectForm.projectId,
            pageNo: 1,
            pageSize: 500,
            unitName: ''
        };
        this.$store.dispatch('publicApi/getUnitList', data1).then(res => {
            if (res.status === 0) {
                const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'projectUnitId');
                if (index >= 0) {
                  for (const item of res.results.records) {
                      this.$set(item, 'name', item.unitName);
                  }
                  if (res.results.records && res.results.records.length === 1) {
                      this.$set(this.pageConfig.projectForm, 'projectUnitName', res.results.records[0].name);
                      this.$set(this.pageConfig.projectForm, 'projectUnitId', res.results.records[0].id);
                  }
                  this.$set(this.pageConfig.mainFormConfig.formList[index], 'selectList', res.results.records);
                }
            } else {
                this.$message.error(this.$t(`exception.${res.errorCode}`));
            }
        });
    },
    // 选中
    handleChange (item, row, event, rowIndex, subTable) {
      const oItem = this.$clone(item);
      oItem.prop === 'majorCode' ? oItem.formType = 'select' : oItem.formType = 'dicSelect';
      const params = {
        item: oItem,
        row,
        event,
        subTable,
        rowIndex
      };
      this.handleTableSelect(params);
    },
    // 导入选中
    handleImportChange (item, row, event, rowIndex, subTable) {
      const supplySource = item.selectList.find(v => v.dataCode === event);
      row.supplySourceValue = supplySource ? supplySource.dataName : '';
    },
    // 变更专业后
    changeMajor() {
      const tableData = this.pageConfig.subTableConfig['demandTempPlanDetail'].tableData;
      for (const item of tableData) {
        if (!item.majorCode) {
          this.$set(item, 'majorCode', this.pageConfig.projectForm.majorCode);
          this.$set(item, 'majorValue', this.pageConfig.projectForm.majorValue);
        }
      }
    },
    getProjectMajorlist () {
      if (!this.pageConfig.projectForm.projectId) return;
      // 获取领用单位
      const data = {
        projectId: this.pageConfig.projectForm.projectId,
        majorValue: ''
      };
      this.$store.dispatch('projectMajor/getProjectMajorlist', data).then(res => {
        if (res.status === 0) {
          const tableList = this.pageConfig.subTableConfig['demandTempPlanDetail'].tableList.slaveColumns;
          const formList = this.pageConfig.mainFormConfig.formList;
          const key = tableList.findIndex(v => v.prop === 'majorCode');
          const index = formList.findIndex(v => v.prop === 'majorCode');
          if (key >= 0) {
            this.$set(tableList[key], 'selectList', res.results);
          }
          if (index >= 0) {
            this.$set(formList[index], 'selectList', res.results);
          }
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
      });
    },
    // ---------------------- 合同 --------------------
    // 清除合同
    handleClearContract (row, item) {
      const params = {
        paramsConfig: item,
        selectList: []
      };
      this.handleSelect(params, 'contractName');
    },
    // 打开合同弹窗
    handleSelectContract (row, item) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      this.contractConfig = this.$clone(item);
      this.dialogContract = true;
    },
    // 选中的合同数据
    getContractData (arr) {
      const params = {
        paramsConfig: this.contractConfig,
        selectList: arr
      };
      this.handleSelect(params, 'contractName', () => {
        this.dialogContract = false;
      });
    },
    // 数据字典
    setDicData (value, selectList, item) {
      const index = selectList && selectList.findIndex(v => String(v.dataCode) === String(value));
      if (index < 0) return '';
      return item.isTranslate ? this.$t(selectList[index].dataName) : selectList[index].dataName;
    },
    setSelectData (value, selectList, item) {
      const index = selectList && selectList.findIndex(v => String(v[item.valueCode]) === String(value));
      if (index < 0) return '';
      return item.isTranslate ? this.$t(selectList[index][item.nameCode]) : selectList[index][item.nameCode];
    },
    // 添加明细
    sysHandleDeletaAdd (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      if (!this.pageConfig.projectForm.applyDate) {
        // 请选择申请日期
        this.$message.error(this.$t('tempPlan.pleaseSelectApplyDate'));
        return;
      }
      const tableDataRow = this.$clone(this.pageConfig.subTableConfig[tableName].tableList.tableDataRow);
      tableDataRow.requiredDate = this.pageConfig.projectForm.requiredDate || '';
      tableDataRow.projectUnitName = this.pageConfig.projectForm.projectUnitName || '';
      tableDataRow.projectUnitId = this.pageConfig.projectForm.projectUnitId || '';
      tableDataRow.majorCode = this.pageConfig.projectForm.majorCode || '';
      tableDataRow.majorValue = this.pageConfig.projectForm.majorValue || '';
      tableDataRow.supplySourceCode = '01';
      tableDataRow.supplySourceValue = '自主采购';
      this.pageConfig.subTableConfig[tableName].tableData.push(tableDataRow);
    },
    // 选择明细
    sysHandleSelectDetail (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      if (!this.pageConfig.projectForm.applyDate) {
        // 请选择申请日期
        this.$message.error(this.$t('tempPlan.pleaseSelectApplyDate'));
        return;
      }
      // 去掉未添加需求总计划判断
      // if (this.back) {
      //     this.$message.error(this.$t('tempPlan.backTips'));
      //     return;
      // }
      const tableData = this.pageConfig.subTableConfig[tableName].tableData;
      const varietiesIdList = [];
      for (const item of tableData) {
        item.varietiesId && varietiesIdList.push(item.varietiesId);
      }
      this.varietiesIdList = varietiesIdList;
      this.selectList = tableData.filter(v => v.varietiesId);
      this.dialogVisible = true;
    },
    // 获取选中的数据
    getData (arr) {
      const data = [];
      const costControlRuleCode = this.pageConfig.projectForm.costControlRuleCode;
      const quantitiesName = (costControlRuleCode === '01' || costControlRuleCode === '03') ? this.pageConfig.projectForm.usePlaceName : '';
      const quantitiesCode = (costControlRuleCode === '01' || costControlRuleCode === '03') ? this.pageConfig.projectForm.usePlaceCode : '';
      const expenseName = costControlRuleCode === '02' ? this.pageConfig.projectForm.usePlaceName : '';
      const expenseCode = costControlRuleCode === '02' ? this.pageConfig.projectForm.usePlaceCode : '';
      for (const item of arr) {
        if (item.isNew) {
          data.push(
            {
              varietiesName: item.varietiesName,
              varietiesCode: item.varietiesCode,
              standards: item.standards,
              unit: item.unit,
              alreadyApplyQuantity: item.applyQuantity,
              createTime: this.$utils.commonUtil.formatTime(new Date()),
              currentApplyQuantity: 0,
              demandType: item.demandType,
              eId: item.demandType === '01' ? item.id : null,
              remarks: this.pageConfig.projectForm.remarks,
              requiredDate: this.pageConfig.projectForm.requiredDate,
              usePlaceId: this.pageConfig.projectForm.usePlaceId,
              usePlaceName: this.pageConfig.projectForm.usePlaceName,
              usePlaceCode: this.pageConfig.projectForm.usePlaceCode,
              varietiesId: item.varietiesId,
              // 带入字段
              demandTypeValue: item.demandType === '01' ? this.$t('dialog.planned') : this.$t('dialog.notPlanned'),
              brand: item.brand,
              models: item.models,
              majorCode: item.majorCode || '',
              majorValue: item.majorValue || '',
              materialClassifyCode: item.materialClassifyCode || '',
              materialClassifyValue: item.materialClassifyValue || '',
              supplySourceCode: item.supplySourceCode || '01',
              supplySourceValue: item.supplySourceValue || '自主采购',
              // 中标
              bidQuantity: item.bidQuantity || '',
              bidTotalAmount: item.bidTotalAmount || '',
              bidUnitPrice: item.bidUnitPrice || '',
              // 成控
              controlQuantity: item.controlQuantity || '',
              controlTotalAmount: item.controlTotalAmount || '',
              controlUnitPrice: item.controlUnitPrice || '',
              // 策划
              budgetQuantity: item.budgetQuantity,
              budgetTotalAmount: item.budgetTotalAmount,
              budgetUnitPrice: item.budgetUnitPrice,
              // 需求计划主表
              masterPlanId: item.masterPlanId,
              masterPlanDocNo: item.masterPlanDocNo,
              // 所属工程量名称、编号和所属费用类型名称和编号字段
              expenseCode: (item.expenseCode || '') || expenseCode,
              expenseName: (item.expenseName || '') || expenseName,
              quantitiesName: (item.quantitiesName || '') || quantitiesName,
              quantitiesCode: (item.quantitiesCode || '') || quantitiesCode,
              budgetCode: item.budgetCode || '',
              // 可修改名称、规格、单位
              executeStandards: item.standards,
              executeUnit: item.unit,
              executeVarietiesName: item.varietiesName
            }
          );
        }
      }
      const tableDataList = this.pageConfig.subTableConfig['demandTempPlanDetail'].tableData;
      const tableData = tableDataList.concat(data);
      this.$set(this.pageConfig.subTableConfig['demandTempPlanDetail'], 'tableData', tableData);
      this.dialogVisible = false;
      !this.pageConfig.projectForm.mainDemandDetail && this.setPurchaseContent('demandTempPlanDetail');
    },
    // 批量删除后计算
    deletTableCallback (tableName) {
      this.setPurchaseContent(tableName);
    },
    // 获取主要需求明细 前5 行内容
    setPurchaseContent (tableName) {
      const mainDemandDetail = this.pageConfig.subTableConfig[tableName].tableData.map(v => v.executeVarietiesName).slice(0, 5).join(',');
      this.$set(this.pageConfig.projectForm, 'mainDemandDetail', mainDemandDetail);
    },
    // ------------------------ 子表选择子工程 ---------------------------------
    handleSubTableClearProjectChild (item, row, rowIndex, tableName) {
      this.subTableRow = { item, row, rowIndex, tableName };
      if (item.prop === 'quantitiesName') {
        this.$set(this.pageConfig.subTableConfig[tableName].tableData[rowIndex], 'quantitiesName', '');
        this.$set(this.pageConfig.subTableConfig[tableName].tableData[rowIndex], 'quantitiesCode', '');
      } else {
        this.$set(this.pageConfig.subTableConfig[tableName].tableData[rowIndex], 'expenseName', '');
        this.$set(this.pageConfig.subTableConfig[tableName].tableData[rowIndex], 'expenseCode', '');
      }
    },
    // 选择子工程
    handleSubTableSelectProjectChild (item, row, rowIndex, tableName) {
      this.subTableRow = { item, row, rowIndex, tableName };
      this.projectChildFlag = true;
    },
    // 获取子工程
    getProjectChild (arr) {
      const { item, row, rowIndex, tableName } = {...this.subTableRow};
      if (item.prop === 'quantitiesName') {
        this.$set(this.pageConfig.subTableConfig[this.subTableRow.tableName].tableData[this.subTableRow.rowIndex], 'quantitiesName', arr.length > 0 ? arr[0].projectDetailName : '');
        this.$set(this.pageConfig.subTableConfig[this.subTableRow.tableName].tableData[this.subTableRow.rowIndex], 'quantitiesCode', arr.length > 0 ? arr[0].projectDetailCode : '');
      } else {
         this.$set(this.pageConfig.subTableConfig[this.subTableRow.tableName].tableData[this.subTableRow.rowIndex], 'expenseName', arr.length > 0 ? arr[0].projectDetailName : '');
         this.$set(this.pageConfig.subTableConfig[this.subTableRow.tableName].tableData[this.subTableRow.rowIndex], 'expenseCode', arr.length > 0 ? arr[0].projectDetailCode : '');
      }
      this.projectChildFlag = false;
    },
    // 保存
    handleSave (isProcess = false) {
      !this.pageConfig.projectForm.mainDemandDetail && this.setPurchaseContent('demandTempPlanDetail');
      this.$refs.editForm.getValidateForm(() => {
        const data = this.$clone(this.pageConfig.projectForm);
        const demandTempPlanDetail = this.$refs.demandTempPlanDetail[0].validateTableData();
        if (!demandTempPlanDetail || demandTempPlanDetail.length === 0) {
          // 存在未填写或个数错误的数据
          this.$message.error(`${this.$t('tempPlan.demandTempPlanDetail')}${this.$t('tips.notFilledIn')}`);
          return;
        }
        // 明细是否重复
        // const selectTableList = [];
        // for (const i in demandTempPlanDetail) {
        //   const item = demandTempPlanDetail[i];
        //   item.rowkey = `${item.varietiesName || ''}-${item.standards || ''}-${item.models || ''}-${item.brand || ''}-${item.unit || ''}`;
        //   const index = selectTableList.findIndex(v => v.rowkey === item.rowkey);
        //   if (index >= 0) {
        //     this.$message.error(`${this.$t('tips.theFirst')} ${Number(i) + 1} ${this.$t('tips.duplicateDetails')}`);
        //     return;
        //   } else {
        //     selectTableList.push(item);
        //   }
        // }
        // （如果与品种库的校验设置是关闭的）则
        // 如果此项目的成本类型是精细化或者费用类型或者项目基本信息中的策划是否必填为是，则子表的所属成本结构 做必填判断。
        const costStructureList = [];
        const quantityList = [];
        for (const i in demandTempPlanDetail) {
          const item = demandTempPlanDetail[i];
          this.$set(item, 'sorts', Number(i) + 1);
          // 既校验是否关闭只影响添加明细按钮和回写，与子表成本结构必填无关联。
          if ((data.costControlRuleCode === '01' || data.costControlRuleCode === '02' || data.masterCostControl === 1) && (!item.quantitiesName && !item.expenseName)) {
            costStructureList.push(item);
          }
          if (!item.currentApplyQuantity) {
            quantityList.push(item);
          }
          if (costStructureList && costStructureList.length) {
              const sorts = costStructureList.map(v => v.sorts).join(',');
              this.$message.error(`${this.$t('tips.theFirst')}${sorts}${this.$t('tips.row')}：${this.$t('tips.pleaseSelect')}${this.$t('fConfig.quantitiesName')}`);
              return;
          }
          if (quantityList && quantityList.length) {
              const sorts = quantityList.map(v => v.sorts).join(',');
              this.$message.error(`${this.$t('tips.theFirst')}${sorts}${this.$t('tips.row')}：${this.$t('tips.pleaseEnter')}${this.$t('tempPlan.currentApplyQuantity')}`);
              return;
          }
          this.$set(item, 'projectUnitId', data.projectUnitId);
          this.$set(item, 'projectUnitName', data.projectUnitName);
          this.$set(item, 'expendContractName', data.expendContractName);
          this.$set(item, 'expendContractId', data.expendContractId);
          this.$set(item, 'expendContractCode', data.expendContractCode);
        }
        data.tempPlanDetails = demandTempPlanDetail;
        this.handleSaveData(data, isProcess);
      });
    },
    // 模板下载
    sysHandleDownloadTemplate () {
      // 只能导入策划中不存在的材料，如本次所需材料策划中已存在，请通过选择明细按钮在策划中选择！
      const tips = this.$t('tempPlan.downTips');
      this.$confirm(tips, this.$t('tips.tips'), {
        confirmButtonText: this.$t('button.gotIt'),
        cancelButtonText: this.$t('button.close'),
        dangerouslyUseHTMLString: true,
        type: 'warning'
        }).then((e) => {
          this.handleDownloadTemplate();
      }).catch(() => {});
    },
    handleDownloadTemplate() {
      this.$store.dispatch('monthPlan/getDownloadTemplate').then(data => {
        if (!data) return;
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        const fileName = 'menu.tempPlan';
        link.setAttribute('download', `${this.$t(fileName)}${this.$t('tempPlan.demandTempPlanDetail')}${this.$t('fConfig.template')}.xls`);
        document.body.appendChild(link);
        link.click();
      });
    },
    // 导入前判断
    canImprotDetail () {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return false;
      }
      if (this.pageConfig.subTableConfig.demandTempPlanDetail.tableData.length !== 0) {
        this.$message.error(this.$t('dialog.improtFrontTips'));
        return false;
      }
      return true;
    },
    // 获取导入模板数据
    getImportData (val) {
      if (!val.tableData || !val.tableData.length) {
        this.$message.info(this.$t('tips.unllImport'));
        return;
      }
      const slaveColumns = val.tableList.slaveColumns;
      const index = slaveColumns.findIndex(v => v.prop === 'supplySourceCode');
      let supplySource = '';
      if (index >= 0) {
        supplySource = slaveColumns[index].selectList.find(v => v.dataCode === '01');
      }

      for (const item of val.tableData) {
        this.$set(item, 'demandType', '02');
        this.$set(item, 'supplySourceCode', '01');
        this.$set(item, 'supplySourceValue', supplySource ? supplySource.dataName : '自主采购');
      }

      this.subImportTable = val;
      this.dialogImportFlag = true;
    }
  }
};
</script>
<style  lang='scss' scoped>
.changeStatus{
  color: #f73535;
  // margin-right: 5px;
  position: absolute;
  right: -14px;
}
.afterStatus{
  /deep/ .el-input__inner{
    color: #f73535 !important;
  }
}

.editTable {
  /deep/ .cell{
    padding-right: 17px!important;
    padding-left: 17px!important;
  }
}
</style>
