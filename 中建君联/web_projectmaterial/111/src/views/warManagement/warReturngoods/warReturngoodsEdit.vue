<!--
 * @Author: your name
 * @Date: 2020-07-30 10:35:06
 * @LastEditTime: 2022-08-23 11:37:02
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\warReturngoods\warIncomingEdit.vue
-->
<template>
  <div>
    <edit-page @editEvent="editEvent" v-loading="loading">
      <div slot="editPage">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" :type="type" :tableConfig="pageConfig.mainFormConfig"
          :projectForm="pageConfig.projectForm" @editFormEvent="editFormEvent">
          <!-- 选择合同/零星采购单 -->
          <template slot="form-expendContractName" slot-scope="{ scope, item }">
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
           <!-- 选择入库单编号 -->
          <template slot="form-incomingDocNo" slot-scope="{ scope, item }">
            <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
              :title="$t(item.label)">
              <div class="slot-input">
                <el-input v-model.trim="scope[item.prop]" :size="item.size || 'small'" readonly>
                  <template slot="suffix" v-if="item.inputStatus !== 'disable' && pageDisabled">
                    <i v-if="scope[item.prop]" class="slot-close el-icon-circle-close"
                      @click="handleClearIncomingDocNo(scope, item)"></i>
                    <i class="multiple-choice-icon iconfont icon-menu" @click="handleSelectIncomingDocNo(scope, item)"></i>
                  </template>
                </el-input>
              </div>
            </el-form-item>
          </template>
        </g-edit-form>
        <!-- 明细清单 :max="scope.stock"-->
        <div v-if="pageConfigLoading">
          <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
            <g-edit-title :title="$t(`warReturngoods.${subTable.subTableName}`)"
              :titleTips="$t(`warReturngoods.${subTable.titleTips}`)">
              <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
              </g-button>
            </g-edit-title>
            <g-edit-pl-table :ref="subTable.subTableName" :type="type" :isSelection="subTable.isSelection"
              :tableConfig="subTable.tableList" :subTable="subTable" :customRules="subTableCustomRules"
              :delete.sync="deleteList[subTable.subTableName]" @editTableEvent="editTableEvent">
              <template slot="edit-table-currentReturngoodsQuantity" slot-scope="{ item, scope }">
                <el-number v-if="item.inputStatus !== 'disable'" controls-position="right" size="small"
                  :disabled="item.inputStatus === 'disable'"  :maxlength="Number(item.maxlength)"
                  :precision="Number(item.precision)" v-model.trim="scope[item.prop]" :placeholder="item.placeholder"
                  @change="
                    handleCurrentIncomingQuantity(item, scope, scope.currentReturngoodsQuantity, subTable, scope.$index)
                  ">
                </el-number>
                <div class="ellipsis" v-else>
                  {{ scope[item.prop] }}
                </div>
              </template>
            </g-edit-pl-table>
          </div>
        </div>
      </div>
    </edit-page>
    <!-- 选择材料分类 -->
    <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
      <IncomingRetrungoodsDetails slot="body" slot-scope="{ height }" :dialogHeight="height" :close.sync="dialogVisible"
        :selectList="varietiesIdList"
        :sourceType='pageConfig.projectForm.sourceType'
        :expendContractId='pageConfig.projectForm.expendContractId'
        :incomingId='pageConfig.projectForm.incomingId'
        :projectId="pageConfig.projectForm.projectId || 0" varietiesTitle="warReturngoods.selectVarieties"
        @getData="getData">
      </IncomingRetrungoodsDetails>
    </g-dialog>

    <!-- 选择合同/零星采购单 -->
    <g-dialog v-if="dialogContract" :dialogConfig="dialogConfigContract" :isVisible.sync="dialogContract">
      <contractSporadicPurchase slot="body" slot-scope="{height}" :dialogHeight="height"
        :selectId='`${pageConfig.projectForm.sourceType}-${pageConfig.projectForm.expendContractId}`'
        :projectId="pageConfig.projectForm.projectId" :close.sync="dialogContract" @getData="getContractData"
        type="warReturngoods"
        v-if="dialogContract">
      </contractSporadicPurchase>
    </g-dialog>
    <!-- <g-dialog v-if="dialogContract" :dialogConfig="dialogConfigContract" :isVisible.sync="dialogContract">
      <contractPurchase slot="body" slot-scope="{height}" :dialogHeight="height"
          :selectId='`${pageConfig.projectForm.sourceType}-${pageConfig.projectForm.contractId}`'
          :projectId="pageConfig.projectForm.projectId"
          :close.sync="dialogContract" @getData="getContractData" v-if="dialogContract">
     </contractPurchase>
    </g-dialog> -->
    <!-- 选择入库单编号 -->
    <g-dialog v-if="dialogIncoming" :dialogConfig="dialogConfigIncoming" :isVisible.sync="dialogIncoming">
      <incomingDocNo slot="body" slot-scope="{height}" :dialogHeight="height"
        :selectId='pageConfig.projectForm.incomingId || 0'
        :projectId="pageConfig.projectForm.projectId"
        :close.sync="dialogIncoming"
        :sourceType='pageConfig.projectForm.sourceType'
        :expendContractId='pageConfig.projectForm.expendContractId'
        @getData="getIncomingData"
        v-if="dialogIncoming">
      </incomingDocNo>
    </g-dialog>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';

export default {
  name: 'warReturngoodsEdit',
  mixins: [editPage],
  data () {
    const currentReturngoodsQuantityValid = (rule, value, callback) => {
      if (!value) {
        callback(
          new Error(this.$t('warReturngoods.currentReturngoodsQuantityTips'))
        );
      } else {
        callback();
      }
    };
    return {
      page: new Page(),
      projectForm: {
        contractCode: '',
        attachment: '',
        mainReturngoodsMaterials: '',
        projectId: 0,
        remarks: '',
        returngoodsAgentUserName: '',
        returngoodsDate: '',
        supplierId: 0,
        supplierName: '',
        totalAmount: 0,
        totalPriceTax: 0,
        totalTaxAmount: 0,
        incomingDocNo: '',
        incomingId: '',
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      },
      // 选择材料
      dialogVisible: false,
      dialogConfig: {
        title: this.$t('warReturngoods.seleMaterialVarieties'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      subTableCustomRules: {
        currentReturngoodsQuantity: [
          {
            required: true,
            validator: currentReturngoodsQuantityValid,
            trigger: 'blur'
          }
        ]
      },
      varietiesIdList: [],
      warehouseShelvesList: [],
      // 选择合同
      dialogContract: false,
      dialogConfigContract: {
        title: `${this.$t('tips.pleaseSelect')}${this.$t('fConfig.expendContractName')}`,
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.8'
      },
      contractConfig: null,
      // 选择入库单
      dialogIncoming: false,
      dialogConfigIncoming: {
        title: this.$t('warReturngoods.incomingDocNo'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      IncomingConfig: {}
    };
  },
  props: {
    processParmas: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    IncomingRetrungoodsDetails (resolve) {
      require(['../compoent/IncomingRetrungoodsDetails/IncomingRetrungoodsDetails'], resolve);
    },
    contractSporadicPurchase (resolve) {
      require(['views/promaterial/compoent/contractSporadicPurchase/contractSporadicPurchase.vue'], resolve);
    },
    // contractPurchase(resolve) {
    //   require(['views/promaterial/compoent/contractPurchase/contractPurchase.vue'], resolve);
    // },
    incomingDocNo (resolve) {
      require(['../compoent/incomingDocNo/incomingDocNo'], resolve);
    }
  },
  methods: {
    // ---------------------- 合同/零星采购单 --------------------
    // 清除合同
    handleClearContract (row, item) {
      const params = {
        paramsConfig: item,
        selectList: []
      };
      this.handleSelect(params, 'expendContractName');
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
      this.handleSelect(params, 'expendContractName', () => {
        console.log(this.pageConfig.projectForm, 'this.pageConfig.projectForm');
        this.supplierNameStatus(arr);
      });
      this.dialogContract = false;
    },
    // 根据合同/零星采购单 选择供应商
    supplierNameStatus (arr) {
      const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'expendContractName');
      const index1 = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'supplierName');
      if (this.pageConfig.mainFormConfig.formList[index].inputStatus === 'edit') {
        if (arr[0].sourceType === '01') {
          this.$set(this.pageConfig.mainFormConfig.formList[index1], 'inputStatus', 'disable');
        } else {
          this.$set(this.pageConfig.mainFormConfig.formList[index1], 'inputStatus', 'edit');
          this.$set(this.pageConfig.mainFormConfig.formList[index1], 'formType', 'partyB');
        }
      } else {
        this.$set(this.pageConfig.mainFormConfig.formList[index1], 'inputStatus', 'disable');
      }
    },

    // 获取info数据
    async _getInfoData (id = 0) {
      await this.handleGetInfoData(
        id,
        this.page.PageConfig.processParmas.infoUrl
      );
    },
    // 选择明细
    sysHandleSelectDetail (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      if (!this.pageConfig.projectForm.incomingDocNo) {
        this.$message.error(`${this.$t('tips.pleaseSelect')}${this.$t('warReturngoods.incomingDocNo')}`);
        return;
      }
      const tableData = this.$clone(
        this.pageConfig.subTableConfig[tableName].tableData
      );
      for (const item of tableData) {
        item.rowKey = `${item.hashColumn}-${item.incomingDetailId}`;
      }
      this.varietiesIdList = tableData;
      this.dialogVisible = true;
    },
    // 获取选中的数据
    getData (arr) {
      const data = [];
      for (const item of arr) {
        data.push({
            alreadyReturngoodsQuantity: item.alreadyReturngoodsQuantity || 0,
            bidQuantity: item.bidQuantity,
            bidTotalAmount: item.bidTotalAmount,
            bidUnitPrice: item.bidUnitPrice,
            budgetQuantity: item.budgetQuantity,
            budgetTotalAmount: item.budgetTotalAmount,
            budgetUnitPrice: item.budgetUnitPrice,
            controlQuantity: item.controlQuantity,
            controlTotalAmount: item.controlTotalAmount,
            controlUnitPrice: item.controlUnitPrice,
            createTime: this.$utils.commonUtil.formatTime(new Date()),
            currencyCode: item.currencyCode,
            currencyValue: item.currencyValue,
            currentReturngoodsQuantity: null,
            excludeTaxAmount: 0,
            expenseCode: item.expenseCode,
            expenseName: item.expenseName,
            hashColumn: item.hashColumn,
            includeTaxAmount: 0,
            incomingDetailId: item.incomingDetailId,
            majorCode: item.majorCode,
            majorValue: item.majorValue,
            materialClassifyCode: item.materialClassifyCode,
            materialClassifyValue: item.materialClassifyValue,
            materialId: item.materialId,
            preIncludeTaxAmount: item.preIncludeTaxAmount,
            preReturngoodsQuantity: item.preReturngoodsQuantity,
            quantitiesCode: item.quantitiesCode,
            quantitiesName: item.quantitiesName,
            budgetCode: item.budgetCode || '',
            remarks: '',
            returngoodsId: item.returngoodsId,
            returngoodsUnitPrice: item.unitPrice,
            // stock: item.availableStock,
            supplySourceCode: item.supplySourceCode,
            supplySourceValue: item.supplySourceValue,
            taxAmount: 0,
            taxRate: item.taxRate,
            unitPrice: item.unitPrice,
            warehouseId: item.warehouseId,
            warehouseName: item.warehouseName,
            warehouseShelvesId: item.warehouseShelvesId,
            warehouseShelvesName: item.warehouseShelvesName,
            warrantyExpiredDate: item.warrantyExpiredDate,
            sourceType: item.sourceType,
            incomingId: item.incomingId,
            materialName: item.materialName,
            materialCode: item.materialCode,
            models: item.models,
            unit: item.unit,
            brand: item.brand,
            standards: item.standards,
            realStock: item.availableStock,
            stock: item.currentIncomingQuantity // 入库数量
        });
      }
      this.setSubTable('warehouseReturngoodsDetail', data);
    },
    setSubTable (tableName, arr) {
      const tableData = this.$clone(
        this.pageConfig.subTableConfig[tableName].tableData
      );
      const selectTableList = [];
      if (!tableData.length || !arr.length) {
        this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', arr);
        this.setMainCheckMaterials(tableName);
      }
      if (tableData.length) {
        for (const item of tableData) {
          for (const val of arr) {
            if (
              `${item.hashColumn}-${item.incomingDetailId}` ===
              `${val.hashColumn}-${val.incomingDetailId}`
            ) {
              selectTableList.push(item);
            }
          }
        }
        for (const item of arr) {
          const index = tableData.findIndex(
            (v) => `${v.hashColumn}-${v.incomingDetailId}` ===
              `${item.hashColumn}-${item.incomingDetailId}`
          );
          if (index < 0) {
            selectTableList.push(item);
          }
        }
        this.$set(
          this.pageConfig.subTableConfig[tableName],
          'tableData',
          selectTableList
        );
        this.setMainCheckMaterials(tableName);
      }
      this.dialogVisible = false;
    },
    // 批量删除后的回调
    deletTableCallback (tableName) {
      this.setMainCheckMaterials(tableName);
    },
    handleCurrentIncomingQuantity (item, row, event, subTable, rowIndex) {
      const data = { item, row, event, subTable, rowIndex };
      // 本次退货+已退货数量不能超过入库数量。
      if (Number(row.currentReturngoodsQuantity + row.alreadyReturngoodsQuantity - row.stock).toFixed(4) > 0) {
        return this.$message.error(`${this.$t('warReturngoods.returngoodsQuantityTips')}`);
      }
      this.handleCalculation(data);
    },
    // 数值计算
    handleCalculation ({ item, row, event, subTable, rowIndex }) {
      // 金额(不含税)
      row.excludeTaxAmount = (
        (Number(row.currentReturngoodsQuantity) || 0) *
        (Number(row.returngoodsUnitPrice) || 0)
      ).toFixed(2);
      // 税额
      row.taxAmount = (
        (Number(row.excludeTaxAmount) || 0) * (Number(row.taxRate) || 0)
      ).toFixed(2);
      // 金额(含税)
      row.includeTaxAmount =
        (Number(row.excludeTaxAmount) || 0) + (Number(row.taxAmount) || 0);
      this.setAmount(subTable.subTableName);
    },
    // 获取拟采购内容
    setMainCheckMaterials (tableName) {
      const mainReturngoodsMaterials = this.pageConfig.subTableConfig[
        tableName
      ].tableData
        .slice(-5)
        .map((v) => v.materialName)
        .join(',');
      this.$set(
        this.pageConfig.projectForm,
        'mainReturngoodsMaterials',
        mainReturngoodsMaterials
      );
      this.setAmount(tableName);
    },
    // 设置金额
    setAmount (tableName) {
      const data = this.$clone(
        this.pageConfig.subTableConfig[tableName].tableData
      );
      // 金额合计
      const totalAmount = data.reduce((a, b, c) => {
        return (a += Number(b.excludeTaxAmount));
      }, 0);
      this.$set(
        this.pageConfig.projectForm,
        'totalAmount',
        Number(totalAmount.toFixed(2))
      );
      // 税额合计
      const totalTaxAmount = data.reduce((a, b, c) => {
        return (a += Number(b.taxAmount));
      }, 0);
      this.$set(
        this.pageConfig.projectForm,
        'totalTaxAmount',
        Number(totalTaxAmount.toFixed(2))
      );
      // 价税合计
      const totalPriceTax = data.reduce((a, b, c) => {
        return (a += Number(b.includeTaxAmount));
      }, 0);
      this.$set(
        this.pageConfig.projectForm,
        'totalPriceTax',
        Number(totalPriceTax.toFixed(2))
      );
    },
    // 保存
    handleSave (isProcess = false) {
      this.$refs.editForm.getValidateForm(() => {
        this.setMainCheckMaterials('warehouseReturngoodsDetail');
        const data = this.$clone(this.pageConfig.projectForm);
        const warehouseReturngoodsDetail =
          this.$refs.warehouseReturngoodsDetail[0].validateTableData();
        if (!warehouseReturngoodsDetail || warehouseReturngoodsDetail.length === 0) {
          // 存在未填写或个数错误的数据
          this.$message.error(`${this.$t('warReturngoods.warehouseReturngoodsDetail')}${this.$t('tips.notFilledIn')}`);
          return;
        }
        // 本次退货+已退货数量不能超过入库数量。
        for (const i in warehouseReturngoodsDetail) {
          const item = warehouseReturngoodsDetail[i];
          const currentReturngoodsQuantity = item.currentReturngoodsQuantity || 0;
          const alreadyReturngoodsQuantity = item.alreadyReturngoodsQuantity || 0;
          const stock = item.stock || 0;
          if (Number(currentReturngoodsQuantity + alreadyReturngoodsQuantity - stock).toFixed(4) > 0) {
            const num = Number(i) + 1;
            return this.$message.error(`${this.$t('tips.theFirst')}${num}${this.$t('tips.row')}${this.$t('tips.details')}${this.$t('warReturngoods.returngoodsQuantityTips')}`);
          }
        }
        data.returngoodsDetails = warehouseReturngoodsDetail;
        this.handleSaveData(data, isProcess);
      });
    },
    // ===================入库单编号==============
    // 选择入库单号
    handleSelectIncomingDocNo(row, item) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      if (!this.pageConfig.projectForm.expendContractId) {
        this.$message.error(`${this.$t('tips.pleaseSelect')}${this.$t('dialog.contractSporadicPurchaseName')}`);
        return;
      }
      this.IncomingConfig = this.$clone(item);
      this.dialogIncoming = true;
    },
    // 清除入库单号
    handleClearIncomingDocNo(row, item) {
      const params = {
        paramsConfig: item,
        selectList: []
      };
      this.handleSelect(params, 'incomingDocNo');
    },
    // 获取入库单号
    getIncomingData(arr) {
      const params = {
        paramsConfig: this.IncomingConfig,
        selectList: arr
      };
      this.handleSelect(params, 'docNo');
      this.dialogIncoming = false;
    }
  }
};
</script>
