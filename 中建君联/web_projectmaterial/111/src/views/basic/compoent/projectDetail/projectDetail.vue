
<template>
    <div class="projcetDetail" ref="projcetDetail">
        <div class="title">
            {{$t('dialog.myProject')}}
        </div>
        <div class="search">
            <el-input
                :placeholder="$t('dialog.searchProject')"
                size="samll" clearable
                @keyup.enter.native="sysHandleSearch"
                prefix-icon="el-icon-search"
                v-model="searchForm.projectName">
            </el-input>
        </div>
        <g-query-table
            :config="mainTable"
            @rowClick='rowClick'
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
</template>
<script>
export default {
    data() {
        return {
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
                defaultSeleFirstLine: true,
                // 子系统表头渲染参数
                tableList: [
                    // 项目名称
                    {show: true, prop: 'projectName', label: 'dialog.projectName'},
                    // 所属公司
                    {show: true, prop: 'orgName', label: 'dialog.orgName'},
                    // 项目经理
                    {show: true, prop: 'projectManagerName', label: 'dialog.projectManagerName', minWidth: '100'}
                ]
            },
            tableSeleList: [],
            // 搜索数据
            searchForm: {
                beginTimeFrom: '',
                beginTimeTo: '',
                orgId: '',
                projectName: '',
                projectStatus: [],
                projectTypeCode: []
            },
            pageSize: 10,
            pageNo: 1
        };
    },
    mounted () {
      this.$nextTick(() => {
            const consHeight = this.$refs.projcetDetail ? this.$refs.projcetDetail.offsetHeight : 522;
            const buttonListHeight = 46; // 按钮高度
            const pageHeight = 46; // 分页高度
            const tableHeight = consHeight - buttonListHeight - pageHeight - 46; // 20 位 padding 高度
            this.mainTable.maxHeight = tableHeight;
            this._getTableDataList();
        });
    },
    methods: {
        // 获取数据
      // 获取表单
        _getTableDataList () {
            this.loading = true;
            const data = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                ...this.searchForm
            };
            this.$store.dispatch('publicApi/getProjectPermissionList', data).then(res => {
            if (res.status === 0) {
                this.mainTable.tableData = res.results.records;
                if (this.mainTable.tableData.length) {
                    this.$emit('projectId', this.mainTable.tableData[0].id);
                    this.$emit('project', this.mainTable.tableData[0]);
                } else {
                    this.$emit('projectId', '');
                    this.$emit('project', null);
                }
                this.mainTable.total = res.results.total;
            } else {
                this.$message.error(this.$t(`exception.${res.errorCode}`));
            }
            this.loading = false;
            }).catch(e => {
                this.loading = false;
            });
        },
        rowClick(row) {
            this.$emit('projectId', row.id);
            this.$emit('project', row);
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
        }
    }
};
</script>
<style lang="scss" scoped>
    .projcetDetail {
        width: 100%;
        height: 100%;
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
</style>
