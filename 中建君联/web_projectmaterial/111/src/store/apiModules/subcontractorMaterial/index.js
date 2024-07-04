/*
 * @Author: your name
 * @Date: 2021-04-19 11:16:26
 * @LastEditTime: 2021-04-19 11:18:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\subcontractorMaterial\index.js
 */
import transfer from 'store/transfer';
// 材料进场
import materialApproach from './materialApproach';
// 材料退场
import materialsBothered from './materialsBothered';
// 材料台账
import materialParameter from './materialParameter';


const serveAll = {
    materialApproach: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(materialApproach)
        }
    },
    materialsBothered: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(materialsBothered)
        }
    },
    materialParameter: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(materialParameter)
        }
    }
};

export default {
    ...serveAll
};
