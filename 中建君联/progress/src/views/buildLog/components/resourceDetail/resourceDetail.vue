<!--
 * @Author: your name
 * @Date: 2022-02-22 14:56:08
 * @LastEditTime: 2022-03-03 15:27:06
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \web_projectprogress-项目进度管理云\src\components\gantt\resourceDetail\resourceDetail.vue
-->
<template>
    <div style="height: 100%;" class="weekResources">
        <!-- 明细清单 -->
        <div v-if="pageConfigLoading" class="tabCons" ref="tabCons">
            <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
                <g-edit-title :title="$t(currentResources.label)">
                    <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
                        <template slot-scope="{parameter, buttonConfig}" slot='button-sysHandleImport'>
                            <importFile :parameter='parameter' :buttonConfig='buttonConfig'
                                @importData='getImportData' :editPage='that'
                                ref="importAllIFile" :flowStatus="type === 'info'"
                                :subTable='subTable' :importUrl='importUrlSingleDetail'>
                            </importFile>
                        </template>
                    </g-button>
                </g-edit-title>
                <g-edit-pl-table
                    :ref="subTable.subTableName"
                    :type="typeResources"
                    :height="tableHeight"
                    :isSelection="subTable.isSelection"
                    :tableConfig="subTable.tableList"
                    :subTable='subTable'
                    :customRules="subTableCustomRules"
                    :delete.sync="deleteList[subTable.subTableName]"
                    @editTableEvent='editTableEvent'>
                    <!-- 名称 -->
                    <template slot="edit-table-resourceDetailName" slot-scope="{item, scope}">
                        <el-input controls-position="right" size="small"
                            :maxlength="Number(item.maxlength)" v-if="item.inputStatus !== 'disable' && scope.dataSourceCode !== '03'"
                            v-model.trim="scope[item.prop]" :placeholder="item.placeholder"
                            :clearable="item.clearable === undefined ? true : item.clearable">
                        </el-input>
                        <span v-else>{{scope[item.prop]}}</span>
                    </template>
                    <!-- 规格 -->
                    <template slot="edit-table-standards" slot-scope="{item, scope}">
                        <el-input controls-position="right" size="small"
                            :maxlength="Number(item.maxlength)" v-if="item.inputStatus !== 'disable' && scope.dataSourceCode !== '03'"
                            v-model.trim="scope[item.prop]" :placeholder="item.placeholder"
                            :clearable="item.clearable === undefined ? true : item.clearable">
                        </el-input>
                        <span v-else>{{scope[item.prop]}}</span>
                    </template>
                    <!-- 单位 -->
                    <template slot="edit-table-unit" slot-scope="{item, scope}">
                        <el-input controls-position="right" size="small"
                            :maxlength="Number(item.maxlength)" v-if="item.inputStatus !== 'disable' && scope.dataSourceCode !== '03'"
                            v-model.trim="scope[item.prop]" :placeholder="item.placeholder"
                            :clearable="item.clearable === undefined ? true : item.clearable">
                        </el-input>
                        <span v-else>{{scope[item.prop]}}</span>
                    </template>
                </g-edit-pl-table>
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

        <!-- 选择明细 -->
        <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
            <resourceList slot="body" slot-scope="{ height }" :dialogHeight="height"  :close.sync="dialogVisible"
                :projectId='projectId || 0'
                :selectList="selectList" :row="row" :currentTable="currentTable" @getData="getData" v-if="dialogVisible"  />
        </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from '../tempMixins/tempEditPage';
import {importPage} from 'mixins/importMixins';

export default {
    name: 'resourceDetail',
    mixins: [editPage, importPage],
    components: {
        importFile(resolve) {
          require(['components/basicComponents/global/upload/importFile.vue'], resolve);
        },
        resourceList(resolve) {
          require(['../resourceList/resourceList.vue'], resolve);
        }
    },
    data () {
        const numValid = (rule, value, callback) => {
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
                quantity: [{required: true, validator: numValid, trigger: 'blur' }]
            },
            varietiesIdList: [],
            // 选择材料
            dialogVisible: false,
            dialogConfig: {
                title: this.$t('dialog.resourceDetail'),
                appendBody: false,
                center: true,
                top: '80px',
                width: '80%',
                span: '0.75'
            },
            typeResources: 'add',
            tableHeight: 400,
            otherTableData: [],
            importUrlSingleDetail: '/proprogress/plan/gant/resource/resource/detail/importExcel', // 甘特图工程量及资源信息明细导入
            that: '',
            tableList: [
                { prop: 'reportLabour', tableKey: 'labourColumns', costTypeCode: '01', costTypeValue: '人工' }, // 人工
                { prop: 'reportMaterial', tableKey: 'materialColumns', costTypeCode: '02', costTypeValue: '材料' }, // 材料
                { prop: 'reportMachinery', tableKey: 'machineryColumns', costTypeCode: '03', costTypeValue: '机械' }, // 机械
                { prop: 'other', tableKey: 'otherColumns', costTypeCode: '05', costTypeValue: '其它' } // 其它
            ],
            currentTable: {},
            otherList: []
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
        details: {
            type: Array,
            default: () => []
        },
        projectId: {
            default: 0
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
            this.type = this.$base64.decode(this.$route.params.type);
            // this.$set(this.pageConfig.subTableConfig['resourcesDetail'], 'tableData', [this.$clone(this.subTableData)]);
            this.pageConfig = this.page.PageConfig;
            const currentTable = this.tableList.find(v => v.prop === this.currentResources.prop || this.currentResources.code === v.costTypeCode);
            this.currentTable = currentTable;
            this.otherTableData = this.details.filter(v => v.resourceTypeCode !== currentTable.costTypeCode);
            const tableData = this.details.filter(v => v.resourceTypeCode === currentTable.costTypeCode);
            this.$set(this.pageConfig.subTableConfig['resourcesDetail'], 'tableData', tableData);
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
        pageStatus() {
            console.log(this.nodeCode, 'nodeCode');
            this.pageDisabled = this.type !== 'info';
            if (this.type === 'info' || (this.nodeCode !== 'BEGIN' && this.nodeCode)) {
                this.type = 'info';
                for (const i in this.page.PageConfig.subTableConfig) {
                    const item = this.page.PageConfig.subTableConfig[i];
                    item.isSelection = false;
                    for (const child of item.tableList.slaveColumns) {
                        this.$set(child, 'inputStatus', 'disable');
                    }
                    for (const but of item.subTableButton) {
                        but.disabled === undefined ? (but.disabled = false) : (but.disabled = true);
                    }
                }
            }
        },
        // 选择明细
        sysHandleSelectDetail() {
            const tableData = this.$clone(this.pageConfig.subTableConfig['resourcesDetail'].tableData);
            this.selectList = tableData.filter(v => v.dataSourceCode === '03');
            this.otherList = tableData.filter(v => v.dataSourceCode !== '03');
            this.dialogVisible = true;
        },
        // 获取明细
        getData(arr) {
            const data = [];
            for (const item of arr) {
                data.push(item);
            }
            console.log(data, 'data');
            this.setSubTable('resourcesDetail', data);
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
                    if (item.gantResourceId === val.gantResourceId) {
                        selectTableList.push(item);
                    }
                }
                }
                for (const item of arr) {
                const index = tableData.findIndex(v => v.gantResourceId === item.gantResourceId);
                if (index < 0) {
                    selectTableList.push(item);
                }
                }
                this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', this.otherList.concat(selectTableList));
            }
            this.dialogVisible = false;
        },
        // 添加明细
        sysHandleDeletaAdd(tableName) {
            console.log(this.currentResources, 'this.currentResources');
            const row = {
                alreadyQuantity: 0,
                buildLogApplyDetailId: '',
                buildLogApplyId: '',
                cid: this.row.cid,
                dataSourceCode: '',
                dataSourceValue: '',
                excludeTaxAmount: '',
                excludeUnitPrice: '',
                masterPlanResourceDetailId: '',
                gantResourceDetailId: '',
                gantResourceId: '',
                includeTaxAmount: '',
                includeUnitPrice: '',
                quantity: '',
                remarks: '',
                resourceDetailName: '',
                resourceQuantity: 0,
                resourceTypeCode: '',
                resourceTypeValue: '',
                standards: '',
                taxAmount: '',
                taxRate: '',
                tenantId: '',
                unit: ''
            };
            if (this.currentTable) {
                row.resourceTypeCode = this.currentTable.costTypeCode;
                row.resourceTypeValue = this.currentTable.costTypeValue;
                row.dataSourceCode = '01';
                row.dataSourceValue = '手动添加';
            }
            const tableData = this.pageConfig.subTableConfig[tableName].tableData;
            console.log(row, 'row');
            this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', tableData.concat([row]));
            // this.pageConfig.subTableConfig[tableName].tableData.push(row);
        },
        // 数值计算
        handleCalculation({item, row, event, subTable, rowIndex}) {
            // 1，如果填写规则是填写含税计算不含税：则在填写数量、税率、金额（含税）后计算其他值；计算包括
            // 金额不含税=金额含税除以（1+税率）
            // 税额=金额含税/(1+税率) * 税率
            // 单价不含税=金额含税/(1+税率)/数量 如果数量为0 直接等于0
            if (item.prop === 'includeUnitPrice') {
                const quantity = Number(row.quantity) || 0; // 数量
                const includeUnitPrice = Number(row.includeUnitPrice) || 0; // 单价（含税）
                const includeTaxAmount = quantity * includeUnitPrice;
                this.$set(row, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));
                const taxRate = Number(row.taxRate) || 0; // 税率
                const excludeTaxAmount = includeTaxAmount / (1 + taxRate); // 金额(不含税)
                const taxAmount = includeTaxAmount / (1 + taxRate) * taxRate; // 税额
                const excludeUnitPrice = !quantity ? 0 : includeTaxAmount / (1 + taxRate) / quantity; // 单价不含税
                this.$set(row, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));
                this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
                this.$set(row, 'excludeUnitPrice', Number((excludeUnitPrice || 0).toFixed(8)));
            }
            if (item.prop === 'includeTaxAmount' && (row.includeUnitPrice === '' || row.includeUnitPrice === null)) {
                const quantity = Number(row.quantity) || 0; // 数量
                const includeTaxAmount = Number(row.includeTaxAmount) || 0; // 金额（含税）
                const includeUnitPrice = includeTaxAmount / quantity;
                this.$set(row, 'includeUnitPrice', !quantity ? 0 : Number((includeUnitPrice || 0).toFixed(4)));
            }
            if (item.prop === 'quantity' || item.prop === 'taxRate') {
                const quantity = Number(row.quantity) || 0; // 数量
                const includeUnitPrice = Number(row.includeUnitPrice) || 0; // 单价（含税）
                const taxRate = Number(row.taxRate) || 0; // 税率
                const includeTaxAmount = quantity * includeUnitPrice; // 金额(含税)
                const excludeTaxAmount = includeTaxAmount / (1 + taxRate); // 金额(不含税)
                const taxAmount = includeTaxAmount / (1 + taxRate) * taxRate; // 税额
                const excludeUnitPrice = !quantity ? 0 : includeTaxAmount / (1 + taxRate) / quantity; // 单价不含税
                this.$set(row, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));
                this.$set(row, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));
                this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
                this.$set(row, 'excludeUnitPrice', Number((excludeUnitPrice || 0).toFixed(8)));
            }
            if (item.prop === 'includeTaxAmount' && row.includeUnitPrice >= 0) {
                const quantity = Number(row.quantity) || 0; // 数量
                const taxRate = Number(row.taxRate) || 0; // 税率
                const includeTaxAmount = Number(row.includeTaxAmount) || 0; // 金额(含税)
                const excludeTaxAmount = includeTaxAmount / (1 + taxRate); // 金额(不含税)
                const taxAmount = includeTaxAmount / (1 + taxRate) * taxRate; // 税额
                const excludeUnitPrice = !quantity ? 0 : includeTaxAmount / (1 + taxRate) / quantity; // 单价不含税
                this.$set(row, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));
                this.$set(row, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));
                this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
                this.$set(row, 'excludeUnitPrice', Number((excludeUnitPrice || 0).toFixed(8)));
            }
        },
        // 批量删除操作
        handleDeleteSubTable(arr, keyValue, tableName) {
            keyValue = this.$t(this.currentResources.label);
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
                console.log(resourcesDetail, 'resourcesDetail');
                if (!resourcesDetail) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t(this.currentResources.label)} ${this.$t('tips.notFilledIn')}`);
                    return;
                }
                // 是否存在重复明细
                const selectTableList = [];
                // let totalPrice = 0;
                for (const i in resourcesDetail) {
                    const item = resourcesDetail[i];
                    item.repeatKey = `${item.resourceDetailName}-${item.standards}-${item.unit}-${item.resourceTypeCode}`;
                    const index = selectTableList.findIndex(v => item.repeatKey === v.repeatKey);
                    if (index >= 0) {
                        // 行明细重复，请核对后保存
                        this.$message.error(`${this.$t('tips.theFirst')} ${Number(i) + 1} ${this.$t('tips.duplicateDetails')}`);
                        return;
                    } else {
                        selectTableList.push(item);
                    }
                    // totalPrice += Number(item.totalPrice) || 0;
                }
                // console.log(resourcesDetail, 'resourcesDetail');
                this.$emit('getData', {details: resourcesDetail.concat(this.otherTableData)});
            }
        },
        // 全量模板
        sysHandleDownloadTemplate() {
            // 资源分解
            const templateName = this.$t('dialog.resourceDetail');
            this.$store.dispatch(this.page.PageConfig.processParmas.dowanloadDetail.url).then(data => {
                if (!data) return;
                const url = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', `${templateName}.xls`);
                document.body.appendChild(link);
                link.click();
            });
        },
        // 导入前判断
        canImprotDetail() {
            this.$refs.importAllIFile[0].fileName.resourceTypeCode = this.currentTable.costTypeCode;
            this.$refs.importAllIFile[0].fileName.resourceTypeValue = this.currentTable.costTypeValue;
            return true;
        },
        // 获取导入模板数据
        getImportData(val) {
            for (const item of val.tableData) {
                const quantity = Number(item.quantity) || 0; // 数量
                const includeUnitPrice = Number(item.includeUnitPrice) || 0; // 单价（含税）
                const taxRate = Number(item.taxRate) || 0; // 税率
                const includeTaxAmount = quantity * includeUnitPrice; // 金额(含税)
                const excludeTaxAmount = includeTaxAmount / (1 + taxRate); // 金额(不含税)
                const taxAmount = includeTaxAmount / (1 + taxRate) * taxRate; // 税额
                const excludeUnitPrice = !quantity ? 0 : includeTaxAmount / (1 + taxRate) / quantity; // 单价不含税
                this.$set(item, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));
                this.$set(item, 'excludeTaxAmount', Number((excludeTaxAmount || 0).toFixed(2)));
                this.$set(item, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
                this.$set(item, 'excludeUnitPrice', Number((excludeUnitPrice || 0).toFixed(8)));
                if (this.currentTable) {
                    item.resourceTypeCode = this.currentTable.costTypeCode;
                    item.resourceTypeValue = this.currentTable.costTypeValue;
                    item.dataSourceCode = '02';
                    item.dataSourceValue = '导入';
                }
                item.masterPlanResourceDetailId = '';
                item.cid = this.row.cid;
            }
            this.$set(this.page.PageConfig.subTableConfig['resourcesDetail'], 'tableData', val.tableData);
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

