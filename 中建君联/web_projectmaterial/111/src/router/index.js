/*
 * @Author: your name
 * @Date: 2020-07-13 09:00:27
 * @LastEditTime: 2022-10-22 11:39:47
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_unit\src\router\index.js
 */
import Vue from 'vue';
import VueRouter from 'vue-router';

const Layout = () => import('views/lyout/index.vue');
const _import = require(`router/_import_${process.env.NODE_ENV}`); // 获取组件的方法

Vue.use(VueRouter);

export const constantRouterMap = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/login',
        name: 'login',
        component: _import('login/login')
    },
    {
      path: '/labelPrint',
      name: 'labelPrint',
      component: () => import('views/labelPrint/labelPrint')
    },
    {
        path: '',
        component: Layout,
        children: [
          {
            path: '/home',
            component: _import('home/home'),
            name: 'home',
            meta: {title: '首页', metaName: 'home', isCached: true}
          },
          {
            path: '/task',
            component: _import('task/task'),
            name: 'task',
            meta: {title: '我的任务', metaName: 'task'}
          },
          {
            path: '/processApprovalPage/:type/:taskDetailId/:translateName',
            component: _import('processApprovalPage/processApprovalPage'),
            name: 'processApprovalPage',
            meta: {title: '我的待办', metaName: 'processApprovalPage'}
          },
          {
            path: '/sceneProcessApprovalPage/:type/:taskDetailId/:translateName',
            component: _import('sceneProcessApprovalPage/sceneProcessApprovalPage'),
            name: 'sceneProcessApprovalPage',
            meta: {title: '我的待办', metaName: 'sceneProcessApprovalPage'}
          }
        ]
    },
    {
      path: '',
      name: 'printConfiguration',
      component: Layout,
      children: [
        {
          path: '/sporadicPurchaseGuration',
          component: _import('basic/sporadicPurchaseGuration/sporadicPurchaseGuration'),
          name: 'sporadicPurchaseGuration',
          meta: { title: '零星采购额度设置', metaName: 'sporadicPurchaseGuration' }
        },
        // 打印预览
        {
          path: '/printDesign/:formCode/:taskId/:id/:translateName',
          component: _import('printTemplate/printDesign'),
          name: 'printDesign',
          meta: {title: '打印模板', metaName: 'printDesign', lastRouterName: 'printTemplate', isCached: true}
        }
      ]
    },
    {
      path: '',
      name: 'demandPlan',
      component: Layout,
      children: [
        {
          path: '/masterPlanEdit/:type/:id/:translateName',
          component: _import('demandPlan/masterPlan/masterPlanEdit'),
          name: 'masterPlanEdit',
          meta: {title: '需求总计划', metaName: 'masterPlanEdit', lastRouterName: 'masterPlan', isCached: true}
        },
        {
          path: '/masterPlanAdjustEdit/:type/:id/:translateName',
          component: _import('demandPlan/masterPlanAdjust/masterPlanAdjustEdit'),
          name: 'masterPlanAdjustEdit',
          meta: {title: '需求总计划调整', metaName: 'masterPlanAdjustEdit', lastRouterName: 'masterPlanAdjust', isCached: true}
        },
        {
          path: '/yearPlanEdit/:type/:id/:translateName',
          component: _import('demandPlan/yearPlan/yearPlanEdit'),
          name: 'yearPlanEdit',
          meta: {title: '年度需求计划', metaName: 'yearPlanEdit', lastRouterName: 'yearPlan', isCached: true}
        },
        {
          path: '/quarterPlanEdit/:type/:id/:translateName',
          component: _import('demandPlan/quarterPlan/quarterPlanEdit'),
          name: 'quarterPlanEdit',
          meta: {title: '季度需求计划', metaName: 'quarterPlanEdit', lastRouterName: 'quarterPlan', isCached: true}
        },
        {
          path: '/monthPlanEdit/:type/:id/:translateName',
          component: _import('demandPlan/monthPlan/monthPlanEdit'),
          name: 'monthPlanEdit',
          meta: {title: '月度需求计划', metaName: 'monthPlanEdit', lastRouterName: 'monthPlan', isCached: true}
        },
        {
          path: '/tempPlanEdit/:type/:id/:translateName',
          component: _import('demandPlan/tempPlan/tempPlanEdit'),
          name: 'tempPlanEdit',
          meta: {title: '临时需求计划', metaName: 'tempPlanEdit', lastRouterName: 'tempPlan', isCached: true}
        },
        {
          path: '/weekPlanEdit/:type/:id/:translateName',
          component: _import('demandPlan/weekPlan/weekPlanEdit'),
          name: 'weekPlanEdit',
          meta: {title: '周需求计划', metaName: 'weekPlanEdit', lastRouterName: 'weekPlan', isCached: true}
        }
      ]
    },
    {
      path: '',
      name: 'promaterial',
      component: Layout,
      children: [
        {
          path: '/promaterialPurchaseApplyEdit/:type/:id/:translateName',
          component: _import('promaterial/promaterialPurchaseApply/promaterialPurchaseApplyEdit'),
          name: 'promaterialPurchaseApplyEdit',
          meta: {title: '采购计划', metaName: 'promaterialPurchaseApplyEdit', lastRouterName: 'promaterialPurchaseApply', isCached: true}
        },
        {
          path: '/supplyOrderEdit/:type/:id/:translateName/:orderSourceId/:orderSource',
          component: _import('promaterial/supplyOrder/supplyOrderEdit'),
          name: 'supplyOrderEdit',
          meta: {title: '供货订单', metaName: 'supplyOrderEdit', lastRouterName: 'supplyOrder', isCached: true}
        },
        {
          path: '/supplyOrderAEdit/:type/:id/:translateName',
          component: _import('promaterial/supplyOrderA/supplyOrderAEdit'),
          name: 'supplyOrderAEdit',
          meta: {title: '甲供订单', metaName: 'supplyOrderAEdit', lastRouterName: 'supplyOrderA', isCached: true}
        },
        {
          path: '/deliverGoods/:id/:type/:translateName',
          name: 'deliverGoods',
          component: _import('promaterial/deliverGoods/deliverGoods'),
          meta: { title: '发货单', metaName: 'deliverGoods'}
        },
        {
          path: '/deliverGoodsEdit/:id/:type/:translateName',
          component: _import('promaterial/deliverGoods/deliverGoodsEdit'),
          name: 'deliverGoodsEdit',
          meta: {title: '发货单', metaName: 'deliverGoodsEdit'}
        },
        {
          path: '/checkArrivalEdit/:type/:id/:translateName',
          component: _import('promaterial/checkArrival/checkArrivalEdit'),
          name: 'checkArrivalEdit',
          meta: {title: '到货验收', metaName: 'checkArrivalEdit', lastRouterName: 'checkArrival', isCached: true}
        },
        {
          path: '/sporadicPurchaseEdit/:type/:id/:translateName/:orderSourceId/:orderSource',
          component: _import('promaterial/sporadicPurchase/sporadicPurchaseEdit'),
          name: 'sporadicPurchaseEdit',
          meta: {title: '零星采购', metaName: 'sporadicPurchaseEdit', lastRouterName: 'sporadicPurchase', isCached: true}
        },
        {
          path: '/purchaseSettlementEdit/:type/:id/:translateName',
          component: _import('promaterial/purchaseSettlement/purchaseSettlementEdit'),
          name: 'purchaseSettlementEdit',
          meta: {title: '合同结算', metaName: 'purchaseSettlementEdit', lastRouterName: 'purchaseSettlement', isCached: true}
        },
        {
          path: '/supplierSettlementDeclarationEdit/:type/:id/:translateName',
          component: _import('promaterial/supplierSettlementDeclaration/supplierSettlementDeclarationEdit'),
          name: 'supplierSettlementDeclarationEdit',
          meta: {title: '结算申报', metaName: 'supplierSettlementDeclarationEdit', lastRouterName: 'supplierSettlementDeclaration', isCached: true}
        },
        {
          path: '/purchaseSettlementInfo/:type/:id/:translateName',
          component: _import('promaterial/purchaseSettlement/purchaseSettlementInfo'),
          name: 'purchaseSettlementInfo',
          meta: {title: '合同结算', metaName: 'purchaseSettlementInfo', lastRouterName: 'purchaseSettlement', isCached: true}
        },
        {
          path: '/paymentApplyEdit/:type/:id/:translateName',
          component: _import('promaterial/paymentApply/paymentApplyEdit'),
          name: 'paymentApplyEdit',
          meta: {title: '付款申请', metaName: 'paymentApplyEdit', lastRouterName: 'paymentApply', isCached: true}
        },
        {
          path: '/materialPaymentSupplierEdit/:type/:id/:translateName',
          component: _import('promaterial/materialPaymentSupplier/materialPaymentSupplierEdit'),
          name: 'materialPaymentSupplierEdit',
          meta: {title: '付款审核', metaName: 'materialPaymentSupplierEdit', lastRouterName: 'materialPaymentSupplier', isCached: true}
        },
        {
          path: '/paymentApplyInfo/:type/:id/:translateName',
          component: _import('promaterial/paymentApply/paymentApplyInfo'),
          name: 'paymentApplyInfo',
          meta: {title: '付款申请', metaName: 'paymentApplyInfo', lastRouterName: 'paymentApply', isCached: true}
        },
        {
          path: '/sporadicReimburseEdit/:type/:id/:translateName',
          component: _import('promaterial/sporadicReimburse/sporadicReimburseEdit'),
          name: 'sporadicReimburseEdit',
          meta: {title: '零星采购报销', metaName: 'sporadicReimburseEdit', lastRouterName: 'sporadicReimburse', isCached: true}
        },
        {
          path: '/purchaseContractLedgerEdit/:type/:id/:translateName',
          component: _import('promaterial/purchaseContractLedger/purchaseContractLedgerEdit'),
          name: 'purchaseContractLedgerEdit',
          meta: {title: '材料分类库', metaName: 'purchaseContractLedgerEdit', lastRouterName: 'purchaseContractLedger', isCached: true}
        }
      ]
    },
    {
      path: '',
      name: 'warManagement',
      component: Layout,
      children: [
        {
          path: '/warWarehouseShelves/:id/:createBy',
          component: _import('warManagement/warWarehouseShelves/warWarehouseShelves'),
          name: 'warWarehouseShelves',
          meta: {title: '仓库库位/货架子目管理', metaName: 'warWarehouseShelves', lastRouterName: 'warWarehouse'}
        },
        {
          path: '/warIncomingEdit/:type/:id/:sourceType/:sourceId/:translateName',
          component: _import('warManagement/warIncoming/warIncomingEdit'),
          name: 'warIncomingEdit',
          meta: {title: '材料入库', metaName: 'warIncomingEdit', lastRouterName: 'warIncoming', isCached: true}
        },
        {
          path: '/warOutboundEdit/:type/:id/:inComingId/:translateName',
          component: _import('warManagement/warOutbound/warOutboundEdit'),
          name: 'warOutboundEdit',
          meta: {title: '材料出库', metaName: 'warOutboundEdit', lastRouterName: 'warOutbound', isCached: true}
        },
        {
          path: '/warReturnEdit/:type/:id/:translateName',
          component: _import('warManagement/warReturn/warReturnEdit'),
          name: 'warReturnEdit',
          meta: {title: '领料退回', metaName: 'warReturnEdit', lastRouterName: 'warReturn', isCached: true}
        },
        {
          path: '/warReportlossEdit/:type/:id/:translateName',
          component: _import('warManagement/warReportloss/warReportlossEdit'),
          name: 'warReportlossEdit',
          meta: {title: '材料报损', metaName: 'warReportlossEdit', lastRouterName: 'warReportloss', isCached: true}
        },
        {
          path: '/warReturngoodsEdit/:type/:id/:translateName',
          component: _import('warManagement/warReturngoods/warReturngoodsEdit'),
          name: 'warReturngoodsEdit',
          meta: {title: '材料退货', metaName: 'warReturngoodsEdit', lastRouterName: 'warReturngoods', isCached: true}
        },
        {
          path: '/warAllocationEdit/:type/:id/:translateName',
          component: _import('warManagement/warAllocation/warAllocationEdit'),
          name: 'warAllocationEdit',
          meta: {title: '材料调拨', metaName: 'warAllocationEdit', lastRouterName: 'warAllocation', isCached: true}
        },
        {
          path: '/warInventoryEdit/:type/:id/:translateName',
          component: _import('warManagement/warInventory/warInventoryEdit'),
          name: 'warInventoryEdit',
          meta: {title: '盘点', metaName: 'warInventoryEdit', lastRouterName: 'warInventory', isCached: true}
        },
        {
          path: '/wasteMaterialsEdit/:type/:id/:translateName',
          component: _import('warManagement/wasteMaterials/wasteMaterialsEdit'),
          name: 'wasteMaterialsEdit',
          meta: {title: '废旧物资处置 ', metaName: 'wasteMaterialsEdit', lastRouterName: 'wasteMaterials', isCached: true}
        }
      ]
    },
    {
      path: '',
      component: Layout,
      children: [
        {
          path: '/equipInstallEdit/:type/:id/:translateName',
          component: _import('equip/equipInstall/equipInstallEdit'),
          name: 'equipInstallEdit',
          meta: {title: '工程设备安装', metaName: 'equipInstallEdit', lastRouterName: 'equipInstall', isCached: true}
        },
        {
          path: '/equipCheckEdit/:type/:id/:translateName',
          component: _import('equip/equipCheck/equipCheckEdit'),
          name: 'equipCheckEdit',
          meta: {title: '材料/工程设备检测', metaName: 'equipCheckEdit', lastRouterName: 'equipCheck', isCached: true}
        }
      ]
    },
    // 分包方材料管理
    {
      path: '',
      component: Layout,
      children: [
        {
          path: '/materialApproachEdit/:type/:id/:translateName',
          component: _import('subcontractorMaterial/materialApproach/materialApproachEdit'),
          name: 'materialApproachEdit',
          meta: {title: '材料进场', metaName: 'materialApproachEdit', lastRouterName: 'materialApproach', isCached: true}
        },
        {
          path: '/materialsBotheredEdit/:type/:id/:translateName',
          component: _import('subcontractorMaterial/materialsBothered/materialsBotheredEdit'),
          name: 'materialsBotheredEdit',
          meta: {title: '材料退场', metaName: 'materialsBotheredEdit', lastRouterName: 'materialsBothered', isCached: true}
        }
      ]
    }
];

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes: constantRouterMap
});

export default router;
