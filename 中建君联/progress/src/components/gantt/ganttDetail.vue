<!--
 * @Author: your name
 * @Date: 2021-01-28 11:25:28
 * @LastEditTime: 2022-03-02 16:54:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\components\gantt\ganttDetail.vue
-->
<template>
  <div class="ganttDetail" ref="cons" v-if="flag">
        <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('dialog.baseInfo')" name="first" class="detailedTable">
                <g-edit-form
                    ref="editForm"
                    v-if="pageConfigLoading"
                    :type="type"
                    :tableConfig="pageConfig.mainFormConfig"
                    :projectForm="pageConfig.projectForm"
                    @editFormEvent="editFormEvent">
                </g-edit-form>
            </el-tab-pane>
            <el-tab-pane :label="$t('dialog.ganttLinks')" name="second" class="detailedTable editTable" v-if="ganttType === 'edit'">
                <div class="title">
                    <el-button
                        name="sysHandleAdd"
                        :disabled="type === 'info' || pageConfig.projectForm.type === 'project'"
                        size="small" type='primary' icon="el-icon-plus"
                        v-fast-click style="float:right;margin-bottom: 10px;"
                        @click="sysHandleAdd">
                        {{$t('button.add')}}
                    </el-button>
                </div>
                <el-table :data="links" :height="mainTable.maxHeight"  :max-height="mainTable.maxHeight">
                    <template slot="empty">
                        <no-data>
                        </no-data>
                    </template>
                    <!-- 序号 -->
                    <el-table-column  align="center" type="index"  :label="$t('fConfig.serialNumber')" width="60">
                    </el-table-column>
                    <el-table-column :label="$t('dialog.taskName')" prop="text">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.source" size="small">
                                <el-option v-for="item in taskList" :label="item.text"
                                    :value="item.cid" :key="item.cid">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="160" :label="$t('dialog.linkType')">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.type" size="small">
                                <el-option v-for="item in linkTypeList" :label="item.dataName" :value="item.dataCode" :key="item.dataCode">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('fConfig.operate')" width="100">
                        <template  slot-scope="scope">
                            <el-button class="danger"
                                :disabled="type === 'info' || pageConfig.projectForm.type === 'project'"
                                @click.stop.prevent="setDelete(scope.row)" type="text" size="mini" v-fast-click>
                                {{$t('button.delete')}}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane :label="$t('dialog.senior')" name="third" class="detailedTable">
                <el-form :model="pageConfig.projectForm" label-width="120px" class="demo-ruleForm">
                    <el-row :gutter="24">
                        <el-col :span="12">
                             <el-form-item :label="$t('dialog.limitTypeCode')" prop="limitTypeCode">
                                 <el-select
                                    v-model.trim="pageConfig.projectForm.limitTypeCode"
                                    size="small" clearable filterable
                                    style="width:100%"
                                    @change="handleChangeLimitTypeCode">
                                    <el-option  v-for="(child,i) in limitTypeCodeList" :key="i"
                                        :label="child.dataName"
                                        :value="child.dataCode">
                                    </el-option>
                                </el-select>
                             </el-form-item>
                        </el-col>
                        <el-col :span="12">
                             <el-form-item :label="$t('dialog.limitDate')" prop="limitDate">
                                 <el-date-picker
                                    v-model="pageConfig.projectForm.limitDate"
                                    size="small" type="date"
                                    value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;">
                                </el-date-picker>
                             </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="pageConfig.projectForm.type !== 'project'">
                             <el-form-item :label="$t('dialog.ifMilepostNode')" prop="type">
                                 <el-radio-group
                                    v-model.trim="pageConfig.projectForm.type"  size="small" >
                                    <el-radio label="milestone">{{$t('dialog.Milestone')}}</el-radio>
                                    <el-radio label="task">{{$t('dialog.Task')}}</el-radio>
                                </el-radio-group>>
                             </el-form-item>
                        </el-col>
                        <el-col :span="12">
                             <el-form-item :label="$t('dialog.ifCruxTask')" prop="ifCruxTask">
                                 <el-select
                                    v-model.trim="pageConfig.projectForm.ifCruxTask"
                                    size="small" clearable filterable
                                    style="width:100%">
                                    <el-option  :label="$t('tips.yes')" value="01">
                                    </el-option>
                                    <el-option  :label="$t('tips.no')" value="02">
                                    </el-option>
                                </el-select>
                             </el-form-item>
                        </el-col>
                        <el-col :span="12">
                             <el-form-item :label="$t('dialog.wbs')" prop="wbs">
                                 <el-number
                                    v-model.trim="pageConfig.projectForm.wbs"
                                    size="small" clearable
                                    maxlength="10" :precision="2" show-word-limit>
                                </el-number>
                             </el-form-item>
                        </el-col>
                    </el-row>

                </el-form>
                <!-- <g-edit-form
                    ref="editForm"
                    v-if="pageConfigLoading"
                    :type="type"
                    :tableConfig="pageConfig.seniorConfig"
                    :projectForm="pageConfig.projectForm"
                    @editFormEvent="editFormEvent">
                     <template slot="form-type" slot-scope="{item}">
                        <el-form-item :label="$t(item.label)" :prop="item.prop"  :title="$t(item.label)" v-if="pageConfig.projectForm.type !== 'project'">
                            <el-radio-group
                                v-model.trim="pageConfig.projectForm[item.prop]"
                                :size="item.size || 'small'" :disabled="type === 'info'">
                                <el-radio
                                    v-for="(child,i) in item.selectList" :key="i"
                                    :label="item.isNumber ? Number(child.value) : child.value">
                                    {{item.isTranslate ? $t(child.label) : child.label}}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </template>
                </g-edit-form> -->
            </el-tab-pane>
            <!-- 工程量及资源分解 -->
             <el-tab-pane :label="$t('dialog.gantResource')" name="fouth" class="detailedTable"
                v-if="ganttType === 'edit' && taskInfo.leaf === 1">
                 <div class="title">
                    <el-button
                        name="sysHandleAddResource"
                        :disabled="type === 'info' || pageConfig.projectForm.type === 'project'"
                        size="small" type='primary' icon="el-icon-plus"
                        v-fast-click style="float:right;margin-bottom: 10px;"
                        @click="sysHandleAddResource">
                        {{$t('button.add')}}
                    </el-button>
                </div>
                <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
                    <g-edit-table
                        :ref="subTable.subTableName"
                        :type="ganttType"
                        :height='400'
                        :isSelection="subTable.isSelection"
                        :tableConfig="subTable.tableList"
                        :subTable='subTable'
                        @editTableEvent='editTableEvent'>
                        <!-- 人工费 -->
                        <template slot="edit-table-reportLabour" slot-scope="{item, scope, rowIndex}">
                            <span class="smallFont set" @click="handleSelectResources(item, scope, rowIndex)">
                                {{getItems(scope, '01')}} {{$t('fConfig.term')}}
                            </span>
                        </template>
                        <!-- 材料费 -->
                        <template slot="edit-table-reportMaterial" slot-scope="{item, scope, rowIndex}">
                            <span class="smallFont set" @click="handleSelectResources(item, scope, rowIndex)">
                                {{getItems(scope, '02')}} {{$t('fConfig.term')}}
                            </span>
                        </template>
                        <!-- 机械 -->
                        <template slot="edit-table-reportMachinery" slot-scope="{item, scope, rowIndex}">
                            <span class="smallFont set" @click="handleSelectResources(item, scope, rowIndex)">
                                {{getItems(scope, '03')}} {{$t('fConfig.term')}}
                            </span>
                        </template>
                        <!-- 其它费 -->
                        <template slot="edit-table-other" slot-scope="{item, scope, rowIndex}">
                            <span class="smallFont set" @click="handleSelectResources(item, scope, rowIndex)">
                                {{getItems(scope, '05')}} {{$t('fConfig.term')}}
                            </span>
                        </template>
                    </g-edit-table>
                </div>
             </el-tab-pane>
        </el-tabs>
        <div class="footer" v-if="type === 'edit'">
            <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small"
                @click="handleDialogStatus('close')">{{$t('button.close')}}</el-button>
            <el-button size="small" type="primary" icon="el-icon-circle-check"
                @click="handleDialogStatus('save')" v-fast-click>{{$t('button.determine')}}
            </el-button>
        </div>

        <!-- 选择资源投入 -->
        <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
            <resourceDetail slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="dialogVisible" :type="type"
                :details='details'
                :row="currentRow" :currentResources="currentResources"  @getData="getData" v-if="dialogVisible">
            </resourceDetail>
        </g-dialog>
  </div>
</template>

<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'ganttDetail',
    inject: ['ganttTemplate'],
    components: {
        resourceDetail(resolve) {
          require(['./resourceDetail/resourceDetail.vue'], resolve);
        }
    },
    // mixins: [editPage],
    data() {
        return {
            pageConfig: {},
            page: new Page(),
            id: '',
            type: 'edit',
            routerNameList: [
                { name: 'demMasterPlan', editUrl: 'demMasterPlan/setGanttEdit'},
                { name: 'demMasterPlanAdjust', editUrl: 'demMasterPlanAdjust/setGanttEdit' }
            ],
            activeName: 'first',
            pageConfigLoading: false,
            projectForm: {
                'cid': '',
                'duration': 1,
                'dutyUserId': '',
                'dutyUserName': '',
                'end_date': '',
                'endDate': '',
                'hours': '',
                'nodeId': '',
                'id': '',
                'leaf': 0,
                'masterPlanId': '',
                'open': '',
                'parent': '',
                'progress': 0,
                'projectId': '',
                'realEndDate': '',
                'realStartDate': '',
                'remarks': '',
                'startDate': '',
                'start_date': '',
                'text': '',
                'type': '',
                limitTypeName: '',
                limitTypeCode: '',
                limitDate: '',
                ifMilepostNode: '',
                ifCruxTask: ''
            },
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
                    // 任务
                    {show: true, prop: 'text', label: 'dialog.taskName'},
                    // 账号
                    // {show: true, prop: 'userCode', label: 'buildLogUser.userCode'},
                    // // 岗位
                    // {show: true, prop: 'roleInfo', label: 'buildLogUser.roleInfo'},
                    // 操作
                    {show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '60', align: 'right',
                        buts: [
                            {name: 'button.delete', class: 'danger', fn: 'setDelete', noauth: 'delete', isCreateBy: true, enable: true}
                        ]
                    }
                ]
            },
            tableSeleList: [],
            routerInfo: {},
            linkTypeList: [],
            links: [],
            flag: false,
            taskList: [],
            limitTypeCodeList: [],
            tableRow: {
                projectDetailName: '',
                projectDetailQuantity: '',
                cid: '',
                details: []
            },
            dialogVisible: false,
            dialogConfig: {
                title: this.$t('dialog.selectResources'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '70%',
                span: '0.75'
            },
            currentResources: {},
            currentIndex: 0,
            currentRow: {},
            details: []
        };
    },
    props: {
        taskInfo: {
            default: () => {}
        },
        workTime: {
            default: () => {}
        },
        projectId: {},
        ganttType: {
            type: String,
            default: 'edit'
        }
    },
    created () {
        const params = this.$route.params;
        this.type = this.$base64.decode(params.type);
        this.readonly = this.type === 'info';
        this.id = this.$base64.decode(params.id);
        this.routerName = params.lastRouterName;
        this.setTaskInfo();
        this.pageConfigLoading = true;
        console.log(this.ganttTemplate);
    },
    mounted () {
        this.$nextTick(() => {
            const consHeight = this.$refs.cons ? this.$refs.cons.offsetHeight : 522;
            // console.log(consHeight, 'consHeight');
            const tableHeight = consHeight - 150; // 20 位 padding 高度
            // const pageSize = Math.floor(tableHeight / 39);
            this.mainTable.maxHeight = tableHeight;
        });
    },
    methods: {
        // 获取数据项
        getItems(row, code) {
            return row.details.filter(v => v.resourceTypeCode === code).length;
        },
        sysHandleAddResource() {
            console.log(this.pageConfig.subTableConfig, 'this.pageConfig.subTableConfig');
            this.pageConfig.subTableConfig['detailedTable'].tableData.push(this.$clone(this.tableRow));
        },
        editTableEvent({eventName, params}) {
            console.log(eventName, 'eventName');
            console.log(params, 'params');
            if (eventName === 'fnRowName') { // 表格操作按钮
                const {btnParameter, row, index} = params;
                this.sysHandleDelete(row, index);
            }
        },
        sysHandleDelete(row, index) {
            this.$confirm(`${this.$t('button.delete')}?`, this.$t('button.delete'), {
                confirmButtonText: this.$t('button.determine'),
                cancelButtonText: this.$t('button.close'),
                type: 'warning'
            }).then(() => {
                console.log(index, 'index');
                const tableData = this.pageConfig.subTableConfig['detailedTable'].tableData;
                tableData.splice(index, 1);
            })
            .catch((e) => {
                console.log(e, 'e');
            });
        },
        // 选择资源
        handleSelectResources(item, row, index) {
            this.currentResources = this.$clone(item);
            this.currentIndex = index;
            // this.currentRow = this.$clone(row);
            this.currentRow = row;
            this.details = this.$clone(row.details);
            this.dialogConfig.title = `${this.$t(item.label)} ${this.$t('tips.details')}`;
            this.dialogVisible = true;
        },
        getData({details}) {
            const tableData = this.pageConfig.subTableConfig['detailedTable'].tableData;
            this.$set(tableData[this.currentIndex], 'details', details);
            this.dialogVisible = false;
        },
        // 添加连线
        sysHandleAdd() {
            const obj = {
                id: '',
                source: '',
                target: this.pageConfig.projectForm.cid,
                type: '0' // 完成-开始(FS) 0  完成-完成(FF) 2  开始-完成(SF) 3 开始-开始(SS) 1
            };
            this.links.push(obj);
        },
        setDelete(row) {
            this.links.splice(this.links.indexOf(row), 1);
        },
        // 处理任务信息
        async setTaskInfo() {
            this.routerInfo = this.routerNameList.find(v => v.name === this.routerName);
            // console.log(this.routerInfo, 'routerInfo');
            if (!this.routerInfo) return;
            this.pageConfig = this.page.PageConfig;
            this.projectForm = this.$clone(this.taskInfo);
            this.projectForm.hours = this.workTime.workHours || 8;
            this.projectForm.start_date = this.projectForm.start_date ? [this.projectForm.start_date, '00'].join(':') : '';
            this.projectForm.end_date = this.projectForm.end_date ? [this.projectForm.end_date, '00'].join(':') : '';
            // this.projectForm.start_date = this.projectForm.start_date;
            // this.projectForm.end_date = this.projectForm.end_date;
            const seniorConfig = this.pageConfig.seniorConfig;
            console.log(this.pageConfig.limitTypeCodeList, 'limitTypeCodeList');
            const limitTypeCodeRes = await this.$store.dispatch('publicApi/getDicItemValues', {dicId: 120});
            const limitTypeRes = await this.$store.dispatch('publicApi/getDicItemValues', {dicId: 121});
            this.limitTypeCodeList = limitTypeCodeRes.results || [];
            this.$set(seniorConfig.formList[0], 'selectList', limitTypeCodeRes.results || []);
            this.linkTypeList = limitTypeRes.results || [];
            this.$set(this.pageConfig, 'projectForm', this.projectForm); // 挂载form 对象
            console.log(this.pageConfig.projectForm, 'pageConfig.projectForm');
            if (this.projectForm.cid) {
               this.taskList = this.ganttTemplate.gantt.serialize().data.filter(v => v.cid !== this.projectForm.cid);
               const allLinks = this.$clone(this.ganttTemplate.gantt.serialize().links);
               this.links = allLinks.filter(v => v.target === this.projectForm.cid);
            } else {
                this.taskList = this.ganttTemplate.gantt.serialize().data;
            }
            if (this.ganttType === 'edit') {
                const des = await this.$store.dispatch('demMasterPlan/getResourceDetailList', {cid: this.projectForm.cid}).then();
                this.$set(this.pageConfig.subTableConfig['detailedTable'], 'tableData', des.results);
            }
            this.flag = true;
        },
        // 子表行操作按钮
        pageConfigEmitQueryTableButtonFnName ({ row, btnParameter }) {
            if (btnParameter.fn) {
                this[btnParameter.fn](row);
            }
        },
        // 自动计算完成日期
        handleAtuoDuration() {
            // const startDate = this.pageConfig.projectForm.start_date;
            // const duration = this.pageConfig.projectForm.duration || 1;
            // let endDate = '';
            // if (startDate) {
            //     const startDateTime = new Date(startDate).getTime();
            //     const endDateTime = startDateTime + duration * 60 * 60 * 24 * 1000;
            //     // console.log(endDateTime, 'endDateTime');
            //     endDate = this.$utils.commonUtil.formatTime(endDateTime);
            //     // console.log(endDate, 'endDate');
            //     this.$set(this.pageConfig.projectForm, 'end_date', endDate);
            // }
        },
        // 获取编辑表单的项目
        editFormEvent({eventName, params}) {
            if (eventName === 'clearUser') { // 清除用户
                this.handleClearUser(params);
            }
            if (eventName === 'user') { // 获取用户
                this.handleSelectUser(params);
            }
            if (eventName === 'relationTable') {
                this.handleOtherSelect(params);
            }
            if (eventName === 'operateFun') {
                this[params.operateFun] && this[params.operateFun](params);
            }
        },
        // 清除员工
        handleClearUser(params) {
            this.handleSelectUser({selectList: [], paramsConfig: params});
        },
        // 选择子工程
        handleSelectUser(params) {
            this.handleSelect(params, 'userName');
        },
        // 确认选择
        handleSelect(params, displayValue, callback) {
            const arr = params.selectList;
            const item = params.paramsConfig;
            if (!callback) { // 弹窗选择后的下拉框回调
                callback = item.otherOperate && item.otherOperateFun && this[item.otherOperateFun];
            }
            // 关联子表时
            this.setRelationData(item, arr, displayValue, callback);
        },
        // 主表联动赋值
        setRelationData(item, arr, displayValue, callback) {
            this.$set(this.pageConfig.projectForm, item.prop, arr.length > 0 ? arr[0][displayValue] : ''); // 显示值
            this.$set(this.pageConfig.projectForm, item.key, arr.length > 0 ? arr[0].id : ''); // 关键值
        },
        handleChangeLimitTypeCode(val) {
            const index = this.limitTypeCodeList.findIndex(v => v.dataCode === val);
            this.$set(this.pageConfig.projectForm, 'limitTypeName', index >= 0 ? this.limitTypeCodeList[index].dataName : '');
        },
        // 下拉选择框
        handleOtherSelect(params) {
            const item = params.paramsConfig;
            this.setSelectValue(item, this.pageConfig.projectForm[item.prop]);
        },
        // 下拉框联动赋值
        setSelectValue(item, event, cancleFlag = true) {
            if (item.isRelation) {
                item.relationList && item.relationList.forEach(row => {
                let index = 0;
                if (item.formType === 'select') {
                    index = item.selectList.findIndex(v => v[item.valueCode] === event);
                } else {
                    index = item.selectList.findIndex(v => v.dataCode === event);
                }
                this.$set(this.pageConfig.projectForm, row.receive, item.selectList[index] && item.selectList[index][row.value] || ''); // 显示值
                this.$set(this.oldProjectForm, row.receive, item.selectList[index] && item.selectList[index][row.value] || ''); // 显示值
                });
            }
            if (item.otherOperate && cancleFlag) {
                item.otherOperateFun && this[item.otherOperateFun]();
            }
        },
        // 弹窗
        handleDialogStatus(type) {
            if (type === 'close') {
                this.$emit('close');
                return;
            }
            this.$refs.editForm.getValidateForm(async (valid) => {
                if (this.ganttType === 'edit' && this.taskInfo.leaf === 1) {
                    const detailedTable = this.$refs.detailedTable[0].validateTableData();
                    if (!detailedTable) {
                        // 存在未填写或个数错误的数据
                        this.$message.error(`${this.$t('dialog.gantResource')} ${this.$t('tips.notFilledIn')}`);
                        return;
                    }
                }
                // eslint-disable-next-line no-constant-condition
                // if (3 > 2) return;
                const wbs = this.pageConfig.projectForm.wbs;
                if (wbs) {
                    const wbsData = {
                        projectId: this.projectId,
                        wbs,
                        cid: this.pageConfig.projectForm.cid || ''
                    };
                    const wbsRes = await this.$store.dispatch('demMasterPlan/checkWbsExist', wbsData);
                    if (wbsRes.results) {
                        this.$message.error('高级中WBS填写值已重复');
                        return;
                    }
                }
                const demMasterPlanGant = this.$clone(this.pageConfig.projectForm);
                console.log(demMasterPlanGant, 'demMasterPlanGant');
                delete demMasterPlanGant.id;
                demMasterPlanGant.id = demMasterPlanGant.nodeId;
                // 工作时间
                demMasterPlanGant.start_date = `${demMasterPlanGant.start_date.split(' ')[0]} ${this.workTime.morningStartDate || '08:30'}`;
                demMasterPlanGant.end_date = `${demMasterPlanGant.end_date.split(' ')[0]} ${this.workTime.afternoonEndDate || '17:30'}`;
                demMasterPlanGant.startDate = `${demMasterPlanGant.start_date}:00`;
                demMasterPlanGant.endDate = `${demMasterPlanGant.end_date}:00`;
                demMasterPlanGant.open = demMasterPlanGant.open ? 1 : 0;
                demMasterPlanGant.projectId = this.projectId;
                demMasterPlanGant.masterPlanId = this.id;
                demMasterPlanGant.sort = demMasterPlanGant.sort || 0;
                const demMasterPlanLinks = this.links;
                const links = [...new Set(this.links.map(v => v.source))];
                if (links.length < this.links.length) {
                    this.$message.error(this.$t('dialog.linkErrorTips'));
                    return;
                }
                const data = {
                    demMasterPlanGant,
                    demMasterPlanLinks,
                    id: this.id,
                    projectId: this.projectId
                };
                console.log(data, 'data');
                this.$store.dispatch(this.routerInfo.editUrl, data).then(res => {
                    // console.log(res);
                    const results = this.setData(res.results);
                    console.log(results, 'results');
                    if (this.ganttType === 'edit' && this.taskInfo.leaf === 1) {
                        const detailedTable = this.$refs.detailedTable[0].validateTableData();
                        if (detailedTable.length) {
                           this.handleSaveResource(results, detailedTable);
                        } else {
                            this.$emit('ganttSet', results);
                        }
                    } else {
                        console.log(results, 'results');
                        this.$emit('ganttSet', this.$clone(results));
                    }
                    // this.$emit('ganttSet', results);
                });
            });
        },
        async handleSaveResource(results, detailedTable) {
            for (const i in detailedTable) {
                const item = detailedTable[i];
                item.cid = results.cid;
            }
            const data = {
                cid: results.cid,
                details: detailedTable
            };
            const res = await this.$store.dispatch('demMasterPlan/batchEditResourceDetail', data).then();
            this.$emit('ganttSet', results);
        },
        // 设置节点
        setData(item) {
            item.nodeId = item.id;
            delete item.id;
            item.id = item.cid;
            item.start_date = new Date(item.startDate);
            item.end_date = new Date(item.endDate);
            // item.start_date = item.startDate.split(' ')[0];
            // item.end_date = item.endDate ? item.endDate.split(' ')[0] : '';
            item.open = item.open !== 0;
            return item;
        }
    }
};
</script>

<style lang="scss" scoped>
.ganttDetail {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    /deep/ .el-tabs {
        flex: 1;
        height: 300px;
        .el-tabs__content {
            height: calc(100% - 55px);
            .detailedTable {
                height: 100%;
                display: flex;
                flex-direction: column;
            }
        }
    }
}
</style>
