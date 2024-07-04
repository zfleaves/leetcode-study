/*
 * @Author: your name
 * @Date: 2020-08-05 10:18:52
 * @LastEditTime: 2022-03-16 11:20:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\warManagement\index.js
 */
import transfer from 'store/transfer';
// 仓库维护
import warWarehouse from './warWarehouse';
// 仓库库位/货架子目管理
import warWarehouseShelves from './warWarehouseShelves';
// 入库
import warIncoming from './warIncoming';
// 出库
import warOutbound from './warOutbound';
// 领料退回
import warReturn from './warReturn';
// 报损
import warReportloss from './warReportloss';
// 退货
import warReturngoods from './warReturngoods';
// 调拨
import warAllocation from './warAllocation';
// 盘点
import warInventory from './warInventory';
// 废旧物资处理
import wasteMaterials from './wasteMaterials';
// 仓库统计
import warehouseStatistics from './warehouseStatistics';


const serveAll = {
    warWarehouse: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(warWarehouse)
        }
    },
    warWarehouseShelves: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(warWarehouseShelves)
        }
    },
    warIncoming: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(warIncoming)
        }
    },
    warOutbound: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(warOutbound)
        }
    },
    warReturn: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(warReturn)
        }
    },
    warReportloss: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(warReportloss)
        }
    },
    warReturngoods: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(warReturngoods)
        }
    },
    warAllocation: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(warAllocation)
        }
    },
    warInventory: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(warInventory)
        }
    },
    wasteMaterials: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(wasteMaterials)
        }
    },
    warehouseStatistics: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(warehouseStatistics)
        }
    }
};

export default {
    ...serveAll
};
