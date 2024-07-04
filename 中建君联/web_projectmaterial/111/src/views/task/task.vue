<!--
 * @Author: your name
 * @Date: 2020-07-24 17:45:27
 * @LastEditTime: 2021-12-16 11:15:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_contract-合同管理\src\views\task\taks.vue
-->
<template>
  <div class="generalPage businessModule">
    <div class="roleCons">
      <div class="content">
        <div class='leftCons'>
          <ul>
            <!-- 任务中心 -->
            <li>{{$t('task.taskCenter')}}</li>
            <li :class="currentIndex===index?'active navigation':'navigation'"
                @click='handleSetNewsType(item,index)'
                v-for='(item,index) in typeNewList' :key='index'>
              {{$t(item.title)}}
              <span v-if="item.num > 0" class='midFont'
                    :style="currentIndex===index ? 'color: #ffffff' : 'color:#2b74ec'">{{item.num}}</span>
            </li>
          </ul>
        </div>
        <div class='rightCons'>
          <div class="cons">
            <div class="search_cons">
              <g-search-form
                :configForm="configPage.searchConfigForm"
                ref="searchForm"
                :searchFormValue="searchData[page]"
                :searchData.sync="searchData[page]"
              >
              </g-search-form>
            </div>
            <div class="table_cons">
              <div class="table_cons_table">
                <div class="table_btn userTitle">
                    <g-button :operationButtons="configPage[page].button" @butFnName="emitButtonFnName">
                    </g-button>
                </div>
                <div class="table_content" ref="tableContent" v-loading="loading">
                  <queryTable
                    :toConfigure="configPage.toConfigure"
                    :tableData="tableData[page]"
                    :maxHeight="offsetHeight"
                    :tableHeaderCon="configPage[page].tableList"
                    :tableList.sync="tableSeleList"
                    @fnName="emitQueryTableButtonFnName">
                  </queryTable>
                </div>
                <div class='pages'>
                    <g-to-page
                      ref='Page'
                      :page-size='pageSize'
                      :total='total[page]'
                      @sentPages='getPages'
                    ></g-to-page>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {search} from 'mixins/searchMixins';
  import Auth from 'util/auth';
  import queryPageConfig from './task.js';
  import processJump from './processJump.js';
  import queryTable from './queryTable';

  export default {
    name: 'task',
    mixins: [search],
    components: {
      queryTable
    },
    data() {
      const pageConfig = queryPageConfig(this);
      return {
        configPage: pageConfig,
        page: 'getTaskUndo',
        typeNewList: [
          // 我的待办
          {title: 'task.toDo', num: 0, isRead: 0, fun: 'getTaskUndo'},
          // 我的待阅
          {title: 'task.toRead', num: 0, isRead: 1, fun: 'getTaskUnRead'},
          // 我的已办
          {title: 'task.done', num: 0, isRead: 2, fun: 'getTaskDone'},
          // 我的已阅
          {title: 'task.read', num: 0, isRead: 3, fun: 'getTaskRead'},
          // 我的申请
          {title: 'task.application', num: 0, isRead: 4, fun: 'getTaskApply'}
        ],
        currentIndex: 0,
        loading: false,
        labelWidth: '80px',
        searchData: {
            getTaskUndo: {
              createTimeEnd: '',
              createTimeStart: '',
              nodeName: '',
              prevAssigneeName: '',
              processCreateName: '',
              processCreateTimeEnd: '',
              processCreateTimeStart: '',
              taskName: ''
            },
            getTaskUnRead: {
              createTimeEnd: '',
              createTimeStart: '',
              nodeName: '',
              prevAssigneeName: '',
              processCreateName: '',
              processCreateTimeEnd: '',
              processCreateTimeStart: '',
              taskName: ''
            },
            getTaskDone: {
              createTimeEnd: '',
              createTimeStart: '',
              nodeName: '',
              prevAssigneeName: '',
              processCreateName: '',
              processCreateTimeEnd: '',
              processCreateTimeStart: '',
              taskName: ''
            },
            getTaskRead: {
              createTimeEnd: '',
              createTimeStart: '',
              nodeName: '',
              prevAssigneeName: '',
              processCreateName: '',
              processCreateTimeEnd: '',
              processCreateTimeStart: '',
              taskName: ''
            },
            getTaskApply: {
              createTimeEnd: '',
              createTimeStart: '',
              nodeName: '',
              prevAssigneeName: '',
              processCreateName: '',
              processCreateTimeEnd: '',
              processCreateTimeStart: '',
              taskName: ''
            }
        },
        tableData: {},
        tableSeleList: [],
        offsetHeight: 500,
        total: {}
      };
    },
    mounted() {
      console.log(this.configPage);
      this.$nextTick(() => {
        this.offsetHeight = parseInt((this.$refs.tableContent.offsetHeight) - 10, 0);
      });
    },
    watch: {
        'searchData.getTaskUndo': {
            handler(value) {
              this._getTableDataList('getTaskUndo');
            },
            deep: true
        },
        'searchData.getTaskUnRead': {
            handler(value) {
                this._getTableDataList('getTaskUnRead');
            },
            deep: true
        },
        'searchData.getTaskDone': {
            handler(value) {
                this._getTableDataList('getTaskDone');
            },
            deep: true
        },
        'searchData.getTaskRead': {
            handler(value) {
                this._getTableDataList('getTaskRead');
            },
            deep: true
        },
        'searchData.getTaskApply': {
            handler(value) {
                this._getTableDataList('getTaskApply');
            },
            deep: true
        },
        pageSize() {
          this._getTableDataList(this.page);
        }
    },
    created() {
      this._getTableDataList('getTaskUndo');
    },
    methods: {
      // 分页
      getPages(obj) {
        if (obj.isSzieChange) {
          this.pageSize = obj.pageSize;
        } else {
          this.pageNo = obj.pageNo;
        }
        this._getTableDataList(this.page);
      },
      // 查看任务
      handleSetNewsType(item, index) {
        this.pageIndex = 1;
        this.page = item.fun;
        if (item.fun === 'getTaskApply') {
          this.configPage.searchConfigForm.formList[2].inputStatus = 'hide';
          this.configPage.searchConfigForm.formList[3].inputStatus = 'hide';
          this.configPage.searchConfigForm.formList[4].inputStatus = 'edit';
        } else {
          this.configPage.searchConfigForm.formList[2].inputStatus = 'edit';
          this.configPage.searchConfigForm.formList[3].inputStatus = 'edit';
          this.configPage.searchConfigForm.formList[4].inputStatus = 'hide';
        }
        this.$refs.Page.setCurrentPage();
        this.currentIndex = index;
      },
      // 获取表单
      _getTableDataList(page) {
        this.loading = true;
        const data = {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            ...this.searchData[this.page]
        };
        this.$store.dispatch(`task/${page}`, data).then(res => {
          if (res.status === 0) {
            this.tableData[page] = res.results.records;
            this.total[page] = res.results.total;
          } else {
            this.$message.error(res.errorMessage);
          }
          this.loading = false;
        }).catch(e => {
          this.loading = false;
        });
      },
      // 子表糙苏按钮
      emitButtonFnName(btnParameter) {
        if (btnParameter.fn) {
            this[btnParameter.fn]();
        }
      },
      // 子表行操作按钮
      emitQueryTableButtonFnName({ row, btnParameter }) {
        if (btnParameter.fn) {
            this[btnParameter.fn](row);
        }
      },
      // 查看单据
      handleViewDocuments(row) {
        if (!processJump[row.formCode]) {
          this.$message.error('未配置跳转路由');
          return;
        }
        const taskDetailId = this.$base64.encode(row.taskDetailId);
        const type = this.$base64.encode('info');
        // const url = `${processJump[row.formCode].jumpUrl}/${type}/${taskDetailId}/${processJump[row.formCode].translateName}`;
        this.$router.push(`/processApprovalPage/${type}/${taskDetailId}/${processJump[row.formCode].translateName}`);
      },
      // 查看审批记录
      handleViewApprovalRecords(row) {},
      // 委托
      handleEntrust(row) {},
      // 办理
      handleTask(row) {
        if (!processJump[row.formCode]) {
          this.$message.error('未配置跳转路由');
          return;
        }
        const taskDetailId = this.$base64.encode(row.taskDetailId);
        const type = this.$base64.encode('undo');
        // const url = `${processJump[row.formCode].jumpUrl}/${type}/${taskDetailId}/${processJump[row.formCode].translateName}`;
        this.$router.push(`/processApprovalPage/${type}/${taskDetailId}/${processJump[row.formCode].translateName}`);
      },
      // 查阅
      handleConsult(row) {
        if (!processJump[row.formCode]) {
          this.$message.error('未配置跳转路由');
          return;
        }
        const taskDetailId = this.$base64.encode(row.taskDetailId);
        const type = this.$base64.encode('info');
        // const url = `${processJump[row.formCode].jumpUrl}/${type}/${taskDetailId}/${processJump[row.formCode].translateName}`;
        this.$router.push(`/processApprovalPage/${type}/${taskDetailId}/${processJump[row.formCode].translateName}`);
      },
      // 批量委托
      handleBatchDelegation() {},
      // 导出
      handleExport() {}
    }
  };
</script>

<style scoped lang="scss">
.generalPage {
  height: 100%;
  display: flex;
  flex-direction: column;
  .roleCons {
    height: 100%;
    flex: auto;

    .content {
      height: 100%;

      .cons {
        height: 100%;
        display: flex;
        flex-direction: column;

        .search_cons {
          background: white;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
          padding: 10px 10px 0 10px;

          .el-row {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }

          .el-row .el-col {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
        }

        .table_cons {
          flex: 1;
          width: 100%;

          .table_cons_table {
            height: calc(100% - 5px);
            display: flex;
            flex-direction: column;
            margin-top: 5px;
            padding: 10px;
            background-color: #fff;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
            box-sizing: border-box;

            .table_btn {
              text-align: right;
              margin-bottom: 10px;
              height: 40px;
              .btn_tips{
                display: flex;
                justify-content: space-between;
                align-items: baseline;
              }
            }

            .table_content {
              height: calc(100% - 1px);
              // border: 1px solid #EBEEF5;
              border-bottom: none;
              padding-top: 1px;
              box-sizing: border-box;
            }

            .table_pages {
              text-align: right;
              margin: 5px 0;
              height: 32px;
            }
          }
        }
      }
    }
  }
}
  .pages{
    text-align: right;
  }
  .content{
    position: relative;
    display: flex;
  }
  .leftCons {
    width: 200px;
    height: 100%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background: white;
    ul {
      width: 100%;
      height: 100%;
      .navigation{
        padding: 0 10px 0 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      li {
        height: 50px;
        cursor: pointer;
        line-height: 50px;
        font-size: 14px;
        padding: 0 10px 0 20px;
        &.active {
          background: #2b74ec;
          color: white;
        }
        span {
          font-size: 14px;
          text-align: center;
          height: 20px;
          width: 35px;
          line-height: 20px;
          display: inline-block;
          color: #ffffff;
          background: red;
          border-radius: 10px;
        }
      }
    }
  }
  .rightCons{
    flex: 1;
    min-height: 500px;
    width: calc(100% - 200px);
    background: white;
    position: relative;
    margin: 10px;
    box-sizing: border-box;
  }
</style>


