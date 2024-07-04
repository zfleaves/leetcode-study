<template>
  <div>
    <edit-page @editEvent="editEvent" v-loading="loading">
      <div slot="editPage">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" :type="type" :tableConfig="pageConfig.mainFormConfig"
          :projectForm="pageConfig.projectForm" :customRules="customRules" @editFormEvent="editFormEvent">
          <!-- 选择合同 -->
          <template slot="form-contractName" slot-scope="{scope, item}">
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
          <!-- 选择发票 -->
          <template slot="form-settlementInvoiceRelations" slot-scope="{scope, item}">
            <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
              :title="$t(item.label)">
              <multiple-choice :selectConfig="selectInvoiceConfig"
                :isDisabled="item.inputStatus !== 'disable' && pageDisabled" @select="handleSelectInvoice(scope)"
                @tagDelete="handleDeleteInvoice"></multiple-choice>
            </el-form-item>
          </template>
          <!-- 选择入库单 -->
          <template slot="form-settlementIncomingRelations" slot-scope="{scope, item}">
            <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
              :title="$t(item.label)">
              <multiple-choice :selectConfig="selectIncomingConfig"
                :isDisabled="item.inputStatus !== 'disable' && pageDisabled" @select="handleSelectIncoming(scope)"
                @tagDelete="handleDeleteIncoming"></multiple-choice>
            </el-form-item>
          </template>
          <!-- 选择退货单 -->
          <template slot="form-settlementReturngoodsRelations" slot-scope="{scope, item}">
            <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
              :title="$t(item.label)">
              <multiple-choice :selectConfig="selectReturnConfig"
                :isDisabled="item.inputStatus !== 'disable' && pageDisabled" @select="handleSelectReturn(scope)"
                @tagDelete="handleDeleteReturn"></multiple-choice>
            </el-form-item>
          </template>
        </g-edit-form>
        <!-- 明细清单 -->
        <div v-if="pageConfigLoading">
          <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
            <g-edit-title :title="$t(`purchaseSettlement.${subTable.subTableName}`)"
              v-if="subTable.subTableName === 'purchaseSettlementDetail'"
              :titleTips="$t(`purchaseSettlement.${subTable.titleTips}`)">
              <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable" otherPayments>
                <div class="calculationTule" slot="first">
                   <el-select v-model="calculation" @change="handleSelectCalculation">
                     <!-- 填写含税计算不含税 -->
                    <el-option  :label="$t('tips.calculation1')" value="01">
                    </el-option>
                    <!-- 填写不含税计算含税 -->
                    <el-option  :label="$t('tips.calculation2')" value="02">
                    </el-option>
                  </el-select>
                </div>
                <!-- 全量结算 -->
                <template slot-scope="{parameter}" slot='button-sysFullSettlement'>
                  <el-button
                    size="small"
                    type="primary"
                    class="more"
                    :plain="false"
                    :disabled="parameter.disabled"
                    :icon="parameter.icon"
                    v-fast-click
                    @click="sysFullSettlement(parameter.subTableCode)">
                    {{$t('purchaseSettlement.fullsettlement')}}
                  </el-button>
                  <el-tooltip placement="top" style="margin: 0 8px;">
                    <div slot="content" style="line-height: 24px;">
                        <div>
                          <!-- 系统自动 一键获取入库单的全量数据，不进行任何计算，请务必自行检查保证数据的正确性。 -->
                          {{$t('purchaseSettlement.fullsettlementTips1')}}
                        </div>
                    </div>
                    <span class="tips-item"><i class="el-icon-question"></i></span>
                  </el-tooltip>
                </template>
                <el-tooltip placement="top" style="margin: 0 8px;" v-if="false">
                  <div slot="content" style="line-height: 24px;">
                      <div>
                        <!-- 系统自动 一键获取入库单的全量数据，不进行任何计算，请务必自行检查保证数据的正确性。 -->
                        {{$t('purchaseSettlement.fullsettlementTips1')}}
                      </div>
                  </div>
                  <span class="tips-item"><i class="el-icon-question"></i></span>
                </el-tooltip>
                <!-- 合并填价 -->
                <template slot-scope="{parameter}" slot='button-sysMergeFillPrice'>
                  <el-button
                    size="small"
                    type="primary"
                    class="more"
                    :plain="false"
                    :disabled="parameter.disabled"
                    v-fast-click
                    @click="sysMergeFillPrice(parameter.subTableCode)">
                    {{$t('purchaseSettlement.mergeFillPrice')}}
                  </el-button>
                  <el-tooltip placement="top" style="margin: 0 8px;">
                    <div slot="content" style="line-height: 24px;">
                        <div>
                          <!-- 此功能仅仅是为了提升您遇到大量重复（名称、规格、单位、型号、品牌完全相同）的入库材料，可以按同单价结算时使用，对系统逻辑无任何影响或改变。 -->
                          {{$t('purchaseSettlement.mergeFillPriceTips1')}}
                        </div>
                    </div>
                    <span class="tips-item"><i class="el-icon-question"></i></span>
                  </el-tooltip>
                </template>
                <!-- 导入 -->
                <template slot-scope="{parameter, buttonConfig}" slot='button-sysHandleImport'>
                  <importFile :parameter='parameter' :buttonConfig='buttonConfig' @importData='getImportData'
                    :editPage='that' :subTable='subTable' :flowStatus='parameter.disabled' :importUrl='importUrl'>
                  </importFile>
                </template>
              </g-button>
            </g-edit-title>
            <g-edit-pl-table :ref="subTable.subTableName" :type="type" :isSelection="subTable.isSelection"
              v-if="subTable.subTableName === 'purchaseSettlementDetail'"
              :tableConfig="subTable.tableList" :subTable='subTable' :delete.sync="deleteList[subTable.subTableName]"
              :customRules="subTableCustomRules" @editTableEvent='editTableEvent'>
              <template slot="edit-table-currentSettlementQuantity" slot-scope="{scope, item, rowIndex}">
                  <el-number v-if="item.inputStatus !== 'disable' && type !== 'info'"
                    controls-position="right" size="small" :disabled="item.inputStatus === 'disable'"
                    :maxlength="Number(item.maxlength)" :precision="Number(item.precision)"
                    v-model="scope[item.prop]" :placeholder="item.placeholder"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    :max="currentSettlementQuantityMax(scope, item)"
                    @change="handleCalculation({ item, row: scope, event: scope[item.prop], subTable, rowIndex})">
                  </el-number>
                  <div class="ellipsis smallFont grey" v-else>
                    {{scope[item.prop]}}
                  </div>
              </template>
              <!-- 所属工程量名称 -->
              <template slot="edit-table-quantitiesName" slot-scope="{item, scope, rowIndex}">
                <div class="slot-input">
                  <el-input v-if="pageConfig.projectForm.settlementCostControl === 1 && $route.name !== 'processApprovalPage'"
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
              <!-- 所属工程量名称 -->
              <template slot="edit-table-expenseName" slot-scope="{item, scope, rowIndex}">
                <div class="slot-input">
                  <el-input v-if="pageConfig.projectForm.settlementCostControl === 1 && $route.name !== 'processApprovalPage'"
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
              <!-- 添加其他款项 -->
              <template slot="table-buts" slot-scope="{scope, pageDisabled}">
                <el-button v-if="scope.ifOriginData !== 0" :disabled="$route.name === 'processApprovalPage' || pageDisabled"
                  class="warning" @click="handleAddOtherPayments(scope)" type="text"
                  size="mini" v-fast-click>
                  {{$t('button.addOtherPayments')}}
                </el-button>
              </template>
            </g-edit-pl-table>
          </div>
        </div>
      </div>
    </edit-page>
    <!-- 选择合同 -->
    <g-dialog v-if="dialogContract" :dialogConfig="dialogConfigContract" :isVisible.sync="dialogContract">
      <!-- <expendRegister slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogContract"
        :selectId="pageConfig.projectForm.contractId || 0" :projectId="pageConfig.projectForm.projectId || 0"
        @getData="getContractData" v-if="dialogContract">
      </expendRegister> -->
      <contractPurchase slot="body" slot-scope="{height}" :dialogHeight="height"
          :selectId='pageConfig.projectForm.contractId ? `${pageConfig.projectForm.sourceType}-${pageConfig.projectForm.contractId}` : ""'
          :projectId="pageConfig.projectForm.projectId"
          :close.sync="dialogContract" @getData="getContractData" v-if="dialogContract">
      </contractPurchase>
    </g-dialog>
    <!-- 选择材料 -->
    <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
      <settlementDetail slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogVisible"
        :selectList="selectListContractDetails" :isIncoming="isIncoming" :selectListIncoming="selectIncomingConfig.tagDada"
        :selectListReturn="selectReturnConfig.tagDada" :projectId="pageConfig.projectForm.projectId || 0"
        varietiesTitle="purchaseSettlement.incomingVarieties" @getData="getData" v-if="dialogVisible">
      </settlementDetail>
    </g-dialog>
    <!-- 选择发票 -->
    <g-dialog v-if="dialogInvoice" :dialogConfig="dialogConfigInvoice" :isVisible.sync="dialogInvoice">
      <invoiceMultiple slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogInvoice"
        :selectList="selectInvoiceConfig.tagDada" :contractId="pageConfig.projectForm.contractId || 0"
        :projectId="pageConfig.projectForm.projectId || 0" @getData="getInvoiceData" v-if="dialogInvoice">
      </invoiceMultiple>
    </g-dialog>
    <!-- 选择入库单 -->
    <g-dialog v-if="dialogIncoming" :dialogConfig="dialogConfigIncoming" :isVisible.sync="dialogIncoming">
      <incomingMultiple slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogIncoming"
        :selectList="selectIncomingConfig.tagDada" :projectId="pageConfig.projectForm.projectId"
        :sourceType="pageConfig.projectForm.sourceType || ''"
        :contractId="pageConfig.projectForm.contractId || ''"
        @getData="getIncomingData" v-if="dialogIncoming">
      </incomingMultiple>
    </g-dialog>
    <!-- 选择退货单 -->
    <g-dialog v-if="dialogReturn" :dialogConfig="dialogConfigReturn" :isVisible.sync="dialogReturn">
      <returnMultiple slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogReturn"
        :selectList="selectReturnConfig.tagDada" :projectId="pageConfig.projectForm.projectId" @getData="getReturnData"
        :sourceType="pageConfig.projectForm.sourceType || ''"
        :contractId="pageConfig.projectForm.contractId || ''"
        v-if="dialogReturn">
      </returnMultiple>
    </g-dialog>
    <!-- 选择合同明细 -->
    <g-dialog v-if="dialogVisibleContractDetails" :dialogConfig="dialogConfigContractDetails" :isVisible.sync="dialogVisibleContractDetails">
      <contractDetails slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogVisibleContractDetails"
        :selectList="selectListContractDetails" :expendRegisterId="pageConfig.projectForm.contractId || 0"
        @getData="getDataContractDetails" v-if="dialogVisibleContractDetails">
      </contractDetails>
    </g-dialog>
    <!-- 导入 -->
    <g-import-dialog v-if="dialogImportFlag" @dialogEvent='dialogEvent' :dialogConfig="dialogConfig"
      :isVisible.sync="dialogImportFlag">
      <template slot="body" slot-scope='{height}'>
        <g-edit-pl-table slot="body" ref="importTable" :height='height' :type="type"
          :isSelection="subImportTable.isSelection" :tableConfig="subImportTable.tableList" :subTable='subImportTable'
          :delete.sync="deleteImportList" @editTableEvent='editImportTableEvent'>
          <template slot="edit-table-currentSettlementQuantity" slot-scope="{scope, item, rowIndex}">
              <el-number v-if="item.inputStatus !== 'disable' && type !== 'info'"
                controls-position="right" size="small" :disabled="item.inputStatus === 'disable'"
                :maxlength="Number(item.maxlength)" :precision="Number(item.precision)"
                v-model="scope[item.prop]" :placeholder="item.placeholder"
                :clearable="item.clearable === undefined ? true : item.clearable"
                :max="currentSettlementQuantityMax(scope, item)"
                @change="handleImportCalculation({ item, row: scope, event: scope[item.prop], subTable: subImportTable, rowIndex})">
              </el-number>
              <div class="ellipsis smallFont grey" v-else>
                {{scope[item.prop]}}
              </div>
          </template>
          <!-- 所属工程量名称 -->
          <template slot="edit-table-quantitiesName" slot-scope="{item, scope, rowIndex}">
            <div class="slot-input">
              <el-input v-if="pageConfig.projectForm.settlementCostControl === 1"
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
    <!-- 合并填价弹框 -->
    <g-dialog v-if="dialogMergeFillPrice" :dialogConfig="dialogMergeFillPriceConfig" :isVisible.sync="dialogMergeFillPrice">
      <template slot="body" slot-scope="{height}" :dialogHeight="height">
        <div v-if="pageConfigLoading">
          <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
            <g-edit-title style="height: 40px" :title="$t(`purchaseSettlement.purchaseSettlementDetail`)"
              v-if="subTable.subTableName === 'mergeFillPrice'"
              :titleTips="$t(`purchaseSettlement.${subTable.titleTips}`)">
            </g-edit-title>
            <g-edit-pl-table :ref="subTable.subTableName" :type="type" :isSelection="subTable.isSelection" :height="height-150"
              v-if="subTable.subTableName === 'mergeFillPrice'"
              :tableConfig="subTable.tableList" :subTable='subTable' :delete.sync="deleteList[subTable.subTableName]"
               @editTableEvent='editTableEvent'>
            </g-edit-pl-table>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="footer">
          <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small"
            @click="handleDialogStatus('close')">{{$t('button.close')}}</el-button>
          <el-button size="small" type="primary" icon="el-icon-circle-check" @click="handleDialogStatus('save')"
            v-fast-click>{{$t('button.determine')}}</el-button>
        </div>
      </template>
    </g-dialog>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';
import { importPage } from 'mixins/importMixins';

export default {
  name: 'purchaseSettlementEdit',
  mixins: [editPage, importPage],
  data () {
    const currentSettlementQuantityValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('purchaseSettlement.currentSettlementQuantityTips')));
      } else {
        callback();
      }
    };
    return {
      page: new Page(),
      projectForm: {
        attachment: '',
        contractCode: '',
        contractId: '',
        contractName: '',
        currencyCode: '',
        currencyValue: '',
        invoiceTotalAmount: 0,
        projectId: 0,
        settlementAgentUserName: this.$utils.Auth.hasUserInfo().userName,
        settlementAgentUserId: this.$utils.Auth.hasUserInfo().userId,
        settlementContent: '',
        settlementDate: this.$utils.commonUtil.formatTime(new Date()),
        settlementDetails: [],
        settlementIncomingRelations: [],
        settlementInvoiceRelations: [],
        settlementReturngoodsRelations: [],
        supplierId: 0,
        supplierName: '',
        totalAmount: 0,
        totalPriceTax: 0,
        totalTaxAmount: 0,
        totalOtherPaymentsAmount: 0,
        partyBDeclareAmount: '',
        totalSettlementAmount: '',
        totalPaymentAmount: '',
        totalInvoiceAmount: '',
        costControlRuleCode: '',
        costControlRuleValue: '',
        masterCostControl: '',
        settlementCostControl: '',
        remarks: '',
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      },
      // 选择材料
      dialogVisible: false,
      dialogConfig: {
        title: this.$t('purchaseSettlement.seleMaterialVarieties'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '90%',
        span: '0.75'
      },
      materialIdList: [],
      back: '',
      subTableRow: {},
      customRules: {
        // settlementInvoiceRelations: [{required: true, validator: settlementInvoiceRelationsValid, trigger: 'blur' }],
        // settlementIncomingRelations: [{required: true, validator: settlementIncomingRelationsValid, trigger: 'blur' }]
      },
      subTableCustomRules: {
        currentSettlementQuantity: [{ required: true, validator: currentSettlementQuantityValid, trigger: 'blur' }]
      },
      // 选择合同
      dialogContract: false,
      dialogConfigContract: {
        title: this.$t('fConfig.contractSporadicPurchaseName'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      contractConfig: {},
      // 选择发票
      dialogInvoice: false,
      dialogConfigInvoice: {
        title: this.$t('purchaseSettlement.seleInvoice'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      selectInvoiceConfig: {
        // 显示的列表
        tagDada: [],
        // id
        rowKey: 'invoiceNo',
        // name
        rowName: 'invoiceNo',
        // 默认显示的个数
        constNum: 7
      },
      deleteInvoiceNo: '',
      // 入库
      dialogIncoming: false,
      dialogConfigIncoming: {
        title: this.$t('purchaseSettlement.seleIncoming'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      selectIncomingConfig: {
        // 显示的列表
        tagDada: [],
        // id
        rowKey: 'incomingDocNo',
        // name
        rowName: 'incomingDocNo',
        // 默认显示的个数
        constNum: 7,
        rowLabel: 'purchaseSettlement.settlementIncomingRelations',
        isCanInfo: true,
        routerId: 'incomingId',
        routerName: 'warIncoming'
      },
      deleteIncomingCode: '',
      // 退货
      dialogReturn: false,
      dialogConfigReturn: {
        title: this.$t('purchaseSettlement.seleReturn'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      selectReturnConfig: {
        // 显示的列表
        tagDada: [],
        // id
        rowKey: 'returngoodsDocNo',
        // name
        rowName: 'returngoodsDocNo',
        // 默认显示的个数
        constNum: 7
      },
      deleteReturnCode: '',
      isIncoming: false,
      calculation: '01',
      importUrl: '/promaterial/purchase/settlement/detail/importExcel',
      that: '',
      selectListContractDetails: [],
      dialogVisibleContractDetails: false,
      dialogConfigContractDetails: {
        title: `${this.$t('tips.pleaseSelect')}${this.$t('tips.contractDetails')}`,
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      // 所属工程量清单、所属工程量清单编号、所属费用科目、所属费用科目编号
      projectChildFlag: false,
      projectChildDialogConfig: {
        title: this.$t('dialog.selectProjectChild'),
        appendBody: false,
        center: true,
        top: '80px',
        width: '60%',
        span: '0.7'
      },
      // 合并填价
     dialogMergeFillPrice: false,
     dialogMergeFillPriceConfig: {
      title: this.$t('purchaseSettlement.mergeFillPrice'),
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
  components: {
    settlementDetail (resolve) {
      require(['components/material/settlementDetail/settlementDetail.vue'], resolve);
    },
    // expendRegister (resolve) {
    //   require(['../compoent/expendRegister/expendRegister'], resolve);
    // },
    contractPurchase(resolve) {
      require(['views/promaterial/compoent/contractPurchase/contractPurchase.vue'], resolve);
    },
    invoiceMultiple (resolve) {
      require(['../compoent/invoiceMultiple/invoiceMultiple'], resolve);
    },
    incomingMultiple (resolve) {
      require(['../compoent/incomingMultiple/incomingMultiple'], resolve);
    },
    returnMultiple (resolve) {
      require(['../compoent/returnMultiple/returnMultiple'], resolve);
    },
    importFile (resolve) {
      require(['components/basicComponents/global/upload/importFile.vue'], resolve);
    },
    contractDetails (resolve) {
      require(['../compoent/contractDetails/contractDetails'], resolve);
    },
    usePlaceDialog (resolve) {
      require(['components/basicComponents/global/dialog/usePlaceDialog/usePlaceDialog.vue'], resolve);
    }
  },
  watch: {
    'selectInvoiceConfig.tagDada': {
      handler() {
        const invoiceTotalAmount = this.selectInvoiceConfig.tagDada.reduce((a, b, c) => {
          return a += Number(b.invoiceAmount);
        }, 0);
        this.$set(this.pageConfig.projectForm, 'invoiceTotalAmount', Number(invoiceTotalAmount.toFixed(2)));
      },
      deep: true
    }
  },
  methods: {
    // 获取info数据
    async _getInfoData (id = 0) {
      await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
        // console.log(this.pageConfig.projectForm.settlementCostControl, this.$route.name !== 'processApprovalPage', 'settlementCostControl');
        this.selectInvoiceConfig.tagDada = this.pageConfig.projectForm.settlementInvoiceRelations;
        this.selectIncomingConfig.tagDada = this.pageConfig.projectForm.settlementIncomingRelations;
        this.selectReturnConfig.tagDada = this.pageConfig.projectForm.settlementReturngoodsRelations;
        this.selectIncomingConfig.tagDada.length > 0 ? this.isIncoming = true : this.isIncoming = false;
        this.displayFieldsAccordingToProjectControlType('purchaseSettlementDetail');

      });
    },
    // 选择项目后
    handleCheckProject (params) {
      this.handleSelect(params, 'projectName', () => {
        this.selectInvoiceConfig.tagDada = [];
        this.selectIncomingConfig.tagDada = [];
        this.selectReturnConfig.tagDada = [];
        if (params.selectList.length) {
          this.displayFieldsAccordingToProjectControlType('purchaseSettlementDetail');
        }
      });
    },
    // 清除合同
    handleClearContract (row, item) {
      const params = {
        paramsConfig: item,
        selectList: []
      };
      this.handleSelect(params, 'contractName', () => {
        this.selectInvoiceConfig.tagDada = [];
        this.selectIncomingConfig.tagDada = [];
        this.selectReturnConfig.tagDada = [];
      });
    },
    // 打开合同弹窗
    handleSelectContract (row, item) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      this.contractConfig = item;
      this.dialogContract = true;
    },
    // 选中的合同数据
    getContractData (arr) {
      const params = {
        paramsConfig: this.contractConfig,
        selectList: arr
      };
      this.handleSelect(params, 'contractName', () => {
        this.selectInvoiceConfig.tagDada = [];
        this.selectIncomingConfig.tagDada = [];
        this.selectReturnConfig.tagDada = [];
      });
      this.dialogContract = false;
    },
    // 选择发票
    handleSelectInvoice (row) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      // if (!this.pageConfig.projectForm.contractName) {
      //   this.$message.error(this.$t('purchaseSettlement.pleaseSelectContractName'));
      //   return;
      // }
      if (!this.pageConfig.projectForm.contractName) {
        this.$message.error(`${this.$t('tips.pleaseSelect')} ${this.$t('fConfig.contractSporadicPurchaseName')}`);
        return;
      }
      this.dialogInvoice = true;
    },
    // 删除发票
    handleDeleteInvoice (row) {
      this.deleteInvoiceNo = row.invoiceNo;
      const tableData = this.pageConfig.subTableConfig.purchaseSettlementDetail.tableData;
      if (tableData && tableData.length) {
        this.sysChangeDeleteDetail('purchaseSettlementDetail', 'settlementInvoiceRelations', () => {
          const index = this.selectInvoiceConfig.tagDada.findIndex(v => v.invoiceNo === row.invoiceNo);
          if (index >= 0) {
            this.selectInvoiceConfig.tagDada.splice(index, 1);
          }
        });
      } else {
        const index = this.selectInvoiceConfig.tagDada.findIndex(v => v.invoiceNo === row.invoiceNo);
        if (index >= 0) {
          this.selectInvoiceConfig.tagDada.splice(index, 1);
        }
      }
    },
    // 获取选择的发票
    getInvoiceData (arr) {
      const data = [];
      const list = [];
      arr.forEach(item => {
        data.push(
          {
            createBy: this.$utils.Auth.hasUserInfo().userId,
            createTime: this.$utils.commonUtil.formatTime(new Date()),
            invoiceAmount: item.totalPriceTax,
            invoiceCode: item.invoiceCode,
            invoiceId: item.invoiceId,
            invoiceNo: item.invoiceNo
          }
        );
        list.push(item.invoiceNo);
      });
      const tableData = this.pageConfig.subTableConfig.purchaseSettlementDetail.tableData;
      if (tableData && tableData.length) {
        const tempTagDada = this.selectInvoiceConfig.tagDada.map(v => v.invoiceNo);
        if (list.join(',') !== tempTagDada.join(',')) {
          this.sysChangeDeleteDetail('purchaseSettlementDetail', 'settlementInvoiceRelations', () => {
            this.selectInvoiceConfig.tagDada = data;
          });
          this.dialogInvoice = false;
          return;
        }
      }
      this.selectInvoiceConfig.tagDada = data;
      this.dialogInvoice = false;
    },
    // 选择入库单
    handleSelectIncoming (row) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      if (!this.pageConfig.projectForm.contractName) {
        this.$message.error(`${this.$t('tips.pleaseSelect')} ${this.$t('fConfig.contractSporadicPurchaseName')}`);
        return;
      }
      if (this.selectReturnConfig.tagDada.length) {
        this.$message.error(this.$t('purchaseSettlement.selectOne'));
        return;
      }
      this.isIncoming = true;
      this.dialogIncoming = true;
    },
    // 删除入库单
    handleDeleteIncoming (row) {
      this.deleteIncomingCode = row.incomingDocNo;
      const tableData = this.pageConfig.subTableConfig.purchaseSettlementDetail.tableData;
      if (tableData && tableData.length) {
        this.sysChangeDeleteDetail('purchaseSettlementDetail', 'settlementIncomingRelations', () => {
          const index = this.selectIncomingConfig.tagDada.findIndex(v => v.incomingDocNo === row.incomingDocNo);
          if (index >= 0) {
            this.selectIncomingConfig.tagDada.splice(index, 1);
          }
        });
      } else {
        const index = this.selectIncomingConfig.tagDada.findIndex(v => v.incomingDocNo === row.incomingDocNo);
        if (index >= 0) {
          this.selectIncomingConfig.tagDada.splice(index, 1);
        }
      }
    },
    // 获取选择的入库单
    getIncomingData (arr) {
      const data = [];
      const list = [];
      arr.forEach(item => {
        data.push(
          {
            createBy: this.$utils.Auth.hasUserInfo().userId,
            createTime: this.$utils.commonUtil.formatTime(new Date()),
            incomingDocNo: item.incomingDocNo,
            incomingId: item.incomingId
          }
        );
        list.push(item.incomingDocNo);
      });
      const tableData = this.pageConfig.subTableConfig.purchaseSettlementDetail.tableData;
      if (tableData && tableData.length) {
        const tempTagDada = this.selectIncomingConfig.tagDada.map(v => v.incomingDocNo);
        if (list.join(',') !== tempTagDada.join(',')) {
          this.sysChangeDeleteDetail('purchaseSettlementDetail', 'settlementIncomingRelations', () => {
            this.selectIncomingConfig.tagDada = data;
          });
          this.dialogIncoming = false;
          return;
        }
      }
      this.selectIncomingConfig.tagDada = data;
      this.dialogIncoming = false;
    },
    // 全量计算
    sysFullSettlement(tableName) {
      const tableData = this.pageConfig.subTableConfig.purchaseSettlementDetail.tableData;
      if (tableData.length === 0) {
        this.confirmFullSettlement(tableName, tableData);
        return;
      }
      // 全量计算需要先行删除明细，您确定进行全量计算吗？
      const messageTips = this.$t('purchaseSettlement.purchaseSettlementTips');
      this.$confirm(messageTips, `${this.$t('purchaseSettlement.fullsettlement')}`, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      }).then(() => {
        const deleteIds = tableData.filter(v => v.id).map(i => i.id);
        if (deleteIds.length) {
          this.$store.dispatch('purchaseSettlement/setDeleteDetails', deleteIds).then(res => {
            if (res.status === 0) {
              this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', []);
              this.confirmFullSettlement(tableName, tableData);
            } else {
              this.$message.error(`${this.$t('button.delete')}${this.$t('tips.fail')}!`);
            }
          });
        } else {
          this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', []);
          this.confirmFullSettlement(tableName, tableData);
        }
      }).catch(e => { });
    },
    confirmFullSettlement(tableName) {
      const data = {
        projectId: this.pageConfig.projectForm.projectId,
        materialName: ''
      };
      const dispatchApi = this.isIncoming ? 'purchaseSettlement/getIncomingList' : 'purchaseSettlement/getReturngoodsList';
      this.$store.dispatch(dispatchApi, data).then(res => {
        const tableData = [];
        if (this.isIncoming) {
            for (const sele of this.selectIncomingConfig.tagDada) {
              for (const item of res.results) {
                if (sele.incomingId === item.id) {
                  // 左边数据
                  item.incomingDetails.forEach(val => {
                    val.incomingDocNo = item.docNo;
                    val.incomingId = item.id;
                    val.eId = val.id;
                    tableData.push(val);
                  });
                }
              }
            }
        } else {
          for (const sele of this.selectReturnConfig.tagDada) {
            for (const item of res.results) {
              if (sele.returngoodsId === item.id) {
                item.returngoodsDetails.forEach(val => {
                  val.incomingDocNo = item.docNo;
                  val.incomingId = item.id;
                  val.eId = val.id;
                  val.unitPrice = val.returngoodsUnitPrice;
                  val.currentIncomingQuantity = val.currentReturngoodsQuantity;
                  tableData.push(val);
                });
              }
            }
          }
        }
        this.setTableValue(tableData, tableName);
      }).catch(e => {
      });
    },
    // 设置值
    setTableValue(arr, tableName) {
      const data = [];
      for (const item of arr) {
        data.push(
          {
            sourceType: item.sourceType,
            createTime: this.$utils.commonUtil.formatTime(new Date()),
            alreadySettlementQuantity: 0,
            currentSettlementQuantity: item.currentIncomingQuantity,
            eId: item.eId,
            incomingDocNo: item.incomingDocNo,
            incomingId: item.incomingId,
            incomingQuantity: item.currentIncomingQuantity,
            incomingTaxRate: item.taxRate,
            incomingUnitPrice: item.unitPrice,
            materialId: item.materialId,
            materialName: item.materialName,
            materialCode: item.materialCode,
            models: item.models,
            unit: item.unit,
            brand: item.brand,
            standards: item.standards,
            remarks: '',
            weight: '',
            settlementExcludeTaxAmount: item.excludeTaxAmount,
            settlementIncludeTaxAmount: item.includeTaxAmount,
            settlementTaxAmount: item.taxAmount,
            settlementTaxRate: item.taxRate,
            settlementUnitPrice: item.unitPrice || '',
            varietiesCode: item.varietiesCode,
            varietiesId: item.varietiesId,
            settlementIncludeUnitPrice: item.includeUnitPrice,
            // 带入字段
            majorCode: item.majorCode || '',
            majorValue: item.majorValue || '',
            materialClassifyCode: item.materialClassifyCode || '',
            materialClassifyValue: item.materialClassifyValue || '',
            supplySourceCode: item.supplySourceCode || '',
            supplySourceValue: item.supplySourceValue || '',
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
            // 所属工程量名称、编号和所属费用类型名称和编号字段
            expenseCode: item.expenseCode || '',
            expenseName: item.expenseName || '',
            quantitiesName: item.quantitiesName || '',
            quantitiesCode: item.quantitiesCode || '',
            budgetCode: item.budgetCode || ''
          }
        );
      }
      this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', data);
      this.setMainCheckMaterials(tableName);
      this.setAmount(tableName);
    },
    // ----------------------- 合并填价 ------------------
    // 合并填价
    sysMergeFillPrice(tableName) {
      const tableData = this.$clone(this.pageConfig.subTableConfig.purchaseSettlementDetail.tableData);
      tableData.forEach(item => {
        // item.mergeFillPriceKey = `${item.materialName}${item.standards}${item.models}${item.brand}${item.unit}`;
        this.$set(item, 'mergeFillPriceKey', `${item.materialName}${item.standards}${item.models}${item.brand}${item.unit}`);
      });
      if (!tableData.length) {
        // 子表无数据，请先点击全量结算或者通过选择明细获取子表数据。
        this.$message.warning(this.$t('purchaseSettlement.pleaseSelectData'));
      } else {
        this.pageConfig.subTableConfig.mergeFillPrice.tableData = this.removeDuplicateObj(tableData);
        if (this.pageConfig.subTableConfig.mergeFillPrice.tableData.length === tableData.length) {
          // 暂未发现子表存在重复项，请直接在此表格填写。
          this.$message.warning(this.$t('purchaseSettlement.notRepeatTip'));
          return;
        }
        this.dialogMergeFillPrice = true;
      }
    },
    // 数组中的对象根据removeDuplicateKey去重,结算数量相加
    removeDuplicateObj (arr) {
      const idArr = [];
      const resultArr = [];
      for (let i = 0; i < arr.length; i++) {
        const index = idArr.indexOf(arr[i].mergeFillPriceKey);
        if (index > -1) {
          this.$set(resultArr[index], 'settlementTotalQuantity', resultArr[index].settlementTotalQuantity + Number(arr[i].incomingQuantity));
        } else {
          this.$set(arr[i], 'settlementTotalQuantity', arr[i].incomingQuantity);
          idArr.push(arr[i].mergeFillPriceKey);
          resultArr.push(arr[i]);
        }
      }
      return resultArr;
    },
    handleDialogStatus(status) {
      if (status === 'save') {
        this.pageConfig.subTableConfig.purchaseSettlementDetail.tableData.forEach(item => {
          this.$set(item, 'mergeFillPriceKey', `${item.materialName}${item.standards}${item.models}${item.brand}${item.unit}`);
        });
        this.pageConfig.subTableConfig.mergeFillPrice.tableData.forEach(merItem => {
          this.pageConfig.subTableConfig.purchaseSettlementDetail.tableData.forEach(purItem => {
            if (purItem.mergeFillPriceKey === merItem.mergeFillPriceKey) {
               purItem.settlementIncludeUnitPrice = merItem.settlementIncludeUnitPrice;
               if (this.calculation === '01') {
                  this.handleCalculation1({ item: {prop: 'settlementIncludeUnitPrice'}, row: purItem});
                } else {
                  this.handleCalculation2({ item: {prop: 'settlementIncludeUnitPrice'}, row: purItem});
                }
            }
          });
        });
        this.setAmount('purchaseSettlementDetail');
        // this.handleCalculation();
        this.dialogMergeFillPrice = false;
      }
      if (status === 'close') {
        this.dialogMergeFillPrice = false;
      }
    },
    // ----------------------- 退货单 ------------------
    // 选择退货单
    handleSelectReturn (row) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      if (!this.pageConfig.projectForm.contractName) {
        this.$message.error(`${this.$t('tips.pleaseSelect')} ${this.$t('fConfig.contractSporadicPurchaseName')}`);
        return;
      }
      if (this.selectIncomingConfig.tagDada.length) {
        this.$message.error(this.$t('purchaseSettlement.selectOne'));
        return;
      }
      this.isIncoming = false;
      this.dialogReturn = true;
    },
    // 删除退货单
    handleDeleteReturn (row) {
      this.deleteReturnCode = row.returngoodsDocNo;
      const tableData = this.pageConfig.subTableConfig.purchaseSettlementDetail.tableData;
      if (tableData && tableData.length) {
        this.sysChangeDeleteDetail('purchaseSettlementDetail', 'settlementReturngoodsRelations', () => {
          const index = this.selectReturnConfig.tagDada.findIndex(v => v.returngoodsDocNo === row.returngoodsDocNo);
          if (index >= 0) {
            this.selectReturnConfig.tagDada.splice(index, 1);
          }
        });
      } else {
        const index = this.selectReturnConfig.tagDada.findIndex(v => v.returngoodsDocNo === row.returngoodsDocNo);
        if (index >= 0) {
          this.selectReturnConfig.tagDada.splice(index, 1);
        }
      }
    },
    // 获取选择的退货单
    getReturnData (arr) {
      const data = [];
      const list = [];
      arr.forEach(item => {
        data.push(
          {
            createBy: this.$utils.Auth.hasUserInfo().userId,
            createTime: this.$utils.commonUtil.formatTime(new Date()),
            returngoodsDocNo: item.returngoodsDocNo,
            returngoodsId: item.returngoodsId
          }
        );
        list.push(item.returngoodsDocNo);
      });
      const tableData = this.pageConfig.subTableConfig.purchaseSettlementDetail.tableData;
      if (tableData && tableData.length) {
        const tempTagDada = this.selectReturnConfig.tagDada.map(v => v.returngoodsDocNo);
        if (list.join(',') !== tempTagDada.join(',')) {
          this.sysChangeDeleteDetail('purchaseSettlementDetail', 'settlementReturngoodsRelations', () => {
            this.selectReturnConfig.tagDada = data;
          });
          this.dialogReturn = false;
          return;
        }
      }
      this.selectReturnConfig.tagDada = data;
      this.dialogReturn = false;
    },
    // 更换后删除明细
    sysChangeDeleteDetail (tableName, prop, callback) {
      const keyValue = this.$t(`purchaseSettlement.${prop}`);
      const messageTips = `${this.$t('purchaseSettlement.change')} ${keyValue} ${this.$t('purchaseSettlement.changeDeleteDetailTips')}`;
      this.$confirm(messageTips, `${this.$t('button.batchDeletion')}`, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      }).then(() => {
        this.deleteDetail(tableName, Array.from(this.pageConfig.subTableConfig[tableName].tableData));
        callback && callback();
      }).catch(e => { });
    },
    // 添加明细
    sysHandleDeletaAdd (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      const tableDataRow = this.$clone(this.pageConfig.subTableConfig[tableName].tableList.tableDataRow);
      // 非-复制数据
      this.$set(tableDataRow, 'ifOriginData', 1);
      this.pageConfig.subTableConfig[tableName].tableData.push(tableDataRow);
    },
    // 添加其他款项
    handleAddOtherPayments(row) {
      if (row.ifOriginData === 0) {
        // 通过添加其他款项增加的数据，不能再根据它添加其他款项；
        this.$message.error(this.$t('tips.addOtherPaymentsTips'));
        return;
      }
      const tableDataRow = this.$clone(this.pageConfig.subTableConfig['purchaseSettlementDetail'].tableList.tableDataRow);
      // 复制数据
      this.$set(tableDataRow, 'ifOriginData', 0);
      // 名称、规格、型号、品牌、单位、所属成本结构、成本结构编号、结算税率一样
      const materialName = `${this.$t('fConfig.otherPayments')}/${row.materialName}`.slice(0, 64);
      this.$set(tableDataRow, 'materialName', materialName);
      this.$set(tableDataRow, 'standards', row.standards);
      this.$set(tableDataRow, 'models', row.models);
      this.$set(tableDataRow, 'brand', row.brand);
      this.$set(tableDataRow, 'unit', row.unit);
      this.$set(tableDataRow, 'quantitiesName', row.quantitiesName);
      this.$set(tableDataRow, 'quantitiesCode', row.quantitiesCode);
      this.$set(tableDataRow, 'expenseName', row.expenseName);
      this.$set(tableDataRow, 'expenseCode', row.expenseCode);
      this.$set(tableDataRow, 'settlementTaxRate', row.settlementTaxRate);
      const tableData = this.pageConfig.subTableConfig['purchaseSettlementDetail'].tableData;
      tableData.splice(tableData.indexOf(row) + 1, 0, tableDataRow);
    },
    // 选择明细
    sysHandleSelectDetail (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      // this.pageConfig.projectForm.projectNatureCode === '02' 选择合同明细
      if (this.pageConfig.projectForm.projectNatureCode === '02' && !this.pageConfig.projectForm.contractName) {
          this.$message.error(`${this.$t('tips.pleaseSelect')}${this.$t('fConfig.contractSporadicPurchaseName')}`);
          return;
      }
      // if (!this.selectInvoiceConfig.tagDada.length) {
      //     this.$message.error(this.$t('purchaseSettlement.pleaseSelectSettlementInvoiceRelations'));
      //     return;
      // }
      if (this.pageConfig.projectForm.projectNatureCode === '01' && !this.selectIncomingConfig.tagDada.length && !this.selectReturnConfig.tagDada.length) {
        this.$message.error(this.$t('purchaseSettlement.pleaseSelectSettlementRelations'));
        return;
      }
      const tableData = this.pageConfig.subTableConfig[tableName].tableData;
      this.materialIdList = tableData;
      this.selectListContractDetails = tableData.filter(v => v.eId);
      this.pageConfig.projectForm.projectNatureCode === '01' && (this.dialogVisible = true);
      this.pageConfig.projectForm.projectNatureCode === '02' && (this.dialogVisibleContractDetails = true);
    },
    // 获取选中的数据
    getDataContractDetails (arr) {
      const data = [];
      for (const item of arr) {
        data.push(
          {
            sourceType: '',
            createTime: this.$utils.commonUtil.formatTime(new Date()),
            alreadySettlementQuantity: 0,
            currentSettlementQuantity: item.quantity,
            eId: item.eId,
            incomingDocNo: '',
            incomingId: '',
            incomingQuantity: '',
            incomingTaxRate: '',
            incomingUnitPrice: '',
            materialId: '',
            materialName: item.materialName,
            materialCode: '',
            models: item.models,
            unit: item.unit,
            brand: item.brand,
            standards: item.standards,
            remarks: '',
            settlementExcludeTaxAmount: item.excludeTaxAmount,
            settlementIncludeTaxAmount: item.amount,
            settlementTaxAmount: item.taxAmount,
            settlementTaxRate: item.taxRate,
            settlementUnitPrice: item.excludeUnitPrice,
            varietiesCode: '',
            varietiesId: '',
            settlementIncludeUnitPrice: item.unitPrice,
            // 带入字段
            majorCode: item.majorCode || '',
            majorValue: item.majorValue || '',
            materialClassifyCode: item.materialClassifyCode || '',
            materialClassifyValue: item.materialClassifyValue || '',
            supplySourceCode: item.supplySourceCode || '',
            supplySourceValue: item.supplySourceValue || '',
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
            // 所属工程量名称、编号和所属费用类型名称和编号字段
            expenseCode: '',
            expenseName: '',
            quantitiesName: '',
            quantitiesCode: '',
            budgetCode: '',
            ifOriginData: 1
          }
        );
      }
      this.setSubTableContractDetails('purchaseSettlementDetail', data);
    },
    setSubTableContractDetails (tableName, arr) {
      const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
      const choiceTableData = tableData.filter(v => v.eId);
      const addTableData = tableData.filter(v => !v.eId);
      const selectTableList = [];
      const newSelectTableList = [];
      if (!choiceTableData.length || !arr.length) {
          this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', arr.concat(addTableData));
      }
      if (choiceTableData.length) {
          for (const item of choiceTableData) {
              for (const val of arr) {
                  if (item.eId === val.eId) {
                      selectTableList.push(item);
                  }
              }
          }
          for (const item of arr) {
              const index = choiceTableData.findIndex(v => v.eId === item.eId);
              if (index < 0) {
                  newSelectTableList.push(item);
              }
          }
          this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', selectTableList.concat(newSelectTableList, addTableData));
      }
      this.deletTableCallback(tableName);
      this.setMainCheckMaterials('purchaseSettlementDetail');
      this.dialogVisibleContractDetails = false;
      this.dialogMergeFillPrice = false;
    },
    // 获取选中的数据
    getData (arr) {
      const data = [];
      for (const item of arr) {
        data.push(
          {
            sourceType: item.sourceType,
            createTime: this.$utils.commonUtil.formatTime(new Date()),
            alreadySettlementQuantity: 0,
            currentSettlementQuantity: '',
            eId: item.eId,
            incomingDocNo: item.incomingDocNo,
            incomingId: item.incomingId,
            incomingQuantity: item.currentIncomingQuantity,
            incomingTaxRate: item.taxRate,
            incomingUnitPrice: item.unitPrice,
            materialId: item.materialId,
            materialName: item.materialName,
            materialCode: item.materialCode,
            models: item.models,
            unit: item.unit,
            brand: item.brand,
            standards: item.standards,
            remarks: '',
            settlementExcludeTaxAmount: '',
            settlementIncludeTaxAmount: '',
            settlementTaxAmount: '',
            settlementTaxRate: item.taxRate,
            settlementUnitPrice: item.settlementUnitPrice || '',
            varietiesCode: item.varietiesCode,
            varietiesId: item.varietiesId,
            settlementIncludeUnitPrice: item.includeUnitPrice || '',
            // 带入字段
            majorCode: item.majorCode || '',
            majorValue: item.majorValue || '',
            materialClassifyCode: item.materialClassifyCode || '',
            materialClassifyValue: item.materialClassifyValue || '',
            supplySourceCode: item.supplySourceCode || '',
            supplySourceValue: item.supplySourceValue || '',
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
            // 所属工程量名称、编号和所属费用类型名称和编号字段
            expenseCode: item.expenseCode || '',
            expenseName: item.expenseName || '',
            quantitiesName: item.quantitiesName || '',
            quantitiesCode: item.quantitiesCode || '',
            budgetCode: item.budgetCode || '',
            ifOriginData: 1
          }
        );
      }
      this.setSubTable('purchaseSettlementDetail', data);
      this.setMainCheckMaterials('purchaseSettlementDetail');
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
            if (`${item.eId}-${item.materialId}` === `${val.eId}-${val.materialId}`) {
              selectTableList.push(item);
            }
          }
          if (!item.eId) {
              selectTableList.push(item);
            }
        }
        for (const item of arr) {
          const index = tableData.findIndex(v => `${v.eId}-${v.materialId}` === `${item.eId}-${item.materialId}`);
          if (index < 0) {
            selectTableList.push(item);
          }
        }
        this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', selectTableList);
      }
      this.dialogVisible = false;
    },
    // 切换计算规则
    handleSelectCalculation(val) {
      const tableData = this.$clone(this.pageConfig.subTableConfig['purchaseSettlementDetail'].tableData);
      if (tableData.length === 0) return;
      const messageTips = this.$t('tips.selectCalculationTips');
      this.$confirm(messageTips, this.$t('tips.selectCalculation'), {
        dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      }).then(() => {
      }).catch(e => {
        this.calculation = val === '01' ? '02' : '01';
      });
    },
    // 批量删除后的回调
    deletTableCallback (tableName) {
      this.setMainCheckMaterials(tableName);
      if (this.deleteIncomingCode) {
        const index = this.selectIncomingConfig.tagDada.findIndex(v => v.incomingDocNo === this.deleteIncomingCode);
        if (index >= 0) {
          this.selectIncomingConfig.tagDada.splice(index, 1);
        }
        this.deleteIncomingCode = '';
      }
      if (this.deleteInvoiceNo) {
        const index = this.selectInvoiceConfig.tagDada.findIndex(v => v.invoiceNo === this.deleteInvoiceNo);
        if (index >= 0) {
          this.selectInvoiceConfig.tagDada.splice(index, 1);
        }
        this.deleteInvoiceNo = '';
      }
      this.setAmount(tableName);
    },
    // // 数值计算
    // handleCalculation ({ item, row, event, subTable, rowIndex }) {
    //   // 金额(不含税)
    //   if (item.prop === 'settlementExcludeTaxAmount') {
    //     if (!(Number(row.currentSettlementQuantity) || 0)) {
    //       row.settlementUnitPrice = 0;
    //     } else {
    //       row.settlementUnitPrice = ((Number(row.settlementExcludeTaxAmount) || 0) / (Number(row.currentSettlementQuantity) || 0)).toFixed(8);
    //     }
    //   } else {
    //     row.settlementExcludeTaxAmount = ((Number(row.currentSettlementQuantity) || 0) * (Number(row.settlementUnitPrice) || 0)).toFixed(2);
    //   }
    //   // 税额
    //   row.settlementTaxAmount = ((Number(row.settlementExcludeTaxAmount) || 0) * (Number(row.settlementTaxRate) || 0)).toFixed(2);
    //   // 金额(含税)
    //   if (item.prop !== 'settlementIncludeTaxAmount') {
    //     row.settlementIncludeTaxAmount = (Number(row.settlementExcludeTaxAmount) || 0) + (Number(row.settlementTaxAmount) || 0);
    //     row.settlementIncludeUnitPrice = Number(((Number(row.settlementIncludeTaxAmount) || 0) / (Number(row.currentSettlementQuantity) || 0)).toFixed(2));
    //   }
    //   // 金额(含税)
    //   if (item.prop === 'settlementIncludeTaxAmount' && (row.settlementIncludeUnitPrice === '' || row.settlementIncludeUnitPrice === null)) {
    //     row.settlementIncludeUnitPrice = Number(((Number(row.settlementIncludeTaxAmount) || 0) / (Number(row.currentSettlementQuantity) || 0)).toFixed(2));
    //   }
    //   if (item.prop === 'settlementIncludeUnitPrice') {
    //     // 结算金额(含税)
    //     row.settlementIncludeTaxAmount = (Number(row.currentSettlementQuantity) || 0) * (Number(row.settlementIncludeUnitPrice) || 0).toFixed(2);
    //   }
    //   this.setAmount(subTable.subTableName);
    // },
    // 数值计算
    handleCalculation ({ item, row, event, subTable, rowIndex }) {
      if (this.calculation === '01') {
        this.handleCalculation1({ item, row, event, subTable, rowIndex });
      } else {
        this.handleCalculation2({ item, row, event, subTable, rowIndex });
      }
      this.setAmount(subTable.subTableName);
    },
    // 填写含税计算不含税
    handleCalculation1({ item, row, event, subTable, rowIndex }) {
      // 1，如果填写规则是填写含税计算不含税：则在填写数量、税率、金额（含税）后计算其他值；计算包括
      // 金额不含税=金额含税除以（1+税率）
      // 税额=金额含税/(1+税率) * 税率
      // 单价不含税=金额含税/(1+税率)/数量 如果数量为0 直接等于0
      if (item.prop === 'settlementIncludeUnitPrice') {
        const currentSettlementQuantity = Number(row.currentSettlementQuantity) || 0; // 数量
        const settlementIncludeUnitPrice = Number(row.settlementIncludeUnitPrice) || 0; // 单价（含税）
        const settlementIncludeTaxAmount = currentSettlementQuantity * settlementIncludeUnitPrice;
        this.$set(row, 'settlementIncludeTaxAmount', Number((settlementIncludeTaxAmount || 0).toFixed(2)));

        const settlementTaxRate = Number(row.settlementTaxRate) || 0; // 税率
        const settlementExcludeTaxAmount = settlementIncludeTaxAmount / (1 + settlementTaxRate); // 金额(不含税)
        const settlementTaxAmount = settlementIncludeTaxAmount / (1 + settlementTaxRate) * settlementTaxRate; // 税额
        const settlementUnitPrice = !currentSettlementQuantity ? 0 : settlementIncludeTaxAmount / (1 + settlementTaxRate) / currentSettlementQuantity; // 单价不含税
        this.$set(row, 'settlementExcludeTaxAmount', Number((settlementExcludeTaxAmount || 0).toFixed(2)));
        this.$set(row, 'settlementTaxAmount', Number((settlementTaxAmount || 0).toFixed(2)));
        this.$set(row, 'settlementUnitPrice', Number((settlementUnitPrice || 0).toFixed(8)));
      }
      if (item.prop === 'settlementIncludeTaxAmount' && (row.settlementIncludeUnitPrice === '' || row.settlementIncludeUnitPrice === null)) {
        const currentSettlementQuantity = Number(row.currentSettlementQuantity) || 0; // 数量
        const settlementIncludeTaxAmount = Number(row.settlementIncludeTaxAmount) || 0; // 金额（含税）
        const settlementIncludeUnitPrice = settlementIncludeTaxAmount / currentSettlementQuantity;
        this.$set(row, 'settlementIncludeUnitPrice', !currentSettlementQuantity ? 0 : Number((settlementIncludeUnitPrice || 0).toFixed(4)));
      }
      if (item.prop === 'currentSettlementQuantity' || item.prop === 'settlementTaxRate') {
        const currentSettlementQuantity = Number(row.currentSettlementQuantity) || 0; // 数量
        const settlementIncludeUnitPrice = Number(row.settlementIncludeUnitPrice) || 0; // 单价（含税）
        const settlementTaxRate = Number(row.settlementTaxRate) || 0; // 税率
        const settlementIncludeTaxAmount = currentSettlementQuantity * settlementIncludeUnitPrice; // 金额(含税)
        const settlementExcludeTaxAmount = settlementIncludeTaxAmount / (1 + settlementTaxRate); // 金额(不含税)
        const settlementTaxAmount = settlementIncludeTaxAmount / (1 + settlementTaxRate) * settlementTaxRate; // 税额
        const settlementUnitPrice = !currentSettlementQuantity ? 0 : settlementIncludeTaxAmount / (1 + settlementTaxRate) / currentSettlementQuantity; // 单价不含税
        this.$set(row, 'settlementIncludeTaxAmount', Number((settlementIncludeTaxAmount || 0).toFixed(2)));
        this.$set(row, 'settlementExcludeTaxAmount', Number((settlementExcludeTaxAmount || 0).toFixed(2)));
        this.$set(row, 'settlementTaxAmount', Number((settlementTaxAmount || 0).toFixed(2)));
        this.$set(row, 'settlementUnitPrice', Number((settlementUnitPrice || 0).toFixed(8)));
      }
      if (item.prop === 'settlementIncludeTaxAmount' && row.settlementIncludeUnitPrice >= 0) {
        const currentSettlementQuantity = Number(row.currentSettlementQuantity) || 0; // 数量
        const settlementTaxRate = Number(row.settlementTaxRate) || 0; // 税率
        const settlementIncludeTaxAmount = Number(row.settlementIncludeTaxAmount) || 0; // 金额(含税)
        const settlementExcludeTaxAmount = settlementIncludeTaxAmount / (1 + settlementTaxRate); // 金额(不含税)
        const settlementTaxAmount = settlementIncludeTaxAmount / (1 + settlementTaxRate) * settlementTaxRate; // 税额
        const settlementUnitPrice = !currentSettlementQuantity ? 0 : settlementIncludeTaxAmount / (1 + settlementTaxRate) / currentSettlementQuantity; // 单价不含税
        this.$set(row, 'settlementIncludeTaxAmount', Number((settlementIncludeTaxAmount || 0).toFixed(2)));
        this.$set(row, 'settlementExcludeTaxAmount', Number((settlementExcludeTaxAmount || 0).toFixed(2)));
        this.$set(row, 'settlementTaxAmount', Number((settlementTaxAmount || 0).toFixed(2)));
        this.$set(row, 'settlementUnitPrice', Number((settlementUnitPrice || 0).toFixed(8)));
      }
    },
    // 填写不含税计算含税
    handleCalculation2({ item, row, event, subTable, rowIndex }) {
      // 2 如果填写规则是填写不含税计算含税：则在填写数量、税率、金额（不含税）后计算其他值；计算包括：
      // 金额含税=金额不含税乘以（1+税率）
      // 税额=金额不含税*税率
      // 单价不含税=金额不含税除以数量 如果数量为0 直接等于0
      if (item.prop === 'settlementUnitPrice') {
        const currentSettlementQuantity = Number(row.currentSettlementQuantity) || 0; // 数量
        const settlementUnitPrice = Number(row.settlementUnitPrice) || 0; // 单价（不含税）
        const settlementTaxRate = Number(row.settlementTaxRate) || 0; // 税率
        const settlementExcludeTaxAmount = currentSettlementQuantity * settlementUnitPrice;
        this.$set(row, 'settlementExcludeTaxAmount', Number((settlementExcludeTaxAmount || 0).toFixed(2)));

        const settlementIncludeTaxAmount = settlementExcludeTaxAmount * (1 + settlementTaxRate); // 金额(含税)
        const settlementTaxAmount = settlementExcludeTaxAmount * settlementTaxRate; // 税额
        const settlementIncludeUnitPrice = settlementIncludeTaxAmount / currentSettlementQuantity;
        this.$set(row, 'settlementIncludeTaxAmount', Number((settlementIncludeTaxAmount || 0).toFixed(2)));
        this.$set(row, 'settlementIncludeUnitPrice', !currentSettlementQuantity ? 0 : Number((settlementIncludeUnitPrice || 0).toFixed(4)));
        this.$set(row, 'settlementTaxAmount', Number((settlementTaxAmount || 0).toFixed(2)));
      }

      if (item.prop === 'settlementExcludeTaxAmount' && (row.settlementUnitPrice === '' || row.settlementUnitPrice === null)) {
        const currentSettlementQuantity = Number(row.currentSettlementQuantity) || 0; // 数量
        const settlementExcludeTaxAmount = Number(row.settlementExcludeTaxAmount) || 0; // 金额（含税）
        const settlementUnitPrice = settlementExcludeTaxAmount / currentSettlementQuantity;
        this.$set(row, 'settlementUnitPrice', !currentSettlementQuantity ? 0 : Number((settlementUnitPrice || 0).toFixed(8)));
      }

      if (item.prop === 'currentSettlementQuantity' || item.prop === 'settlementTaxRate' || item.prop === 'settlementExcludeTaxAmount') {
        const currentSettlementQuantity = Number(row.currentSettlementQuantity) || 0; // 数量
        const settlementTaxRate = Number(row.settlementTaxRate) || 0; // 税率
        const settlementExcludeTaxAmount = Number(row.settlementExcludeTaxAmount) || 0; // 金额(不含税)
        const settlementIncludeTaxAmount = settlementExcludeTaxAmount * (1 + settlementTaxRate); // 金额(含税)
        const settlementTaxAmount = settlementExcludeTaxAmount * settlementTaxRate; // 税额
        const settlementIncludeUnitPrice = settlementIncludeTaxAmount / currentSettlementQuantity;
        this.$set(row, 'settlementIncludeTaxAmount', Number((settlementIncludeTaxAmount || 0).toFixed(2)));
        this.$set(row, 'settlementIncludeUnitPrice', !currentSettlementQuantity ? 0 : Number((settlementIncludeUnitPrice || 0).toFixed(4)));
        this.$set(row, 'settlementTaxAmount', Number((settlementTaxAmount || 0).toFixed(2)));
      }
    },
    // 计算金额
    setAmount (tableName) {
      const data = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
      // 金额合计
      const totalAmount = data.reduce((a, b, c) => {
        return a += Number(b.settlementExcludeTaxAmount || 0);
      }, 0);
      this.$set(this.pageConfig.projectForm, 'totalAmount', Number(totalAmount).toFixed(2));
      // 税额合计
      const totalTaxAmount = data.reduce((a, b, c) => {
        return a += Number(b.settlementTaxAmount || 0);
      }, 0);
      this.$set(this.pageConfig.projectForm, 'totalTaxAmount', Number(totalTaxAmount).toFixed(2));
      // 其他款项合计
      const totalOtherPaymentsAmount = data.reduce((a, b, c) => {
        return a += Number(b.otherPaymentsAmount || 0);
      }, 0);
      this.$set(this.pageConfig.projectForm, 'totalOtherPaymentsAmount', Number(totalOtherPaymentsAmount).toFixed(2));
      // 结算金额合计=> 金额合计+税额合计+其他款项合计
      const totalPriceTax = totalAmount + totalTaxAmount + totalOtherPaymentsAmount;
      this.$set(this.pageConfig.projectForm, 'totalPriceTax', Number(totalPriceTax).toFixed(2));
    },
    // 获取拟采购内容
    setMainCheckMaterials (tableName) {
      const settlementContent = this.pageConfig.subTableConfig[tableName].tableData.slice(0, 5).map(v => v.materialName).join(',');
      this.$set(this.pageConfig.projectForm, 'settlementContent', settlementContent);
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
      this.setMainCheckMaterials('purchaseSettlementDetail');
      this.$refs.editForm.getValidateForm(async () => {
        const data = this.$clone(this.pageConfig.projectForm);
        const purchaseSettlementDetail = this.$refs.purchaseSettlementDetail[0].validateTableData();
        if (!purchaseSettlementDetail || purchaseSettlementDetail.length === 0) {
          // 存在未填写或个数错误的数据
          this.$message.error(`${this.$t('purchaseSettlement.purchaseSettlementDetail')}${this.$t('tips.notFilledIn')}`);
          return;
        }
        const costStructureList = [];
        for (const i in purchaseSettlementDetail) {
          const item = purchaseSettlementDetail[i];
          this.$set(item, 'sorts', Number(i) + 1);
          // 根据所选项目的策划是否必填字段判断子表所属成本结构是否需要必填。
          if (data.projectNatureCode === '01' && data.settlementCostControl === 1 && (!item.quantitiesName && !item.expenseName)) {
            costStructureList.push(item);
          }
        }
        if (costStructureList && costStructureList.length) {
            const sorts = costStructureList.map(v => v.sorts).join(',');
            this.$message.error(`${this.$t('tips.theFirst')}${sorts}${this.$t('tips.row')}：${this.$t('tips.pleaseSelect')}${this.$t('fConfig.quantitiesName')}`);
            return;
        }
        this.getSettlementTotalamountContrast(data, (contrastMsg) => {
          this.saveCheck(data, purchaseSettlementDetail, contrastMsg, isProcess);
        });
      });
    },
    // 保存校验
    async saveCheck(data, purchaseSettlementDetail, contrastMsg, isProcess) {
      if (data.sourceType === '02') {
          this.beforeSave(data, purchaseSettlementDetail, contrastMsg, isProcess);
          return;
        }
        const contractData = {
          classifyPropertyType: 'CLHT',
          contractCode: data.contractCode,
          contractName: data.contractName,
          contractNatureCode: '02',
          partyBUnitName: '',
          projectName: '',
          signUserName: '',
          pageNo: 1,
          pageSize: 10
        };
        const contractResPage = await this.$store.dispatch('purchaseContractLedger/getPageList', contractData).then();
        const contractList = contractResPage.results.records;
        const contractRes = contractList.find(v => v.id === data.contractId);
        const totalSettlementAmount = contractRes && contractRes.totalSettlementAmount || 0; // 累计已收票
        const signAmount = contractRes && contractRes.signAmount || 0; // 合同签订金额
        const totalPriceTax = Number(data.totalPriceTax) || 0; // 累计已收票
        if ((totalSettlementAmount + totalPriceTax) > signAmount && data.sourceType === '01') {
          // 截至当前订单，累计下达金额为：xxx元，已经超过合同签订金额：xx元，确定要继续下达吗？
          // 截至当前采购结算，累计结算金额为：{keyValue}元,
          // 已经超过合同签订金额：{keyValue}元，确定要继续下达吗？
          const msg1 = this.$t('purchaseSettlement.saveTips1').replace('{keyValue}', Number((totalSettlementAmount + totalPriceTax).toFixed(2)));
          const msg2 = this.$t('purchaseSettlement.saveTips2').replace('{keyValue}', Number(signAmount).toFixed(2));
          contrastMsg.push(`${msg1} ${msg2}`);
          this.beforeSave(data, purchaseSettlementDetail, contrastMsg, isProcess);
        } else {
          this.beforeSave(data, purchaseSettlementDetail, contrastMsg, isProcess);
        }
    },
    beforeSave(data, purchaseSettlementDetail, contrastMsg, isProcess) {
        const invoiceTotalAmount = this.selectInvoiceConfig.tagDada.reduce((a, b, c) => {
          return a += Number(b.invoiceAmount);
        }, 0);
        data.invoiceTotalAmount = Number(invoiceTotalAmount.toFixed(2));
        data.settlementInvoiceRelations = this.selectInvoiceConfig.tagDada;
        data.settlementIncomingRelations = this.selectIncomingConfig.tagDada;
        data.settlementReturngoodsRelations = this.selectReturnConfig.tagDada;
        data.settlementDetails = purchaseSettlementDetail;
        if (this.selectInvoiceConfig.tagDada && this.selectInvoiceConfig.tagDada.length && Number(data.totalPriceTax) !== Number(data.invoiceTotalAmount)) {
          contrastMsg.push(this.$t('tips.settlementInvoiceTips'));
          this.checkMsgTips(contrastMsg, () => {
            this.handleSaveData(data, isProcess);
          });
        } else {
          this.checkMsgTips(contrastMsg, () => {
            this.handleSaveData(data, isProcess);
          });
        }
    },
    async getSettlementTotalamountContrast(data, callback) {
      if (data.costControlRuleCode && data.costControlRuleCode === '03') {
        callback && callback([]);
        return;
      }
      // 累计结算金额
      const settlementTotalamount = await this.$store.dispatch('purchaseSettlement/getSettlementTotalamount', {projectId: this.pageConfig.projectForm.projectId}).then(res => res.results);
      // 目标成本分解主表的成控材料费
      const accountInfo = await this.$store.dispatch('purchaseSettlement/getProcostAccountInfo', {projectIds: [this.pageConfig.projectForm.projectId]}).then(res => res.results);
      const materialCostAmount = accountInfo.materialCostAmount;
      // 累计结算金额（本期价税合计之和） +本单据的本期价税合计与目标成本分解主表的成控材料费对比
      const totalPriceTax = Number(data.totalPriceTax || 0);
      if (((settlementTotalamount || 0) + totalPriceTax) > (materialCostAmount || 0)) {
        // 您的材料采购合同的累计结算额超过成控额{keyValue}，确定要保存吗？
          const goBeyondAmount = Number((((settlementTotalamount || 0) + totalPriceTax) - materialCostAmount).toFixed(2));
          // 您的材料成控额为{keyValueCost}，采购合同的累计结算额已超出成控额{keyValue}，确定要保存吗？
          const msgCost = this.$t('purchaseSettlement.settlementTotalamountContrastTips2').replace('{keyValueCost}', materialCostAmount);
          const msg = msgCost.replace('{keyValue}', goBeyondAmount);
          callback && callback([msg]);
      } else {
        callback && callback([]);
      }
    },
    // 提示
    checkMsgTips(listTips, callback) {
      if (listTips.length > 0) {
        for (const i in listTips) {
          const item = listTips[i];
          listTips[i] = `${Number(i) + 1}：${item}`;
        }
        this.$confirm(listTips.join('</br>'), this.$t('tips.tips'), {
            confirmButtonText: this.$t('button.determine'),
            cancelButtonText: this.$t('button.close'),
            dangerouslyUseHTMLString: true,
            type: 'warning'
        }).then(() => {
            callback && callback();
        });
      } else {
          callback && callback();
      }
    },
    // 数量最大值
    currentSettlementQuantityMax(scope, item) {
      if (scope.ifOriginData === 0) {
        return item.max;
      }
      if (this.pageConfig.projectForm.projectNatureCode === '02') {
        return item.max;
      } else {
        return item.maxValue ? scope[item.maxValue] || 0 : item.max;
      }
    },
    // 导入前判断
    canImprotDetail () {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
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
      for (const i in val.tableData) {
        const row = val.tableData[i];
        const settlementTaxRate = Number(row.settlementTaxRate) || 0; // 税率
        const currentSettlementQuantity = Number(row.currentSettlementQuantity) || 0; // 数量
        const settlementIncludeUnitPrice = Number(row.settlementIncludeUnitPrice) || 0; // 单价（含税）
        const settlementIncludeTaxAmount = currentSettlementQuantity * settlementIncludeUnitPrice; // 金额(含税)
        const settlementExcludeTaxAmount = settlementIncludeTaxAmount / (1 + settlementTaxRate); // 金额(不含税)
        const settlementTaxAmount = settlementIncludeTaxAmount / (1 + settlementTaxRate) * settlementTaxRate; // 税额
        const settlementUnitPrice = !currentSettlementQuantity ? 0 : settlementIncludeTaxAmount / (1 + settlementTaxRate) / currentSettlementQuantity; // 单价不含税
        this.$set(row, 'settlementIncludeTaxAmount', Number((settlementIncludeTaxAmount || 0).toFixed(2)));
        this.$set(row, 'settlementExcludeTaxAmount', Number((settlementExcludeTaxAmount || 0).toFixed(2)));
        this.$set(row, 'settlementTaxAmount', Number((settlementTaxAmount || 0).toFixed(2)));
        this.$set(row, 'settlementUnitPrice', Number((settlementUnitPrice || 0).toFixed(8)));
      }
      this.subImportTable = val;
      this.dialogImportFlag = true;
    },
    // 导入计算
    handleImportCalculation (params) {
      this.handleCalculation(params);
    },
    // 保存导入明细数据
    sysHandleImportSave(tableName) {
      this.$refs.importTable.validateTableData((importDetails) => {
          const slaveColumns = this.pageConfig.subTableConfig[tableName].tableList.slaveColumns;
          const index = slaveColumns.findIndex(v => v.prop === 'settlementTaxRate');
          let settlementTaxRateList = [];
          if (index >= 0) {
            settlementTaxRateList = slaveColumns[index].selectList;
          }
          for (const i in importDetails) {
            const row = importDetails[i];
            this.$set(row, 'ifOriginData', 1);
            const settlementTaxRate = row.settlementTaxRate; // 税率
            const taxRateIndex = settlementTaxRateList.findIndex(v => v.dataCode === settlementTaxRate);
            if ((typeof row.settlementTaxRate === 'number' && !isNaN(row.settlementTaxRate)) && taxRateIndex < 0) {
              // 第{keyValue}行税率，在数据字典中的税率明细未匹配上，不能导入！
              const msg = this.$t('tips.settlementTaxRateImportTips').replace('{keyValue}', Number(i) + 1);
              this.$message.error(msg);
              return;
            }
          }
          const tableData = this.pageConfig.subTableConfig[tableName].tableData;
          this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', tableData.concat(importDetails));
          this.dialogImportFlag = false;
          // 子表长度变化后的数值计算回调
          this.deletTableCallback && this.deletTableCallback(tableName);
      });
    }
  }
};
</script>
<style scoped lang='scss'>
.calculationTule {
  display: inline-block;
  margin-right: 10px;
}

</style>
