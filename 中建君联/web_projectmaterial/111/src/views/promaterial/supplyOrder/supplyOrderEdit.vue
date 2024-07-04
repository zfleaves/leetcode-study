<!--
 * @Author: your name
 * @Date: 2020-07-30 10:34:00
 * @LastEditTime: 2022-12-09 16:41:46
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\supplyOrder\supplyOrderEdit.vue
-->
<template>
  <div>
    <edit-page @editEvent="editEvent" v-loading="loading">
      <div slot="editPage">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" :type="type" :tableConfig="pageConfig.mainFormConfig"
          :projectForm="pageConfig.projectForm" :customRules="customRules" @editFormEvent="editFormEvent">
          <template slot="form-expendContractName" slot-scope="{scope, item}">
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
          <!-- 选择关联 -->
          <template slot="form-inquiryDocNo" slot-scope="{ scope, item }">
            <el-form-item
              :label="$t(item.label)"
              :prop="item.prop"
              :class="item.label.length > 7 && 'maxLabel'"
              :title="$t(item.label)"
            >
              <div class="slot-input">
                <el-input
                  v-model.trim="scope[item.prop]"
                  :size="item.size || 'small'"
                  readonly
                >
                  <template slot="suffix" v-if="item.inputStatus !== 'disable' && pageDisabled">
                    <i v-if="scope[item.prop]" class="slot-close el-icon-circle-close"
                      @click="handleClearCalibration(item)"></i>
                    <i class="multiple-choice-icon iconfont icon-menu"
                      @click="handleSelectCalibration(item)"></i>
                  </template>
                </el-input>
              </div>
            </el-form-item>
          </template>
          <!-- 收货人 -->
          <template slot="form-receiveUserName" slot-scope="{scope, item}">
            <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
              :title="$t(item.label)">
              <div class="slot-input">
                <el-input v-model.trim="scope[item.prop]" :size="item.size || 'small'" readonly>
                  <template slot="suffix" v-if="item.inputStatus !== 'disable' && pageDisabled">
                    <i v-if="scope[item.prop]" class="slot-close el-icon-circle-close"
                      @click="handleClearReceiveUserName(scope, item)"></i>
                    <i class="multiple-choice-icon iconfont icon-menu"
                      @click="handleSelectReceiveUserName(scope, item)"></i>
                  </template>
                </el-input>
                <!-- 如需添加或者修改选项值，请前往【项目规划云-项目负责人设置】模块操作，如无权限，请联系贵公司管理员。 -->
                <el-tooltip placement="top">
                  <div slot="content" style="line-height: 24px;">
                    <div>
                      {{$t('tips.applicationTeamTips1')}}
                    </div>
                  </div>
                  <span class="tips-item"><i class="el-icon-question"></i></span>
                </el-tooltip>
              </div>
            </el-form-item>
          </template>
        </g-edit-form>
        <!-- 明细清单 -->
        <div v-if="pageConfigLoading">
          <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
            <g-edit-title :title="$t(`supplyOrder.${subTable.subTableName}`)"
              :titleTips="$t(`supplyOrder.${subTable.titleTips}`)">
              <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
                <template slot-scope="{parameter}" slot='button-handleGetContractPrice'>
                  <el-button
                    size="small"
                    type="primary"
                    class="more"
                    :plain="false"
                    :disabled="parameter.disabled"
                    icon="el-icon-refresh"
                    v-fast-click
                    @click="handleGetContractPrice(parameter.subTableCode)">
                    {{$t('button.getContractPrice')}}
                  </el-button>
                  <el-tooltip class="item" effect="dark" placement="top-start" style="margin: 0 8px;">
                    <div slot="content" style="line-height: 24px;">
                      {{$t('tips.getContractPriceTips')}}
                    </div>
                    <span class="tips-item"><i class="el-icon-question"></i></span>
                  </el-tooltip>
                </template>
              </g-button>
            </g-edit-title>
            <g-edit-table :ref="subTable.subTableName" :type="type" :isSelection="subTable.isSelection"
              :tableConfig="subTable.tableList" :subTable='subTable' :delete.sync="deleteList[subTable.subTableName]"
              :customRules="subTableCustomRules" :getRowClassName="getRowClassName" @editTableEvent='editTableEvent'>
                <template slot="edit-table-unitPrice" slot-scope="{item, scope}">
                  <el-number v-if="item.inputStatus !== 'disable'" controls-position="right" size="small" :class="changeCheckPrice(scope)"
                    :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                    :precision="Number(item.precision)" v-model.trim="scope[item.prop]" :placeholder="item.placeholder"
                    @change="handleCalculation({item, row: scope, event: scope.unitPrice, subTable, rowIndex: scope.$index})">
                  </el-number>
                  <div class="ellipsis" :class="changeCheckPrice(scope)" v-else>{{scope[item.prop]}}</div>
                </template>
                <template slot="edit-table-purchaseUnitPriceCounts" slot-scope="{item, scope}">
                  <div v-if="scope.id" class="midFont set" @click="handleFrequencyInfo(scope)"> {{scope[item.prop]}}{{$t('tips.second')}}</div>
                  <div v-else class="midFont set" @click="handleFrequencyInfo(scope)">{{$t('button.info')}}</div>
                </template>
            </g-edit-table>
          </div>
        </div>
      </div>
    </edit-page>
    <!-- 选择材料分类 -->
    <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
      <newSupplyOrderDetail slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogVisible"
        :selectList="varietiesIdList" promaterialTtype="order" :projectId="pageConfig.projectForm.projectId"
        :costControlRuleCode="pageConfig.projectForm.costControlRuleCode"
        :contractId="pageConfig.projectForm.expendContractId" varietiesTitle="supplyOrder.masterPlan" @getData="getData"
        v-if="dialogVisible">
      </newSupplyOrderDetail>
    </g-dialog>
    <!-- 选择收货人 -->
    <g-dialog v-if="dialogReceiveUserName" :dialogConfig="dialogConfigReceiveUserName"
      :isVisible.sync="dialogReceiveUserName">
      <receiveUser slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogReceiveUserName"
        :receiveUserId="pageConfig.projectForm.receiveUserId" :projectId="pageConfig.projectForm.projectId"
        @getData="getReceiveUserData" v-if="dialogReceiveUserName">
      </receiveUser>
    </g-dialog>
    <!-- 选择关联合同 -->
    <g-dialog v-if="dialogExpendContract" :dialogConfig="dialogConfigExpendContract"
      :isVisible.sync="dialogExpendContract">
      <expendRegister slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogExpendContract"
        :selectId="pageConfig.projectForm.expendContractId" :projectId="pageConfig.projectForm.projectId"
        @getData="getExpendContractData" v-if="dialogExpendContract">
      </expendRegister>
    </g-dialog>
    <!-- 往期采购价 -->
    <g-dialog v-if="frequencyDialog" :dialogConfig="dialogConfigFrequency"
      :isVisible.sync="frequencyDialog">
      <previousPurchasePrice slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="frequencyDialog"
        :frequencyVarietiesId="frequencyVarietiesId" :projectId="pageConfig.projectForm.projectId"
        type="supplyOrder"
        @getData="getExpendContractData" v-if="frequencyDialog">
      </previousPurchasePrice>
    </g-dialog>
    <!-- 定标 -->
    <g-dialog v-if="dialogCalibration" :dialogConfig="calibrationDialogConfig" :isVisible.sync="dialogCalibration">
      <calibration slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogCalibration"
        :selectInfo="calibrationSelectInfo" promaterialTtype="order"
        :projectId="pageConfig.projectForm.projectId"
        @getData="getCalibration" v-if="dialogCalibration">
      </calibration>
    </g-dialog>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';

export default {
  name: 'supplyOrderEdit',
  mixins: [editPage],
  data () {
    const contactMobileValid = (rule, value, callback) => {
      if (!value) {
        // 请输入业务联系人手机号
        callback(new Error(this.$t('supplyOrder.contactMobileTips')));
      } else {
        const regular = /[0-9]/;
        if (!regular.test(value)) {
          // 请输入正确的手机号码
          callback(new Error(this.$t('supplyOrder.contactMobileRuleTips')));
        } else {
          callback();
        }
      }
    };
    const currentApplyQuantityValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('supplyOrder.currentApplyQuantityTips')));
      } else {
        callback();
      }
    };
    return {
      page: new Page(),
      projectForm: {
        address: '',
        area: '',
        arrivalDate: '',
        attachment: '',
        city: '',
        contactMobile: '',
        contactName: '',
        continent: '',
        country: '',
        expendContractId: '',
        expendContractName: '',
        invoiceCode: '',
        invoiceValue: '',
        orderAmount: 0,
        orderName: '',
        orderTypeCode: '01',
        orderTypeValue: '',
        paymentProvision: '',
        projectId: '',
        province: '',
        receiveUserName: '',
        receiveUserContactMobile: '',
        releaseDate: this.$utils.commonUtil.formatTime(new Date()),
        releaseUserName: this.$utils.Auth.hasUserInfo().userName,
        releaseUserId: this.$utils.Auth.hasUserInfo().userId,
        remarks: '',
        supplierId: '',
        supplierName: '',
        modelType: '01',
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
        title: this.$t('supplyOrder.seleMaterialVarieties'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '95%',
        span: '0.8'
      },
      // 选择关联合同
      dialogExpendContract: false,
      dialogConfigExpendContract: {
        title: this.$t('supplyOrder.seleExpendContract'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '85%',
        span: '0.85'
      },
      varietiesIdList: [],
      back: '',
      subTableRow: {},
      customRules: {
        contactMobile: [{ required: true, validator: contactMobileValid, trigger: 'blur' }]
      },
      subTableCustomRules: {
        currentApplyQuantity: [{ required: true, validator: currentApplyQuantityValid, trigger: 'blur' }]
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
      url: '',
      // 选择收货人
      dialogReceiveUserName: false,
      dialogConfigReceiveUserName: {
        title: this.$t('supplyOrder.seleDutyPerson'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '85%',
        span: '0.85'
      },
      // 定标
      calibrationConfig: {},
      dialogCalibration: false,
      calibrationDialogConfig: {
          title: `${this.$t('tips.pleaseSelect')}${this.$t('supplyOrder.inquiryDocNo')}`,
          appendBody: false,
          center: true,
          top: '80px',
          width: '80%',
          span: '0.7'
      },
      calibrationSelectInfo: {}
    };
  },
  props: {
    processParmas: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    newSupplyOrderDetail (resolve) {
      require(['../compoent/newSupplyOrderDetail/newSupplyOrderDetail.vue'], resolve);
    },
    expendRegister (resolve) {
      require(['../compoent/expendRegister/expendRegister'], resolve);
    },
    receiveUser (resolve) {
      require(['../compoent/receiveUser/receiveUser.vue'], resolve);
    },
    previousPurchasePrice (resolve) {
      require(['../compoent/previousPurchasePrice/previousPurchasePrice'], resolve);
    },
    calibration(resolve) {
      require(['../compoent/calibration/calibration.vue'], resolve);
    }
  },
  created() {
    this.type = this.$base64.decode(this.$route.params.type);
    this.pageConfig.projectForm.demandPlanId = this.$base64.decode(this.$route.params.orderSourceId);
    this.orderSource = this.$base64.decode(this.$route.params.orderSource);
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
    setPageDisabed () {
      this.pageDisabled = false;
    },
    // 获取info数据
    async _getInfoData (id = 0) {
      await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
        this.displayFieldsAccordingToProjectControlType('purchaseSupplyOrderDetail');
        // 已签合同供货订单
        if (this.pageConfig.projectForm.orderTypeCode === '01') {
          // 关联合同
          const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'expendContractName');
          if (index >= 0) {
            this.$set(this.pageConfig.mainFormConfig.formList[index], 'inputStatus', 'edit');
          }
          // 供应商
          // const key = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'supplierName');
          // if (index >= 0) {
          //     this.$set(this.pageConfig.mainFormConfig.formList[key], 'inputStatus', 'disable');
          // }
          // 计税方式、发票类型、税率、付款条款带入，不可修改。
          const index2 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'taxationCode');
          if (index >= 0) {
            this.$set(this.pageConfig.mainFormConfig.formList[index2], 'inputStatus', 'disable');
          }
          const index3 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'invoiceCode');
          if (index >= 0) {
            this.$set(this.pageConfig.mainFormConfig.formList[index3], 'inputStatus', 'disable');
          }
          const index4 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'taxRate');
          if (index >= 0) {
            this.$set(this.pageConfig.mainFormConfig.formList[index4], 'inputStatus', 'disable');
          }
          const index5 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'currencyCode');
          if (index >= 0) {
            this.$set(this.pageConfig.mainFormConfig.formList[index5], 'inputStatus', 'disable');
          }
          const index6 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'paymentProvision');
          if (index >= 0) {
            this.$set(this.pageConfig.mainFormConfig.formList[index6], 'inputStatus', 'disable');
          }
          return;
        }
        // 不签合同供货订单
        if (this.pageConfig.projectForm.orderTypeCode === '02') {
          const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'expendContractName');
          if (index >= 0) {
            this.$set(this.pageConfig.mainFormConfig.formList[index], 'inputStatus', 'disable');
          }
          // const key = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'supplierName');
          // if (index >= 0) {
          //     this.$set(this.pageConfig.mainFormConfig.formList[key], 'inputStatus', 'edit');
          // }
          const index2 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'taxationCode');
          if (index >= 0) {
            this.$set(this.pageConfig.mainFormConfig.formList[index2], 'inputStatus', 'edit');
          }
          const index3 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'invoiceCode');
          if (index >= 0) {
            this.$set(this.pageConfig.mainFormConfig.formList[index3], 'inputStatus', 'edit');
          }
          const index4 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'taxRate');
          if (index >= 0) {
            this.$set(this.pageConfig.mainFormConfig.formList[index4], 'inputStatus', 'edit');
          }
          const index5 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'currencyCode');
          if (index >= 0) {
            this.$set(this.pageConfig.mainFormConfig.formList[index5], 'inputStatus', 'edit');
          }
          const index6 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'paymentProvision');
          if (index >= 0) {
            this.$set(this.pageConfig.mainFormConfig.formList[index6], 'inputStatus', 'edit');
          }
        }
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
      await this.$store.dispatch('supplyOrder/getDemandSupplyOrder', params).then((res) => {
          if (res.status === 0) {
            if (!res.results.length) {
              return this.$message.error(this.$t('supplyOrder.supplyOrderOver'));
            }
            res.results.length && res.results.forEach(item => {
              item.demandPlanSummaryDetailResultDtos.forEach(val => {
                val.alreadyApplyQuantity = val.applyTotalQuantity;
                this.$set(val, 'isNew', true);
              });
          });
          const demandPlanTypeCode = this.pageConfig.projectForm.demandPlanTypeCode;
          const tableData = res.results.length && res.results.filter(v => v.demandPlanTypeCode === demandPlanTypeCode)[0].demandPlanSummaryDetailResultDtos;
          this.getData(tableData);
        }
      });
    },
    //  如果用户填写的暂定单价 和 合同单价不一致，则将暂定单价这个值飘红。
    changeCheckPrice(row) {
      const contractUnitPrice = row.contractUnitPrice || 0;
      const unitPrice = row.unitPrice || 0;
      if (contractUnitPrice !== unitPrice) {
        return 'changeVarieties';
      }
    },
    // 暂估单价如果大于策划单价，飘红
    checkRow (row) {
      const tableData = this.pageConfig.subTableConfig['purchaseSupplyOrderDetail'].tableData;
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
      if ((row.unitPrice || 0) > (row.budgetUnitPrice || 0)) {
        return true;
      }
    },
    // 校验项目
    handleCheckProject (params) {
      this.handleSelect(params, 'projectName', () => {
        if (params.selectList.length) {
          this.displayFieldsAccordingToProjectControlType('purchaseSupplyOrderDetail');
        }
      });
    },
    // 清除关联合同
    handleClearExpendContract (row, item) {
      this.$set(this.pageConfig.projectForm, 'expendContractName', '');
      this.$set(this.pageConfig.projectForm, 'expendContractId', '');
      this.$set(this.pageConfig.projectForm, 'taxationCode', '');
      this.$set(this.pageConfig.projectForm, 'taxationValue', '');
      this.$set(this.pageConfig.projectForm, 'invoiceCode', '');
      this.$set(this.pageConfig.projectForm, 'invoiceValue', '');
      this.$set(this.pageConfig.projectForm, 'taxRate', '');
      this.$set(this.pageConfig.projectForm, 'paymentProvision', '');
      this.$set(this.pageConfig.projectForm, 'currencyCode', '');
      this.$set(this.pageConfig.projectForm, 'currencyValue', '');
      // 清除收货人、收货人电话
      this.$set(this.pageConfig.projectForm, 'receiveUserId', '');
      this.$set(this.pageConfig.projectForm, 'receiveUserName', '');
      this.$set(this.pageConfig.projectForm, 'receiveUserContactMobile', '');
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
      this.$set(this.pageConfig.projectForm, 'expendContractName', row.contractName || '');
      this.$set(this.pageConfig.projectForm, 'expendContractId', row.id || '');
      this.$set(this.pageConfig.projectForm, 'supplierName', row.partyBUnitName || '');
      this.$set(this.pageConfig.projectForm, 'supplierId', row.partyBUnitId || '');
      this.$set(this.pageConfig.projectForm, 'taxationCode', row.taxationCode || '');
      this.$set(this.pageConfig.projectForm, 'taxationValue', row.taxationValue || '');
      this.$set(this.pageConfig.projectForm, 'invoiceCode', row.invoiceCode || '');
      this.$set(this.pageConfig.projectForm, 'invoiceValue', row.invoiceValue || '');
      this.$set(this.pageConfig.projectForm, 'taxRate', row.taxRate || '');
      this.$set(this.pageConfig.projectForm, 'paymentProvision', row.paymentProvision || '');
      this.$set(this.pageConfig.projectForm, 'currencyCode', row.currencyCode || '');
      this.$set(this.pageConfig.projectForm, 'currencyValue', row.currencyValue || '');
      this.$set(this.pageConfig.projectForm, 'contactName', row.agentUserName || '');
      this.$set(this.pageConfig.projectForm, 'contactMobile', row.agentUserMobile || '');
      this.dialogExpendContract = false;
    },
    // 打开收货人弹窗
    handleSelectReceiveUserName (row, item) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      this.dialogReceiveUserName = true;
    },
    // 选中的收货人数据
    getReceiveUserData (arr) {
      const row = arr[0];
      this.$set(this.pageConfig.projectForm, 'receiveUserId', row ? row.id : '');
      this.$set(this.pageConfig.projectForm, 'receiveUserName', row ? row.dutyPersonName : '');
      this.$set(this.pageConfig.projectForm, 'receiveUserContactMobile', row ? row.dutyPersonMobile : '');
      this.dialogReceiveUserName = false;
    },
    handleClearReceiveUserName () {
      this.$set(this.pageConfig.projectForm, 'receiveUserId', '');
      this.$set(this.pageConfig.projectForm, 'receiveUserName', '');
      this.$set(this.pageConfig.projectForm, 'receiveUserContactMobile', '');
    },
    // ============== 选择定标编号 ================
    handleClearCalibration(item) {
      const params = {
          paramsConfig: item,
          selectList: []
      };
      this.handleSelect(params, 'inquiryDocNo');
    },
    handleSelectCalibration(item) {
      this.calibrationConfig = item;
      if (this.pageConfig.projectForm.inquiryDocNo) {
        this.calibrationSelectInfo = {
          inquiryDocNo: this.pageConfig.projectForm.inquiryDocNo,
          id: this.pageConfig.projectForm.inquiryId,
          inquirySourceType: this.pageConfig.projectForm.inquirySourceType,
          inquiryTitle: this.pageConfig.projectForm.inquiryTitle
        };
      } else {
        this.calibrationSelectInfo = {};
      }
      this.dialogCalibration = true;
    },
    // 获取选中的招标
    getCalibration(arr) {
      const params = {
          paramsConfig: this.calibrationConfig,
          selectList: arr
      };
      this.handleSelect(params, 'inquiryDocNo', () => {
        this.dialogCalibration = false;
      });
    },
    // 选择项目
    async handleSelectProject(params) {
      if (params.paramsConfig.check) {
        this.handleCheckProject(params);
        const leaderValidParams = {
          belongPageCode: '01',
          projectId: params.selectList[0] ? params.selectList[0].id : ''
        };
        await this.$store.dispatch('supplyOrder/getProjectLeaderValidInfo', leaderValidParams).then((res) => {
          if (res.status === 0) {
            if (res.results.length) {
              this.$set(this.pageConfig.projectForm, 'receiveUserId', res.results[0].id);
              this.$set(this.pageConfig.projectForm, 'receiveUserName', res.results[0].dutyPersonName);
              this.$set(this.pageConfig.projectForm, 'receiveUserContactMobile', res.results[0].dutyPersonMobile);
            }
          }
        });
      }
    },
    // 选择订单类型后
    handleRelationExpendContract () {
      // 已签合同供货订单
      if (this.pageConfig.projectForm.orderTypeCode === '01') {
        // 关联合同
        const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'expendContractName');
        if (index >= 0) {
          this.$set(this.pageConfig.mainFormConfig.formList[index], 'inputStatus', 'edit');
        }
        // 计税方式、发票类型、税率、付款条款带入，不可修改。
        const index2 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'taxationCode');
        if (index >= 0) {
          this.$set(this.pageConfig.mainFormConfig.formList[index2], 'inputStatus', 'disable');
        }
        const index3 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'invoiceCode');
        if (index >= 0) {
          this.$set(this.pageConfig.mainFormConfig.formList[index3], 'inputStatus', 'disable');
        }
        const index4 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'taxRate');
        if (index >= 0) {
          this.$set(this.pageConfig.mainFormConfig.formList[index4], 'inputStatus', 'disable');
        }
        const index5 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'currencyCode');
        if (index >= 0) {
          this.$set(this.pageConfig.mainFormConfig.formList[index5], 'inputStatus', 'disable');
        }
        const index6 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'paymentProvision');
        if (index >= 0) {
          this.$set(this.pageConfig.mainFormConfig.formList[index6], 'inputStatus', 'disable');
        }
        this.$set(this.pageConfig.projectForm, 'taxationCode', '');
        this.$set(this.pageConfig.projectForm, 'taxationValue', '');
        this.$set(this.pageConfig.projectForm, 'invoiceCode', '');
        this.$set(this.pageConfig.projectForm, 'invoiceValue', '');
        this.$set(this.pageConfig.projectForm, 'taxRate', '');
        this.$set(this.pageConfig.projectForm, 'paymentProvision', '');
        this.$set(this.pageConfig.projectForm, 'currencyCode', '');
        this.$set(this.pageConfig.projectForm, 'currencyValue', '');
        return;
      }
      // 不签合同供货订单
      if (this.pageConfig.projectForm.orderTypeCode === '02') {
        const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'expendContractName');
        if (index >= 0) {
          this.$set(this.pageConfig.mainFormConfig.formList[index], 'inputStatus', 'disable');
          this.$set(this.pageConfig.projectForm, 'expendContractName', '');
          this.$set(this.pageConfig.projectForm, 'expendContractId', '');
        }
        const index2 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'taxationCode');
        if (index >= 0) {
          this.$set(this.pageConfig.mainFormConfig.formList[index2], 'inputStatus', 'edit');
        }
        const index3 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'invoiceCode');
        if (index >= 0) {
          this.$set(this.pageConfig.mainFormConfig.formList[index3], 'inputStatus', 'edit');
        }
        const index4 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'taxRate');
        if (index >= 0) {
          this.$set(this.pageConfig.mainFormConfig.formList[index4], 'inputStatus', 'edit');
        }
        const index5 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'currencyCode');
        if (index >= 0) {
          this.$set(this.pageConfig.mainFormConfig.formList[index5], 'inputStatus', 'edit');
        }
        const index6 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'paymentProvision');
        if (index >= 0) {
          this.$set(this.pageConfig.mainFormConfig.formList[index6], 'inputStatus', 'edit');
        }
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
          const currentApplyQuantity = Number(item.currentApplyQuantity) - Number(item.alreadyApplyQuantity) || 0; // 数量
          const unitPrice = Number(item.budgetUnitPrice) || 0; // 单价（含税）
          const amount = Number((currentApplyQuantity * unitPrice).toFixed(2));
          data.push(
            {
              varietiesName: item.varietiesName,
              varietiesCode: item.varietiesCode,
              standards: item.standards,
              unit: item.unit,
              alreadyApplyQuantity: item.alreadyApplyQuantity, // 已申请数量
              createTime: this.$utils.commonUtil.formatTime(new Date()),
              demandPlanQuantity, // 需求数量
              currentApplyQuantity: currentApplyQuantity > 0 ? currentApplyQuantity : 0,
              demandPlanCode: item.docNo,
              demandPlanId: item.demandPlanId,
              demandPlanTypeCode: item.demandPlanTypeCode,
              demandPlanTypeValue: item.demandPlanTypeValue,
              eId: item.preDetailId || item.id,
              supplyRemarks: '',
              remarks: item.remarks,
              requiredDate: item.requiredDate,
              usePlaceId: item.usePlaceId,
              usePlaceName: item.usePlaceName,
              varietiesId: item.varietiesId,
              unitPrice,
              amount,
              models: item.models || '',
              brand: item.brand || '',
              contractDetailId: item.contractDetailId || '',
              contractUnitPrice: item.contractUnitPrice || '',
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
      // this.setSubTable('purchaseSupplyOrderDetail', data);
      const tableDataList = this.pageConfig.subTableConfig['purchaseSupplyOrderDetail'].tableData;
      const tableData = tableDataList.concat(data);
      this.$set(this.pageConfig.subTableConfig['purchaseSupplyOrderDetail'], 'tableData', tableData);
      this.dialogVisible = false;
      this.setPurchaseContent('purchaseSupplyOrderDetail');
      this.deletTableCallback('purchaseSupplyOrderDetail');
    },
    // 用户不填订单名称时自动赋值明细前5行的品种名称
    setPurchaseContent (tableName) {
      const tableData = this.pageConfig.subTableConfig[tableName].tableData;
      if (!this.pageConfig.projectForm.orderName) {
        this.$set(this.pageConfig.projectForm, 'orderName', tableData.slice(0, 5).map(v => v.executeVarietiesName).join(','));
      }
      const mainSupplyDetail = tableData.map(v => v.executeVarietiesName).slice(0, 5).join(',');
      this.$set(this.pageConfig.projectForm, 'mainSupplyDetail', tableData.length ? mainSupplyDetail : '');
    },
    // 计算
    handleCalculation ({ item, row, event, subTable, rowIndex }) {
      if (item.prop === 'amount') {
        const data = this.$clone(this.pageConfig.subTableConfig[subTable.subTableName].tableData);
        const orderAmount = data.reduce((a, b, c) => {
          return a += Number(b.amount) || 0;
        }, 0);
        this.$set(this.pageConfig.projectForm, 'orderAmount', Number(orderAmount.toFixed(2)));
      } else {
        row.amount = (row.currentApplyQuantity || 0) * (row.unitPrice || 0);
        const data = this.$clone(this.pageConfig.subTableConfig[subTable.subTableName].tableData);
        const orderAmount = data.reduce((a, b, c) => {
          return a += Number(b.amount) || 0;
        }, 0);
        this.$set(this.pageConfig.projectForm, 'orderAmount', Number(orderAmount.toFixed(2)));
      }
    },
    // 批量删除后计算
    deletTableCallback (tableName) {
      const data = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
      const orderAmount = data.reduce((a, b, c) => {
        return a += Number(b.amount) || 0;
      }, 0);
      this.$set(this.pageConfig.projectForm, 'orderAmount', Number(orderAmount.toFixed(2)));
      this.setPurchaseContent(tableName);
    },
    // 保存
    handleSave (isProcess = false) {
      this.$refs.editForm.getValidateForm(async () => {
        const data = this.$clone(this.pageConfig.projectForm);
        if (this.pageConfig.projectForm.orderTypeCode === '01') {
          if (!this.pageConfig.projectForm.expendContractName) {
            // 请选择关联合同
            this.$message.error('supplyOrde.pleaseSelectExpendContract');
            return;
          }
        }
        const purchaseSupplyOrderDetail = this.$refs.purchaseSupplyOrderDetail[0].validateTableData();
        if (!purchaseSupplyOrderDetail || purchaseSupplyOrderDetail.length === 0) {
          // 存在未填写或个数错误的数据
          this.$message.error(`${this.$t('supplyOrder.purchaseSupplyOrderDetail')}${this.$t('tips.notFilledIn')}`);
          return;
        }
        if (!data.orderName) {
          data.orderName = purchaseSupplyOrderDetail.slice(-5).map(v => v.executeVarietiesName).join(',');
        }
        if (!data.orderTypeValue) {
          const selectList = this.pageConfig.orderTypeCodeList;
          const key = selectList.findIndex(v => v.dataCode === this.pageConfig.projectForm.orderTypeCode);
          if (key >= 0) {
            data.orderTypeValue = selectList[key].dataName;
          } else {
            data.orderTypeValue = '';
          }
        }
        // 是否存在重复明细
        // const selectTableList = [];
        // for (const i in purchaseSupplyOrderDetail) {
        //   const item = purchaseSupplyOrderDetail[i];
        //   item.rowkey = `${item.demandPlanCode}-${item.executeVarietiesName}-${item.executeStandards}-${item.models}-${item.brand}-${item.executeUnit}`;
        //   const index = selectTableList.findIndex(v => v.rowkey === item.rowkey);
        //   if (index >= 0) {
        //     this.$message.error(`${this.$t('tips.theFirst')} ${Number(i) + 1} ${this.$t('tips.duplicateDetails')}`);
        //     return;
        //   } else {
        //     selectTableList.push(item);
        //   }
        // }
        // 校验前判断
        const orderRes = await this.$store.dispatch('supplyOrder/getContractInfo', {contractId: data.expendContractId}).then();
        const contractRes = await this.$store.dispatch('purchaseContractLedger/getInfo', {expendRegisterId: data.expendContractId}).then();
        const totalOrderAmount = orderRes.results || 0; // 累计订单金额
        const signAmount = contractRes.results.signAmount || 0; // 合同签订金额
        const orderAmount = Number(data.orderAmount) || 0; // 本次订单金额
        if ((totalOrderAmount + orderAmount) > signAmount) {
          // 截至当前订单，累计下达金额为：xxx元，已经超过合同签订金额：xx元，确定要继续下达吗？
          // 截至当前订单，累计下达金额为：{keyValue}元,
          // 已经超过合同签订金额：{keyValue}元，确定要继续下达吗？
          const msg1 = this.$t('supplyOrder.saveTips1').replace('{keyValue}', Number((totalOrderAmount + orderAmount).toFixed(2)));
          const msg2 = this.$t('supplyOrder.saveTips2').replace('{keyValue}', Number(signAmount).toFixed(2));
          this.$confirm(`${msg1} ${msg2}`, this.$t('tips.tips'), {
            confirmButtonText: this.$t('button.determine'),
            cancelButtonText: this.$t('button.close'),
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }).then(() => {
            this.beforeSave(data, purchaseSupplyOrderDetail, isProcess);
          }).catch(() => {

          });
        } else {
          this.beforeSave(data, purchaseSupplyOrderDetail, isProcess);
        }
        // this.beforeSave(data, purchaseSupplyOrderDetail, isProcess);
      });
    },
    // 保存
    beforeSave(data, purchaseSupplyOrderDetail, isProcess) {
        data.supplyOrderDetails = purchaseSupplyOrderDetail;
        this.$set(data, 'modelType', '01');
        this.handleSaveData(data, isProcess);
    },
    // 获取合同单价
    handleGetContractPrice(tableName) {
      const tableData = this.pageConfig.subTableConfig[tableName].tableData;
      if (tableData.length === 0) {
        // 明细数据为空，不能获取合同单价！
        this.$message.error(this.$t('tips.tableDataGetContractPriceTips'));
        return;
      }
      // 按照-明细数据的名称、规格、单位、品牌、型号，与本订单关联合同的明细进行匹配，如果匹配一致，则将单价带入赋值。否则单价为空，需要您自行手动填写。
      this.$confirm(this.$t('tips.getContractPriceTips'), this.$t('tips.tips'), {
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.getVarietiesContractDateilList(tableName);
      }).catch(() => {

      });
    },
    // 采购合同明细
    getVarietiesContractDateilList (tableName) {
      const ketList = ['executeVarietiesName', 'executeStandards', 'executeUnit', 'models', 'brand'];
      const toKeyList = ['itemName', 'standards', 'unit', 'models', 'brand'];
      const contractId = this.pageConfig.projectForm.expendContractId;
      this.contractUnitPriceMatch(tableName, contractId, ketList, toKeyList, (item) => {
          this.handleCalculation({
            item: {prop: 'unitPrice'},
            row: item,
            event: '',
            subTable: {subTableName: 'purchaseSupplyOrderDetail'}
          });
      });
    },
    contractUnitPriceMatch(tableName, contractId, ketList, toKeyList, callback) {
      this.loading = true;
      // 名称、规格、单位、品牌、型号
      this.$store.dispatch('publicApi/getContractInfoPublicApi', {expendRegisterId: contractId}).then(res => {
        if (res.status === 0) {
          const registerDetails = res.results.registerDetails;
          const tableData = this.pageConfig.subTableConfig[tableName].tableData;
          for (const item of tableData) {
            const rowKey = ketList.map(v => `${item[v] || ''}-`).join(',');
            const index = registerDetails.findIndex(v => rowKey === toKeyList.map(t => `${v[t] || ''}-`).join(','));
            if (index >= 0) {
              this.$set(item, 'contractDetailId', registerDetails[index].id);
              this.$set(item, 'unitPrice', registerDetails[index].unitPrice);
              this.$set(item, 'contractUnitPrice', registerDetails[index].unitPrice);
            } else {
              this.$set(item, 'contractDetailId', '');
              this.$set(item, 'unitPrice', '');
              this.$set(item, 'contractUnitPrice', '');
            }
            callback && callback(item);
          }
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
        this.loading = false;
      }).catch(E => {
        this.loading = false;
      });
    }
  }
};
</script>
<style scoped lang='scss'>
/deep/ .changeVarieties{
  color: red !important;
  .el-input__inner{
    color: red !important;
  }
}
</style>
