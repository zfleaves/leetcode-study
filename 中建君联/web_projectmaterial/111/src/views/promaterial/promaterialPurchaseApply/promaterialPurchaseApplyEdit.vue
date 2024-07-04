<!--
 * @Author: your name
 * @Date: 2020-07-30 10:32:19
 * @LastEditTime: 2022-08-18 14:14:43
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\purchaseApply\purchaseApplyEdit.vue
-->
<template>
  <div>
    <edit-page @editEvent="editEvent" v-loading="loading">
      <div slot="editPage">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" :type="type" :tableConfig="pageConfig.mainFormConfig"
          :projectForm="pageConfig.projectForm" @editFormEvent="editFormEvent">
          <template slot="form-purchaseStrategyCode" slot-scope="{scope, item}">
            <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
              :title="$t(item.label)">
              <div class="title">
                <el-select v-model.trim="scope[item.prop]" :placeholder="item.placeholder ? $t(item.placeholder) : ''"
                  :size="item.size || 'small'" :disabled="item.inputStatus === 'disable'"
                  :filterable="item.filterable || true" :multiple='item.multiple || false'
                  :collapse-tags='item.collapseTags || false'
                  :clearable="item.clearable === undefined ? true : item.clearable" style="width:100%"
                  @change="handlePurchaseStrategyChange(item, $event)">
                  <el-option v-for="(child,i) in item.selectList" :key="i"
                    :label="item.isTranslate ? $t(child.dataName) : child.dataName"
                    :value="item.isNumber ? Number(child.dataCode) : child.dataCode">
                  </el-option>
                </el-select>
                <div class="tips">
                  <!-- 前期集中采购：是对项目前期规划中有关主材或大宗材料进行采购的一种策略，采购申请物资的数据引用来源于施工总预算中的物资明细；
                                    过程按需采购：是对项目实际施工过程中现场生产/施工员结合项目进度的实际材料需求且这些材料还没有确认供应商时，
                                    执行的采购策略，采购申请物资的数据引用来源于施工员申报的月/周/临时需求计划单的物资明细。 -->
                  <el-popover placement="top-start" :title="$t('promaterialPurchaseApply.purchaseStrategyCodeTitle')"
                    width="400" trigger="hover">
                    <div>
                      <span>{{$t('promaterialPurchaseApply.purchaseStrategyCodeTips1')}}</span>
                      <br>
                      <span>{{$t('promaterialPurchaseApply.purchaseStrategyCodeTips2')}}</span>
                    </div>
                    <i class="el-icon-question" slot="reference"></i>
                  </el-popover>
                </div>
              </div>
            </el-form-item>
          </template>
        </g-edit-form>
        <!-- 明细清单 -->
        <div v-if="pageConfigLoading">
          <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
            <g-edit-title :title="$t(`promaterialPurchaseApply.${subTable.subTableName}`)"
              :titleTips="$t(`promaterialPurchaseApply.${subTable.titleTips}`)">
              <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
              </g-button>
            </g-edit-title>
            <g-edit-pl-table :ref="subTable.subTableName" :type="type" :isSelection="subTable.isSelection"
              :tableConfig="subTable.tableList" :subTable='subTable' :delete.sync="deleteList[subTable.subTableName]"
              :customRules="subTableCustomRules" :getRowClassName="getRowClassName" @editTableEvent='editTableEvent'>
              <template slot="edit-table-purchaseUnitPriceCounts" slot-scope="{item, scope}">
                <div v-if="scope.id" class="midFont set" @click="handleFrequencyInfo(scope)"> {{scope[item.prop]}}{{$t('tips.second')}}</div>
                <div v-else class="midFont set" @click="handleFrequencyInfo(scope)">{{$t('button.info')}}</div>
              </template>
            </g-edit-pl-table>
          </div>
        </div>
      </div>
    </edit-page>
    <!-- 选择需求计划 -->
    <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
      <historyDetails slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogVisible"
        :selectList="varietiesIdList" :projectId="pageConfig.projectForm.projectId"
        varietiesTitle="promaterialPurchaseApply.masterPlan" @getData="getData" v-if="dialogVisible">
      </historyDetails>
    </g-dialog>
    <!-- 选择施工总预算 -->
    <g-dialog v-if="dialogDemandVisible" :dialogConfig="dialogDemandConfig" :isVisible.sync="dialogDemandVisible">
      <purchaseDetials slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogDemandVisible"
        :selectList="varietiesIdList" :selectId="varietiesIdList" :projectId="pageConfig.projectForm.projectId"
        :costControlRuleCode="pageConfig.projectForm.costControlRuleCode"
        varietiesTitle="promaterialPurchaseApply.demandMasterPlan" @getData="getData" v-if="dialogDemandVisible">
      </purchaseDetials>
    </g-dialog>
    <!-- 往期采购价 -->
    <g-dialog v-if="frequencyDialog" :dialogConfig="dialogConfigFrequency" :isVisible.sync="frequencyDialog">
      <previousPurchasePrice slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="frequencyDialog"
        :frequencyVarietiesId="frequencyVarietiesId" :projectId="pageConfig.projectForm.projectId"
        type="promaterialPurchaseApply"
        v-if="frequencyDialog">
      </previousPurchasePrice>
    </g-dialog>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';

export default {
  name: 'promaterialPurchaseApplyEdit',
  mixins: [editPage],
  data () {
    const detailsNumberValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('tips.pleaseEnter')));
      } else {
        callback();
      }
    };
    return {
      page: new Page(),
      projectForm: {
        purchaseApplyReason: '',
        purchaseContent: '',
        purchaseMethodCode: '',
        purchaseMethodValue: '',
        costControlRuleCode: '',
        costControlRuleValue: '',
        applyDate: this.$utils.commonUtil.formatTime(new Date()),
        applyUserId: this.$utils.Auth.hasUserInfo().userId,
        applyUserName: this.$utils.Auth.hasUserInfo().userName,
        attachment: '',
        projectId: '',
        projectName: '',
        purchaseStrategyCode: '',
        purchaseStrategyValue: '',
        totalEstimateAmount: 0,
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      },
      // 选择材料
      dialogVisible: false,
      dialogConfig: {
        title: this.$t('promaterialPurchaseApply.seleMaterialVarieties'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      varietiesIdList: [],
      back: '',
      subTableRow: {},
      subTableCustomRules: {
        currentApplyQuantity: [{ required: true, validator: detailsNumberValid, trigger: 'blur' }]
      },
      // 选择施工总预算
      dialogDemandVisible: false,
      dialogDemandConfig: {
        title: `${this.$t('tips.pleaseSelect')}${this.$t('promaterialPurchaseApply.demandMasterPlan')}`,
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      // 往期采购价
      frequencyVarietiesId: '',
      frequencyDialog: false,
      dialogConfigFrequency: {
        title: this.$t('fConfig.frequency'),
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
    historyDetails (resolve) {
      require(['../compoent/historyDetails/historyDetails'], resolve);
    },
    purchaseDetials (resolve) {
      require(['components/material/purchaseDetials/purchaseDetials.vue'], resolve);
    },
    previousPurchasePrice (resolve) {
      require(['../compoent/previousPurchasePrice/previousPurchasePrice'], resolve);
    }
  },
  methods: {
    // 获取info数据
    async _getInfoData (id = 0) {
      await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl);
    },
    checkRow (row) {
      // 如果拟采购限价超过策划单价，则飘红；
      if (Number(row.purchaseUnitPrice) > Number(row.budgetUnitPrice)) {
        return true;
      }
      const tableData = this.pageConfig.subTableConfig['purchasePurchaseApplyDetail'].tableData;
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
        //  拟采购数量
        totalQuantity += Number(((val.currentApplyQuantity || 0)).toFixed(4));
      }
      // 拟采购数量之和 > (采购策略 01 时 策划数量， 02 时 现场报量) - 已申请采购数量
      const quantity = this.pageConfig.projectForm.purchaseStrategyCode === '01' ? (row.budgetQuantity || 0) : (row.demandPlanQuantity || 0);
      const deleteNumber = Number((quantity - (row.alreadyApplyQuantity || 0)).toFixed(4));
      if (totalQuantity > deleteNumber) {
        return true;
      } else {
        return false;
      }
    },
    // 选择采购策略后
    handlePurchaseStrategyChange (item, event) {
      const params = {
        paramsConfig: item,
        selectList: item.selectList
      };
      this.handleOtherSelect(params);
    },
    // 选择明细
    sysHandleSelectDetail (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      if (!this.pageConfig.projectForm.purchaseStrategyCode) {
        this.$message.error(`${this.$t('tips.pleaseSelect')}${this.$t('promaterialPurchaseApply.purchaseStrategyCode')}`);
        return;
      }
      const tableData = this.pageConfig.subTableConfig[tableName].tableData;
      this.varietiesIdList = tableData;
      if (this.pageConfig.projectForm.purchaseStrategyCode === '01') {
        this.dialogDemandVisible = true;
      }
      if (this.pageConfig.projectForm.purchaseStrategyCode === '02') {
        this.dialogVisible = true;
      }
    },
    // 获取选中的数据
    getData (arr) {
      const data = [];
      const purchaseStrategyCode = this.pageConfig.projectForm.purchaseStrategyCode;
      for (const item of arr) {
        if (item.isNew) {
          let currentApplyQuantity = Number(((item.currentApplyQuantity || 0) - (item.applyTotalQuantity || 0)).toFixed(4));
          currentApplyQuantity = currentApplyQuantity < 0 ? 0 : currentApplyQuantity;
          const purchaseAmount = Number((currentApplyQuantity * (item.controlUnitPrice || 0)).toFixed(2));
          data.push(
            {
              varietiesName: item.varietiesName,
              varietiesCode: item.varietiesCode,
              standards: item.standards || '',
              unit: item.unit || '',
              alreadyApplyQuantity: item.applyTotalQuantity || 0, // 已申请采购数量
              createTime: this.$utils.commonUtil.formatTime(new Date()),
              demandPlanQuantity: purchaseStrategyCode === '02' ? item.currentApplyQuantity : '', // 需求数量
              currentApplyQuantity,
              purchaseUnitPrice: item.controlUnitPrice,
              purchaseAmount,
              demandPlanCode: item.docNo,
              demandPlanId: item.demandPlanId,
              demandPlanTypeCode: item.demandPlanTypeCode,
              demandPlanTypeValue: item.demandPlanTypeValue,
              eId: item.id,
              purchaseRemarks: '',
              remarks: item.remarks || '',
              requiredDate: item.requiredDate || '',
              usePlaceId: item.usePlaceId || '',
              usePlaceName: item.usePlaceName || '',
              varietiesId: item.varietiesId,
              brand: item.brand,
              models: item.models,
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
              // 可修改名称、规格、单位
              executeStandards: item.executeStandards,
              executeUnit: item.executeUnit,
              executeVarietiesName: item.executeVarietiesName
            }
          );
        }
      }
      const tableDataList = this.pageConfig.subTableConfig['purchasePurchaseApplyDetail'].tableData;
      const tableData = tableDataList.concat(data);
      this.$set(this.pageConfig.subTableConfig['purchasePurchaseApplyDetail'], 'tableData', tableData);
      this.pageConfig.projectForm.purchaseStrategyCode === '01' ? this.dialogDemandVisible = false : this.dialogVisible = false;
      this.setPurchaseContent('purchasePurchaseApplyDetail');
    },
    // 计算
    handleCalculation ({ item, row, event, subTable, rowIndex }) {
      if (item.prop === 'purchaseAmount') {
        this.deletTableCallback(subTable.subTableName);
      } else {
        const currentApplyQuantity = row.currentApplyQuantity || 0;
        const purchaseUnitPrice = row.purchaseUnitPrice || 0;
        const purchaseAmount = Number((currentApplyQuantity * purchaseUnitPrice).toFixed(2));
        this.$set(row, 'purchaseAmount', purchaseAmount);
        this.deletTableCallback(subTable.subTableName);
      }
    },
    // 批量删除后的回调
    deletTableCallback (tableName) {
      this.setPurchaseContent(tableName);
    },
    // 获取拟采购内容
    setPurchaseContent (tableName) {
      const purchaseContent = this.pageConfig.subTableConfig[tableName].tableData.slice(-5).map(v => v.varietiesName).join(',');
      this.$set(this.pageConfig.projectForm, 'purchaseContent', purchaseContent);
      const data = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
      const totalEstimateAmount = data.reduce((a, b, c) => {
        return a += b.purchaseAmount || 0;
      }, 0);
      this.$set(this.pageConfig.projectForm, 'totalEstimateAmount', Number(totalEstimateAmount.toFixed(2)));
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
    // 保存
    handleSave (isProcess = false) {
      this.$refs.editForm.getValidateForm(() => {
        const data = this.$clone(this.pageConfig.projectForm);
        const purchasePurchaseApplyDetail = this.$refs.purchasePurchaseApplyDetail[0].validateTableData();
        if (!purchasePurchaseApplyDetail || purchasePurchaseApplyDetail.length === 0) {
          // 存在未填写或个数错误的数据
          this.$message.error(`${this.$t('promaterialPurchaseApply.purchasePurchaseApplyDetail')}${this.$t('tips.notFilledIn')}`);
          return;
        }
        // 是否存在重复明细
        // const selectTableList = [];
        // for (const i in purchasePurchaseApplyDetail) {
        //   const item = purchasePurchaseApplyDetail[i];
        //   item.rowkey = `${item.varietiesName}-${item.standards}-${item.models}-${item.brand}-${item.unit}`;
        //   const index = selectTableList.findIndex(v => v.rowkey === item.rowkey);
        //   if (index >= 0) {
        //     this.$message.error(`${this.$t('tips.theFirst')} ${Number(i) + 1} ${this.$t('tips.duplicateDetails')}`);
        //     return;
        //   } else {
        //     selectTableList.push(item);
        //   }
        // }
        data.purchaseApplyDetails = purchasePurchaseApplyDetail;
        this.handleSaveData(data, isProcess);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  .tips {
    width: 30px;
    i {
      display: inline-block;
      font-size: 20px;
      color: #2b74ec;
      line-height: 36px;
    }
  }
}
// /deep/ .editTable {
//   min-width: 1200px !important;
// }
</style>
