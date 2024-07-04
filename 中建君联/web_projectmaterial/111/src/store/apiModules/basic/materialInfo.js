/*
 * @Author: your name
 * @Date: 2020-07-23 10:24:39
 * @LastEditTime: 2022-08-29 16:53:56
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\basic\materialInfo.js
 */
export default {
    // 根据分类差品种
    getClssifyVarietiesList: {
      url: '/promaterial/basematerial/varieties/list/by/clssify',
      method: 'post'
    },
    // 根据品种查明细
    getVarietiesDetailList: {
        url: '/promaterial/basematerial/detail/list/by/varieties',
        method: 'post'
    },
    // 查询物资对应的所有入库明细数据
    getIncomingDetailsList: {
        url: '/promaterial/warehouse/incoming/material/details',
        method: 'post'
    },
    // 分页查询当前租户下的所有物资明细信息
    getBasematerialDetailPage: {
        url: '/promaterial/basematerial/detail/page',
        method: 'post'
    }
};
