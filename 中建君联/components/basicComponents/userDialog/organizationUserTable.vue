<template>
  <div class="organizationUserTable" v-loading="loading">
    <div class="roleCons-row">
      <div class="roleCons-contents">
        <div class="roleCons-col roleCons-col-left">
          <div class="cons">
            <organizationTable @currentRow="getCurrentRow" :offsetHeight="offsetHeight + Number(`${!isElTabs ? 38 : 48 }`)"
              :belongCompanyId='belongCompanyId' :isOrganizationTableShow='isOrganizationTableShow'>
            </organizationTable>
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
                      <!-- 用户信息 -->
                      <!-- :label="$t('fConfig.userInfo')" -->
                      <!-- <el-form-item prop="userName">
                        <el-input v-model.trim="searchFrom.loginName" @keyup.enter.native="handleSearch" size="small"
                          clearable :placeholder="$t('fConfig.userInfoTips')">
                        </el-input>
                      </el-form-item> -->
                      <el-input v-model.trim="searchFrom.loginName" @keyup.enter.native="handleSearch" size="small"
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
                  <div class="top">
                    <ul>
                      <li :class="currentIndex===index ? 'active' : ''" @click="handleChangSelMethod(index)"
                        v-for="(item,index) in selectTabList" :key="index">{{item}}
                      </li>
                    </ul>
                  </div>
                  <div class="userCons">
                    <div class="userList" v-show="currentIndex === 0">
                      <g-query-table ref="queryTable" v-on="$listeners" :config="configUser"
                        @rowClick='getUserRowClick'>
                      </g-query-table>
                      <div class="pages">
                        <g-to-page ref="Page" :page-size="pageSize" :total="total" @sentPages="getPages">
                        </g-to-page>
                      </div>
                    </div>
                    <div class="recentlyAdded" v-show="currentIndex === 1">
                      <g-query-table ref="queryTable" v-on="$listeners" :config="recentlyUser"
                        @rowClick='getUserRowClick'>
                      </g-query-table>
                      <div class="pages">
                        <g-to-page ref="recentlyPage" :page-size="recentlyPageSize" :total="recentlyTotal"
                          @sentPages="getRecentlyPages">
                        </g-to-page>
                      </div>
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
                  <el-button size="small" type="primary" icon="el-icon-magic-stick" class="other" :disabled="configUserSele.tableData.length===0"
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
          { show: true, prop: 'orgName', label: 'dialog.organizationName' },
          { show: true, prop: 'userName', label: 'dialog.workerName', minWidth: 100 },
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
        loginName: ''
      },
      loading: false,
      checkUserList: [],
      selectDialogList: [],
      selectTabList: [this.$t('dialog.userList'), this.$t('dialog.recentlyAdded')],
      currentIndex: 0,
      // 常用联系人
      recentlyUser: {
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
      recentlyPageSize: 10,
      recentlyTotal: 0,
      recentlyPageNo: 1,
      recordCancelUserList: [],
      isOrganizationTableShow: false,
      belongOrgCompanyId: ''
    };
  },
  props: {
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
    }
  },
  async created () {
    // this.configUser[this.choice] = true;
    // this.recentlyUser[this.choice] = true;
    if (this.isSee) {
      this.configUserSele.tableList = [
        { show: true, prop: 'orgName', label: 'dialog.organizationName' },
        { show: true, prop: 'userName', label: 'dialog.workerName' }
      ];
      this.configUser.isCheckbox = false;
    }
    this.configUser.isRadio = false;
    this.recentlyUser.isRadio = false;
    this.belongOrgCompanyId = this.belongCompanyId;
    this.isOrganizationTableShow = Number(this.isBelongCompanyChangeAssignee) === 3;
    if (this.isOrganizationTableShow) {
      if (!this.belongCompanyId) {
        const dataInfo = localStorage.getItem('dataInfo') ? JSON.parse(localStorage.getItem('dataInfo')) : {};
        const params = {
          projectStatus: [1, 2, 3],
          projectName: dataInfo.projectName
        };
        await this.$store.dispatch('publicApi/getProjectV1PermissionList', params).then(res => {
          if (res.status === 0) {
            this.belongOrgCompanyId = res.results.length > 0 ? res.results[0].orgId : '';
          }
        });
      }
      this._getTableDataList();
      this.getRecentlyUser();
    }
  },
  components: {
    organizationTable (resolve) {
      require(['./organizationTable.vue'], resolve);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.offsetHeight = parseInt((document.body.clientHeight * 0.6), 0);
      this.configUserSele.maxHeight = this.offsetHeight - 30;
      this.configUserSele.height = this.offsetHeight - 30;
      if (this.choice === 'isRadio') {
        this.configUser.maxHeight = this.offsetHeight - 170;
        this.configUser.height = this.offsetHeight - 170;
        this.recentlyUser.maxHeight = this.offsetHeight - 170;
        this.recentlyUser.height = this.offsetHeight - 170;
      } else {
        this.configUser.maxHeight = this.offsetHeight - 80 - 42;
        this.configUser.height = this.offsetHeight - 80 - 42;
        this.recentlyUser.maxHeight = this.offsetHeight - 80 - 42;
        this.recentlyUser.height = this.offsetHeight - 80 - 42;
      }
    });
  },
  watch: {
    checkList: {
      handler () {
        let data = [];
        if (this.choice === 'isRadio') {
          data = this.checkList;
          // this.configUserSele.tableData = data;
          // this.configUser.selectedList = data;
          this.recordCancelUserList = data;
          this.getUserSele(data);
        } else {
          data = this.checkList.concat(this.checkUserList);
          for (const item of data) {
            const index = this.selectDialogList.findIndex(val => val.id === item.id);
            item.sort = index >= 0 ? this.selectDialogList[index].sort : 0;
          }
          // this.configUserSele.tableData = data.sort(this.compare);
          // this.configUser.selectedList = data.sort(this.compare);
          this.recordCancelUserList = this.recordCancelUserList.concat(this.checkList);
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
      console.log(row, 'row');
      if (this.choice === 'isRadio') {
        this.configUserSele.tableData = [row];
        return;
      }
      // this.checkList.push(row);
      if (this.configUserSele.tableData.some(v => v.id === row.id)) return;
      row.userDataSource = 'customer';
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
    handleChangSelMethod (index) {
      this.currentIndex = index;
      this.searchFrom.loginName = '';
      this.handleSearch();
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
        await this.getRecentlyUser();
      } else {
        if (this.selectDialogList.length) {
          await this._getTableDataList();
          await this.getRecentlyUser();
        } else {
          await this.getSelectUser();
          await this._getTableDataList();
          await this.getRecentlyUser();
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
      const userIds = selectedUsers.map(v => v.id);
      let selectList = [];
      await this.$store.dispatch('publicApi/getUserInfosListPublic', userIds).then(res => {
        selectList = res.results;
        selectList.forEach((item, index) => {
          item.id = item.userId;
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
        orgId: this.isOrganizationTableShow ? this.belongOrgCompanyId : this.currentOrg.id,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        loginName: this.searchFrom.loginName
      };
      await this.$store.dispatch('publicApi/getUserList', data).then(res => {
        res.results.records.forEach(item => {
          // if (this.checkUserList.length) {
          //   const index = this.checkUserList.findIndex(v => v.id === item.id);
          //   if (index >= 0) {
          //     this.checkUserList.splice(index, 1);
          //   }
          // }
        });
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
    // 获取常用联系人
    getRecentlyUser () {
      this.loading = true;
      const data = {
        orgId: this.isOrganizationTableShow ? this.belongOrgCompanyId : this.currentOrg.id,
        pageNo: this.recentlyPageNo,
        pageSize: this.recentlyPageSize,
        loginName: this.searchFrom.loginName
      };
      this.$store.dispatch('publicApi/getRecentUsersList', data).then(res => {
        res.results.records.forEach(item => {
          if (this.checkUserList.length) {
            const index = this.checkUserList.findIndex(v => v.id === item.id);
            if (index >= 0) {
              this.checkUserList.splice(index, 1);
            }
          }
        });
        this.recentlyUser.tableData = res.results.records;
        this.recentlyTotal = res.results.total;
        this.recentlyUser.selectedList = this.$clone(this.configUserSele.tableData);
        this.loading = false;
      });
    },
    // 分页
    getRecentlyPages (obj) {
      if (obj.isSzieChange) {
        this.recentlyPageSize = obj.pageSize;
      } else {
        this.recentlyPageNo = obj.pageNo;
      }
      this.getRecentlyUser();
    },
    // 根据函数名调用函数
    setFnName ({ btnParameter, row }) {
      this[btnParameter.fn](row);
    },
    // 获取已选择人员 并且关闭弹出框
    async getCheckUser () {
      if (this.configUserSele.tableData && this.configUserSele.tableData.length > 0) {
        this.configUserSele.tableData.forEach(item => {
          this.$set(item, 'userDataSource', 'customer');
        });
      }
      if (this.isAccountInfo && this.choice === 'isRadio' && this.configUserSele.tableData.length !== 0) {
        await this.$store.dispatch('publicApi/getPersonnelAccountListPublicApi', { personnelUserId: this.configUserSele.tableData[0].id }).then(res => {
          if (res.results && res.results.length) {
            this.$set(this.configUserSele.tableData[0], 'cardNumber', res.results[0].cardNumber);
            this.$set(this.configUserSele.tableData[0], 'openAccountBank', res.results[0].openAccountBank);
          }
        });
      }
      this.$emit('update:isShow', false);
      if (this.configUserSele.tableData.length) {
        const contactUserIds = this.configUserSele.tableData.map(v => v.id);
        this.$store.dispatch('publicApi/setProcessRoleList', contactUserIds).then(res => {
        });
      }
      this.$emit('update:userList', this.configUserSele.tableData);
      this.$emit('selectUser', this.configUserSele.tableData);

      this.$emit('getUserList', this.configUserSele.tableData);
      this.$emit('recordCancelUser', this.recordCancelUserList);
    },
    // 删除已选中人员
    handleDelete (row) {
      this.recordCancelUserList.push(row);
      this.configUserSele.tableData.splice(this.configUserSele.tableData.indexOf(row), 1);
    },
    // 重置
    emptyForm () {
      this.searchFrom.loginName = '';
      this.handleSearch();
    },
    // 搜索
    handleSearch () {
      if (this.$refs.Page && this.currentIndex === 0) {
        this.$refs.Page.setCurrentPage();
      }
      if (this.$refs.recentlyPage && this.currentIndex === 1) {
        this.$refs.recentlyPage.setCurrentPage();
      }
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
        flex: 3;
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
