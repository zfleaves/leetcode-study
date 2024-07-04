<template>
  <div>
    <edit-page @editEvent="editEvent" v-loading="loading" :isMatter="true" :isCustomButton="true" :isSave="false">
      <div slot="editPage">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" :type="type" :tableConfig="pageConfig.mainFormConfig"
          :projectForm="pageConfig.projectForm" :customRules="customRules" @editFormEvent="editFormEvent">
          <!-- 选择发票 -->
          <template slot="form-settlementInvoiceRelations" slot-scope="{ item}">
            <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
              :title="$t(item.label)">
              <multiple-choice :selectConfig="selectInvoiceConfig"
                :isDisabled="item.inputStatus !== 'disable' && pageDisabled"></multiple-choice>
            </el-form-item>
          </template>
          <!-- 选择入库单 -->
          <template slot="form-settlementIncomingRelations" slot-scope="{ item}">
            <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
              :title="$t(item.label)">
              <multiple-choice :selectConfig="selectIncomingConfig"
                :isDisabled="item.inputStatus !== 'disable' && pageDisabled"></multiple-choice>
            </el-form-item>
          </template>
          <!-- 选择退货单 -->
          <template slot="form-settlementReturngoodsRelations" slot-scope="{ item}">
            <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
              :title="$t(item.label)">
              <multiple-choice :selectConfig="selectReturnConfig"
                :isDisabled="item.inputStatus !== 'disable' && pageDisabled"></multiple-choice>
            </el-form-item>
          </template>
        </g-edit-form>
        <!-- 明细清单 -->
        <div v-if="pageConfigLoading">
          <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
            <g-edit-title :title="$t(`purchaseSettlement.${subTable.subTableName}`)">
            </g-edit-title>
            <g-edit-pl-table :ref="subTable.subTableName" :type="type" :isSelection="subTable.isSelection"
              :tableConfig="subTable.tableList" :subTable='subTable' :delete.sync="deleteList[subTable.subTableName]"
              :customRules="subTableCustomRules" @editTableEvent='editTableEvent'>
              <!-- 所属工程量名称 -->
              <template slot="edit-table-quantitiesName" slot-scope="{item, scope}">
                <div class="slot-input">
                  <el-input v-if="pageConfig.projectForm.settlementCostControl === 1"
                    v-model.trim="scope[item.prop]" :size="item.size || 'small'" readonly>
                  </el-input>
                  <div v-else style="font-size: 12px">{{scope[item.prop]}}</div>
                </div>
              </template>
            </g-edit-pl-table>
          </div>
        </div>
      </div>
    </edit-page>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';
import { importPage } from 'mixins/importMixins';

export default {
  name: 'supplierSettlementDeclarationEdit',
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
        settlementAgentUserName: '',
        settlementContent: '',
        settlementDate: '',
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
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      },
      customRules: {},
      subTableCustomRules: {
        currentSettlementQuantity: [{ required: true, validator: currentSettlementQuantityValid, trigger: 'blur' }]
      },
      // 选择发票
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
      // 入库
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
      // 退货
      selectReturnConfig: {
        // 显示的列表
        tagDada: [],
        // id
        rowKey: 'returngoodsDocNo',
        // name
        rowName: 'returngoodsDocNo',
        // 默认显示的个数
        constNum: 7
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
    // 获取info数据
    async _getInfoData (id = 0) {
      await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
        this.selectInvoiceConfig.tagDada = this.pageConfig.projectForm.settlementInvoiceRelations;
        this.selectIncomingConfig.tagDada = this.pageConfig.projectForm.settlementIncomingRelations;
        this.selectReturnConfig.tagDada = this.pageConfig.projectForm.settlementReturngoodsRelations;
        this.displayFieldsAccordingToProjectControlType('purchaseSettlementDetail');
      });
    },
    // 保存
    handleSave (isProcess = false) {
      this.$refs.editForm.getValidateForm(async () => {
        const data = this.$clone(this.pageConfig.projectForm);
        this.handleSaveData(data, isProcess);
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
