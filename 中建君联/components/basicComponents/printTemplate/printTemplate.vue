<template>
  <div>
    <query-page :page-config="pageConfig" :loading.sync="loading" @searchData="getSearchData"
      @fnName="pageConfigBtnFnName" @resetTableConfigList="pageConfigResetTableConfigList"
      @onRefresh="pageConfigOnRefresh" @pages="pageConfigPages" @searchEvent="searchEvent">
      <template slot="mainTable" slot-scope="config">
        <g-query-table :config="config.scope" :tableList.sync="tableSeleList"
          @fnName="pageConfigEmitQueryTableButtonFnName">
          <template slot="table-valid" slot-scope="{row}">
            <div class="valid" :class="'valid'+row.valid">
              {{row.valid === 1 ? $t('button.disable') : $t('button.enable')}}
            </div>
          </template>
          <template slot="table-buts-suffix" slot-scope="{scope}">
            <el-button v-if="authButtonList.indexOf('disableOrEnable') >= 0"
              @click.stop.prevent="handleEnableDisable(scope.row)" type="text" size="mini"
              :class="scope.row.valid === 0 && 'warning'">
              {{
                      scope.row.valid === 0 ? $t('button.disable') : $t('button.enable')
                    }}
            </el-button>
          </template>
        </g-query-table>
      </template>
    </query-page>
    <!-- 使用帮助 -->
    <g-dialog v-if="dialogInstructionsForUse" :dialogConfig="dialogConfigInstructionsForUse"
      :isVisible.sync="dialogInstructionsForUse">
      <div slot="body" class="instructionsForUse">
        <!-- 1，打印模板是支持需要打印纸质资料进行存档的模板管理工作。
              2，您可以根据实际打印需要的字段进行配置，以输出您需要的关键信息。 -->
        <p>1，{{$t('print.instructionsForUseTips1')}}</p>
        <p>2，{{$t('print.instructionsForUseTips2')}}</p>
      </div>
    </g-dialog>
    <!--添加弹窗-->
    <el-dialog v-dialogDrag :visible.sync="printShow" v-if="printShow"
      :title="isEdit ? $t('button.edit') : $t('print.setPrintTemplate')" center top="10%" width="50%">
      <el-form :model="printForm" :rules="rules" status-icon class="demo-ruleForm dialog-form" ref="printForm">
        <!-- 功能名称 -->
        <el-form-item v-if="!isEdit" :label="$t('print.functionName')" prop="printModelCode" label-width="100px">
          <el-select v-model.trim="printForm.printModelCode" size="small" clearable :filterable="true"
            @change="changePrintModel" style="width: 100%">
            <el-option v-for="(child, i) in printModelList" :key="i" :label="child.printModelName"
              :value="child.printModelCode">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 模板名称 -->
        <el-form-item :label="$t('print.printModelName')" prop="printModelName" label-width="100px">
          <el-input v-model="printForm.printModelName" maxlength="64">
          </el-input>
        </el-form-item>
        <!-- 所属组织机构 -->
        <el-form-item :label="$t('fConfig.belongCompanyName')" prop="organizations"
          :title="$t('fConfig.belongCompanyName')" label-width="100px">
          <multiple-choice :selectConfig="selectCompanyConfig" :isDisabled="true" @select="handleSelectCompany"
            @tagDelete="handleDeleteCompany"></multiple-choice>
        </el-form-item>
        <!-- 同级排序 -->
        <el-form-item v-if="!isEdit" :label="$t('fConfig.sorts')" prop='sort' :title="$t('fConfig.sorts')"
          label-width="100px">
          <el-input v-model.trim='printForm.sort' type='number' size='small' :min='0' :max='1000' clearable>
          </el-input>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item v-if="!isEdit" :label="$t('fConfig.remarks')" prop='remarks' :title="$t('fConfig.remarks')"
          label-width="100px">
          <el-input type='textarea' v-model.trim='printForm.remarks' size='small' clearable show-word-limit
            maxlength='255' :autosize='{ minRows: 3, maxRows: 5}'>
          </el-input>
        </el-form-item>
        <div style="text-align: center">
          <el-button icon="el-icon-circle-check" type="primary" class="urgent" size="small"
            @click.native.prevent="() => printShow = false">{{$t('print.close')}}
          </el-button>
          <el-button size="small" icon="el-icon-circle-check" type="primary" :disabled="isDisable"
            @click.native.prevent="submitLoginPass('printForm')">
            <!-- 配置打印模板 -->
            {{isEdit ? $t('button.determine') : $t('print.setPrintTemplate')}}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 选择所属公司 -->
    <g-dialog v-if="dialogCompany" :dialogConfig="companyDialogConfig" :isVisible.sync="dialogCompany">
      <selectOrg slot="body" slot-scope="{height}" :dialogHeight="height" v-if="dialogCompany" :isCheckBox="true"
        :isShowDepartName="false" :selectOrgList="selectOrgList" :close.sync="dialogCompany" @getData="getCompany">
      </selectOrg>
    </g-dialog>
  </div>
</template>

<script>
import Page from './config.js';
import { search } from 'mixins/searchMixins';
import Auth from 'util/auth';
import printConfigUrl from './pintConfig/printConfigUrl.js';

export default {
  name: 'printTemplate',
  mixins: [search],
  data () {
    const organizationsValid = (rule, value, callback) => {
      if (!this.selectCompanyConfig.tagDada.length) {
        callback(new Error(this.$t('tips.pleaseSelectOrg')));
      } else {
        callback();
      }
    };
    return {
      // 查询页面基础参数
      page: new Page(),
      pageConfig: {},
      loading: false,
      printConfigUrl,
      // =====================
      tableSeleList: [],
      // 合并列
      spanArr: [],
      spanArrAll: {},
      pos: 0,
      spanMethodArr: [2],
      searchData: {
        printModelCode: '',
        printModelName: '',
        remarks: '',
        subSystemCode: this.$utils.config.subSystemCode,
        updateByName: '',
        updateTimeFrom: '',
        updateTimeTo: ''
      },
      // 使用帮助
      dialogInstructionsForUse: false,
      dialogConfigInstructionsForUse: {
        title: this.$t('dialog.instructionsForUse'),
        appendBody: false,
        center: true,
        top: '20vh',
        width: '50%',
        span: '0.3'
      },
      rules: {
        organizations: [{ required: true, validator: organizationsValid, trigger: 'change' }],
        printModelCode: [{ required: true, message: `${this.$t('tips.pleaseSelect')}${this.$t('print.functionName')}`, trigger: 'change' }],
        printModelName: [{ required: true, message: `${this.$t('tips.pleaseEnter')}${this.$t('print.printModelName')}`, trigger: 'blur' }],
        sort: [{ required: true, message: `${this.$t('tips.pleaseEnter')}${this.$t('fConfig.sort')}`, trigger: 'blur' }]
      },
      printForm: {
        printModelCode: '',
        printModelName: '',
        organizations: [],
        subSystemCode: this.$utils.config.subSystemCode,
        subSystemName: '',
        sort: 0,
        remarks: ''
      },
      clonePrintForm: {},
      printShow: false,
      // 所属组织
      selectCompanyConfig: {
        // 显示的列表
        tagDada: [],
        // id
        rowKey: 'belongCompanyId',
        // name
        rowName: 'belongCompanyName',
        // 默认显示的个数
        constNum: 7
      },
      dialogCompany: false,
      selectOrgList: [],
      companyDialogConfig: {
        title: `${this.$t('tips.pleaseSelect')}${this.$t('fConfig.belongCompanyName')}`,
        appendBody: false,
        center: true,
        top: '50px',
        width: '60%',
        span: '0.8'
      },
      isDisable: false,
      printModelList: [],
      isEdit: false
    };
  },
  components: {
    selectOrg (resolve) {
      require(['components/basicComponents/userDialog/selectOrg.vue'], resolve);
    }
  },
  async created () {
    this.clonePrintForm = this.$clone(this.printForm);
    await this._getTableDataList();
    await this.getPrintModelList();
  },
  methods: {
    // 获取表单
    getPrintModelList () {
      this.$store.dispatch('publicApi/getPrintModelList', { subSystemCode: this.$utils.config.subSystemCode }).then(res => {
        if (res.status === 0 && res.results) {
          this.printModelList = res.results;
        } else {
          this.printModelList = [];
        }
      });
    },
    handleInstructionsForUse () {
      this.dialogInstructionsForUse = true;
    },
    // 获取表单
    _getTableDataList () {
      this.loading = true;
      const data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        ...this.pageConfig.searchControls.searchData
      };
      this.$store.dispatch('publicApi/getPrintList', data).then(res => {
        if (res.status === 0) {
          this.pageConfig.mainTable.tableData = res.results.records;
          this.pageConfig.mainTable.total = res.results.total;
        } else {
          this.$message.error(res.errorMessage);
        }
        this.loading = false;
      }).catch(e => {
        this.loading = false;
      });
    },
    // 预览修改模板
    handleViewEditTemplate (row) {
      localStorage.setItem('createPrintInfo', JSON.stringify(row));
      row.printModelCode = row.printModelCode.replace(/(^\s*)|(\s*$)/g, '');
      const formCode = this.$base64.encode(row.printModelCode);
      const taskId = this.$base64.encode('template');
      const id = this.$base64.encode(0);
      const printModelId = this.$base64.encode(row.id);
      const RouteTitleObj = { name: 'printDesign', loadRouteName: this.$route.name, translateType: 'print' };
      const translateName = this.printConfigUrl[row.printModelCode].translateName;
      localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
      this.$router.push(`/printDesign/${formCode}/${taskId}/${id}/${translateName}?printModelId=${printModelId}&flowStatus=${this.$base64.encode('01')}`);
    },
    // 添加
    sysHandleAdd () {
      this.printForm = this.$clone(this.clonePrintForm);
      this.printForm.sort = this.pageConfig.mainTable.total + 2;
      this.isEdit = false;
      this.printShow = true;
    },
    // 修改
    handleEdit (row) {
      this.printForm = this.$clone(row);
      const data = [];
      for (const item of this.printForm.organizations) {
        data.push({ id: item.belongCompanyId });
      }
      this.selectOrgList = data;
      this.selectCompanyConfig.tagDada = this.printForm.organizations;
      this.isEdit = true;
      this.printShow = true;
    },
    // 选项表单后
    changePrintModel () {
      const form = this.printModelList.find(v => v.printModelCode === this.printForm.printModelCode);
      if (form) {
        this.$set(this.printForm, 'printModelName', form.printModelName);
      }
    },
    // 选择所属组织
    handleSelectCompany () {
      const data = [];
      for (const item of this.selectCompanyConfig.tagDada) {
        data.push({ id: item.belongCompanyId });
      }
      this.selectOrgList = data;
      this.dialogCompany = true;
    },
    // 删除所属组织
    handleDeleteCompany (row) {
      const index = this.selectCompanyConfig.tagDada.findIndex(v => v.belongCompanyId === row.belongCompanyId);
      if (index >= 0) {
        this.selectCompanyConfig.tagDada.splice(index, 1);
      }
    },
    // 获取所属组织
    getCompany (arr) {
      const data = [];
      arr.forEach(item => {
        data.push(
          {
            createBy: this.$utils.Auth.hasUserInfo().userId,
            createTime: this.$utils.commonUtil.formatTime(new Date()),
            belongCompanyCode: item.orgCode,
            belongCompanyId: item.id,
            belongCompanyName: item.orgName
          }
        );
      });
      this.selectCompanyConfig.tagDada = data;
      this.dialogCompany = false;
    },
    // 禁用/启用
    handleEnableDisable (row) {
      const statusMsg = row.valid === 0 ? this.$t('button.disable') : this.$t('button.enable');
      const valid = row.valid === 0 ? 1 : 0;
      this.$confirm(`${this.$t('tips.areYouSure')}${statusMsg}${row.printModelName}?`, statusMsg, {
        cancelButtonClass: 'button-close',
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('publicApi/setPrintValid', { printModelId: row.id, valid }).then(res => {
          if (res.status === 0) {
            this.$message.success(`${statusMsg}${this.$t('tips.success')}`);
            this._getTableDataList();
          } else {
            this.$message({
              dangerouslyUseHTMLString: true,
              message: res.results.errorMsg,
              type: 'error'
            });
          }
        });
      }).catch((e) => {
        console.log(e);
      });
    },
    // 更新打印模板及其绑定所属公司信息
    submitLoginPass (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isDisable = true; // 开始可以点击
          if (this.isEdit) {
            const data = {
              printModelName: this.printForm.printModelName,
              id: this.printForm.id,
              belongCompanyIds: this.selectCompanyConfig.tagDada.map(v => v.belongCompanyId)
            };
            this.$store.dispatch('publicApi/updateBelongcompany', data).then(res => {
              if (res.status === 0) {
                this.$message.success(`${this.$t('button.edit')}${this.$t('tips.success')}`);
                this._getTableDataList();
                this.printShow = false;
                this.isDisable = false; // 开始可以点击
              }
            });
          } else {
            this.$set(this.printForm, 'organizations', this.selectCompanyConfig.tagDada);
            localStorage.setItem('createPrintInfo', JSON.stringify(this.printForm));
            const printModelCode = this.printForm.printModelCode.replace(/(^\s*)|(\s*$)/g, '');
            const formCode = this.$base64.encode(printModelCode);
            const taskId = this.$base64.encode('template');
            const id = this.$base64.encode(0);
            const RouteTitleObj = { name: 'printDesign', loadRouteName: this.$route.name, translateType: 'print' };
            const translateName = this.printConfigUrl[printModelCode].translateName;
            localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
            this.$router.push(`/printDesign/${formCode}/${taskId}/${id}/${translateName}?printModelId=${id}&flowStatus=${this.$base64.encode('01')}`);
            this.printShow = false;
            this.isDisable = false; // 开始可以点击
          }
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.instructionsForUse {
  margin-top: 50px;
  p {
    padding: 10px 0;
  }
}
.dialog-form {
  padding: 20px;
}
.valid {
  font-size: 14px;
  width: 100%;
  max-width: 100px;
  line-height: 20px;
  padding: 2px 0;
  text-align: center;
  &.valid0 {
    color: #40bb5a;
    background-color: rgba(36, 181, 104, 0.2);
  }
  &.valid1 {
    color: #ff4a4a;
    background-color: rgba(247, 53, 53, 0.2);
  }
}
</style>
