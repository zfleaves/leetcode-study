<template>
  <div class="organizationUserTable" v-loading="loading">
    <div class="roleCons-row">
      <div class="roleCons-contents">
        <div class="roleCons-col roleCons-col-left" v-if="!isOrganizationTableShow">
          <div class="cons">
            <partnerInfoTree @currentRow="getCurrentRow" :offsetHeight="choice === 'isRadio' ? !isElTabs ? offsetHeight - 145 : offsetHeight - 25 : offsetHeight - 35"
              :belongCompanyId='belongCompanyId' :isOrganizationTableShow='isOrganizationTableShow' :projectId="projectId">
            </partnerInfoTree>
          </div>
        </div>
        <div class="roleCons-col roleCons-col-right">
          <div class="cons">
            <div class="cons-table">
              <div class="search_cons">
                <el-form label-position="left" :model="searchFrom" label-width="150px" @submit.native.prevent
                  class="demo-ruleForm">
                  <el-row :gutter="24">
                    <el-col :span="16">
                      <el-input v-model.trim="searchFrom.queryParam" @keyup.enter.native="handleSearch" size="small"
                        clearable :placeholder="$t('fConfig.userInfoTips')" style="padding-left:10px;">
                      </el-input>
                    </el-col>
                    <el-col :span="8" style="text-align:right;padding-right:20px;">
                      <el-button class="search" size="small" icon="el-icon-search" plain @click="handleSearch">
                        {{$t('button.search')}}
                      </el-button>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <div class="contents">
                <div class="contents-table" ref="consTable">
                  <div class="cons-head" v-if="choice === 'isRadio'">
                    <div>
                      {{$t('fConfig.selectUser')}}:<span v-if="configUserSele.tableData.length"
                        style="margin-left:8px;">{{configUserSele.tableData[0].userName}}</span>
                    </div>
                    <div>
                      <el-button size="small" type="primary" icon="el-icon-circle-check" v-if="determineShow" @click="getCheckUser"
                        v-fast-click>{{$t('button.determine')}}
                      </el-button>
                    </div>
                  </div>
                  <div class="userCons">
                    <g-query-table ref="queryTable" v-on="$listeners" :config="configUser" @rowClick='getUserRowClick'>
                    </g-query-table>
                    <div class="pages">
                      <g-to-page ref="Page" :page-size="pageSize" :total="total" @sentPages="getPages">
                      </g-to-page>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="roleCons-col roleCons-col-right" v-if="choice === 'isCheckbox'">
          <div class="cons">
            <div class="cons-table" ref="consTable">
              <div class="cons-head">
                <div>{{$t('fConfig.selectUser')}}({{configUserSele.tableData.length}})</div>
                <div v-if="!isSee">
                  <el-button size="small" type="primary"  icon="el-icon-magic-stick" class="other" :disabled="configUserSele.tableData.length===0"
                    v-fast-click @click="clear">{{$t('button.clear')}}
                  </el-button>
                  <el-button size="small" type="primary" icon="el-icon-circle-check" v-if="determineShow" @click="getCheckUser" v-fast-click>
                    {{$t('button.determine')}}
                  </el-button>
                </div>
              </div>
              <g-query-table :config="configUserSele" @fnName="setFnName">
              </g-query-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { search } from 'mixins/searchMixins';

export default {
  mixins: [search],
  data () {
    return {
      configUser: {
        deleteObj: {},
        // 表格数据
        tableData: [],
        // 表格高度
        maxHeight: 400,
        // 表头操作行配置
        tableHeader: {
          showColumnCtrl: false, // 显示/隐藏列
          refresh: false // 刷新
        },
        // 是否显示分页
        paging: false,
        // 是否默认选中第一行
        defaultSeleFirstLine: false,
        // 子系统表头渲染参数
        tableList: [
          { show: true, prop: 'userName', label: 'fConfig.name', minWidth: 100 },
          { show: true, prop: 'userCode', label: 'fConfig.userCode' },
          { show: true, prop: 'mobile', label: 'fConfig.mobile' }
        ]
      },
      configUserSele: {
        // 表格数据
        tableData: [],
        // 表格高度
        maxHeight: 400,
        // 表头操作行配置
        tableHeader: {
          showColumnCtrl: false, // 显示/隐藏列
          refresh: false // 刷新
        },
        // 是否显示分页
        paging: false,
        // 是否默认选中第一行
        defaultSeleFirstLine: false,
        // 子系统表头渲染参数
        tableList: [
          { show: true, prop: 'userName', label: 'dialog.workerName' },
          { show: true, prop: 'userCode', label: 'fConfig.userCode' },
          {
            show: true, formType: 'operate', label: 'fConfig.operate', width: '60px', center: true,
            buts:
              [
                { name: '', fn: 'handleDelete', disabled: false, class: 'danger el-icon-delete', noAuth: true }
              ]
          }
        ]
      },
      currentOrg: {},
      tableData: [],
      tableDataCheck: [],
      checkList: [],
      offsetHeight: 500,
      pageSize: 10,
      total: 0,
      pageNo: 1,
      deleteObj: null,
      searchFrom: {
        queryParam: ''
      },
      loading: false,
      checkUserList: [],
      selectDialogList: [],
      isOrganizationTableShow: false,
      belongOrgCompanyId: ''
    };
  },
  props: {
    dialogHeight: {
      default: 0,
      type: Number
    },
    isSee: {
      type: Boolean,
      default: false
    },
    determineShow: {
      type: Boolean,
      default: true // 确认按钮默认显示
    },
    choice: {
      default: 'isRadio' // isRadio 单选 isCheckbox 多选
    },
    selectedUsers: {
      default: '' // 选中的用户
    },
    // 是否带出员工账户登记
    isAccountInfo: {
      type: Boolean,
      default: false
    },
    // 节点选人模式
    isBelongCompanyChangeAssignee: {
      type: Number,
      default: null
    },
    belongCompanyId: {
      type: Number,
      default: null
    },
    // 同时选组织机构人员和承包商
    isElTabs: {
      type: Boolean,
      default: false
    },
    projectId: {
      type: Number,
      default: null
    }
  },
  async created () {
    if (this.isSee) {
      this.configUserSele.tableList = [
        { show: true, prop: 'userName', label: 'dialog.workerName' }
      ];
      this.configUser.isCheckbox = false;
    }
    this.configUser.isRadio = false;
    this.belongOrgCompanyId = this.belongCompanyId;
    this.isOrganizationTableShow = Number(this.isBelongCompanyChangeAssignee) === 3;
    if (this.isOrganizationTableShow) {
      this._getTableDataList();
      this.getSelectUser();
    }
  },
  components: {
    partnerInfoTree (resolve) {
      require(['views/resourceAllocation/systemConfig/partnerManagement/components/partnerInfoTree.vue'], resolve);
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.offsetHeight = parseInt((document.body.clientHeight * 0.6), 0);
      this.offsetHeight = this.dialogHeight || this.offsetHeight;
      this.configUserSele.maxHeight = this.offsetHeight;
      this.configUserSele.height = this.offsetHeight;
      if (this.choice === 'isRadio') {
        this.configUser.maxHeight = this.offsetHeight - `${!this.isElTabs ? 220 : 106}`;
        this.configUser.height = this.offsetHeight - `${!this.isElTabs ? 220 : 106}`;
      } else {
        this.configUser.maxHeight = this.offsetHeight - 50;
        this.configUser.height = this.offsetHeight - 50;
      }
      console.log(this.offsetHeight, this.configUser.maxHeight, 'this.configUser.maxHeight');
    });
  },
  watch: {
    checkList: {
      handler () {
        let data = [];
        if (this.choice === 'isRadio') {
          data = this.checkList;
          this.getUserSele(data);
        } else {
          data = this.checkList.concat(this.checkUserList);
          for (const item of data) {
            const index = this.selectDialogList.findIndex(val => val.id === item.id);
            item.sort = index >= 0 ? this.selectDialogList[index].sort : 0;
          }
          this.getUserSele(data.sort(this.compare));
        }
      },
      deep: true
    },
    isBelongCompanyChangeAssignee: {
      handler () {
        this.isOrganizationTableShow = Number(this.isBelongCompanyChangeAssignee) === 3;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 清空所选
    clear () {
      if (this.configUserSele.tableData.length === 0) return;
      // 已有的删除
      this.$confirm(this.$t('tips.deleteData'), this.$t('tips.clearData'), {
        cancelButtonClass: 'button-close',
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      }).then(() => {
        this.configUserSele.tableData = [];
      }).catch(() => {
      });
    },
    getUserRowClick (row) {
      if (this.choice === 'isRadio') {
        this.configUserSele.tableData = [row];
        return;
      }
      if (this.configUserSele.tableData.some(v => v.id === row.id)) return;
      this.$set(row, 'userDataSource', 'supplier');
      this.configUserSele.tableData.push(row);
    },
    // 获取勾选数据
    getUserSele (arr) {
      const list = [];
      for (const item of arr) {
        if (!list.some(v => v.id === item.id)) {
          list.push(item);
        }
      }
      this.configUserSele.tableData = list;
      this.configUser.selectedList = list;
    },
    // 排序 比较大小
    compare (obj1, obj2) {
      const val1 = obj1.sort;
      const val2 = obj2.sort;
      if (val1 < val2) {
        return 1;
      } else if (val1 > val2) {
        return -1;
      } else {
        return 0;
      }
    },
    // 获取组织机构点击
    async getCurrentRow (row) {
      this.currentOrg = this.$clone(row);
      this.pageNo = 1;
      if (this.selectedUsers.length === 0) {
        await this._getTableDataList();
      } else {
        if (this.selectDialogList.length) {
          await this._getTableDataList();
        } else {
          await this.getSelectUser();
          await this._getTableDataList();
        }
      }
    },
    async getSelectUser () {
      let selectedUsers = [];
      this.checkUserList = [];
      this.selectDialogList = [];
      this.configUserSele.tableData = [];
      this.configUser.selectedList = [];
      if (this.selectedUsers && (typeof this.selectedUsers === 'number' || typeof this.selectedUsers === 'string')) {
        if (this.selectedUsers.length) {
          this.selectedUsers.split(',').forEach(item => {
            selectedUsers.push({ id: item });
          });
        } else {
          selectedUsers = [{ id: this.selectedUsers }];
        }
      } else {
        selectedUsers = this.selectedUsers;
      }
      const userIds = (selectedUsers || []).map(v => v.id);
      let selectList = [];
      if (!userIds.length) return;
      await this.$store.dispatch('publicApi/getPartybAccountUsersList', userIds).then(res => {
        selectList = res.results;
        selectList.forEach((item, index) => {
          item.sort = selectList.length - index;
        });
        this.checkUserList = this.$clone(selectList);
        this.selectDialogList = selectList;
        this.getUserSele(selectList);
        // this.configUserSele.tableData = selectList;
      });
    },
    // 获取该组织机构下的员工
    async _getTableDataList () {
      this.loading = true;
      const data = {
        partyBId: this.isOrganizationTableShow ? this.belongOrgCompanyId : this.currentOrg ? this.currentOrg.id : 0,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        queryParam: this.searchFrom.queryParam,
        projectId: this.projectId
      };
      await this.$store.dispatch('publicApi/getPartybUserList', data).then(res => {
        this.configUser.tableData = res.results.records;
        this.total = res.results.total;
        this.configUser.selectedList = this.$clone(this.configUserSele.tableData);
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
    // 根据函数名调用函数
    setFnName ({ btnParameter, row }) {
      this[btnParameter.fn](row);
    },
    // 获取已选择人员 并且关闭弹出框
    async getCheckUser () {
      if (this.configUserSele.tableData && this.configUserSele.tableData.length > 0) {
        this.configUserSele.tableData.forEach(item => {
          this.$set(item, 'userDataSource', 'supplier');
        });
      }
      this.$emit('update:isShow', false);
      this.$emit('update:userList', this.configUserSele.tableData);
      this.$emit('selectUser', this.configUserSele.tableData);
      this.$emit('getUserList', this.configUserSele.tableData);
    },
    // 删除已选中人员
    handleDelete (row) {
      this.configUserSele.tableData.splice(this.configUserSele.tableData.indexOf(row), 1);
    },
    // 重置
    emptyForm () {
      this.searchFrom.queryParam = '';
      this.handleSearch();
    },
    // 搜索
    handleSearch () {
      this.$refs.Page.setCurrentPage();
    }
  }
};
</script>
<style lang="scss" scoped>
.organizationUserTable {
  width: 100%;
  height: 100%;
  .roleCons-row {
    height: 100%;
    flex: auto;
    display: flex;
    flex-direction: column;
    .roleCons-contents {
      height: 100%;
      flex: auto;
      padding: 10px;
      display: flex;
      .roleCons-col-left {
        flex: 7;
        max-width: 450px;
      }
      .roleCons-col-right {
        flex: 8;
        margin-left: 10px;
      }
      .roleCons-col {
        height: 100%;
        padding: 10px;
        overflow: hidden;
        // flex: auto;
        display: flex;
        border: 1px solid #ebeef5;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        background-color: #fff;
        box-sizing: border-box;
        .cons {
          width: 100%;
          height: 100%;
          .cons-table {
            height: 100%;
            width: 100%;
            .contents {
              height: calc(100% - 55px);
              width: 100%;
              padding-top: 5px;
              .contents-table {
                height: 100%;
                background: white;
                // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
                padding: 10px;
                .pages {
                  text-align: center;
                  margin: 5px 0;
                }
              }
            }
            .cons-head {
              height: 43px;
              padding-bottom: 10px;
              margin-bottom: 10px;
              border-bottom: 1px solid #eeeeee;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .top {
              height: 42px;
              ul {
                height: 100%;
                width: 200px;
                display: flex;
                border: 1px solid rgb(232, 234, 239);
                border-bottom: 0;
                list-style: none;
                li {
                  flex: 1;
                  height: 100%;
                  list-style: none;
                  background: white;
                  line-height: 42px;
                  text-align: center;
                  color: #999999;
                  cursor: pointer;
                  border-bottom: 1px solid rgb(232, 234, 239);
                  &:first-child {
                    border-right: 1px solid rgb(232, 234, 239);
                  }
                  &.active {
                    color: #333333;
                    float: left;
                    background: rgb(245, 247, 250);
                    border-bottom: 1px solid rgb(245, 247, 250);
                  }
                }
              }
            }
            .userCons {
              width: 100%;
            }
          }
        }
      }
    }
  }
  .check-user {
    display: flex;
  }
  .search_cons_btn1 {
    text-align: right;
    padding-right: 20px !important;
    // margin: 0 20px 0 0 !important;
  }
}
</style>
