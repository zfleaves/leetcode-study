/*
 * @Author: your name
 * @Date: 2020-07-23 10:24:56
 * @LastEditTime: 2021-11-22 10:18:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\basic\index.js
 */
import transfer from 'store/transfer';
// 分类
import classifyWarehouse from './classifyWarehouse';
// 明细
import materialVarieties from './materialVarieties';
// 一览
import materialInfo from './materialInfo';
import ruleSetting from './ruleSetting';
import sporadicPurchaseGuration from './sporadicPurchaseGuration';
import historyMateria from './historyMateria';
// 专业
import projectMajor from './projectMajor';


const serveAll = {
    classifyWarehouse: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(classifyWarehouse)
        }
    },
    materialVarieties: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(materialVarieties)
        }
    },
    historyMateria: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(historyMateria)
        }
    },
    materialInfo: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(materialInfo)
        }
    },
    ruleSetting: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(ruleSetting)
        }
    },
    sporadicPurchaseGuration: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(sporadicPurchaseGuration)
        }
    },
    projectMajor: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(projectMajor)
        }
    }
};

export default {
    ...serveAll
};
