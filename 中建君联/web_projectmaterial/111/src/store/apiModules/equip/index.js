/*
 * @Author: your name
 * @Date: 2020-08-11 17:14:07
 * @LastEditTime: 2020-08-11 17:15:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\equip\index.js
 */
import transfer from 'store/transfer';
// 检测
import equipCheck from './equipCheck';
// 安装
import equipInstall from './equipInstall';


const serveAll = {
    equipCheck: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(equipCheck)
        }
    },
    equipInstall: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(equipInstall)
        }
    }
};

export default {
    ...serveAll
};
