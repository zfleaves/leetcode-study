<!--
 * @Author: your name
 * @Date: 2021-04-19 12:00:02
 * @LastEditTime: 2022-07-11 16:03:05
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\subcontractorMaterial\materialsBothered\materialsBotheredEdit.vue
-->
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
            <g-edit-title :title="$t('fConfig.detailedList')">
              <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
              </g-button>
            </g-edit-title>
            <g-edit-pl-table :ref="subTable.subTableName" :type="type" :isSelection="subTable.isSelection"
              :tableConfig="subTable.tableList" :subTable="subTable" :delete.sync="deleteList[subTable.subTableName]"
              @editTableEvent="editTableEvent">
            </g-edit-pl-table>
          </div>
        </div>
      </div>
    </edit-page>
    <!-- 选择材料分类 -->
    <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
      <outboundMaterials slot="body" slot-scope="{ height }" :dialogHeight="height" :close.sync="dialogVisible"
        :selectList="varietiesIdList" :projectId="pageConfig.projectForm.projectId || ''"
        :projectUnitId="pageConfig.projectForm.projectUnitId || ''"
        varietiesTitle="materialsBothered.selectVarieties" @getData="getData">
      </outboundMaterials>
    </g-dialog>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';

export default {
  name: 'materialsBotheredEdit',
  mixins: [editPage],
  data () {
    return {
      page: new Page(),
      projectForm: {
        projectUnitId: '',
        projectUnitName: '',
        docNo: '',
        exitTime: '',
        id: null,
        mainExitMaterial: '',
        projectId: null,
        registerName: '',
        remarks: '',
        attachment: '',
        totalExcludeTaxAmount: 0,
        totalTaxAmount: 0,
        totalIncludeTaxAmount: 0,
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      },
      dialogImportFlag: false,
      // 选择材料
      dialogVisible: false,
      dialogConfig: {
        title: this.$t('materialsBothered.seleMaterialVarieties'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      varietiesIdList: []
    };
  },
  props: {
    processParmas: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    outboundMaterials (resolve) {
      require(['../components/outboundMaterials'], resolve);
    }
  },
  methods: {
    // 获取info数据
    async _getInfoData (id = 0) {
      await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
        this.getUnitList();
      });
    },
    // 选择项目后
    handleCheckProject(params) {
        this.handleSelect(params, 'projectName', () => {
            if (params.selectList.length) {
                this.getUnitList();
            } else {
                const key = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'projectUnitId');
                if (key >= 0) {
                    this.$set(this.pageConfig.mainFormConfig.formList[key], 'selectList', []);
                }
            }
        });
    },
    getUnitList() {
        // 获取领用单位
        const data1 = {
            projectId: this.pageConfig.projectForm.projectId,
            pageNo: 1,
            pageSize: 500,
            unitName: ''
        };
        this.$store.dispatch('warOutbound/getUnitList', data1).then(res => {
            if (res.status === 0) {
                const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'projectUnitId');
                if (index >= 0) {
                  for (const item of res.results.records) {
                      this.$set(item, 'name', `${item.unitName}-${item.unitContactName}-${item.unitContactInfo}`);
                  }
                  if (res.results.records && res.results.records.length === 1) {
                      this.$set(this.pageConfig.projectForm, 'projectUnitName', res.results.records[0].name);
                      this.$set(this.pageConfig.projectForm, 'projectUnitId', res.results.records[0].id);
                  }
                  this.$set(this.pageConfig.mainFormConfig.formList[index], 'selectList', res.results.records);
                }
            } else {
                this.$message.error(this.$t(`exception.${res.errorCode}`));
            }
        });
    },
    // 主表选择需要日期和拟使用部位后得回调
    handleSetRequiredDateUsePlace() {
      const { exitTime } = this.pageConfig.projectForm;
      const tableData = this.pageConfig.subTableConfig['subcontractMaterialExitDetail'].tableData;
      for (const item of tableData) {
        if (!item.exitTime && exitTime) {
          this.$set(item, 'exitTime', exitTime);
        }
      }
    },
    // 保存
    handleSave (isProcess = false) {
      this.$refs.editForm.getValidateForm(() => {
        const data = this.$clone(this.pageConfig.projectForm);
        const subcontractMaterialExitDetail = this.$refs.subcontractMaterialExitDetail[0].validateTableData();
        if (!subcontractMaterialExitDetail || subcontractMaterialExitDetail.length === 0) {
          // 存在未填写或个数错误的数据
          this.$message.error(
            `${this.$t('materialsBothered.subcontractMaterialExitDetail')}${this.$t('tips.notFilledIn')}`
          );
          return;
        }
        const materialBox = [];
        for (const i in subcontractMaterialExitDetail) {
          const item = subcontractMaterialExitDetail[i];
          if (i <= 4) {
            materialBox.push(item.varietiesName);
          }
        }
        data.mainExitMaterial = String(materialBox);
        data.details = subcontractMaterialExitDetail;
        this.handleSaveData(data, isProcess);
      });
    },
    handleCalculation ({ item, row, event, subTable, rowIndex }) {
      if (!row.exitQuantity) {
        row.exitQuantity = null;
      }
      if ((row.exitQuantity + row.exitApplyQuantity) > row.enterQuantity) {
        row.exitQuantity = null;
      }
      const exitQuantity = Number(row.exitQuantity) || 0; // 数量
      const includeUnitPrice = Number(row.includeUnitPrice) || 0; // 单价（含税）
      const taxRate = Number(row.taxRate) || 0; // 税率
      const includeTaxAmount = exitQuantity * includeUnitPrice; // 金额(含税)
      const excludeTaxAmount = includeTaxAmount / (1 + taxRate); // 金额(不含税)
      const taxAmount = includeTaxAmount / (1 + taxRate) * taxRate; // 税额
      const excludeUnitPrice = !exitQuantity ? 0 : includeTaxAmount / (1 + taxRate) / exitQuantity; // 单价不含税
      this.$set(row, 'exitQuantity', exitQuantity);
      this.$set(row, 'includeUnitPrice', includeUnitPrice);
      this.$set(row, 'taxRate', taxRate);
      this.$set(row, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));
      this.$set(row, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));
      this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
      this.$set(row, 'excludeUnitPrice', Number((excludeUnitPrice || 0).toFixed(8)));
      this.deletTableCallback('subcontractMaterialExitDetail');
    },
    // 批量删除后的回调
    deletTableCallback (tableName) {
      const data = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
      // 金额合计
      const totalExcludeTaxAmount = data.reduce((a, b, c) => {
          return a += Number(b.excludeTaxAmount || 0);
      }, 0);
      this.$set(this.pageConfig.projectForm, 'totalExcludeTaxAmount', Number(totalExcludeTaxAmount.toFixed(2)));
      // 税额合计
      const totalTaxAmount = data.reduce((a, b, c) => {
          return a += Number(b.taxAmount || 0);
      }, 0);
      this.$set(this.pageConfig.projectForm, 'totalTaxAmount', Number(totalTaxAmount.toFixed(2)));
      // 价税合计
      const totalIncludeTaxAmount = data.reduce((a, b, c) => {
          return a += Number(b.includeTaxAmount || 0);
      }, 0);
      this.$set(this.pageConfig.projectForm, 'totalIncludeTaxAmount', Number(totalIncludeTaxAmount.toFixed(2)));
    },
    // 选择明细
    sysHandleSelectDetail (tableName) {
      if (!this.pageConfig.projectForm.projectName) {
        this.$message.error(this.$t('tips.pleaseSelectProject'));
        return;
      }
      if (!this.pageConfig.projectForm.projectUnitId) {
        this.$message.error(`${this.$t('tips.pleaseSelect')}${this.$t('materialsBothered.projectUnitName')}`);
        return;
      }
      const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
      for (const item of tableData) {
        item.rowKey = `${item.eId}`;
      }
      this.varietiesIdList = tableData;
      this.dialogVisible = true;
    },
    // 获取选中的数据
    getData (arr) {
      const data = [];
      for (const item of arr) {
        data.push({
          varietiesName: item.varietiesName,
          models: item.models,
          unit: item.unit,
          brand: item.brand,
          standards: item.standards,
          enterQuantity: item.enterQuantity,
          exitApplyQuantity: item.exitApplyQuantity,
          subcontractMaterialEnterId: item.subcontractMaterialEnterId,
          eId: item.eId,
          exitQuantity: '',
          exitTime: this.projectForm.exitTime,
          includeUnitPrice: item.includeUnitPrice || 0,
          excludeUnitPrice: item.excludeUnitPrice || 0,
          taxRate: item.taxRate || 0,
          includeTaxAmount: 0,
          excludeTaxAmount: 0,
          taxAmount: 0,
          remarks: ''
        });
      }
      this.setSubTable('subcontractMaterialExitDetail', data);
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
            if (`${item.eId}` === `${val.eId}`) {
              selectTableList.push(item);
            }
          }
        }
        for (const item of arr) {
          const index = tableData.findIndex(
            v => `${v.eId}` === `${item.eId}`
          );
          if (index < 0) {
            selectTableList.push(item);
          }
        }
        this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', selectTableList);
      }
      this.dialogVisible = false;
    }
  }
};
</script>
