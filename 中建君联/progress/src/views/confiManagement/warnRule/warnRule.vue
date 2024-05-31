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
                        {{$t('warnRule.mywarnRule')}}
                        <el-button size="small" type="primary" icon="el-icon-circle-check"
                            v-if="authButtonList.indexOf('save') >= 0"
                            @click="handleSave" v-fast-click style="float:right;">
                            {{$t('button.save')}}
                        </el-button>
                    </div>
                    <div class="calendar-set editTable">
                         <el-tabs v-model="activeName">
                            <el-tab-pane :label="$t('warnRule.deviation')" name="first" class="detailedTable">
                                <el-table :data="deviationList">
                                    <template slot="empty">
                                        <no-data>
                                        </no-data>
                                    </template>
                                    <el-table-column align="center" width="120" :label="$t('warnRule.deviationVal')">
                                         <template slot-scope="scope">
                                            <el-number v-model.trim="scope.row.deviationVal" size="small"
                                                @change="handleChangeDeviationVal(scope.row)"
                                                :min="0" :max="100" :precision="0">
                                            </el-number>
                                         </template>
                                    </el-table-column>
                                    <el-table-column :label="$t('warnRule.warnRuleDescriptionLabeL')" prop="warnRuleDescription" show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            {{$t(scope.row.warnRuleDescription)}}
                                         </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane :label="$t('warnRule.user')" name="second" class="detailedTable">
                                <div class="title">
                                    {{$t('warnRule.myProjectUser')}}
                                    <el-button
                                        name="sysHandleAdd"
                                        class="handleButton"
                                        :disabled="searchForm.projectId ===''"
                                        size="small" type='primary' icon="el-icon-plus"
                                        v-fast-click
                                        @click="sysHandleAdd">
                                        {{$t('button.add')}}
                                    </el-button>
                                </div>
                                <!-- <div class="search">
                                    <el-input
                                        size="samll" clearable
                                        @keyup.enter.native="sysHandleSearch"
                                        :placeholder="$t('warnRule.searchProjectUser')"
                                        prefix-icon="el-icon-search"
                                        v-model="searchForm.userName">
                                    </el-input>
                                </div> -->
                                <g-query-table
                                    :config="mainTable"
                                    @fnName="pageConfigEmitQueryTableButtonFnName"
                                    :tableList.sync="tableSeleList">
                                </g-query-table>
                                <div class="table_pages" v-if="mainTable.paging" style="margin-top:5px;text-align:center;">
                                    <g-to-page ref="Page"
                                            :page-sizes="mainTable.pageSizes"
                                            :pager-count="mainTable.pagerCount"
                                            :page-size="pageSize"
                                            :total="mainTable.total"
                                            @sentPages="getPages">
                                    </g-to-page>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane :label="$t('warnRule.method')" name="third">
                                <el-table :data="methodList">
                                    <template slot="empty">
                                        <no-data>
                                        </no-data>
                                    </template>
                                    <el-table-column align="center" width="100" :label="$t('warnRule.ifFlag')">
                                          <template slot-scope="scope">
                                              <el-select v-model="scope.row.ifFlag" size="small">
                                                <el-option :label="$t('button.disable')" :value="1">
                                                </el-option>
                                                <el-option :label="$t('button.enable')" :value="0">
                                                </el-option>
                                            </el-select>
                                         </template>
                                    </el-table-column>
                                    <el-table-column :label="$t('warnRule.warnRuleValue')" prop="warnRuleValue">
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane :label="$t('warnRule.time')" name="fourth">
                                <el-table :data="timeList">
                                    <template slot="empty">
                                        <no-data>
                                        </no-data>
                                    </template>
                                    <el-table-column align="center" width="100" :label="$t('warnRule.ifFlag')">
                                          <template slot-scope="scope">
                                              <el-select v-model="scope.row.ifFlag" size="small">
                                                <el-option :label="$t('button.disable')" :value="1">
                                                </el-option>
                                                <el-option :label="$t('button.enable')" :value="0">
                                                </el-option>
                                            </el-select>
                                         </template>
                                    </el-table-column>
                                    <el-table-column :label="$t('warnRule.warnTimeValue')" prop="warnTimeValue">
                                    </el-table-column>
                                </el-table>
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

        <!-- 选择项目成员 -->
        <el-dialog append-to-body :title="$t('warnRule.selectProjectUser')" center width="90%" top="5vh"
                :visible.sync="selectedUserDialog">
            <organizationUserTable v-if="selectedUserDialog"
                :isShow.sync="selectedUserDialog" choice='isCheckbox'
                :selectedUsers="selectedUsersList"
                @selectUser="getSelectUser">
            </organizationUserTable>
        </el-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {search} from 'mixins/searchMixins';
import perUtil from '@/util/index';

export default {
    name: 'warnRule',
    mixins: [search],
    components: {
        projectDetail(resolve) {
            require(['../components/projectDetail/projectDetail'], resolve);
        },
        // 选人
        organizationUserTable(resolve) {
            require(['components/basicComponents/userDialog/organizationUserTable'], resolve);
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
                paging: false,
                // 表头操作行配置
                tableHeader: {
                showColumnCtrl: true, // 显示/隐藏列
                refresh: false // 刷新
                },
                // 是否默认选中第一行
                defaultSeleFirstLine: false,
                // 子系统表头渲染参数
                tableList: [
                    // 姓名
                    {show: true, prop: 'userName', label: 'warnRule.userName'},
                    // 账号
                    {show: true, prop: 'userCode', label: 'warnRule.userCode'},
                    // // 岗位
                    // {show: true, prop: 'roleInfo', label: 'warnRule.roleInfo'},
                    // 操作
                    {show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '60', align: 'right',
                        buts: [
                            {name: 'button.delete', class: 'danger', fn: 'setUserDataDelete', authCode: 'delete',
                             isCreateBy: true, enable: true, noAuth: true}
                        ]
                    }
                ]
            },
            tableSeleList: [],
            // 搜索数据
            searchForm: {
                projectId: '',
                userName: ''
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
            // 偏差允许值
            deviationList: [],
            tempDeviationList: [
                { deviationVal: 5, warnRuleDescription: 'warnRule.warnRuleDescription'}
            ],
            basicExcludeCalendarWorkEditDtos: [],
            // 预警对象设置
            selectedUserDialog: false,
            // 预警方式
            methodList: [],
            tempMethodList: [
                { ifFlag: 1, warnRuleValue: '短信', warnRuleCode: '01'},
                { ifFlag: 1, warnRuleValue: '邮件', warnRuleCode: '02'},
                { ifFlag: 1, warnRuleValue: '站内消息', warnRuleCode: '03'}
            ],
            // 时间设置
            timeList: [],
            tempTimeList: [
                { ifFlag: 0, warnTimeValue: '上午9：00', warnTimeCode: '01'},
                { ifFlag: 0, warnTimeValue: '上午11：30', warnTimeCode: '02'},
                { ifFlag: 0, warnTimeValue: '下午14：00', warnTimeCode: '03'},
                { ifFlag: 0, warnTimeValue: '下午17：30', warnTimeCode: '04'}
            ],
            selectedUsersList: []
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
            this.mainTable.maxHeight = tableHeight - 40;
          // this.pageSize = pageSize - 1;
        });
    },
    methods: {
        // 改变偏差允许值
        handleChangeDeviationVal(row) {
            const deviationVal = row.deviationVal;
        },
        // 获取项目Id
        getProjectId(val) {
            this.searchForm.projectId = val;
            this.projectForm.projectId = val;
            this.activeName = 'first';
            this.pageNo = 1;
            this._getTableDataList();
        },
        // 获取表单
        _getTableDataList () {
            if (!this.searchForm.projectId) return;
            // 偏差值
            this._getDeviationList();
            // 预警对象
            this._getUserList();
            // 预警方式设置
            this._getMethodList();
            // 预警方式设置
            this._getTimeList();
        },
        // 偏差值
        _getDeviationList() {
            this.$store.dispatch('warnRule/getDeviationList', {projectId: this.searchForm.projectId}).then(res => {
                if (res.status === 0) {
                    if (res.results && res.results.length) {
                        this.deviationList = res.results;
                    } else {
                        this.deviationList = this.$clone(this.tempDeviationList);
                    }
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
        },
        // 预警对象
        _getUserList() {
            if (!this.searchForm.projectId) return;
            this.loading = true;
            const data = {
                pageNo: this.pageNo,
                pageSize: 10000,
                // pageSize: this.pageSize,
                ...this.searchForm
            };
            this.$store.dispatch('warnRule/getUserList', data).then(res => {
                if (res.status === 0) {
                    this.mainTable.tableData = res.results.records;
                    this.mainTable.total = res.results.total;
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
                this.loading = false;
            }).catch(e => {
                this.loading = false;
            });
        },
        // 预警方式设置
        _getMethodList() {
            this.$store.dispatch('warnRule/getMethodList', {projectId: this.searchForm.projectId}).then(res => {
                if (res.status === 0) {
                    if (res.results && res.results.length) {
                        this.methodList = res.results;
                    } else {
                        this.methodList = this.$clone(this.tempMethodList);
                    }
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
        },
        // 预警时间设置
        _getTimeList() {
            this.$store.dispatch('warnRule/getTimeList', {projectId: this.searchForm.projectId}).then(res => {
                if (res.status === 0) {
                    if (res.results && res.results.length) {
                        this.timeList = res.results;
                    } else {
                        this.timeList = this.$clone(this.tempTimeList);
                    }
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
        },
        // 保存日历设置
        handleSave() {
            const dataDeviation = {
                'deviationVal': this.deviationList[0].deviationVal,
                'projectId': this.searchForm.projectId,
                id: this.deviationList[0].id || '',
                'remarks': '',
                'warnRuleDescription': this.deviationList[0].warnRuleDescription
            };
            this.$store.dispatch('warnRule/saveDeviation', dataDeviation).then(res => {
                if (res.status === 0) {
                    // this.$message.success(`${this.$t('button.save')} ${this.$t('tips.success')}!`);
                    this._getDeviationList();
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
            const dataMethod = {
                'projectId': this.searchForm.projectId,
                'warnRuleMethods': this.methodList
            };
            this.$store.dispatch('warnRule/saveMethod', dataMethod).then(res => {
                if (res.status === 0) {
                    this.$message.success(`${this.$t('button.save')} ${this.$t('tips.success')}!`);
                    this._getMethodList();
                } else {
                    // this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
            const dataTime = {
                'projectId': this.searchForm.projectId,
                'warnRuleTimes': this.timeList
            };
            this.$store.dispatch('warnRule/saveTime', dataTime).then(res => {
                if (res.status === 0) {
                    // this.$message.success(`${this.$t('button.save')} ${this.$t('tips.success')}!`);
                    this._getTimeList();
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
        },
        // ---------------- 预警对象 ----------
        // 添加
        sysHandleAdd() {
            this.currentId = '';
            this.selectedUsersList = [];
            for (const item of this.mainTable.tableData) {
                this.selectedUsersList.push({
                    id: item.userId,
                    userName: item.userName
                });
            }
            this.selectedUserDialog = true;
        },
        // 删除
        setUserDataDelete(row) {
            // if (!this.judgeSamePerson(row) && statusConfig.isCreate !== false) {
            //     this.editError(this.$t('button.delete'));
            //     return;
            // }
            const statusConfig = {
                keyId: 'buildLogUserId',
                keyName: 'userName',
                row,
                api: 'warnRule/deleteUser'
            };
            const params = {
                projectId: row.projectId,
                buildLogUserId: row.id
            };
            this.$confirm(`${this.$t('button.delete')} ${statusConfig.row[statusConfig.keyName]}?`, this.$t('button.delete'), {
                confirmButtonText: this.$t('button.determine'),
                cancelButtonText: this.$t('button.close'),
                type: 'warning'
            }).then(() => {
                this.$store.dispatch(statusConfig.api, params).then(res => {
                    if (res.status === 0) {
                        this._getUserList();
                        this.$message.success(`${this.$t('button.delete')} ${this.$t('tips.success')}!`);
                    } else {
                        this.$message.error(`${this.$t('button.delete')} ${this.$t('tips.fail')}!`);
                    }
                });
            })
        .catch(() => {});
        },
        // 分页
        getPages (obj) {
            if (obj.isSzieChange) {
                this.pageSize = obj.pageSize;
            } else {
                this.pageNo = obj.pageNo;
            }
            this._getUserList();
        },
        sysHandleSearch() {
            this.pageNo = 1;
            this._getUserList();
        },
        // 获取用户
        getSelectUser(val) {
            if (val.length) {
                console.log(val);
                const data = {
                    id: this.currentId,
                    projectId: this.searchForm.projectId,
                    userIds: val.map(v => v.id)
                };
                this.$store.dispatch('warnRule/saveUser', data).then(res => {
                    if (res.status === 0) {
                        this.$message.success(`${this.$t('button.add')} ${this.$t('tips.success')}!`);
                        this._getUserList();
                    } else {
                        this.$message.error(this.$t(`exception.${res.errorCode}`));
                    }
                    this.loading = false;
                }).catch(e => {
                    this.loading = false;
                });
            }
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
        }
    }
    /deep/ .editTable {
        width: 100%;
        min-width: 100%
    }
}
.handleButton {
    position: absolute;
    right: 0px
}
</style>
