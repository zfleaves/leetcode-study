<!--
 * @Author: your name
 * @Date: 2021-04-19 11:59:38
 * @LastEditTime: 2022-07-11 15:47:28
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\subcontractorMaterial\materialApproach\materialApproachEdit.vue
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
            <g-edit-title :title="$t(`materialApproach.${subTable.subTableName}`)">
              <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
                <template slot-scope="{ parameter, buttonConfig }" slot="button-sysHandleImport">
                  <importFile :parameter="parameter" :buttonConfig="buttonConfig" @importData="getImportData"
                    :editPage="that" :subTable="subTable" :flowStatus="parameter.disabled" :importUrl="importUrl">
                  </importFile>
                </template>
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
    <!-- 导入 -->
    <g-import-dialog v-if="dialogImportFlag" @dialogEvent="dialogEvent" :dialogConfig="dialogConfig"
      :isVisible.sync="dialogImportFlag">
      <template slot="body" slot-scope="{ height }">
        <g-edit-table slot="body" ref="importTable" :height="height" :type="type"
          :isSelection="subImportTable.isSelection" :tableConfig="subImportTable.tableList" :subTable="subImportTable"
          :delete.sync="deleteImportList" @editTableEvent="editTableEvent">
        </g-edit-table>
      </template>
    </g-import-dialog>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';
import { importPage } from 'mixins/importMixins';

export default {
  name: 'materialApproachEdit',
  mixins: [editPage, importPage],
  data () {
    return {
      page: new Page(),
      projectForm: {
        projectUnitName: '',
        projectUnitId: '',
        docNo: '',
        enterTime: '',
        id: null,
        mainEnterMaterial: '',
        projectId: null,
        registerName: '',
        remarks: '',
        supplierName: '',
        attachment: '',
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
        title: this.$t('materialApproach.seleMaterialVarieties'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%',
        span: '0.75'
      },
      importUrl: '/promaterial/subcontracts/enter/importExcel'
    };
  },
  props: {
    processParmas: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    importFile (resolve) {
      require(['components/basicComponents/global/upload/importFile.vue'], resolve);
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
      const { enterTime } = this.pageConfig.projectForm;
      const tableData = this.pageConfig.subTableConfig['subcontractMaterialEnterDetail'].tableData;
      for (const item of tableData) {
        if (!item.enterTime && enterTime) {
          this.$set(item, 'enterTime', enterTime);
        }
      }
    },
    // 计算
    handleCalculation({item, row, event, subTable, rowIndex}) {
      if (item.prop === 'enterQuantity') {
        !row.enterQuantity && (row.enterQuantity = null);
        return;
      }
      if (item.prop === 'includeUnitPrice') {
          const enterQuantity = Number(row.enterQuantity) || 0; // 数量
          const includeUnitPrice = Number(row.includeUnitPrice) || 0; // 单价（含税）
          const includeTaxAmount = enterQuantity * includeUnitPrice;
          this.$set(row, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));
          const taxRate = Number(row.taxRate) || 0; // 税率
          const excludeTaxAmount = includeTaxAmount / (1 + taxRate); // 金额(不含税)
          const taxAmount = includeTaxAmount / (1 + taxRate) * taxRate; // 税额
          const excludeUnitPrice = !enterQuantity ? 0 : includeTaxAmount / (1 + taxRate) / enterQuantity; // 单价不含税
          this.$set(row, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));
          this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
          this.$set(row, 'excludeUnitPrice', Number((excludeUnitPrice || 0).toFixed(8)));
      }
      if (item.prop === 'includeTaxAmount' && (row.includeUnitPrice === '' || row.includeUnitPrice === null)) {
          const enterQuantity = Number(row.enterQuantity) || 0; // 数量
          const includeTaxAmount = Number(row.includeTaxAmount) || 0; // 金额（含税）
          const includeUnitPrice = includeTaxAmount / enterQuantity;
          this.$set(row, 'includeUnitPrice', !enterQuantity ? 0 : Number((includeUnitPrice || 0).toFixed(2)));
      }
      if (item.prop === 'enterQuantity' || item.prop === 'taxRate') {
          const enterQuantity = Number(row.enterQuantity) || 0; // 数量
          const includeUnitPrice = Number(row.includeUnitPrice) || 0; // 单价（含税）
          const taxRate = Number(row.taxRate) || 0; // 税率
          const includeTaxAmount = enterQuantity * includeUnitPrice; // 金额(含税)
          const excludeTaxAmount = includeTaxAmount / (1 + taxRate); // 金额(不含税)
          const taxAmount = includeTaxAmount / (1 + taxRate) * taxRate; // 税额
          const excludeUnitPrice = !enterQuantity ? 0 : includeTaxAmount / (1 + taxRate) / enterQuantity; // 单价不含税
          this.$set(row, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));
          this.$set(row, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));
          this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
          this.$set(row, 'excludeUnitPrice', Number((excludeUnitPrice || 0).toFixed(8)));
      }
      if (item.prop === 'includeTaxAmount' && row.includeUnitPrice >= 0) {
          const enterQuantity = Number(row.enterQuantity) || 0; // 数量
          const taxRate = Number(row.taxRate) || 0; // 税率
          const includeTaxAmount = Number(row.includeTaxAmount) || 0; // 金额(含税)
          const excludeTaxAmount = includeTaxAmount / (1 + taxRate); // 金额(不含税)
          const taxAmount = includeTaxAmount / (1 + taxRate) * taxRate; // 税额
          const excludeUnitPrice = !enterQuantity ? 0 : includeTaxAmount / (1 + taxRate) / enterQuantity; // 单价不含税
          this.$set(row, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));
          this.$set(row, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));
          this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
          this.$set(row, 'excludeUnitPrice', Number((excludeUnitPrice || 0).toFixed(8)));
      }
      this.deletTableCallback('subcontractMaterialEnterDetail');
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
    // 保存
    handleSave (isProcess = false) {
      this.$refs.editForm.getValidateForm(() => {
        const data = this.$clone(this.pageConfig.projectForm);
        const subcontractMaterialEnterDetail = this.$refs.subcontractMaterialEnterDetail[0].validateTableData();
        if (!subcontractMaterialEnterDetail || subcontractMaterialEnterDetail.length === 0) {
          // 存在未填写或个数错误的数据
          this.$message.error(
            `${this.$t('materialApproach.subcontractMaterialEnterDetail')}${this.$t('tips.notFilledIn')}`
          );
          return;
        }
        const materialBox = [];
        for (const i in subcontractMaterialEnterDetail) {
          const item = subcontractMaterialEnterDetail[i];
          if (i <= 4) {
            materialBox.push(item.varietiesName);
          }
        }
        data.mainEnterMaterial = String(materialBox);
        data.details = subcontractMaterialEnterDetail;
        this.handleSaveData(data, isProcess);
      });
    },
    // 导入前判断
    canImprotDetail () {
      if (this.pageConfig.subTableConfig.subcontractMaterialEnterDetail.tableData.length !== 0) {
        //   已存在明细清单，不能进行导入
        this.$message.error(`${this.$t('materialApproach.improtFrontTips')}`);
        return false;
      }
      return true;
    },
    // 获取导入模板数据
    getImportData (val) {
      if (!val.tableData || !val.tableData.length) {
        //   无导入数据，请查看导入表格是否正确
        this.$message.info(`${this.$t('tips.unllImport')}`);
        return;
      }
      this.deletTableCallback('subcontractMaterialEnterDetail');
      this.subImportTable = val;
      this.dialogImportFlag = true;
    }
  }
};
</script>
