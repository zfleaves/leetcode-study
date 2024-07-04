/*
 * @Author: your name
 * @Date: 2021-04-07 11:22:58
 * @LastEditTime: 2022-07-18 15:19:05
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial-项目材料管理\src\store\apiModules\processExecutionTracking\index.js
 */
import transfer from 'store/transfer';
// 需求跟踪管理
import requirementTracking from './requirementTracking';
// 订单跟踪管理
import orderTracking from './orderTracking';
// 零星采购跟踪
import sporadicPurchaseTracking from './sporadicPurchaseTracking';
// 入库单跟踪
import receiptTracking from './receiptTracking';
// 到货验收
import checkArrivalTracking from './checkArrivalTracking';
// 策划跟踪
import planExecutionTracking from './planExecutionTracking';
// 零星采购入库跟踪
import sporadicPurchaseWarTracking from './sporadicPurchaseWarTracking';

const serveAll = {
    requirementTracking: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(requirementTracking)
        }
    },
    orderTracking: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(orderTracking)
        }
    },
    sporadicPurchaseTracking: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(sporadicPurchaseTracking)
        }
    },
    receiptTracking: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(receiptTracking)
        }
    },
    checkArrivalTracking: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(checkArrivalTracking)
        }
    },
    planExecutionTracking: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(planExecutionTracking)
        }
    },
    sporadicPurchaseWarTracking: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(sporadicPurchaseWarTracking)
        }
    }
};

export default {
    ...serveAll
};
