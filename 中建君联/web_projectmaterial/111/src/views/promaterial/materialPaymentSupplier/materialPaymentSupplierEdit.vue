<!--
 * @Author: your name
 * @Date: 2020-07-30 10:43:28
 * @LastEditTime: 2022-10-20 16:15:36
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\paymentApply\paymentApplyEdit.vue
-->
<template>
    <div>
        <edit-page @editEvent="editEvent" v-loading="loading" :isMatter="true" :isCustomButton="true" :isSave="false">
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
                <div v-if="pageConfig.projectForm && pageConfig.projectForm.flowStatus === '02'">
                    <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
                        <g-edit-title :title="$t(`paymentApply.${subTable.subTableName}`)">
                            <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
                            </g-button>
                        </g-edit-title>
                        <g-edit-pl-table
                            :ref="subTable.subTableName"
                            :type="type"
                            :isSelection="subTable.isSelection"
                            :tableConfig="subTable.tableList"
                            :subTable='subTable'
                            :delete.sync="deleteList[subTable.subTableName]"
                            @editTableEvent='editTableEvent'>
                        </g-edit-pl-table>
                    </div>
                </div>
            </div>
        </edit-page>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'materialPaymentSupplierEdit',
    mixins: [editPage],
    data () {
        return {
            page: new Page(),
            projectForm: {
                contractCode: '',
                applyDate: '',
                applyUserId: 0,
                applyUserName: '',
                attachment: '',
                reimburseAmount: 0,
                projectId: 0,
                purchaseContent: '',
                sporadicPurchaseReason: '',
                totalInvoiceAmount: '',
                totalPaymentAmount: '',
                totalSettlementAmount: '',
                contractAmount: '',
                actualPaymentAmount: 0,
                costControlRuleValue: '',
                costControlRuleCode: '',
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            }
        };
    },
    props: {
        processParmas: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        // 获取info数据
        async _getInfoData(id = 0) {
            await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl);
        },
        // 保存
        handleSave (isProcess = false) {
            this.$refs.editForm.getValidateForm(async () => {
                const data = this.$clone(this.pageConfig.projectForm);
                this.handleSaveData(data, isProcess);
            });
        }
    }
};
</script>
