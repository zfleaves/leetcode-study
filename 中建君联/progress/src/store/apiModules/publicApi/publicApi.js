/*
 * @Author: your name
 * @Date: 2020-07-13 09:00:27
 * @LastEditTime: 2020-08-27 13:48:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_unit\src\store\apiModules\publicApi\publicApi.js
 */
import publicApiMix from 'mixins/publicApi';

export default {
    // 混入通用api
    ...publicApiMix,
    // 查询指定语言包
    languageValues: {
      url: '/backstage/language/values',
      method: 'get'
    },
    // 获取图路径（单个）
    getFileInfo: {
      url: '/basic/file/file/inf',
      method: 'get'
    },
    // 文件下载
    fileDownload: {
      url: '/basic/file/download',
      method: 'get',
      export: true,
      loading: true
    },
    // 批量获取文件路径
    getFilepath: {
      url: '/basic/file/file/list',
      method: 'post'
    },
    // 查询通用语言包
    getLanguageSubSystemCodeValues: {
      url: '/backstage/language/subSystemCode/value?subSystemCode=common',
      method: 'get'
    },
    // 获取数据项
    getDicItemValues: {
      url: '/basic/dictionary/conitem/values', // 租户数据字典
      // url: '/basic/dictionary/item/values', // 系统数据字典
      method: 'get'
    },
    // 搜索组织机构树
    getOrgTree: {
        url: '/basicconfiguration/organization/org/tree',
        method: 'get'
    },
     // 搜索组织机构树
    getEffectiveOrgTree: {
      url: '/basicconfiguration/organization/org/effective/tree',
      method: 'get'
    },
    // 获取组织机构下的用户
    getUserList: {
      url: '/basicconfiguration/organization/org/users',
      method: 'post'
    },
    // 分页查询有权限且项目状态为已启动且未竣工的项目
    getProjectPermissionList: {
      url: '/project/project/permission/page',
      method: 'post'
    },
    // 甲方一览
    getPartyAPage: {
        url: '/unit/partya/page',
        method: 'post'
    },
    // 获取甲方分类
    getPartyAType: {
        url: '/unit/partya/type/list/effective',
        method: 'get'
    },
    // 获取甲方信息
    getPartyAPageList: {
      url: '/unit/partya/page',
      method: 'post'
    },
    // 获取乙方信息
    getPartyBPageList: {
      url: '/unit/partyb/page',
      method: 'post'
    },
    // 查询项目下面的收入合同数据
    getContractIncomeRegisterPage: {
      url: '/contract/income/register/project/list',
      method: 'post'
    },
    // 查询项目下面的收入合同数据
    getContractIncomeSummaryPage: {
      url: '/contract/income/register/summary/page',
      method: 'post'
    },
     // 项目下的子工程 projectId
    getProjectChildTree: {
      url: '/project/child/tree',
      method: 'get'
    },
    // 付款选择合同
    getContractExpendClassifyPage: {
      url: '/proprogress/lease/payment/expendcontract/list/classify',
      method: 'post'
    },
    // 其他选择合同
    getV1ContractExpendClassifyPage: {
      url: '/contract/v1/expend/register/list/classify',
      method: 'post'
    },
    // 设置用户的常用菜单
    addCommonUsedMenu: {
      url: '/basicconfiguration/passport/used/add',
      method: 'get',
      responseType: 'arraybuffer'
    },
    // 查询指定项目下的目标工程量清单明细
    getProcostProjectCostDetail: {
      url: '/procost/cost/project/detail',
      method: 'get'
    }
};
