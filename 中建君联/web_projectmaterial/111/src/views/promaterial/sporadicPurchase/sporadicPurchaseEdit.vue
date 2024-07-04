<!--
 * @Author: your name
 * @Date: 2020-07-30 10:37:41
 * @LastEditTime: 2022-10-11 16:13:30
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\sporadicPurchase\sporadicPurchaseEdit.vue
-->
<template>
  <div>
    <edit-page @editEvent="editEvent" v-loading="loading">
      <div slot="editPage">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" :type="type" :tableConfig="pageConfig.mainFormConfig"
          :projectForm="pageConfig.projectForm" :customRules="customRules" @editFormEvent="editFormEvent">
          <template slot="form-supplierName" slot-scope="{scope, item}">
            <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
              :title="$t(item.label)">
              <div class="slot-input">
                <el-input v-model.trim="scope[item.prop]" :size="item.size || 'small'" readonly>
                  <template slot="suffix" v-if="item.inputStatus !== 'disable' && pageDisabled">
                    <i v-if="scope[item.prop]" class="slot-close el-icon-circle-close"
                      @click="handleClearExpendContract(scope, item)"></i>
                    <i class="multiple-choice-icon iconfont icon-menu"
                      @click="handleSelectExpendContract(scope, item)"></i>
                  </template>
                </el-input>
              </div>
            </el-form-item>
          </template>
        </g-edit-form>
        <!-- 明细清单 -->
        <div v-if="pageConfigLoading">
          <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
            <g-edit-title :title="$t(`sporadicPurchase.${subTable.subTableName}`)"
              :titleTips="$t(`sporadicPurchase.${subTable.titleTips}`)">
              <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
              </g-button>
            </g-edit-title>
            <g-edit-pl-table :ref="subTable.subTableName" :type="type" :isSelection="subTable.isSelection"
              :tableConfig="subTable.tableList" :subTable='subTable' :delete.sync="deleteList[subTable.subTableName]"
              :getRowClassName="getRowClassName" :customRules="subTableCustomRules" @editTableEvent='editTableEvent'>
                <template slot="edit-table-purchaseUnitPriceCounts" slot-scope="{item, scope}">
                  <div v-if="scope.id" class="midFont set" @click="handleFrequencyInfo(scope)"> {{scope[item.prop]}}{{$t('tips.second')}}</div>
                  <div v-else class="midFont set" @click="handleFrequencyInfo(scope)">{{$t('button.info')}}</div>
                </template>
            </g-edit-pl-table>
          </div>
        </div>
      </div>
    </edit-page>
    <!-- 选择材料分类 -->
    <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
      <historyDetails slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogVisible"
        :selectList="varietiesIdList" promaterialTtype="sporadic" :projectId="pageConfig.projectForm.projectId"
        varietiesTitle="sporadicPurchase.masterPlan" @getData="getData" v-if="dialogVisible">
      </historyDetails>
    </g-dialog>

    <!-- 选择关联合同 -->
    <g-dialog v-if="dialogExpendContract" :dialogConfig="dialogConfigExpendContract"
      :isVisible.sync="dialogExpendContract">
      <expendRegister slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogExpendContract"
        :selectId="pageConfig.projectForm.supplierId" :projectId="pageConfig.projectForm.projectId"
        @getData="getExpendContractData" v-if="dialogExpendContract">
      </expendRegister>
    </g-dialog>
    <!-- 往期采购价 -->
    <g-dialog v-if="frequencyDialog" :dialogConfig="dialogConfigFrequency"
      :isVisible.sync="frequencyDialog">
      <previousPurchasePrice slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="frequencyDialog"
        :frequencyVarietiesId="frequencyVarietiesId" :projectId="pageConfig.projectForm.projectId"
        type="sporadicPurchase"
        @getData="getExpendContractData" v-if="frequencyDialog">
      </previousPurchasePrice>
    </g-dialog>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';

export default {
  name: 'sporadicPurchaseEdit',
  mixins: [editPage],
  data () {
    const purchaseCodeValid = (rule, value, callback) => {
      if (value) {
        const regular = /^[0-9a-zA-Z]*$/;
        if (!regular.test(value)) {
          callback(new Error(this.$t('tips.codeValid')));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const currentApplyQuantityValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error(`${this.$t('tips.pleaseEnter')}${this.$t('sporadicPurchase.currentApplyQuantity')}`));
      } else {
        callback();
      }
    };
    return {
      page: new Page(),
      projectForm: {
        applyDate: this.$utils.commonUtil.formatTime(new Date()),
        applyUserId: this.$utils.Auth.hasUserInfo().userId,
        applyUserName: this.$utils.Auth.hasUserInfo().userName,
        attachment: '',
        estimatePurchaseAmount: 0,
        projectId: '',
        purchaseContent: '',
        sporadicPurchaseReason: '',
        purchaseCode: '',
        costControlRuleCode: '',
        costControlRuleValue: '',
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      },
      // 选择材料
      dialogVisible: false,
      dialogConfig: {
        title: this.$t('sporadicPurchase.seleMaterialVarieties'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '90%',
        span: '0.75'
      },
      // 选择关联合同
      dialogExpendContract: false,
      dialogConfigExpendContract: {
        title: `${this.$t('tips.pleaseSelect')} ${this.$t('fConfig.partyBName')}`,
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      varietiesIdList: [],
      subTableCustomRules: {
        currentApplyQuantity: [{ required: true, validator: currentApplyQuantityValid, trigger: 'blur' }]
      },
      customRules: {
        purchaseCode: [{ required: false, validator: purchaseCodeValid, trigger: 'blur' }]
      },
      frequencyVarietiesId: '',
      frequencyDialog: false,
      dialogConfigFrequency: {
        title: this.$t('fConfig.frequency'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      orderSource: '',
      url: ''
    };
  },
  props: {
    processParmas: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    historyDetails (resolve) {
      require(['../compoent/historyDetails/historyDetails'], resolve);
    },
    expendRegister (resolve) {
      require(['../compoent/expendRegister/expendRegister'], resolve);
    },
    previousPurchasePrice (resolve) {
      require(['../compoent/previousPurchasePrice/previousPurchasePrice'], resolve);
    }
  },
  created() {
    this.type = this.$base64.decode(this.$route.params.type);
    this.pageConfig.projectForm.demandPlanId = this.$base64.decode(this.$route.params.orderSourceId);
    this.orderSource = this.$base64.decode(this.$route.params.orderSource);
    // console.log(this.pageConfig.projectForm.demandPlanId, 'this.demandPlanId');
    if (this.type === 'order') {
      let details = '';
      let sourceId = '';
      if (this.orderSource === 'monthPlan') {
        this.pageConfig.projectForm.demandPlanTypeCode = '01';
        this.pageConfig.projectForm.demandPlanTypeValue = this.$t('menu.monthPlan');
        this.url = 'monthPlan/getInfo';
        details = 'monthPlanDetails';
        sourceId = 'monthPlanId';
      }
      if (this.orderSource === 'weekPlan') {
        this.pageConfig.projectForm.demandPlanTypeCode = '02';
        this.pageConfig.projectForm.demandPlanTypeValue = this.$t('menu.weekPlan');
        this.url = 'weekPlan/getInfo';
        details = 'weekPlanDetails';
        sourceId = 'weekPlanId';
      }
      if (this.orderSource === 'tempPlan') {
        this.pageConfig.projectForm.demandPlanTypeValue = this.$t('menu.tempPlan');
        this.pageConfig.projectForm.demandPlanTypeCode = '03';
        this.url = 'tempPlan/getInfo';
        details = 'tempPlanDetails';
        sourceId = 'tempPlanId';
      }
      this.handleQuickOrder(details, sourceId);
    }
  },
  methods: {
    // 获取info数据
    async _getInfoData (id = 0) {
      await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
        this.displayFieldsAccordingToProjectControlType('purchaseSporadicPurchaseDetail');
      });
    },
   async handleQuickOrder(details, sourceId) {
      await this.$store.dispatch(this.url, {[sourceId]: this.pageConfig.projectForm.demandPlanId}).then(res => {
          if (res.status === 0) {
            this.$set(this.pageConfig.projectForm, 'demandPlanId', res.results.id);
            this.$set(this.pageConfig.projectForm, 'projectName', res.results.projectName);
            this.$set(this.pageConfig.projectForm, 'projectId', res.results.projectId);
            this.$set(this.pageConfig.projectForm, 'projectCode', res.results.projectCode);
            this.$set(this.pageConfig.projectForm, 'costControlRuleValue', res.results.costControlRuleValue);
            this.$set(this.pageConfig.projectForm, 'costControlRuleCode', res.results.costControlRuleCode);
            this.pageConfig.projectForm.id = '';
            this.$nextTick(() => {
              this.$refs.editForm.handleClearValidate();
            });
          }
        });
       await this._getTableDataDetaisl();
    },
    // 获取子表明细
    async _getTableDataDetaisl() {
      const params = {
        demandPlanId: this.pageConfig.projectForm.demandPlanId,
        projectId: this.pageConfig.projectForm.projectId,
        demandPlanTypeCode: this.pageConfig.projectForm.demandPlanTypeCode
      };
      await this.$store.dispatch('sporadicPurchase/getSporadic', params).then((res) => {
        if (res.status === 0) {
          if (!res.results.length) {
            return this.$message.error(this.$t('sporadicPurchase.supplyOrderOver'));
          }
          res.results.length && res.results.forEach(item => {
              for (const child of item.demandPlanSummaryDetailResultDtos) {
                this.$set(child, 'isNew', true);
              }

          });
          const demandPlanTypeCode = this.pageConfig.projectForm.demandPlanTypeCode;
          const tableData = res.results.length && res.results.filter(v => v.demandPlanTypeCode === demandPlanTypeCode)[0].demandPlanSummaryDetailResultDtos;
          this.getData(tableData);
        }
      });
    },
    // 税率变更后
    changeTaxRate() {
      const tableData = this.pageConfig.subTableConfig['purchaseSporadicPurchaseDetail'].tableData;
      const {estimateRate} = this.pageConfig.projectForm;
      for (const item of tableData) {
        if (!(typeof item.taxRate === 'number' && !isNaN(item.taxRate)) && (estimateRate === 0 || estimateRate)) {
          this.$set(item, 'taxRate', estimateRate);
          const taxRate = Number(item.taxRate) || 0; // 税率
          const currentApplyQuantity = Number(item.currentApplyQuantity) || 0; // 数量
          const estimateAmount = Number(item.estimateAmount) || 0; // 金额(含税)
          const excludeTaxAmount = estimateAmount / (1 + taxRate); // 金额(不含税)
          const taxAmount = estimateAmount / (1 + taxRate) * taxRate; // 税额
          const excludeUnitPrice = !currentApplyQuantity ? 0 : estimateAmount / (1 + taxRate) / currentApplyQuantity; // 单价不含税
          this.$set(item, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));
          this.$set(item, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
          this.$set(item, 'excludeUnitPrice', Number((excludeUnitPrice || 0).toFixed(8)));

        }
      }
    },
    // 校验项目
    handleCheckProject (params) {
      this.handleSelect(params, 'projectName', () => {
        if (params.selectList.length) {
          this.displayFieldsAccordingToProjectControlType('purchaseSporadicPurchaseDetail');
        }
      });
    },
    // 暂估单价如果大于策划单价，飘红
    checkRow (row) {
      const tableData = this.pageConfig.subTableConfig['purchaseSporadicPurchaseDetail'].tableData;
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
      const deleteNumber = Number(((row.demandPlanQuantity || 0) - (row.alreadyApplyQuantity || 0)).toFixed(4));
      if (totalQuantity > deleteNumber) {
        return true;
      }
      if ((row.estimateUnitPrice || 0) > (row.budgetUnitPrice || 0)) {
        return true;
      }
    },
    // 查看暂估单价次数
    handleFrequencyInfo(row) {
      if (!row.varietiesId) {
        // 当前明细不能查看往期采购价
        this.$message.error(this.$t('tips.frequencyInfoTips'));
        return;
      }
      this.frequencyVarietiesId = row.varietiesId;
      this.frequencyDialog = true;
    },
    // 选择明细
    sysHandleSelectDetail (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      const tableData = this.pageConfig.subTableConfig[tableName].tableData;
      this.varietiesIdList = tableData;
      this.dialogVisible = true;
    },
    // 获取选中的数据
    getData (arr) {
      const data = [];
      for (const item of arr) {
        if (item.isNew) {
          const demandPlanQuantity = Number(item.currentApplyQuantity) || 0; // 数量
          const currentApplyQuantity = Number(item.currentApplyQuantity) - Number(item.applyTotalQuantity) - Number(item.supplyOutboundQuantity) || 0; // 数量
          const estimateUnitPrice = Number(item.budgetUnitPrice) || 0; // 单价（含税）
          const estimateAmount = Number((currentApplyQuantity * estimateUnitPrice).toFixed(2));
          const excludeUnitPrice = !currentApplyQuantity ? 0 : estimateAmount / (1 + 0) / currentApplyQuantity; // 单价不含税
          const excludeTaxAmount = estimateAmount / (1 + 0); // 金额(不含税)
          const taxRate = this.pageConfig.projectForm.estimateRate || 0;
          const taxAmount = estimateAmount / (1 + taxRate) * taxRate; // 税额 // 税额
          data.push(
            {
              varietiesName: item.varietiesName,
              varietiesCode: item.varietiesCode,
              standards: item.standards,
              unit: item.unit,
              alreadyApplyQuantity: item.applyTotalQuantity + item.supplyOutboundQuantity, // 已申请数量
              createTime: this.$utils.commonUtil.formatTime(new Date()),
              demandPlanQuantity, // 需求数量
              currentApplyQuantity: currentApplyQuantity > 0 ? currentApplyQuantity : 0, // 本次申请数量
              demandPlanCode: item.docNo,
              demandPlanId: item.demandPlanId,
              demandPlanTypeCode: item.demandPlanTypeCode,
              demandPlanTypeValue: item.demandPlanTypeValue,
              eId: item.id,
              demandRemarks: item.remarks,
              remarks: '',
              requiredDate: item.requiredDate,
              usePlaceId: item.usePlaceId,
              usePlaceName: item.usePlaceName,
              varietiesId: item.varietiesId,
              estimateUnitPrice,
              estimateAmount,
              brand: item.brand,
              models: item.models,
              taxRate,
              excludeUnitPrice,
              excludeTaxAmount,
              taxAmount,
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
              // 可修改名称、规格、单位
              executeStandards: item.executeStandards,
              executeUnit: item.executeUnit,
              executeVarietiesName: item.executeVarietiesName,
              // 申报料单位、对应分包合同（合同id）
              projectUnitId: item.projectUnitId,
              projectUnitName: item.projectUnitName,
              expendContractName: item.expendContractName,
              expendContractId: item.expendContractId,
              expendContractCode: item.expendContractCode
            }
          );
        }
      }
      const tableDataList = this.pageConfig.subTableConfig['purchaseSporadicPurchaseDetail'].tableData;
      const tableData = tableDataList.concat(data);
      this.$set(this.pageConfig.subTableConfig['purchaseSporadicPurchaseDetail'], 'tableData', tableData);
      this.deletTableCallback('purchaseSporadicPurchaseDetail');
      this.dialogVisible = false;
    },
    // 计算
    // handleCalculation ({ item, row, event, subTable, rowIndex }) {
    //   if (item.prop === 'estimateAmount') {
    //     const data = this.$clone(this.pageConfig.subTableConfig[subTable.subTableName].tableData);
    //     const estimatePurchaseAmount = data.reduce((a, b, c) => {
    //       return a += (b.estimateAmount || 0);
    //     }, 0);
    //     this.$set(this.pageConfig.projectForm, 'estimatePurchaseAmount', Number(estimatePurchaseAmount.toFixed(2)));
    //   } else {
    //     row.estimateAmount = (row.currentApplyQuantity || 0) * (row.estimateUnitPrice || 0);
    //     const data = this.$clone(this.pageConfig.subTableConfig[subTable.subTableName].tableData);
    //     const estimatePurchaseAmount = data.reduce((a, b, c) => {
    //       return a += b.estimateAmount || 0;
    //     }, 0);
    //     this.$set(this.pageConfig.projectForm, 'estimatePurchaseAmount', Number(estimatePurchaseAmount.toFixed(2)));
    //   }
    // },
    // 计算
    handleCalculation ({ item, row, event, subTable, rowIndex }) {
      this.handleCalculation1({ item, row, event, subTable, rowIndex });
      this.deletTableCallback(subTable.subTableName);
    },
    // 填写含税计算不含税
    handleCalculation1 ({ item, row, event, subTable, rowIndex }) {
      // 1，如果填写规则是填写含税计算不含税：则在填写数量、税率、金额（含税）后计算其他值；计算包括
      // 金额不含税=金额含税除以（1+税率）
      // 税额=金额含税/(1+税率) * 税率
      // 单价不含税=金额含税/(1+税率)/数量 如果数量为0 直接等于0
      if (item.prop === 'estimateUnitPrice') {
        const currentApplyQuantity = Number(row.currentApplyQuantity) || 0; // 数量
        const estimateUnitPrice = Number(row.estimateUnitPrice) || 0; // 单价（含税）
        const estimateAmount = currentApplyQuantity * estimateUnitPrice;
        this.$set(row, 'estimateAmount', Number((estimateAmount || 0).toFixed(2)));

        const taxRate = Number(row.taxRate) || 0; // 税率
        const excludeTaxAmount = estimateAmount / (1 + taxRate); // 金额(不含税)
        const taxAmount = estimateAmount / (1 + taxRate) * taxRate; // 税额
        const excludeUnitPrice = !currentApplyQuantity ? 0 : estimateAmount / (1 + taxRate) / currentApplyQuantity; // 单价不含税
        this.$set(row, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));
        this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
        this.$set(row, 'excludeUnitPrice', Number((excludeUnitPrice || 0).toFixed(8)));
      }
      if (item.prop === 'estimateAmount' && (row.estimateUnitPrice === '' || row.estimateUnitPrice === null)) {
        const currentApplyQuantity = Number(row.currentApplyQuantity) || 0; // 数量
        const estimateAmount = Number(row.estimateAmount) || 0; // 金额（含税）
        const estimateUnitPrice = estimateAmount / currentApplyQuantity;
        this.$set(row, 'estimateUnitPrice', !currentApplyQuantity ? 0 : Number((estimateUnitPrice || 0).toFixed(4)));
      }
      if (item.prop === 'currentApplyQuantity' || item.prop === 'taxRate') {
        const currentApplyQuantity = Number(row.currentApplyQuantity) || 0; // 数量
        const estimateUnitPrice = Number(row.estimateUnitPrice) || 0; // 单价（含税）
        const taxRate = Number(row.taxRate) || 0; // 税率
        const estimateAmount = currentApplyQuantity * estimateUnitPrice; // 金额(含税)
        const excludeTaxAmount = estimateAmount / (1 + taxRate); // 金额(不含税)
        const taxAmount = estimateAmount / (1 + taxRate) * taxRate; // 税额
        const excludeUnitPrice = !currentApplyQuantity ? 0 : estimateAmount / (1 + taxRate) / currentApplyQuantity; // 单价不含税
        this.$set(row, 'estimateAmount', Number((estimateAmount || 0).toFixed(2)));
        this.$set(row, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));
        this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
        this.$set(row, 'excludeUnitPrice', Number((excludeUnitPrice || 0).toFixed(8)));
      }
      if (item.prop === 'estimateAmount' && row.estimateUnitPrice >= 0) {
        const currentApplyQuantity = Number(row.currentApplyQuantity) || 0; // 数量
        const taxRate = Number(row.taxRate) || 0; // 税率
        const estimateAmount = Number(row.estimateAmount) || 0; // 金额(含税)
        const excludeTaxAmount = estimateAmount / (1 + taxRate); // 金额(不含税)
        const taxAmount = estimateAmount / (1 + taxRate) * taxRate; // 税额
        const excludeUnitPrice = !currentApplyQuantity ? 0 : estimateAmount / (1 + taxRate) / currentApplyQuantity; // 单价不含税
        this.$set(row, 'estimateAmount', Number((estimateAmount || 0).toFixed(2)));
        this.$set(row, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));
        this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
        this.$set(row, 'excludeUnitPrice', Number((excludeUnitPrice || 0).toFixed(8)));
      }
    },
    // 获取前5行数据名称
    // setSubTable (tableName, arr) {
    //   const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
    //   const selectTableList = [];
    //   if (!tableData.length || !arr.length) {
    //     this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', arr);
    //     this.setPurchaseContent(tableName);
    //   }
    //   if (tableData.length) {
    //     for (const item of tableData) {
    //       for (const val of arr) {
    //         if (`${item.demandPlanTypeCode}-${item.demandPlanId}-${item.varietiesId}` === `${val.demandPlanTypeCode}-${val.demandPlanId}-${val.varietiesId}`) {
    //           selectTableList.push(item);
    //         }
    //       }
    //     }
    //     for (const item of arr) {
    //       const index = tableData.findIndex(v => `${v.demandPlanTypeCode}-${v.demandPlanId}-${v.varietiesId}` === `${item.demandPlanTypeCode}-${item.demandPlanId}-${item.varietiesId}`);
    //       if (index < 0) {
    //         selectTableList.push(item);
    //       }
    //     }
    //     this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', selectTableList);
    //     this.setPurchaseContent(tableName);
    //   }
    //   this.dialogVisible = false;
    // },
    // 用户不填订单名称时自动赋值明细前5行的品种名称
    setPurchaseContent (tableName) {
      const tableData = this.pageConfig.subTableConfig[tableName].tableData;
      this.$set(this.pageConfig.projectForm, 'purchaseContent', tableData.slice(-5).map(v => v.varietiesName).join(','));
    },
    // 批量删除后计算
    deletTableCallback (tableName) {
      const data = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
      const estimatePurchaseAmount = data.reduce((a, b, c) => {
        return a += b.estimateAmount || 0;
      }, 0);
      this.$set(this.pageConfig.projectForm, 'estimatePurchaseAmount', Number(estimatePurchaseAmount.toFixed(2)));
      this.setPurchaseContent(tableName);
    },
    // 保存
    handleSave (isProcess = false) {
      this.$refs.editForm.getValidateForm(async () => {
        const data = this.$clone(this.pageConfig.projectForm);
        const purchaseSporadicPurchaseDetail = this.$refs.purchaseSporadicPurchaseDetail[0].validateTableData();
        if (!purchaseSporadicPurchaseDetail || purchaseSporadicPurchaseDetail.length === 0) {
          // 存在未填写或个数错误的数据
          this.$message.error(`${this.$t('sporadicPurchase.purchaseSporadicPurchaseDetail')}${this.$t('tips.notFilledIn')}`);
          return;
        }
        // 是否存在重复明细
        // const selectTableList = [];
        // for (const i in purchaseSporadicPurchaseDetail) {
        //   const item = purchaseSporadicPurchaseDetail[i];
        //   item.rowkey = `${item.demandPlanCode}-${item.varietiesName}-${item.standards}-${item.models}-${item.brand}-${item.unit}`;
        //   const index = selectTableList.findIndex(v => item.rowkey === v.rowkey);
        //   if (index >= 0) {
        //     this.$message.error(`${this.$t('tips.theFirst')} ${Number(i) + 1} ${this.$t('tips.duplicateDetails')}`);
        //     return;
        //   } else {
        //     selectTableList.push(item);
        //   }
        // }
        const quotaRes = await this.$store.dispatch('sporadicPurchaseGuration/getProjectQuotaInfo', { projectId: data.projectId }).then();
        if (quotaRes.results !== null && quotaRes.results < data.estimatePurchaseAmount) {
          // 本单总采购金额超过设置的最大额度：{keyValue}元，不能保存！
          const msg = this.$t('sporadicPurchase.saveTips').replace('{keyValue}', Number(quotaRes.results).toFixed(2));
          this.$message.error(msg);
          return;
        }
        data.sporadicPurchaseDetails = purchaseSporadicPurchaseDetail;
        this.handleSaveData(data, isProcess);
      });
    },
    // 清除关联合同
    handleClearExpendContract (row, item) {
      this.$set(this.pageConfig.projectForm, 'supplierName', '');
      this.$set(this.pageConfig.projectForm, 'supplierId', '');
    },
    // 打开关联合同弹窗
    handleSelectExpendContract (row, item) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      this.dialogExpendContract = true;
    },
    // 选中的关联合同数据
    getExpendContractData (arr) {
      const row = arr[0];
      this.$set(this.pageConfig.projectForm, 'supplierName', row.partyBUnitName || '');
      this.$set(this.pageConfig.projectForm, 'supplierId', row.id || '');
      this.dialogExpendContract = false;
    }
  }
};
</script>
