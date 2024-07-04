
<template>
    <div class="projectCons">
        <div class="left cons">
            <div class="content">
                <div class="fixed-scroll">
                    <projectDetail @projectId='getProjectId' @project='getProject'>
                    </projectDetail>
                </div>
            </div>
        </div>
        <div class="right cons" ref="cons">
            <div class="content">
                <div class="fixed-scroll">
                    <div class="title">
                        {{$t('projectMajor.myPorjectMajor')}}
                        <!-- v-if="authButtonList.indexOf('create') >= 0" -->
                        <el-button
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
                            :placeholder="$t('projectMajor.searchProjectMajor')"
                            prefix-icon="el-icon-search"
                            v-model="searchForm.majorValue">
                        </el-input>
                    </div>
                    <g-query-table
                        :config="mainTable"
                        @fnName="pageConfigEmitQueryTableButtonFnName"
                        :tableList.sync="tableSeleList">
                        <template slot="table-status" slot-scope="{row, item}">
                            <span class="major-status" :class="'status'+row[item.prop]">
                                {{setDicData(row[item.prop], item.selectList)}}
                            </span>
                        </template>
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

    <g-drawer :title="type === 'add' ? $t('button.add') : $t('button.edit')"
      v-if="pageConfigLoading" :display.sync="pageConfigLoading" :inner="true" width="30%">
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

export default {
    name: 'projectMajor',
    mixins: [search],
    components: {
        projectDetail(resolve) {
            require(['../compoent/projectDetail/projectDetail'], resolve);
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
                    // 专业
                    {show: true, prop: 'majorValue', label: 'projectMajor.majorValue'},
                    // 编号
                    {show: true, prop: 'majorCode', label: 'projectMajor.majorCode', minWidth: 100},
                    // 状态
                    {show: true, prop: 'status', label: 'projectMajor.status', formType: 'slot', minWidth: 100, align: 'center',
                        selectList: [
                            {dataName: '启用', dataCode: 0},
                            {dataName: '禁用', dataCode: 1}
                        ]
                    },
                    // 操作
                    {show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '200',
                        buts: [
                            // 启用
                            {name: 'button.enable', class: 'success', fn: 'handleEnable', authCode: 'enable', isCreateBy: true},
                            // 禁用
                            {name: 'button.disable', class: 'danger', fn: 'handleDisable', authCode: 'disable', isCreateBy: true},
                            // 修改
                            {name: 'button.edit', class: '', fn: 'handleEdit', authCode: 'update', isCreateBy: true},
                            // 删除
                            {name: 'button.delete', class: 'danger', fn: 'handleDelete', authCode: 'delete', isCreateBy: true}
                        ]
                    }
                ]
            },
            tableSeleList: [],
            // 搜索数据
            searchForm: {
                projectId: '',
                majorValue: ''
            },
            pageSize: 10,
            pageNo: 1,
            currentId: '',
            pageConfigLoading: false,
            projectForm: {
                majorCode: '',
                majorValue: '',
                projectId: '',
                remarks: '',
                sorts: '',
                status: 0,
                tenantId: this.$utils.Auth.hasUserInfo().tenantId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                createBy: this.$utils.Auth.hasUserInfo().userId,
                createByName: this.$utils.Auth.hasUserInfo().userName
            },
            pageEdit: new Page(),
            pageConfig: '',
            type: ''
        };
    },
    created () {
        this.pageConfig = this.pageEdit.PageConfig;
        this.authButtonList = this.$route.meta.authButtonList && this.$route.meta.authButtonList.map(v => v.resUrl);
    },
    mounted () {
        this.$nextTick(() => {
            const consHeight = this.$refs.cons ? this.$refs.cons.offsetHeight : 522;
            const buttonListHeight = 46; // 按钮高度
            const pageHeight = 46; // 分页高度
            const tableHeight = consHeight - buttonListHeight - pageHeight - 66; // 20 位 padding 高度
            this.mainTable.maxHeight = tableHeight;
        });
    },
    methods: {
        setDicData (value, selectList) {
            const index = selectList && selectList.findIndex(v => v.dataCode === value);
            if (index < 0) return '';
            return selectList ? selectList[index].dataName : '';
        },
        // 获取项目Id
        getProjectId(val) {
            this.searchForm.projectId = val;
            this.projectForm.projectId = val;
            this.searchForm.majorValue = '';
            this.sysHandleSearch();
            this._getTableDataList();
        },
        // 获取项目
        getProject(row) {
            this.searchForm.projectName = row.projectName;
        },
         // 获取表单
        _getTableDataList () {
            if (!this.searchForm.projectId) return;
            this.loading = true;
            const data = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                ...this.searchForm
            };
            this.$store.dispatch('projectMajor/getProjectMajorPage', data).then(res => {
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
            this.type = 'add';
            this.$set(this.pageConfig, 'projectForm', this.$clone(this.projectForm)); // 挂载form 对象
            this.pageConfig.projectForm.sorts = this.mainTable.tableData.length + 2;
            this.pageConfigLoading = true;
        },
        // 修改
        handleEdit(row) {
            this.type = 'edit';
            this.$set(this.pageConfig, 'projectForm', this.$clone(row));
            this.pageConfigLoading = true;
        },
        // 启用
        handleEnable(row) {
            this.handleWarStatus(row);
        },
        // 禁用
        handleDisable(row) {
            this.handleWarStatus(row);
        },
        // 启用/禁用
        handleWarStatus(row) {
            const statusTips = row.status === 0 ? this.$t('button.disable') : this.$t('button.enable');
            const status = row.status === 0 ? 1 : 0;
            this.$confirm(`${statusTips}${row.majorValue}?`, statusTips, {
                confirmButtonText: this.$t('button.determine'),
                cancelButtonText: this.$t('button.close'),
                type: 'warning'
            })
            .then(() => {
                this.$store.dispatch('projectMajor/setStatus', {proProjectMajorId: row.id, status}).then(res => {
                    if (res.status === 0) {
                        this._getTableDataList();
                        this.$message.success(`${statusTips}${this.$t('tips.success')}!`);
                    } else {
                        this.$message.error(`${statusTips}${this.$t('tips.fail')}!`);
                    }
                });
            })
            .catch(() => {});
        },
        // 删除
        handleDelete(row) {
            const statusConfig = {
                keyId: 'proProjectMajorId',
                keyName: 'majorValue',
                row,
                api: 'projectMajor/deleteProjectMajor'
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
                this.$store.dispatch(statusConfig.api, {[statusConfig.keyId]: statusConfig.row.id}).then(res => {
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
        // 保存
        userDrawerSave() {
            this.$refs.editForm.getValidateForm(() => {
                this.$store.dispatch('projectMajor/saveProjectMajor', this.pageConfig.projectForm).then(res => {
                    const status = this.type === 'add' ? this.$t('button.add') : this.$t('button.edit');
                    if (res.status === 0) {
                        this._getTableDataList();
                        this.userDrawerClose();
                        this.$message.success(`${status} ${this.$t('tips.success')}!`);
                    } else {
                        this.$message.error(`${status} ${this.$t('tips.fail')}!`);
                    }
                });
            });
        },
        // 关闭
        userDrawerClose() {
            this.projectForm = {
                projectId: this.searchForm.projectId,
                majorCode: '',
                majorValue: '',
                remarks: '',
                sorts: '',
                status: 0
            };
            this.pageConfigLoading = false;
        }
    }
};
</script>
<style lang="scss" scoped>
.major-status {
  font-size: 14px;
  width: 100%;
  padding: 2px 10px;
  &.status0 {
    color: #24b568;
    background-color: rgba(36,181,104, 0.2);
  }
  &.status1 {
    color: #f73535;
    background-color: rgba(247,53,53, 0.2);
  }
}
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
            // padding-left: 20px;
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
