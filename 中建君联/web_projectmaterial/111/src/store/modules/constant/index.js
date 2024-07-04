/*
 * @Author: your name
 * @Date: 2020-07-10 09:15:31
 * @LastEditTime: 2020-08-04 11:30:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration\src\store\modules\constant\constant.js
 */

const state = {
    initStatusList: [
        { dataCode: null, dataName: '未定义' },
        { dataCode: 0, dataName: '未初始化' },
        { dataCode: 1, dataName: '初始化中' },
        { dataCode: 2, dataName: '初始化完成' }
    ],
    // 状态 0 启用 1 禁用 2 删除
    statusList: [
        { dataCode: 0, dataName: 'button.enable'},
        { dataCode: 1, dataName: 'button.disable' },
        { dataCode: 2, dataName: 'button.delete' }
    ],
    // 审批状态 未审批 审批中 已审批
    flowStatusList: [
        { dataCode: '0', dataName: 'fConfig.flowStatus-0'},
        { dataCode: '01', dataName: 'fConfig.flowStatus-01' },
        { dataCode: '02', dataName: 'fConfig.flowStatus-02' }
    ],
    // 是否
    whetherList: [
        { dataCode: 1, dataName: 'tips.yes'},
        { dataCode: 0, dataName: 'tips.no'}
    ]
};
const mutations = {

  };
const actions = {

};
export default {
    namespaced: true,
    state,
    mutations,
    actions
};
