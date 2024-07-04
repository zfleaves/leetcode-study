<!--
 * @Author: your name
 * @Date: 2020-07-30 10:35:06
 * @LastEditTime: 2022-08-16 16:50:23
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\checkArrival\checkArrivalEdit.vue
-->
<template>
  <div>
    <edit-page @editEvent="editEvent" v-loading="loading">
      <div slot="editPage">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" :type="type" :tableConfig="pageConfig.mainFormConfig"
          :projectForm="pageConfig.projectForm" @editFormEvent="editFormEvent">
          <template slot="form-supplyOrderName" slot-scope="{scope, item}">
            <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
              :title="$t(item.label)">
              <div class="slot-input">
                <el-input v-model.trim="scope[item.prop]" :size="item.size || 'small'" readonly>
                  <template slot="suffix" v-if="item.inputStatus !== 'disable' && pageDisabled">
                    <i v-if="scope[item.prop]" class="slot-close el-icon-circle-close"
                      @click="handleClearExpendSupplyOrder(scope, item)"></i>
                    <i class="multiple-choice-icon iconfont icon-menu"
                      @click="handleSelectExpendSupplyOrder(scope, item)"></i>
                  </template>
                </el-input>
              </div>
            </el-form-item>
          </template>
          <!-- <template slot="tips-supplyOrderDeliverDocNos">
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content" style="line-height: 24px;">{{$t('checkArrival.supplyOrderDeliverDocNosTips')}}
              </div>
              <span class="tips-item"><i class="el-icon-question"></i></span>
            </el-tooltip>
          </template> -->
          <!-- 选择送货单 -->
          <template slot="form-supplyOrderDeliverDocNos" slot-scope="{scope, item}">
            <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
              :title="$t(item.label)">
              <multiple-choice :selectConfig="selectSupplyOrderDeliverConfig"
                :placeholder="item.placeholder"
                :isDisabled="item.inputStatus !== 'disable' && pageDisabled" @select="handleSelectSupplyOrderDeliver(scope)"
                @tagDelete="handleDeleteSupplyOrderDeliver">
              </multiple-choice>
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content" style="line-height: 24px;">{{$t('checkArrival.supplyOrderDeliverDocNosTips')}}
                </div>
                <span class="tips-item"><i class="el-icon-question"></i></span>
              </el-tooltip>
            </el-form-item>
          </template>
        </g-edit-form>
        <!-- 明细清单 -->
        <div v-if="pageConfigLoading">
          <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
            <g-edit-title :title="$t(`checkArrival.${subTable.subTableName}`)"
              :titleTips="$t(`checkArrival.${subTable.titleTips}`)">
              <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
              </g-button>
            </g-edit-title>
            <g-edit-pl-table :ref="subTable.subTableName" :type="type" :isSelection="subTable.isSelection"
              :tableConfig="subTable.tableList" :subTable='subTable' :delete.sync="deleteList[subTable.subTableName]"
              :customRules="subTableCustomRules" :getRowClassName="getRowClassName" @editTableEvent='editTableEvent'>
              <template slot="edit-table-checkPassedQuantity" slot-scope="{item, scope}">
                <el-number controls-position="right" size="small" :max="scope.currentArrivalQuantity || 0"
                  :min="item.min" :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                  :precision="Number(item.precision)" v-model.trim="scope[item.prop]" :placeholder="item.placeholder"
                  @change="handleCheckPassedQuantity(scope)">
                </el-number>
              </template>
            </g-edit-pl-table>
          </div>
        </div>
      </div>
    </edit-page>
    <!-- 选择供货订单 -->
    <g-dialog v-if="dialogExpendSupplyOrder" :dialogConfig="dialogConfigExpendSupplyOrder"
      :isVisible.sync="dialogExpendSupplyOrder">
      <supplyOrderAll slot="body" slot-scope="{height}" :dialogHeight="height"
        :selectId="pageConfig.projectForm.supplyOrderId" :projectId="pageConfig.projectForm.projectId"
        :close.sync="dialogExpendSupplyOrder" @getData="getExpendSupplyOrderData">
      </supplyOrderAll>
    </g-dialog>
    <!-- 选择材料分类 -->
    <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
      <newCheckArrival slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogVisible"
        :selectList="varietiesIdList" varietiesTitle="checkArrival.supplyOrderVarieties"
        :projectId="pageConfig.projectForm.projectId" :supplyOrderId="pageConfig.projectForm.supplyOrderId"
        :supplyOrderDeliverIds='supplyOrderDeliverIds'
        @getData="getData" v-if="dialogVisible">
      </newCheckArrival>
    </g-dialog>

    <!-- 选择送货单 -->
    <g-dialog v-if="dialogSupplyOrderDeliver" :dialogConfig="dialogConfigSupplyOrderDeliver" :isVisible.sync="dialogSupplyOrderDeliver">
      <supplyOrderDeliverMultiple slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogSupplyOrderDeliver"
        :selectList="selectSupplyOrderDeliverConfig.tagDada" :supplyOrderId="pageConfig.projectForm.supplyOrderId"
        @getData="getSupplyOrderDeliverData" v-if="dialogSupplyOrderDeliver">
      </supplyOrderDeliverMultiple>
    </g-dialog>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';

export default {
  name: 'checkArrivalEdit',
  mixins: [editPage],
  data () {
    const currentArrivalQuantityValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('checkArrival.currentArrivalQuantityTips')));
      } else {
        callback();
      }
    };
    return {
      page: new Page(),
      projectForm: {
        attachment: '',
        checkDate: '',
        checkSituation: '',
        checkTeam: '',
        mainCheckMaterials: '',
        projectId: 0,
        supplierId: 0,
        supplierName: '',
        supplyOrderCode: '',
        supplyOrderId: 0,
        supplyOrderName: '',
        supplyOrderDeliverDocNos: [],
        supplyOrderDeliverDocNo: '',
        supplyOrderDeliverIdStr: '',
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
        title: this.$t('checkArrival.seleMaterialVarieties'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '90%',
        span: '0.75'
      },
      varietiesIdList: [],
      back: '',
      subTableRow: {},
      // 选择供货订单
      supplyOrderConfig: {},
      dialogExpendSupplyOrder: false,
      dialogConfigExpendSupplyOrder: {
        title: this.$t('checkArrival.seleExpendSupplyOrder'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '60%',
        span: '0.75'
      },
      subTableCustomRules: {
        currentArrivalQuantity: [{ required: true, validator: currentArrivalQuantityValid, trigger: 'blur' }]
      },
      // 送货单
      dialogSupplyOrderDeliver: false,
      dialogConfigSupplyOrderDeliver: {
        title: this.$t('checkArrival.seleSupplyOrderDeliver'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      selectSupplyOrderDeliverConfig: {
        // 显示的列表
        tagDada: [],
        // id
        rowKey: 'supplyOrderDeliverDocNo',
        // name
        rowName: 'supplyOrderDeliverDocNo',
        // 默认显示的个数
        constNum: 7
      },
      deleteSupplyOrderDeliverCode: ''
    };
  },
  props: {
    processParmas: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    newCheckArrival (resolve) {
      require(['../compoent/newCheckArrival/newCheckArrival'], resolve);
    },
    supplyOrderAll (resolve) {
      require(['../compoent/supplyOrder/index.vue'], resolve);
    },
    supplyOrderDeliverMultiple (resolve) {
      require(['../compoent/supplyOrderDeliverMultiple/supplyOrderDeliverMultiple'], resolve);
    }
  },
  methods: {
    // 获取info数据
    async _getInfoData (id = 0) {
      await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
        const {supplyOrderDeliverDocNo, supplyOrderDeliverIdStr} = this.pageConfig.projectForm;
        const supplyOrderDeliverDocNos = [];
        if (supplyOrderDeliverDocNo) {
          const list = supplyOrderDeliverDocNo.split(',');
          const idList = supplyOrderDeliverIdStr.split(',');
          for (const i in list) {
            const item = list[i];
            supplyOrderDeliverDocNos.push({
              createBy: this.$utils.Auth.hasUserInfo().userId,
              createTime: this.$utils.commonUtil.formatTime(new Date()),
              supplyOrderDeliverDocNo: item,
              supplyOrderDeliverIdStr: Number(idList[i])
            });
          }
        }
        this.selectSupplyOrderDeliverConfig.tagDada = supplyOrderDeliverDocNos;
        this.pageConfig.projectForm.supplyOrderDeliverDocNos = this.selectSupplyOrderDeliverConfig.tagDada;
        this.displayFieldsAccordingToProjectControlType('purchaseCheckArrivalDetail');
      });
    },
    checkRow (row) {
      // 飘红逻辑更改：之前是跟本次到货数量对比，现在调整为：已验收数量+本次验收通过数量大于订单下达数量时，飘红 10.08
      if (Number(((row.alreadyArrivalQuantity || 0) + (row.checkPassedQuantity || 0)).toFixed(4)) > (row.supplyOrderQuantity || 0)) {
        return true;
      } else {
        return false;
      }
    },
    // 校验项目
    handleCheckProject (params) {
      this.handleSelect(params, 'projectName', () => {
        if (params.selectList.length) {
          this.displayFieldsAccordingToProjectControlType('purchaseCheckArrivalDetail');
        }
      });
    },
    // 清除供货订单
    handleClearExpendSupplyOrder (row, item) {
      const params = {
        paramsConfig: item,
        selectList: []
      };
      this.handleSelect(params, 'orderName');
    },
    // 打开供货订单弹窗
    handleSelectExpendSupplyOrder (row, item) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      this.supplyOrderConfig = item;
      this.dialogExpendSupplyOrder = true;
    },
    // 选中的供货订单数据
    getExpendSupplyOrderData (arr) {
      const params = {
        paramsConfig: this.supplyOrderConfig,
        selectList: arr
      };
      this.handleSelect(params, 'orderName');
      this.dialogExpendSupplyOrder = false;
    },
    // 选择明细
    async sysHandleSelectDetail (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      if (!this.pageConfig.projectForm.supplyOrderName) {
        this.$message.error(this.$t('checkArrival.pleaseSelectSupplyOrder'));
        return;
      }
      // if (this.selectSupplyOrderDeliverConfig.tagDada.length === 0) {
      //   this.$message.error(`${this.$t('tips.pleaseSelect')} ${this.$t('checkArrival.supplyOrderDeliverDocNos')}`);
      //   return;
      // }
      this.supplyOrderDeliverIds = this.selectSupplyOrderDeliverConfig.tagDada.map(v => {
        return Number(v.supplyOrderDeliverIdStr);
      });
      const tableData = this.pageConfig.subTableConfig[tableName].tableData;
      if (this.supplyOrderDeliverIds && this.supplyOrderDeliverIds.length) {
        const params = {
          projectId: this.pageConfig.projectForm.projectId,
          supplyOrderDeliverIds: this.supplyOrderDeliverIds,
          supplyOrderId: this.pageConfig.projectForm.supplyOrderId
        };
        await this.$store.dispatch('checkArrival/getSupplyorderDeliverDetailList', params).then(res => {
          if (res.status === 0) {
            const supplyOrderDetails = this.$clone(res.results);
            for (const i in supplyOrderDetails) {
              const item = supplyOrderDetails[i];
              this.$set(item, 'demandPlanDetailId', item.eId);
              this.$set(item, 'eId', item.supplyOrderDeliverDetailId);
              item.rowKey = `${item.supplyOrderDeliverDetailId}-${item.varietiesId}`;
              // item.arrivalTotalQuantity = item.alreadyApplyQuantity;
              item.currentArrivalQuantity = item.supplyOrderShippedQuantity;
              item.checkPassedQuantity = item.supplyOrderDeliverQuantity;
              if (item.alreadyApplyQuantity < item.supplyOrderDeliverQuantity && !tableData.length) {
                // 本次验收的送货通知单，供应商端填写的发货单明细还未验收完成，是否要获取还未完成的发货单明细进行验收？
                const tips = this.$t('checkArrival.checkArrivalTips');
                this.$confirm(tips, this.$t('tips.tips'), {
                  confirmButtonText: this.$t('tips.yes'),
                  cancelButtonText: this.$t('tips.no'),
                  type: 'warning'
                }).then(() => {
                  console.log(supplyOrderDetails, 'supplyOrderDetails');
                  this.getData(supplyOrderDetails);
                }).catch(() => {
                  this.varietiesIdList = tableData;
                  this.dialogVisible = true;
                });
              } else {
                this.varietiesIdList = tableData;
                this.dialogVisible = true;
              }
            }
          }
        });
      } else {
        this.varietiesIdList = tableData;
        this.dialogVisible = true;
      }
    },
    // 获取选中的数据
    getData (arr) {
      const data = [];
      for (const item of arr) {
        data.push(
          {
            varietiesId: item.varietiesId,
            varietiesName: item.varietiesName,
            varietiesCode: item.varietiesCode,
            standards: item.standards,
            unit: item.unit,
            alreadyArrivalQuantity: item.arrivalTotalQuantity,
            arrivalDate: item.requiredDate,
            checkArrivalId: 0,
            checkPassedQuantity: item.checkPassedQuantity || 0,
            checkPassedRate: item.checkPassedRate || 100.00,
            checkRemarks: '',
            createTime: this.$utils.commonUtil.formatTime(new Date()),
            currentArrivalQuantity: item.currentArrivalQuantity || 0,
            eId: item.eId,
            supplyOrderCode: this.pageConfig.projectForm.supplyOrderCode,
            supplyOrderQuantity: item.currentApplyQuantity,
            supplyRemarks: item.supplyRemarks,
            models: item.models || '',
            brand: item.brand || '',
            includeUnitPrice: item.unitPrice || 0,
            usePlaceName: item.usePlaceName || '',
            usePlaceId: item.usePlaceId || '',
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
            supplyOrderDeliverPrice: item.supplyOrderDeliverPrice || null,
            supplyOrderDeliverQuantity: item.supplyOrderDeliverQuantity, // 供方发货订单数量
            supplyOrderShippedQuantity: item.supplyOrderShippedQuantity // 供方发货本次数量
          }
        );
      }
      this.setSubTable('purchaseCheckArrivalDetail', data);
    },
    setSubTable (tableName, arr) {
      const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
      const selectTableList = [];
      if (!tableData.length || !arr.length) {
        this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', arr);
        this.setMainCheckMaterials(tableName);
      }
      if (tableData.length) {
        for (const item of tableData) {
          for (const val of arr) {
            if (`${item.eId}-${item.varietiesId}` === `${val.eId}-${val.varietiesId}`) {
              selectTableList.push(item);
            }
          }
        }
        for (const item of arr) {
          const index = tableData.findIndex(v => `${v.eId}-${v.varietiesId}` === `${item.eId}-${item.varietiesId}`);
          if (index < 0) {
            selectTableList.push(item);
          }
        }
        this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', selectTableList);
        this.setMainCheckMaterials(tableName);
      }
      this.dialogVisible = false;
    },
    // 批量删除后的回调
    deletTableCallback (tableName) {
      this.setMainCheckMaterials(tableName);
    },
    // 数值计算
    handleCalculation ({ item, row, event, subTable, rowIndex }) {
      // 本次到货数量
      if (item.prop === 'currentArrivalQuantity') {
        row.checkPassedQuantity = this.$clone(row.currentArrivalQuantity);
      }
      if (row.currentArrivalQuantity > 0) {
        row.checkPassedRate = (row.checkPassedQuantity / row.currentArrivalQuantity * 100).toFixed(2);
      }
    },
    handleCheckPassedQuantity (row) {
      row.checkPassedRate = (row.checkPassedQuantity / row.currentArrivalQuantity * 100).toFixed(2);
    },
    // 获取拟采购内容
    setMainCheckMaterials (tableName) {
      const mainCheckMaterials = this.pageConfig.subTableConfig[tableName].tableData.slice(-5).map(v => v.executeVarietiesName).join(',');
      this.$set(this.pageConfig.projectForm, 'mainCheckMaterials', mainCheckMaterials);
    },
    // 保存
    handleSave (isProcess = false) {
      this.$refs.editForm.getValidateForm(() => {
        const data = this.$clone(this.pageConfig.projectForm);
        // 保存送货单
        const supplyOrderDeliverDocNos = this.selectSupplyOrderDeliverConfig.tagDada;
        data.supplyOrderDeliverDocNo = supplyOrderDeliverDocNos.map(v => v.supplyOrderDeliverDocNo).join(',');
        data.supplyOrderDeliverIdStr = supplyOrderDeliverDocNos.map(v => v.supplyOrderDeliverIdStr).join(',');
        const purchaseCheckArrivalDetail = this.$refs.purchaseCheckArrivalDetail[0].validateTableData();
        if (!purchaseCheckArrivalDetail || purchaseCheckArrivalDetail.length === 0) {
          // 存在未填写或个数错误的数据
          this.$message.error(`${this.$t('checkArrival.purchaseCheckArrivalDetail')}${this.$t('tips.notFilledIn')}`);
          return;
        }
        // 是否存在重复明细
        // const selectTableList = [];
        // for (const i in purchaseCheckArrivalDetail) {
        //   const item = purchaseCheckArrivalDetail[i];
        //   item.rowkey = `${item.executeVarietiesName}-${item.executeStandards}-${item.models}-${item.brand}-${item.executeUnit}`;
        //   const index = selectTableList.findIndex(v => item.rowkey === v.rowkey);
        //   if (index >= 0) {
        //     this.$message.error(`${this.$t('tips.theFirst')} ${Number(i) + 1} ${this.$t('tips.duplicateDetails')}`);
        //     return;
        //   } else {
        //     selectTableList.push(item);
        //   }
        // }
        data.checkArrivalDetails = purchaseCheckArrivalDetail;
        // 建议您在附件中上传送货单或者现场验收照片及相关验收资料以便留存查看，您是否还要继续保存？
        if (!data.attachment) {
          this.$confirm(this.$t('checkArrival.attachmentTips'), this.$t('tips.tips'), {
            confirmButtonText: this.$t('button.determine'),
            cancelButtonText: this.$t('button.close'),
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }).then(() => {
            this.handleSaveData(data, isProcess);
          }).catch(() => {

          });
        } else {
          this.handleSaveData(data, isProcess);
        }
      });
    },
    // ----------------------- 送货单 ---------------------
    // 选择入库单
    handleSelectSupplyOrderDeliver (row) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      if (!this.pageConfig.projectForm.supplyOrderName) {
        this.$message.error(`${this.$t('tips.pleaseSelect')} ${this.$t('checkArrival.supplyOrderName')}`);
        return;
      }
      // console.log(this.pageConfig.projectForm.supplyOrderId, 'supplyOrderId');
      this.dialogSupplyOrderDeliver = true;
    },
    // 删除入库单
    handleDeleteSupplyOrderDeliver (row) {
      this.deleteSupplyOrderDeliverCode = row.supplyOrderDeliverDocNo;
      const tableData = this.pageConfig.subTableConfig.purchaseCheckArrivalDetail.tableData;
      if (tableData && tableData.length) {
        this.sysChangeDeleteDetail('purchaseCheckArrivalDetail', 'supplyOrderDeliverDocNos', () => {
          const index = this.selectSupplyOrderDeliverConfig.tagDada.findIndex(v => v.supplyOrderDeliverDocNo === row.supplyOrderDeliverDocNo);
          if (index >= 0) {
            this.selectSupplyOrderDeliverConfig.tagDada.splice(index, 1);
          }
        });
      } else {
        const index = this.selectSupplyOrderDeliverConfig.tagDada.findIndex(v => v.supplyOrderDeliverDocNo === row.supplyOrderDeliverDocNo);
        if (index >= 0) {
          this.selectSupplyOrderDeliverConfig.tagDada.splice(index, 1);
        }
      }
      this.pageConfig.projectForm.supplyOrderDeliverDocNos = this.selectSupplyOrderDeliverConfig.tagDada;
    },
    // 获取选择的入库单
    getSupplyOrderDeliverData (arr) {
      const data = [];
      const list = [];
      arr.forEach(item => {
        data.push(
          {
            createBy: this.$utils.Auth.hasUserInfo().userId,
            createTime: this.$utils.commonUtil.formatTime(new Date()),
            supplyOrderDeliverDocNo: item.supplyOrderDeliverDocNo,
            supplyOrderDeliverIdStr: item.id
          }
        );
        list.push(item.supplyOrderDeliverDocNo);
      });
      const tableData = this.pageConfig.subTableConfig.purchaseCheckArrivalDetail.tableData;
      if (tableData && tableData.length) {
        const tempTagDada = this.selectSupplyOrderDeliverConfig.tagDada.map(v => v.supplyOrderDeliverDocNo);
        if (list.join(',') !== tempTagDada.join(',')) {
          this.sysChangeDeleteDetail('purchaseCheckArrivalDetail', 'supplyOrderDeliverDocNos', () => {
            this.selectSupplyOrderDeliverConfig.tagDada = data;
          });
          this.dialogSupplyOrderDeliver = false;
          return;
        }
      }
      this.selectSupplyOrderDeliverConfig.tagDada = data;
      this.pageConfig.projectForm.supplyOrderDeliverDocNos = this.selectSupplyOrderDeliverConfig.tagDada;
      this.dialogSupplyOrderDeliver = false;
    },
    // 更换后删除明细
    sysChangeDeleteDetail (tableName, prop, callback) {
      const keyValue = this.$t(`checkArrival.${prop}`);
      const messageTips = `${this.$t('checkArrival.change')} ${keyValue} ${this.$t('checkArrival.changeDeleteDetailTips')}`;
      this.$confirm(messageTips, `${this.$t('button.batchDeletion')}`, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      }).then(() => {
        this.deleteDetail(tableName, Array.from(this.pageConfig.subTableConfig[tableName].tableData));
        callback && callback();
      }).catch(e => { });
    }
  }
};
</script>
