/*
 * @Author: your name
 * @Date: 2020-07-30 11:21:48
 * @LastEditTime: 2022-10-19 10:21:11
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\promaterial\INDEX.JS
 */
import transfer from 'store/transfer';
// 采购
import promaterialPurchaseApply from './promaterialPurchaseApply';
// 订单
import supplyOrder from './supplyOrder';
// 到货验收
import checkArrival from './checkArrival';
// 零星采购
import sporadicPurchase from './sporadicPurchase';
// 合同结算
import purchaseSettlement from './purchaseSettlement';
// 付款申请
import paymentApply from './paymentApply';
// 零星采购报销
import sporadicReimburse from './sporadicReimburse';
// 采购台账
import purchaseContractLedger from './purchaseContractLedger';
// 甲供
import supplyOrderA from './supplyOrderA';
// 结算申报
import supplierSettlementDeclaration from './supplierSettlementDeclaration';
// 供方支付申请
import materialPaymentSupplier from './materialPaymentSupplier';

const serveAll = {
    promaterialPurchaseApply: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(promaterialPurchaseApply)
        }
    },
    supplyOrder: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(supplyOrder)
        }
    },
    checkArrival: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(checkArrival)
        }
    },
    sporadicPurchase: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(sporadicPurchase)
        }
    },
    purchaseSettlement: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(purchaseSettlement)
        }
    },
    paymentApply: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(paymentApply)
        }
    },
    sporadicReimburse: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(sporadicReimburse)
        }
    },
    purchaseContractLedger: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(purchaseContractLedger)
        }
    },
    supplyOrderA: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(supplyOrderA)
        }
    },
    supplierSettlementDeclaration: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(supplierSettlementDeclaration)
        }
    },
    materialPaymentSupplier: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(materialPaymentSupplier)
        }
    }
};

export default {
    ...serveAll
};
