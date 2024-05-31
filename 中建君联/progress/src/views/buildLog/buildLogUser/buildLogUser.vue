<!--
 * @Author: your name
 * @Date: 2021-01-26 09:52:40
 * @LastEditTime: 2021-07-27 18:17:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\buildLog\buildLogUser\buildLogUser.vue
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
                        {{$t('buildLogUser.myProjectUser')}}
                        <el-button
                            v-if="authButtonList.indexOf('create') >= 0"
                            name="sysHandleAdd"
                            :disabled="searchForm.projectId ===''"
                            size="small" type='primary' icon="el-icon-plus"
                            v-fast-click style="float:right;"
                            @click="sysHandleAdd">
                            {{$t('button.add')}}
                        </el-button>
                    </div>
                    <div class="search">
                        <el-input
                            size="samll" clearable
                            @keyup.enter.native="sysHandleSearch"
                            :placeholder="$t('buildLogUser.searchProjectUser')"
                            prefix-icon="el-icon-search"
                            v-model="searchForm.userName">
                        </el-input>
                    </div>
                    <g-query-table
                        :config="mainTable"
                        @fnName="pageConfigEmitQueryTableButtonFnName"
                        :tableList.sync="tableSeleList">
                    </g-query-table>
                    <div class="table_pages" v-if="mainTable.paging">
                        <g-to-page ref="Page"
                                :page-sizes="mainTable.pageSizes"
                                :pager-count="mainTable.pagerCount"
                                :page-size="pageSize"
                                :total="mainTable.total"
                                @sentPages="getPages">
                        </g-to-page>
                    </div>
                </div>
            </div>
        </div>
        <!-- 选择项目成员 -->
        <el-dialog append-to-body :title="$t('buildLogUser.selectProjectUser')" center width="90%" top="5vh"
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
import {search} from 'mixins/searchMixins';

export default {
    name: 'buildLogUser',
    mixins: [search],
    components: {
        projectDetail(resolve) {
            require(['views/confiManagement/components/projectDetail/projectDetail'], resolve);
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
                    {show: true, prop: 'userName', label: 'buildLogUser.userName'},
                    // 账号
                    {show: true, prop: 'userCode', label: 'buildLogUser.userCode'},
                    // // 岗位
                    // {show: true, prop: 'roleInfo', label: 'buildLogUser.roleInfo'},
                    // 操作
                    {show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '60', align: 'right',
                        buts: [
                            {name: 'button.delete', class: 'danger', fn: 'handleDelete', authCode: 'delete', isCreateBy: true, enable: true}
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
            selectedUserDialog: false,
            selectedUsersList: []
        };
    },
    created () {
      this.authButtonList = this.$route.meta.authButtonList && this.$route.meta.authButtonList.map(v => v.resUrl);
    },
    mounted () {
        this.$nextTick(() => {
            const consHeight = this.$refs.cons ? this.$refs.cons.offsetHeight : 522;
            const buttonListHeight = 46; // 按钮高度
            const pageHeight = 46; // 分页高度
            const tableHeight = consHeight - buttonListHeight - pageHeight - 66; // 20 位 padding 高度
            // const pageSize = Math.floor(tableHeight / 39);
            this.mainTable.maxHeight = tableHeight;
          // this.pageSize = pageSize - 1;
        });
    },
    methods: {
        // 获取项目Id
        getProjectId(val) {
            this.searchForm.projectId = val;
            this.pageNo = 1;
            this._getTableDataList();
        },
        // 获取表单
        _getTableDataList () {
            if (!this.searchForm.projectId) return;
            this.loading = true;
            const data = {
                pageNo: this.pageNo,
                pageSize: 10000,
                // pageSize: this.pageSize,
                ...this.searchForm
            };
            this.$store.dispatch('buildLogUser/getPageList', data).then(res => {
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
        handleDelete(row) {
            const statusConfig = {
                keyId: 'buildLogUserId',
                keyName: 'userName',
                row,
                api: 'buildLogUser/setDelete'
            };
            this.setDataDelete(statusConfig, row);
        },
        // 删除
        setDataDelete(statusConfig, row) {
            // if (!this.judgeSamePerson(row) && statusConfig.isCreate !== false) {
            //     this.editError(this.$t('button.delete'));
            //     return;
            // }
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
                        this._getTableDataList();
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
            this._getTableDataList();
        },
        sysHandleSearch() {
            this.pageNo = 1;
            this._getTableDataList();
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
                this.$store.dispatch('buildLogUser/setEdit', data).then(res => {
                    if (res.status === 0) {
                        this.$message.success(`${this.$t('button.add')} ${this.$t('tips.success')}!`);
                        this._getTableDataList();
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
        }
        .title {
            height: 36px;
            line-height: 36px;
            padding-left: 20px;
            margin-bottom: 10px;
        }
        .search {
            margin-bottom: 10px;
            /deep/ .el-input{
                .el-input__inner{
                    height: 36px;
                    line-height: 36px;
                }
            }

        }
        .table_pages{
            text-align: right;
            margin: 5px 0;
            height: 32px;
        }
    }
}
</style>
