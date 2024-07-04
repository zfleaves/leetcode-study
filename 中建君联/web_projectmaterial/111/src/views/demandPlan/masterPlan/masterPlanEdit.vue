<template>
  <div>
    <edit-page @editEvent="editEvent" v-loading="loading" :isCustomButton='isCustomButton' :isCustomButtonName='isCustomButtonName'>
      <div slot="editPage">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" :type="type" :tableConfig="pageConfig.mainFormConfig"
          :projectForm="pageConfig.projectForm" @editFormEvent="editFormEvent">
          <template slot="form-schemeNum" slot-scope="{scope, item}" v-if="item.inputStatus !== 'hide'">
              <el-form-item :label="$t(item.label)" :prop="item.prop"
                :class="item.label.length > 7 && 'maxLabel'" :title="$t(item.label)">
                  <div class="slot-input" v-if="scope.schemeNum">
                      <span class="midFont info">{{$t('tips.theFirst')}}{{scope.schemeNum}}{{$t('masterPlan.schemeNumTips')}}</span>
                  </div>
              </el-form-item>
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
        </g-edit-form>
        <!-- 明细清单 -->
        <div v-if="pageConfigLoading">
          <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
            <g-edit-title :title="$t(`masterPlan.${subTable.subTableName}`)"
              :titleTips="$t(`masterPlan.${subTable.titleTips}`)">
              <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
                <!-- 获取参考单价 -->
                <template v-if="pageConfig.projectForm && pageConfig.projectForm.costControlRuleCode === '03'" slot-scope="{parameter}" slot='button-getReferencePrice'>
                  <el-button
                    size="small"
                    type="primary"
                    :plain="false"
                    :disabled="parameter.disabled"
                    :icon="parameter.icon"
                    class="more"
                    v-fast-click
                    @click="getReferencePrice(parameter.subTableCode)">
                    {{$t('masterPlan.getReferencePrice')}}
                  </el-button>
                </template>
                <!-- 演算单价 -->
                <template v-if="pageConfig.projectForm && pageConfig.projectForm.costControlRuleCode !== '03'" slot-scope="{parameter}" slot='button-setCalculateUnitPrice'>
                  <el-button
                    size="small"
                    type="primary"
                    :plain="false"
                    :disabled="parameter.disabled"
                    :icon="parameter.icon"
                    class="more"
                    v-fast-click
                    @click="setCalculateUnitPrice(parameter.subTableCode)">
                    {{$t('masterPlan.setCalculateUnitPrice')}}
                  </el-button>
                </template>
                <!-- 下载模板 -->
                <template v-if="pageConfig.projectForm && pageConfig.projectForm.costControlRuleCode === '03'" slot-scope="{parameter}" slot='button-sysHandleDownloadTemplate'>
                  <el-button
                    size="small"
                    type="primary"
                    :plain="false"
                    :disabled="parameter.disabled"
                    :icon="parameter.icon"
                    class="more"
                    v-fast-click
                    @click="sysHandleDownloadTemplate(parameter.subTableCode)">
                    {{$t('button.downloadTemplate')}}
                  </el-button>
                </template>
                <template v-if="pageConfig.projectForm && pageConfig.projectForm.costControlRuleCode === '03'" slot-scope="{parameter, buttonConfig}" slot='button-sysHandleImport'>
                  <importFile :parameter='parameter' :buttonConfig='buttonConfig' @importData='getImportData'
                    :projectId="pageConfig.projectForm.projectId"
                    :editPage='that' :subTable='subTable' :flowStatus='parameter.disabled' :importUrl='importUrl'>
                  </importFile>
                </template>
                <template v-if="sysHandleDeletaAddShow && pageConfig.projectForm && pageConfig.projectForm.costControlRuleCode === '03'" slot-scope="{parameter}" slot='button-sysHandleDeletaAdd'>
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
              </g-button>
            </g-edit-title>
            <g-edit-pl-table :ref="subTable.subTableName" :type="type" :isSelection="subTable.isSelection"
              :tableConfig="subTable.tableList" :subTable='subTable' :delete.sync="deleteList[subTable.subTableName]"
              :getRowClassName="getRowClassName" :customRules="subTableCustomRules" @editTableEvent='editTableEvent'>
              <!-- 预算规格 -->
              <template slot="edit-table-standards" slot-scope="{item, scope}">
                <el-input
                  :class="changeStyle(scope, item.prop, 'budgetStandards')"
                  size="small"
                  :disabled="handleDisableStatus(item, scope)"
                  :maxlength="Number(item.maxlength)"
                  :clearable="item.clearable === undefined ? true : item.clearable" v-model.trim="scope[item.prop]"
                  :placeholder="item.placeholder">
                  <el-tooltip v-if="(scope.varietiesId || scope.preDetailId) && scope[item.prop] !== scope.budgetStandards"
                  slot="suffix" class="item" effect="dark" :content="`${$t('tips.primary')}：${scope.budgetStandards}`" placement="top">
                    <!-- 变 -->
                  <span class="changeStatus"><i class="el-icon-view smallFont error" style="right: 5px;"></i></span>
                  </el-tooltip>
                </el-input>
              </template>
              <!-- 名称 -->
              <template slot="edit-table-varietiesName" slot-scope="{item, scope}">
                <el-input
                  :class="changeStyle(scope, item.prop, 'originVarietiesName')"
                  size="small"
                  :disabled="handleDisableStatus(item, scope)"
                  :maxlength="Number(item.maxlength)"
                  :clearable="item.clearable === undefined ? true : item.clearable" v-model.trim="scope[item.prop]"
                  :placeholder="item.placeholder">
                  <el-tooltip v-if="(scope.varietiesId || scope.preDetailId) && scope[item.prop] !== scope.originVarietiesName"
                  slot="suffix" class="item" effect="dark" :content="`${$t('tips.primary')}：${scope.originVarietiesName}`" placement="top">
                    <!-- 变 -->
                  <span class="changeStatus"><i class="el-icon-view smallFont error" style="right: 5px;"></i></span>
                  </el-tooltip>
                </el-input>
              </template>
              <!-- 单位 -->
              <template slot="edit-table-unit" slot-scope="{item, scope}">
                <el-input v-if="!scope.varietiesId"
                  size="small" :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                  :clearable="item.clearable === undefined ? true : item.clearable" v-model.trim="scope[item.prop]"
                  :placeholder="item.placeholder">
                </el-input>
                <div v-else class="ellipsis">{{scope[item.prop]}}</div>
              </template>
              <!-- 所属工程量名称 -->
              <template slot="edit-table-quantitiesName" slot-scope="{item, scope, rowIndex}">
                <div class="slot-input" v-if='pageConfig.projectForm.costControlRuleCode === "03"'>
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
            </g-edit-pl-table>
          </div>
        </div>
      </div>
    </edit-page>
    <!-- 选择材料分类 -->
    <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
      <materialVarieties slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogVisible"
        :projectId="pageConfig.projectForm.projectId"
        :selectId="varietiesList" :selectList="selectList" @getData="getData" v-if="dialogVisible">
      </materialVarieties>
    </g-dialog>
    <g-dialog v-if="dialogProcostDetailsVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogProcostDetailsVisible">
      <procostDetails slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogProcostDetailsVisible"
        :projectId="pageConfig.projectForm.projectId"
        :costControlRuleCode="pageConfig.projectForm.costControlRuleCode"
        :selectId="varietiesList" :selectList="selectList" @getData="getData" v-if="dialogProcostDetailsVisible">
      </procostDetails>
    </g-dialog>
    <!-- 导入 -->
    <g-import-dialog v-if="dialogImportFlag" @dialogEvent='dialogEvent' :dialogConfig="dialogConfig"
      :isVisible.sync="dialogImportFlag">
      <template slot="body" slot-scope='{height}'>
        <g-edit-pl-table slot="body" ref="importTable" :height='height' :type="type"
          :isSelection="subImportTable.isSelection" :tableConfig="subImportTable.tableList" :subTable='subImportTable'
          :getRowClassName="getRowClassName" :customRules="subTableCustomRules"
          :delete.sync="deleteImportList" @editTableEvent='editImportTableEvent'>
          <!-- 名称 -->
          <template slot="edit-table-varietiesName" slot-scope="{item, scope}">
            <el-input
              :class="changeStyle(scope, item.prop, 'originVarietiesName')"
              size="small"
              :disabled="handleDisableStatus(item, scope)"
              :maxlength="Number(item.maxlength)"
              :clearable="item.clearable === undefined ? true : item.clearable" v-model.trim="scope[item.prop]"
              :placeholder="item.placeholder">
              <el-tooltip v-if="(scope.varietiesId || scope.preDetailId) && scope[item.prop] !== scope.originVarietiesName"
              slot="suffix" class="item" effect="dark" :content="`${$t('tips.primary')}：${scope.originVarietiesName}`" placement="top">
                <!-- 变 -->
              <span class="changeStatus"><i class="el-icon-view smallFont error" style="right: 5px;"></i></span>
              </el-tooltip>
            </el-input>
          </template>
          <!-- 预算规格 -->
          <template slot="edit-table-standards" slot-scope="{item, scope}">
            <el-input
              :class="changeStyle(scope, item.prop, 'budgetStandards')"
              size="small"
              :disabled="handleDisableStatus(item, scope)"
              :maxlength="Number(item.maxlength)"
              :clearable="item.clearable === undefined ? true : item.clearable" v-model.trim="scope[item.prop]"
              :placeholder="item.placeholder">
              <el-tooltip v-if="(scope.varietiesId || scope.preDetailId) && scope[item.prop] !== scope.budgetStandards"
              slot="suffix" class="item" effect="dark" :content="`${$t('tips.primary')}：${scope.budgetStandards}`" placement="top">
                <!-- 变 -->
              <span class="changeStatus"><i class="el-icon-view smallFont error" style="right: 5px;"></i></span>
              </el-tooltip>
            </el-input>
          </template>
          <template slot="edit-table-unit" slot-scope="{item, scope}">
            <el-input v-if="!scope.varietiesId"
              size="small" :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
              :clearable="item.clearable === undefined ? true : item.clearable" v-model.trim="scope[item.prop]"
              :placeholder="item.placeholder">
            </el-input>
            <div v-else class="ellipsis">{{scope[item.prop]}}</div>
          </template>
          <!-- 所属工程量名称 -->
          <template slot="edit-table-quantitiesName" slot-scope="{item, scope, rowIndex}">
            <div class="slot-input" v-if='pageConfig.projectForm.costControlRuleCode === "03"'>
              <el-input v-if="!scope[item.prop]"
                v-model.trim="scope[item.prop]" :size="item.size || 'small'" readonly>
                <template slot="suffix" v-if="item.inputStatus !== 'disable' && pageDisabled">
                  <i v-if="scope[item.prop]" class="slot-close el-icon-circle-close"
                    @click="handleSubTableClearProjectChild(item, scope, rowIndex, subImportTable.subTableName, true)"></i>
                  <i class="multiple-choice-icon iconfont icon-menu"
                    @click="handleSubTableSelectProjectChild(item, scope, rowIndex, subImportTable.subTableName, true)"></i>
                </template>
              </el-input>
              <div v-else style="font-size: 12px">{{scope[item.prop]}}</div>
            </div>
          </template>
        </g-edit-pl-table>
      </template>
    </g-import-dialog>
    <!-- 所属工程量清单、所属工程量清单编号、所属费用科目、所属费用科目编号 -->
    <g-dialog v-if="projectChildFlag" :dialogConfig="projectChildDialogConfig" :isVisible.sync="projectChildFlag">
      <usePlaceDialog slot="body" slot-scope="{height}" :dialogHeight="height"
        :selectId='subTableRow.row.quantitiesCode ? subTableRow.row.quantitiesCode: subTableRow.row.expenseCode || 0'
        :projectId="pageConfig.projectForm.projectId"
        :close.sync="projectChildFlag" @getData="getProjectChild" v-if="projectChildFlag"></usePlaceDialog>
    </g-dialog>
    <!-- 更新原因  :customRules="customRules"-->
      <g-dialog v-if="reNewdialogVisible" :dialogConfig="reNewdialogConfig" :isVisible.sync="reNewdialogVisible">
        <div class="content operationFormWrap" slot="body">
          <g-edit-form ref="reNewProjectForm" v-if="reNewdialogVisible" type="add"
            :tableConfig="pageConfig.reNewFormConfig" :projectForm="reNewProjectForm">
          </g-edit-form>
        </div>
        <div slot="footer" class="footer">
          <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small" @click="reNewdialogVisible = false">
            {{$t('button.close')}}
          </el-button>
          <el-button size="small" type="primary" icon="el-icon-circle-check" @click="drawerItemSave" v-fast-click>
            {{$t('button.save')}}
          </el-button>
        </div>
    </g-dialog>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';
import { importPage } from 'mixins/importMixins';

export default {
  name: 'masterPlanEdit',
  mixins: [editPage, importPage],
  data () {
    const budgetQuantityValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('masterPlan.budgetQuantityTips')));
      } else {
        callback();
      }
    };
    const budgetUnitPriceValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('masterPlan.budgetUnitPriceValidTips')));
      } else {
        callback();
      }
    };
    const budgetAmountValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('masterPlan.budgetAmountValidTips')));
      } else {
        callback();
      }
    };
    return {
      page: new Page(),
      projectForm: {
        updateReason: '',
        attachment: '',
        budgetTotalAmount: '',
        costControlRuleCode: '',
        costControlRuleValue: '',
        currencyCode: '',
        currencyValue: '',
        drawingAttachment: '',
        drawingCode: '',
        afterBudgetTotalAmount: '',
        incomeContractCode: '',
        incomeContractId: '',
        incomeContractName: '',
        mainConstructContent: '',
        majorCode: '',
        majorValue: '',
        materialClassifyCode: '',
        materialClassifyValue: '',
        partyAUnitId: '',
        partyAUnitName: '',
        projectId: '',
        remarks: '',
        schemeContent: '',
        schemeNum: '',
        taxRate: '',
        supplySourceCode: '01',
        supplySourceValue: '自主采购',
        masterCostControl: '',
        settlementCostControl: '',
        tenantId: this.$utils.Auth.hasUserInfo().tenantId,
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      },
      dialogVisible: false,
      dialogProcostDetailsVisible: false,
      dialogConfig: {
        title: this.$t('masterPlan.seleMaterialVarieties'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      varietiesList: [],
      selectList: [],
      importUrl: '/promaterial/demand/master/importExcel',
      that: '',
      subTableCustomRules: {
        // changeAfterQuantity: [{ required: true, validator: budgetQuantityValid, trigger: 'blur' }]
        // changeAfterUnitPrice: [{ required: true, validator: budgetUnitPriceValid, trigger: 'blur' }],
        // changeAfterAmount: [{ required: true, validator: budgetAmountValid, trigger: 'blur' }]
      },
      sysHandleDeletaAddShow: false,
      cloneSubTableList: [],
      // 所属工程量清单、所属工程量清单编号、所属费用科目、所属费用科目编号
      subTableRow: {},
      projectChildFlag: false,
      projectChildDialogConfig: {
        title: this.$t('dialog.selectProjectChild'),
        appendBody: false,
        center: true,
        top: '80px',
        width: '60%',
        span: '0.7'
      },
      importLoading: null,
      saveLoading: null,
      isCustomButton: false,
      isCustomButtonName: 'masterPlan.saveUpdate',
      // 更新原因
      customRules: {},
      reNewdialogVisible: false,
      reNewdialogConfig: {
        title: this.$t('masterPlan.updateReason'),
        appendBody: false,
        center: true,
        top: '150px',
        width: '40%',
        span: '0.27'
      },
      reNewProjectForm: {
        updateReason: ''
      }
    };
  },
  props: {
    processParmas: {
      type: Object,
      default: () => { }
    },
    judegMultitonColumns: {
      type: Function
    },
    pageNode: {
      default: ''
    }
  },
  components: {
    materialVarieties (resolve) {
      require(['components/material/materialVarieties/materialVarieties.vue'], resolve);
    },
    procostDetails (resolve) {
      require(['../components/procostDetails/procostDetails.vue'], resolve);
    },
    importFile (resolve) {
      require(['components/basicComponents/global/upload/importFile.vue'], resolve);
    },
    usePlaceDialog (resolve) {
      require(['components/basicComponents/global/dialog/usePlaceDialog/usePlaceDialog.vue'], resolve);
    }
  },
  created() {
    this.cloneSubTableList = this.$clone(this.page.PageConfig.subTableConfig['demandMasterPlanDetail'].tableList.slaveColumns);
    this._mastercheckList();
    this.type = this.$base64.decode(this.$route.params.type);
  },
  methods: {
    // 获取info数据
    async _getInfoData (id = 0) {
      await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
        this.getProjectMajorlist();
        this.costControlRuleSetSubTable();
        if (!this.pageConfig.projectForm.costControlRuleCode) {
          this.$store.dispatch('publicApi/getProjectInfo', {id: this.pageConfig.projectForm.projectId}).then(res => {
            if (res.status === 0) {
              this.$set(this.pageConfig.projectForm, 'costControlRuleCode', res.results.costControlRuleCode);
              this.$set(this.pageConfig.projectForm, 'costControlRuleValue', res.results.costControlRuleValue);
            }
          });
        }
        if (this.type === 'renew') {
          this.renewSetDataStatus();
        }
      });
    },
    // 更新设置数据状态
    renewSetDataStatus() {
      this.isCustomButton = true;
      const formList = this.pageConfig.mainFormConfig.formList;
      for (const item of formList) {
        this.$set(item, 'inputStatus', 'disable');
      }
      const tableList = this.pageConfig.subTableConfig['demandMasterPlanDetail'].tableList.slaveColumns;
      for (const item of tableList) {
        if (item.prop === 'changeAfterQuantity' || item.prop === 'remarks') {
          this.$set(item, 'inputStatus', 'edit');
        } else {
          this.$set(item, 'inputStatus', 'disable');
        }
      }
      const subTableButton = this.pageConfig.subTableConfig['demandMasterPlanDetail'].subTableButton;
      for (const item of subTableButton) {
        // if (item.code === 'sysHandleDeletaAdd' || item.code === 'sysHandleSelectDetail') {
        //   this.$set(item, 'disabled', false);
        // } else {
        //   this.$set(item, 'disabled', true);
        // }
        this.$set(item, 'disabled', true);
      }
    },
    // 专业变更后
    changeMajor() {
      const tableData = this.pageConfig.subTableConfig['demandMasterPlanDetail'].tableData;
      for (const item of tableData) {
        if (!item.majorCode) {
          this.$set(item, 'majorCode', this.pageConfig.projectForm.majorCode);
          this.$set(item, 'majorValue', this.pageConfig.projectForm.majorValue);
        }
      }
    },
    // 税率变更后
    changeTaxRate() {
      const tableData = this.pageConfig.subTableConfig['demandMasterPlanDetail'].tableData;
      const {taxRate} = this.pageConfig.projectForm;
      for (const item of tableData) {
        if (!item.taxRate && (taxRate === 0 || taxRate)) {
          this.$set(item, 'taxRate', taxRate);
        }
      }
    },
    // 物资类型变更后
    changeMaterialClassify() {
      const tableData = this.pageConfig.subTableConfig['demandMasterPlanDetail'].tableData;
      for (const item of tableData) {
        if (!item.materialClassifyCode) {
          this.$set(item, 'materialClassifyCode', this.pageConfig.projectForm.materialClassifyCode);
          this.$set(item, 'materialClassifyValue', this.pageConfig.projectForm.materialClassifyValue);
        }
      }
    },
    // 如果 策划数量 超过 图纸数量*（1+耗损率%），飘红；
    // 如果策划单价 超过 成控单价，飘红， => 策划单价/（1+税率）大于成控单价时飘红。
    // 如果执行规格不同于预算规格，飘红
    checkRow(row) {
      const changeAfterQuantity = Number(row.changeAfterQuantity || 0);
      const alreadySchemeQuantity = Number(row.alreadySchemeQuantity || 0);
      const controlQuantity = Number(row.controlQuantity || 0);
      const drawingQuantity = Number(row.drawingQuantity || 0);
      const lossRate = Number(row.lossRate || 0);
      const taxRate = Number(row.taxRate || 0);
      const changeAfterUnitPrice = Number(row.changeAfterUnitPrice || 0);
      const controlUnitPrice = Number(row.controlUnitPrice || 0);
      const {costControlRuleCode} = this.pageConfig.projectForm;
      if (costControlRuleCode === '01' || costControlRuleCode === '02') {
        // （策划数量 + 已策划数量） 超过 成控数量，飘红
        const quantity = Number((changeAfterQuantity + alreadySchemeQuantity).toFixed(4));
        if (quantity > controlQuantity) {
          return true;
        }
      }
      if ((row.drawingQuantity !== '' && row.drawingQuantity !== null && row.drawingQuantity !== undefined) &&
      (changeAfterQuantity > Number((drawingQuantity * (1 + (lossRate / 100))).toFixed(4)))) {
        return true;
      }
      if (Number((changeAfterUnitPrice / (1 + taxRate)).toFixed(2)) > controlUnitPrice) {
        return true;
      }
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
    // 校验项目
    handleCheckProject (params) {
      this.handleSelect(params, 'projectName', () => {
        this.getProjectMajorlist();
        this.costControlRuleSetSubTable();
      });
      // if (params.selectList.length) {
      //   const data = {
      //     masterPlanId: this.id || null,
      //     projectId: params.selectList[0].id
      //   };
      //   this.$store.dispatch('masterPlan/checkProject', data).then(res => {
      //     if (res.results) {
      //       // 该项目已添加施工总预算，不能再次添加。
      //       this.$message.error(this.$t('masterPlan.checkProjectTips'));
      //     } else {
      //       this.handleSelect(params, 'projectName', () => {
      //         this.getProjectMajorlist();
      //       });
      //     }
      //   });
      // } else {
      //   this.handleSelect(params, 'projectName', () => {
      //     this.getProjectMajorlist();
      //   });
      // }
    },
    getProjectMajorlist() {
      if (!this.pageConfig.projectForm.projectId) return;
        // 获取领用单位
        const data = {
            projectId: this.pageConfig.projectForm.projectId,
            majorValue: ''
        };
        this.$store.dispatch('projectMajor/getProjectMajorlist', data).then(res => {
            if (res.status === 0) {
              const formList = this.pageConfig.mainFormConfig.formList;
              const materialClassifyKey = formList.findIndex(v => v.prop === 'materialClassifyCode');
              const supplySourceKey = formList.findIndex(v => v.prop === 'supplySourceCode');
              const index = formList.findIndex(v => v.prop === 'majorCode');
              const schemeNumKey = formList.findIndex(v => v.prop === 'schemeNum');
              const tableList = this.pageConfig.subTableConfig['demandMasterPlanDetail'].tableList.slaveColumns;
              const key = tableList.findIndex(v => v.prop === 'majorCode');
              const materialClassifySubKey = tableList.findIndex(v => v.prop === 'materialClassifyCode');
              const supplySourceSubKey = tableList.findIndex(v => v.prop === 'supplySourceCode');
              if (index >= 0) {
                if (res.results && res.results.length === 1) {
                    this.$set(this.pageConfig.projectForm, 'majorValue', res.results[0].majorValue);
                    this.$set(this.pageConfig.projectForm, 'majorCode', res.results[0].majorCode);
                }
                this.$set(formList[index], 'selectList', res.results);
              }
              if (schemeNumKey >= 0) {
                this.$set(formList[schemeNumKey], 'inputStatus', this.pageConfig.projectForm.flowStatus !== '02' ? 'hide' : 'disable');
              }
              if (materialClassifySubKey >= 0) {
                this.$set(tableList[materialClassifySubKey], 'selectList', formList[materialClassifyKey].selectList);
              }
              if (key >= 0) {
                this.$set(tableList[supplySourceSubKey], 'selectList', formList[supplySourceKey].selectList);
              }
              if (key >= 0) {
                this.$set(tableList[key], 'selectList', res.results);
              }
            } else {
                this.$message.error(this.$t(`exception.${res.errorCode}`));
            }
        });
    },
    // 根据项目控制子表
    async costControlRuleSetSubTable() {
      const slaveColumns = this.pageConfig.subTableConfig['demandMasterPlanDetail'].tableList.slaveColumns;
      const taxRateIndex = slaveColumns.findIndex(v => v.prop === 'taxRate');
      if (taxRateIndex >= 0) {
        const index = this.cloneSubTableList.findIndex(v => v.prop === 'taxRate');
        index >= 0 && (this.cloneSubTableList[index].selectList = slaveColumns[taxRateIndex].selectList);
      }
      const tableList = this.$clone(this.cloneSubTableList);
      // 有导入
      // 03 执行策划管控，则采用系统现在的操作按钮与规则，
      // 其中所属工程量清单、所属工程量清单编号、所属费用科目、所属费用科目编号 这四个字段不需要判断正确性及必填性，且只能用户手动输入值。
      if (this.pageConfig.projectForm.costControlRuleCode === '03') {
        const setStatus = ['quantitiesName'];
        const setTextStatus = ['quantitiesCode'];
        const setNumStatus = ['bidQuantity', 'bidTotalAmount', 'bidUnitPrice', 'bidUnit', 'controlQuantity', 'controlTotalAmount', 'controlUnitPrice'];
        for (const i of setStatus) {
          const index = tableList.findIndex(v => v.prop === i);
          index >= 0 && this.$set(tableList[index], 'formType', 'slot');
        }
        for (const i of setTextStatus) {
          const index = tableList.findIndex(v => v.prop === i);
          index >= 0 && this.$set(tableList[index], 'formType', 'text');
        }
        for (const i of setNumStatus) {
          if (i !== 'bidUnit') {
            const index = tableList.findIndex(v => v.prop === i);
            index >= 0 && this.$set(tableList[index], 'formType', 'number');
          } else {
            const index = tableList.findIndex(v => v.prop === i);
            index >= 0 && this.$set(tableList[index], 'formType', 'input');
          }
        }
        const setHideStatus = ['sourceType', 'preDocNo', 'alreadySchemeQuantity', 'expenseName', 'expenseCode'];
        for (const i of setHideStatus) {
          const index = tableList.findIndex(v => v.prop === i);
          index >= 0 && this.$set(tableList[index], 'inputStatus', 'hide');
        }
      }
      // 无导入
      // 02 费用科目管控，则直接从目标成本分解选择材料明细，
      // 同时赋值材料品种编码、品种名称、预算规格、执行规格(可修改)、单位、中标数量、中标单价、中标合价、成控数量、成控单价、成控合价、预估利润、所属费用科目、所属费用科目编号，不可编辑
      // 对所属工程量清单、所属工程量清单编号隐藏。
      if (this.pageConfig.projectForm.costControlRuleCode === '02') {
        const setStatus = ['varietiesCode', 'unit', 'bidQuantity', 'bidUnitPrice', 'bidUnit', 'bidTotalAmount', 'controlQuantity',
        'controlUnitPrice', 'controlTotalAmount', 'estimateProfitAmount', 'expenseName', 'expenseCode'];
        for (const i of setStatus) {
          const index = tableList.findIndex(v => v.prop === i);
          index >= 0 && this.$set(tableList[index], 'formType', 'text');
        }
        const setHideStatus = ['quantitiesName', 'quantitiesCode', 'sourceType', 'preDocNo'];
        for (const i of setHideStatus) {
          const index = tableList.findIndex(v => v.prop === i);
          index >= 0 && this.$set(tableList[index], 'inputStatus', 'hide');
        }
      }
      // 无导入
      // 01 精细成本管控，则直接从目标成本分解选择材料明细
      // 同时赋值材料品种编码、品种名称、预算规格、执行规格(可修改)、单位、中标数量、中标单价、中标合价、成控数量、成控单价、成控合价、预估利润、所属工程量清单、所属工程量清单编号
      // 所属费用科目及所属费用编号隐藏。
      if (this.pageConfig.projectForm.costControlRuleCode === '01') {
        const setStatus = ['varietiesCode', 'unit', 'bidQuantity', 'bidUnitPrice', 'bidUnit', 'bidTotalAmount', 'controlQuantity',
        'controlUnitPrice', 'controlTotalAmount', 'estimateProfitAmount', 'quantitiesName', 'quantitiesCode'];
        const setHideStatus = ['expenseName', 'expenseCode'];
        for (const i of setStatus) {
          const key = tableList.findIndex(v => v.prop === i);
          key >= 0 && this.$set(tableList[key], 'formType', 'text');
        }
        for (const i of setHideStatus) {
          const index = tableList.findIndex(v => v.prop === i);
          index >= 0 && this.$set(tableList[index], 'inputStatus', 'hide');
        }
      }
      this.pageConfig.subTableConfig['demandMasterPlanDetail'].tableList.slaveColumns = tableList;
      if (this.$route.name === 'processApprovalPage' && this.pageNode !== 'BEGIN') {
        this.judegMultitonColumns();
      }
    },
    // 获取选中的参考价
    /*
     预算单价由预算软件+预算/造价员根据企业实际采购情况分析编制完成，且如果您在品种库没有维护好参考价，
     一般不要直接使用此获取功能。您确定要获取品种库的参考价覆盖预算单价吗？
    */
    getReferencePrice () {
      const tableData = this.pageConfig.subTableConfig['demandMasterPlanDetail'].tableData;
      if (!tableData.length) return this.$message.error(this.$t('tips.pleaseSelectDetailed'));
      this.$confirm(this.$t('masterPlan.masterPlanTips'), this.$t('tips.dataChangePrompt'), {
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      }).then(() => {
        const selectTableData = this.deleteList['demandMasterPlanDetail'];
        let materialVarietiesIds = [];
        if (selectTableData && selectTableData.length) {
          materialVarietiesIds = Array.from(new Set(selectTableData.map(v => v.varietiesId)));
        } else {
          materialVarietiesIds = Array.from(new Set(tableData.map(v => v.varietiesId)));
        }
        this.$store.dispatch('materialVarieties/getReferencePrice', materialVarietiesIds).then(res => {
          for (const item of tableData) {
            for (const row of res.results) {
              if (item.varietiesId === row.id) {
                const budgetUnitPrice = row.referencePrice === null ? 0 : row.referencePrice;
                const budgetAmount = Number(((item.changeAfterQuantity || 0) * budgetUnitPrice).toFixed(2));
                item.budgetUnitPrice = budgetUnitPrice;
                item.budgetAmount = budgetAmount;
                item.changeAfterUnitPrice = budgetUnitPrice;
                item.changeAfterAmount = budgetAmount;

                // ‘预估利润’：[自动计算，策划数量*（中标单价-策划单价）]；
                const changeAfterQuantity = Number((item.changeAfterQuantity || 0));
                const bidUnitPrice = Number((item.bidUnitPrice || 0));
                const estimateProfitAmount = Number((changeAfterQuantity * (bidUnitPrice - budgetUnitPrice)).toFixed(2));
                item.estimateProfitAmount = estimateProfitAmount;
              }
            }
          }
          this.deletTableCallback('demandMasterPlanDetail');
        });
      }).catch(() => { });
    },
    // 演算单价
    setCalculateUnitPrice(tableName) {
      const tableData = this.pageConfig.subTableConfig[tableName].tableData;
      if (!tableData.length) {
        // 无明细数据，不能演算单价。
        this.$message.error(this.$t('masterPlan.setCalculateUnitPriceDataTips'));
        return;
      }
      for (const item of tableData) {
        if (item.taxRate === null || item.taxRate === '' || item.taxRate === undefined) {
          // 请填写好税率，系统才能自动演算策划单价。
          this.$message.error(this.$t('masterPlan.setCalculateUnitPriceTaxRateTips'));
          return;
        }
      }
      // 您确定要用成控单价自动计算策划单价吗？计算规则为：策划单价=成控单价*（1+税率/100），
      // 计算结果会自动覆盖掉已有的策划单价，且直接将成控数量赋值给策划数量。
      this.$confirm(this.$t('masterPlan.setCalculateUnitPriceTips'), this.$t('masterPlan.setCalculateUnitPrice'), {
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      }).then(() => {
        for (const item of tableData) {
          const controlUnitPrice = Number(item.controlUnitPrice || 0);
          const taxRate = Number(item.taxRate || 0);
          let changeAfterUnitPrice = controlUnitPrice * (1 + taxRate);
          changeAfterUnitPrice = Number((changeAfterUnitPrice || 0).toFixed(2));
          this.$set(item, 'changeAfterUnitPrice', changeAfterUnitPrice);
          const alreadySchemeQuantity = Number(item.alreadySchemeQuantity || 0);
          const controlQuantity = Number(item.controlQuantity || 0);
          let changeAfterQuantity = controlQuantity - alreadySchemeQuantity;
          changeAfterQuantity = changeAfterQuantity < 0 ? 0 : changeAfterQuantity;
          this.$set(item, 'changeAfterQuantity', Number((changeAfterQuantity || 0).toFixed(4)));

          const changeAfterAmount = Number(((changeAfterQuantity || 0) * (changeAfterUnitPrice || 0)).toFixed(2));
          this.$set(item, 'changeAfterAmount', changeAfterAmount);
          this.$set(item, 'budgetQuantity', changeAfterQuantity);
          this.$set(item, 'budgetUnitPrice', changeAfterUnitPrice);
          this.$set(item, 'budgetAmount', item.changeAfterAmount);

          // ‘预估利润’：[自动计算，策划数量*（中标单价-策划单价）]；
          const bidUnitPrice = Number((item.bidUnitPrice || 0));
          // 利利润= 数量 *   【中标单价*（1+税率/100）  -   策划单价】
          const estimateProfitAmount = Number((changeAfterQuantity * ((bidUnitPrice * (1 + taxRate)) - changeAfterUnitPrice)).toFixed(2));
          this.$set(item, 'estimateProfitAmount', estimateProfitAmount);
        }
        this.deletTableCallback(tableName);
      }).catch(() => { });
    },
    // 选择明细
    sysHandleSelectDetail (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      const tableData = this.pageConfig.subTableConfig[tableName].tableData;
      const varietiesList = [];
      for (const item of tableData) {
        item.varietiesId && varietiesList.push({ varietiesId: item.varietiesId });
      }
      this.varietiesList = varietiesList;
      if (this.pageConfig.projectForm.costControlRuleCode === '03') {
        this.selectList = tableData.filter(v => v.varietiesId);
        console.log(this.selectList, 'selectList');
        console.log(tableData, 'tableData');
        this.dialogVisible = true;
      } else {
        this.selectList = tableData.filter(v => v.preDetailId);
        this.dialogProcostDetailsVisible = true;
      }
    },
    // 添加明细
    sysHandleDeletaAdd (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      const tableDataRow = this.$clone(this.pageConfig.subTableConfig[tableName].tableList.tableDataRow);
      tableDataRow.majorCode = this.pageConfig.projectForm.majorCode || '';
      tableDataRow.majorValue = this.pageConfig.projectForm.majorValue || '';
      tableDataRow.materialClassifyCode = this.pageConfig.projectForm.materialClassifyCode || '';
      tableDataRow.materialClassifyValue = this.pageConfig.projectForm.materialClassifyValue || '';
      tableDataRow.supplySourceCode = this.pageConfig.projectForm.supplySourceCode || '';
      tableDataRow.supplySourceValue = this.pageConfig.projectForm.supplySourceValue || '';
      this.pageConfig.subTableConfig[tableName].tableData.push(tableDataRow);
    },
    // 获取选中的数据
    getData (arr) {
      const data = [];
      const costControlRuleCode = this.pageConfig.projectForm.costControlRuleCode;
      const flag = costControlRuleCode === '01' || costControlRuleCode === '02';

      for (const item of arr) {
        const standards = item.budgetStandards || item.standards;
        data.push(
          {
            budgetQuantity: 0,
            budgetUnitPrice: 0,
            budgetAmount: 0,
            changeQuantity: 0,
            changeAmount: 0,
            changeAfterAmount: 0,
            changeAfterQuantity: 0,
            changeAfterUnitPrice: 0,
            remarks: '',
            varietiesId: item.varietiesId,
            originVarietiesName: item.varietiesName, // 原
            varietiesName: item.varietiesName, // 新
            varietiesCode: item.varietiesCode,
            standards: standards && standards.substring(0, 64), // 默认由预算规格赋值，可以修改
            unit: item.unit,
            bidQuantity: item.bidQuantity || '',
            bidTotalAmount: item.bidTotalAmount || '',
            bidUnitPrice: item.bidUnitPrice || '',
            bidUnit: item.bidUnit || '',
            brand: item.brand || '',
            budgetStandards: standards && standards.substring(0, 64),
            controlQuantity: item.controlQuantity || '',
            controlTotalAmount: item.controlTotalAmount || '',
            controlUnitPrice: item.controlUnitPrice || '',
            // drawingQuantity: item.drawingQuantity || '',
            drawingQuantity: flag ? item.controlQuantity : '',
            estimateProfitAmount: 0,
            alreadySchemeQuantity: item.alreadyApplyQuantity || 0,
            expenseCode: costControlRuleCode === '02' ? item.projectDetailCode : '',
            expenseName: costControlRuleCode === '02' ? item.projectDetailName : '',
            lossRate: item.lossRate || 0,
            masterPlanId: item.masterPlanId || '',
            models: item.models || '',
            preDetailId: item.preDetailId || '',
            preDocNo: item.preDocNo || '',
            preMainId: item.preMainId || '',
            quantitiesCode: costControlRuleCode === '01' ? item.projectDetailCode : '',
            quantitiesName: costControlRuleCode === '01' ? item.projectDetailName : '',
            budgetCode: item.budgetCode || '',
            sourceType: item.sourceType || '',
            taxRate: this.pageConfig.projectForm.taxRate,
            majorCode: this.pageConfig.projectForm.majorCode || '',
            majorValue: this.pageConfig.projectForm.majorValue || '',
            materialClassifyCode: this.pageConfig.projectForm.materialClassifyCode || '',
            materialClassifyValue: this.pageConfig.projectForm.materialClassifyValue || '',
            supplySourceCode: this.pageConfig.projectForm.supplySourceCode || '',
            supplySourceValue: this.pageConfig.projectForm.supplySourceValue || '',
            alreadyDemandQuantity: item.alreadyDemandQuantity
          }
        );
      }
      // 说明：
      //   1，策划明细与品种库校验规则开启时，选择明细完成时，需要校验一遍策划明细在品种库中是否存在，不存在时，提示：
      //   xxx在品种库中不存在，请核对数据是否正确，或者修改执行规则后再选择。
      //   2，策划明细与品种库校验规则关闭时，同现有逻辑一样， 选择明细完成时需要带出编码，名称、执行规格、单位品种库中存在带出编码，不存在时回写。
      this.getRelationVarietiesList(data, (details) => {
        this.setSubTableData(details);
      });
    },
    getRelationVarietiesList (arr, callback, type, errorCakkback) {
      if (!arr.length) {
        callback && callback(arr);
        return;
      }
      this.$store.dispatch('masterPlan/getRelationVarietiesList', arr).then(res => {
        const results = res.results || [];
        if (!this.sysHandleDeletaAddShow) {
          const varietiesNames = results.filter(v => !v.varietiesId).map(v => v.varietiesName).join(',');
          if (varietiesNames && !type) {
            this.$message.error(`${varietiesNames}${this.$t('masterPlan.getRelationVarietiesListTips')}`);
          }
          if (varietiesNames && type) {
            this.$message.error(`${varietiesNames}${this.$t('masterPlan.getRelationVarietiesListTips')}`);
            errorCakkback && errorCakkback();
            return;
          }
        }
        // 明细中存在已在品种库中被禁用的物资，建议在品种库中启用后再保存。禁用状态的物资编号有：xxx、xxx2、xxx3
        const dataStatus = results.filter(v => v.varietiesStatus !== 0 && v.varietiesId);
        const dataCode = dataStatus.map(v => v.varietiesCode).join('，');
        if (type && dataStatus && dataStatus.length) {
          this.$message.error(`${this.$t('tips.varietiesStatusTips')}：${dataCode}`);
          errorCakkback && errorCakkback();
          return;
        }
        callback && callback(results);
      });
    },
    setSubTableData (arr) {
      this.loading = true;
      this.setSubTable('demandMasterPlanDetail', arr);
    },
    setSubTable (tableName, arr) {
      const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
      let filterKey = '';
      this.pageConfig.projectForm.costControlRuleCode === '03' ? filterKey = 'varietiesId' : filterKey = 'preDetailId';
      const choiceTableData = tableData.filter(v => v[filterKey]);
      const addTableData = tableData.filter(v => !v[filterKey]);
      const selectTableList = [];
      const newSelectTableList = [];
      if (!choiceTableData.length || !arr.length) {
          this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', arr.concat(addTableData));
      }
      if (choiceTableData.length) {
          for (const item of choiceTableData) {
              for (const val of arr) {
                  if (item[filterKey] === val[filterKey]) {
                      selectTableList.push(item);
                  }
              }
          }
          for (const item of arr) {
              const index = choiceTableData.findIndex(v => v[filterKey] === item[filterKey]);
              if (index < 0) {
                  newSelectTableList.push(item);
              }
          }
          // console.log(newSelectTableList, 'newSelectTableList');
          // console.log(selectTableList, 'selectTableList');
          const myMap = new Map();
          const setData = selectTableList.filter((item) => {
            item.rowKey = `${item.varietiesId}${item.quantitiesCode}`;
            return !myMap.has(item.rowKey) && myMap.set(item.rowKey, 1);
          });
          this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', setData.concat(newSelectTableList, addTableData));
      }
      this.deletTableCallback(tableName);
      this.loading = false;
      this.dialogVisible = false;
      this.dialogProcostDetailsVisible = false;
    },
    // 计算
    handleCalculation ({ item, row, event, subTable, rowIndex }) {
      if (item.prop === 'controlQuantity' || item.prop === 'controlUnitPrice') {
        row.controlTotalAmount = Number(((row.controlQuantity || 0) * (row.controlUnitPrice || 0)).toFixed(2));
        return;
      }
      if (item.prop !== 'taxRate') {
        if (item.prop === 'bidQuantity' || item.prop === 'bidUnitPrice') {
          row.bidTotalAmount = Number(((row.bidQuantity || 0) * (row.bidUnitPrice || 0)).toFixed(2));
        } else if (item.prop === 'changeAfterAmount') {
          row.budgetAmount = (row.changeAfterAmount || 0);
          this.deletTableCallback(subTable.subTableName);
        } else {
          const changeAfterAmount = Number(((row.changeAfterQuantity || 0) * (row.changeAfterUnitPrice || 0)).toFixed(2));
          row.changeAfterAmount = changeAfterAmount;
          row.budgetQuantity = (row.changeAfterQuantity || 0);
          row.budgetUnitPrice = (row.changeAfterUnitPrice || 0);
          row.budgetAmount = changeAfterAmount;
          this.deletTableCallback(subTable.subTableName);
        }
      }
      // ‘预估利润’：[自动计算，策划数量*（中标单价-策划单价）]；
      const changeAfterQuantity = Number((row.changeAfterQuantity || 0));
      const bidUnitPrice = Number((row.bidUnitPrice || 0));
      const taxRate = Number((row.taxRate || 0));
      const changeAfterUnitPrice = Number((row.changeAfterUnitPrice || 0));
      // 利利润= 数量 *   【中标单价*（1+税率/100）  -   策划单价】
      const estimateProfitAmount = Number((changeAfterQuantity * ((bidUnitPrice * (1 + taxRate)) - changeAfterUnitPrice)).toFixed(2));
      row.estimateProfitAmount = estimateProfitAmount;
    },
    // 批量删除后计算
    deletTableCallback (tableName) {
      const data = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
      const budgetTotalAmount = data.reduce((a, b, c) => {
        return a += Number((b.budgetAmount || 0));
      }, 0);
      this.$set(this.pageConfig.projectForm, 'budgetTotalAmount', Number(budgetTotalAmount.toFixed(2)));
      const afterBudgetTotalAmount = data.reduce((a, b, c) => {
        return a += Number((b.changeAfterAmount || 0));
      }, 0);
      this.$set(this.pageConfig.projectForm, 'afterBudgetTotalAmount', Number(afterBudgetTotalAmount.toFixed(2)));
    },
    // ------------------------ 子表选择子工程 ---------------------------------
    handleSubTableClearProjectChild (item, row, rowIndex, tableName, isImprot) {
      this.subTableRow = { item, row, rowIndex, tableName, isImprot };
      if (isImprot) {
        if (item.prop === 'quantitiesName') {
          this.$set(this.subImportTable.tableData[rowIndex], 'quantitiesName', '');
          this.$set(this.subImportTable.tableData[rowIndex], 'quantitiesCode', '');
        } else {
          this.$set(this.subImportTable.tableData[rowIndex], 'expenseName', '');
          this.$set(this.subImportTable.tableData[rowIndex], 'expenseCode', '');
        }
      } else {
        if (item.prop === 'quantitiesName') {
          this.$set(this.pageConfig.subTableConfig[tableName].tableData[rowIndex], 'quantitiesName', '');
          this.$set(this.pageConfig.subTableConfig[tableName].tableData[rowIndex], 'quantitiesCode', '');
        } else {
          this.$set(this.pageConfig.subTableConfig[tableName].tableData[rowIndex], 'expenseName', '');
          this.$set(this.pageConfig.subTableConfig[tableName].tableData[rowIndex], 'expenseCode', '');
        }
      }
    },
    // 选择子工程
    handleSubTableSelectProjectChild (item, row, rowIndex, tableName, isImprot) {
      this.subTableRow = { item, row, rowIndex, tableName, isImprot };
      this.projectChildFlag = true;
    },
    // 获取子工程
    getProjectChild (arr) {
      const { item, row, rowIndex, tableName, isImprot } = {...this.subTableRow};
      if (isImprot) {
        if (item.prop === 'quantitiesName') {
          this.$set(this.subImportTable.tableData[this.subTableRow.rowIndex], 'quantitiesName', arr.length > 0 ? arr[0].projectDetailName : '');
          this.$set(this.subImportTable.tableData[this.subTableRow.rowIndex], 'quantitiesCode', arr.length > 0 ? arr[0].projectDetailCode : '');
        } else {
          this.$set(this.subImportTable.tableData[this.subTableRow.rowIndex], 'expenseName', arr.length > 0 ? arr[0].projectDetailName : '');
          this.$set(this.subImportTable.tableData[this.subTableRow.rowIndex], 'expenseCode', arr.length > 0 ? arr[0].projectDetailCode : '');
        }
      } else {
        if (item.prop === 'quantitiesName') {
          this.$set(this.pageConfig.subTableConfig[this.subTableRow.tableName].tableData[this.subTableRow.rowIndex], 'quantitiesName', arr.length > 0 ? arr[0].projectDetailName : '');
          this.$set(this.pageConfig.subTableConfig[this.subTableRow.tableName].tableData[this.subTableRow.rowIndex], 'quantitiesCode', arr.length > 0 ? arr[0].projectDetailCode : '');
        } else {
          this.$set(this.pageConfig.subTableConfig[this.subTableRow.tableName].tableData[this.subTableRow.rowIndex], 'expenseName', arr.length > 0 ? arr[0].projectDetailName : '');
          this.$set(this.pageConfig.subTableConfig[this.subTableRow.tableName].tableData[this.subTableRow.rowIndex], 'expenseCode', arr.length > 0 ? arr[0].projectDetailCode : '');
        }
      }
      this.projectChildFlag = false;
    },

    // 保存
    handleSave (isProcess = false) {
        this.$refs.editForm.getValidateForm(() => {
          if (this.type === 'renew') {
            const data = this.$clone(this.pageConfig.projectForm);
            const demandMasterPlanDetail = this.$refs.demandMasterPlanDetail[0].validateTableData();
            if (!demandMasterPlanDetail || demandMasterPlanDetail.length === 0) {
              // 存在未填写或个数错误的数据
              this.$message.error(`${this.$t('masterPlan.demandMasterPlanDetail')}${this.$t('tips.notFilledIn')}`);
              return;
            }
            const costStructureList = [];
            const changeAfterQuantityList = [];
            for (const i in demandMasterPlanDetail) {
              const item = demandMasterPlanDetail[i];
              this.$set(item, 'sorts', Number(i) + 1);
              // 根据所选项目的策划是否必填字段判断子表所属成本结构是否需要必填。
              if (data.masterCostControl === 1 && (!item.quantitiesName && !item.expenseName)) {
                costStructureList.push(item);
              }
              // 修改数量时，最好判断不能低于已经报量的数量，且最小为0;
              // 行， 策划数量[{keyValue}]不能低于已经报量的数量[{keyValue1}]且不能小于0
              const duplicateDetails = this.$t('masterPlan.duplicateDetails').replace('{keyValue1}', item.alreadyDemandQuantity ? item.alreadyDemandQuantity : 0);
              if (item.changeAfterQuantity < item.alreadyDemandQuantity || item.changeAfterQuantity < 0) {
                return this.$message.error(`${this.$t('masterPlan.demandMasterPlanDetail')}第 ${Number(i) + 1}${duplicateDetails}`);
              }
              if (item.alreadySchemeQuantity > 0 && !item.changeAfterQuantity) {
                changeAfterQuantityList.push(item);
              }
            }
            if (costStructureList && costStructureList.length) {
                const sorts = costStructureList.map(v => v.sorts).join(',');
                this.$message.error(`${this.$t('tips.theFirst')}${sorts}${this.$t('tips.row')}：${this.$t('tips.pleaseSelect')}${this.$t('fConfig.quantitiesName')}`);
                return;
            }
            if (changeAfterQuantityList && changeAfterQuantityList.length) {
                const sorts = changeAfterQuantityList.map(v => v.sorts).join(',');
                this.$message.error(`${this.$t('tips.theFirst')}${sorts}${this.$t('tips.row')}${this.$t('masterPlan.budgetQuantityTips')}`);
                return;
            }
            const repeatList = this.arrTest(demandMasterPlanDetail);
            if (repeatList.length) {
              const repeatRow = repeatList.map(v => Number(v.i) + 1).join(',');
              this.$message.error(`${this.$t('tips.theFirst')}${repeatRow}${this.$t('masterPlan.repeatTips')}`);
              return;
            }
            this.reNewdialogVisible = true;
          } else {
            const data = this.$clone(this.pageConfig.projectForm);
            const demandMasterPlanDetail = this.$refs.demandMasterPlanDetail[0].validateTableData();
            if (!demandMasterPlanDetail || demandMasterPlanDetail.length === 0) {
              // 存在未填写或个数错误的数据
              this.$message.error(`${this.$t('masterPlan.demandMasterPlanDetail')}${this.$t('tips.notFilledIn')}`);
              return;
            }
            // const costStructureList = [];
            const changeAfterQuantityList = [];
            for (const i in demandMasterPlanDetail) {
              const item = demandMasterPlanDetail[i];
              this.$set(item, 'sorts', Number(i) + 1);
              // // 根据所选项目的策划是否必填字段判断子表所属成本结构是否需要必填。
              // if (data.masterCostControl === 1 && (!item.quantitiesName && !item.expenseName)) {
              //   costStructureList.push(item);
              // }
              if (!item.changeAfterQuantity) {
                changeAfterQuantityList.push(item);
              }
            }
            // if (costStructureList && costStructureList.length) {
            //     const sorts = costStructureList.map(v => v.sorts).join(',');
            //     this.$message.error(`${this.$t('tips.theFirst')}${sorts}${this.$t('tips.row')}：${this.$t('tips.pleaseSelect')}${this.$t('fConfig.quantitiesName')}`);
            //     return;
            // }
            if (changeAfterQuantityList && changeAfterQuantityList.length) {
                const sorts = changeAfterQuantityList.map(v => v.sorts).join(',');
                this.$message.error(`${this.$t('tips.theFirst')}${sorts}${this.$t('tips.row')}${this.$t('masterPlan.budgetQuantityTips')}`);
                return;
            }
            const repeatList = this.arrTest(demandMasterPlanDetail);
            if (repeatList.length) {
              const repeatRow = repeatList.map(v => Number(v.i) + 1).join(',');
              this.$message.error(`${this.$t('tips.theFirst')}${repeatRow}${this.$t('masterPlan.repeatTips')}`);
              return;
            }
            this.saveLoading = this.$loading({
              lock: true,
              text: this.$t('tips.saveTips'),
              background: 'rgba(255, 255, 255, 0.5)'
            });
            if (this.$route.name === 'processApprovalPage' && this.pageNode !== 'BEGIN') {
              data.masterPlanDetails = demandMasterPlanDetail;
              this.demandCheckCostdetailcodes(data, isProcess);
              this.$nextTick(() => {
                this.saveLoading.close();
              });
            } else {
              this.getRelationVarietiesList(demandMasterPlanDetail, (details) => {
                data.masterPlanDetails = details;
                this.demandCheckCostdetailcodes(data, isProcess);
                this.$nextTick(() => {
                  this.saveLoading.close();
                });
              }, true, () => {
                this.saveLoading.close();
            });
          }
        }
      });
    },
    // 检验明细中成本编号对应的名称是否存在
    demandCheckCostdetailcodes(data, isProcess) {
      const params = {
        masterPlanDetailResultDtos: data.masterPlanDetails,
        projectId: this.pageConfig.projectForm.projectId
      };
      this.$store.dispatch('masterPlan/demandCheckCostdetailcodes', params).then(res => {
        if (res.status === 0) {
          if (res.results.length) {
            const list = [];
            const costStructureList = [];
             for (const i in res.results) {
              const item = res.results[i];
              if (!item.quantitiesName && item.quantitiesCode) {
                list.push(item.quantitiesCode);
              }
              // 根据所选项目的策划是否必填字段判断子表所属成本结构是否需要必填。
              if (data.masterCostControl === 1 && (!item.quantitiesName && !item.expenseName)) {
                costStructureList.push(item);
              }
             }
            if (list.length > 0) {
              // 不存在，请核对后修改正确再保存
              this.$message.error(`${this.$t('masterPlan.quantitiesName')}: ${list.join(', ')} ${this.$t('masterPlan.unQuantitiesNameTips')}`);
              return;
            } else {
              if (costStructureList && costStructureList.length) {
                const sorts = costStructureList.map(v => v.sorts).join(',');
                this.$message.error(`${this.$t('tips.theFirst')}${sorts}${this.$t('tips.row')}：${this.$t('tips.pleaseSelect')}${this.$t('fConfig.quantitiesName')}`);
                return;
              }
              data.masterPlanDetails = res.results;
              this.handleSaveData(data, isProcess);
            }
          }

          console.log(res.results, 'results');
        }
      });
    },
    // 保存更新
    drawerItemSave() {
      this.$refs.reNewProjectForm.getValidateForm(() => {
        this.saveLoading = this.$loading({
          lock: true,
          text: this.$t('tips.saveTips'),
          background: 'rgba(255, 255, 255, 0.5)'
        });
        const data = this.$clone(this.pageConfig.projectForm);
        const demandMasterPlanDetail = this.$refs.demandMasterPlanDetail[0].validateTableData();
        data.updateReason = this.reNewProjectForm.updateReason;
        data.createByName = this.$utils.Auth.hasUserInfo().userName;
        data.createTime = this.$utils.commonUtil.formatTime(new Date());
        data.orgId = this.$utils.Auth.hasUserInfo().orgId;
        data.tenantId = this.$utils.Auth.hasUserInfo().tenantId;
        data.parentSubOrgId = this.$utils.Auth.hasUserInfo().parentSubOrgId;
        this.getRelationVarietiesList(demandMasterPlanDetail, (details) => {
          data.masterPlanDetails = details;
            this._demandUpdateSave(data);
            this.$nextTick(() => {
              this.saveLoading.close();
            });
          }, true, () => {
          this.saveLoading.close();
        });
      });
    },
    _demandUpdateSave(data) {
       const loadingSubmit = this.$loading({
        lock: true,
        background: 'rgba(0,0,0,0.7)',
        spinner: 'el-icon-loading'
      });
      this.$store.dispatch('masterPlan/demandUpdateSave', data).then(res => {
        const status = this.$t('button.renew') ;
        if (res.status === 0) {
          this.$message.success(`${status}${this.$t('tips.success')}!`);
          this.setRoute();
          loadingSubmit.close();
        }
      });
    },
    // 判断是否重复
    arrTest (arr) {
      const list = [];
      const repeatList = [];
      for (const i in arr) {
        const item = arr[i];
        if (this.type !== 'renew' && !item.changeAfterQuantity) {
          this.$message(this.$t('masterPlan.budgetQuantityTips'));
          return;
        }
        if (this.type === 'renew' && (item.alreadySchemeQuantity > 0 && !item.changeAfterQuantity)) {
          this.$message(this.$t('masterPlan.budgetQuantityTips'));
          return;
        }
        // console.log(this.pageConfig.projectForm.costControlRuleCode);
        // 判重规则：
        // 成本工程量清单明细ID+型号、品牌、物资类别、拟供应来源、专业、所属成本编号
        if (this.pageConfig.projectForm.costControlRuleCode && this.pageConfig.projectForm.costControlRuleCode !== '03') {
          if (list.some(v => v.preDetailId === item.preDetailId &&
            v.models === item.models && v.brand === item.brand &&
            v.materialClassifyCode === item.materialClassifyCode && v.supplySourceCode === item.supplySourceCode &&
            v.majorCode === item.majorCode)) {
            repeatList.push({ item, i });
          } else {
            list.push(item);
          }
        }
        if (this.pageConfig.projectForm.costControlRuleCode === '03') {
          if (list.some(v => v.varietiesName === item.varietiesName &&
            v.standards === item.standards && v.unit === item.unit && v.quantitiesCode === item.quantitiesCode)) {
            repeatList.push({ item, i });
          } else {
            list.push(item);
          }
        }
      }
      return repeatList;
    },
    // 模板下载
    sysHandleDownloadTemplate () {
      this.$store.dispatch('masterPlan/getDownloadTemplate').then(data => {
        if (!data) return;
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        const fileName = 'menu.masterPlan';
        link.setAttribute('download', `${this.$t(fileName)}${this.$t('masterPlan.demandMasterPlanDetail')}${this.$t('fConfig.template')}.xls`);
        document.body.appendChild(link);
        link.click();
      });
    },
    // 导出明细
    sysHandleExport (tableName) {
      if (this.pageConfig.subTableConfig[tableName].tableData.length === 0) return;
      if (this.pageDisabled) {
        // 查看时可导出
        this.$message.error(`${this.$t('menu.masterPlan')}${this.$t('masterPlan.exportTips')}${this.$t('masterPlan.demandMasterPlanDetail')}`);
        return;
      }
      const data = {
        masterPlanId: this.id
      };
      this.$store.dispatch('masterPlan/getExportExcel', data).then(data => {
        if (!data) return;
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        const fileName = 'menu.masterPlan';
        link.setAttribute('download', `${this.$t(fileName)}${this.$t('masterPlan.demandMasterPlanDetail')}${this.$t('fConfig.excel')}.xls`);
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
      if (this.pageConfig.subTableConfig.demandMasterPlanDetail.tableData.length !== 0) {
        this.$message.error(this.$t('masterPlan.improtFrontTips'));
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
      for (const item of val.tableData) {
        item.changeQuantity = 0;
        item.changeAmount = 0;

        const controlTotalAmount = Number(((item.controlQuantity || 0) * (item.controlUnitPrice || 0)).toFixed(2));
        item.controlTotalAmount = item.controlTotalAmount ? item.controlTotalAmount : controlTotalAmount;
        const bidTotalAmount = Number(((item.bidQuantity || 0) * (item.bidUnitPrice || 0)).toFixed(2));
        item.bidTotalAmount = item.bidTotalAmount ? item.bidTotalAmount : bidTotalAmount;

        item.budgetAmount = (item.changeAfterAmount || 0);

        const changeAfterAmount = Number(((item.changeAfterQuantity || 0) * (item.changeAfterUnitPrice || 0)).toFixed(2));
        item.changeAfterAmount = item.changeAfterAmount ? item.changeAfterAmount : changeAfterAmount;
        item.budgetQuantity = (item.changeAfterQuantity || 0);
        item.budgetUnitPrice = (item.changeAfterUnitPrice || 0);

        // ‘预估利润’：[自动计算，策划数量*（中标单价-策划单价）]；
        const changeAfterQuantity = Number((item.changeAfterQuantity || 0));
        const bidUnitPrice = Number((item.bidUnitPrice || 0));
        const taxRate = Number((this.pageConfig.projectForm.taxRate || 0));
        const changeAfterUnitPrice = Number((item.changeAfterUnitPrice || 0));
        // 利利润= 数量 *   【中标单价*（1+税率/100）  -   策划单价】
        const estimateProfitAmount = Number((changeAfterQuantity * ((bidUnitPrice * (1 + taxRate)) - changeAfterUnitPrice)).toFixed(2));
        item.estimateProfitAmount = estimateProfitAmount;
        this.$set(item, 'sourceType', '');
        item.majorCode = item.majorCode ? item.majorCode : this.pageConfig.projectForm.majorCode || '';
        item.majorValue = item.majorValue ? item.majorCode : this.pageConfig.projectForm.majorValue || '';
        item.materialClassifyCode = item.materialClassifyCode ? item.materialClassifyCode : this.pageConfig.projectForm.materialClassifyCode || '';
        item.materialClassifyValue = item.materialClassifyCode ? item.materialClassifyValue : this.pageConfig.projectForm.materialClassifyValue || '';
        item.supplySourceCode = item.supplySourceCode ? item.supplySourceCode : this.pageConfig.projectForm.supplySourceCode || '';
        item.supplySourceValue = item.supplySourceCode ? item.supplySourceValue : this.pageConfig.projectForm.supplySourceValue || '';
      }
      this.subImportTable = val;
      this.dialogImportFlag = true;
    },
    // 保存导入明细数据
    sysHandleImportSave(tableName) {
        const importDetails = this.$refs.importTable.validateTableData();
        if (!importDetails) {
          // 请检查必填项是否填写，特别注意边框变为红色的数据
          this.$message.error(this.$t('masterPlan.importSaveTips'));
        } else {
          this.setImportDetails(importDetails, tableName);
          // const repeatList = this.arrTest(importDetails);
          // if (repeatList.length) {
          //   const repeatRow = repeatList.map(v => Number(v.i) + 1).join(',');
          //   // 第xx行有重复，请您核对！您有两个处理方式：
          //   // 1，请您手动删除重复项；
          //   // 2，点击下方按钮“求和去重”，实现 合并同类项 并 自动数量、金额求和，单价会被平均。
          //   const message1 = `${this.$t('tips.theFirst')}${repeatRow}${this.$t('masterPlan.repeatImportTips1')}`;
          //   const message2 = this.$t('masterPlan.repeatImportTips2');
          //   const message3 = this.$t('masterPlan.repeatImportTips3');
          //   this.$confirm(`<span style="color:red">${message1}</span><br>${message2}<br>${message3}`,
          //   `${this.$t(`menu.${this.$route.params.translateName}`)}${this.$t('button.initForm')}`, {
          //       dangerouslyUseHTMLString: true,
          //       confirmButtonText: this.$t('masterPlan.repeatImportBut1'),
          //       cancelButtonText: this.$t('button.close'),
          //       type: 'warning'
          //   }).then(() => {
          //     this.handleImportRepeat(importDetails, (details) => {
          //       this.setImportDetails(details, tableName);
          //     });
          //   }).catch(() => {
          //   });
          // } else {
          //   this.setImportDetails(importDetails, tableName);
          // }
        }
    },
    setImportDetails(importDetails, tableName) {
      const fieldLengthAll = this.setFieldLength(importDetails);
      if (fieldLengthAll.list.length) {
        const tipsList = [];
        for (const item of fieldLengthAll.list) {
          tipsList.push(`<span style="color:red">${this.$t('tips.theFirst')}${item.index}${this.$t('tips.row')}：${item.label};</span><br>`);
        }
        // 字段长度超过限制数，点击确认系统会动截取，是否继续？
        this.$confirm(`${tipsList.join('')}${this.$t('tips.fieldLengthTips1')}`,
        `${this.$t(`menu.${this.$route.params.translateName}`)}${this.$t('tips.fieldLengthTips2')}`, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: this.$t('tips.interceptBut1'),
            cancelButtonText: this.$t('button.close'),
            type: 'warning'
        }).then(() => {
          this.saveImportData(fieldLengthAll.details, tableName);
        }).catch(() => {
        });
      } else {
        this.saveImportData(importDetails, tableName);
      }
    },
    saveImportData(importDetails, tableName) {
      this.importLoading = this.$loading({
        lock: true,
        text: this.$t('tips.saveTips'),
        background: 'rgba(255, 255, 255, 0.5)'
      });
      const tableData = this.pageConfig.subTableConfig[tableName].tableData;
      this.getRelationVarietiesList(importDetails, (details) => {
        this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', tableData.concat(details));
        this.dialogImportFlag = false;
        // 子表长度变化后的数值计算回调
        this.deletTableCallback && this.deletTableCallback(tableName);
        this.$nextTick(() => {
          this.importLoading.close();
        });
      });
    },
    // 导入时判断是否重复
    arrImportTest (arr) {
      const reaptTableData = {};
      const list = [];
      for (const i in arr) {
        const item = arr[i];
        this.$set(item, 'index', Number(i) + 1);
        const rowKey = `${item.varietiesName || ''}-${item.standards || ''}-${item.unit || ''}`;
        const data = reaptTableData[rowKey];
        if (data && data.length) {
          reaptTableData[rowKey].push(item); // 通过 eId 分组
          const listInfo = list.find(v => `${v.varietiesName || ''}-${v.standards || ''}-${v.unit || ''}` === rowKey);
          if (listInfo) {
            const changeAfterQuantity = (listInfo.changeAfterQuantity || 0) + (item.changeAfterQuantity || 0);
            const changeAfterAmount = (listInfo.changeAfterAmount || 0) + (item.changeAfterAmount || 0);
            const changeAfterUnitPrice = (changeAfterAmount / changeAfterQuantity) || 0;
            const bidUnitPrice = Number((listInfo.bidUnitPrice || 0));
            const taxRate = Number((this.pageConfig.projectForm.taxRate || 0));
            // 利利润= 数量 *   【中标单价*（1+税率/100）  -   策划单价】
            const estimateProfitAmount = Number((changeAfterQuantity * ((bidUnitPrice * (1 + taxRate)) - changeAfterUnitPrice)).toFixed(2));

            this.$set(listInfo, 'changeAfterQuantity', Number(changeAfterQuantity.toFixed(4)));
            this.$set(listInfo, 'changeAfterAmount', Number(changeAfterAmount.toFixed(2)));
            this.$set(listInfo, 'changeAfterUnitPrice', Number(changeAfterUnitPrice.toFixed(2)));
            this.$set(listInfo, 'estimateProfitAmount', estimateProfitAmount);
          }
        } else {
          this.$set(reaptTableData, rowKey, [item]);
          list.push(item);
        }
      }
      const importData = {reaptTableData, list};
      return importData;
    },
    // 导入时判断字段长度是否超出
    setFieldLength(importDetails) {
      const list = [];
      const details = this.$clone(importDetails);
      let listIndex = -1;
      for (const i in details) {
        const item = details[i];
        for (const prop in item) {
          const tableList = this.subImportTable.tableList.slaveColumns;
          const index = tableList.findIndex(v => v.prop === prop);
          if (index >= 0 && tableList[index].formType !== 'text') {
            if ((item[prop] && item[prop].length && tableList[index].maxlength) && (item[prop].length > tableList[index].maxlength)) {
              if (typeof item[prop] !== 'number') {
                item[prop] = item[prop].substr(0, tableList[index].maxlength);
              }
              if (list[listIndex] && (list[listIndex] && list[listIndex].index === Number(i) + 1)) {
                list[listIndex].label = `${list[listIndex].label},${this.$t(tableList[index].label)}`;
              } else {
                listIndex = listIndex + 1;
                list[listIndex] = {index: Number(i) + 1, label: this.$t(tableList[index].label)};
              }
            }
          }
        }
      }
      return {
        list,
        details
      };
    },
    // 求和去重
    handleImportRepeat(importDetails, callback) {
      const reaptTableData = this.arrImportTest(importDetails);
      callback && callback(reaptTableData.list);
    },
    handleImportCalculation (params) {
      this.handleCalculation(params);
    },
    // 字段变化后
    changeStyle(row, after, before) {
      const key = this.pageConfig.projectForm.costControlRuleCode === '03' ? 'varietiesId' : 'preDetailId';
      if (row[key] && row[after] !== row[before]) {
        return 'afterStatus';
      }
    },
    handleDisableStatus(item, row) {
      const key = this.pageConfig.projectForm.costControlRuleCode === '03' ? 'varietiesId' : 'preDetailId';
      return this.$route.name === 'processApprovalPage' ? item.inputStatus === 'disable' : !row[key] ? false : item.inputStatus === 'disable';
    }
  }
};
</script>
<style lang="scss" scoped>
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
.operationFormWrap{
  margin-top: 25px!important;
}
.ellipsis{
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
