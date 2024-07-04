/*
 * @Author: your name
 * @Date: 2020-06-28 09:08:48
 * @LastEditTime: 2021-04-19 11:19:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration-施工云企业信息及配置\src\store\apiModules\aggregate.js
 */

import transfer from 'store/transfer';

// 公共的接口 语言 数据字典
import publicApiAll from './publicApi';
// 登录
import login from './login/login';
// 首页
import home from './home/home';
// 基础配置
import basic from './basic/index';
// 需求计划
import demandPlan from './demandPlan/index';
// 采购管理
import promaterial from './promaterial/index';
// 仓库管理
import warManagement from './warManagement/index';
// 工程
import equip from './equip/index';
// 跟踪执行
import processExecutionTracking from './processExecutionTracking';
// 分包方材料管理
import subcontractorMaterial from './subcontractorMaterial';


const serveAll = {
  ...processExecutionTracking,
  ...publicApiAll,
  login: {
    namespaced: true,
    actions: {
      ...transfer.transToActions(login)
    }
  },
  home: {
    namespaced: true,
    actions: {
      ...transfer.transToActions(home)
    }
  },
  ...basic,
  ...demandPlan,
  ...promaterial,
  ...warManagement,
  ...equip,
  ...subcontractorMaterial
};

export default {
  ...serveAll
};
