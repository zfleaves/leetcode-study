/*
 * @Author: your name
 * @Date: 2020-07-24 18:12:37
 * @LastEditTime: 2022-03-16 11:50:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_contract-合同管理\src\views\task\contract.js
 */
import config from 'util/config';

export default {
    //  ----------- 项目材料管理 -promaterial ---------------------
    //  ----------- 材料 ---------------------
    // 施工总预算
    demandMasterPlan: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'masterPlan'
    },
    // 调整
    demandMasterPlanAdjust: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'masterPlanAdjust'
    },
    // 年
    demandYearPlan: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'yearPlan'
    },
    // 季
    demandQuarterPlan: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'quarterPlan'
    },
    // 月
    demandMonthPlan: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'monthPlan'
    },
    // 临时
    demandTempPlan: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'tempPlan'
    },
    // 周
    demandWeekPlan: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'weekPlan'
    },
    // ----------- 采购管理 ---------------------
    // 采购计划
    purchasePurchaseApply: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'promaterialPurchaseApply'
    },
    // 供货订单
    purchaseSupplyOrder: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'supplyOrder'
    },
    // 甲供供货订单
    purchaseSupplyPartyAOrder: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'supplyOrderA'
    },
    // 到货验收
    purchaseCheckArrival: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'checkArrival'
    },
    // 零星采购
    purchaseSporadicPurchase: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'sporadicPurchase'
    },
    // 合同结算
    purchaseSettlement: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'purchaseSettlement'
    },
    // 付款申请
    purchasePaymentApply: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'paymentApply'
    },
    // 零星采购报销
    purchaseSporadicReimburse: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'sporadicReimburse'
    },
    // ----------- 出入库管理 ---------------------
    // 材料入库
    warehouseIncoming: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'warIncoming'
    },
    // 材料出库
    warehouseOutbound: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'warOutbound'
    },
    // 领料退回
    warehouseReturn: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'warReturn'
    },
    // 材料报损
    warehouseReportloss: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'warReportloss'
    },
    // 材料退货
    warehouseReturngoods: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'warReturngoods'
    },
    // 材料调拨
    warehouseAllocation: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'warAllocation'
    },
    // 盘点
    warehouseInventory: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'warInventory'
    },
    // 废旧物资处理
    warWasteMaterials: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'wasteMaterials'
    },
    // ----------- 工程设备管理 ---------------------
    // 工程设备安装
    equipmentInstall: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'equipInstall'
    },
    // 工程设备检测
    equipmentCheck: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'equipCheck'
    },
    // ----------- 分包方材料管理 ---------------------
    // 材料进场
    subcontractMaterialEnter: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'materialApproach'
    },
    // 材料退场
    subcontractMaterialExit: {
        jumpUrl: `${config.jumpUrl}/promaterial/#/processApprovalPage`,
        translateName: 'materialsBothered'
    }
};
