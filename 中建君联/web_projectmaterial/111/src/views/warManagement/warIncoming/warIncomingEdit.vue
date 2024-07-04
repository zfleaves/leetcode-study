<!--
 * @Author: your name
 * @Date: 2020-07-30 10:35:06
 * @LastEditTime: 2023-01-03 11:37:42
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\warIncoming\warIncomingEdit.vue
-->
<template>
  <div class="warIncoming">
    <edit-page @editEvent="editEvent" v-loading="loading">
      <div slot="editPage">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" :type="type" :customRules="customRules"
          :tableConfig="pageConfig.mainFormConfig" :projectForm="pageConfig.projectForm" @editFormEvent="editFormEvent">
          <template slot="tips-incomingTypeCode">
            <el-tooltip placement="top">
              <div slot="content" style="line-height: 24px;">
                <div>
                  {{$t('warIncoming.incomingTypeCodeTips')}} <br>
                  {{$t('warIncoming.incomingTypeCodeTips1')}}<br>
                  {{$t('warIncoming.incomingTypeCodeTips2')}}<br>
                  {{$t('warIncoming.incomingTypeCodeTips3')}}<br>
                  {{$t('warIncoming.incomingTypeCodeTips4')}}<br>
                  {{$t('warIncoming.incomingTypeCodeTips5')}}<br>
                  {{$t('warIncoming.incomingTypeCodeTips6')}}<br>
                  {{$t('warIncoming.incomingTypeCodeTips7')}}<br>
                  {{$t('warIncoming.incomingTypeCodeTips8')}}<br>
                  {{$t('warIncoming.incomingTypeCodeTips9')}}
                </div>
              </div>
              <span class="tips-item"><i class="el-icon-question"></i></span>
            </el-tooltip>
          </template>
          <!-- 选择合同/零星采购单 -->
          <template slot="form-expendContractName" slot-scope="{scope, item}">
              <el-form-item :label="$t(item.label)" :prop="item.prop"
                :class="item.label.length > 7 && 'maxLabel'" :title="$t(item.label)">
                  <div class="slot-input">
                      <el-input
                          v-model.trim="scope[item.prop]"
                          :size="item.size || 'small'"
                          readonly>
                          <template slot="suffix" v-if="item.inputStatus !== 'disable' && pageDisabled">
                              <i v-if="scope[item.prop]" class="slot-close el-icon-circle-close" @click="handleClearContract(scope, item)"></i>
                              <i class="multiple-choice-icon iconfont icon-menu" @click="handleSelectContract(scope, item)"></i>
                          </template>
                      </el-input>
                  </div>
              </el-form-item>
          </template>
          <!-- 被冲回单据号 -->
          <template slot="form-rushBackIncomingDocNo" slot-scope="{scope, item}">
              <el-form-item :label="$t(item.label)" :prop="item.prop"
                :class="item.label.length > 7 && 'maxLabel'" :title="$t(item.label)">
                  <div class="slot-input">
                      <el-input
                          v-model.trim="scope[item.prop]"
                          :size="item.size || 'small'"
                          readonly>
                          <template slot="suffix" v-if="item.inputStatus !== 'disable' && pageDisabled">
                              <i v-if="scope[item.prop]" class="slot-close el-icon-circle-close" @click="handleClearRushBackIncoming(item)"></i>
                              <i class="multiple-choice-icon iconfont icon-menu" @click="handleSelectRushBackIncoming(item)"></i>
                          </template>
                      </el-input>
                  </div>
              </el-form-item>
          </template>
        </g-edit-form>
        <!-- 明细清单 -->
        <div v-if="pageConfigLoading">
          <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
            <g-edit-title :title="$t(`warIncoming.${subTable.subTableName}`)"
              :titleTips="$t(`warIncoming.${subTable.titleTips}`)">
              <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
                <div class="calculationTule" slot="first">
                   <el-select v-model="calculation" :disabled="pageConfig.projectForm && pageConfig.projectForm.incomingTypeCode === '03'" @change="handleSelectCalculation">
                     <!-- 填写含税计算不含税 -->
                    <el-option  :label="$t('warIncoming.calculation1')" value="01">
                    </el-option>
                    <!-- 填写不含税计算含税 -->
                    <el-option  :label="$t('warIncoming.calculation2')" value="02">
                    </el-option>
                  </el-select>
                </div>
                <template slot="button-sysHandleDeletaBatch" slot-scope="{parameter, buttonConfig}">
                  <el-button
                    :name="parameter.code"
                    :size="parameter.size || buttonConfig.size"
                    :type="parameter.type || buttonConfig.type"
                    :plain="parameter.plain || buttonConfig.plain"
                    :disabled="(pageConfig.projectForm && pageConfig.projectForm.incomingTypeCode === '03') || parameter.disabled"
                    :icon="parameter.icon || buttonConfig.icon"
                    :class="parameter.class || buttonConfig.class"
                    :style="parameter.style || buttonConfig.style"
                    v-fast-click
                    @click="handleFn(parameter)">
                    {{$t(parameter.name)}}
                  </el-button>
                </template>
                <template slot="button-sysHandleSelectDetail" slot-scope="{parameter, buttonConfig}">
                  <el-button
                    :name="parameter.code"
                    :size="parameter.size || buttonConfig.size"
                    :type="parameter.type || buttonConfig.type"
                    :plain="parameter.plain || buttonConfig.plain"
                    :disabled="(pageConfig.projectForm && pageConfig.projectForm.incomingTypeCode === '03') || parameter.disabled"
                    :icon="parameter.icon || buttonConfig.icon"
                    :class="parameter.class || buttonConfig.class"
                    :style="parameter.style || buttonConfig.style"
                    v-fast-click
                    @click="handleFn(parameter)">
                    {{$t(parameter.name)}}
                  </el-button>
                </template>
              </g-button>
            </g-edit-title>
            <g-edit-table v-if="incomingTypeChange" :ref="subTable.subTableName" :type="type" :isSelection="subTable.isSelection"
              :tableConfig="subTable.tableList" :subTable='subTable' :customRules="subTableCustomRules"
              :getRowClassName="getRowClassName"
              :delete.sync="deleteList[subTable.subTableName]" @editTableEvent='editTableEvent'>
              <template slot="edit-table-materialName" slot-scope="{item, scope}">
                <el-input v-if="item.inputStatus !== 'disable' && pageDisabled" :class="changeClassVarieties(scope)"
                  size="small" :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                  :clearable="item.clearable === undefined ? true : item.clearable" v-model.trim="scope[item.prop]"
                  :placeholder="item.placeholder">
                </el-input>
                <div v-else class="ellipsis" :class="changeClassVarieties(scope)">{{scope[item.prop]}}</div>
              </template>
              <template slot="edit-table-standards" slot-scope="{item, scope}">
                <el-input v-if="item.inputStatus !== 'disable' && pageDisabled" :class="changeClassVarieties(scope)"
                  size="small" :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                  :clearable="item.clearable === undefined ? true : item.clearable" v-model.trim="scope[item.prop]"
                  :placeholder="item.placeholder">
                </el-input>
                <div v-else class="ellipsis" :class="changeClassVarieties(scope)">{{scope[item.prop]}}</div>
              </template>
              <template slot="edit-table-unit" slot-scope="{item, scope}">
                <el-input v-if="item.inputStatus !== 'disable' && pageDisabled" :class="changeClassVarieties(scope)"
                  size="small" :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                  :clearable="item.clearable === undefined ? true : item.clearable" v-model.trim="scope[item.prop]"
                  :placeholder="item.placeholder">
                </el-input>
                <div v-else class="ellipsis" :class="changeClassVarieties(scope)">{{scope[item.prop]}}</div>
              </template>
              <template slot="edit-table-warehouseShelvesId" slot-scope="{item, scope}">
                <el-select v-if="item.inputStatus !== 'disable'" v-model.trim="scope[item.prop]"
                  :placeholder="item.placeholder" :size="item.size || 'small'"
                  :disabled="item.inputStatus === 'disable'" :filterable="item.filterable || true" style="width:100%"
                  @change="handleChange(item, scope, $event, scope.$index)">
                  <el-option v-for="(child,i) in warehouseShelvesList" :key="i" :label="child[item.nameCode]"
                    :value="child[item.valueCode]">
                  </el-option>
                </el-select>
                <div class="ellipsis" v-else>{{scope.warehouseShelvesName}}</div>
              </template>
              <template slot="edit-table-currentIncomingQuantity" slot-scope="{item, scope}">
                <!-- :max="(scope.passedQuantity - scope.alreadyIncomingQuantity) || 0" -->
                <el-number v-if="item.inputStatus !== 'disable'" controls-position="right" size="small"
                  :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                  :precision="Number(item.precision)" v-model.trim="scope[item.prop]" :placeholder="item.placeholder"
                  @change="handleCurrentIncomingQuantity(item, scope, scope.currentIncomingQuantity, subTable, scope.$index)">
                </el-number>
                <div class="ellipsis" v-else>{{scope[item.prop]}}</div>
              </template>
            </g-edit-table>
          </div>
        </div>
      </div>
    </edit-page>
    <!-- 选择材料分类 -->
    <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
      <checkarrivalSporadicDetail slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogVisible"
        :selectList="varietiesIdList" :supplierId="pageConfig.projectForm.supplierId || 0"
        :expendContractId="pageConfig.projectForm.expendContractId || ''"
        :sourceType="pageConfig.projectForm.sourceType || '01'"
        :projectId="pageConfig.projectForm.projectId || 0" varietiesTitle="warIncoming.checkarrivalSporadicVarieties"
        @getData="getData">
      </checkarrivalSporadicDetail>
    </g-dialog>

    <!-- 选择合同/零星采购单 -->
      <g-dialog v-if="dialogContract" :dialogConfig="dialogConfigContract" :isVisible.sync="dialogContract">
          <contractSporadicPurchase slot="body" slot-scope="{height}" :dialogHeight="height"
              :selectId='`${pageConfig.projectForm.sourceType}-${pageConfig.projectForm.expendContractId}`'
              :projectId="pageConfig.projectForm.projectId"
              type="warIncoming"
              :close.sync="dialogContract" @getData="getContractData" v-if="dialogContract">
          </contractSporadicPurchase>
      </g-dialog>
      <!-- 冲回入库单 -->
      <g-dialog v-if="rushBackIncomingShow" :dialogConfig="dialogConfigRushback" :isVisible.sync="rushBackIncomingShow">
          <rushbackPage slot="body" slot-scope="{height}" :dialogHeight="height"
              :selectId='pageConfig.projectForm.rushBackIncomingId'
              :projectId="pageConfig.projectForm.projectId"
              :close.sync="rushBackIncomingShow" @getData="getRushBackIncomingData" v-if="rushBackIncomingShow">
          </rushbackPage>
      </g-dialog>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';

export default {
  name: 'warIncomingEdit',
  mixins: [editPage],
  beforeRouteEnter (to, from, next) {
    if (to.name === 'warOutboundEdit') {
        const Base64 = require('js-base64').Base64;
        const checkArrivalId = Number(Base64.decode(to.params.sourceId));
        const type = Base64.decode(to.params.type);
        if (type === 'add' && checkArrivalId) {
            to.meta.lastRouterName = 'checkArrival';
        } else {
            to.meta.lastRouterName = 'warIncoming';
        }
    }
    next();
  },
  data () {
    const invoiceValid = (rule, value, callback) => {
      if (value) {
        const regular = /^[A-Za-z0-9]+$/;
        if (!regular.test(value)) {
          callback(new Error(this.$t('tips.pleaseEnterInvoiceCode')));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const currentIncomingQuantityValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('warIncoming.currentIncomingQuantityTips')));
      } else {
        callback();
      }
    };
    const includeTaxAmountValid = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('warIncoming.includeTaxAmountTips')));
      } else {
        callback();
      }
    };
    const taxAmountValid = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(`${this.$t('tips.pleaseEnter')}${this.$t('warIncoming.taxAmount')}`));
      } else {
        callback();
      }
    };
    return {
      page: new Page(),
      projectForm: {
        contractCode: '',
        attachment: '',
        currencyCode: '01',
        currencyValue: '',
        incomingAgentUserName: '',
        incomingDate: this.$utils.commonUtil.formatTime(new Date()),
        incomingTypeCode: '01',
        incomingTypeValue: '',
        invoiceCode: '',
        invoiceNo: '',
        taxRate: '',
        invoiceTypeCode: '',
        invoiceTypeValue: '',
        mainMaterials: '',
        projectId: 0,
        remarks: '',
        supplierId: '',
        supplierName: '',
        totalAmount: 0,
        totalPriceTax: 0,
        totalTaxAmount: 0,
        warehouseId: '',
        warehouseName: '',
        costControlRuleCode: '',
        costControlRuleValue: '',
        rushBackIncomingId: '',
        rushBackIncomingDocNo: '',
        totalIncomingQuantity: '',
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      },
      // 选择材料
      dialogVisible: false,
      dialogConfig: {
        title: this.$t('warIncoming.seleMaterialVarieties'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '90%',
        span: '0.75'
      },
      customRules: {
        invoiceCode: [{ validator: invoiceValid, trigger: 'blur' }],
        invoiceNo: [{ validator: invoiceValid, trigger: 'blur' }]
      },
      subTableCustomRules: {
        currentIncomingQuantity: [{ required: true, validator: currentIncomingQuantityValid, trigger: 'blur' }],
        includeTaxAmount: [{ required: true, validator: includeTaxAmountValid, trigger: 'blur' }],
        taxAmount: [{ required: true, validator: taxAmountValid, trigger: 'blur' }]
      },
      varietiesIdList: [],
      warehouseShelvesList: [],
      // 选择合同
      dialogContract: false,
      dialogConfigContract: {
          title: this.$t('dialog.contractSporadicPurchaseName'),
          appendBody: false,
          center: true,
          top: '50px',
          width: '80%',
          span: '0.75'
      },
      contractConfig: null,
      nodeCode: '',
      calculation: '01',
      checkArrivalId: '',
      sourceType: '',
      sporadicPurchaseId: '',
      fastLoading: null,
      rushBackIncomingConfig: {},
      rushBackIncomingShow: false,
      dialogConfigRushback: {
          title: `${this.$t('tips.pleaseSelect')}${this.$t('warIncoming.rushBackIncomingDocNo')}`,
          appendBody: false,
          center: true,
          top: '50px',
          width: '80%',
          span: '0.75'
      },
      cloneTableList: [],
      cloneSubTableButton: [],
      incomingTypeChange: false
    };
  },
  props: {
    processParmas: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    checkarrivalSporadicDetail (resolve) {
      require(['components/material/checkarrivalSporadicDetail/checkarrivalSporadicDetail.vue'], resolve);
    },
    contractSporadicPurchase(resolve) {
      require(['views/promaterial/compoent/contractSporadicPurchase/contractSporadicPurchase.vue'], resolve);
    },
    rushbackPage(resolve) {
      require(['../compoent/rushbackPage/rushbackPage'], resolve);
    }
  },
  created() {
    this.cloneTableList = this.$clone(this.page.PageConfig.subTableConfig['warehouseIncomingDetail'].tableList.slaveColumns);
    this.incomingTypeChange = true;
    this.sourceType = this.$route.params.sourceType;
    if (this.sourceType === 'checkArrival') {
      this.checkArrivalId = Number(this.$base64.decode(this.$route.params.sourceId));
    }
    if (this.sourceType === 'sporadicPurchase') {
      this.sporadicPurchaseId = Number(this.$base64.decode(this.$route.params.sourceId));
    }
    // '系统正在计算逻辑，请稍等...'
    if (this.type === 'add' && this.sourceType === 'checkArrival') {
        this.fastLoading = this.$loading({
          lock: true,
          text: this.$t('tips.waitTips'),
          background: 'rgba(255, 255, 255, 0.5)'
        });
        // 快速入库
        this.handleQuickInWarehouse();
    }
    if (this.type === 'add' && this.sourceType === 'sporadicPurchase') {
        this.fastLoading = this.$loading({
          lock: true,
          text: this.$t('tips.waitTips'),
          background: 'rgba(255, 255, 255, 0.5)'
        });
        // 快速入库
        this.handleSporadicPurchaseInWarehouse();
    }
  },
  methods: {
    handleQuickInWarehouse() {
      this.getIncomingInfo();
    },
    // 获取到货单明细
    getIncomingInfo() {
        this.$store.dispatch('checkArrival/checkarrivalIncomeDetails', {checkArrivalId: this.checkArrivalId}).then(res => {
          if (res.status === 0) {
            this.$set(this.pageConfig.projectForm, 'checkArrivalId', res.results.id);
            this.$set(this.pageConfig.projectForm, 'projectName', res.results.projectName);
            this.$set(this.pageConfig.projectForm, 'projectId', res.results.projectId);
            this.$set(this.pageConfig.projectForm, 'projectCode', res.results.projectCode);
            this.$set(this.pageConfig.projectForm, 'expendContractId', res.results.expendContractId);
            this.$set(this.pageConfig.projectForm, 'expendContractName', res.results.expendContractName);
            this.$set(this.pageConfig.projectForm, 'supplierId', res.results.supplierId);
            this.$set(this.pageConfig.projectForm, 'supplierName', res.results.supplierName);
            this.$set(this.pageConfig.projectForm, 'mainMaterials', res.results.mainCheckMaterials);
            this.$set(this.pageConfig.projectForm, 'expendContractCode', res.results.expendContractCode);

            this.$set(this.pageConfig.projectForm, 'sourceType', '01');
            this.pageConfig.projectForm.id = '';
            const data = this.$clone(res.results.checkArrivalDetails);
            // 此单据的明细已经全部完成入库，不能再次入库！
            if (!data || data.length === 0) {
              this.fastLoading.close();
              this.getWarehouseList();
              this.setSupplierInputStatus();
              this.changeCostControlRule();
              return this.$message.error(this.$t('warIncoming.quickWarehousingTips'));
            }
            for (const item of data) {
              this.$set(item, 'checkRemark', item.remarks);
              this.$set(item, 'eId', item.id);
              this.$set(item, 'isNew', true);
            }
            this.getTaxRate(data);
            this.getWarehouseList();
            this.setSupplierInputStatus();
            this.changeCostControlRule();
            this.$nextTick(() => {
              this.$refs.editForm.handleClearValidate();
              this.fastLoading.close();
            });
          }
        });
    },
    // 零星采购快速入库
    handleSporadicPurchaseInWarehouse() {
        this.$store.dispatch('sporadicPurchase/sporadicPurchaseIncomeDetails', {sporadicPurchaseId: this.sporadicPurchaseId}).then(res => {
          if (res.status === 0) {
            this.$set(this.pageConfig.projectForm, 'sporadicPurchaseId', res.results.id);
            this.$set(this.pageConfig.projectForm, 'expendContractId', res.results.id);
            this.$set(this.pageConfig.projectForm, 'expendContractCode', res.results.docNo);
            this.$set(this.pageConfig.projectForm, 'expendContractName', res.results.purchaseContent);
            this.$set(this.pageConfig.projectForm, 'projectName', res.results.projectName);
            this.$set(this.pageConfig.projectForm, 'projectId', res.results.projectId);
            this.$set(this.pageConfig.projectForm, 'projectCode', res.results.projectCode);
            this.$set(this.pageConfig.projectForm, 'supplierId', res.results.supplierId);
            this.$set(this.pageConfig.projectForm, 'supplierName', res.results.supplierName);

            this.$set(this.pageConfig.projectForm, 'sourceType', '02');
            this.pageConfig.projectForm.id = '';
            const data = this.$clone(res.results.sporadicPurchaseDetails);
            if (!data || data.length === 0) {
              this.fastLoading.close();
              // 此单据的明细已经全部完成入库，不能再次入库！
              this.$message.error(this.$t('warIncoming.quickWarehousingTips'));
              this.getWarehouseList();
              this.setSupplierInputStatus();
              this.changeCostControlRule();
            }
            for (const item of data) {
              this.$set(item, 'checkRemark', item.remarks);
              this.$set(item, 'demandPlanDetailId', item.eId);
              this.$set(item, 'eId', item.id);
              this.$set(item, 'isNew', true);
            }
            this.getData(data);
            this.getWarehouseList();
            this.setSupplierInputStatus();
            this.changeCostControlRule();
            this.$nextTick(() => {
              this.$refs.editForm.handleClearValidate();
              this.fastLoading.close();
            });
          }
        });
    },
    getTaxRate(data) {
      const params = {
          classifyPropertyType: 'CLHT',
          contractNatureCode: '02',
          contractCode: this.pageConfig.projectForm.expendContractCode,
          contractName: '',
          executionStatus: [],
          partyBUnitName: '',
          projectId: this.pageConfig.projectForm.projectId
       };
      this.$store.dispatch('publicApi/getV1ContractExpendClassifyPage', params).then(res => {
        if (res.status === 0) {
          res.results && res.results.length && this.$set(this.pageConfig.projectForm, 'taxRate', res.results[0].taxRate);
          if (!data || data.length === 0) {
            // 此单据的明细已经全部完成入库，不能再次入库！
            this.$message.error(this.$t('warIncoming.quickWarehousingTips'));
            return;
          }
          this.getData(data);
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
      });
    },
    checkRow (row) {
      const passedQuantity = Number(row.passedQuantity) || 0; // 验收通过数量
      const alreadyIncomingQuantity = Number(row.alreadyIncomingQuantity) || 0; // 已入库数量
      const currentIncomingQuantity = Number(row.currentIncomingQuantity) || 0; // 本次入库数量
      if (Number((currentIncomingQuantity + alreadyIncomingQuantity).toFixed(4)) > Number(passedQuantity.toFixed(4))) {
        return true;
      } else {
        return false;
      }
    },
    changeClassVarieties(row) {
      const materialName = row.materialName || '';
      const standards = row.standards || '';
      const unit = row.unit || '';
      const varietiesName = row.varietiesName || '';
      const varietiesStandards = row.varietiesStandards || '';
      const varietiesUnit = row.varietiesUnit || '';
      if (`${materialName}-${standards}-${unit}` !== `${varietiesName}-${varietiesStandards}-${varietiesUnit}`) {
        return 'changeVarieties';
      }
    },
    handleFn (parameter) {
      this[parameter.code](parameter.subTableCode);
    },
    // 选择入库类型后
    changeIncomingType(type) {
      this.incomingTypeChange = false;
      const incomingTypeCode = this.pageConfig.projectForm.incomingTypeCode;
      const formList = this.pageConfig.mainFormConfig.formList;
      const tableList = this.pageConfig.subTableConfig['warehouseIncomingDetail'].tableList.slaveColumns;
      const rushBackIncomingConfig = formList.find(v => v.prop === 'rushBackIncomingDocNo');
      const contractConfig = formList.find(v => v.prop === 'expendContractName');
      const warehouseConfig = formList.find(v => v.prop === 'warehouseId');
      if (incomingTypeCode === '03') {
        if (this.$route.name !== 'processApprovalPage') {
          this.$set(rushBackIncomingConfig, 'inputStatus', 'edit');
        }
        this.$set(contractConfig, 'inputStatus', 'disable');
        this.$set(warehouseConfig, 'inputStatus', 'disable');
        for (const item of tableList) {
          this.$set(item, 'inputStatus', 'disable');
        }
      } else {
        if (this.$route.name !== 'processApprovalPage') {
          for (const item of tableList) {
            const index = this.cloneTableList.findIndex(v => v.prop === item.prop);
            this.$set(item, 'inputStatus', this.cloneTableList[index].inputStatus);
          }
          this.$set(rushBackIncomingConfig, 'inputStatus', 'hide');
          this.$set(contractConfig, 'inputStatus', 'edit');
          this.$set(warehouseConfig, 'inputStatus', 'edit');
        }
      }
      if (type.prop) {
        this.handleClearExpendContract();
      }
      this.$nextTick(() => {
        this.incomingTypeChange = true;
      });
    },
    handleClearExpendContract() {
      const formList = this.pageConfig.mainFormConfig.formList;
      const contractConfig = formList.find(v => v.prop === 'expendContractName');
      this.handleClearContract(this.pageConfig.projectForm, contractConfig);
      const warehouseConfig = formList.find(v => v.prop === 'warehouseId');
      const params = {
        paramsConfig: warehouseConfig,
        selectList: []
      };
      this.handleSelect(params, 'warehouseName');
      this.pageConfig.projectForm.rushBackIncomingId = '';
      this.pageConfig.projectForm.rushBackIncomingDocNo = '';
    },
    // 项目类型改变后
    changeCostControlRule() {
      const costControlRuleCode = this.pageConfig.projectForm.costControlRuleCode;
      const tableList = this.pageConfig.subTableConfig['warehouseIncomingDetail'].tableList.slaveColumns;
      const setExpenseStatus = ['expenseName', 'expenseCode'];
      const setQuantitiesStatus = ['quantitiesName', 'quantitiesCode'];
      if (costControlRuleCode === '02') {
        for (const i of setExpenseStatus) {
          const index = tableList.findIndex(v => v.prop === i);
          index >= 0 && this.$set(tableList[index], 'inputStatus', 'disable');
        }
        for (const i of setQuantitiesStatus) {
          const index = tableList.findIndex(v => v.prop === i);
          index >= 0 && this.$set(tableList[index], 'inputStatus', 'hide');
        }
      } else {
        for (const i of setExpenseStatus) {
          const index = tableList.findIndex(v => v.prop === i);
          index >= 0 && this.$set(tableList[index], 'inputStatus', 'hide');
        }
        for (const i of setQuantitiesStatus) {
          const index = tableList.findIndex(v => v.prop === i);
          index >= 0 && this.$set(tableList[index], 'inputStatus', 'disable');
        }
      }
    },
    // ---------------------- 合同/零星采购单 --------------------
    // 清除合同
    handleClearContract(row, item) {
      const params = {
        paramsConfig: item,
        selectList: []
      };
      this.handleSelect(params, 'expendContractName');
    },
    // 打开合同弹窗
    handleSelectContract(row, item) {
      if (!this.pageConfig.projectForm.projectName) {
          this.$message.error(this.$t('tips.pleaseSelectProject'));
          return;
      }
      if (!this.pageConfig.projectForm.incomingTypeCode) {
          this.$message.error(`${this.$t('tips.pleaseSelect')}${this.$t('warIncoming.incomingTypeCode')}`);
          return;
      }
      this.contractConfig = this.$clone(item);
      this.dialogContract = true;
    },
    // 选中的合同数据
    getContractData(arr) {
      const params = {
          paramsConfig: this.contractConfig,
          selectList: arr
      };
      this.handleSelect(params, 'expendContractName', () => {
        this.setSupplierInputStatus();
        this.dialogContract = false;
      });
    },
    quantitiesShow(projectForm) {
      if (projectForm && (projectForm.costControlRuleCode === '01' || projectForm.costControlRuleCode === '03')) {
        return true;
      }
      return false;
    },
    expenseShow(projectForm) {
      if (projectForm && projectForm.costControlRuleCode === '02') {
        return true;
      }
      return false;
    },
    // ============ 冲回入库单 ============
    // 清除
    handleClearRushBackIncoming(item) {
      const params = {
        paramsConfig: item,
        selectList: []
      };
      this.handleSelect(params, 'docNo');
    },
    // 选择
    handleSelectRushBackIncoming(item) {
      if (!this.pageConfig.projectForm.projectName) {
          this.$message.error(this.$t('tips.pleaseSelectProject'));
          return;
      }
      this.rushBackIncomingConfig = this.$clone(item);
      this.rushBackIncomingShow = true;
    },
    // 选中的数据
    getRushBackIncomingData(arr) {
      const params = {
          paramsConfig: this.rushBackIncomingConfig,
          selectList: arr
      };
      this.handleSelect(params, 'docNo', () => {
        if (arr && arr.length) {
          this.$store.dispatch('warIncoming/getInfo', {incomingId: this.pageConfig.projectForm.rushBackIncomingId}).then(res => {
            if (res.status === 0) {
              const results = res.results;
              this.$set(this.pageConfig.projectForm, 'expendContractName', results.expendContractName);
              this.$set(this.pageConfig.projectForm, 'expendContractCode', results.expendContractCode);
              this.$set(this.pageConfig.projectForm, 'expendContractId', results.expendContractId);
              this.$set(this.pageConfig.projectForm, 'taxRate', results.taxRate);
              this.$set(this.pageConfig.projectForm, 'supplierName', results.supplierName);
              this.$set(this.pageConfig.projectForm, 'supplierId', results.supplierId);
              this.$set(this.pageConfig.projectForm, 'sourceType', results.sourceType);
              this.$set(this.pageConfig.projectForm, 'warehouseId', results.warehouseId);
              this.$set(this.pageConfig.projectForm, 'warehouseName', results.warehouseName);
              const incomingDetails = res.results.incomingDetails;
              const data = [];
              for (const item of incomingDetails) {
                this.$set(item, 'id', '');
                this.$set(item, 'alreadyIncomingQuantity', item.alreadyIncomingQuantity || 0);
                this.$set(item, 'currentIncomingQuantity', item.currentIncomingQuantity > 0 ? -item.currentIncomingQuantity : item.currentIncomingQuantity);
                this.$set(item, 'includeTaxAmount', item.includeTaxAmount > 0 ? -item.includeTaxAmount : item.includeTaxAmount);
                this.$set(item, 'excludeTaxAmount', item.excludeTaxAmount > 0 ? -item.excludeTaxAmount : item.excludeTaxAmount);
                this.$set(item, 'taxAmount', item.taxAmount > 0 ? -item.taxAmount : item.taxAmount);
                data.push(item);
              }
              this.$set(this.pageConfig.subTableConfig['warehouseIncomingDetail'], 'tableData', data);
              this.$nextTick(() => {
                this.setSupplierInputStatus();
                this.setMainCheckMaterials('warehouseIncomingDetail');
              });
            }
          });
        } else {
          this.$set(this.pageConfig.subTableConfig['warehouseIncomingDetail'], 'tableData', []);
        }
        this.rushBackIncomingShow = false;
      });
    },
    // 设置供应商选择状态
    setSupplierInputStatus() {
      const sourceType = this.pageConfig.projectForm.sourceType;
      const formList = this.pageConfig.mainFormConfig.formList;
      const supplierConfig = formList.find(v => v.prop === 'supplierName');
      if (this.nodeCode !== 'BEGIN' && this.$route.name === 'processApprovalPage') {
        this.$set(supplierConfig, 'inputStatus', 'disable');
        this.isButtonShow = true;
        return;
      }
      if (sourceType === '01') {
        this.$set(supplierConfig, 'inputStatus', 'disable');
      } else {
        this.$set(supplierConfig, 'inputStatus', 'edit');
      }
    },
    // 获取info数据
    async _getInfoData (id = 0) {
      await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
        this.setSupplierInputStatus();
        this.displayFieldsAccordingToProjectControlType('warehouseIncomingDetail');
        this.changeIncomingType(true);
        this.changeCostControlRule();
        this.getWarehouseList(() => {
          this.changeWarehouse();
        });
      });
    },
    // 选择项目后
    handleCheckProject (params) {
      this.handleSelect(params, 'projectName', () => {
        const contractConfig = {
          label: 'dialog.contractSporadicPurchaseName', prop: 'expendContractName', span: 8, formType: 'slot', isRule: true,
          key: 'expendContractId', relationKey: { receive: 'projectId', value: 'projectName' },
          isRelation: true,
          relationList: [
            // { receive: 'expendContractCode', value: 'expendContractCode' },
            { receive: 'supplierName', value: 'partyBUnitName' },
            { receive: 'supplierId', value: 'partyBUnitId' },
            // { receive: 'currencyValue', value: 'currencyValue' },
            // { receive: 'currencyCode', value: 'currencyCode' },
            { receive: 'sourceType', value: 'sourceType' },
            { receive: 'expendContractCode', value: 'purchaseCode' }
          ],
          relationTable: ['warehouseIncomingDetail']
        };
        this.handleClearContract(this.pageConfig.projectForm, contractConfig);
        if (params.selectList.length) {
          this.getWarehouseList();
          this.displayFieldsAccordingToProjectControlType('warehouseIncomingDetail');
        } else {
          const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'warehouseId');
          if (index >= 0) {
            this.$set(this.pageConfig.mainFormConfig.formList[index], 'selectList', []);
          }
          this.warehouseShelvesList = [];
        }
        this.changeCostControlRule();
      });
    },
    getWarehouseList (callback) {
      const data = {
        pageNo: 1,
        pageSize: 50,
        projectId: this.pageConfig.projectForm.projectId,
        warehouseCode: '',
        warehouseName: ''
      };
      this.$store.dispatch('warIncoming/getWarehouseList', data).then(res => {
        if (res.status === 0) {
          const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'warehouseId');
          if (index >= 0) {
            this.$set(this.pageConfig.mainFormConfig.formList[index], 'selectList', res.results);
          }
          // 仓库赋值
          if (res.results && res.results.length && !callback) {
            this.setWareHouse && this.setWareHouse([res.results[0]]);
          }
          callback && callback();
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
      });
    },
    // 选择仓库后
    changeWarehouse () {
      const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'warehouseId');
      if (index >= 0) {
        const selectList = this.pageConfig.mainFormConfig.formList[index].selectList;
        const key = selectList.findIndex(v => v.id === this.pageConfig.projectForm.warehouseId);
        if (key >= 0) {
          this.warehouseShelvesList = selectList[key].warWarehouseShelves;
        } else {
          this.warehouseShelvesList = [];
        }
      }
    },
    // 选择库位后
    handleChange (item, row, event, rowIndex) {
      const key = this.warehouseShelvesList.findIndex(v => v.id === event);
      if (key >= 0) {
        row.warehouseShelvesName = this.warehouseShelvesList[key].warehouseShelvesName;
      } else {
        row.warehouseShelvesName = [];
      }
    },
    // 选择明细
    sysHandleSelectDetail (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      // if (!this.pageConfig.projectForm.supplierId) {
      //   this.$message.error(`${this.$t('tips.pleaseSelect')}${this.$t('warIncoming.supplierName')}`);
      //   return;
      // }
      if (!this.pageConfig.projectForm.expendContractName) {
          this.$message.error(`${this.$t('tips.pleaseSelect')} ${this.$t('dialog.contractSporadicPurchaseName')}`);
          return;
      }
      const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
      for (const item of tableData) {
        item.rowKey = `${item.sourceType}-${item.preMainId}-${item.eId}-${item.varietiesId}`;
      }
      this.varietiesIdList = tableData;
      this.dialogVisible = true;
    },
    // 获取选中的数据
    getData (arr) {
      const data = [];
      for (const item of arr) {
        if (item.isNew) {
          const taxRate = item.taxRate ? item.taxRate : this.pageConfig.projectForm.taxRate || 0;
          // 到货验收通过的数量减去已入库数量后，直接赋值给入库单的本次入库数量。
          let currentIncomingQuantity = Number(((item.quantity || 0) - (item.incomingQuantity || 0)).toFixed(4));
          currentIncomingQuantity = currentIncomingQuantity < 0 ? 0 : currentIncomingQuantity;
          const includeUnitPrice = Number(item.supplyOrderDeliverPrice) ? Number(item.supplyOrderDeliverPrice) : Number(item.includeUnitPrice) || 0; // 单价（含税）
          const includeTaxAmount = currentIncomingQuantity * includeUnitPrice;
          const excludeTaxAmount = includeTaxAmount / (1 + taxRate); // 金额(不含税)
          const taxAmount = includeTaxAmount / (1 + taxRate) * taxRate; // 税额
          const unitPrice = !currentIncomingQuantity ? 0 : includeTaxAmount / (1 + taxRate) / currentIncomingQuantity; // 单价不含税
          data.push(
            {
              alreadyIncomingQuantity: item.incomingQuantity || 0,
              createTime: this.$utils.commonUtil.formatTime(new Date()),
              currentIncomingQuantity,
              excludeTaxAmount,
              hashColumn: '',
              includeTaxAmount,
              varietiesName: this.$clone(item.varietiesName),
              varietiesStandards: this.$clone(item.executeStandards),
              varietiesUnit: this.$clone(item.executeUnit),
              materialName: item.varietiesName,
              models: item.models || '',
              brand: item.brand || '',
              eId: item.eId,
              passedQuantity: item.quantity,
              preDocNo: item.docNo,
              preMainId: item.preMainId,
              remarks: '',
              sourceType: item.sourceType,
              standards: item.executeStandards,
              taxAmount,
              taxRate,
              unit: item.executeUnit,
              unitPrice,
              varietiesCode: item.varietiesCode,
              varietiesId: item.varietiesId,
              warehouseShelvesId: '',
              warehouseShelvesName: '',
              warrantyExpiredDate: '',
              checkRemark: item.checkRemark,
              includeUnitPrice,
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
              // 需求计划单号及需求明细id
              demandPlanCode: item.demandPlanCode,
              demandPlanDetailId: item.demandPlanDetailId,
              demandPlanId: item.demandPlanId,
              demandPlanQuantity: item.demandPlanQuantity,
              demandPlanTypeCode: item.demandPlanTypeCode,
              demandPlanTypeValue: item.demandPlanTypeValue,
              // 可修改名称、规格、单位
              executeStandards: item.executeStandards,
              executeUnit: item.executeUnit,
              executeVarietiesName: item.executeVarietiesName,
              // 申报料单位、对应分包合同（合同id）
              projectUnitId: item.projectUnitId,
              projectUnitName: item.projectUnitName,
              expendContractName: item.expendContractName,
              expendContractId: item.expendContractId,
              expendContractCode: item.expendContractCode,
              supplyOrderDeliverPrice: item.supplyOrderDeliverPrice || '',
              deliverNoticePrice: item.sourceType === '01' ? item.includeUnitPrice : null // 送货通知单单价
            }
          );
        }
      }
      let tableData = this.pageConfig.subTableConfig['warehouseIncomingDetail'].tableData;
      tableData = tableData.concat(data);
      this.$set(this.pageConfig.subTableConfig['warehouseIncomingDetail'], 'tableData', tableData);
      this.dialogVisible = false;
      this.setMainCheckMaterials('warehouseIncomingDetail');
      this.setAmount('warehouseIncomingDetail');
    },
    // 批量删除后的回调
    deletTableCallback (tableName) {
      this.setMainCheckMaterials(tableName);
    },
    handleCurrentIncomingQuantity (item, row, event, subTable, rowIndex) {
      const data = { item, row, event, subTable, rowIndex };
      this.handleCalculation(data);
    },
    // 切换计算规则
    handleSelectCalculation(val) {
      const tableData = this.$clone(this.pageConfig.subTableConfig['warehouseIncomingDetail'].tableData);
      if (tableData.length === 0) return;
      const messageTips = this.$t('warIncoming.selectCalculationTips');
      this.$confirm(messageTips, this.$t('warIncoming.selectCalculation'), {
        dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      }).then(() => {
      }).catch(e => {
        this.calculation = val === '01' ? '02' : '01';
      });
    },
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
      if (item.prop === 'includeUnitPrice') {
        const currentIncomingQuantity = Number(row.currentIncomingQuantity) || 0; // 数量
        const includeUnitPrice = Number(row.includeUnitPrice) || 0; // 单价（含税）
        const includeTaxAmount = currentIncomingQuantity * includeUnitPrice;
        this.$set(row, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));

        const taxRate = Number(row.taxRate) || 0; // 税率
        const excludeTaxAmount = includeTaxAmount / (1 + taxRate); // 金额(不含税)
        const taxAmount = includeTaxAmount / (1 + taxRate) * taxRate; // 税额
        const unitPrice = !currentIncomingQuantity ? 0 : includeTaxAmount / (1 + taxRate) / currentIncomingQuantity; // 单价不含税
        this.$set(row, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));
        this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
        this.$set(row, 'unitPrice', Number((unitPrice || 0).toFixed(8)));
      }
      if (item.prop === 'includeTaxAmount' && (row.includeUnitPrice === '' || row.includeUnitPrice === null)) {
        const currentIncomingQuantity = Number(row.currentIncomingQuantity) || 0; // 数量
        const includeTaxAmount = Number(row.includeTaxAmount) || 0; // 金额（含税）
        const includeUnitPrice = includeTaxAmount / currentIncomingQuantity;
        this.$set(row, 'includeUnitPrice', !currentIncomingQuantity ? 0 : Number((includeUnitPrice || 0).toFixed(4)));
      }
      if (item.prop === 'currentIncomingQuantity' || item.prop === 'taxRate') {
        const currentIncomingQuantity = Number(row.currentIncomingQuantity) || 0; // 数量
        const taxRate = Number(row.taxRate) || 0; // 税率
        const includeUnitPrice = Number(row.includeUnitPrice) || 0; // 单价（含税）
        const includeTaxAmount = currentIncomingQuantity * includeUnitPrice;
        const excludeTaxAmount = includeTaxAmount / (1 + taxRate); // 金额(不含税)
        const taxAmount = includeTaxAmount / (1 + taxRate) * taxRate; // 税额
        const unitPrice = !currentIncomingQuantity ? 0 : includeTaxAmount / (1 + taxRate) / currentIncomingQuantity; // 单价不含税
        this.$set(row, 'includeTaxAmount', includeTaxAmount);
        this.$set(row, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));
        this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
        this.$set(row, 'unitPrice', Number((unitPrice || 0).toFixed(8)));
      }
      if (item.prop === 'includeTaxAmount' && row.includeUnitPrice >= 0) {
        const currentIncomingQuantity = Number(row.currentIncomingQuantity) || 0; // 数量
        const taxRate = Number(row.taxRate) || 0; // 税率
        const includeTaxAmount = Number(row.includeTaxAmount) || 0; // 金额(含税)
        const excludeTaxAmount = includeTaxAmount / (1 + taxRate); // 金额(不含税)
        const taxAmount = includeTaxAmount / (1 + taxRate) * taxRate; // 税额
        const unitPrice = !currentIncomingQuantity ? 0 : includeTaxAmount / (1 + taxRate) / currentIncomingQuantity; // 单价不含税
        this.$set(row, 'includeTaxAmount', includeTaxAmount);
        this.$set(row, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));
        this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
        this.$set(row, 'unitPrice', Number((unitPrice || 0).toFixed(8)));
      }
    },
    // 填写不含税计算含税
    handleCalculation2({ item, row, event, subTable, rowIndex }) {
      // 2 如果填写规则是填写不含税计算含税：则在填写数量、税率、金额（不含税）后计算其他值；计算包括：
      // 金额含税=金额不含税乘以（1+税率）
      // 税额=金额不含税*税率
      // 单价不含税=金额不含税除以数量 如果数量为0 直接等于0
      if (item.prop === 'unitPrice') {
        const currentIncomingQuantity = Number(row.currentIncomingQuantity) || 0; // 数量
        const unitPrice = Number(row.unitPrice) || 0; // 单价（不含税）
        const taxRate = Number(row.taxRate) || 0; // 税率
        const excludeTaxAmount = currentIncomingQuantity * unitPrice;
        this.$set(row, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));

        const includeTaxAmount = excludeTaxAmount * (1 + taxRate); // 金额(含税)
        const taxAmount = excludeTaxAmount * taxRate; // 税额
        const includeUnitPrice = includeTaxAmount / currentIncomingQuantity;
        this.$set(row, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));
        this.$set(row, 'includeUnitPrice', !currentIncomingQuantity ? 0 : Number((includeUnitPrice || 0).toFixed(4)));
        this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
      }

      if (item.prop === 'excludeTaxAmount' && (row.unitPrice === '' || row.unitPrice === null)) {
        const currentIncomingQuantity = Number(row.currentIncomingQuantity) || 0; // 数量
        const excludeTaxAmount = Number(row.excludeTaxAmount) || 0; // 金额（含税）
        const unitPrice = excludeTaxAmount / currentIncomingQuantity;
        this.$set(row, 'unitPrice', !currentIncomingQuantity ? 0 : Number((unitPrice || 0).toFixed(8)));
      }

      if (item.prop === 'currentIncomingQuantity' || item.prop === 'taxRate' || item.prop === 'excludeTaxAmount') {
        const currentIncomingQuantity = Number(row.currentIncomingQuantity) || 0; // 数量
        const taxRate = Number(row.taxRate) || 0; // 税率
        const excludeTaxAmount = Number(row.excludeTaxAmount) || 0; // 金额(不含税)
        const includeTaxAmount = excludeTaxAmount * (1 + taxRate); // 金额(含税)
        const taxAmount = excludeTaxAmount * taxRate; // 税额
        const includeUnitPrice = includeTaxAmount / currentIncomingQuantity;
        this.$set(row, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));
        this.$set(row, 'includeUnitPrice', !currentIncomingQuantity ? 0 : Number((includeUnitPrice || 0).toFixed(4)));
        this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
      }
    },
    // 计算金额
    setAmount (tableName) {
      const data = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
      // 金额合计
      const totalAmount = data.reduce((a, b, c) => {
        return a += Number(b.excludeTaxAmount || 0);
      }, 0);
      this.$set(this.pageConfig.projectForm, 'totalAmount', Number(totalAmount.toFixed(2)));
      // 税额合计
      const totalTaxAmount = data.reduce((a, b, c) => {
        return a += Number(b.taxAmount || 0);
      }, 0);
      this.$set(this.pageConfig.projectForm, 'totalTaxAmount', Number(totalTaxAmount.toFixed(2)));
      // 价税合计
      const totalPriceTax = data.reduce((a, b, c) => {
        return a += Number(b.includeTaxAmount || 0);
      }, 0);
      this.$set(this.pageConfig.projectForm, 'totalPriceTax', Number(totalPriceTax.toFixed(2)));
      // 入库数量合计
      const totalIncomingQuantity = data.reduce((a, b, c) => {
        return a += Number(b.currentIncomingQuantity || 0);
      }, 0);
      this.$set(this.pageConfig.projectForm, 'totalIncomingQuantity', Number(totalIncomingQuantity.toFixed(4)));
    },
    handleCheckPassedQuantity (row) {
      row.checkPassedRate = (row.checkPassedQuantity / row.currentIncomingQuantity * 100).toFixed(2);
    },
    // 获取拟采购内容
    setMainCheckMaterials (tableName) {
      const mainMaterials = this.pageConfig.subTableConfig[tableName].tableData.slice(-5).map(v => v.materialName).join(',');
      this.$set(this.pageConfig.projectForm, 'mainMaterials', mainMaterials);
      this.setAmount(tableName);
    },
    // 保存
    handleSave (isProcess = false) {
      this.$refs.editForm.getValidateForm(() => {
        this.setMainCheckMaterials('warehouseIncomingDetail');
        const data = this.$clone(this.pageConfig.projectForm);
        const warehouseIncomingDetail = this.$refs.warehouseIncomingDetail[0].validateTableData();
        if (!warehouseIncomingDetail || warehouseIncomingDetail.length === 0) {
          // 存在未填写或个数错误的数据
          this.$message.error(`${this.$t('warIncoming.warehouseIncomingDetail')}${this.$t('tips.notFilledIn')}`);
          return;
        }
        if (!data.incomingTypeCode === '03') {
          data.rushBackIncomingId = '';
          data.rushBackIncomingDocNo = '';
        }
        // 税额数据字典
        if (!data.currencyValue) {
          const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'currencyCode');
          if (index >= 0) {
            const selectList = this.pageConfig.mainFormConfig.formList[index].selectList;
            const key = selectList.findIndex(v => v.dataCode === this.pageConfig.projectForm.currencyCode);
            if (key >= 0) {
              data.currencyValue = selectList[key].dataName;
            } else {
              data.currencyValue = '';
            }
          }
        }
        if (!data.incomingTypeValue) {
          const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'incomingTypeCode');
          if (index >= 0) {
            const selectList = this.pageConfig.mainFormConfig.formList[index].selectList;
            const key = selectList.findIndex(v => v.dataCode === this.pageConfig.projectForm.incomingTypeCode);
            if (key >= 0) {
              data.incomingTypeValue = selectList[key].dataName;
            } else {
              data.incomingTypeValue = '';
            }
          }
        }
        // 金额提示
        const mergeData = {};
        const amountOverTips = [];
        let againList = [];
        const priceList = [];
        for (const i in warehouseIncomingDetail) {
          const item = warehouseIncomingDetail[i];
          const value = Number((Number(item.excludeTaxAmount) + Number(item.taxAmount)).toFixed(2));
          if (value !== Number(item.includeTaxAmount)) {
            // 第x行、第x1行的金额（含税）≠金额（不含税）+税额，是否将不含税金额重新赋值 = 含税金额-税额？点击确定系统会自动赋值!客户确定后按上诉逻辑赋值不含税金额。
            const message = Number(i) + 1;
            amountOverTips.push(message);
            // return;
          }
            // 1.材料名称A/规格/单：供应商端填写发货单时的材料单价：【{keyValue}】，与我方下达送货通知单时的单价：【{keyValue}】 不一致，请注意核对。

            //  2.材料名称B/规格/单：供应商端填写发货单时的材料单价：【{keyValue}】，与我方下达送货通知单时的单价：425.00 不一致，请注意核对。
            // console.log(item.supplyOrderDeliverPrice, item.deliverNoticePrice, 'deliverNoticePrice');
          if (Number(item.supplyOrderDeliverPrice) && Number(item.deliverNoticePrice) && Number(item.supplyOrderDeliverPrice) !== Number(item.deliverNoticePrice)) {
             const supplyOrderDeliverPriceTips = this.$t('warIncoming.supplyOrderDeliverPriceTips').replace('{keyValue}', Number(item.supplyOrderDeliverPrice).toFixed(2));
             const includeUnitPriceTips = this.$t('warIncoming.includeUnitPriceTips').replace('{keyValue}', Number(item.deliverNoticePrice).toFixed(2));
             const message = `${item.materialName}/${item.standards}/${item.unit}: ${supplyOrderDeliverPriceTips}${includeUnitPriceTips}</p>`;
             priceList.push(message);
          }
          item.index = Number(i) + 1;
          item.rowKey = `${item.sourceType}-${item.preMainId}-${item.eId}-${item.varietiesId}`; // 分类
          if (!mergeData[item.rowKey]) {
            const arr = [];
            arr.push(item);
            this.$set(mergeData, item.rowKey, arr);
          } else {
            mergeData[item.rowKey].push(item);
          }
        }
        for (const i in warehouseIncomingDetail) {
          const item = warehouseIncomingDetail[i];
          const currentIncomingQuantity = mergeData[item.rowKey].reduce((a, b, c) => {
            return a += Number(b.currentIncomingQuantity);
          }, 0);
          const compareQuantity = Number((mergeData[item.rowKey][0].passedQuantity - mergeData[item.rowKey][0].alreadyIncomingQuantity).toFixed(4));
          if (currentIncomingQuantity > compareQuantity) {
            const indexAll = mergeData[item.rowKey].map(v => v.index).join(', ');
            // 行 本次入库数量相加 > (验收通过数量-已入库数量)，请重新填写
            againList.push(`${this.$t('tips.theFirst')} 【${indexAll}】 ${this.$t('warIncoming.fillInAgain')}`);
          }
        }
        // 第【{keyValue}】行的金额（含税）≠金额（不含税）+税额，是否将不含税金额重新赋值 = 含税金额-税额？点击确定系统会自动赋值！
        const message = this.$t('warIncoming.amountSaveTips').replace('{keyValue}', amountOverTips.join(',  '));
        againList = [...new Set(againList)];
        // 1 ====
        if (againList.length === 0 && amountOverTips.length === 0 && priceList.length === 0) {
          data.incomingDetails = warehouseIncomingDetail;
          this.handleSaveData(data, isProcess);
        }
        if (againList.length > 0 || amountOverTips.length > 0 || priceList.length > 0) {
          let msg = '';
          const msgTips = [];
          for (const item of againList) {
            msg += `${item}`;
          }
          if (againList.length > 0) {
             msgTips.push(`${msgTips.length + 1}:  ${msg}`);
          }
          if (amountOverTips.length > 0) {
            msgTips.push(`${msgTips.length + 1}:  ${message}`);
          }
          if (priceList.length > 0) {
            for (const item of priceList) {
               msgTips.push(`${msgTips.length + 1}: ${item}`);
            }
          }
          //  style='color:red;'
          const messageTips = `<p>${msgTips.join('</br>')}</p>`;
          this.$confirm(messageTips, this.$t('tips.tips'), {
            dangerouslyUseHTMLString: true,
            confirmButtonText: this.$t('button.determine'),
            cancelButtonText: this.$t('button.close'),
            type: 'warning'
          }).then(() => {
            if (amountOverTips.length > 0) {
              for (const item of warehouseIncomingDetail) {
                const excludeTaxAmount = Number(item.includeTaxAmount) - Number(item.taxAmount);
                this.$set(item, 'excludeTaxAmount', excludeTaxAmount);
              }
            }
            data.incomingDetails = warehouseIncomingDetail;
            this.handleSaveData(data, isProcess);
          });
        }
      });
    }
  }
};
</script>
<style scoped lang='scss'>
.warIncoming{
  /deep/ .el-tooltip__popper {
    width: 40% !important;
  }
}
.calculationTule {
  display: inline-block;
  margin-right: 10px;
}
/deep/ .changeVarieties{
  color: red !important;
  .el-input__inner{
    color: red !important;
  }
}
</style>
