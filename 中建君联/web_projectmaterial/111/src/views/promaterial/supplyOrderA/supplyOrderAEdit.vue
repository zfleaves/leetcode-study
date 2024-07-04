<!--
 * @Author: your name
 * @Date: 2020-07-30 10:34:00
 * @LastEditTime: 2022-03-11 15:42:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\supplyOrderA\supplyOrderEdit.vue
-->
<template>
  <div>
    <edit-page @editEvent="editEvent" v-loading="loading">
      <div slot="editPage">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" :type="type" :tableConfig="pageConfig.mainFormConfig"
          :projectForm="pageConfig.projectForm" :customRules="customRules" @editFormEvent="editFormEvent">
          <!--如材料是由甲方发货，请先在往来单位云-乙方信息登记中将甲方收录为供应商 -->
          <template slot="tips-supplierName">
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content" style="line-height: 24px;">
                {{$t('supplyOrderA.supplierNameTips')}}
              </div>
              <span class="tips-item"><i class="el-icon-question"></i></span>
            </el-tooltip>
          </template>
        </g-edit-form>
        <!-- 明细清单 -->
        <div v-if="pageConfigLoading">
          <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
            <g-edit-title :title="$t(`supplyOrderA.${subTable.subTableName}`)"
              :titleTips="$t(`supplyOrderA.${subTable.titleTips}`)">
              <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
              </g-button>
            </g-edit-title>
            <g-edit-table :ref="subTable.subTableName" :type="type" :isSelection="subTable.isSelection"
              :tableConfig="subTable.tableList" :subTable='subTable' :delete.sync="deleteList[subTable.subTableName]"
              :customRules="subTableCustomRules" :getRowClassName="getRowClassName" @editTableEvent='editTableEvent'>
            </g-edit-table>
          </div>
        </div>
      </div>
    </edit-page>
    <!-- 选择材料分类 -->
    <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
      <newSupplyOrderDetail slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogVisible"
        :selectList="varietiesIdList" promaterialTtype="order" :projectId="pageConfig.projectForm.projectId"
        supplyOrderA="supplyOrderA" varietiesTitle="supplyOrderA.masterPlan" @getData="getData" v-if="dialogVisible">
      </newSupplyOrderDetail>
    </g-dialog>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';

export default {
  name: 'supplyOrderAEdit',
  mixins: [editPage],
  data () {
    const contactMobileValid = (rule, value, callback) => {
      if (!value) {
        // 请输入业务联系人手机号
        callback(new Error(this.$t('supplyOrderA.contactMobileTips')));
      } else {
        const regular = /[0-9]/;
        if (!regular.test(value)) {
          // 请输入正确的手机号码
          callback(new Error(this.$t('supplyOrderA.contactMobileRuleTips')));
        } else {
          callback();
        }
      }
    };
    const currentApplyQuantityValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('supplyOrderA.currentApplyQuantityTips')));
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
        invoiceCode: '',
        invoiceValue: '',
        orderAmount: 0,
        orderName: '',
        orderTypeCode: '01',
        orderTypeValue: '',
        paymentProvision: '',
        projectId: 0,
        province: '',
        releaseDate: '',
        releaseUserName: '',
        remarks: '',
        supplierId: 0,
        supplierName: '',
        modelType: '02',
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      },
      // 选择材料
      dialogVisible: false,
      dialogConfig: {
        title: this.$t('supplyOrderA.seleMaterialVarieties'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      varietiesIdList: [],
      back: '',
      subTableRow: {},
      customRules: {
        contactMobile: [{ required: true, validator: contactMobileValid, trigger: 'blur' }]
      },
      subTableCustomRules: {
        currentApplyQuantity: [{ required: true, validator: currentApplyQuantityValid, trigger: 'blur' }]
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
    newSupplyOrderDetail (resolve) {
      require(['../compoent/newSupplyOrderDetail/newSupplyOrderDetail.vue'], resolve);
    }
  },
  methods: {
    setPageDisabed () {
      this.pageDisabled = false;
    },
    // 获取info数据
    async _getInfoData (id = 0) {
      await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl);
    },
    checkRow (row) {
      const tableData = this.pageConfig.subTableConfig['purchaseSupplyPartyAOrderDetail'].tableData;
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
      } else {
        return false;
      }
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
          data.push(
            {
              varietiesName: item.varietiesName,
              varietiesCode: item.varietiesCode,
              standards: item.standards,
              unit: item.unit,
              alreadyApplyQuantity: item.applyTotalQuantity, // 已申请数量
              createTime: this.$utils.commonUtil.formatTime(new Date()),
              demandPlanQuantity: item.currentApplyQuantity, // 需求数量
              currentApplyQuantity: 0,
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
              unitPrice: item.budgetUnitPrice || 0,
              amount: '',
              models: item.models || '',
              brand: item.brand || '',
              contractDetailId: item.contractDetailId || '',
              // 带入
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
              budgetQuantity: item.changeAfterQuantity,
              budgetTotalAmount: item.changeAfterAmount,
              budgetUnitPrice: item.changeAfterUnitPrice
            }
          );
        }
      }
      const tableDataList = this.pageConfig.subTableConfig['purchaseSupplyPartyAOrderDetail'].tableData;
      const tableData = tableDataList.concat(data);
      this.$set(this.pageConfig.subTableConfig['purchaseSupplyPartyAOrderDetail'], 'tableData', tableData);
      this.dialogVisible = false;
      this.setPurchaseContent('purchaseSupplyPartyAOrderDetail');
    },
    // 批量删除后计算
    deletTableCallback (tableName) {
      this.setPurchaseContent(tableName);
    },
    setPurchaseContent (tableName) {
      const tableData = this.pageConfig.subTableConfig[tableName].tableData;
      if (!this.pageConfig.projectForm.orderName) {
        this.$set(this.pageConfig.projectForm, 'orderName', tableData.slice(-5).map(v => v.varietiesName).join(','));
      }
      const mainSupplyDetail = tableData.map(v => v.varietiesName).slice(0, 5).join(',');
      this.$set(this.pageConfig.projectForm, 'mainSupplyDetail', tableData.length ? mainSupplyDetail : '');
    },
    // 保存
    handleSave (isProcess = false) {
      this.$refs.editForm.getValidateForm(() => {
        const data = this.$clone(this.pageConfig.projectForm);
        const purchaseSupplyPartyAOrderDetail = this.$refs.purchaseSupplyPartyAOrderDetail[0].validateTableData();
        if (!purchaseSupplyPartyAOrderDetail || purchaseSupplyPartyAOrderDetail.length === 0) {
          // 存在未填写或个数错误的数据
          this.$message.error(`${this.$t('supplyOrderA.purchaseSupplyPartyAOrderDetail')}${this.$t('tips.notFilledIn')}`);
          return;
        }
        if (!data.orderName) {
          data.orderName = purchaseSupplyPartyAOrderDetail.slice(-5).map(v => v.varietiesName).join(',');
        }
        // 是否存在重复明细
        const selectTableList = [];
        for (const i in purchaseSupplyPartyAOrderDetail) {
          const item = purchaseSupplyPartyAOrderDetail[i];
          item.rowkey = `${item.varietiesName}-${item.standards}-${item.models}-${item.brand}-${item.unit}`;
          const index = selectTableList.findIndex(v => v.rowkey === item.rowkey);
          if (index >= 0) {
            this.$message.error(`${this.$t('tips.theFirst')} ${Number(i) + 1} ${this.$t('tips.duplicateDetails')}`);
            return;
          } else {
            selectTableList.push(item);
          }
        }
        data.supplyOrderDetails = purchaseSupplyPartyAOrderDetail;
        this.$set(data, 'modelType', '02');
        this.handleSaveData(data, isProcess);
      });
    }
  }
};
</script>
<style scoped>
</style>>
