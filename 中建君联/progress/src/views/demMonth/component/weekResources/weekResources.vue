<!--
 * @Author: your name
 * @Date: 2021-04-12 17:06:50
 * @LastEditTime: 2021-12-17 09:55:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demMaster\component\weekResources\weekResources.vue
-->
<template>
    <div style="height: 100%;" class="weekResources">
        <!-- 明细清单 -->
        <div v-if="pageConfigLoading" class="tabCons" ref="tabCons">
            <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
                <g-edit-title :title="$t(`dialog.${subTable.subTableName}`) + '/' + $t(currentResources.label)">
                    <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
                        <template slot-scope="{parameter, buttonConfig}" slot='button-sysHandleSelectDetail'>
                            <!-- currentResources.code === '04'" 为其它 -->
                            <el-button
                                v-if="!parameter.noAuth ? authButtonList.indexOf(parameter.authCode) >= 0 : true"
                                :key="parameter.code" :name="parameter.code"
                                :size="parameter.size || buttonConfig.size"
                                :type="parameter.type || buttonConfig.type"
                                :plain="parameter.plain || buttonConfig.plain"
                                :disabled="parameter.disabled"
                                :icon="parameter.icon || buttonConfig.icon"
                                :class="parameter.class || buttonConfig.class"
                                :style="parameter.style || buttonConfig.style"
                                v-fast-click @click="sysHandleSelectDetail(subTable.subTableName)">
                                {{$t(parameter.name)}}
                            </el-button>
                        </template>
                    </g-button>
                </g-edit-title>
                <g-edit-table
                    :ref="subTable.subTableName"
                    :type="typeResources"
                    :height="tableHeight"
                    :isSelection="subTable.isSelection"
                    :tableConfig="subTable.tableList"
                    :subTable='subTable'
                    :customRules="subTableCustomRules"
                    :delete.sync="deleteList[subTable.subTableName]"
                    @editTableEvent='editTableEvent'>
                    <template slot="edit-table-weekreportDocNo" slot-scope="{scope}">
                        <span v-if="scope.weekreportDocNo">
                            {{scope.weekreportDocNo.slice(0, 4)}}{{$t('time.year')}}{{scope.weekreportDocNo.slice(5, 7)}}{{$t('time.month')}}
                            {{row.applyWeek}} {{scope.weekreportDocNo.slice(8)}}{{$t('time.week')}}
                        </span>
                    </template>
                    <template slot="edit-table-dataSourceValue" slot-scope="{scope}">
                        <span>{{$t(scope.dataSourceValue)}}</span>
                    </template>
                    <template slot="edit-table-resourceTypeValue" slot-scope="{scope}">
                        <span>{{$t(scope.resourceTypeValue)}}</span>
                    </template>
                </g-edit-table>
            </div>
        </div>
        <div class="footer">
            <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small"
                @click="dialogEvent('close')">{{$t('button.close')}}
            </el-button>
            <el-button size="small" type="primary" icon="el-icon-circle-check"
                @click="dialogEvent('save')" v-fast-click :disabled="typeResources === 'info'">{{$t('button.determine')}}
            </el-button>
        </div>
        <!-- 选择材料分类 -->
        <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
            <detail slot="body" slot-scope="{height}" :dialogHeight="height"
                :close.sync="dialogVisible"
                :selectList="varietiesIdList"
                :currentResources="currentResources"
                :projectId="projectId"
                @getData="getData" v-if="dialogVisible">
            </detail>
        </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'views/demWeek/tempMixins/tempEditPage';

export default {
    name: 'weekResources',
    mixins: [editPage],
    components: {
        detail(resolve) {
            require(['../detail/detail.vue'], resolve);
        }
    },
    data () {
        const numValid = (rule, value, callback) => {
            const tableData = this.$clone(this.pageConfig.subTableConfig['resourcesDetail'].tableData);
            console.log(tableData, 'tableData');
            if (!value) {
                callback(new Error(`${this.$t('tips.pleaseEnterANumber')}`));
            } else {
                callback();
            }
        };
        return {
            page: new Page(),
            tableRow: {},
            subTableCustomRules: {
                inputQuantity: [{required: true, validator: numValid, trigger: 'blur' }]
            },
            varietiesIdList: [],
            // 选择材料
            dialogVisible: false,
            dialogConfig: {
                title: `${this.$t(this.currentResources.label)} ${this.$t('dialog.budgetDetail')}`,
                appendBody: false,
                center: true,
                top: '50px',
                width: '80%',
                span: '0.75'
            },
            typeResources: 'add',
            tableHeight: 400
        };
    },
    props: {
        processParmas: {
            type: Object,
            default: () => {}
        },
        row: {
            type: Object,
            default: () => {}
        },
        currentResources: {
            type: Object,
            default: () => {}
        },
        projectId: {
            default: ''
        },
        nodeCode: {
            default: ''
        },
        multitonColumns: {
            default: ''
        }
    },
    created () {
        if (this.page) {
            // this.$set(this.pageConfig.subTableConfig['resourcesDetail'], 'tableData', [this.$clone(this.subTableData)]);
            this.pageConfig = this.page.PageConfig;
            const resources = this.row[this.currentResources.prop] || [];
            console.log(this.pageConfig, 'this.pageConfig');
            this.$set(this.pageConfig.subTableConfig['resourcesDetail'], 'tableData', resources);
            this.pageStatus();
            this.pageConfigLoading = true;
        }
    },
    mounted () {
        this.$nextTick(() => {
            const consHeight = this.$refs.tabCons ? this.$refs.tabCons.offsetHeight : 522;
            const buttonListHeight = 60; // 按钮高度
            const tableHeight = consHeight - buttonListHeight ; // 20 位 padding 高度
            this.tableHeight = tableHeight;
        });
    },
    methods: {
        // 添加明细
        sysHandleDeletaAdd(tableName) {
            const row = {
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                cid: this.row.cid,
                eId: '',
                dataSourceCode: '01',
                dataSourceValue: 'dialog.dataSourceValue01',
                resourceTypeValue: this.currentResources.label,
                resourceTypeCode: this.currentResources.code,
                resourceName: '',
                standards: '',
                unit: '',
                inputQuantity: 0,
                excludeUnitPrice: 0,
                excludeTaxAmount: 0,
                taxRate: 0,
                taxAmount: 0,
                includeUnitPrice: 0,
                includeTaxAmount: 0,
                remarks: '',
                weekreportDocNo: ''
            };
            this.pageConfig.subTableConfig[tableName].tableData.push(row);
        },
        // 选择明细
        sysHandleSelectDetail(tableName) {
            const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
            this.varietiesIdList = tableData;
            this.dialogVisible = true;
        },
        // 获取选中的数据
        getData(arr) {
            const data = [];
            for (const item of arr) {
                if (item.isNew) {
                    data.push(
                        {
                            createTime: this.$utils.commonUtil.formatTime(new Date()),
                            cid: this.row.cid,
                            eId: item.eId,
                            dataSourceCode: '02',
                            dataSourceValue: 'dialog.dataSourceValue02',
                            resourceTypeValue: this.currentResources.label,
                            resourceTypeCode: this.currentResources.code,
                            resourceName: item.resourceName,
                            standards: item.standards || '',
                            unit: item.unit || '',
                            inputQuantity: 0,
                            excludeUnitPrice: 0,
                            excludeTaxAmount: 0,
                            taxRate: 0,
                            taxAmount: 0,
                            includeUnitPrice: item.includeUnitPrice || 0,
                            includeTaxAmount: 0,
                            remarks: '',
                            weekreportDocNo: ''
                        }
                    );
                } else {
                    data.push(item);
                }
            }
            this.$set(this.pageConfig.subTableConfig['resourcesDetail'], 'tableData', data);
            this.dialogVisible = false;
        },
        // 数值计算
        handleCalculation({item, row, event, subTable, rowIndex}) {
            this.handleCalculation1({item, row});
        },
        // 填写含税计算不含税
        handleCalculation1({ item, row, event, subTable, rowIndex }) {
            // 1，如果填写规则是填写含税计算不含税：则在填写数量、税率、金额（含税）后计算其他值；计算包括
            // 金额不含税=金额含税除以（1+税率）
            // 税额=金额含税/(1+税率) * 税率
            // 单价不含税=金额含税/(1+税率)/数量 如果数量为0 直接等于0
            if (item.prop === 'includeUnitPrice') {
                const inputQuantity = Number(row.inputQuantity) || 0; // 数量
                const includeUnitPrice = Number(row.includeUnitPrice) || 0; // 单价（含税）
                const includeTaxAmount = inputQuantity * includeUnitPrice;
                this.$set(row, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));

                const taxRate = Number(row.taxRate) || 0; // 税率
                const excludeTaxAmount = includeTaxAmount / (1 + taxRate); // 金额(不含税)
                const taxAmount = includeTaxAmount / (1 + taxRate) * taxRate; // 税额
                const excludeUnitPrice = !inputQuantity ? 0 : includeTaxAmount / (1 + taxRate) / inputQuantity; // 单价不含税
                this.$set(row, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));
                this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
                this.$set(row, 'excludeUnitPrice', Number((excludeUnitPrice || 0).toFixed(8)));
            }
            if (item.prop === 'includeTaxAmount' && (row.includeUnitPrice === '' || row.includeUnitPrice === null)) {
                const inputQuantity = Number(row.inputQuantity) || 0; // 数量
                const includeTaxAmount = Number(row.includeTaxAmount) || 0; // 金额（含税）
                const includeUnitPrice = includeTaxAmount / inputQuantity;
                this.$set(row, 'includeUnitPrice', !inputQuantity ? 0 : Number((includeUnitPrice || 0).toFixed(2)));
            }
            if (item.prop === 'inputQuantity' || item.prop === 'taxRate') {
                const inputQuantity = Number(row.inputQuantity) || 0; // 数量
                const includeUnitPrice = Number(row.includeUnitPrice) || 0; // 单价（含税）
                const taxRate = Number(row.taxRate) || 0; // 税率
                const includeTaxAmount = inputQuantity * includeUnitPrice; // 金额(含税)
                const excludeTaxAmount = includeTaxAmount / (1 + taxRate); // 金额(不含税)
                const taxAmount = includeTaxAmount / (1 + taxRate) * taxRate; // 税额
                const excludeUnitPrice = !inputQuantity ? 0 : includeTaxAmount / (1 + taxRate) / inputQuantity; // 单价不含税
                this.$set(row, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));
                this.$set(row, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));
                this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
                this.$set(row, 'excludeUnitPrice', Number((excludeUnitPrice || 0).toFixed(8)));
            }
            if (item.prop === 'includeTaxAmount' && row.includeUnitPrice >= 0) {
                const inputQuantity = Number(row.inputQuantity) || 0; // 数量
                const taxRate = Number(row.taxRate) || 0; // 税率
                const includeTaxAmount = Number(row.includeTaxAmount) || 0; // 金额(含税)
                const excludeTaxAmount = includeTaxAmount / (1 + taxRate); // 金额(不含税)
                const taxAmount = includeTaxAmount / (1 + taxRate) * taxRate; // 税额
                const excludeUnitPrice = !inputQuantity ? 0 : includeTaxAmount / (1 + taxRate) / inputQuantity; // 单价不含税
                this.$set(row, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));
                this.$set(row, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));
                this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
                this.$set(row, 'excludeUnitPrice', Number((excludeUnitPrice || 0).toFixed(8)));
            }
        },
        // 批量删除操作
        handleDeleteSubTable(arr, keyValue, tableName) {
            keyValue = this.$t('dialog.resourcesDetail');
            if (arr && arr.length > 0) {
                const deletMessage = this.$t('tips.deleteDetailedTips').replace('{keyValue}', keyValue);
                const deleteDetailsMessage = this.$t('tips.deleteDetailsApiTips').replace('{keyValue}', keyValue);
                const messageTips = deletMessage;
                this.$confirm(messageTips, `${this.$t('button.batchDeletion')}${keyValue}`, {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: this.$t('button.determine'),
                    cancelButtonText: this.$t('button.close'),
                    type: 'warning'
                }).then(() => {
                    this.deleteDetail(tableName, arr);
                }).catch(e => { });
            } else {
                // 请选择明细清单
                arr && this.$message.error(this.$t('tips.pleaseSelectDetailed'));
            }
        },
        dialogEvent(event) {
            if (event === 'close') {
                this.$emit('update:close', false);
            } else {
                const tableData = this.$clone(this.pageConfig.subTableConfig['resourcesDetail'].tableData);
                const resourcesDetail = this.$refs.resourcesDetail[0].validateTableData();
                if (!resourcesDetail && tableData.length) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('dialog.resourcesDetail')} ${this.$t('tips.notFilledIn')}`);
                    return;
                }
                this.$emit('getData', resourcesDetail);
            }
        }
    }
};
</script>
<style scoped lang="scss">
.weekResources {
    width: 100%;
    height: 100%;
    .tabCons {
        height: calc(100% - 56px);
    }
}
</style>
