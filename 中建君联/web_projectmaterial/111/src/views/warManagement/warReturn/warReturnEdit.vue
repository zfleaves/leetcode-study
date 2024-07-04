<template>
    <div>
        <edit-page @editEvent="editEvent" v-loading="loading">
            <div slot="editPage">
                <g-edit-form
                    ref="editForm"
                    v-if="pageConfigLoading"
                    :type="type"
                    :customRules="customRules"
                    :tableConfig="pageConfig.mainFormConfig"
                    :projectForm="pageConfig.projectForm"
                    @editFormEvent="editFormEvent">
                    <template slot="form-warehouseId" slot-scope="{scope, item}">
                        <el-form-item :label="$t(item.label)" :prop="item.prop"
                        :class="item.label.length > 7 && 'maxLabel'"
                        :title="$t(item.label)">
                            <el-select v-model.trim="scope.warehouseName" ref="elSelect"
                                :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'"
                                :disabled="item.inputStatus === 'disable'" filterable
                                :multiple='item.multiple || false' :collapse-tags='item.collapseTags || false'
                                :clearable="item.clearable === undefined ? true : item.clearable" style="width:100%"
                                @change="handleChangeWarehouseId(scope.warehouseName)"
                                @clear="handleClearWarehouseId()"
                            >
                            <el-option v-for="(child,i) in warehouseSelectList" :key="i"
                            :label="child.warehouseName"
                            :value="child.id">
                            </el-option>
                            </el-select>
                        </el-form-item>
                </template>
                </g-edit-form>
                <!-- 明细清单 -->
                <div v-if="pageConfigLoading">
                    <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
                        <g-edit-title :title="$t(`warReturn.${subTable.subTableName}`)" :titleTips="$t(`warReturn.${subTable.titleTips}`)">
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
                            <template slot="edit-table-currentReturnQuantity" slot-scope="{item, scope}">
                                <el-number v-if="item.inputStatus !== 'disable'" controls-position="right" size="small"
                                    :disabled="item.inputStatus === 'disable'"
                                    :min="item.min"
                                    :maxlength="Number(item.maxlength)" :precision="Number(item.precision)"
                                    v-model.trim="scope[item.prop]" :placeholder="item.placeholder"
                                    @change="handleCurrentIncomingQuantity(item, scope, scope.currentReturnQuantity, subTable, scope.$index)">
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
            <outboundMaterials slot="body" slot-scope="{height}" :dialogHeight="height"
                :close.sync="dialogVisible"
                :selectList="varietiesIdList"
                :warehouseId="pageConfig.projectForm.warehouseId || ''"
                :projectId="pageConfig.projectForm.projectId || 0"
                varietiesTitle="warReturn.selectVarieties"
                @getData="getData">
            </outboundMaterials>
        </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'warReturnEdit',
    mixins: [editPage],
    data () {
        const invoiceValid = (rule, value, callback) => {
            if (value) {
                const regular = /[0-9]*/;
                if (!regular.test(value)) {
                    callback(new Error(this.$t('tips.pleaseEnterANumber')));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        const currentReturnQuantityValid = (rule, value, callback) => {
            if (!value) {
                callback(new Error(this.$t('warReturn.currentReturnQuantityTips')));
            } else {
                callback();
            }
        };
        return {
            page: new Page(),
            projectForm: {
                attachment: '',
                mainReturnMaterials: '',
                returnAgentUserName: '',
                returnDate: this.$utils.commonUtil.formatTime(new Date()),
                outboundTypeCode: '01',
                outboundTypeValue: '',
                pickingUnitId: '',
                pickingUnitName: '',
                projectId: '',
                remarks: '',
                usePlaceId: '',
                usePlaceName: '',
                warehouseId: '',
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            },
            // 选择材料
            dialogVisible: false,
            dialogConfig: {
                title: this.$t('warReturn.seleMaterialVarieties'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '90%',
                span: '0.75'
            },
            customRules: {
                invoiceCode: [{ validator: invoiceValid, trigger: 'blur' }],
                invoiceNo: [{ validator: invoiceValid, trigger: 'blur' }]
            },
            subTableCustomRules: {
                currentReturnQuantity: [{required: true, validator: currentReturnQuantityValid, trigger: 'blur' }]
            },
            varietiesIdList: [],
            warehouseShelvesList: [],
            oldWarehouseId: '',
            oldWarehouseName: '',
            warehouseSelectList: []
        };
    },
    props: {
        processParmas: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        outboundMaterials(resolve) {
            require(['components/material/outboundMaterials/outboundMaterials.vue'], resolve);
        }
    },
    methods: {
        // 获取info数据
        async _getInfoData(id = 0) {
            await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
                this.getWarehouseList(true);
                this.oldWarehouseId = this.pageConfig.projectForm.warehouseId;
                this.oldWarehouseName = this.pageConfig.projectForm.warehouseName;
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
            this.$store.dispatch('warReturn/getWarehouseList', data).then(res => {
                if (res.status === 0) {
                    // const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'warehouseId');
                    // if (index >= 0) {
                    //     this.$set(this.pageConfig.mainFormConfig.formList[index], 'selectList', res.results);
                    // }
                    this.warehouseSelectList = res.results;
                    // 仓库赋值
                    if (res.results && res.results.length && !callback) {
                        this.setWareHouse && this.setWareHouse([res.results[0]]);
                    }
                    callback && callback();
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
        },
        handleChangeWarehouseId(warehouseId) {
            if (warehouseId) {
                this.$set(this.pageConfig.projectForm, 'warehouseId', warehouseId);
                const index = this.warehouseSelectList.findIndex(v => v.id === warehouseId);
                if (index >= 0) {
                    this.$set(this.pageConfig.projectForm, 'warehouseName', this.warehouseSelectList[index].warehouseName);
                }
            }
            if (this.pageConfig.subTableConfig['warehouseReturnDetail'].tableData.length) {
                if (warehouseId !== this.oldWarehouseId) {
                    this.$confirm(this.$t('warReturn.warehouseChangePrompt'), this.$t('tips.dataChangePrompt'), {
                        confirmButtonText: this.$t('button.determine'),
                        cancelButtonText: this.$t('button.close'),
                        dangerouslyUseHTMLString: true,
                        type: 'warning'
                    }).then(() => {
                        this.pageConfig.subTableConfig['warehouseReturnDetail'].tableData = [];
                        this.$set(this.$refs.elSelect, 'visible', false);
                    }).catch(() => {
                        this.$set(this.pageConfig.projectForm, 'warehouseId', this.oldWarehouseId);
                        this.$set(this.pageConfig.projectForm, 'warehouseName', this.oldWarehouseName);
                        this.$set(this.$refs.elSelect, 'visible', false);
                    });
                }
            }
            this.$set(this.$refs.elSelect, 'visible', false);
        },

        handleClearWarehouseId() {
            this.$set(this.pageConfig.projectForm, 'warehouseId', '');
            this.$set(this.pageConfig.projectForm, 'warehouseName', '');
        },
        // 选择明细
        sysHandleSelectDetail(tableName) {
            if (!this.pageConfig.projectForm.projectName) {
                this.$message.error(this.$t('tips.pleaseSelectProject'));
                return;
            }
            // if (!this.pageConfig.projectForm.warehouseId) {
            //     this.$message.error(this.$t('warReturn.pleaseSelectWarehouse'));
            //     return;
            // }
            const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
            for (const item of tableData) {
                item.rowKey = `${item.hashColumn}-${item.outboundMainId}-${item.eId}-${item.materialId}`;
            }
            this.varietiesIdList = tableData;
            this.dialogVisible = true;
        },
        // 获取选中的数据
        getData(arr) {
            if (arr.length) {
                this.$set(this.pageConfig.projectForm, 'warehouseId', arr[0].warehouseId);
                this.$set(this.pageConfig.projectForm, 'warehouseName', arr[0].warehouseName);
                this.oldWarehouseId = arr[0].warehouseId;
                this.oldWarehouseName = arr[0].warehouseName;
            }
            if (!arr.length) {
                this.$set(this.pageConfig.projectForm, 'warehouseId', '');
                this.$set(this.pageConfig.projectForm, 'warehouseName', '');
                this.oldWarehouseId = '';
                this.oldWarehouseName = '';
            }
            for (const item of arr) {
                item.eId = item.eId ? item.eId : item.id;
                item.outboundMainId = item.outboundMainId ? item.outboundMainId : item.outboundId;
            }
            this.setSubTable('warehouseReturnDetail', arr);
        },
        setSubTable(tableName, arr) {
            const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
            const selectTableList = [];
            const newSelectTableList = [];
            if (!tableData.length || !arr.length) {
                const subTableData = this.setSubTableList(arr);
                this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', subTableData);
                this.setMainCheckMaterials(tableName);
            }
            if (tableData.length) {
                for (const item of tableData) {
                    for (const val of arr) {
                        if (`${item.hashColumn}-${item.outboundMainId}-${item.eId}-${item.materialId}` ===
                        `${val.hashColumn}-${val.outboundMainId}-${val.eId}-${val.materialId}`) {
                            selectTableList.push(item);
                        }
                    }
                }
                for (const item of arr) {
                    const index = tableData.findIndex(v => `${v.hashColumn}-${v.outboundMainId}-${v.eId}-${v.materialId}` ===
                    `${item.hashColumn}-${item.outboundMainId}-${item.eId}-${item.materialId}`);
                    if (index < 0) {
                        newSelectTableList.push(item);
                    }
                }
                const setSubTableList = this.setSubTableList(newSelectTableList);
                this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', selectTableList.concat(setSubTableList));
                this.setMainCheckMaterials(tableName);
            }
            this.dialogVisible = false;
        },
        setSubTableList(arr) {
            const data = [];
            for (const item of arr) {
                data.push(
                    {
                        materialId: item.materialId,
                        materialName: item.materialName,
                        materialCode: item.materialCode,
                        models: item.models,
                        unit: item.unit,
                        brand: item.brand,
                        standards: item.standards,
                        alreadyReturnQuantity: item.returnQuantity,
                        createTime: this.$utils.commonUtil.formatTime(new Date()),
                        currencyCode: item.currencyCode,
                        currencyValue: item.currencyValue,
                        currentReturnQuantity: 0,
                        eId: item.eId,
                        excludeTaxAmount: 0,
                        hashColumn: item.hashColumn,
                        includeTaxAmount: 0,
                        outboundMainId: item.outboundMainId,
                        outboundQuantity: item.currentOutboundQuantity,
                        outboundUnitPrice: item.outboundUnitPrice,
                        pickingUnitId: item.pickingUnitId,
                        pickingUnitName: item.pickingUnitName,
                        remarks: '',
                        returnUnitPrice: item.unitPrice,
                        taxAmount: 0,
                        taxRate: item.taxRate,
                        unitPrice: item.unitPrice,
                        warehouseShelvesId: item.warehouseShelvesId,
                        warehouseShelvesName: item.warehouseShelvesName,
                        warrantyExpiredDate: item.warrantyExpiredDate
                    }
                );
            }
            return data;
        },
        // 批量删除后的回调
        deletTableCallback(tableName) {
            this.setMainCheckMaterials(tableName);
        },
        handleCurrentIncomingQuantity(item, row, event, subTable, rowIndex) {
            const quantity = (Number(row.outboundQuantity - row.alreadyReturnQuantity)).toFixed(4);
            if (row.currentReturnQuantity > quantity) {
                // 最大可退数量为：{keyValue}，请重新填写！ 必须用户点击确认。
                const msg = this.$t('warReturn.overQuantityTips').replace('{keyValue}', quantity);
                this.$alert(msg, this.$t('tips.tips'), {
                confirmButtonText: this.$t('button.determine'),
                    callback: () => {
                        this.$set(row, 'currentReturnQuantity', null);
                        const data = {item, row, event, subTable, rowIndex};
                        this.handleCalculation(data);
                    }
                });
            } else {
                const data = {item, row, event, subTable, rowIndex};
                this.handleCalculation(data);
            }
        },
        // 数值计算
        handleCalculation({item, row, event, subTable, rowIndex}) {
            // 金额(不含税)
            row.excludeTaxAmount = ((Number(row.currentReturnQuantity) || 0) * (Number(row.outboundUnitPrice) || 0)).toFixed(2);
            // 税额
            row.taxAmount = ((Number(row.excludeTaxAmount) || 0) * (Number(row.taxRate) || 0)).toFixed(2);
            // 金额(含税)
            row.includeTaxAmount = (Number(row.excludeTaxAmount) || 0) + (Number(row.taxAmount) || 0);
        },
        // 获取拟采购内容
        setMainCheckMaterials(tableName) {
            const mainReturnMaterials = this.pageConfig.subTableConfig[tableName].tableData.slice(-5).map(v => v.materialName).join(',');
            this.$set(this.pageConfig.projectForm, 'mainReturnMaterials', mainReturnMaterials);
        },
        // 保存
        handleSave (isProcess = false) {
            this.$refs.editForm.getValidateForm(() => {
                this.setMainCheckMaterials('warehouseReturnDetail');
                const data = this.$clone(this.pageConfig.projectForm);
                const warehouseReturnDetail = this.$refs.warehouseReturnDetail[0].validateTableData();
                if (!warehouseReturnDetail || warehouseReturnDetail.length === 0) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('warReturn.warehouseReturnDetail')}${this.$t('tips.notFilledIn')}`);
                    return;
                }
                data.returnDetails = warehouseReturnDetail;
                this.handleSaveData(data, isProcess);
            });
        }
    }
};
</script>
