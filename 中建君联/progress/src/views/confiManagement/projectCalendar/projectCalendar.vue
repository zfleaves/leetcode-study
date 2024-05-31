<!--
 * @Author: your name
 * @Date: 2021-01-25 16:03:04
 * @LastEditTime: 2022-03-03 17:54:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\confiManagement\projectCalendar\projectCalendar.vue
-->
<template>
    <div class="projectCons">
        <div class="left cons">
            <div class="content">
                <div class="fixed-scroll">
                    <projectDetail @projectId='getProjectId'>
                    </projectDetail>
                </div>
            </div>
        </div>
        <div class="right cons" ref="cons">
            <div class="content">
                <div class="fixed-scroll">
                    <div class="title">
                        {{$t('projectCalendar.myProjectCalendar')}}
                        <el-button size="small" type="primary" icon="el-icon-circle-check"
                            v-if="authButtonList.indexOf('save') >= 0"
                            @click="handleSave" v-fast-click style="float:right;">
                            {{$t('button.save')}}
                        </el-button>
                    </div>
                    <div class="calendar-set editTable">
                         <el-tabs v-model="activeName">
                            <el-tab-pane :label="$t('projectCalendar.calendarWork')" name="first" class="detailedTable">
                                <el-table :data="basicCalendarWorkEditDtos">
                                    <template slot="empty">
                                        <no-data>
                                        </no-data>
                                    </template>
                                    <el-table-column align="center" width="100" :label="$t('projectCalendar.ifFlag')">
                                         <template slot-scope="scope">
                                              <el-select v-model="scope.row.ifFlag" size="small">
                                                <el-option :label="$t('tips.yes')" :value="1">
                                                </el-option>
                                                <el-option :label="$t('tips.no')" :value="0">
                                                </el-option>
                                            </el-select>
                                         </template>
                                    </el-table-column>
                                    <el-table-column width="100" prop="calendarValue" :label="$t('projectCalendar.calendarValue')">
                                    </el-table-column>
                                    <el-table-column :label="$t('fConfig.remarks')">
                                        <template  slot-scope="scope">
                                            <el-input
                                                v-model.trim="scope.row.remarks"  size="small"
                                                maxlength="255" clearable>
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane :label="$t('projectCalendar.excludeCalendarWork')" name="second">
                                <div class="title">
                                    <el-button size="small" type="primary" icon="el-icon-plus"
                                        v-if="authButtonList.indexOf('add') >= 0"
                                        class="handleButton"
                                        @click="handleAdd" v-fast-click>
                                        {{$t('button.add')}}
                                    </el-button>
                                </div>
                                <g-query-table
                                    :config="mainTable"
                                    @fnName="pageConfigEmitQueryTableButtonFnName"
                                    :tableList.sync="tableSeleList">
                                    <template slot="table-ifFlag" slot-scope="{row}">
                                        <span>{{row.ifFlag === 1 ? $t('tips.yes') : $t('tips.no')}}</span>
                                    </template>
                                </g-query-table>
                            </el-tab-pane>
                            <!-- 工作时间 -->
                            <el-tab-pane :label="$t('projectCalendar.excludeWorkTime')" name="third">
                                <div class="excludeWorkTime">
                                    <div class="excludeWorkTime-item">
                                        <!-- 上午工作时间 -->
                                        <div class="workTime-label">{{$t('projectCalendar.workTimeMorning')}}</div>
                                        <div class="workTime-cons">
                                            <el-time-select
                                                @change="handleSetThree"
                                                size="small" :clearable="false"
                                                v-model="workTime.morningStartDate"
                                                :picker-options="{start: '08:30', step: '00:15', end: '18:30', maxTime: workTime.morningEndDate}">
                                            </el-time-select>
                                            <el-time-select
                                                @change="handleSetTwo"
                                                size="small" :clearable="false"
                                                v-model="workTime.morningEndDate"
                                                :picker-options="{ start: '08:30', step: '00:15', end: '23:30',
                                                    minTime: workTime.morningStartDate }">
                                            </el-time-select>
                                        </div>
                                    </div>
                                    <div class="excludeWorkTime-item">
                                        <!-- 下午工作时间 -->
                                        <div class="workTime-label">{{$t('projectCalendar.workTimeAfternoon')}}</div>
                                        <div class="workTime-cons">
                                            <el-time-select
                                                @change="handleSetOne"
                                                size="small" :clearable="false"
                                                v-model="workTime.afternoonStartDate"
                                                :picker-options="{start: '08:30', step: '00:15', end: '18:30', minTime: workTime.morningEndDate}">
                                            </el-time-select>
                                            <el-time-select
                                                size="small" :clearable="false"
                                                v-model="workTime.afternoonEndDate"
                                                @change="handleSetHours"
                                                :picker-options="{ start: '08:30', step: '00:15', end: '23:30',
                                                    minTime: workTime.afternoonStartDate }">
                                            </el-time-select>
                                        </div>
                                    </div>
                                    <div class="excludeWorkTime-item">
                                        <!-- 每日工作时间 -->
                                        <div class="workTime-label">{{$t('projectCalendar.workTimeDay')}}</div>
                                        <div class="workTime-cons">
                                            <el-number v-model="workTime.workHours"
                                                size="small"  :clearable="false"
                                                disabled
                                                :precision="1" :min="0" :max="24" show-word-limit>
                                            </el-number>
                                        </div>
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </div>

    <g-drawer :title="type === 'add' ? $t('button.add') : $t('button.edit')"
      v-if="pageConfigLoading" :display.sync="pageConfigLoading" :inner="true" width="40%">
      <div slot="body">
            <g-edit-form
                ref="editForm"
                v-if="pageConfigLoading"
                :type="type"
                :tableConfig="pageConfig.mainFormConfig"
                :projectForm="pageConfig.projectForm">
            </g-edit-form>
      </div>
      <div slot="but">
        <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small" @click="userDrawerClose">
          {{$t('button.close')}}
        </el-button>
        <el-button size="small" type="primary" icon="el-icon-circle-check"
                   @click="userDrawerSave" v-fast-click>
          {{$t('button.save')}}
        </el-button>
      </div>
    </g-drawer>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {search} from 'mixins/searchMixins';
import perUtil from '@/util/index';

export default {
    name: 'projectCalendar',
    mixins: [search],
    components: {
        projectDetail(resolve) {
            require(['../components/projectDetail/projectDetail'], resolve);
        }
    },
    data() {
        return {
            authButtonList: [],
            // 主表渲染参数
            mainTable: {
                // 表格数据
                tableData: [],
                // 表格高度
                maxHeight: 500,
                pageSize: 10,
                pagerCount: 5,
                // 页码
                total: 0,
                // 是否显示分页
                paging: true,
                // 表头操作行配置
                tableHeader: {
                showColumnCtrl: true, // 显示/隐藏列
                refresh: false // 刷新
                },
                // 是否默认选中第一行
                defaultSeleFirstLine: false,
                // 子系统表头渲染参数
                tableList: [
                    // 名称
                    {show: true, prop: 'ifFlag', label: 'projectCalendar.ifFlag', formType: 'slot'},
                    // 负责人
                    {show: true, prop: 'excludeName', label: 'projectCalendar.excludeName', minWidth: 100},
                    // 开始日期
                    {show: true, prop: 'startDate', label: 'projectCalendar.startDate', minWidth: 110, filterName: 'date'},
                    // 开始日期
                    {show: true, prop: 'endDate', label: 'projectCalendar.endDate', minWidth: 110, filterName: 'date'},
                    // 备注
                    {show: true, prop: 'remarks', label: 'fConfig.remarks'},
                    // 操作
                    {show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '100',
                        buts: [
                            {name: 'button.edit', class: 'success', fn: 'handleEdit', authCode: 'edit', isCreateBy: true, enable: true},
                            {name: 'button.delete', class: 'danger', fn: 'handleDelete', authCode: 'delete', isCreateBy: true, enable: true}
                        ]
                    }
                ]
            },
            tableSeleList: [],
            // 搜索数据
            searchForm: {
                projectId: '',
                unitName: ''
            },
            pageSize: 10,
            pageNo: 1,
            currentId: '',
            pageConfigLoading: false,
            projectForm: {
                'endDate': '',
                'excludeName': '',
                'ifFlag': 0,
                'projectId': 0,
                'remarks': '',
                'sort': 0,
                'startDate': '',
                'workHours': 8,
                time: []
            },
            pageEdit: new Page(),
            pageConfig: '',
            type: '',
            activeName: 'first',
            calendarWorkEditDtos: [
                { ifFlag: 0, calendarValue: '星期日', calendarCode: 0, workHours: 8, remarks: ''},
                { ifFlag: 1, calendarValue: '星期一', calendarCode: 1, workHours: 8, remarks: ''},
                { ifFlag: 1, calendarValue: '星期二', calendarCode: 2, workHours: 8, remarks: ''},
                { ifFlag: 1, calendarValue: '星期三', calendarCode: 3, workHours: 8, remarks: ''},
                { ifFlag: 1, calendarValue: '星期四', calendarCode: 4, workHours: 8, remarks: ''},
                { ifFlag: 1, calendarValue: '星期五', calendarCode: 5, workHours: 8, remarks: ''},
                { ifFlag: 0, calendarValue: '星期六', calendarCode: 6, workHours: 8, remarks: ''}
            ],
            basicCalendarWorkEditDtos: [],
            basicExcludeCalendarWorkEditDtos: [],
            tableIndex: 0,
            workTime: {
                afternoonEndDate: '17:30',
                afternoonStartDate: '13:00',
                morningEndDate: '12:00',
                morningStartDate: '08:30',
                projectId: '',
                remarks: '',
                tenantId: this.$utils.Auth.hasUserInfo().tenantId,
                workHours: 8
            }
        };
    },
    created () {
        this.pageConfig = this.pageEdit.PageConfig;
        this.authButtonList = this.$route.meta.authButtonList && this.$route.meta.authButtonList.map(v => v.resUrl);
        const time = perUtil.getDiffDate('2021-01-26 00:00:00', '2021-01-28 00:00:00');
        console.log(time, 'tiem');
    },
    mounted () {
        this.$nextTick(() => {
            const consHeight = this.$refs.cons ? this.$refs.cons.offsetHeight : 522;
            const buttonListHeight = 46; // 按钮高度
            const pageHeight = 46; // 分页高度
            const tableHeight = consHeight - buttonListHeight - pageHeight - 76; // 20 位 padding 高度
            // const pageSize = Math.floor(tableHeight / 39);
            this.mainTable.maxHeight = tableHeight;
          // this.pageSize = pageSize - 1;
        });
    },
    methods: {
        // 获取项目Id
        getProjectId(val) {
            this.searchForm.projectId = val;
            this.projectForm.projectId = val;
            this.activeName = 'first';
            this._getTableDataList();
        },
        // 获取表单
        _getTableDataList () {
            if (!this.searchForm.projectId) return;
            this._getWorkList();
            this._getExcludecalendarList();
            this._getWorkTimeInfo();
        },
        // 获取工资周
        _getWorkList() {
            this.$store.dispatch('projectCalendar/getWorkList', {projectId: this.searchForm.projectId}).then(res => {
                if (res.status === 0) {
                    if (res.results && res.results.length) {
                        this.basicCalendarWorkEditDtos = res.results;
                    } else {
                        this.basicCalendarWorkEditDtos = this.$clone(this.calendarWorkEditDtos);
                    }
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
        },
        // 获取个人定制日期
        _getExcludecalendarList() {
            this.$store.dispatch('projectCalendar/getExcludecalendarList', {projectId: this.searchForm.projectId}).then(res => {
                if (res.status === 0) {
                    if (res.results && res.results.length) {
                        for (const item of res.results) {
                            item.time = [item.startDate, item.endDate];
                        }
                    }
                    this.mainTable.tableData = res.results || [];
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
        },
        // 获取工作时间
        _getWorkTimeInfo() {
            this.$store.dispatch('projectCalendar/getWorktimeInfo', {projectId: this.searchForm.projectId}).then(res => {
                if (res.status === 0) {
                    if (res.results && res.results.workHours) {
                        this.workTime = res.results;
                    } else {
                       this.workTime = {
                            afternoonEndDate: '17:30',
                            afternoonStartDate: '13:00',
                            morningEndDate: '12:00',
                            morningStartDate: '08:30',
                            projectId: this.searchForm.projectId,
                            remarks: '',
                            tenantId: this.$utils.Auth.hasUserInfo().tenantId,
                            workHours: 8
                        };
                    }
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
        },
        handleSetThree() {
            this.workTime.morningEndDate = '';
            this.workTime.afternoonStartDate = '';
            this.workTime.afternoonEndDate = '';
            this.workTime.workHours = '';
        },
        handleSetTwo() {
            this.workTime.afternoonStartDate = '';
            this.workTime.afternoonEndDate = '';
            this.workTime.workHours = '';
        },
        handleSetOne() {
            this.workTime.afternoonEndDate = '';
            this.workTime.workHours = '';
        },
        handleSetHours() {
            const {morningEndDate, morningStartDate, afternoonStartDate, afternoonEndDate} = this.workTime;
            if (morningEndDate && morningStartDate && afternoonStartDate && afternoonEndDate) {
               const morningHour = this.getHour(morningStartDate, morningEndDate);
               const afternoonHour = this.getHour(afternoonStartDate, afternoonEndDate);
               this.workTime.workHours = Number((morningHour + afternoonHour).toFixed(1));
            } else {
                this.workTime.workHours = '';
            }
        },
        //
        getHour(s1, s2) {
            const reDate = /\d{4}-\d{1,2}-\d{1,2} /;
            s1 = new Date((reDate.test(s1) ? s1 : `2017-1-1 ${s1}:00`).replace(/-/g, '/'));
            s2 = new Date((reDate.test(s2) ? s2 : `2017-1-1 ${s2}:00`).replace(/-/g, '/'));
            const ms = s2.getTime() - s1.getTime();
            if (ms < 0) return 0;
            return Number(((ms / 1000 / 60 / 60)).toFixed(1));
        },
        // 保存日历设置
        handleSave() {
            if (!this.workTime.workHours) {
                this.$message.error(`${this.$t('tips.pleaseSelect')}${this.$t('projectCalendar.workTimeDay')}`);
                return;
            }
            const tableData = this.$clone(this.mainTable.tableData);
            let yesList = []; // 工作日
            let noList = []; // 非工作日
            for (const item of tableData) {
                if (item.time.length) {
                    item.startDate = item.time[0];
                    item.endDate = item.time[1];
                }
                item.diffDate = perUtil.getDiffDate(item.startDate, item.endDate);
                for (const child of item.diffDate) {
                    if (item.ifFlag) {
                        yesList.push(child);
                    }
                    if (!item.ifFlag) {
                        noList.push(child);
                    }
                }
            }
            yesList = [...new Set(yesList)];
            noList = [...new Set(noList)];
            console.log(yesList, 'yesList');
            console.log(noList, 'noList');
            let list = [...yesList, ...noList];
            list = [...new Set(list)];
            console.log(list, 'list');
            if (list.length < yesList.length + noList.length) {
                this.$message.error(this.$t('projectCalendar.saveExcludecalendarTips'));
                return;
            }
            const data = {
                basicCalendarWorkEditDtos: this.basicCalendarWorkEditDtos,
                basicExcludeCalendarWorkEditDtos: tableData,
                projectId: this.projectForm.projectId
            };
            this.$store.dispatch('projectCalendar/saveWork', data).then(res => {
                if (res.status === 0) {
                    // this.$message.success(`${this.$t('button.save')} ${this.$t('tips.success')}!`);
                    this._getWorkList();
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
            this.$store.dispatch('projectCalendar/saveExcludecalendar', data).then(res => {
                if (res.status === 0) {
                    this.$message.success(`${this.$t('button.save')} ${this.$t('tips.success')}!`);
                    this._getExcludecalendarList();
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
            const workData = {
                afternoonEndDate: this.workTime.afternoonEndDate || '17:30',
                afternoonStartDate: this.workTime.afternoonStartDate || '13:00',
                morningEndDate: this.workTime.morningEndDate || '12:00',
                morningStartDate: this.workTime.morningStartDate || '08:30',
                remarks: '',
                workHours: this.workTime.workHours || 8,
                projectId: this.projectForm.projectId,
                tenantId: this.workTime.tenantId
            };
            this.$store.dispatch('projectCalendar/saveWorktime', workData).then(res => {
                if (res.status === 0) {
                    // this.$message.success(`${this.$t('button.save')} ${this.$t('tips.success')}!`);
                    this._getExcludecalendarList();
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
        },
        // 添加
        handleAdd() {
            this.type = 'add';
            this.pageConfig.projectForm = this.projectForm; // 挂载form 对象
            this.pageConfigLoading = true;
        },
        // 修改
        handleEdit(row) {
            this.tableIndex = this.mainTable.tableData.indexOf(row);
            this.type = 'edit';
            const tableRow = this.$clone(row);
            if (tableRow.startDate && tableRow.endDate) {
                tableRow.time = [tableRow.startDate, tableRow.endDate];
            } else {
                tableRow.time = [];
            }
            this.$set(this.pageConfig, 'projectForm', this.$clone(tableRow));
            // this.pageConfig.projectForm = this.$clone(row);
            this.pageConfigLoading = true;
        },
        // 删除
        handleDelete(row) {
            const statusConfig = {
                keyId: 'id',
                keyName: 'excludeName',
                row,
                api: 'projectCalendar/deleteprojectCalendar'
            };
            this.setDataDelete(statusConfig, row);
        },
        // 删除
        setDataDelete(statusConfig, row) {
            this.$confirm(`${this.$t('button.delete')} ${statusConfig.row[statusConfig.keyName]}?`, this.$t('button.delete'), {
                confirmButtonText: this.$t('button.determine'),
                cancelButtonText: this.$t('button.close'),
                type: 'warning'
            }).then(() => {
                this.mainTable.tableData.splice(this.mainTable.tableData.indexOf(row), 1);
                this.pageConfigLoading = false;
                this.$message.success(`${this.$t('button.delete')} ${this.$t('tips.success')}!`);
            })
            .catch(() => {});
        },
        // 保存
        userDrawerSave() {
            this.$refs.editForm.getValidateForm(() => {
                if (this.pageConfig.projectForm.time.length) {
                    this.pageConfig.projectForm.startDate = this.pageConfig.projectForm.time[0];
                    this.pageConfig.projectForm.endDate = this.pageConfig.projectForm.time[1];
                }
                if (this.type === 'add') {
                    this.mainTable.tableData.push(this.$clone(this.pageConfig.projectForm));
                } else {
                    this.$set(this.mainTable.tableData, this.tableIndex, this.$clone(this.pageConfig.projectForm));
                }
                this.userDrawerClose();
                // this.$message.success(`${status} ${this.$t('tips.success')}!`);
            });
        },
        // 关闭
        userDrawerClose() {
            this.projectForm = {
                projectId: this.searchForm.projectId,
                'endDate': '',
                'excludeName': '',
                'ifFlag': 0,
                'remarks': '',
                'sort': 0,
                'startDate': '',
                'workHours': 8,
                time: []
            };
            this.pageConfigLoading = false;
        }
    }
};
</script>
<style lang="scss" scoped>
.projectCons{
    width: 100%;
    height: 100%;
    display: flex;
    .left {
        flex: 10;
        margin-right: 10px;
    }
    .right {
        flex: 14;
    }
    .cons {
        border: 1px solid #ebeef5;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        color: #303133;
        padding: 10px;
        transition: .3s;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: column;
        flex-direction: column;
        position: relative;
        .content {
            position: relative;
            width: 100%;
            height: 100%;
            .calendar-set {
                height: calc(100% - 46px);
                /deep/ .el-tabs {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    .el-tabs__content {
                        height: calc(100% - 45px);
                    }
                }
            }
        }
        .title {
            height: 36px;
            line-height: 36px;
            margin-bottom: 10px;
            position: relative;
            .handleButton {
                position: absolute;
                right: 0px
            }
        }
    }
    /deep/ .editTable {
        width: 100%;
        min-width: 100%
    }
}
.excludeWorkTime {
    width: 100%;
    overflow: hidden;
   .excludeWorkTime-item {
       margin-bottom: 10px;
       width: 100%;
       height: 45px;
       line-height: 45px;
       .workTime-label {
           width: 120px;
           height: 100%;
           overflow: hidden;
           white-space: nowrap;
           text-overflow: ellipsis;
           margin-right: 10px;
           float: left;
       }
       .workTime-cons {
           height: 100%;
           width: calc(100% - 130px);
           float: left;
           .el-number {
               float: left;
               width: 180px;
           }
           .el-input {
               float: left;
               width: 180px;
               margin-right: 10px;
           }
       }
   }
}
</style>
