<!--
 * @Author: your name
 * @Date: 2021-04-14 10:45:48
 * @LastEditTime: 2021-04-14 11:58:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\durationRisk\components\durationRiskDetail\durationRisk.vue
-->
<template>
  <div class="materialVarieties">
    <div class="materialVarieties-cont">
        <div class="left" v-loading="loading" :element-loading-text="$t('tips.loadingText')">
            <div class="title">
                <div class="title-name">
                  {{$t(varietiesTitle)}}
                </div>
                <el-input v-model="param"
                    @keyup.enter.native="handleSearch"
                    prefix-icon="el-icon-search"
                    :placeholder="$t('durationRiskRegister.riskContentSearchTips')"
                    size="small"
                    clearable
                    maxlength="64">
                </el-input>
            </div>
            <g-query-table
                :config="mainTable"
                @tableList="getTableSeleList">
            </g-query-table>
            <div class="table_pages" v-if="mainTable.paging" style="margin-top:10px;text-align:center;">
                <g-to-page ref="Page"
                        :page-sizes="mainTable.pageSizes"
                        :pager-count="mainTable.pagerCount"
                        :page-size="pageSize"
                        :total="mainTable.total"
                        @sentPages="getPages">
                </g-to-page>
            </div>
        </div>
        <div class="right">
            <div class="title">{{$t('tips.selected')}}</div>
            <g-query-table
                :config="selectMainTable">
            </g-query-table>
        </div>
    </div>
    <div class="footer">
        <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small" @click="handleDialogStatus('close')">{{$t('button.close')}}</el-button>
        <el-button size="small" type="primary" icon="el-icon-circle-check" @click="handleDialogStatus('save')" v-fast-click>{{$t('button.determine')}}</el-button>
    </div>
  </div>
</template>

<script>
  import {search} from 'mixins/searchMixins';

  export default {
    name: 'durationRiskDetail',
    mixins: [search],
    data () {
      return {
        loading: false,
        mainTable: {
            rowKey: 'eId',
            // 多选
            isCheckbox: true,
            selectedList: [],
            // 表格数据
            tableData: [],
            // 表格高度
            maxHeight: 500,
            // 子系统表头渲染参数
            tableList: [
                // 风险内容
                {show: true, prop: 'riskContent', label: 'durationRiskRegister.riskContent'},
                // 计划时间
                {show: true, prop: 'planTimeContent', label: 'durationRiskRegister.planTimeContent'}
            ],
            paging: true,
            pageSize: 10,
            pagerCount: 5,
            // 页码
            total: 0
        },
        selectMainTable: {
            rowKey: 'eId',
            // 表格数据
            tableData: [],
            // 表格高度
            maxHeight: 500,
            // 子系统表头渲染参数
            tableList: [
                // 风险内容
                {show: true, prop: 'riskContent', label: 'durationRiskRegister.riskContent'},
                // 计划时间
                {show: true, prop: 'planTimeContent', label: 'durationRiskRegister.planTimeContent'}
            ]
        },
        param: '',
        // =====================
        tableSeleList: [],
        checkList: []
      };
    },
    props: {
        dialogHeight: {
            type: Number,
            default: 300
        },
        selectList: {
            type: Array,
            default: () => []
        },
        // 左侧的展示标题
        varietiesTitle: {
          type: String,
          default: 'durationRiskRegister.durationRiskConfig'
        },
        currentOrgId: {
            default: 0
        }
    },
    async created () {
        this.checkList = this.$clone(this.selectList);
        this._getTableDataList();
        this.selectMainTable.maxHeight = this.dialogHeight - 140;
        this.mainTable.maxHeight = this.dialogHeight - 140 - 50;
    },
    methods: {
        // 年/季
        _getTableDataList () {
            this.loading = true;
            const data = {
                planTimeContent: '',
                riskContent: this.param,
                stauts: [0],
                pageNo: this.pageNo,
                pageSize: this.pageSize
            };
            this.$store.dispatch('durationRiskConfig/getPageList', data).then(res => {
                if (res.status === 0) {
                    this.mainTable.selectedList = [];
                    // console.log(res.results.records, 'res.results');
                    for (const item of res.results.records) {
                        item.eId = item.id;
                        const index = this.checkList.findIndex(v => v.eId === item.eId);
                        if (index >= 0) {
                            this.mainTable.selectedList.push({
                                eId: item.eId
                            });
                            this.checkList.splice(index, 1);
                        }
                    }
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
        // 分页
        getPages (obj) {
            if (obj.isSzieChange) {
                this.pageSize = obj.pageSize;
            } else {
                this.pageNo = obj.pageNo;
            }
            this._getTableDataList();
        },
        // 获取选中的数据
        getTableSeleList(arr) {
            this.tableSeleList = arr;
            this.selectMainTable.tableData = arr;
        },
        // 传出
        handleDialogStatus(status) {
            if (status === 'close') {
                this.$emit('update:close', false);
            } else {
                this.$emit('getData', this.selectMainTable.tableData);
            }
        }
    }
  };
</script>

<style scoped lang="scss">
@import '../detail.scss';
</style>
