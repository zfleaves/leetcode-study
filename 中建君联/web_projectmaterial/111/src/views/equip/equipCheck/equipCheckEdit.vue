<!--
 * @Author: your name
 * @Date: 2020-07-30 10:35:06
 * @LastEditTime: 2020-09-08 11:54:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\equipCheck\equipCheckEdit.vue
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
                        <g-edit-title :title="$t(`equipCheck.${subTable.subTableName}`)">
                            <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
                            </g-button>
                        </g-edit-title>
                        <g-edit-table
                            :ref="subTable.subTableName"
                            :type="type"
                            :isSelection="subTable.isSelection"
                            :tableConfig="subTable.tableList"
                            :subTable='subTable'
                            :customRules="subTableCustomRules"
                            :delete.sync="deleteList[subTable.subTableName]"
                            @editTableEvent='editTableEvent'>
                        </g-edit-table>
                    </div>
                </div>
            </div>
        </edit-page>
        <!-- 选择材料分类 -->
        <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
            <materialLibrary slot="body" slot-scope="{height}" :dialogHeight="height"
                :close.sync="dialogVisible"
                :selectList="varietiesIdList"
                varietiesTitle="equipCheck.materialTitle"
                @getData="getData">
            </materialLibrary>
        </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'equipCheckEdit',
    mixins: [editPage],
    data () {
        const checkQuantityValid = (rule, value, callback) => {
            if (!value) {
                callback(new Error(this.$t('equipCheck.checkQuantityValidTips')));
            } else {
                callback();
            }
        };
        return {
            page: new Page(),
            projectForm: {
                attachment: '',
                checkDate: '',
                checkSituation: '',
                mainCheckEquipment: '',
                projectId: 0,
                projectName: '',
                remarks: '',
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            },
            // 选择材料
            dialogVisible: false,
            dialogConfig: {
                title: this.$t('equipCheck.seleMaterialVarieties'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '80%',
                span: '0.75'
            },
            subTableCustomRules: {
                checkQuantity: [{required: true, validator: checkQuantityValid, trigger: 'blur' }]
            },
            varietiesIdList: []
        };
    },
    props: {
        processParmas: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        materialLibrary(resolve) {
            require(['components/material/materialLibrary/materialLibrary.vue'], resolve);
        }
    },
    methods: {
        // 获取info数据
        async _getInfoData(id = 0) {
            await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl);
        },
        // 选择明细
        sysHandleSelectDetail(tableName) {
            if (!this.pageConfig.projectForm.projectName) {
                this.$message.error(this.$t('tips.pleaseSelectProject'));
                return;
            }
            const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
            this.varietiesIdList = tableData;
            this.dialogVisible = true;
        },
        // 获取选中的数据
        getData(arr) {
            for (const item of arr) {
                item.materialId = item.materialId ? item.materialId : item.id;
            }
            this.setSubTable('equipmentCheckDetail', arr);
        },
        setSubTable(tableName, arr) {
            const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
            const selectTableList = [];
            const newSelectTableList = [];
            if (!tableData.length || !arr.length) {
                this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', this.setSubTableList(arr));
                this.setMainCheckMaterials(tableName);
            }
            if (tableData.length) {
                for (const item of tableData) {
                    for (const val of arr) {
                        if (item.materialId === val.materialId) {
                            selectTableList.push(item);
                        }
                    }
                }
                for (const item of arr) {
                    const index = tableData.findIndex(v => v.materialId === item.materialId);
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
                        createTime: this.$utils.commonUtil.formatTime(new Date()),
                        detailAttachment: '',
                        checkQuantity: 0,
                        checkResult: '',
                        passRate: '',
                        checkUserName: '',
                        materialId: item.materialId,
                        materialName: item.materialName,
                        materialCode: item.materialCode,
                        models: item.models,
                        unit: item.unit,
                        brand: item.brand,
                        standards: item.standards,
                        remarks: ''
                    }
                );
            }
            return data;
        },
        // 数值计算
        handleCalculation({item, row, event, subTable, rowIndex}) {
            if (!row.checkQuantity) {
                row.passRate = 0;
            } else {
                row.passRate = (row.checkPassQuantity / row.checkQuantity * 100).toFixed(2);
            }
        },
        // 批量删除后的回调
        deletTableCallback(tableName) {
            this.setMainCheckMaterials(tableName);
        },
        // 获取拟采购内容
        setMainCheckMaterials(tableName) {
            const mainCheckEquipment = this.pageConfig.subTableConfig[tableName].tableData.slice(-5).map(v => v.materialName).join(',');
            this.$set(this.pageConfig.projectForm, 'mainCheckEquipment', mainCheckEquipment);
        },
        // 保存
        handleSave (isProcess = false) {
            this.$refs.editForm.getValidateForm(() => {
                this.setMainCheckMaterials('equipmentCheckDetail');
                const data = this.$clone(this.pageConfig.projectForm);
                const equipmentCheckDetail = this.$refs.equipmentCheckDetail[0].validateTableData();
                if (!equipmentCheckDetail || equipmentCheckDetail.length === 0) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('equipCheck.equipmentCheckDetail')}${this.$t('tips.notFilledIn')}`);
                    return;
                }
                data.checkDetails = equipmentCheckDetail;
                this.handleSaveData(data, isProcess);
            });
        }
    }
};
</script>
