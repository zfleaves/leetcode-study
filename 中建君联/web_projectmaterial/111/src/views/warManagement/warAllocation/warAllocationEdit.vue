<template>
  <div>
    <edit-page @editEvent="editEvent" v-loading="loading">
      <div slot="editPage">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" :type="type" :tableConfig="pageConfig.mainFormConfig"
          :projectForm="pageConfig.projectForm" @editFormEvent="editFormEvent">
        </g-edit-form>
        <!-- 明细清单 -->
        <div v-if="pageConfigLoading">
          <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
            <g-edit-title :title="$t(`warAllocation.${subTable.subTableName}`)"
              :titleTips="$t(`warAllocation.${subTable.titleTips}`)">
              <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
              </g-button>
            </g-edit-title>
            <g-edit-pl-table :ref="subTable.subTableName" :type="type" :isSelection="subTable.isSelection"
              :tableConfig="subTable.tableList" :subTable='subTable' :customRules="subTableCustomRules"
              :delete.sync="deleteList[subTable.subTableName]" @editTableEvent='editTableEvent'>
              <template slot="edit-table-inWarehouseId" slot-scope="{item, scope}">
                <el-select v-if="item.inputStatus !== 'disable'" v-model.trim="scope[item.prop]"
                  :placeholder="item.placeholder" :size="item.size || 'small'"
                  :disabled="item.inputStatus === 'disable'" :filterable="item.filterable || true" style="width:100%"
                  @change="handleChangeInWarehouse(scope, $event)">
                  <el-option v-for="(child,i) in warehouseList" :key="i"
                    :disabled="child[item.valueCode] === scope.outWarehouseId" :label="child[item.nameCode]"
                    :value="child[item.valueCode]">
                  </el-option>
                </el-select>
                <div class="ellipsis" v-else>{{scope.inWarehouseName}}</div>
              </template>
              <template slot="edit-table-inWarehouseShelvesId" slot-scope="{item, scope}">
                <el-select v-if="item.inputStatus !== 'disable'" v-model.trim="scope[item.prop]"
                  :placeholder="item.placeholder" :size="item.size || 'small'"
                  :disabled="item.inputStatus === 'disable'" :filterable="item.filterable || true" style="width:100%"
                  @change="handleChange(item, scope, $event)">
                  <el-option v-for="(child,i) in scope.selectList" :key="i" :label="child[item.nameCode]"
                    :value="child[item.valueCode]">
                  </el-option>
                </el-select>
                <div class="ellipsis" v-else>{{scope.inWarehouseShelvesName}}</div>
              </template>
              <!--调出数量  -->
              <template slot="edit-table-outAllocationQuantity" slot-scope="{item, scope}">
                <el-number v-if="item.inputStatus !== 'disable'" controls-position="right" size="small"
                  :disabled="item.inputStatus === 'disable'" :max="scope.stock" :maxlength="Number(item.maxlength)"
                  :precision="Number(item.precision)" v-model.trim="scope[item.prop]" :placeholder="item.placeholder"
                  @change="handleCurrentIncomingQuantity(item, scope, scope.outAllocationQuantity, subTable, scope.$index)">
                </el-number>
                <div class="ellipsis" v-else>{{scope[item.prop]}}</div>
              </template>
            </g-edit-pl-table>
          </div>
        </div>
      </div>
    </edit-page>
    <!-- 选择材料分类 -->
    <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
      <stockMaterials slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogVisible"
        :selectList="varietiesIdList" :projectId="pageConfig.projectForm.outProjectId || 0"
        varietiesTitle="warAllocation.selectVarieties" @getData="getData">
      </stockMaterials>
    </g-dialog>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';

export default {
  name: 'warAllocationEdit',
  mixins: [editPage],
  data () {
    const outAllocationQuantityValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('warAllocation.outAllocationQuantityTips')));
      } else {
        callback();
      }
    };
    return {
      page: new Page(),
      projectForm: {
        allocationDate: '',
        allocationinAgentUserName: '',
        allocationoutAgentUserName: '',
        attachment: '',
        outProjectId: 0,
        outProjectName: '',
        inProjectId: 0,
        inProjectName: '',
        mainAllocationMaterials: '',
        remarks: '',
        totalAmount: 0,
        totalPriceTax: 0,
        totalTaxAmount: 0,
        generalWarehouseId: '',
        generalWarehouseName: '',
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      },
      // 选择材料
      dialogVisible: false,
      dialogConfig: {
        title: this.$t('warAllocation.seleMaterialVarieties'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      subTableCustomRules: {
        outAllocationQuantity: [{ required: true, validator: outAllocationQuantityValid, trigger: 'blur' }]
      },
      varietiesIdList: [],
      warehouseShelvesList: [],
      warehouseList: []
    };
  },
  props: {
    processParmas: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    stockMaterials (resolve) {
      require(['components/material/stockMaterials/stockMaterials.vue'], resolve);
    }
  },
  methods: {
    // 获取info数据
    async _getInfoData (id = 0) {
      await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
        if (this.pageConfig.projectForm.allocationTypeCode === '02') {
          this.getWarehouseList(() => {
            const tableData = this.pageConfig.subTableConfig.warehouseAllocationDetail.tableData;
            tableData.forEach(item => {
              this.handleChangeInWarehouse(item, item.inWarehouseId, true);
            });
          });
        }
        this.allocationTypeFun(false, () => {
          const tableData = this.pageConfig.subTableConfig.warehouseAllocationDetail.tableData;
          tableData.forEach(item => {
            this.handleChangeInWarehouse(item, item.inWarehouseId, true);
          });
        });
      });
    },
    // 选择项目后
    handleCheckProject (params) {
      this.handleSelect(params, 'projectName', () => {
        if (params.selectList.length) {
          this.getWarehouseList();
        } else {
          this.warehouseList = [];
          this.warehouseShelvesList = [];
        }
      });
    },
    // 选择仓库后
    handleChangeInWarehouse (scope, event, type) {
      !type && (scope.inWarehouseShelvesId = '');
      !type && (scope.inWarehouseShelvesName = '');
      const key = this.warehouseList.findIndex(v => v.id === event);
      if (key >= 0) {
        if (this.pageConfig.projectForm.allocationTypeCode === '01') {
          this.$set(scope, 'selectList', this.warehouseList[key].warehouseShelves);
        }
        if (this.pageConfig.projectForm.allocationTypeCode === '02') {
          this.$set(scope, 'selectList', this.warehouseList[key].warWarehouseShelves);
        }
        this.$set(scope, 'inWarehouseName', this.warehouseList[key].warehouseName);
      } else {
        this.$set(scope, 'inWarehouseName', '');
        this.$set(scope, 'selectList', []);
      }
    },
    // 获取仓库/库位
    getWarehouseList (callback) {
      const data = {
        pageNo: 1,
        pageSize: 50,
        projectId: this.pageConfig.projectForm.inProjectId,
        warehouseCode: '',
        warehouseName: ''
      };
      this.$store.dispatch('warIncoming/getWarehouseList', data).then(res => {
        if (res.status === 0) {
          this.warehouseList = res.results;
          callback && callback();
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
      });
    },
    // 选择库位后
    handleChange (item, row, event) {
      const key = row.selectList.findIndex(v => v.id === event);
      if (key >= 0) {
        row.inWarehouseShelvesName = row.selectList[key].warehouseShelvesName;
      } else {
        row.inWarehouseShelvesName = '';
      }
    },
    // 选择明细
    sysHandleSelectDetail (tableName) {
      if (!this.pageConfig.projectForm.allocationTypeCode) {
        this.$message.error(`${this.$t('tips.pleaseSelect')}${this.$t('warAllocation.allocationTypeCode')}`);
        return;
      }
      if (!this.pageConfig.projectForm.outProjectId) {
        this.$message.error(this.$t('warAllocation.pleaseSelectOutProject'));
        return;
      }

      const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
      for (const item of tableData) {
        item.rowKey = `${item.outHashColumn}-${item.materialId}`;
        item.hashColumn = item.outHashColumn;
      }
      this.varietiesIdList = tableData;
      this.dialogVisible = true;
    },
    // 获取选中的数据
    getData (arr) {
      const data = [];
      const { allocationTypeCode, generalWarehouseName, generalWarehouseId } = this.pageConfig.projectForm;
      const inWarehouseId = allocationTypeCode === '01' ? generalWarehouseId : '';
      const inWarehouseName = allocationTypeCode === '01' ? generalWarehouseName : '';
      const key = this.warehouseList.findIndex(v => v.id === generalWarehouseId);
      let selectList = [];
      if (key >= 0) {
        selectList = this.warehouseList[key].warehouseShelves;
      }

      for (const item of arr) {
        data.push(
          {
            selectList,
            createTime: this.$utils.commonUtil.formatTime(new Date()),
            currencyCode: item.currencyCode,
            currencyValue: item.currencyValue,
            inExcludeTaxAmount: 0,
            // hashColumn: item.hashColumn,
            inIncludeTaxAmount: 0,
            inTaxAmount: 0,
            inTaxRate: item.taxRate,
            inUnitPrice: item.unitPrice,
            inWarehouseId,
            inWarehouseName,
            inWarehouseShelvesId: '',
            inWarehouseShelvesName: '',
            materialId: item.materialId,
            materialName: item.materialName,
            materialCode: item.materialCode,
            models: item.models,
            unit: item.unit,
            brand: item.brand,
            standards: item.standards,
            outAllocationQuantity: 0,
            outAllocationUnitPrice: item.unitPrice,
            outExcludeTaxAmount: 0,
            outHashColumn: item.hashColumn,
            outIncludeTaxAmount: 0,
            outTaxAmount: 0,
            outTaxRate: item.taxRate,
            outUnitPrice: item.unitPrice,
            unitPrice: item.unitPrice,
            outWarehouseId: item.warehouseId,
            outWarehouseName: item.warehouseName,
            outWarehouseShelvesId: item.warehouseShelvesId,
            outWarehouseShelvesName: item.warehouseShelvesName,
            preOutAllocationQuantity: 0,
            preIncludeTaxAmount: 0,
            remarks: '',
            status: 0,
            stock: item.availableStock,
            realStock: item.availableStock,
            warrantyExpiredDate: item.warrantyExpiredDate
          }
        );
      }
      this.setSubTable('warehouseAllocationDetail', data);
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
            if (`${item.outHashColumn}-${item.materialId}` === `${val.outHashColumn}-${val.materialId}`) {
              selectTableList.push(item);
            }
          }
        }
        for (const item of arr) {
          const index = tableData.findIndex(v => `${v.outHashColumn}-${v.materialId}` === `${item.outHashColumn}-${item.materialId}`);
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
    handleCurrentIncomingQuantity (item, row, event, subTable, rowIndex) {
      const data = { item, row, event, subTable, rowIndex };
      this.handleCalculation(data);
    },
    // 数值计算
    handleCalculation ({ item, row, event, subTable, rowIndex }) {
      // 金额(不含税)
      row.inExcludeTaxAmount = ((Number(row.outAllocationQuantity) || 0) * (Number(row.inUnitPrice) || 0)).toFixed(2);
      // 税额
      row.inTaxAmount = ((Number(row.inExcludeTaxAmount) || 0) * (Number(row.inTaxRate) || 0)).toFixed(2);
      // 金额(含税)
      row.inIncludeTaxAmount = (Number(row.inExcludeTaxAmount) || 0) + (Number(row.inTaxAmount) || 0);
      this._getCalculationAmount(row, subTable.subTableName);
    },
    // 计算金额
    _getCalculationAmount (row, tableName) {
      const data = {
        excludeTaxAmount: row.outExcludeTaxAmount,
        hashVal: row.outHashColumn,
        preIncludeTaxAmount: row.preIncludeTaxAmount,
        includeTaxAmount: row.outIncludeTaxAmount,
        preQuantity: row.preOutAllocationQuantity,
        quantity: row.outAllocationQuantity,
        taxAmount: row.outTaxAmount,
        taxRate: row.outTaxRate,
        unitPrice: row.outUnitPrice
      };
      this.$store.dispatch('warWarehouse/getCalculationAmount', data).then(res => {
        if (res.status === 0) {
          const results = res.results;
          row.outExcludeTaxAmount = results.excludeTaxAmount;
          row.outIncludeTaxAmount = results.includeTaxAmount;
          row.outTaxAmount = results.taxAmount;
          row.outAllocationUnitPrice = results.unitPrice;
          this.setAmount(tableName);
        } else {
          row.outExcludeTaxAmount = 0;
          row.outIncludeTaxAmount = 0;
          row.outTaxAmount = 0;
          row.outAllocationUnitPrice = 0;
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
      });
    },
    // 获取拟采购内容
    setMainCheckMaterials (tableName) {
      const mainAllocationMaterials = this.pageConfig.subTableConfig[tableName].tableData.slice(-5).map(v => v.materialName).join(',');
      this.$set(this.pageConfig.projectForm, 'mainAllocationMaterials', mainAllocationMaterials);
      this.setAmount(tableName);
    },
    // 设置金额
    setAmount (tableName) {
      const data = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
      // 金额合计
      const totalAmount = data.reduce((a, b, c) => {
        return a += Number(b.inExcludeTaxAmount);
      }, 0);
      this.$set(this.pageConfig.projectForm, 'totalAmount', Number(totalAmount.toFixed(2)));
      // 税额合计
      const totalTaxAmount = data.reduce((a, b, c) => {
        return a += Number(b.inTaxAmount);
      }, 0);
      this.$set(this.pageConfig.projectForm, 'totalTaxAmount', Number(totalTaxAmount.toFixed(2)));
      // 价税合计
      const totalPriceTax = data.reduce((a, b, c) => {
        return a += Number(b.inIncludeTaxAmount);
      }, 0);
      this.$set(this.pageConfig.projectForm, 'totalPriceTax', Number(totalPriceTax.toFixed(2)));
    },
    // 保存
    handleSave (isProcess = false) {
      this.$refs.editForm.getValidateForm(() => {
        this.setMainCheckMaterials('warehouseAllocationDetail');
        const data = this.$clone(this.pageConfig.projectForm);
        const warehouseAllocationDetail = this.$refs.warehouseAllocationDetail[0].validateTableData();
        if (!warehouseAllocationDetail || warehouseAllocationDetail.length === 0) {
          // 存在未填写或个数错误的数据
          this.$message.error(`${this.$t('warAllocation.warehouseAllocationDetail')}${this.$t('tips.notFilledIn')}`);
          return;
        }
        if (data.allocationTypeCode === '01') {
          this.$set(data, 'inProjectName', '');
          this.$set(data, 'inProjectId', '');
        }
        if (data.allocationTypeCode === '02') {
          this.$set(data, 'generalWarehouseName', '');
          this.$set(data, 'generalWarehouseId', '');
        }
        data.allocationDetails = warehouseAllocationDetail;
        this.handleSaveData(data, isProcess);
      });
    },

    // 选择调拨类型之后的回调 01调往公司总仓,02调往其他项目
    // 如果选择调往其他项目，则选择其他项目的项目名称，必填。
    // 如果选择调往公司总仓，则不需要选择项目名称，可以选择总仓仓库名称（如果只有一个总仓仓库，系统自动带入），非必填。
    allocationTypeFun (type = true, callback) {
      // console.log(type, 'type');
      const allocationTypeCode = this.pageConfig.projectForm.allocationTypeCode;
      const formList = this.pageConfig.mainFormConfig.formList;
      const index = formList.findIndex(v => v.prop === 'inProjectName'); // 调入项目
      const index1 = formList.findIndex(v => v.prop === 'generalWarehouseId'); // 总仓名称
      const index2 = formList.findIndex(v => v.prop === 'allocationTypeCode');
      if (allocationTypeCode === '01') {
        this.$set(this.pageConfig.projectForm, 'inProjectName', '');
        this.$set(this.pageConfig.projectForm, 'inProjectId', '');
        this.$set(formList[index], 'inputStatus', 'hide');
        this.$set(formList[index1], 'inputStatus', formList[index2].inputStatus);
        this._getSupplyWarehouseList(callback);
      } else {
        this.$set(this.pageConfig.projectForm, 'generalWarehouseName', '');
        this.$set(this.pageConfig.projectForm, 'generalWarehouseId', '');
        this.$set(formList[index1], 'inputStatus', 'hide');
        this.$set(formList[index], 'inputStatus', formList[index2].inputStatus);
      }
      // this.$nextTick(() => {
      //     this.$refs.editForm.handleClearValidate();
      // });
      if (type) {
        this.setSelectData(allocationTypeCode, formList);
      }
    },
    // 赋值
    setSelectData (allocationTypeCode, formList) {
      const index = formList.findIndex(v => v.prop === 'allocationTypeCode');
      const allocationList = formList[index].selectList;
      const index1 = allocationList.findIndex(v => v.dataCode === allocationTypeCode);
      if (index1 >= 0) {
        this.$set(this.pageConfig.projectForm, 'allocationTypeValue', allocationList[index1].dataName);
      }
    },
    // 获取总仓数据
    _getSupplyWarehouseList (callback) {
      const data = {
        belongOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        warehouseCode: '',
        warehouseName: ''
      };
      this.$store.dispatch('warAllocation/getSupplyWarehouseList', data).then(res => {
        if (res.status === 0) {
          const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'generalWarehouseId');
          if (index >= 0) {
            const warehouseList = res.results || [];
            this.$set(this.pageConfig.mainFormConfig.formList[index], 'selectList', warehouseList);
            if (warehouseList.length === 1) {
              this.$set(this.pageConfig.projectForm, 'generalWarehouseId', warehouseList[0].id);
              this.$set(this.pageConfig.projectForm, 'generalWarehouseName', warehouseList[0].warehouseName);
            }
            this.warehouseList = warehouseList;
            callback && callback();
          }
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
      });
    }
  }
};
</script>
