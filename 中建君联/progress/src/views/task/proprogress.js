/*
 * @Author: your name
 * @Date: 2020-07-24 18:12:37
 * @LastEditTime: 2021-04-14 10:54:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_contract-合同管理\src\views\task\contract.js
 */
import config from 'util/config';

export default {
    //  ----------- 项目进度云 -proprogress ---------------------
    // 月
    progressBulildlogapply: {
        jumpUrl: `${config.jumpUrl}/proprogress/#/processApprovalPage`,
        translateName: 'buildLogApply'
    },
    progressBulildlogOtherapply: {
        jumpUrl: `${config.jumpUrl}/proprogress/#/processApprovalPage`,
        translateName: 'buildLogOther'
    },
    progressImageWork: {
        jumpUrl: `${config.jumpUrl}/proprogress/#/processApprovalPage`,
        translateName: 'imageProgressWork'
    },
    progressImageOther: {
        jumpUrl: `${config.jumpUrl}/proprogress/#/processApprovalPage`,
        translateName: 'imageProgressOther'
    },
    progressInspectRegister: {
        jumpUrl: `${config.jumpUrl}/proprogress/#/processApprovalPage`,
        translateName: 'inspectRegister'
    },
    progressMasterPlan: {
        jumpUrl: `${config.jumpUrl}/proprogress/#/processApprovalPage`,
        translateName: 'demMasterPlan'
    },
    progressMasterPlanAdjust: {
        jumpUrl: `${config.jumpUrl}/proprogress/#/processApprovalPage`,
        translateName: 'demMasterPlanAdjust'
    },
    // 月计划
    progressMonthPlan: {
        jumpUrl: `${config.jumpUrl}/proprogress/#/processApprovalPage`,
        translateName: 'demMonthPlan'
    },
    progressMonthPlanAdjust: {
        jumpUrl: `${config.jumpUrl}/proprogress/#/processApprovalPage`,
        translateName: 'demMonthPlanAdjust'
    },
    progressMonthProgressReport: {
        jumpUrl: `${config.jumpUrl}/proprogress/#/processApprovalPage`,
        translateName: 'demMonthprogressReport'
    },
    // 周计划
    progressWeekPlan: {
        jumpUrl: `${config.jumpUrl}/proprogress/#/processApprovalPage`,
        translateName: 'demWeekPlan'
    },
    progressWeekProgressReport: {
        jumpUrl: `${config.jumpUrl}/proprogress/#/processApprovalPage`,
        translateName: 'demWeekprogressReport'
    },
    // 工期
    progressDurationriskRegister: {
        jumpUrl: `${config.jumpUrl}/proprogress/#/processApprovalPage`,
        translateName: 'durationRiskRegister'
    },
    // 报告
    progressInspectReport: {
        jumpUrl: `${config.jumpUrl}/proprogress/#/processApprovalPage`,
        translateName: 'inspectReport'
    }
};
