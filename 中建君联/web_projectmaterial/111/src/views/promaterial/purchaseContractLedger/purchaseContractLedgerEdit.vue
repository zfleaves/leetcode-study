<template>
<div>
    <edit-page @editEvent="editEvent" v-loading="loading">
        <div slot="editPage">
            <g-edit-form
                ref="editForm"
                v-if="pageConfigLoading"
                :type="type"
                @editFormEvent='editFormEvent'
                :tableConfig="pageConfig.mainFormConfig"
                :projectForm="pageConfig.projectForm">
            </g-edit-form>
            <!-- 明细清单 -->
            <div v-if="pageConfigLoading">
                <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
                    <g-edit-title :title="$t(`purchaseContractLedger.${subTable.subTableName}`)">
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
import Auth from 'util/auth';

export default {
    name: 'purchaseContractLedgerEdit',
    mixins: [editPage],
    data () {
        return {
            page: new Page(),
            projectForm: {
                agentUserMobile: '',
                agentUserName: '',
                attachment: '',
                bidNoticeId: '',
                bidNoticeNo: '',
                contractClassifyId: '',
                contractClassifyName: '',
                contractCode: '',
                contractName: '',
                currencyCode: '',
                currencyValue: '',
                invoiceCode: '',
                invoiceValue: '',
                partyBUnitId: '',
                partyBUnitName: '',
                paymentProvision: '',
                qualityDepositAmount: '',
                qualityDepositScale: '',
                qualityRequirement: '',
                signAmount: '',
                signTime: '',
                signUserId: '',
                signUserName: '',
                taxRate: '',
                taxationCode: '',
                taxationValue: '',
                valuationCode: '',
                valuationValue: '',
                warrantyPeriod: '',
                proProjectInfoDtos: [],
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createByName: this.$utils.Auth.hasUserInfo().userName,
                createTime: this.$utils.commonUtil.formatTime(new Date())
            },
            buildUnitShow: false, // 施工单位
            partyASignShow: false, // 乙方签订人
            selectedUsersList: [],
            userList: [],
            partyAUnitShow: false, // 甲方单位,
            dialogVisible: false,
            tableRow: {
                amount: '',
                brand: '',
                buildDate: '',
                detailContent: '',
                featuresDescription: '',
                itemName: '',
                leaseDuration: '',
                models: '',
                quantity: '',
                remarks: '',
                standards: '',
                unit: '',
                unitPrice: ''
            },
            multipleList: [
                {docNo: '2223553'}
            ]
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
        _getInfoData(id = 0) {
            this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl);
        }
    }
};
</script>
