<!--
 * @Author: your name
 * @Date: 2022-02-22 14:56:08
 * @LastEditTime: 2022-03-03 16:46:26
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
                                ref="importAllIFile"
                                :subTable='subTable' :flowStatus="typeResources === 'info'" :importUrl='importUrlSingleDetail'>
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
                top: '50px',
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
            ]
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
            const currentTable = this.tableList.find(v => v.prop === this.currentResources.prop);
            this.currentTable = currentTable;
            console.log(this.details, 'details');
            console.log(currentTable, 'currentTable');
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
        // 添加明细
        sysHandleDeletaAdd(tableName) {
            console.log(this.currentResources, 'this.currentResources');
            const currentTable = this.tableList.find(v => v.prop === this.currentResources.prop);
            const row = {
                cid: this.row.cid,
                dataSourceCode: '',
                dataSourceValue: '',
                excludeTaxAmount: '',
                excludeUnitPrice: '',
                gantResourceId: '',
                includeTaxAmount: '',
                includeUnitPrice: '',
                quantity: '',
                remarks: '',
                resourceDetailName: '',
                resourceTypeCode: '',
                resourceTypeValue: '',
                standards: '',
                taxAmount: '',
                taxRate: '',
                unit: ''
            };
            if (currentTable) {
                row.resourceTypeCode = currentTable.costTypeCode;
                row.resourceTypeValue = currentTable.costTypeValue;
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
            const currentTable = this.tableList.find(v => v.prop === this.currentResources.prop);
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
                if (currentTable) {
                    item.resourceTypeCode = currentTable.costTypeCode;
                    item.resourceTypeValue = currentTable.costTypeValue;
                    item.dataSourceCode = '02';
                    item.dataSourceValue = '导入';
                }
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

