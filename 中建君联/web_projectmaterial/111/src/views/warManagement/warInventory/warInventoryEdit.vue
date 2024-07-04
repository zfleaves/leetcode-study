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
                        <g-edit-title :title="$t(`warInventory.${subTable.subTableName}`)" :titleTips="$t(`warInventory.${subTable.titleTips}`)">
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
                            <template slot="edit-table-inventoryQuantity" slot-scope="{item, scope}">
                                <el-number v-if="item.inputStatus !== 'disable'" controls-position="right" size="small"
                                    :disabled="item.inputStatus === 'disable'"
                                    :maxlength="Number(item.maxlength)" :precision="Number(item.precision)"
                                    v-model.trim="scope[item.prop]" :placeholder="item.placeholder"
                                    @change="handleCurrentIncomingQuantity(item, scope, scope.inventoryQuantity, subTable, scope.$index)">
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
                varietiesTitle="warInventory.selectVarieties"
                @getData="getData">
            </stockMaterials>
        </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'warInventoryEdit',
    mixins: [editPage],
    data () {
        const inventoryQuantityValid = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('warInventory.inventoryQuantityTips')));
            } else {
                callback();
            }
        };
        return {
            page: new Page(),
            projectForm: {
                attachment: '',
                inventoryDate: '',
                inventorySituation: '',
                inventoryUserName: '',
                projectId: 0,
                remarks: '',
                warehouseId: 0,
                warehouseName: '',
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            },
            // 选择材料
            dialogVisible: false,
            dialogConfig: {
                title: this.$t('warInventory.seleMaterialVarieties'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '80%',
                span: '0.75'
            },
            subTableCustomRules: {
                inventoryQuantity: [{required: true, validator: inventoryQuantityValid, trigger: 'blur' }]
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
            this.$store.dispatch('warInventory/getWarehouseList', data).then(res => {
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
        },
        // 选择明细
        sysHandleSelectDetail(tableName) {
            if (!this.pageConfig.projectForm.projectName) {
                this.$message.error(this.$t('tips.pleaseSelectProject'));
                return;
            }
            if (!this.pageConfig.projectForm.warehouseId) {
                this.$message.error(this.$t('warInventory.pleaseSelectWarehouse'));
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
                        createTime: this.$utils.commonUtil.formatTime(new Date()),
                        currencyCode: item.currencyCode,
                        currencyValue: item.currencyValue,
                        inventoryLossQuantity: 0,
                        inventoryProfitQuantity: 0,
                        inventoryQuantity: '',
                        hashColumn: item.hashColumn,
                        materialId: item.materialId,
                        materialName: item.materialName,
                        materialCode: item.materialCode,
                        models: item.models,
                        unit: item.unit,
                        brand: item.brand,
                        standards: item.standards,
                        realStock: item.realStock,
                        remarks: '',
                        stock: item.availableStock,
                        taxRate: item.taxRate,
                        unitPrice: item.unitPrice,
                        warehouseShelvesId: item.warehouseShelvesId,
                        warehouseShelvesName: item.warehouseShelvesName,
                        warrantyExpiredDate: item.warrantyExpiredDate
                    }
                );
            }
            this.setSubTable('warehouseInventoryDetail', data);
        },
        setSubTable(tableName, arr) {
            const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
            const selectTableList = [];
            if (!tableData.length || !arr.length) {
                this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', arr);
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
            }
            this.dialogVisible = false;
        },
        handleCurrentIncomingQuantity(item, row, event, subTable, rowIndex) {
            if (row.inventoryQuantity - row.realStock < 0) {
                row.inventoryLossQuantity = (row.realStock - row.inventoryQuantity).toFixed(4);
                row.inventoryProfitQuantity = '';
            }
            if (row.inventoryQuantity - row.realStock > 0) {
                row.inventoryProfitQuantity = (row.inventoryQuantity - row.realStock).toFixed(4);
                row.inventoryLossQuantity = '';
            }
            if (row.inventoryQuantity - row.realStock === 0) {
                row.inventoryProfitQuantity = '';
                row.inventoryLossQuantity = '';
            }
        },
        // 保存
        handleSave (isProcess = false) {
            this.$refs.editForm.getValidateForm(() => {
                const data = this.$clone(this.pageConfig.projectForm);
                const warehouseInventoryDetail = this.$refs.warehouseInventoryDetail[0].validateTableData();
                if (!warehouseInventoryDetail || warehouseInventoryDetail.length === 0) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('warInventory.warehouseInventoryDetail')}${this.$t('tips.notFilledIn')}`);
                    return;
                }
                data.inventoryDetails = warehouseInventoryDetail;
                this.handleSaveData(data, isProcess);
            });
        }
    }
};
</script>
