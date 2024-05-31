<!--
 * @Author: your name
 * @Date: 2021-01-21 14:52:41
 * @LastEditTime: 2022-03-02 17:20:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\components\gantt\gantt.vue
-->
<template>
  <div class="ganttWrap">
    <g-edit-title :title="`${$t(`menu.${routerName}`)} ${$t(`menu.ganttPage`)} ${$t(`button.${type}`)}`">
        <div class="ganttButton">
             <el-tooltip class="item" effect="dark" v-if="routerInfo.initUrl"
             :content="$t('dialog.adjustGanttTips')" placement="top-start" style="margin-right: 10px;font-size: 20px;">
                <span><i class="el-icon-question"></i></span>
            </el-tooltip>
            <el-button
                size="small" type="primary" icon="el-icon-plus"
                v-fast-click  @click="ganttCreateTask" :disabled="readonly">
                {{$t('button.add')}}
            </el-button>
            <el-button
                size="small" type="primary" icon="el-icon-circle-check"
                v-fast-click  @click="ganttSaveTask" :disabled="readonly">
                {{$t('button.save')}}
            </el-button>
            <el-button
                v-if="routerInfo.initUrl"
                size="small" type="primary" icon="el-icon-refresh"
                v-fast-click  @click="ganttInit" :disabled="readonly">
                {{$t('button.init')}}
            </el-button>
            <!-- <el-button
                size="small" type="primary" icon="el-icon-bangzhu"
                v-fast-click  @click="ganttToggleOverlay">
                {{$t('button.toggleOverlay')}}
            </el-button> -->
            <el-button
                size="small" type="primary" icon="el-icon-circle-check"
                v-fast-click  @click="ganttExport" :disabled="readonly">
                {{$t('button.export')}}
            </el-button>
            <el-button
                v-if="!routerInfo.initUrl"
                size="small" type="primary" icon="el-icon-circle-check"
                v-fast-click  @click="ganttImport" :disabled="readonly">
                {{$t('button.Import')}}
            </el-button>
            <el-button
                size="small" type="primary" icon="el-icon-bangzhu"
                v-fast-click  @click="ganttCriticalPath" :disabled="readonly">
                {{$t('button.criticalPath')}}
            </el-button>
            <span style="margin: 0 8px;">期间</span>
            <el-select v-model="ganttSacle" placeholder="" @change="ganttSetSacle"
                style="margin: 0 8px;display:inline-block;width: 100px;" size="small">
                <el-option
                    v-for="item in scaleList"
                    :key="item.dataValue"
                    :label="$t(item.dataName)"
                    :value="item.dataValue">
                </el-option>
            </el-select>
        </div>
    </g-edit-title>
    <div class="gantt" ref="gantt" v-loading="ganttLoading"></div>

    <g-dialog v-if="ganttExportFlag" :dialogConfig="ganttExportConfig" :isVisible.sync="ganttExportFlag">
        <template  slot="body" slot-scope="{height}">
            <div :style="{height : height + 'px'}" style="line-height: 36px;">
                <!-- <p class="midFont set" @click="ganttExportToPrimaveraP6">PrimaveraP6</p> -->
                <!-- <p class="midFont set" @click="ganttExportToMSProject">MSProject</p> -->
                <p class="midFont set" @click="ganttExportToExcel">Excel</p>
                <!-- <p class="midFont set" @click="ganttExportToICal">ICal</p> -->
                <!-- <p class="midFont set" @click="ganttExportGantt('pdf')">PDF</p>
                <p class="midFont set" @click="ganttExportGantt('png')">PNG</p> -->
            </div>
        </template>
    </g-dialog>
    <!-- 导入 -->
    <g-dialog v-if="ganttImportFlag" :dialogConfig="ganttImportConfig" :isVisible.sync="ganttImportFlag">
        <template  slot="body" slot-scope="{height}">
            <div :style="{height : height + 'px'}" class="ganttImportWrap">
                <h3>{{$t('dialog.MSProjectImport')}}
                    <!-- <a class="mpp-sample" href="assets/DemoProject.mpp" target="_blank">DemoProject.mpp</a> -->
                </h3>
                <div class="ganttImportItem">
                    <form id="mspImport" action="" method="POST" enctype="multipart/form-data">
                        <input type="file" id="mspFile" name="file"
                            accept=".mpp,.xml, text/xml, application/xml, application/vnd.ms-project, application/msproj,
                            application/msproject, application/x-msproject, application/x-ms-project, application/x-dos_ms_project, application/mpp, zz-application/zz-winassoc-mpp"/>
                        <el-button id="mspImportBtn" type="submit" style="float:right;" size="small" @click="handleMSProjectImport">
                            {{$t('button.determine')}}
                        </el-button>
                    </form>
                </div>
                <!-- <h3>{{$t('dialog.ExcelImport')}}
                    <a class="mpp-sample" href="../../../public/common/DemoProject.xlsx" target="_blank">DemoProject.xlsx</a>
                </h3>
                <div class="ganttImportItem">
                    <form id="mspImport" action="" method="POST" enctype="multipart/form-data">
                        <input type="file" id="excelFile" name="file" accept=".xlsx,.xls"/>
                        <el-button id="excelImportBtn" type="submit" style="float:right;" size="small" @click="handleExcelImport">
                            {{$t('button.determine')}}
                        </el-button>
                    </form>
                </div> -->
            </div>
        </template>
    </g-dialog>
    <!-- 详情 -->
    <g-dialog v-if="ganttDetailFlag" :dialogConfig="ganttDetailConfig" :isVisible.sync="ganttDetailFlag">
        <template  slot="body">
             <!-- :style="{height : height + 'px'}"  -->
            <div style="height: 100%">
                <ganttDetail :taskInfo="taskInfo" @close="ganttDetailFlag = false" :projectId="projectId"
                    v-if="ganttDetailFlag" @ganttSet="getGanttSet" :ganttType="ganttType" :workTime='workTime'>
                </ganttDetail>
            </div>
        </template>
    </g-dialog>
  </div>
</template>

<script>
// import gantt from 'dhtmlx-gantt'; // 引入模块
// // import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
// import 'dhtmlx-gantt/codebase/skins/dhtmlxgantt_terrace.css'; // 皮肤
// import 'dhtmlx-gantt/codebase/locale/locale_cn'; // 本地化
// import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_tooltip.js'; // 任务条悬浮提示
import { ganttTestData } from './testdata';
import {closeRoute} from 'mixins/index';
import perUtil from '@/util/index';

export default {
    mixins: [closeRoute],
    inject: ['ganttPage'],
    provide () {
        return {
            ganttTemplate: this
        };
    },
    components: {
        ganttDetail (resolve) {
            require(['./ganttDetail.vue'], resolve);
        }
    },
    data() {
        return {
            id: '',
            type: '',
            routerInfo: null,
            routerNameList: [
                {
                    name: 'demMasterPlan', infoUrl: 'demMasterPlan/getInfo', params: 'masterPlanId',
                    linkUrl: 'demMasterPlan/getLink', paramsLink: 'target', paramsLinkMainId: 'masterPlanId',
                    batchUrl: 'demMasterPlan/batchGanttEdit'
                },
                {
                    name: 'demMasterPlanAdjust', infoUrl: 'demMasterPlanAdjust/getInfo', params: 'masterPlanAdjustId',
                    linkUrl: 'demMasterPlanAdjust/getLink', paramsLink: 'target', paramsLinkMainId: 'masterPlanAdjustId',
                    initUrl: 'demMasterPlanAdjust/initGantt', paramsInitid: 'masterPlanId', paramsInitMainId: 'masterPlanAdjustId',
                    batchUrl: 'demMasterPlanAdjust/batchGanttEdit'
                },
                {
                    name: 'demMasterExecute', infoUrl: 'demMasterPlan/getInfo', params: 'masterPlanId',
                    linkUrl: 'demMasterPlan/getLink', paramsLink: 'target', paramsLinkMainId: 'masterPlanId',
                    batchUrl: 'demMasterPlan/batchGanttEdit'
                },
                {
                    name: 'history', infoUrl: 'demMasterPlan/getHistoryInfo', params: 'masterPlanBakId',
                    linkUrl: 'demMasterPlan/getLink', paramsLink: 'target', paramsLinkMainId: 'masterPlanId',
                    batchUrl: 'demMasterPlan/batchGanttEdit'
                }
            ],
            ganttTasks: {},
            gantt: null,
            ganttType: 'add',
            taskTempInfo: {
                'cid': '',
                'duration': 1,
                'dutyUserId': '',
                'dutyUserName': '',
                'end_date': '',
                'endDate': '',
                'hours': '8',
                'nodeId': '',
                'id': '',
                'leaf': 1,
                'masterPlanId': '',
                'open': '',
                'parent': '0',
                'progress': 0,
                'projectId': '',
                'realEndDate': '',
                'realStartDate': '',
                'remarks': '',
                'startDate': '',
                'start_date': '',
                'text': '',
                'type': '', // Milestone  Task project
                limitTypeName: '',
                limitTypeCode: '',
                limitDate: '',
                ifMilepostNode: '',
                ifCruxTask: ''
            },
            taskInfo: {},
            enabled: false,
            overlayControl: null, // 进度线
            lineOverlay: null, // 进度线
            ganttHanlder: null, // 事件绑定，
            ganttSacle: 'week',
            scaleList: [
                {dataValue: 'day', dataName: 'fConfig.day'},
                {dataValue: 'week', dataName: 'fConfig.week'},
                {dataValue: 'month', dataName: 'fConfig.month'},
                {dataValue: 'quarter', dataName: 'fConfig.quarter'},
                {dataValue: 'year', dataName: 'fConfig.year'}
            ],
            // 导出
            ganttExportFlag: false,
            ganttExportConfig: {
                title: this.$t('dialog.ganttExport'),
                appendBody: true,
                center: true,
                top: '280px',
                width: '15%',
                span: '0.2'
            },
            // 导入
            ganttImportFlag: false,
            ganttImportConfig: {
                title: this.$t('dialog.ganttImport'),
                appendBody: true,
                center: true,
                top: '180px',
                width: '40%',
                span: '0.5'
            },
            importLoading: null,
            // 编辑弹窗
            ganttDetailFlag: false,
            ganttDetailConfig: {
                title: this.$t('dialog.ganttDetail'),
                appendBody: true,
                center: true,
                top: '50px',
                width: '70%',
                span: '0.75'
            },
            calendarWorkEditDtos: [
                { ifFlag: 0, calendarValue: '星期日', calendarCode: 0, workHours: 8, remarks: ''},
                { ifFlag: 1, calendarValue: '星期一', calendarCode: 1, workHours: 8, remarks: ''},
                { ifFlag: 1, calendarValue: '星期二', calendarCode: 2, workHours: 8, remarks: ''},
                { ifFlag: 1, calendarValue: '星期三', calendarCode: 3, workHours: 8, remarks: ''},
                { ifFlag: 1, calendarValue: '星期四', calendarCode: 4, workHours: 8, remarks: ''},
                { ifFlag: 1, calendarValue: '星期五', calendarCode: 5, workHours: 8, remarks: ''},
                { ifFlag: 0, calendarValue: '星期六', calendarCode: 6, workHours: 8, remarks: ''}
            ],
            createChildrenLength: 0,
            tempImprotData: [],
            ganttLoading: true,
            defaultStartTime: '08:30',
            defaultEndTime: '17:30',
            workTime: {}
        };
    },
    props: {
        projectId: {
            default: ''
        },
        planStartDate: {
            default: ''
        },
        tasks: {
            default: () => {}
        },
        // 只读模式
        readonly: {
            type: Boolean,
            default: false
        },
        // 自适应甘特图的尺寸大小, 使得在不出现滚动条的情况下, 显示全部任务
        autosize: {
            type: Boolean,
            default: true
        },
        // 是否显示左侧树表格
        showGrid: {
            type: Boolean,
            default: true
        },
        // 是否显示右侧树表格
        // showChart: {
        //     type: Boolean,
        //     default: true
        // },
        // 显示甘特图的图表（时间线）区域
        showChart: {
            type: Boolean,
            default: true
        },
        // 双击后打开灯箱
        detailsOnDblclick: {
            type: Boolean,
            default: false
        },
        // 时间轴图表中，如果不设置，只有行边框，区分上下的任务，设置之后带有列的边框，整个时间轴变成格子状。
        showTaskCells: {
            type: Boolean,
            default: true
        },
        // 当task的长度改变时，自动调整图表坐标轴区间用于适配task的长度
        fitTasks: {
            type: Boolean,
            default: true
        },
        // 保留初始网格的宽度，同时调整内部列的大小
        keepGridWidth: {
            type: Boolean,
            default: false
        },
        // 通过拖动右侧网格的边框使网格可调整大小
        gridResize: {
            type: Boolean,
            default: true
        },
        // 通过单击+/-按钮可以展开/折叠拆分任务
        openSplitTasks: {
            type: Boolean,
            default: true
        }
    },
    created() {
        console.log(222222);
        this.ganttLoading = true;
        const params = this.$route.params;
        this.id = this.$base64.decode(params.id);
        this.type = this.$base64.decode(params.type);
        this.routerName = params.lastRouterName;
        this.routerInfo = this.routerNameList.find(v => v.name === this.routerName);
        // eslint-disable-next-line no-undef
        gantt.plugins({
            auto_scheduling: true,
            critical_path: true,
            marker: true,
            overlay: true,
            tooltip: true
        });
        // eslint-disable-next-line no-undef
        this.gantt = gantt;
        // this.gantt.clearAll();
        this.initZoom();
        // this.initZoom(this.gantt);
        // console.log(this.gantt, 'gantt');
        this.overlayControl = this.gantt.ext.overlay;
        // console.log(new Date('2021-01-26 00:00:00'));
    },
    mounted() {
        this.ganttTasks = this.$clone(this.tasks);
        // 获取工作时间
        this.getWorkTime();
        // this.initData();
        this.ganttHanlder = this.$utils.commonUtil.debounce((event) => {
            const taksId = event.target.getAttribute('data-taskId');
            // console.log(taksId, 'taksId');
            event.stopPropagation;
            const className = event.target.className;
            if (className.indexOf('ganttSet') >= 0) {
                const taksId = event.target.getAttribute('data-taskId');
                if (className.indexOf('el-icon-edit') >= 0) {
                    this.ganttEditTask(taksId);
                    return;
                }
                if (className.indexOf('el-icon-plus') >= 0) {
                    this.ganttAddTask(taksId);
                    return;
                }
                if (className.indexOf('el-icon-delete') >= 0) {
                    this.ganttDeleteTask(taksId);
                }
            }
        }, 100);
        // 绑定按钮监听事件
        window.addEventListener('click', this.ganttHanlder);
    },
    methods: {
        // 自动计算进度
        dynamicProgress() {
            const that = this;
            // 计算进度条
            function calculateSummaryProgress(task) {
                if (task.type !== that.gantt.config.types.project) {
                    return task.progress;
                }
                let totalToDo = 0;
                let totalDone = 0;
                that.gantt.eachTask((child) => {
                    if (child.type !== that.gantt.config.types.project) {
                        totalToDo += child.duration;
                        totalDone += (child.progress || 0) * child.duration;
                    }
                }, task.id);
                if (!totalToDo) return 0;
                else return totalDone / totalToDo;
            }
            // 刷新进度条
            function refreshSummaryProgress(id, submit) {
                if (!that.gantt.isTaskExists(id)) return;
                const task = that.gantt.getTask(id);
                task.progress = calculateSummaryProgress(task);
                if (!submit) {
                    that.gantt.refreshTask(id);
                } else {
                    that.gantt.updateTask(id);
                }
                if (!submit && that.gantt.getParent(id) !== that.gantt.config.root_id) {
                    refreshSummaryProgress(that.gantt.getParent(id), submit);
                }
            }
            that.gantt.attachEvent('onParse', () => {
                that.gantt.eachTask((task) => {
                    task.progress = calculateSummaryProgress(task);
                });
            });
            that.gantt.attachEvent('onAfterTaskUpdate', (id) => {
                refreshSummaryProgress(that.gantt.getParent(id), true);
            });
            that.gantt.attachEvent('onTaskDrag', (id) => {
                refreshSummaryProgress(that.gantt.getParent(id), false);
            });
            that.gantt.attachEvent('onAfterTaskAdd', (id) => {
                refreshSummaryProgress(that.gantt.getParent(id), true);
            });
            (function () {
                let idParentBeforeDeleteTask = 0;
                that.gantt.attachEvent('onBeforeTaskDelete', (id) => {
                    idParentBeforeDeleteTask = that.gantt.getParent(id);
                });
                that.gantt.attachEvent('onAfterTaskDelete', () => {
                    refreshSummaryProgress(idParentBeforeDeleteTask, true);
                });
            }());
        },
        async getWorkTime() {
            const timeRes = await this.$store.dispatch('projectCalendar/getWorktimeInfo', {projectId: this.projectId}).then();
            const workTime = timeRes.results;
            this.workTime = timeRes.results;
            this.$store.dispatch('projectCalendar/getWorkList', {projectId: this.projectId}).then(res => {
                if (res.status === 0) {
                    if (res.results && res.results.length) {
                        this.basicCalendarWorkEditDtos = res.results;
                    } else {
                        this.basicCalendarWorkEditDtos = this.$clone(this.calendarWorkEditDtos);
                    }
                    const WorkTimeList = this.basicCalendarWorkEditDtos.filter(v => v.ifFlag === 1);
                    for (const item of WorkTimeList) {
                        const day = Number(item.calendarCode);
                        if (workTime && workTime.workHours !== null) {
                            this.gantt.setWorkTime({day, hours: [
                                    `${workTime.morningStartDate}-${workTime.morningEndDate}`,
                                    `${workTime.afternoonStartDate}-${workTime.afternoonEndDate}`
                                ]
                            });
                        } else {
                            this.gantt.setWorkTime({day, hours: ['8:30-12:00', '13:00-17:30']});
                        }
                        // gantt.setWorkTime({hours: [8, 12, 13, 17]});//global working hours. 8:00-12:00, 13:00-17:00
                        // this.gantt.setWorkTime({day, hours: ['8:00-12:00', '14:00-18:00']});
                        // this.gantt.setWorkTime({day, hours: [8, 12, 14, 18]});
                    }
                    this.setExcludecalendarList();
                    this.dynamicProgress();
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
        },
        // 设置假期和 工作时间
        setExcludecalendarList() {
            this.$store.dispatch('projectCalendar/getExcludecalendarList', {projectId: this.projectId}).then(res => {
                if (res.status === 0) {
                    if (res.results) {
                        const yesList = []; // 工作日
                        const noList = []; // 非工作日
                        for (const item of res.results) {
                            item.diffDate = perUtil.getDiffDate(item.startDate, item.endDate);
                            console.log(item, 'item');
                            for (const child of item.diffDate) {
                                if (item.ifFlag) {
                                   yesList.push(child);
                                } else {
                                    noList.push(child);
                                }
                            }
                        }
                        const results = res.results || [];
                        // const yesList = results.filter(v => v.ifFlag).map(v => v.diffDate); // 工作日
                        // const noList = results.filter(v => !v.ifFlag).map(v => v.diffDate); // 非工作日
                        // console.log(yesList, 'yesList');
                        // console.log(noList, 'noList');
                        for (const item of yesList) {
                            const date = [item, '00:00:00'].join(' ');
                            // this.gantt.setWorkTime({date: new Date(date), hours: ['8:00-12:00', '14:00-18:00']});// specific working day
                            // this.gantt.setWorkTime({date: new Date(date), hours: [8, 12, 14, 18]});// specific working day
                            if (this.workTime && this.workTime.workHours !== null) {
                                this.gantt.setWorkTime({date: new Date(date), hours: [
                                        `${this.workTime.morningStartDate}-${this.workTime.morningEndDate}`,
                                        `${this.workTime.afternoonStartDate}-${this.workTime.afternoonEndDate}`
                                    ]
                                });
                            } else {
                                this.gantt.setWorkTime({date: new Date(date), hours: ['8:30-12:00', '13:00-17:30']});
                            }
                        }
                        // 设置假期
                        for (const item of noList) {
                            const date = [item, '00:00:00'].join(' ');
                            this.gantt.setWorkTime({date: new Date(date), hours: false});// specific working day
                        }
                    }
                    // 初始化甘特图
                    this.initData();
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
        },
        initZoom() {
            this.ganttSetSacle(this.ganttSacle, false);
        },
        // 初始化甘特图
        initData() {
            for (const item of this.ganttTasks.data) {
                item.start_date = `${item.start_date} ${this.workTime.morningStartDate || this.defaultStartTime}`;
                item.startDate = item.start_date;
                item.end_date = `${item.end_date} ${this.workTime.afternoonEndDate || this.defaultEndTime}`;
                item.endDate = item.end_date;
            }
            const that = this;
            // this.gantt.attachEvent('onParse', () => {
            //     this.ganttImportFlag = false;
            //     this.importLoading && this.importLoading.close();
            //     console.log(this.gantt.eachTask, 'eachTask');
            //     this.gantt.eachTask && this.gantt.eachTask((task) => {
            //         if (this.gantt.hasChild(task.id)) {
            //             task.type = this.gantt.config.types.project;
            //             this.gantt.updateTask(task.id);
            //         } else if (task.duration === 0) {
            //             task.type = this.gantt.config.types.milestone;
            //             this.gantt.updateTask(task.id);
            //         }
            //     });
            // });
            // 自适应甘特图的尺寸大小, 使得在不出现滚动条的情况下, 显示全部任务
            this.gantt.config.autosize = this.readonlautosizey;
            // 只读模式
            this.gantt.config.readonly = this.readonly;
            // 允许通过拖放调整任务大小
            this.gantt.config.drag_resize = false;
            // 允许通过拖放移动任务
            this.gantt.config.drag_move = false;
            // 允许拖放项目类型的项目
            this.gantt.config.drag_project = false;
            // 是否显示左侧树表格
            this.gantt.config.show_grid = this.showGrid;
            // 显示甘特图的图表（时间线）区域
            this.gantt.config.show_chart = this.showChart;
            // 双击后打开灯箱
            this.gantt.config.details_on_dblclick = this.detailsOnDblclick;
            // 保留初始网格的宽度，同时调整内部列的大小
            this.gantt.config.keep_grid_width = this.keepGridWidth;
            // 通过拖动右侧网格的边框使网格可调整大小
            this.gantt.config.gridResize = this.gridResize;
            // 调整可滚动网格内的列宽
            this.gantt.config.grid_elastic_columns = true;
            // 激活“分支”模式，该模式允许在同一树级别内垂直重新排序任务
            this.gantt.config.order_branch = true;
            // 激活“分支”模式，该模式允许在整个甘特图中重新排序任务
            this.gantt.config.order_branch_free = true;
            // 自动将具有子任务的任务转换为项目，将没有子任务的项目转换回任务
            this.gantt.config.auto_types = false;
            // 禁用任务使用时间约束
            // this.gantt.config.auto_scheduling_compatibility = this.type === 'info';
            this.gantt.config.auto_scheduling_compatibility = this.type === 'info';
            // 通过单击+/-按钮可以展开/折叠拆分任务
            this.gantt.config.open_split_tasks = this.openSplitTasks;
            // 启用计算工作时间而不是日历时间的持续时间
            this.gantt.config.work_time = true;
            this.gantt.config.duration_unit = 'hour';
            // this.gantt.config.duration_step = 24;
            this.gantt.config.auto_scheduling = true;
            this.gantt.config.auto_scheduling_strict = true;
            // 启用向后调度
            this.gantt.config.schedule_from_end = true;

            // this.gantt.setWorkTime({hours: [8, 12, 14, 18]});//global working hours
            // this.gantt.config.project_end = new Date(1915, 11, 1);
            // this.gantt.config.scale_unit = 'month';
            // this.gantt.config.date_scale = '%F, %Y';
            // this.gantt.config.scale_height = 50;
            // this.gantt.config.subscales = [
            //     { unit: 'day', step: 1, date: '%j, %D' }
            // ];
            const colHeader = '<i class="el-icon-plus" οnclick="ganttCreateTask()"></i>';
            // console.log(colHeader, 'colHeader');
			const colContent = (task) => {
				return (`<i class="el-icon-plus set ganttSet" data-taskId="${task.id}" οnclick="ganttAddTask(${task.id})"></i>` +
					`<i class="el-icon-edit set ganttSet" data-taskId="${task.id}"  οnclick="ganttEditTask(${task.id})"></i>` +
					`<i class="el-icon-delete set ganttSet" data-taskId="${task.id}"  οnclick="ganttDeleteTask(${task.id})"></i>`);
            };
            const workHours = this.workTime.workHours || 8;
            const durationContent = (task) => {
				return (`<span>${Number((task.duration / workHours).toFixed(1))}</span>`);
            };
            const progressContent = (task) => {
				return (`<span>${Number((task.progress * 100).toFixed(2))}%</span>`);
            };
            const getInput = function(node) {
                return node.querySelector('input');
            };
            // 自定义编辑器
            this.gantt.config.editor_types.input_editor = {
                show (id, column, config, placeholder) {
                    // console.log(config, 'config');
                    const html = `<div><input type='text' name='${column.name}' maxlength='64'></div>`;
                    placeholder.innerHTML = html;
                },
                hide () {
                    // called when input is hidden
                    // destroy any complex editors or detach event listeners from here
                },
                set_value (value, id, column, node) {
                    getInput(node).value = value;
                    // set input value
                },
                get_value (id, column, node) {
                    // return input value
                    return getInput(node).value;
                },
                is_changed (value, id, column, node) {
                    const currentValue = this.get_value(id, column, node);
                    return currentValue;
                },
                is_valid (value, id, column, node) {
                    // validate, changes will be discarded if the method returns false
                    return true / false;
                },
                save (id, column, node) {
                    // only for inputs with map_to:auto. complex save behavior goes here
                },
                focus (node) {
                }
            };
            const textEditor = {type: 'input_editor', map_to: 'text', maxlength: 64};
            const dateEditor = {type: 'date', map_to: 'start_date'};
            const dateEndEditor = {type: 'date', map_to: 'end_date'};
            const durationEditor = {type: 'number', map_to: 'duration', min: 1, max: 100};
            this.gantt.config.columns = [
                { name: 'text', label: this.$t('dialog.taskName'), tree: true, width: '140', resize: true, editor: textEditor },
                // { name: 'start_date', align: 'center', resize: true, width: '100', label: this.$t('dialog.start_date'), editor: dateEditor},
                { name: 'start_date', align: 'center', resize: true, width: '100', label: this.$t('dialog.start_date')},
                // 实际开始日期
                {
                    name: 'realStartDate', align: 'center', resize: true,
                    width: '100', label: this.$t('dialog.realStartDate'),
                    hide: this.routerName !== 'demMasterExecute'
                },
                // { name: 'end_date', align: 'center', resize: true, width: '100', label: this.$t('dialog.end_date'), editor: dateEndEditor },
                { name: 'end_date', align: 'center', resize: true, width: '100', label: this.$t('dialog.end_date') },
                // 实际/预估完成日期
                {
                    name: 'realEndDate', align: 'center', resize: true,
                    width: '100', label: this.$t('dialog.realEndDateEX'),
                    hide: this.routerName !== 'demMasterExecute'
                },
                // { name: 'duration', align: 'center', width: '60', label: this.$t('dialog.hours'), resize: true, editor: durationEditor},
                { name: 'duration', align: 'center', width: '60', label: this.$t('dialog.hours'), resize: true},
                {
                    name: 'duration', align: 'center', width: '60', label: this.$t('fConfig.day'), resize: true,
                    template: durationContent
                },
                // 实际/预估完成日期
                {
                    name: 'realDuration', align: 'center', resize: true,
                    label: this.$t('dialog.realDuration'),
                    hide: this.routerName !== 'demMasterExecute'
                },
                { name: 'dutyUserName', align: 'center', width: '60', label: this.$t('dialog.dutyUserName'), resize: true },
                // // 进度
                // {
                //     name: 'progress', align: 'center', resize: true,
                //     label: this.$t('dialog.progress'),
                //     hide: this.routerName !== 'demMasterExecute'
                // },
                // 进度预估
                {
                    name: 'progress', align: 'center', resize: true,
                    label: this.$t('dialog.progressEstimate'),
                    hide: this.routerName !== 'demMasterExecute',
                    template: progressContent
                },
                {
                    name: 'buttons',
                    label: this.$t('fConfig.operate'),
                    width: 75,
                    align: 'center',
                    hide: this.readonly,
                    template: colContent
                }
            ];
            // 时间轴图表中，如果不设置，只有行边框，区分上下的任务，设置之后带有列的边框，整个时间轴变成格子状。
            this.gantt.config.show_task_cells = this.showTaskCells;
            // 设置x轴日期
            // this.gantt.config.scale_unit = 'day';
            // this.gantt.config.step = 1;
            // this.gantt.config.date_scale = '星期%D';
            // this.gantt.config.scale_height = 50;
            // // 当task的长度改变时，自动调整图表坐标轴区间用于适配task的长度
            this.gantt.config.fit_tasks = this.fitTasks;
            //  // 在时间线上增加一行显示星期
            // this.gantt.config.subscales = [
            //     // {unit:"day",  step:1, date:"星期"+"%D" },
            //     { unit: 'day', step: 1, date: '%M%d日'}
            // ];
            // 时间轴图表中，任务条形图的高度
            this.gantt.config.task_height = 28;
            // 时间轴图表中，甘特图的高度
            this.gantt.config.row_height = 36;
            // 从后端过来的数据格式化
            // this.gantt.config.xml_date = '%Y-%m-%d';
            this.gantt.config.xml_date = '%Y-%m-%d %H:%i';
            this.gantt.config.date_format = '%Y-%m-%d %H:%M:%S';
            // 网格列宽
            // 任务条显示内容
            this.gantt.templates.task_text = function(start, end, task) {
                let progress = task.progress * 100;
                progress = Number(progress.toFixed(4));
                const day = task.duration / workHours;
                return `${task.text}(${Number(day.toFixed(1))}天) (${progress}%)`;
            };
            // gantt.templates.task_class = function(start, end, task){return "xx";};
            // 悬浮
            this.gantt.templates.tooltip_text = (start, end, task) => {
                let progress = task.progress * 100;
                progress = Number(progress.toFixed(4));
                const day = task.duration / workHours;
                // return "<b>任务名称:</b> "+task.text+"<br/><b>时长:</b> " + task.duration+"<br/><b>说明:</b>" +task.toolTipsTxt;
                return `<h3 style='font-size: 14px'>${that.$t('dialog.taskName')}:${task.text}</h3>
                <p>${that.$t('dialog.start_date')}:${this.$utils.commonUtil.formatDate(task.start_date)}</p>
                <p>${that.$t('dialog.end_date')}:${this.$utils.commonUtil.formatDate(task.end_date)}</p>
                <p>${that.$t('dialog.duration')}:${Number(day.toFixed(1))}</p>
                <p>${that.$t('dialog.progress')}:${progress}%</p>`;
            };

            this.gantt.templates.scale_cell_class = function(date) {

                /* if(date.getDay()== 0 || date.getDay()== 6){
                    return "weekend";
                } */
                return 'weekend';
            };
            // 任务栏周末亮色
            this.gantt.templates.timeline_cell_class = function(task, date) {
                // console.log(that.gantt.isWorkTime(date, 'hour'));
                if (!that.gantt.isWorkTime({date, task})) {
                    return 'week_end';
                }
                return '';
                // if (date.getDay() === 0 || date.getDay() === 6) {
                //     return 'weekend';
                // }
            };
            // 任务条上的文字大小 以及取消border自带样式
            this.gantt.templates.task_class = function(start, end, item) {
                return item.$level === 0 ? 'firstLevelTask' : 'secondLevelTask';
            };
            // 隐藏进度条
            this.gantt.templates.task_class = function (start, end, task) {
                // console.log(task, 'hide_project_progress_drag');
                // if (task.type === 'project' || (task.children && task.children.length)) {
                //     return 'hide_project_progress_drag';
                // }
                return 'hide_project_progress_drag';
            };
            this.gantt.attachEvent('onAfterTaskUpdate', (id, item) => {
                // console.log(item, 'onAfterTaskUpdate-item');
            });
            this.gantt.attachEvent('onBeforeBatchUpdate', (id, item) => {
                // console.log(item, 'onBeforeBatchUpdate-item');
            });
            // 初始化
            this.gantt.init(this.$refs.gantt);
            // eslint-disable-next-line no-undef
            // const fileDnD = fileDragAndDrop();
            // console.log(fileDnD, 'fileDnD');
            // 数据解析
            console.log(this.ganttTasks, 'ganttTasks');
            this.gantt.parse(this.ganttTasks);
            this.ganttLoading = false;
            // 调整编制进来 初始化
            if (this.ganttTasks.data.length === 0) {
                if (this.routerInfo.initUrl) {
                    this.ganttFirstInit();
                }
            }
            // 自动调整比例
            // this.gantt.attachEvent('onScaleAdjusted', that.showScaleDesc);
        },
        ganttFirstInit() {
            const { infoUrl, params, initUrl, paramsInitid, paramsInitMainId } = this.routerInfo;
            const initData = {
                [paramsInitid]: this.ganttPage.masterPlanId,
                [paramsInitMainId]: this.id
            };
            const loading = this.getLoading();
            this.$store.dispatch(initUrl, initData).then(async res => {
                if (res.results) {
                    const ganttRes = await this.$store.dispatch(infoUrl, {[params]: this.id});
                    const demMasterPlanGant = this.setData(ganttRes.results.demMasterPlanGants);
                    const demMasterPlanLinks = ganttRes.results.demMasterPlanLinks;
                    const ganttTasks = {
                        data: demMasterPlanGant,
                        links: demMasterPlanLinks
                    };
                    console.log(ganttTasks, 'ganttTasks');
                    // this.gantt.clearAll();
                    this.gantt.parse(ganttTasks);
                }
                loading.close();
            }).catch(e => {
                loading.close();
            });
        },
        // 初始化最新的进度信息
        ganttInit() {
            const { infoUrl, params, initUrl, paramsInitid, paramsInitMainId } = this.routerInfo;
            const initData = {
                [paramsInitid]: this.ganttPage.masterPlanId,
                [paramsInitMainId]: this.id
            };
            const message = '您确定要初始化数据么，之前的甘特图数据将会清空？';
            this.$confirm(message, this.$t('button.init'), {
                confirmButtonText: this.$t('button.determine'),
                cancelButtonText: this.$t('button.close'),
                type: 'warning'
            }).then(() => {
                const loading = this.getLoading();
                this.$store.dispatch(initUrl, initData).then(async res => {
                    if (res.results) {
                        const ganttRes = await this.$store.dispatch(infoUrl, {[params]: this.id});
                        const demMasterPlanGant = this.setData(ganttRes.results.demMasterPlanGants);
                        const demMasterPlanLinks = ganttRes.results.demMasterPlanLinks;
                        const ganttTasks = {
                            data: demMasterPlanGant,
                            links: demMasterPlanLinks
                        };
                        this.gantt.clearAll();
                        this.gantt.parse(ganttTasks);
                    }
                    loading.close();
                }).catch(e => {
                    loading.close();
                });
            });
        },
        // 设置节点
        setData(arr) {
            for (const item of arr) {
                item.nodeId = item.id;
                delete item.id;
                item.id = item.cid;
                item.start_date = `${item.startDate.split(' ')[0]} ${this.workTime.morningStartDate || '08:30'}`;
                item.end_date = `${item.endDate.split(' ')[0]} ${this.workTime.morningEndDate || '17:30'}`;
                item.open = item.open !== 0;
            }
            return arr;
        },
        // 自动调整比例
        showScaleDesc() {
            const min = this.gantt.getState && this.gantt.getState().min_date;
            const max = this.gantt.getState && this.gantt.getState().max_date;
            const toStr = this.gantt.templates.task_date;
            // return this.gantt.message(`Scale shows days from ${toStr(min)} to ${toStr(max)}`);
        },
        // 创建跟节点任务
        ganttCreateTask() {
            const json = this.gantt.serialize();
            if (json.data.length) {
                this.$message.error(this.$t('dialog.ganttOneNodeTips'));
                return;
            }
            this.ganttType = 'add';
            const taskInfo = this.$clone(this.taskTempInfo);
            taskInfo.open = true;
            taskInfo.type = 'project';
            if (this.planStartDate) {
                taskInfo.start_date = this.planStartDate;
            }
            this.taskInfo = taskInfo;
            this.ganttDetailFlag = true;
            // this.gantt.hideLightbox();
        },
        // 编辑任务
        ganttEditTask(id) {
            const task = this.gantt.getTask(id); // 获取任务详情
            // console.log(task, 'task');
            this.ganttType = 'edit';
            const allTasks = this.gantt.serialize();
            // const taskInfo = this.gantt.getTask(id); // 获取任务详情
            const taskInfo = allTasks.data.find(v => v.cid === id); // 获取任务详情
            this.taskInfo = taskInfo;
            // console.log(this.taskInfo, 'this.taskInfo');
            // this.gantt.updateTask(id, this.taskInfo);
            this.ganttDetailFlag = true;
            // gantt.updateTask(2,task);
        },
        // 创建子任务
        ganttAddTask(id) {
            const children = this.gantt.getChildren(id);
            this.createChildrenLength = children.length;
            // console.log(children, 'children');
            this.ganttType = 'add';
            const allTasks = this.gantt.serialize();
            const taskParent = allTasks.data.find(v => v.cid === id); // 获取任务详情
            const taskInfo = this.$clone(this.taskTempInfo);
            taskInfo.open = true;
            taskInfo.type = '';
            taskInfo.parent = id;
            taskInfo.start_date = taskParent.end_date;
            // taskInfo.end_date = this.getAtuoDuration(taskInfo);
            taskInfo.end_date = '';
            this.taskInfo = taskInfo;
            this.ganttDetailFlag = true;
            // console.log(id, 'ganttAddTask');
            console.log(taskInfo, 'taskInfo');
        },
        // 自动计算完成日期
        getAtuoDuration(taskInfo) {
            const startDate = taskInfo.start_date;
            const duration = taskInfo.duration || 1;
            let endDate = '';
            if (startDate) {
                const startDateTime = new Date(startDate).getTime();
                const endDateTime = startDateTime + duration * 60 * 60 * 24 * 1000;
                endDate = this.$utils.commonUtil.formatTime(endDateTime);
            }
            return endDate;
        },
        // 删除任务
        ganttDeleteTask(id) {
            const task = this.gantt.getTask(id); // 获取任务详情
            const parentNode = this.gantt.getTask(task.parent); // 获取父节点
            this.$confirm(`${this.$t('button.delete')} ${task.text}?`, this.$t('button.delete'), {
                confirmButtonText: this.$t('button.determine'),
                cancelButtonText: this.$t('button.close'),
                type: 'warning'
            }).then(() => {
                this.gantt.deleteTask(id);
                this.$nextTick(() => {
                    if (parentNode) {
                        const hasChild = this.gantt.hasChild(parentNode.cid);
                        if (!hasChild) {
                        parentNode.type = '';
                        this.gantt.updateTask(parentNode.cid);
                        }
                    }
                });
            })
            .catch(() => {});
        },
        // 保存单个根特图
        getGanttSet(val) {
            // const val = this.$clone(results);
            // console.log(val, 'val');
            // 参数  对象 父id 插入位置
            if (this.ganttType === 'add') {
                const duration = this.gantt.calculateDuration(new Date(val.startDate), new Date(val.endDate));
                console.log(duration, 'duration');
                // val.duration = duration;
                val.start_date = new Date(val.startDate);
                val.end_date = new Date(val.endDate);
                // val.start_date = new Date(val.startDate);
                // val.end_date = new Date(val.endDate);
                // console.log(val.start_date, 'val.start_date');
                this.gantt.addTask(val, val.parent, this.createChildrenLength);
                // // this.gantt.createTask(val, val.parent, this.createChildrenLength);
                // const parentNode = this.gantt.getTask(val.parent);
                // if (parentNode) {
                //     console.log(parentNode, 'parentNode');
                //     parentNode.type = 'project';
                //     parentNode.open = true;
                //     this.gantt.updateTask(val.parent);
                // }
                // this.gantt.render();
            } else {
                const results = this.$clone(val);
                // // const duration = this.gantt.calculateDuration(results);
                // console.log(new Date('2022-03-01 08:30:00'), 1111);
                // console.log(new Date('2022-03-02 18:00:00'), 2222);
                const duration = this.gantt.calculateDuration(new Date(results.startDate), new Date(results.endDate));
                // // const duration = this.gantt.calculateDuration(new Date('2022,03,01'), new Date('2022,03,04'));
                console.log(duration, 'duration');
                // val.start_date = new Date(val.startDate);
                // val.end_date = new Date(val.endDate);
                // this.updateTask(val);
                // this.gantt.updateTask(val.cid, val);
                this.updateNewTask(val);
            }
            // this.setLink(val);
            this.gantt.hideLightbox();
            this.ganttDetailFlag = false;
        },
        updateNewTask(val) {
            const task = this.gantt.getTask(val.cid);
            task.start_date = new Date(val.startDate);
            task.end_date = new Date(val.endDate);
            task.text = val.text;
            task.dutyUserName = val.dutyUserName;
            task.dutyUserId = val.dutyUserId;
            task.realStartDate = val.realStartDate;
            task.realEndDate = val.realEndDate;
            task.createByTaskName = val.createByTaskName;
            task.createTaskTime = val.createTaskTime;
            task.updateByName = val.updateByName;
            task.updateTime = val.updateTime;
            task.limitTypeCode = val.limitTypeCode;
            task.limitTypeName = val.limitTypeName;
            task.limitDate = val.limitDate;
            task.type = val.type;
            task.ifCruxTask = val.ifCruxTask;
            console.log(task, 'task');
            this.gantt.updateTask(val.cid);
        },
        // 更新节点
        updateTask(val) {
            const task = this.gantt.getTask(val.cid);
            // const duration = this.gantt.calculateDuration(task);
            // console.log(duration, 'duration');
            task.text = val.text;
            task.dutyUserName = val.dutyUserName;
            task.dutyUserId = val.dutyUserId;
            // task.durations = [24];
            // task.duration = 24;
            task.hours = val.hours;
            // task.start_date = val.start_date;
            // task.end_date = val.end_date;
            // task.start_date = new Date(val.startDate);
            // task.end_date = new Date(val.endDates);
            task.realStartDate = val.realStartDate;
            task.realEndDate = val.realEndDate;
            task.createByTaskName = val.createByTaskName;
            task.createTaskTime = val.createTaskTime;
            task.updateByName = val.updateByName;
            task.updateTime = val.updateTime;
            task.limitTypeCode = val.limitTypeCode;
            task.limitTypeName = val.limitTypeName;
            task.limitDate = val.limitDate;
            task.type = val.type;
            task.ifCruxTask = val.ifCruxTask;
            console.log(task, 'task');
            this.gantt.updateTask(val.cid);
        },
        // 处理连线
        setLink(val) {
            const links = this.gantt.serialize().links;
            const currentTargetLinks = links.filter(v => v.target === val.cid);
            for (const item of currentTargetLinks) {
                this.gantt.deleteLink(item.id);
            }
            const linkData = {
                [this.routerInfo.paramsLink]: val.cid,
                [this.routerInfo.paramsLinkMainId]: this.id
            };
            this.$store.dispatch(this.routerInfo.linkUrl, linkData).then(res => {
                const createLinks = res.results;
                for (const item of createLinks) {
                    this.gantt.addLink({
                        id: item.id,
                        source: item.source,
                        target: item.target,
                        type: item.type
                    });
                }
            });
        },
        // 保存所有甘特图
        ganttSaveTask() {
            const json = this.gantt.serialize();
            console.log(json, 'json');
            const demMasterPlanGants = this.$clone(json.data);
            const demMasterPlanLinks = this.$clone(json.links);
            const parentList = demMasterPlanGants.filter(v => Number(v.parent) === 0);
            if (parentList.length === 0) {
                this.$message.error(this.$t('dialog.noGanttData'));
                return;
            }
            if (parentList.length > 1) {
                this.$message.error(this.$t('dialog.moreProjectGanttData'));
                return;
            }
            for (const i in demMasterPlanGants) {
                const item = demMasterPlanGants[i];
                item.startDate = `${item.start_date}:00`;
                item.endDate = `${item.end_date}:00`;
                item.open = item.open ? 1 : 0;
                // 是否是子节点
                item.leaf = this.gantt.hasChild(item.cid) ? 0 : 1;
                item.type = this.gantt.hasChild(item.cid) ? 'project' : item.type;
                item.id = item.nodeId;
                item.createTime = this.$utils.commonUtil.formatTime(new Date());
                item.sort = Number(i);
            }
            for (const item of demMasterPlanLinks) {
                item.masterPlanId = this.id;
                item.projectId = this.projectId;
                item.id = item.tenantId ? item.id : '';
            }
            const data = {
                demMasterPlanGants,
                demMasterPlanLinks,
                id: this.id,
                projectId: this.projectId
            };
            console.log(data, 'data');
            const menuName = `menu.${this.routerInfo.name}`;
            this.$confirm(`${this.$t('button.save')} ${this.$t(menuName)} ${this.$t('menu.ganttPage')}?`, this.$t('button.delete'), {
                confirmButtonText: this.$t('button.determine'),
                cancelButtonText: this.$t('button.close'),
                type: 'warning'
            }).then(() => {
                this.$store.dispatch(this.routerInfo.batchUrl, data).then(res => {
                    console.log(res, 'res');
                    this.$message.success(`${this.$t('button.save')} ${this.$t('tips.success')}!`);
                    this.setRoute();
                });
            })
            .catch(() => {});
        },
        // 切换进度线
        ganttToggleOverlay() {
            const overlayControl = this.gantt.ext.overlay;
            // if (overlayControl.isOverlayVisible(lineOverlay)){
            //     gantt.config.readonly = false;
            //     overlayControl.hideOverlay(lineOverlay);
            //     gantt.$root.classList.remove("overlay_visible");
            // } else{
            //     gantt.config.readonly = true;
            //     overlayControl.showOverlay(lineOverlay);
            //     gantt.$root.classList.add("overlay_visible");
            // }
        },
        // 关键路径
        ganttCriticalPath() {
            this.enabled = !this.enabled;
            if (this.enabled) {
                this.gantt.config.highlight_critical_path = true;
            } else {
                this.gantt.config.highlight_critical_path = false;
            }
            this.gantt.render();
        },
        // 切换期间
        ganttSetSacle(sacle, isSelect = true) {
            const that = this;
            if (sacle === 'year') {
                this.gantt.config.scale_height = 90;
                const monthScaleTemplate = (date) => {
                    const dateToStr = this.gantt.date.date_to_str('%M');
                    const endDate = this.gantt.date.add(date, 2, 'month');
                    return `${dateToStr(date)} - ${dateToStr(endDate)}`;
                };
                this.gantt.config.scales = [
                    {unit: 'year', step: 1, format: '%Y年'},
                    {unit: 'month', step: 3, format: monthScaleTemplate},
                    {unit: 'month', step: 1, format: '%M'}
                ];
                isSelect && this.gantt.render();
                return;
            }
            if (sacle === 'quarter') {
                this.gantt.config.min_column_width = 90;
                this.gantt.config.scale_height = 50;
                this.gantt.config.scales = [
                    {unit: 'month', step: 1, format: '%M'},
					{
						unit: 'quarter', step: 1, format: (date) => {
							const dateToStr = this.gantt.date.date_to_str('%M');
                            const endDate = this.gantt.date.add(this.gantt.date.add(date, 3, 'month'), -1, 'day');
                            const yearNum = this.gantt.date.date_to_str('%Y年')(date);
							return `${yearNum}, ${dateToStr(date)} - ${dateToStr(endDate)}`;
						}
					}
                ];
                isSelect && this.gantt.render();
                return;
            }
            if (sacle === 'month') {
                this.gantt.config.min_column_width = 120;
                this.gantt.config.scale_height = 50;
                this.gantt.config.scales = [
                    {unit: 'month', format: '%Y-%F'},
                    {unit: 'week', format: '%W周'}
                    // {unit: 'day', format: '星期%D%j'}
                ];
                isSelect && this.gantt.render();
                return;
            }
            if (sacle === 'week') {
                this.gantt.config.min_column_width = 80;
                this.gantt.config.scale_height = 50;
                const weekScaleTemplate = function (date) {
                    const dateToStr = that.gantt.date.date_to_str('%d %M');
                    const endDate = that.gantt.date.add(that.gantt.date.add(date, 1, 'week'), -1, 'day');
                    return `${dateToStr(date)} - ${dateToStr(endDate)}`;
                };
                this.gantt.config.scales = [
                    {unit: 'week', step: 1, format: weekScaleTemplate},
                    {unit: 'day', step: 1, format: '%M-%d'},
                    // {unit: 'week', step: 1, format: (date) => {
					// 	const dateToStr = this.gantt.date.date_to_str('%M-%d');
					// 	const endDate = this.gantt.date.add(date, -6, 'day');
					// 	const weekNum = this.gantt.date.date_to_str('%W周')(date);
                    //     return `${weekNum}, ${dateToStr(endDate)} - ${dateToStr(date)}`;
                    // }},
                    {unit: 'day', step: 1, format: '星期%D%j'}
                ];
                isSelect && this.gantt.render();
                return;
            }
            if (sacle === 'day') {
                this.gantt.config.min_column_width = 80;
                this.gantt.config.scale_height = 27;
                this.gantt.config.scales = [
                    {unit: 'day', step: 1, format: '%M-%d'}
                ];
                isSelect && this.gantt.render();
            }
        },
        // 导出
        ganttExport() {
            this.ganttExportFlag = true;
        },
        // 导出PrimaveraP6
        ganttExportToPrimaveraP6() {
            this.gantt.exportToPrimaveraP6({skip_circular_links: false});
        },
        // 导出MSProjec
        ganttExportToMSProject() {
            this.gantt.exportToMSProject({skip_circular_links: false});
        },
        // 导出Excel
        ganttExportToExcel() {
            this.gantt.exportToExcel();
        },
        // 导出MSProjec
        ganttExportToICal() {
            this.gantt.exportToICal();
        },
        // 导出PDF
        ganttExportGantt(mode) {
            if (mode === 'png') {
                this.gantt.exportToPNG({
                    header: '<link rel="stylesheet" href="//docs.dhtmlx.com/gantt/samples/common/customstyles.css?v=7.0.11">'
                });
            } else if (mode === 'pdf') {
                this.gantt.exportToPDF({
                    header: '<link rel="stylesheet" href="//docs.dhtmlx.com/gantt/samples/common/customstyles.css?v=7.0.11">'
                });
            }
        },
        // 导入
        ganttImport() {
            const json = this.gantt.serialize();
            console.log(json, 'json');
            const demMasterPlanGants = this.$clone(json.data);
            if (demMasterPlanGants.length) {
                this.$message.error(this.$t('dialog.ganttImportTips'));
                return;
            }
            this.ganttImportFlag = true;
        },
        // MSProject 导入确定
        handleMSProjectImport() {
            const fileInput = document.getElementById('mspFile');
            console.log(fileInput.files, 'fileInput');
            if (fileInput.files.length === 0) {
                this.$message.error(this.$t('tips.ganttFileTips'));
                return;
            }
            const file = fileInput.files[0];
            this.importLoading = this.getLoading();
            // eslint-disable-next-line no-undef
            // const fileDnD = fileDragAndDrop();
            // fileDnD.init(this.gantt.$container);
            // fileDnD.showUpload();
            const that = this;
            that.ganttImportFlag = false;
            this.gantt.importFromMSProject({
                data: file,
                callback (project) {
                    console.log(project, 'initProject');
                    if (project) {
                        project.data.data = that.filterArray(project.data.data, '0');
                        that.setMsProjectData(project.data.data, '0');
                        that.tempImprotData = [];
                        that.resetMsProjectData(project.data.data, project.data.links);
                        console.log(that.tempImprotData, 'tempImprotData');
                        console.log(project, 'project');
                        const importData = {
                            data: that.$clone(that.tempImprotData),
                            links: project.data.links
                        };
                        that.gantt.clearAll();
                        if (project.config.duration_unit) {
                            that.gantt.config.duration_unit = project.config.duration_unit;
                        }
                        that.gantt.parse(importData);
                    }
                    that.importLoading.close();
                    // fileDnD.hideOverlay();
                    that.ganttImportFlag = false;
                }
            });
        },
        filterArray(data, parent) {
            const tree = [];
            let temp;
            for (let i = 0; i < data.length; i++) {
                if (data[i].parent === parent) {
                    const obj = data[i];
                    temp = this.filterArray(data, data[i].id);
                    if (temp.length > 0) {
                        obj.children = temp;
                    }
                    tree.push(obj);
                }
            }
            // console.log(tree, 'tree');
            return tree;
        },
        setMsProjectData(data, parent) {
            // console.log(parent);
            for (const item of data) {
                item.projectId = this.projectId;
                item.parent = parent;
                item.start_date = [item.start_date.split(' ')[0], this.workTime.morningStartDate || '08:30'].join(' ');
                item.end_date = [item.end_date.split(' ')[0], this.workTime.morningEndDate || '17:30'].join(' ');
                item.dutyUserId = '';
                item.dutyUserName = '';
                item.leaf = item.children && item.children.length ? 0 : 1;
                item.hours = 8;
                item.realEndDate = '';
                item.realStartDate = '';
                item.type = item.children && item.children.length ? 'project' : '';
                item.nodeId = null;
                item.limitTypeName = '';
                item.limitTypeCode = '';
                item.limitDate = '';
                item.ifMilepostNode = '';
                item.ifCruxTask = '';
                item.masterPlanId = this.id;
                item.tempId = item.id;
                item.id = this.uuid();
                item.cid = item.id;
                if (item.children && item.children.length) {
                    this.setMsProjectData(item.children, item.id);
                }
            }
        },
        resetMsProjectData(arr, links) {
            for (const item of arr) {
                const v = this.$clone(item);
                const sourceIndex = links.findIndex(v => v.source === item.tempId);
                if (sourceIndex > -1) {
                    links[sourceIndex].source = item.id;
                }
                const targetIndex = links.findIndex(v => v.target === item.tempId);
                if (targetIndex > -1) {
                    links[targetIndex].target = item.id;
                }
                delete v.children;
                this.tempImprotData.push(v);
                if (item.children && item.children.length) {
                    this.resetMsProjectData(item.children, links);
                }
            }
        },
        // 导入EXcel
        handleExcelImport() {
            const fileInput = document.getElementById('excelFile');
            console.log(fileInput.files, 'fileInput');
            if (fileInput.files.length === 0) {
                this.$message.error(this.$t('tips.ganttFileTips'));
                return;
            }
            const file = fileInput.files[0];
            this.importLoading = this.getLoading();
            const that = this;
            that.ganttImportFlag = false;
            this.gantt.importFromExcel({
                server: 'https://export.dhtmlx.com/gantt',
                data: file,
                callback (project) {
                    if (project) {
                        console.log(project, 'project');
                        that.gantt.clearAll();
                        const ganttDataset = {
                            data: project,
                            links: []
                        };
                        that.gantt.parse(ganttDataset);
                    }
                    that.importLoading.close();
                    that.ganttImportFlag = false;
                }
            });
        },
        // 获取甘特图实列
        getGanttTem() {
            return this.gantt;
        },
        // 生成uuid
        uuid() {
            const s = [];
            const hexDigits = '0123456789abcdef';
            for (let i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = '-';
            s[13] = '-';
            s[18] = '-';
            s[23] = '-';
            const uuid = s.join('');
            return uuid;
        }
    },
    beforeDestroy() {
        window.removeEventListener('click', this.ganttHanlder);
        // this.gantt.destructor();
        this.gantt.clearAll();
        // this.gantt = null;
    }
};
</script>

<style lang="scss" scoped>
.ganttWrap {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
    .ganttButton {
        margin-bottom: 10px;
    }
}
.gantt_task_cell.week_end {
    background-color: #EFF5FD;
}

.gantt_selected .gantt_task_cell.week_end {
    background-color: #f0e493;
}
.ganttImportWrap {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    overflow: hidden;
    h3 {
        margin-bottom: 5px;
        a {
            float: right;
        }
    }
    .ganttImportItem {
        margin-bottom: 10px;
        height: 34px;
        line-height: 34px;
        padding-bottom: 5px;
        border-bottom: 1px solid #ede;
    }
}
</style>
