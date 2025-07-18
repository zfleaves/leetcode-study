
<template>
  <div style="height: 100%;">
    <query-page
        :page-config="pageConfig"
        :loading.sync="loading"
        :dialogHeight="dialogHeight"
        :tableSeleList.sync="tableSeleList"
        @searchData="getSearchData"
        @dialogEvent="dialogEvent"
        @fnName="pageConfigBtnFnName"
        @resetTableConfigList="pageConfigResetTableConfigList"
        @onRefresh="pageConfigOnRefresh"
        @pages="pageConfigPages">
        <template slot="search" slot-scope="{configForm, searchFormValue}">
            <g-search-form :configForm="configForm"
                          @searchEvent='searchEvent'
                          :searchFormValue="searchFormValue">
                <template slot="form-orgName" slot-scope="{searchFormValue, item}">
                  <div  class="slot-input">
                    <el-input
                        v-model.trim="searchFormValue[item.prop]"
                        :size="item.size || 'small'"
                        clearable readonly>
                        <template slot="suffix">
                            <i v-if="searchFormValue[item.prop]" class="slot-close el-icon-circle-close" @click="handleSingleClear(searchFormValue, item.prop)"></i>
                            <i class="multiple-choice-icon iconfont icon-menu" @click="handleSingleChoice(searchFormValue[item.prop], item)"></i>
                        </template>
                    </el-input>
                  </div>
                </template>
            </g-search-form>
        </template>
        <template slot="mainTable" slot-scope="config">
          <g-query-table
            :config="config.scope"
            ref="queryTable"
            :tableList.sync="tableSeleList"
            @fnName="pageConfigEmitQueryTableButtonFnName">
          </g-query-table>
        </template>
    </query-page>

    <!-- 选择所属公司 -->
    <el-dialog
        :title="$t('dialog.orgName')"
        :visible.sync="dialogVisible"
        append-to-body
        top="50px" center width="40%">
        <selectOrg v-if="dialogVisible" :close.sync="dialogVisible" :isRadio='true'
          @getData='getSelectData' :isShowDepartName='false'
          :selectOrgId="pageConfig.searchControls.searchData.orgId || 0">
        </selectOrg>
    </el-dialog>

  </div>
</template>

<script>
  import Page from './config.js';
  import {search} from 'mixins/searchMixins';
  import Auth from 'util/auth';

  export default {
    name: 'projectDialog',
    mixins: [search],
    components: {
      selectOrg(resolve) {
        require(['components/basicComponents/userDialog/selectOrg'], resolve);
      }
    },
    data () {
      return {
        // 查询页面基础参数
        page: new Page(),
        pageConfig: {},
        loading: false,
        // =====================
        tableSeleList: [],
        partyATypeTitle: '',
        dialogVisible: false,
        // 搜索数据
        searchData: {
          beginDateFrom: '',
          beginDateTo: '',
          belongCompanyId: '',
          belongCompanyIds: [],
          belongCompanyName: '',
          docNo: '',
          projectCode: '',
          projectIds: [],
          projectName: '',
          projectStatus: [1, 2, 3]
        },
        authButtonList: [],
        checkList: [],
        checkId: ''
      };
    },
    async created () {
      this.authButtonList = this.$route.meta.authButtonList && this.$route.meta.authButtonList.map(v => v.resUrl);
      if (this.isCheckbox) {
        this.pageConfig.mainTable.isCheckbox = this.isCheckbox;
        this.pageConfig.mainTable.isRadio = false;
      } else {
        this.pageConfig.mainTable.isCheckbox = this.isCheckbox;
        this.pageConfig.mainTable.isRadio = true;
      }
      // console.log(this.isEdit);
      if (!this.isEdit && this.isCheckbox) { // 不显示操作按钮
        this.pageConfig.isFooterShow = false;
      } else {
        this.pageConfig.isFooterShow = true;
      }
      this.checkList = JSON.parse(JSON.stringify(this.selectedList));
      this.checkId = this.projectId;
      await this._getTableDataList();
    },
    mounted() {
      // if (this.projectId > 0) {
      //   this.pageConfig.mainTable.selectedList = [{id: this.projectId}];
      // } else {
      //   this.pageConfig.mainTable.selectedList = this.selectedList;
      // }
    },
    props: {
      selectedList: {
        type: Array,
        default: () => []
      },
      dialogHeight: {
        type: Number,
        default: 300
      },
      projectId: {
        type: Number,
        default: 0
      },
      isCheckbox: {
        type: Boolean,
        default: false
      },
      isEdit: {
        type: Boolean,
        default: true
      },
      isNoAutn: {
       type: Boolean,
       default: false
      },
      sourceUrl: {
        type: String,
        default: 'proProject/getProjectPermissionPage'
      }
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.loading = true;
        const data = {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            ...this.pageConfig.searchControls.searchData
        };
        const url = this.sourceUrl ? this.sourceUrl : this.isNoAutn ? 'publicApi/getProjectAllPublicApi' : 'publicApi/getProjectPermissionPage';

        if (this.isNoAutn) {
          data.projectStatus = [1, 2, 3]; // 查询已启用且未竣工的项目
        }
        this.$store.dispatch(url, data).then(res => {
          if (res.status === 0) {
            for (const item of res.results.records) {
              this.$set(item, 'code', item.projectCode);
            }
            this.pageConfig.mainTable.tableData = res.results.records;
            this.pageConfig.mainTable.total = res.results.total;
            if (this.projectId > 0) {
              this.pageConfig.mainTable.selectedList = [{id: this.checkId}];
              if (this.pageConfig.mainTable.tableData.some(v => v.id === this.checkId)) {
                this.checkId = '';
              }
            } else {
              this.pageConfig.mainTable.selectedList = [];
              for (const item of res.results.records) {
                const index = this.checkList.findIndex(v => v.id === item.id);
                if (index >= 0) {
                  this.checkList.splice(index, 1);
                  this.pageConfig.mainTable.selectedList.push(item);
                }
              }
            }
          } else {
            this.$message.error(this.$t(`exception.${res.errorCode}`));
          }
          this.loading = false;
        }).catch(e => {
          this.loading = false;
        });
      },
      // 选择分类
      handleSingleChoice() {
        this.dialogVisible = true;
      },
      // 获取所属公司数据
      getSelectData(arr) {
        this.$set(this.pageConfig.searchControls.searchData, 'orgId', arr.length > 0 ? arr[0].id : '');
        this.$set(this.pageConfig.searchControls.searchData, 'orgName', arr.length > 0 ? arr[0].orgName : '');
        this.dialogVisible = false;
        this._getTableDataList();
      },
      // 清空选择
      handleSingleClear(searchForm, prop) {
        this.pageConfig.searchControls.searchData.orgName = '';
        this.pageConfig.searchControls.searchData.orgId = '';
        this._getTableDataList();
      },
      dialogEvent(event) {
        if (event === 'close') {
          this.$emit('update:close', false);
        } else {
          if (this.projectId > 0) {
            if (this.tableSeleList.length) {
              this.$emit('getProject', this.tableSeleList);
            } else if (this.checkId && this.tableSeleList.length === 0) {
              this.$emit('update:close', false);
            }
          } else {
            this.$emit('getProject', this.tableSeleList.concat(this.checkList));
          }
        }
      }
    }
  };
</script>

<style scoped lang="scss">
</style>

