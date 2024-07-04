<!--
 * @Author: your name
 * @Date: 2020-07-30 10:35:06
 * @LastEditTime: 2022-07-14 14:19:51
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\warOutbound\warIncomingEdit.vue
-->
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
                    <template slot="tips-pickingUnitId">
                        <el-tooltip placement="top">
                            <div slot="content" style="line-height: 24px;">
                                <div>
                                    <!-- 数据维护及来源路径： -->
                                    {{$t('warOutbound.pickingUnitTips1')}}<br>
                                    <span style="color: rgb(20, 137, 44);">{{$t('warOutbound.pickingUnitTips2')}}</span><br>
                                    <!-- 您可以在此路径菜单中添加本项目的领料单位以供选择 -->
                                    {{$t('warOutbound.pickingUnitTips3')}}
                                </div>
                            </div>
                            <span class="tips-item"><i class="el-icon-question"></i></span>
                        </el-tooltip>
                    </template>
                    <!-- 备注 -->
                    <template slot="form-remarks" slot-scope="{ scope, item }">
                        <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
                        :title="$t(item.label)">
                            <div class="slot-input">
                                <el-input type="textarea" @blur="handleBlurRemarks(scope[item.prop])"
                                    v-model="scope[item.prop]" :placeholder="item.placeholder ? $t(item.placeholder) : ''"
                                    :size="item.size || 'small'" :clearable="item.clearable === undefined ? true : item.clearable"
                                    :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)" show-word-limit
                                    :autosize="{ minRows: item.minRows, maxRows: item.maxRows}">
                                </el-input>
                            </div>
                        </el-form-item>
                    </template>
                    <template slot="form-expendContractName" slot-scope="{scope, item}">
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
                </g-edit-form>
                <!-- 明细清单 -->
                <div v-if="pageConfigLoading">
                    <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
                        <g-edit-title :title="$t(`warOutbound.${subTable.subTableName}`)" :titleTips="$t(`warOutbound.${subTable.titleTips}`)">
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
                            <template slot="edit-table-currentOutboundQuantity" slot-scope="{item, scope}">
                                <el-number v-if="item.inputStatus !== 'disable'" controls-position="right" size="small"
                                    :disabled="item.inputStatus === 'disable'" min="0"
                                    :maxlength="Number(item.maxlength)" :precision="Number(item.precision)"
                                    v-model.trim="scope[item.prop]" :placeholder="item.placeholder"
                                    @change="handleCurrentIncomingQuantity(item, scope, scope.currentOutboundQuantity, subTable, scope.$index)">
                                </el-number>
                                <div class="ellipsis" v-else>{{scope[item.prop]}}</div>
                            </template>
                            <template slot="edit-table-usePlaceName" slot-scope="{item, scope, rowIndex}">
                                <div v-if="item.inputStatus !== 'disable'" class="slot-input">
                                    <el-input
                                        v-model.trim="scope[item.prop]"
                                        :size="item.size || 'small'"
                                        readonly>
                                        <template slot="suffix" v-if="item.inputStatus !== 'disable' && pageDisabled">
                                            <i v-if="scope[item.prop]" class="slot-close el-icon-circle-close"
                                            @click="handleSubTableClearProjectChild(item, scope, rowIndex, subTable.subTableName)"></i>
                                            <i class="multiple-choice-icon iconfont icon-menu"
                                            @click="handleSubTableSelectProjectChild(item, scope, rowIndex, subTable.subTableName)"></i>
                                        </template>
                                    </el-input>
                                </div>
                                <div class="ellipsis" v-else>{{scope.usePlaceName}}</div>
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
                varietiesTitle="warOutbound.selectVarieties"
                type="warOutbound"
                @getData="getData">
            </stockMaterials>
        </g-dialog>
        <!-- 选择子工程 -->
        <g-dialog v-if="projectChildFlag" :dialogConfig="projectChildDialogConfig" :isVisible.sync="projectChildFlag">
            <usePlaceDialog slot="body" slot-scope="{height}" :dialogHeight="height"
            :selectId='subTableRow.row.usePlaceId || 0'
            :projectId="pageConfig.projectForm.projectId || 0"
            :close.sync="projectChildFlag" @getData="getProjectChild" v-if="projectChildFlag"></usePlaceDialog>
        </g-dialog>
        <!-- 选择合同 -->
        <g-dialog v-if="dialogContract" :dialogConfig="dialogConfigContract" :isVisible.sync="dialogContract">
            <contract slot="body" slot-scope="{height}" :dialogHeight="height"
                :selectId='pageConfig.projectForm.expendContractId' :projectId="pageConfig.projectForm.projectId"
                :projectName="pageConfig.projectForm.projectName" :close.sync="dialogContract" @getData="getContractData"
                v-if="dialogContract">
            </contract>
        </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'warOutboundEdit',
    mixins: [editPage],
    beforeRouteEnter (to, from, next) {
        if (to.name === 'warOutboundEdit') {
            const Base64 = require('js-base64').Base64;
            // console.log(Base64, 'Base64');
            const inComingId = Number(Base64.decode(to.params.inComingId));
            const type = Base64.decode(to.params.type);
            if (type === 'add' && inComingId) {
                to.meta.lastRouterName = 'warIncoming';
            } else {
                to.meta.lastRouterName = 'warOutbound';
            }
        }
        next();
    },
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
        const currentOutboundQuantityValid = (rule, value, callback) => {
            if (!value) {
                callback(new Error(this.$t('warOutbound.currentOutboundQuantityTips')));
            } else {
                callback();
            }
        };
        return {
            page: new Page(),
            projectForm: {
                incomingId: '',
                attachment: '',
                mainOutboundMaterials: '',
                outboundAgentUserName: '',
                outboundDate: this.$utils.commonUtil.formatTime(new Date()),
                outboundTypeCode: '01',
                outboundTypeValue: '',
                pickingUnitId: '',
                pickingUnitName: '',
                projectId: '',
                projectName: '',
                projectCode: '',
                remarks: '',
                usePlaceId: '',
                usePlaceName: '',
                warehouseId: '',
                warehouseName: '',
                totalAmount: 0,
                totalTaxAmount: 0,
                totalPriceTax: 0,
                expendContractName: '',
                expendContractId: '',
                expendContractCode: '',
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            },
            // 选择材料
            dialogVisible: false,
            dialogConfig: {
                title: this.$t('warOutbound.seleMaterialVarieties'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '80%',
                span: '0.75'
            },
            customRules: {
                invoiceCode: [{ validator: invoiceValid, trigger: 'blur' }],
                invoiceNo: [{ validator: invoiceValid, trigger: 'blur' }]
            },
            subTableCustomRules: {
                currentOutboundQuantity: [{required: true, validator: currentOutboundQuantityValid, trigger: 'blur' }]
            },
            varietiesIdList: [],
            warehouseShelvesList: [],
            // 子工程
            projectChildFlag: false,
            projectChildDialogConfig: {
                title: this.$t('dialog.selectProjectChild'),
                appendBody: false,
                center: true,
                top: '80px',
                width: '60%',
                span: '0.7'
            },
            subTableRow: {},
            inComingId: 0,
            fastLoading: null,
            // 选择合同
            dialogContract: false,
            dialogConfigContract: {
                title: this.$t('tips.pleaseSelectContract'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '80%',
                span: '0.75'
            },
            contractConfig: null
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
        },
        usePlaceDialog(resolve) {
          require(['components/basicComponents/global/dialog/usePlaceDialog/usePlaceDialog.vue'], resolve);
        },
        contract (resolve) {
            require(['views/demandPlan/components/contract/contract.vue'], resolve);
        }
    },
    created() {
        this.inComingId = Number(this.$base64.decode(this.$route.params.inComingId));
        if (this.type === 'add' && this.inComingId) {
            this.fastLoading = this.$loading({
                lock: true,
                text: this.$t('tips.waitTips'),
                background: 'rgba(255, 255, 255, 0.5)'
            });
            // 一键出库
            this.handleDelivery();
        }
    },
    methods: {
        // 获取info数据
        async _getInfoData(id = 0) {
            await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
                this.getWarehouseList(true);
            });
        },
        // 一键出库
        handleDelivery() {
            this.getIncomingInfo();
        },
        // 主表选择需要日期和拟使用部位后得回调
        handleSetRequiredDateUsePlace() {
            const { usePlaceId, usePlaceName } = this.pageConfig.projectForm;
            const tableData = this.pageConfig.subTableConfig['warehouseOutboundDetail'].tableData;
            for (const item of tableData) {
                if (!item.usePlaceName && usePlaceName) {
                    this.$set(item, 'usePlaceName', usePlaceName);
                    this.$set(item, 'usePlaceId', usePlaceId);
                }
            }
        },
        // 获取入库单明细
        async getIncomingInfo() {
            await this.$store.dispatch('warIncoming/getInfo', {incomingId: this.inComingId}).then(res => {
                this.pageConfig.projectForm.incomingId = res.results.id;
                this.pageConfig.projectForm.projectName = res.results.projectName;
                this.pageConfig.projectForm.projectId = res.results.projectId;
                this.pageConfig.projectForm.projectCode = res.results.projectCode;
                this.pageConfig.projectForm.warehouseId = res.results.warehouseId;
                this.pageConfig.projectForm.warehouseName = res.results.warehouseName;
                this.getWarehouseList(true);
                this._getByhashcolumnList(res.results.incomingDetails);
            });
        },
        // 获取库存明细
        _getByhashcolumnList(arr) {
            const data = {
                projectId: this.pageConfig.projectForm.projectId,
                warehouseId: this.pageConfig.projectForm.warehouseId,
                hashColumns: arr.map(v => v.hashColumn)
                // Array.from(new Set(arr.map(v => v.hashColumn)))
            };
            this.$store.dispatch('warOutbound/getByhashcolumnList', data).then(res => {
                const incomingDetails = [];
                for (const item of arr) {
                    const detail = res.results.find(v => v.hashColumn === item.hashColumn);
                    if (detail) {
                        const key = incomingDetails.findIndex(v => `${v.hashColumn}-${v.materialId}` === `${item.hashColumn}-${item.materialId}`);
                        if (key >= 0) {
                            const currentIncomingQuantity = incomingDetails[key].currentIncomingQuantity + item.currentIncomingQuantity;
                            // 入库数量 大于 可用库存
                            if (currentIncomingQuantity > detail.availableStock) {
                                // 出库数量等于可用库存
                                incomingDetails[key].currentOutboundQuantity = detail.availableStock;
                            } else {
                                // 出库数量等于入库数量
                                incomingDetails[key].currentOutboundQuantity = currentIncomingQuantity;
                            }
                            incomingDetails[key].currentIncomingQuantity = currentIncomingQuantity;
                        } else {
                            // 入库数量 大于 可用库存
                            if (item.currentIncomingQuantity > detail.availableStock) {
                                // 出库数量等于可用库存
                                detail.currentOutboundQuantity = detail.availableStock;
                            } else {
                                // 出库数量等于入库数量
                                detail.currentOutboundQuantity = item.currentIncomingQuantity;
                            }
                            detail.currentIncomingQuantity = item.currentIncomingQuantity;

                            incomingDetails.push(detail);
                        }
                    }
                }
                if (!incomingDetails || incomingDetails.length === 0) {
                    // 此单据的明细库存量不足，不能再出库！
                    this.$message.error(this.$t('warOutbound.quickDeliveryTips'));
                    this.fastLoading.close();
                    return;
                }
                this.getData(incomingDetails, async () => {
                    const tableData = this.pageConfig.subTableConfig['warehouseOutboundDetail'].tableData;
                    for (const row of tableData) {
                       await this.handleCalculation({ row, subTable: { subTableName: 'warehouseOutboundDetail' } });
                    }
                    this.fastLoading.close();
                });
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
                pageSize: 500,
                projectId: this.pageConfig.projectForm.projectId,
                warehouseCode: '',
                warehouseName: ''
            };
            this.$store.dispatch('warOutbound/getWarehouseList', data).then(res => {
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
                projectId: this.pageConfig.projectForm.projectId,
                pageNo: 1,
                pageSize: 500,
                unitName: ''
            };
            this.$store.dispatch('warOutbound/getUnitList', data1).then(res => {
                if (res.status === 0) {
                    const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'pickingUnitId');
                    if (index >= 0) {
                        if (res.results.records && res.results.records.length === 1) {
                            this.$set(this.pageConfig.projectForm, 'pickingUnitName', res.results.records[0].unitName);
                            this.$set(this.pageConfig.projectForm, 'unitContactMobile', res.results.records[0].unitContactInfo);
                            this.$set(this.pageConfig.projectForm, 'unitContactName', res.results.records[0].unitContactName);
                            this.$set(this.pageConfig.projectForm, 'pickingUnitId', res.results.records[0].id);
                        }
                        for (const item of res.results.records) {
                            this.$set(item, 'name', `${item.unitName}-${item.unitContactName}-${item.unitContactInfo}`);
                        }
                        this.$set(this.pageConfig.mainFormConfig.formList[index], 'selectList', res.results.records);
                    }
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
        },
        // ---------------------- 合同 --------------------
        // 清除合同
        handleClearContract (row, item) {
            const params = {
                paramsConfig: item,
                selectList: []
            };
            this.handleSelect(params, 'contractName');
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
            this.handleSelect(params, 'contractName', () => {
                this.dialogContract = false;
            });
        },
        // 填写主表备注后
        handleBlurRemarks() {
            const remarks = this.pageConfig.projectForm.remarks;
            const tableData = this.pageConfig.subTableConfig['warehouseOutboundDetail'].tableData;
            for (const item of tableData) {
                !item.remarks && this.$set(item, 'remarks', remarks);
            }
        },
        // 选择明细
        sysHandleSelectDetail(tableName) {
            if (!this.pageConfig.projectForm.projectName) {
                this.$message.error(this.$t('tips.pleaseSelectProject'));
                return;
            }
            if (!this.pageConfig.projectForm.warehouseId) {
                this.$message.error(this.$t('warOutbound.pleaseSelectWarehouse'));
                return;
            }
            const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
            for (const item of tableData) {
                item.rowKey = `${item.hashColumn}-${item.materialId}`;
            }
            this.varietiesIdList = tableData;
            this.dialogVisible = true;
        },
        // ------------------------ 子表选择子工程 ---------------------------------
        handleSubTableClearProjectChild(item, row, rowIndex, tableName) {
            this.subTableRow = {item, row, rowIndex, tableName};
            this.$set(this.pageConfig.subTableConfig[tableName].tableData[rowIndex], 'usePlaceName', '');
            this.$set(this.pageConfig.subTableConfig[tableName].tableData[rowIndex], 'usePlaceId', '');
        },
        // 选择子工程
        handleSubTableSelectProjectChild(item, row, rowIndex, tableName) {
            this.subTableRow = {item, row, rowIndex, tableName};
            this.projectChildFlag = true;
        },
        // 获取子工程
        getProjectChild(arr) {
            this.$set(this.pageConfig.subTableConfig[this.subTableRow.tableName].tableData[this.subTableRow.rowIndex], 'usePlaceName', arr.length > 0 ? arr[0].projectDetailName : '');
            this.$set(this.pageConfig.subTableConfig[this.subTableRow.tableName].tableData[this.subTableRow.rowIndex], 'usePlaceId', arr.length > 0 ? arr[0].id : '');
            this.projectChildFlag = false;
        },
        // 获取选中的数据
        getData(arr, callback) {
            const data = [];
            for (const item of arr) {
                data.push(
                    {
                        alreadyOutboundQuantity: item.totalOutboundQuantity,
                        createTime: this.$utils.commonUtil.formatTime(new Date()),
                        currencyCode: item.currencyCode,
                        currencyValue: item.currencyValue,
                        currentOutboundQuantity: item.currentOutboundQuantity || 0,
                        excludeTaxAmount: 0,
                        hashColumn: item.hashColumn,
                        includeTaxAmount: 0,
                        realExcludeTaxAmount: item.realExcludeTaxAmount,
                        realIncludeTaxAmount: item.realIncludeTaxAmount,
                        materialId: item.materialId,
                        materialName: item.materialName,
                        materialCode: item.materialCode,
                        models: item.models,
                        unit: item.unit,
                        brand: item.brand,
                        standards: item.standards,
                        outboundUnitPrice: item.unitPrice,
                        preOutboundQuantity: 0,
                        preIncludeTaxAmount: 0,
                        remarks: '',
                        status: 0,
                        stock: item.availableStock,
                        realStock: item.availableStock,
                        taxAmount: 0,
                        taxRate: item.taxRate,
                        unitPrice: item.unitPrice,
                        usePlaceId: this.pageConfig.projectForm.usePlaceId,
                        usePlaceName: this.pageConfig.projectForm.usePlaceName,
                        warehouseShelvesId: item.warehouseShelvesId,
                        warehouseShelvesName: item.warehouseShelvesName,
                        warrantyExpiredDate: item.warrantyExpiredDate
                    }
                );
            }
            this.setSubTable('warehouseOutboundDetail', data, callback);
        },
        setSubTable(tableName, arr, callback) {
            const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
            const selectTableList = [];
            if (!tableData.length || !arr.length) {
                this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', arr);
                this.deletTableCallback(tableName);
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
                this.deletTableCallback(tableName);
            }
            this.dialogVisible = false;
            // 一键入库后的回调
            callback && callback();
        },
        // 批量删除后的回调
        deletTableCallback(tableName) {
            this.setMainCheckMaterials(tableName);
            this.setAmount(tableName);
        },
        handleCurrentIncomingQuantity(item, row, event, subTable, rowIndex) {
            const data = {item, row, event, subTable, rowIndex};
            this.handleCalculation(data);
        },
        // 数值计算
        handleCalculation({item, row, event, subTable, rowIndex}) {
            if (row.realStock - (row.currentOutboundQuantity - row.preOutboundQuantity) < 0) {
                // 出库数量超过库存数量
                this.$message.error(this.$t('warOutbound.currentOutboundQuantityError'));
            }
            this._getCalculationAmount(row, subTable.subTableName);
        },
        // 计算金额
        async _getCalculationAmount(row, tableName) {
            const data = {
                excludeTaxAmount: row.excludeTaxAmount,
                hashVal: row.hashColumn,
                preIncludeTaxAmount: row.preIncludeTaxAmount,
                includeTaxAmount: row.includeTaxAmount,
                preQuantity: row.preOutboundQuantity,
                quantity: row.currentOutboundQuantity,
                taxAmount: row.taxAmount,
                taxRate: row.taxRate,
                unitPrice: row.unitPrice
            };
            const res = await this.$store.dispatch('warWarehouse/getCalculationAmount', data).then();
            // this.$store.dispatch('warWarehouse/getCalculationAmount', data).then(res => {
            if (res.status === 0) {
                const results = res.results;
                row.excludeTaxAmount = results.excludeTaxAmount;
                row.includeTaxAmount = results.includeTaxAmount;
                row.preOutboundQuantity = results.preQuantity;
                row.currentOutboundQuantity = results.quantity;
                row.taxAmount = results.taxAmount;
                row.outboundUnitPrice = results.unitPrice;
            } else {
                row.excludeTaxAmount = 0;
                row.includeTaxAmount = 0;
                row.currentOutboundQuantity = 0;
                row.taxAmount = 0;
                row.outboundUnitPrice = 0;
                this.$message.error(this.$t(`exception.${res.errorCode}`));
            }
            this.setAmount('warehouseOutboundDetail');
            // });
        },
        // 计算金额
        setAmount (tableName) {
            const data = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
            // 金额合计
            const totalAmount = data.reduce((a, b, c) => {
                return a += Number(b.excludeTaxAmount || 0);
            }, 0);
            this.$set(this.pageConfig.projectForm, 'totalAmount', Number(totalAmount.toFixed(2)));
            // 税额合计
            const totalTaxAmount = data.reduce((a, b, c) => {
                return a += Number(b.taxAmount || 0);
            }, 0);
            this.$set(this.pageConfig.projectForm, 'totalTaxAmount', Number(totalTaxAmount.toFixed(2)));
            // 价税合计
            const totalPriceTax = data.reduce((a, b, c) => {
                return a += Number(b.includeTaxAmount || 0);
            }, 0);
            this.$set(this.pageConfig.projectForm, 'totalPriceTax', Number(totalPriceTax.toFixed(2)));
        },
        // 获取拟采购内容
        setMainCheckMaterials(tableName) {
            const mainOutboundMaterials = this.pageConfig.subTableConfig[tableName].tableData.slice(-5).map(v => v.materialName).join(',');
            this.$set(this.pageConfig.projectForm, 'mainOutboundMaterials', mainOutboundMaterials);
        },
        // 保存
        handleSave (isProcess = false) {
            this.$refs.editForm.getValidateForm(() => {
                this.setAmount('warehouseOutboundDetail');
                this.setMainCheckMaterials('warehouseOutboundDetail');
                const data = this.$clone(this.pageConfig.projectForm);
                const warehouseOutboundDetail = this.$refs.warehouseOutboundDetail[0].validateTableData();
                if (!warehouseOutboundDetail || warehouseOutboundDetail.length === 0) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('warOutbound.warehouseOutboundDetail')}${this.$t('tips.notFilledIn')}`);
                    return;
                }
                if (!data.outboundTypeValue) {
                    const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'outboundTypeCode');
                    if (index >= 0) {
                        const selectList = this.pageConfig.mainFormConfig.formList[index].selectList;
                        const key = selectList.findIndex(v => v.dataCode === this.pageConfig.projectForm.outboundTypeCode);
                        if (key >= 0) {
                            data.outboundTypeValue = selectList[key].dataName;
                        } else {
                            data.outboundTypeValue = '';
                        }
                    }
                }
                data.outboundDetails = warehouseOutboundDetail;
                this.handleSaveData(data, isProcess);
            });
        }
    }
};
</script>
