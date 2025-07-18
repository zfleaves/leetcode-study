<template>
  <div class="editTable">
    <div class="detailedTable" v-loading="loading">
      <!-- {{subTable.treeProps}} {{subTable.rowKey}} -->
      <el-form v-if="!loading" :model="subTable" ref="editTable" :rules="rule" :disabled="pageDisabled"
        class="demo-ruleForm" :validate-on-rule-change="false">
        <pl-table size="mini" :height="height" :max-height="height" :data="subTable.tableData" ref="multipleTable"
          class="edit-table-form" :class="subTable.subTableName" default-expand-all use-virtual :row-height="45"
          :row-key="subTable.rowKey || localConfig.rowKey" :lazy="subTable.lazy || localConfig.lazy"
          :load="subTable.load || localConfig.load" :tree-config="subTable.treeConfig || localConfig.treeConfig"
          :tree-props="subTable.treeProps || localConfig.treeProps"
          :row-class-name="subTable.getRowClassName || getRowClassName" @selection-change="selectionChange"
          :show-summary="subTable.showSummary || localConfig.showSummary"
          :summary-method="subTable.summaryMethod || localConfig.summaryMethod">
          <template slot="empty">
            <no-data>
            </no-data>
          </template>
          <pl-table-column v-if="isSelection" type="selection" align="center" key="2" :label="$t('fConfig.choice')"
            width="60">
          </pl-table-column>
          <pl-table-column type="index" align="center" class-name="dragAllow"
            v-if="subTable.isIndex !== undefined ? subTable.isIndex : true" :label="$t('fConfig.serialNumber')" key="1"
            width="80">
          </pl-table-column>
          <template v-for="(item) in slaveColumns">
            <pl-table-column :key="item.prop" :label="$t(item.label)" :prop="item.prop"
              :show-overflow-tooltip="item.showOverflowTooltip !== undefined ? item.showOverflowTooltip : true"
              :align="(item.filterName === 'setMoney' || item.filterName === 'number' || item.filterName === 'elNumber') ? 'right' : item.align || 'left'"
              :width="item.minWidth" v-if="item.inputStatus !=='hide'">
              <template slot="header">
                <tooltips :value="$t(item.label)" :isMust="ruleKeyList.indexOf(item.prop) > -1" v-if="!item.slotTableHeader">
                </tooltips>
                <template v-if="item.slotTableHeader">
                  <slot :name="'tableHeader-' + item.prop" :item="item"></slot>
                </template>
              </template>
              <template slot-scope="scope">
                <div class="ellipsis" v-if="item.formType==='text'"
                  :style="(item.formType==='text' && (item.filterName === 'setMoney' || item.filterName === 'number' || item.filterName === 'elNumber')) ? 'text-align: right;' : ''">
                  <span v-if="item.fn" class="smallFont set"
                    @click='handleTable(item, scope.row, $event, scope.$index)'>{{scope.row[item.prop] | systemFilters(item)}}</span>
                  <span v-else class="smallFont grey">{{scope.row[item.prop] | systemFilters(item)}}</span>
                </div>
                <el-form-item size="small" v-else
                  :prop="subTable.treeProps? '' : `tableData.${scope.$index}.${item.prop}`" :rules="rule[item.prop]">
                  <slot v-if="item.formType==='slot'" :name="'edit-table-' + item.prop" :item="item" :scope="scope.row"
                    :rowIndex="scope.$index"></slot>
                  <el-input v-if="item.formType==='input' && item.inputStatus !== 'disable'" size="small"
                    :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                    @change="handleChange(item, scope.row, $event, scope.$index)"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    v-model.trim="scope.row[item.prop]" :placeholder="item.placeholder">
                  </el-input>
                  <div class="ellipsis smallFont grey" v-else-if="item.formType==='input'">{{scope.row[item.prop]}}
                  </div>
                  <el-input v-if="item.formType==='changeProp'" :class="changeStyle(scope.row, item)" size="small"
                    :disabled="changePropDisabled(scope.row, item)" :maxlength="Number(item.maxlength)"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    v-model.trim="scope.row[item.prop]" :placeholder="item.placeholder">
                    <el-tooltip v-if="showChangeProp(scope.row, item)" slot="suffix" class="item" effect="dark"
                      :content="`${$t('tips.primary')}：${setChangeContent(scope.row, item)}`" placement="top">
                      <!-- 变 -->
                      <span class="changeStatus"><i class="el-icon-view smallFont error" style="right: 5px;"></i></span>
                    </el-tooltip>
                  </el-input>
                  <!-- textarea -->
                  <el-input v-if="item.formType==='textarea' && item.inputStatus !== 'disable'" type="textarea"
                    v-model.trim="scope.row[item.prop]" :placeholder="item.placeholder" size="small"
                    :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    :autosize="{ minRows: item.minRows, maxRows: item.maxRows}">
                  </el-input>
                  <div class="ellipsis smallFont grey" v-else-if="item.formType==='textarea'">{{scope.row[item.prop]}}
                  </div>
                  <!-- 数字 -->
                  <elPerInput v-if="item.formType==='elPerInput' && item.inputStatus !== 'disable'"
                    controls-position="right" size="small"
                    :max="item.maxValue ? scope.row[item.maxValue] || 0 : item.max" :min="item.min"
                    :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                    :precision="Number(item.precision)" v-model.trim="scope.row[item.prop]"
                    :placeholder="item.placeholder" :clearable="item.clearable === undefined ? true : item.clearable"
                    @change="handleChange(item, scope.row, $event, scope.$index)">
                  </elPerInput>
                  <div class="ellipsis smallFont grey" v-else-if="item.formType==='elPerInput'">{{scope.row[item.prop]}}
                  </div>
                  <!-- 数字 -->
                  <el-number v-if="item.formType==='number' && item.inputStatus !== 'disable'" controls-position="right"
                    size="small" :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                    :precision="Number(item.precision || 0)" v-model.trim="scope.row[item.prop]"
                    :placeholder="item.placeholder" :clearable="item.clearable === undefined ? true : item.clearable"
                    :max="item.maxValue ? scope.row[item.maxValue] || 0 : item.max" :min="item.min"
                    @change="handleChange(item, scope.row, $event, scope.$index)">
                  </el-number>
                  <div class="ellipsis smallFont grey" v-else-if="item.formType==='number'">
                    {{scope.row[item.prop]}}
                  </div>
                  <el-number v-if="item.formType==='elNumber' && item.inputStatus !== 'disable'"
                    controls-position="right" size="small" :disabled="item.inputStatus === 'disable'"
                    :maxlength="Number(item.maxlength)" :precision="Number(item.precision || 0)"
                    v-model.trim="scope.row[item.prop]" :placeholder="item.placeholder"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    :max="item.maxValue ? scope.row[item.maxValue] || 0 : item.max" :min="item.min"
                    @change="handleChange(item, scope.row, $event, scope.$index)">
                  </el-number>
                  <div class="ellipsis smallFont grey" v-else-if="item.formType==='elNumber'">
                    {{scope.row[item.prop]}}
                  </div>
                  <!-- 下拉选择框 -->
                  <el-select v-if="item.formType==='select' && item.inputStatus !== 'disable'"
                    v-model.trim="scope.row[item.prop]" :placeholder="item.placeholder" :size="item.size || 'small'"
                    :disabled="item.inputStatus === 'disable'" :filterable="item.filterable || true" style="width:100%"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    @change="handleChange(item, scope.row, $event, scope.$index)">
                    <el-option v-for="(child,i) in item.selectList" :key="i" :label="child[item.nameCode]"
                      :value="child[item.valueCode]">
                    </el-option>
                  </el-select>
                  <div class="ellipsis smallFont grey" v-else-if="item.formType==='select'">
                    {{setSelectData(scope.row[item.prop], item.selectList || [], item)}}</div>
                  <!-- 数据字典下拉选择框 -->
                  <el-select v-if="item.formType==='dicSelect' && item.inputStatus !== 'disable'"
                    v-model.trim="scope.row[item.prop]" :placeholder="item.placeholder" :size="item.size || 'small'"
                    :disabled="item.inputStatus === 'disable'" :filterable="item.filterable || true" style="width:100%"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    @change="handleChange(item, scope.row, $event, scope.$index)">
                    <el-option v-for="(child,i) in item.selectList" :key="i"
                      :label="item.isTranslate ? $t(child.dataName) : child.dataName"
                      :value="item.isNumber ? Number(child.dataCode) : child.dataCode">
                    </el-option>
                  </el-select>
                  <div class="ellipsis smallFont grey" v-else-if="item.formType==='dicSelect'">
                    {{setDicData(scope.row[item.prop], item.selectList || [], item)}}</div>
                  <!-- checkbox -->
                  <el-checkbox v-if="item.formType==='checkbox'" :disabled="item.inputStatus === 'disable'"
                    v-model="scope.row[item.prop]">
                  </el-checkbox>
                  <!-- jsEditor -->
                  <el-input v-if="item.type==='jsEditor'" :disabled="item.inputStatus === 'disable'"
                    v-model.trim="scope.row[item.prop]" placeholder="编辑JS" size="small" readonly>
                    <el-button style="margin-right: 5px;" slot="suffix" type="text" size="mini"
                      @click="handleJsEditor(scope.row, item, scope.$index)">
                      编辑
                    </el-button>
                  </el-input>
                  <!-- date time -->
                  <el-date-picker
                    v-if="(item.formType==='date' || item.formType==='time') && item.inputStatus !== 'disable'"
                    v-model="scope.row[item.prop]" :placeholder="item.placeholder" :size="item.size || 'small'"
                    prefix-icon="icon" :clearable="item.clearable === undefined ? true : item.clearable"
                    :disabled="item.inputStatus === 'disable'"
                    :picker-options="item.pickerOptions ? pickerOptions : item.beforePickerOptions ? beforePickerOptions : ''"
                    :type="item.formType === 'date' ? 'date' : 'datetime'" value-format='yyyy-MM-dd HH:mm:ss'
                    style="width: 100%;">
                  </el-date-picker>
                  <div class="ellipsis smallFont grey" v-else-if="(item.formType==='date' || item.formType==='time')">
                    {{scope.row[item.prop] | systemFilters(item)}}</div>
                  <!-- 附件 attachment -->
                  <!-- {{pageDisabled}} -->
                  <upload-file v-if="item.formType==='attachment'"
                    :flowStatus="item.inputStatus !== 'disable' && !pageDisabled" :limit="item.limit"
                    :isPhoto="item.isPhoto" :multiple="item.multiple" :attachment.sync="scope.row[item.prop]">
                  </upload-file>
                  <!-- 选择公司账户 -->
                  <el-select v-if="item.formType==='companyAccount' && item.inputStatus !== 'disable'"
                    v-model.trim="scope.row[item.key]" :placeholder="item.placeholder" :size="item.size || 'small'"
                    :disabled="item.inputStatus === 'disable'" style="width:100%"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    @change="handleCompanyAccountChangeAll(item, scope.row, $event, scope.$index)">
                    <el-option v-for="item in companyAccountList" :key="item.name" :label="item.fullAccountName"
                      :value="item.cardNumber">
                      <span>{{ item.name }}</span>
                    </el-option>
                  </el-select>
                  <div class="ellipsis smallFont grey" v-else-if="item.formType==='companyAccount'">
                    {{scope.row[item.prop]}}
                  </div>
                  <!-- 按钮 -->
                  <div v-if="item.formType === 'operate'">
                    <template v-for="but in item.buts">
                      <el-button :key="but.id" v-if="but.show  || true" :disabled="but.disabled || false"
                        :class="but.class" @click="setFn(but, scope.row)" type="text" size="mini" v-fast-click>
                        {{$t(but.name)}}
                      </el-button>
                    </template>
                    <slot name='table-buts' :scope="scope.row" :pageDisabled="pageDisabled" :buts="item.buts"
                      :item="item"></slot>
                  </div>
                </el-form-item>
              </template>
            </pl-table-column>
          </template>
        </pl-table>
      </el-form>
    </div>
  </div>
</template>
<script>
import Sortable from 'sortablejs';// 拖拽排序文件
import { PlTable, PlTableColumn } from 'pl-table';

export default {
  data () {
    return {
      deleteList: [],
      jsEditorShow: false,
      jsCode: '',
      jsRow: '',
      jsRowCode: '',
      selectedUsers: [],
      tableChickList: [],
      toConfigure: {
        size: 'small', // 表格的尺寸
        border: false, // 是否显示边框
        stripe: false, // 是否显示斑马纹
        highlightCurrentRow: true, // 当前行高亮
        choice: 'checkbox', // radio => 单选  checkbox => 多选
        spanMethod: '', // 表格合并函数,
        getRowId: 'columnSource' // row-key
      },
      pageDisabled: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      beforePickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now();
        }
      },
      btnParameter: {},
      dialogShow: false,
      fromData: [],
      slaveColumns: [],
      // 已选明细
      tableSelectList: [],
      localConfig: {
        summaryMethod: null,
        showSummary: false
      },
      companyAccountList: [],
      sortable: null,
      requiredRules: [],
      loading: false,
      summariesList: []
    };
  },
  computed: {
    rule () {
      for (const i in this.tableConfig.rules) {
        const slaveColumn = this.tableConfig.slaveColumns.find(v => v.prop === i);
        const item = this.tableConfig.rules[i];
        item.forEach(v => {
          if (v.message) {
            v.message = this.$t(v.message);
          } else {
            if (slaveColumn) {
              v.message = `${this.$t(slaveColumn.label)} ${this.$t('tips.notNull')}`;
            } else {
              v.message = `${this.$t('tips.notNull')}`;
            }
          }
        });
      }
      return { ...this.tableConfig.rules, ...this.customRules, ...this.requiredRules };
    },
    ruleKeyList () {
      const list = [];
      Object.keys({ ...this.tableConfig.rules, ...this.customRules, ...this.requiredRules }).forEach(key => {
        if (this.rule[key] && this.rule[key].length && this.rule[key][0].required) {
          list.push(key);
        }
      });
      return list;
    }
  },
  components: {
    uploadFile (resolve) {
      require(['components/basicComponents/global/upload/uploadFile.vue'], resolve);
    },
    elPerInput (resolve) {
      require(['components/basicComponents/global/elPerInput/elPerInput.vue'], resolve);
    },
    PlTable,
    PlTableColumn
  },
  props: {
    tableConfig: {
      type: Object,
      default: () => {
        const params = {
          // 表头配置
          slaveColumns: [],
          // 校验
          rules: {},
          // 初始化行数据
          tableDataRow: {}
        };
        return params;
      }
    },
    tableData: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'add'
    },
    isSelection: {
      type: Boolean,
      default: false
    },
    subTable: {
      type: Object,
      default: () => { }
    },
    customRules: {
      type: Object,
      default: () => { }
    },
    height: {
      type: Number,
      default: 400
    },
    getRowClassName: {
      type: Function
    }
  },
  watch: {
    tableConfig: {
      handler () {
        this.slaveColumns = this.tableConfig.slaveColumns;
        if (!this.subTable.treeProps) {
          this.setSummariesList();
        }
        this.getCompanyAccountList();
        this.getPageControlList();
      },
      immediate: true,
      deep: true
    }
  },
  created () {
    this.params = this.$route.params;
    if (!this.subTable.treeProps) {
      this.localConfig.summaryMethod = this.getSummaries;
    }
  },
  mounted () {
    if (this.tableConfig) {
      this.slaveColumns = this.tableConfig.slaveColumns;
      if (!this.subTable.treeProps) {
        this.setSummariesList();
      }
      this.getCompanyAccountList();
      this.getPageControlList();
    }
    this.pageDisabled = this.type === 'info';
    // 设置是否可以拖拽排序
    this.subTable.isSortTable && this.handleSortTable();
  },
  methods: {
    // 查询租户有效的页面控制设置记录
    getPageControlList () {
      if (this.$route.name === 'processApprovalPage') return;
      this.loading = true;
      const pageCode = this.$route.params.translateName ? this.$route.params.translateName : this.$route.name;
      const data = {
        subSystemCode: this.$utils.config.subSystemCode,
        pageCode,
        controlTypeCodes: ['01', '03']
      };
      this.$store.dispatch('publicApi/getPageControlPublicApi', data).then(res => {
        if (res.status === 0 && res.results && res.results.length) {
          const checkFormList = res.results.filter(v => v.formDetailCode); // 获取子表需要校验的字段
          for (const item of checkFormList) {
            if (item.controlTypeCode === '01') {
              // 必填
              this.$set(this.requiredRules, item.columnCode, { required: item.whetherOrNot === 1, message: `${this.$t(item.columnLanguage)}${this.$t('tips.required')}!` });
            }
            if (item.controlTypeCode === '03') {
              // 编辑
              const detailsKey = this.slaveColumns.findIndex(v => v.prop === item.columnCode);
              if (detailsKey >= 0) {
                this.$set(this.slaveColumns[detailsKey], 'inputStatus', item.whetherOrNot === 1 ? 'edit' : 'disable');
                // 是否为系统控制字段
                this.$set(this.slaveColumns[detailsKey], 'isSystemControlEdit', item.whetherOrNot === 1);
              }
            }
          }
          this.loading = false;
        } else {
          this.requiredRules = {};
          this.loading = false;
        }
      }).catch(e => {
        this.requiredRules = {};
        this.loading = false;
      });
    },
    // 拖拽排序
    handleSortTable () {
      this.$nextTick(() => {
        this.setSort(this.subTable.subTableName);
      });
    },
    setSort (className) {
      const el = document.querySelectorAll(`.${className}>.el-table>.el-table__body-wrapper>.el-table__virtual-wrapper> div > table> tbody`)[0];
      if (!el) return;
      this.sortable = Sortable.create(el, {
        animation: 100,
        handle: '.dragAllow',
        onEnd: evt => {
          const data = this.$clone(this.subTable.tableData);
          const targetRow = data.splice(evt.oldIndex, 1)[0];
          data.splice(evt.newIndex, 0, targetRow);
          this.resetSort(data);
        }
      });
    },
    //     *重新排序*
    resetSort (sortArr) {
      const newData = [];
      sortArr.forEach((item, index) => {
        newData[index] = {
          ...item,
          sorts: index
        };
      });
      this.subTable.tableData = [];
      this.$nextTick(() => {
        this.subTable.tableData = newData;
      });
    },
    // 获取公司账户信息
    getCompanyAccountList () {
      const index = this.slaveColumns.findIndex(v => v.formType === 'companyAccount');
      if (index >= 0) {
        this.$store.dispatch('publicApi/getCompanyAccountList').then(res => {
          for (const item of res.results) {
            this.$set(item, 'name', `${item.fullAccountName}-${item.cardNumber}-${item.openAccountBank}`);
          }
          this.companyAccountList = res.results || [];
        });
      }
    },
    btnFn (fnName) {
      this[fnName]();
    },
    setFn (btnParameter, row) {
      const params = {
        btnParameter,
        row
      };
      this.$emit('editTableEvent', { eventName: 'fnRowName', params });
      this.$emit('fnRowName', [btnParameter, row]);
    },
    // 批量删除选中
    selectionChange (val) {
      this.deleteList = val;
      this.$emit('update:delete', this.deleteList);
    },
    // 无验证子表数据返回
    getTableData () {
      const tableData = JSON.parse(JSON.stringify(this.subTable.tableData));
      if (tableData.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    // 选中
    handleChange (item, row, event, rowIndex) {
      const params = {
        item,
        row,
        event,
        subTable: this.subTable,
        rowIndex
      };
      if (item.isRelation) { // 下拉选择赋值
        this.$emit('editTableEvent', { eventName: 'tableSelect', params });
      }
      if (item.operateData) {
        this.$emit('editTableEvent', { eventName: 'operateDataEvent', params });
        this.$emit('operateDataEvent', { item, row, event, tableData: this.subTable.tableData, rowIndex });
      }
    },
    // 选中公司账户
    handleCompanyAccountChangeAll (item, row, event, rowIndex) {
      const data = this.companyAccountList.find(v => v.cardNumber === event);
      if (item.relationList && item.relationList.length) {
        for (const ol of item.relationList) {
          this.$set(row, ol.receive, data ? data[ol.value] : '');
        }
      }
    },
    // 表格内文本操作时间
    handleTable (item, row, event, rowIndex) {
      const params = {
        item,
        row,
        event,
        subTable: this.subTable,
        rowIndex
      };
      this.$emit('editTableEvent', { eventName: 'handleTable', params });
    },
    // 数据字典
    setDicData (value, selectList, item) {
      const index = selectList && selectList.findIndex(v => String(v.dataCode) === String(value));
      if (index < 0) return '';
      return item.isTranslate ? this.$t(selectList[index].dataName) : selectList[index].dataName;
    },
    setSelectData (value, selectList, item) {
      const index = selectList && selectList.findIndex(v => String(v[item.valueCode]) === String(value));
      if (index < 0) return '';
      return item.isTranslate ? this.$t(selectList[index][item.nameCode]) : selectList[index][item.nameCode];
    },
    // 清空
    clearSelectionTable () {
      this.$refs.multipleTable.clearSelection();
    },
    // 验证子表数据
    validateTableData (callback) {
      this.$refs.multipleTable.clearSelection();
      if (this.subTable.tableData.length === 0) {
        return [];
      }
      let data = false;
      this.$refs.editTable.validate(valid => {
        if (valid) {
          const tableConfig = JSON.parse(JSON.stringify(this.slaveColumns));
          const tableData = JSON.parse(JSON.stringify(this.subTable.tableData));
          for (const i in tableConfig) {
            const item = tableConfig[i];
            for (const i in tableData) {
              const row = tableData[i];
              // checkbox
              if (item.type === 'checkbox') {
                row[item.prop] = row[item.prop] ? 1 : 0;
              }
              // 唯一
              if (item.isRepeat) {
                const repeatList = this.arrTest(this.subTable.tableData, item.prop);
                if (repeatList.length > 0) {
                  this.$message.error(`${item.label} 存在重复！`);
                  this.toggleSelection(repeatList, 'multipleTable');
                  return false;
                }
              }
              row.createTime = this.$utils.commonUtil.formatTime(new Date());
            }
          }
          data = JSON.parse(JSON.stringify(tableData));
          callback && callback(data);
        } else {
          data = false;
        }
      });
      return data;
    },
    // 判断是否重复
    arrTest (arr, key) {
      const list = [];
      const repeatList = [];
      for (const i in arr) {
        const item = arr[i];
        if (list.some(v => v[key] === item[key])) {
          repeatList.push(item);
        } else {
          list.push(item);
        }
      }
      return repeatList;
    },
    // 勾选
    toggleSelection (rows, formName) {
      if (rows) {
        rows.forEach(row => {
          this.$refs[formName].toggleRowSelection(row, true);
        });
      } else {
        this.$refs[formName].clearSelection();
      }
    },
    // 状态处理
    changePropDisabled (row, item) {
      if (this.$route.name === 'processApprovalPage') {
        return item.inputStatus === 'disable';
      } else {
        return item.isSystemControlEdit ? false : item.addPropId ? !!row[item.addPropId] : item.inputStatus === 'disable';
      }
    },
    // 字段变化后
    changeStyle (row, item) {
      const relationKeyIds = item.relationKeyIds || [];
      if (!relationKeyIds.length) return;
      if (relationKeyIds.length > 1) {
        if ((row[relationKeyIds[0]] || row[relationKeyIds[1]]) && row[item.prop] !== row[item.originProp]) {
          return 'afterStatus';
        }
      }
      if (relationKeyIds.length === 1) {
        if (row[relationKeyIds[0]] && row[item.prop] !== row[item.originProp]) {
          return 'afterStatus';
        }
      }
    },
    showChangeProp (row, item) {
      const relationKeyIds = item.relationKeyIds || [];
      if (!relationKeyIds.length) return false;
      if (relationKeyIds.length > 1) {
        if ((row[relationKeyIds[0]] || row[relationKeyIds[1]]) && row[item.prop] !== row[item.originProp]) {
          return true;
        }
      }
      if (relationKeyIds.length === 1) {
        if (row[relationKeyIds[0]] && row[item.prop] !== row[item.originProp]) {
          return true;
        }
      }
    },
    setChangeContent (row, item) {
      // ${scope.row[item.originProp]}
      return row[item.originProp] ? row[item.originProp] : '';
    },
    // 设置合计的字段
    setSummariesList () {
      this.summariesList = [];
      for (const item of this.slaveColumns) {
        if (item.filterName === 'setMoney' || item.filterName === 'number' || item.formType === 'number') {
          const index = this.summariesList.findIndex(v => v === item.prop);
          if (index < 0) {
            this.summariesList.push(item.prop);
          }
        }
      }
      this.localConfig.showSummary = this.summariesList.length > 0;
    },
    // 合计
    getSummaries (param) {
      const { columns, data } = param;
      const tableList = [];
      const sumList = ['Quantity', 'quantity', 'amount', 'Amount'];
      for (const item of this.slaveColumns) {
        for (const val of sumList) {
          const index = item.prop ? item.prop.indexOf(val) : -1;
          const hasIsShowSummary = item.isShowSummary !== undefined && item.isShowSummary;
          if (index >= 0 || hasIsShowSummary) {
            tableList.push(item.prop);
          }
        }
      }
      const sums = []; // 合计
      columns.forEach((column, columnIndex) => {
        if (columnIndex === 0) {
          sums[columnIndex] = this.$t('fConfig.total');
        } else {
          const values = data.map(item => Number(item[column.property]));
          // console.log(values, 'values');
          // 合计
          if (tableList.indexOf(column.property) >= 0) {
            sums[columnIndex] = values.reduce((prev, curr) => {
              const value = Number(curr || 0);
              if (!isNaN(value)) {
                return (prev || 0) + (curr || 0);
              } else {
                return (prev || 0);
              }
            }, 0);
            if (tableList.indexOf(column.property) >= 0) {
              let precision = 4;
              if (column.property.indexOf('amount') >= 0 || column.property.indexOf('Amount') >= 0) {
                precision = 2;
              }
              sums[columnIndex] = this.$utils.commonUtil.toQfw(Number(sums[columnIndex].toFixed(precision)), precision);
            }
          } else {
            sums[columnIndex] = '';
          }
        }
      });
      this.$nextTick(() => {
        // console.log(this.$refs.multipleTable, 'this.$refs.editTable');
        this.$refs.multipleTable && this.$refs.multipleTable.doLayout();
      });
      return [sums];
    }
  }
};

</script>
<style lang="scss" scoped>
/deep/.el-table__footer-wrapper {
  .has-gutter {
    .cell {
      display: inline-block;
    }
  }
}
.afterStatus {
  /deep/ .el-input__inner {
    color: #ff4a4a !important;
  }
}
.changeStatus {
  color: #ff4a4a;
  // margin-right: 5px;
  position: absolute;
  right: -14px;
}

.editTable {
  flex: 1;
  margin-bottom: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  /deep/ .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper
    .el-table--border.is-scrolling-left
    ~ .el-table__fixed {
    border-right: 1px solid #ebeef5 !important;
    box-sizing: border-box;
  }
  /deep/ .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5;
  }
  /deep/ .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper
    .el-table--border.is-scrolling-left
    ~ .el-table__fixed {
    border-right: 1px solid #ebeef5 !important;
    box-sizing: border-box;
  }
  /deep/ .el-table thead th {
    border-right: 1px solid #ebeef5 !important;
  }
  .detailedTable {
    flex: 1;
  }
  /deep/ .el-input--small .el-input__inner {
    line-height: 34px !important;
    height: 34px !important;
  }
  /deep/ .cell {
    // display: flex;
    padding-right: 17px !important;
    padding-left: 17px !important;
  }
  /deep/ .el-table__expand-icon {
    position: relative;
    top: 10px;
  }
  /deep/ .el-form-item {
    width: 100%;
  }
}

.jsDialog {
  padding: 10px;
  min-height: 400px;

  .footer {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 45px;
    line-height: 45px;
    padding: 0 15px;
    font-size: 14px;
  }
}

.databaseFields {
  padding: 10px;

  .footer {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 45px;
    line-height: 45px;
    padding: 0 15px;
    font-size: 14px;
  }
}
</style>
