/*
 * @Author: your name
 * @Date: 2020-07-13 09:00:27
 * @LastEditTime: 2021-04-25 15:20:44
 * @LastEditors: Please set LastEditors
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
            path: '/test',
            component: _import('projectMsterPlan/test'),
            name: 'test',
            meta: { title: '甘特图测试页面', metaName: 'test' }
          },
          {
            path: '/buildLogApplyEdit/:type/:id/:translateName',
            component: _import('buildLog/buildLogApply/buildLogApplyEdit'),
            name: 'buildLogApplyEdit',
            meta: { title: '施工日志填报添加', metaName: 'buildLogApplyEdit', lastRouterName: 'buildLogApply', isCached: true }
          },
          {
            path: '/buildLogOtherEdit/:type/:id/:translateName',
            component: _import('buildLog/buildLogOther/buildLogOtherEdit'),
            name: 'buildLogOtherEdit',
            meta: { title: '其它日志填报添加', metaName: 'buildLogOtherEdit', lastRouterName: 'buildLogOther', isCached: true }
          },
          {
            path: '/imageProgressWorkEdit/:type/:id/:translateName',
            component: _import('imageProgress/imageProgressWork/imageProgressWorkEdit'),
            name: 'imageProgressWorkEdit',
            meta: { title: '工序形象进度填报添加', metaName: 'imageProgressWorkEdit', lastRouterName: 'imageProgressWork', isCached: true }
          },
          {
            path: '/imageProgressOtherEdit/:type/:id/:translateName',
            component: _import('imageProgress/imageProgressOther/imageProgressOtherEdit'),
            name: 'imageProgressOtherEdit',
            meta: { title: '其它形象进度填报添加', metaName: 'imageProgressOtherEdit', lastRouterName: 'imageProgressOther', isCached: true }
          },
          {
            path: '/inspectRegisterEdit/:type/:id/:translateName',
            component: _import('inspect/inspectRegister/inspectRegisterEdit'),
            name: 'inspectRegisterEdit',
            meta: { title: '巡检登记添加', metaName: 'inspectRegisterEdit', lastRouterName: 'inspectRegister', isCached: true }
          },
          {
            path: '/demMasterPlanEdit/:type/:id/:translateName',
            component: _import('demMaster/demMasterPlan/demMasterPlanEdit'),
            name: 'demMasterPlanEdit',
            meta: { title: '主计划编制添加', metaName: 'demMasterPlanEdit', lastRouterName: 'demMasterPlan', isCached: true }
          },
          {
            path: '/demMasterPlanAdjustEdit/:type/:id/:translateName',
            component: _import('demMaster/demMasterPlanAdjust/demMasterPlanAdjustEdit'),
            name: 'demMasterPlanAdjustEdit',
            meta: { title: '主计划调整添加', metaName: 'demMasterPlanAdjustEdit', lastRouterName: 'demMasterPlanAdjust', isCached: true }
          },
          // {
          //   path: '/demMasterExecute',
          //   component: _import('demMaster/demMasterExecute/demMasterExecute'),
          //   name: 'demMasterExecute',
          //   meta: { title: '主计划执行情况', metaName: 'demMasterExecute'}
          // },
          {
            path: '/ganttPage/:type/:id/:lastRouterName',
            component: () => import('components/gantt/ganttPage'),
            name: 'ganttPage',
            meta: { title: '甘特图', metaName: 'ganttPage', isCached: false }
          },
          {
            path: '/demMonthPlanEdit/:type/:id/:translateName',
            component: _import('demMonth/demMonthPlan/demMonthPlanEdit'),
            name: 'demMonthPlanEdit',
            meta: { title: '月计划分解下达添加', metaName: 'demMonthPlanEdit', lastRouterName: 'demMonthPlan', isCached: true }
          },
          {
            path: '/demMonthPlanAdjustEdit/:type/:id/:translateName',
            component: _import('demMonth/demMonthPlanAdjust/demMonthPlanAdjustEdit'),
            name: 'demMonthPlanAdjustEdit',
            meta: { title: '月计划调整添加', metaName: 'demMonthPlanAdjustEdit', lastRouterName: 'demMonthPlanAdjust', isCached: true }
          },
          {
            path: '/demMonthprogressReportEdit/:type/:id/:translateName',
            component: _import('demMonth/demMonthprogressReport/demMonthprogressReportEdit'),
            name: 'demMonthprogressReportEdit',
            meta: { title: '月进度完成上报添加', metaName: 'demMonthprogressReportEdit', lastRouterName: 'demMonthprogressReport', isCached: true }
          },
          {
            path: '/demWeekPlanEdit/:type/:id/:translateName',
            component: _import('demWeek/demWeekPlan/demWeekPlanEdit'),
            name: 'demWeekPlanEdit',
            meta: { title: '周计划分解下达添加', metaName: 'demWeekPlanEdit', lastRouterName: 'demWeekPlan', isCached: true }
          },
          {
            path: '/demWeekprogressReportEdit/:type/:id/:translateName',
            component: _import('demWeek/demWeekprogressReport/demWeekprogressReportEdit'),
            name: 'demWeekprogressReportEdit',
            meta: { title: '周进度完成上报添加', metaName: 'demWeekprogressReportEdit', lastRouterName: 'demWeekprogressReport', isCached: true }
          },
          // 工期风险管理
          {
            path: '/durationRiskConfigEdit/:type/:id/:translateName',
            component: _import('durationRisk/durationRiskConfig/durationRiskConfigEdit'),
            name: 'durationRiskConfigEdit',
            meta: { title: '工期风险项识别参考表添加', metaName: 'durationRiskConfigEdit', lastRouterName: 'durationRiskConfig', isCached: true }
          },
          {
            path: '/durationRiskRegisterEdit/:type/:id/:translateName',
            component: _import('durationRisk/durationRiskRegister/durationRiskRegisterEdit'),
            name: 'durationRiskRegisterEdit',
            meta: { title: '项目工期风险项登记添加', metaName: 'durationRiskRegisterEdit', lastRouterName: 'durationRiskRegister', isCached: true }
          },
          {
            path: '/inspectReportEdit/:type/:id/:translateName',
            component: _import('inspect/inspectReport/inspectReportEdit'),
            name: 'inspectReportEdit',
            meta: { title: '工程进度巡查报告添加', metaName: 'inspectReportEdit', lastRouterName: 'inspectReport', isCached: true }
          }
        ]
    },
    {
      path: '',
      name: 'printConfiguration',
      component: Layout,
      children: [
        // 打印预览
        {
          path: '/printDesign/:formCode/:taskId/:id/:translateName',
          component: _import('printTemplate/printDesign'),
          name: 'printDesign',
          meta: {title: '打印模板', metaName: 'printDesign', lastRouterName: 'printTemplate', isCached: true}
        }
      ]
    }
];

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes: constantRouterMap
});

export default router;
