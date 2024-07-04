<!--
 * @Author: your name
 * @Date: 2020-07-30 10:35:06
 * @LastEditTime: 2022-06-07 10:45:23
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\warReportloss\warIncomingEdit.vue
-->
<template>
    <div>
        <edit-page @editEvent="editEvent" v-loading="loading">
            <div slot="editPage">
                <g-edit-form
                    ref="editForm"
                    v-if="pageConfigLoading"
                    :type="type"
                    :tableConfig="pageConfig.mainFormConfig"
                    :projectForm="pageConfig.projectForm"
                    @editFormEvent="editFormEvent">
                </g-edit-form>
                <!-- 明细清单 -->
                <div v-if="pageConfigLoading">
                    <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
                        <g-edit-title :title="$t(`warReportloss.${subTable.subTableName}`)" :titleTips="$t(`warReportloss.${subTable.titleTips}`)">
                            <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
                            </g-button>
                        </g-edit-title>
                        <g-edit-pl-table
                            :ref="subTable.subTableName"
                            :type="type"
                            :isSelection="subTable.isSelection"
                            :tableConfig="subTable.tableList"
                            :subTable='subTable'
                            :customRules="subTableCustomRules"
                            :delete.sync="deleteList[subTable.subTableName]"
                            @editTableEvent='editTableEvent'>
                            <template slot="edit-table-currentReportlossQuantity" slot-scope="{item, scope}">
                                <el-number v-if="item.inputStatus !== 'disable'" controls-position="right" size="small"
                                    :disabled="item.inputStatus === 'disable'"
                                    :max="scope.stock"
                                    min="0"
                                    :maxlength="Number(item.maxlength)" :precision="Number(item.precision)"
                                    v-model.trim="scope[item.prop]" :placeholder="item.placeholder"
                                    @change="handleCurrentIncomingQuantity(item, scope, scope.currentReportlossQuantity, subTable, scope.$index)">
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
            <stockMaterials slot="body" slot-scope="{height}" :dialogHeight="height"
                :close.sync="dialogVisible"
                :selectList="varietiesIdList"
                :warehouseId="pageConfig.projectForm.warehouseId || 0"
                :projectId="pageConfig.projectForm.projectId || 0"
                varietiesTitle="warReportloss.selectVarieties"
                @getData="getData">
            </stockMaterials>
        </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'warReportlossEdit',
    mixins: [editPage],
    data () {
        const currentReportlossQuantityValid = (rule, value, callback) => {
            if (!value) {
                callback(new Error(this.$t('warReportloss.currentReportlossQuantityTips')));
            } else {
                callback();
            }
        };
        return {
            page: new Page(),
            projectForm: {
                attachment: '',
                mainReportlossMaterials: '',
                projectId: '',
                remarks: '',
                reportlossAgentUserName: '',
                reportlossDate: '',
                totalAmount: 0,
                totalPriceTax: 0,
                totalTaxAmount: 0,
                warehouseId: '',
                warehouseName: '',
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            },
            // 选择材料
            dialogVisible: false,
            dialogConfig: {
                title: this.$t('warReportloss.seleMaterialVarieties'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '80%',
                span: '0.75'
            },
            subTableCustomRules: {
                currentReportlossQuantity: [{required: true, validator: currentReportlossQuantityValid, trigger: 'blur' }]
            },
            varietiesIdList: [],
            warehouseShelvesList: []
        };
    },
    props: {
        processParmas: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        stockMaterials(resolve) {
            require(['components/material/stockMaterials/stockMaterials.vue'], resolve);
        }
    },
    methods: {
        // 获取info数据
        async _getInfoData(id = 0) {
            await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
                this.getWarehouseList(true);
            });
        },
        // 选择项目后
        handleCheckProject(params) {
            this.handleSelect(params, 'projectName', () => {
                if (params.selectList.length) {
                    this.getWarehouseList();
                } else {
                    const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'warehouseId');
                    if (index >= 0) {
                        this.$set(this.pageConfig.mainFormConfig.formList[index], 'selectList', []);
                    }
                    const key = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'pickingUnitId');
                    if (index >= 0) {
                        this.$set(this.pageConfig.mainFormConfig.formList[key], 'selectList', []);
                    }
                }
            });
        },
        getWarehouseList(callback) {
            // 获取仓库
            const data = {
                pageNo: 1,
                pageSize: 50,
                projectId: this.pageConfig.projectForm.projectId,
                warehouseCode: '',
                warehouseName: ''
            };
            this.$store.dispatch('warReportloss/getWarehouseList', data).then(res => {
                if (res.status === 0) {
                    const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'warehouseId');
                    if (index >= 0) {
                        this.$set(this.pageConfig.mainFormConfig.formList[index], 'selectList', res.results);
                    }
                    // 仓库赋值
                    if (res.results && res.results.length && !callback) {
                        this.setWareHouse && this.setWareHouse([res.results[0]]);
                    }
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
            // 获取领用单位
            const data1 = {
                pageNo: 1,
                pageSize: 50,
                projectId: this.pageConfig.projectForm.projectId,
                unitName: ''
            };
            this.$store.dispatch('warReportloss/getUnitList', data1).then(res => {
                if (res.status === 0) {
                    const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'pickingUnitId');
                    if (index >= 0) {
                        if (res.results.records && res.results.records.length === 1) {
                            this.$set(this.pageConfig.projectForm, 'pickingUnitName', res.results.records[0].unitName);
                            this.$set(this.pageConfig.projectForm, 'pickingUnitId', res.results.records[0].id);
                        }
                        this.$set(this.pageConfig.mainFormConfig.formList[index], 'selectList', res.results.records);
                    }
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
        },
        // 选择明细
        sysHandleSelectDetail(tableName) {
            if (!this.pageConfig.projectForm.projectName) {
                this.$message.error(this.$t('tips.pleaseSelectProject'));
                return;
            }
            if (!this.pageConfig.projectForm.warehouseId) {
                this.$message.error(this.$t('warReportloss.pleaseSelectWarehouse'));
                return;
            }
            const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
            for (const item of tableData) {
                item.rowKey = `${item.hashColumn}-${item.materialId}`;
            }
            this.varietiesIdList = tableData;
            this.dialogVisible = true;
        },
        // 获取选中的数据
        getData(arr) {
            const data = [];
            for (const item of arr) {
                data.push(
                    {
                        alreadyReportlossQuantity: 0,
                        createTime: this.$utils.commonUtil.formatTime(new Date()),
                        currencyCode: item.currencyCode,
                        currencyValue: item.currencyValue,
                        currentReportlossQuantity: 0,
                        excludeTaxAmount: 0,
                        hashColumn: item.hashColumn,
                        includeTaxAmount: 0,
                        materialId: item.materialId,
                        materialName: item.materialName,
                        materialCode: item.materialCode,
                        models: item.models,
                        unit: item.unit,
                        brand: item.brand,
                        standards: item.standards,
                        preReportlossQuantity: 0,
                        preIncludeTaxAmount: 0,
                        remarks: '',
                        eId: item.id,
                        reportlossUnitPrice: item.unitPrice,
                        stock: item.availableStock,
                        realStock: item.availableStock,
                        taxAmount: 0,
                        taxRate: item.taxRate,
                        unitPrice: item.unitPrice,
                        warehouseShelvesId: item.warehouseShelvesId,
                        warehouseShelvesName: item.warehouseShelvesName,
                        warrantyExpiredDate: item.warrantyExpiredDate
                    }
                );
            }
            this.setSubTable('warehouseReportlossDetail', data);
        },
        setSubTable(tableName, arr) {
            const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
            const selectTableList = [];
            if (!tableData.length || !arr.length) {
                this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', arr);
                this.setMainCheckMaterials(tableName);
            }
            if (tableData.length) {
                for (const item of tableData) {
                    for (const val of arr) {
                        if (`${item.hashColumn}-${item.materialId}` === `${val.hashColumn}-${val.materialId}`) {
                            selectTableList.push(item);
                        }
                    }
                }
                for (const item of arr) {
                    const index = tableData.findIndex(v => `${v.hashColumn}-${v.materialId}` === `${item.hashColumn}-${item.materialId}`);
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
        deletTableCallback(tableName) {
            this.setMainCheckMaterials(tableName);
        },
        handleCurrentIncomingQuantity(item, row, event, subTable, rowIndex) {
            const data = {item, row, event, subTable, rowIndex};
            this.handleCalculation(data);
        },
        // 数值计算
        handleCalculation({item, row, event, subTable, rowIndex}) {
            this._getCalculationAmount(row, subTable.subTableName);
        },
        // 获取拟采购内容
        setMainCheckMaterials(tableName) {
            const mainReportlossMaterials = this.pageConfig.subTableConfig[tableName].tableData.slice(-5).map(v => v.materialName).join(',');
            this.$set(this.pageConfig.projectForm, 'mainReportlossMaterials', mainReportlossMaterials);
            this.setAmount(tableName);
        },
        // 计算金额
        _getCalculationAmount(row, tableName) {
            const data = {
                excludeTaxAmount: row.excludeTaxAmount,
                hashVal: row.hashColumn,
                preIncludeTaxAmount: row.preIncludeTaxAmount,
                includeTaxAmount: row.includeTaxAmount,
                preQuantity: row.preReportlossQuantity,
                quantity: row.currentReportlossQuantity,
                taxAmount: row.taxAmount,
                taxRate: row.taxRate,
                unitPrice: row.unitPrice
            };
            this.$store.dispatch('warWarehouse/getCalculationAmount', data).then(res => {
                if (res.status === 0) {
                    const results = res.results;
                    row.excludeTaxAmount = results.excludeTaxAmount;
                    row.includeTaxAmount = results.includeTaxAmount;
                    row.preReportlossQuantity = results.preQuantity;
                    row.currentReportlossQuantity = results.quantity;
                    row.taxAmount = results.taxAmount;
                    row.reportlossUnitPrice = results.unitPrice;
                    this.setAmount(tableName);
                } else {
                    row.excludeTaxAmount = 0;
                    row.includeTaxAmount = 0;
                    row.currentReportlossQuantity = 0;
                    row.taxAmount = 0;
                    row.reportlossUnitPrice = 0;
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
        },
        // 设置金额
        setAmount(tableName) {
            const data = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
            // 金额合计
            const totalAmount = data.reduce((a, b, c) => {
                return a += Number(b.excludeTaxAmount);
            }, 0);
            this.$set(this.pageConfig.projectForm, 'totalAmount', Number(totalAmount.toFixed(2)));
            // 税额合计
            const totalTaxAmount = data.reduce((a, b, c) => {
                return a += Number(b.taxAmount);
            }, 0);
            this.$set(this.pageConfig.projectForm, 'totalTaxAmount', Number(totalTaxAmount.toFixed(2)));
            // 价税合计
            const totalPriceTax = data.reduce((a, b, c) => {
                return a += Number(b.includeTaxAmount);
            }, 0);
            this.$set(this.pageConfig.projectForm, 'totalPriceTax', Number(totalPriceTax.toFixed(2)));
        },
        // 保存
        handleSave (isProcess = false) {
            this.$refs.editForm.getValidateForm(() => {
                this.setMainCheckMaterials('warehouseReportlossDetail');
                const data = this.$clone(this.pageConfig.projectForm);
                const warehouseReportlossDetail = this.$refs.warehouseReportlossDetail[0].validateTableData();
                if (!warehouseReportlossDetail || warehouseReportlossDetail.length === 0) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('warReportloss.warehouseReportlossDetail')}${this.$t('tips.notFilledIn')}`);
                    return;
                }
                data.reportlossDetails = warehouseReportlossDetail;
                this.handleSaveData(data, isProcess);
            });
        }
    }
};
</script>
