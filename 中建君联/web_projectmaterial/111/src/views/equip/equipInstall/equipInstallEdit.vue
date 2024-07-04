<!--
 * @Author: your name
 * @Date: 2020-07-30 10:35:06
 * @LastEditTime: 2020-09-08 11:56:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\equipInstall\equipInstallEdit.vue
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
                        <g-edit-title :title="$t(`equipInstall.${subTable.subTableName}`)">
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
                varietiesTitle="equipInstall.materialTitle"
                @getData="getData">
            </materialLibrary>
        </g-dialog>
        <!-- 选择子工程 -->
        <g-dialog v-if="projectChildFlag" :dialogConfig="projectChildDialogConfig" :isVisible.sync="projectChildFlag">
            <usePlaceDialog slot="body" slot-scope="{height}" :dialogHeight="height"
            :selectId='subTableRow.row.usePlaceId || 0'
            :projectId="pageConfig.projectForm.projectId || 0"
            :close.sync="projectChildFlag" @getData="getProjectChild" v-if="projectChildFlag"></usePlaceDialog>
        </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'equipInstallEdit',
    mixins: [editPage],
    data () {
        const installQuantityValid = (rule, value, callback) => {
            if (!value) {
                callback(new Error(this.$t('equipInstall.installQuantityValidTips')));
            } else {
                callback();
            }
        };
        return {
            page: new Page(),
            projectForm: {
                attachment: '',
                installDate: '',
                installSituation: '',
                mainInstallEquipment: '',
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
                title: this.$t('equipInstall.seleMaterialVarieties'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '80%',
                span: '0.75'
            },
            subTableCustomRules: {
                installQuantity: [{required: true, validator: installQuantityValid, trigger: 'blur' }]
            },
            varietiesIdList: [],
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
            subTableRow: {}
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
        },
        usePlaceDialog(resolve) {
          require(['components/basicComponents/global/dialog/usePlaceDialog/usePlaceDialog.vue'], resolve);
        }
    },
    methods: {
        // 获取info数据
        async _getInfoData(id = 0) {
            await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl);
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
            this.setSubTable('equipmentInstallDetail', arr);
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
                        installQuantity: 0,
                        installResult: '',
                        installUserName: '',
                        materialId: item.materialId,
                        materialName: item.materialName,
                        materialCode: item.materialCode,
                        models: item.models,
                        unit: item.unit,
                        brand: item.brand,
                        standards: item.standards,
                        remarks: '',
                        usePlaceId: '',
                        usePlaceName: ''
                    }
                );
            }
            return data;
        },
        // 批量删除后的回调
        deletTableCallback(tableName) {
            this.setMainCheckMaterials(tableName);
        },
        // 获取拟采购内容
        setMainCheckMaterials(tableName) {
            const mainInstallEquipment = this.pageConfig.subTableConfig[tableName].tableData.slice(-5).map(v => v.materialName).join(',');
            this.$set(this.pageConfig.projectForm, 'mainInstallEquipment', mainInstallEquipment);
        },
        // 保存
        handleSave (isProcess = false) {
            this.$refs.editForm.getValidateForm(() => {
                this.setMainCheckMaterials('equipmentInstallDetail');
                const data = this.$clone(this.pageConfig.projectForm);
                const equipmentInstallDetail = this.$refs.equipmentInstallDetail[0].validateTableData();
                if (!equipmentInstallDetail || equipmentInstallDetail.length === 0) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('equipInstall.equipmentInstallDetail')}${this.$t('tips.notFilledIn')}`);
                    return;
                }
                data.installDetails = equipmentInstallDetail;
                this.handleSaveData(data, isProcess);
            });
        }
    }
};
</script>
