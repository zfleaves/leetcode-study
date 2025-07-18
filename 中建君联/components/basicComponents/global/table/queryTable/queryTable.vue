<!--
 * @Author: your name
 * @Date: 2020-08-26 17:48:27
 * @LastEditTime: 2023-02-21 15:15:13
 * @LastEditors: zengqin 1058574586@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\components\basicComponents\global\table\queryTable\queryTable.vue
-->
<template>
  <div v-if="!loading">
    <el-table ref="queryTable" style="width:100%" :class="(config.isRadio || localConfig.isRadio) && 'radio'"
      :data="config.tableData || []" :stripe="config.stripe || localConfig.stripe"
      :border="config.border || localConfig.border" :resizable="config.resizable || localConfig.resizable"
      :size="config.size || localConfig.size" :height="config.maxHeight || localConfig.maxHeight"
      :maxHeight="config.maxHeight || localConfig.maxHeight" :fit="config.fit || localConfig.fit"
      :show-header="config.showHeader || localConfig.showHeader"
      :highlight-current-row="config.highlightCurrentRow || localConfig.highlightCurrentRow"
      :row-class-name="config.rowClassName || getRowClassName" :row-style="config.rowStyle || localConfig.rowStyle"
      :cell-class-name="config.cellClassName || localConfig.cellClassName"
      :cell-style="config.cellStyle || localConfig.cellStyle"
      :header-row-class-name="config.headerRowClassName || localConfig.headerRowClassName"
      :header-row-style="config.headerRowStyle || localConfig.headerRowStyle"
      :header-cell-class-name="config.headerCellClassName || localConfig.headerCellClassName"
      :header-cell-style="config.headerCellStyle || localConfig.headerCellStyle"
      :row-key="config.rowKey || localConfig.rowKey" :empty-text="config.emptyText || localConfig.emptyText"
      :default-expand-all="config.defaultExpandAll || localConfig.defaultExpandAll"
      :expand-row-keys="config.expandRowKeys || []" :tooltip-effect="config.tooltipEffect || localConfig.tooltipEffect"
      :show-summary="config.showSummary || localConfig.showSummary" :sum-text="config.sumText || localConfig.sumText"
      :summary-method="config.summaryMethod || localConfig.summaryMethod"
      :span-method="config.spanMethod || localConfig.spanMethod"
      :select-on-indeterminate="config.selectOnIndeterminate || localConfig.selectOnIndeterminate"
      :indent="config.indent || localConfig.indent" :lazy="config.lazy || localConfig.lazy"
      :load="config.load || localConfig.load" :tree-props="config.treeProps || localConfig.treeProps"
      :filter-method="filterHandler" @select="eventEmit('select', $event)" @select-all="eventEmit('select-all', $event)"
      @selection-change="selectionChange" @cell-mouse-enter="eventEmit('cell-mouse-enter', $event)"
      @cell-mouse-leave="eventEmit('cell-mouse-leave', $event)" @cell-click="eventEmit('cell-click', $event)"
      @cell-dblclick="eventEmit('cell-dblclick', $event)" @row-click="clickRow"
      @row-contextmenu="eventEmit('row-contextmenu', $event)" @row-dblclick="eventEmit('row-dblclick', $event)"
      @header-click="eventEmit('header-click', $event)" @header-contextmenu="eventEmit('header-contextmenu', $event)"
      @sort-change="sortChangeMethod" @filter-change="eventEmit('filter-change', $event)"
      @current-change="handleCurrentChange" @header-dragend="eventEmit('header-dragend', $event)"
      @expand-change="eventEmit('expand-change', $event)" :default-sort="config.defaultSort || {}">
      <template slot="empty">
        <no-data>
        </no-data>
      </template>
      <el-table-column v-if="config.isCheckbox || localConfig.isCheckbox" type="selection" :selectable="selectable"
        align="center" :reserve-selection='true' width="50">
      </el-table-column>
      <el-table-column v-if="config.isRadio || localConfig.isRadio" type="selection" :selectable="selectable"
        align="center" :reserve-selection='true' width="50">
      </el-table-column>
      <!-- 序号 -->
      <el-table-column v-if="config.isIndexShow === false ? false :localConfig.isIndexShow" align="center" type="index"
        :label="$t('fConfig.serialNumber')" width="60" fixed="left">
      </el-table-column>
      <template v-for="(item, mainIndex) in ((config.tableList || []).filter(val => val.show))">
        <el-table-column v-if="item.inputStatus !=='hide' && item.formType === 'expand'" :key="item.prop"
          :fixed="item.fixed || false" :prop="item.prop" :label="$t(item.label)" :width="item.minWidth + '%'"
          type="expand" :align="item.formType === 'operate' ? 'center' : item.align || 'left'"
          :show-overflow-tooltip="item.formType !== 'operate'">
          <template slot-scope="props">
            <slot name="expand" :scope="props"></slot>
          </template>
        </el-table-column>
        <el-table-column v-if="item.inputStatus !=='hide' && item.formType !== 'expand'" :key="item.prop"
          :fixed="item.fixed || false" :prop="item.prop" :width="item.minWidth + '%'"
          :align="item.formType === 'operate' ? 'center' : item.formType === 'setMoney' || item.filterName === 'setMoney' ? 'right'
          : item.align || 'left'" :show-overflow-tooltip="item.formType !== 'operate'"
          :sortable='item.sortable || false'>
          <!-- 子级 -->
          <template v-if="item.children && item.children.length">
            <template v-for="child in ((item.children || []).filter(val => val.show))">
              <el-table-column v-if="child.inputStatus !=='hide' && child.formType !== 'expand'" :key="child.prop"
                :fixed="child.fixed || false" :prop="child.prop" :width="child.minWidth + '%'"
                :align="child.formType === 'operate' ? 'center' : child.formType === 'setMoney' || child.filterName === 'setMoney' ? 'right' : child.align || 'left'"
                :show-overflow-tooltip="child.formType !== 'operate'">
                <!-- 第三级 -->
                <template v-if="child.children && child.children.length">
                  <template v-for="child in ((child.children || []).filter(val => val.show))">
                    <el-table-column v-if="child.inputStatus !=='hide' && child.formType !== 'expand'" :key="child.prop"
                      :fixed="child.fixed || false" :prop="child.prop" :width="child.minWidth + '%'"
                      :align="child.formType === 'operate' ? 'center' : child.formType === 'setMoney' || child.filterName === 'setMoney' ? 'right' : child.align || 'left'"
                      :show-overflow-tooltip="child.formType !== 'operate'">
                      <template slot="header">
                        <tooltips :value="$t(child.label)">
                        </tooltips>
                      </template>
                      <template slot-scope="scope">
                        <!-- 按钮 -->
                        <div v-if="child.formType === 'operate' && scope.row.id !== -1" style="text-align:center;">
                          <slot name='table-buts-suffix-third' :scope="scope" :item='child' :rowIndex="scope.$index"
                            :mainIndex="mainIndex"></slot>
                          <!--根据不用的禁用条件禁用-->
                          <template v-for="but in child.buts">
                            <el-button :key="but.id" :class="but.class" :disabled="handleFlowStatus(scope.row,but)"
                              v-if="!but.noAuth ? authButtonList.indexOf(but.authCode) >= 0 : true"
                              @click.stop.prevent="setFn(but, scope.row)" type="text" size="mini" v-fast-click>
                              {{$t(but.name)}}
                            </el-button>
                          </template>
                          <slot name='table-buts-third' :scope="scope.row"></slot>
                        </div>
                        <!-- 数据字典 -->
                        <span v-else-if="child.formType === 'dicSelect'" :class="child.fn && 'midFont set'"
                          @click.stop.prevent="setFn(child, scope.row)">
                          {{setDicData(scope.row[child.prop], child.selectList, child)}}
                        </span>
                        <!-- 状态 -->
                        <span v-else-if="child.formType === 'sysStatus'" :class="child.fn && 'midFont set'"
                          @click.stop.prevent="setFn(child, scope.row)">
                          {{statusFilter(scope.row[child.prop])}}
                        </span>
                        <!-- 金额 -->
                        <div v-else-if="child.formType === 'setMoney'" :class="child.fn && 'midFont set'" class="ellipsis"
                          @click.stop.prevent="setFn(child, scope.row)" style="text-align: right;">
                          {{scope.row[child.prop] | systemFilters(child)}}
                        </div>
                        <!-- 附件下载 + 预览 -->
                        <div v-else-if="child.formType === 'attachmentDownload'" class="file-list">
                          <span class="midFont ellipsis set"  v-if="scope.row[child.prop] && judgeFile(scope.row[child.prop])" @click="handleViewer(scope.row[child.prop])">
                            {{ setFilename(scope.row[child.prop]) }}
                          </span>
                          <span class="midFont ellipsis info"  v-else>
                            {{ setFilename(scope.row[child.prop]) }}
                          </span>
                          <span class="midFont set" v-if="scope.row[child.prop]" style="margin-right: 10px" @click="downFilePath(scope.row[child.prop])">
                            {{ $t('button.download') }}
                          </span>
                        </div>
                        <!-- 附件 -->
                        <span v-else-if="child.formType === 'attachment'" class="midFont set"
                          @click.stop.prevent="handleViewAttachment(scope.row[child.prop], scope.row, item)">
                          附件{{scope.row[child.prop] ? scope.row[child.prop].split(',').length : 0}}个
                        </span>
                        <!-- 进度条 -->
                        <div v-else-if="child.formType === 'elProgress'">
                          <el-progress
                            :percentage="(scope.row[child.prop] || 0)"
                            :text-inside="true"
                            :color='child.colorStyle'
                            :status="child.status"
                            :stroke-width="child.strokeWidth || 26">
                          </el-progress>
                        </div>
                        <!-- 审批状态 -->
                        <span v-else-if="child.formType === 'flowStatus'" class="flowStatus"
                          :class="'flowStatus'+scope.row[child.prop]">
                          {{$t(flowStatusFilter(scope.row[child.prop]))}}
                        </span>
                        <!-- 状态(启用/禁用) -->
                        <span v-else-if="child.formType === 'status'" class="status" :class="'status'+scope.row[child.prop]">
                          {{statusFilter(scope.row[child.prop])}}
                        </span>
                        <!-- html -->
                        <span v-else-if="child.formType === 'html'" v-html="scope.row[child.prop]"></span>
                        <!-- 插槽 -->
                        <slot v-else-if="child.formType === 'slot'" :name="'table-' + child.prop" :row="scope.row"
                          :item="child">
                        </slot>
                        <span v-else :class="child.fn && 'midFont set'">
                          <span v-if="child.fn"
                            @click.stop.prevent="setFn(child, scope.row)">{{scope.row[child.prop] | systemFilters(child)}}</span>
                          <span v-else>{{scope.row[child.prop] | systemFilters(child)}}</span>
                        </span>
                      </template>
                    </el-table-column>
                  </template>
                </template>
                <template slot="header">
                  <tooltips :value="$t(child.label)">
                  </tooltips>
                </template>
                <template slot-scope="scope">
                  <!-- 按钮 -->
                  <div v-if="child.formType === 'operate' && scope.row.id !== -1" style="text-align:center;">
                    <slot name='table-buts-suffix' :scope="scope" :item='child' :rowIndex="scope.$index"
                      :mainIndex="mainIndex"></slot>
                    <!--根据不用的禁用条件禁用-->
                    <template v-for="but in child.buts">
                      <el-button :key="but.id" :class="but.class" :disabled="handleFlowStatus(scope.row,but)"
                        v-if="!but.noAuth ? authButtonList.indexOf(but.authCode) >= 0 : true"
                        @click.stop.prevent="setFn(but, scope.row)" type="text" size="mini" v-fast-click>
                        {{$t(but.name)}}
                      </el-button>
                    </template>
                    <slot name='table-buts' :scope="scope.row"></slot>
                  </div>
                  <!-- 数据字典 -->
                  <span v-else-if="child.formType === 'dicSelect'" :class="child.fn && 'midFont set'"
                    @click.stop.prevent="setFn(child, scope.row)">
                    {{setDicData(scope.row[child.prop], child.selectList, child)}}
                  </span>
                  <!-- 状态 -->
                  <span v-else-if="child.formType === 'sysStatus'" :class="child.fn && 'midFont set'"
                    @click.stop.prevent="setFn(child, scope.row)">
                    {{statusFilter(scope.row[child.prop])}}
                  </span>
                  <!-- 金额 -->
                  <div v-else-if="child.formType === 'setMoney'" :class="child.fn && 'midFont set'" class="ellipsis"
                    @click.stop.prevent="setFn(child, scope.row)" style="text-align: right;">
                    {{scope.row[child.prop] | systemFilters(child)}}
                  </div>
                  <!-- 附件下载 + 预览 -->
                  <div v-else-if="child.formType === 'attachmentDownload'" class="file-list">
                    <span class="midFont ellipsis set"  v-if="scope.row[child.prop] && judgeFile(scope.row[child.prop])" @click="handleViewer(scope.row[child.prop])">
                      {{ setFilename(scope.row[child.prop]) }}
                    </span>
                    <span class="midFont ellipsis info"  v-else>
                      {{ setFilename(scope.row[child.prop]) }}
                    </span>
                    <span class="midFont set" v-if="scope.row[child.prop]" style="margin-right: 10px" @click="downFilePath(scope.row[child.prop])">
                      {{ $t('button.download') }}
                    </span>
                  </div>
                  <!-- 附件 -->
                  <span v-else-if="child.formType === 'attachment'" class="midFont set"
                    @click.stop.prevent="handleViewAttachment(scope.row[child.prop], scope.row, item)">
                    附件{{scope.row[child.prop] ? scope.row[child.prop].split(',').length : 0}}个
                  </span>
                  <!-- 进度 -->
                  <div v-else-if="child.formType === 'elProgress'">
                    <el-progress
                      :percentage="(scope.row[child.prop] || 0)"
                      :text-inside="true"
                      :stroke-width="child.strokeWidth || 26">
                    </el-progress>
                  </div>
                  <!-- 审批状态 -->
                  <span v-else-if="child.formType === 'flowStatus'" class="flowStatus"
                    :class="'flowStatus'+scope.row[child.prop]">
                    {{$t(flowStatusFilter(scope.row[child.prop]))}}
                  </span>
                  <!-- 状态(启用/禁用) -->
                  <span v-else-if="child.formType === 'status'" class="status" :class="'status'+scope.row[child.prop]">
                    {{statusFilter(scope.row[child.prop])}}
                  </span>
                  <!-- html -->
                  <span v-else-if="child.formType === 'html'" v-html="scope.row[child.prop]"></span>
                  <!-- 插槽 -->
                  <slot v-else-if="child.formType === 'slot'" :name="'table-' + child.prop" :row="scope.row"
                    :item="child">
                  </slot>
                  <span v-else :class="child.fn && 'midFont set'">
                    <span v-if="child.fn"
                      @click.stop.prevent="setFn(child, scope.row)">{{scope.row[child.prop] | systemFilters(child)}}</span>
                    <span v-else>{{scope.row[child.prop] | systemFilters(child)}}</span>
                  </span>
                </template>
              </el-table-column>
            </template>
          </template>
          <template slot="header">
            <tooltips :value="$t(item.label)" v-if="!item.slotTableHeader">
            </tooltips>
            <template v-else>
              <slot :name="'tableHeader-' + item.prop" :item="item"></slot>
            </template>
          </template>
          <template slot-scope="scope">
            <!-- 按钮 -->
            <div v-if="item.formType === 'operate'" style="text-align:center;">
              <slot name='table-buts-suffix' :scope="scope" :item='item' :rowIndex="scope.$index"
                :mainIndex="mainIndex"></slot>
              <!--根据不用的禁用条件禁用-->
              <template v-for="but in item.buts">
                <el-button :key="but.id" :class="but.class" :disabled="handleFlowStatus(scope.row,but)"
                  v-if="!but.noAuth ? authButtonList.indexOf(but.authCode) >= 0 : true"
                  @click.stop.prevent="setFn(but, scope.row)" type="text" size="mini" v-fast-click>
                  {{$t(but.name)}}
                </el-button>
              </template>
              <slot name='table-buts' :scope="scope.row"></slot>
            </div>
            <!-- 数据字典 -->
            <span v-else-if="item.formType === 'dicSelect'" :class="item.fn && 'midFont set'"
              @click.stop.prevent="setFn(item, scope.row)">
              {{setDicData(scope.row[item.prop], item.selectList, item)}}
            </span>
            <!-- 提交状态 -->
            <span v-else-if="item.formType === 'submitStatus'" class="flowStatus" :class="'flowStatus'+scope.row[item.prop]">
              {{setDicData(scope.row[item.prop], item.selectList, item)}}
            </span>
            <!-- 状态 -->
            <span v-else-if="item.formType === 'sysStatus'" :class="item.fn && 'midFont set'"
              @click.stop.prevent="setFn(item, scope.row)">
              {{statusFilter(scope.row[item.prop])}}
            </span>
            <!-- 金额 -->
            <div v-else-if="item.formType === 'setMoney'" :class="item.fn && 'midFont set'" class="ellipsis"
              @click.stop.prevent="setFn(item, scope.row)" style="text-align: right;">
              {{scope.row[item.prop] | systemFilters(item)}}
            </div>
            <!-- 附件下载 + 预览 -->
            <div v-else-if="item.formType === 'attachmentDownload'" class="file-list">
              <span class="midFont ellipsis set"  v-if="scope.row[item.prop] && judgeFile(scope.row[item.prop])" @click="handleViewer(scope.row[item.prop])">
                {{ setFilename(scope.row[item.prop]) }}
              </span>
              <span class="midFont ellipsis info" v-else>
                {{ setFilename(scope.row[item.prop]) }}
              </span>
              <span class="midFont set" v-if="scope.row[item.prop]" style="margin-right: 10px" @click="downFilePath(scope.row[item.prop])">
                {{ $t('button.download') }}
              </span>
            </div>
            <!-- 附件 -->
            <span v-else-if="item.formType === 'attachment'" class="midFont set"
              @click.stop.prevent="handleViewAttachment(scope.row[item.prop],item,scope.row)">
              {{(scope.row[item.prop] === '' || scope.row[item.prop] === null || scope.row[item.prop] === undefined) ?
               '' : `附件${scope.row[item.prop] ? scope.row[item.prop].split(',').length : 0}个`}}
            </span>
            <!-- 附件修改 -->
            <span v-else-if="item.formType === 'attachmentUpdata'" class="attachmentUpdata">
              <span class="midFont info" style="height: 23px;">
                {{(scope.row[item.prop] === '' || scope.row[item.prop] === null || scope.row[item.prop] === undefined) ?
               '' : `附件${scope.row[item.prop] ? scope.row[item.prop].split(',').length : 0}个`}}
              </span>
              <span class="midFont set">
                <upload-file :flowStatus="item.disabled" :limit="item.limit"
                  :attachmentListShow="item.attachmentListShow" :row="scope.row" :disabledField="item.disabledField"
                  :disabledValue="item.disabledValue" :multiple="item.multiple" :isPhoto="item.isPhoto"
                  :attachment.sync="scope.row[item.prop]" @attachment="attachmentUpdata($event, scope.row)">
                </upload-file>
              </span>
            </span>
            <!-- 进度条 -->
            <div v-else-if="item.formType === 'elProgress'">
              <el-progress
                :percentage="(scope.row[item.prop] || 0)"
                :text-inside="true"
                :color='item.colorStyle'
                :status="item.status"
                :stroke-width="item.strokeWidth || 26">
              </el-progress>
            </div>
            <!-- 审批状态 -->
            <span v-else-if="item.formType === 'flowStatus'" class="flowStatus"
              :class="'flowStatus'+scope.row[item.prop]">
              {{$t(flowStatusFilter(scope.row[item.prop]))}}
            </span>
            <!-- 状态(启用/禁用) -->
            <span v-else-if="item.formType === 'status'" class="status" :class="'status'+scope.row[item.prop]">
              {{statusFilter(scope.row[item.prop])}}
            </span>
            <!-- html -->
            <span v-else-if="item.formType === 'html'" v-html="scope.row[item.prop]"></span>
            <!-- 插槽 -->
            <slot v-else-if="item.formType === 'slot'" :name="'table-' + item.prop" :row="scope.row" :item="item">
            </slot>
            <span v-else :class="item.fn && 'midFont set'">
              <span v-if="item.fn"
                @click.stop.prevent="setFn(item, scope.row)">{{scope.row[item.prop] | systemFilters(item)}}</span>
              <span v-else>{{scope.row[item.prop] | systemFilters(item)}}</span>
            </span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 附件弹框 -->
    <el-dialog v-dialogDrag class="el-dialog-auto" :title="$t('dialog.attachments')" append-to-body center
      v-if="dialogAttachment" :visible.sync="dialogAttachment" width="70%">
      <attachment :gridData="gridData" :isEdit="isEdit" :isUpload="isUpload">
      </attachment>
    </el-dialog>
   <image-viewer v-if="visible" :image-viewer-list="imageViewerList" @clearImg="getClearImg" :current-img="currentImg"
      :visible="visible"></image-viewer>
  </div>
</template>
<script>
import LocalConfig from './defaultConfig';
import Auth from 'util/auth';
import Sortable from 'sortablejs';

export default {
  name: 'queryTable',
  data () {
    return {
      localConfig: LocalConfig(),
      authButtonList: [],
      selectionChangeList: [],
      rowIndex: -1,
      dialogAttachment: false,
      gridData: [],
      mainId: 0,
      attachmentConfig: {},
      loading: false,
      checkList: [],
      gridDownloadData: [],
      currentImg: '',
      visible: false,
      imgUrlList: []
    };
  },
  components: {
    attachment (resolve) {
      require(['../../upload/attachment'], resolve);
    },
    uploadFile (resolve) {
      require(['../../upload/uploadFile'], resolve);
    },
    imageViewer (resolve) {
      require(['../../upload/imageViewer.vue'], resolve);
    }
  },
  computed: {
    imageViewerList () {
      if (this.imgUrlList.length === 0) return;
      const arr = [];
      for (const i in this.imgUrlList) {
        const item = this.imgUrlList[i];
        const fileSuffix = item.fileSuffix.toLowerCase();
        // 为图片预览
        if (/jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga/.test(fileSuffix)) {
          item.imagePath = this.imageUrl + item.filePath;
          arr.push(item);
        }
      }
      return arr;
    }
  },
  created () {
    this.authButtonList = this.$route.meta.authButtonList && this.$route.meta.authButtonList.map(v => v.resUrl);
    this.localConfig.cellClassName = this.getCellClassName;
  },
  props: {
    // 配置
    config: {
      type: Object,
      default: () => {
        const params = {
          tableList: [],
          doNotCheck: []
        };
        return params;
      }
    },
    getRowClassName: {
      type: Function
    },
    filterHandler: {
      type: Function
    }
  },
  watch: {
    'config.tableData': {
      handler () {
        // 默认选中第一行
        if (this.config.defaultSeleFirstLine) {
          this.$nextTick(() => {
            if (this.rowIndex >= 0) {
              this.$refs.queryTable && this.$refs.queryTable.setCurrentRow(this.config.tableData[this.rowIndex]);
            } else {
              this.$refs.queryTable && this.$refs.queryTable.setCurrentRow(this.config.tableData[0]);
            }
          });
        }
        // 多选
        this.$nextTick(() => {
          const attachmentDownloadList = this.config.tableList.filter(v => v.formType === 'attachmentDownload');
          if (attachmentDownloadList) {
            const fileIds = [];
            for (const item of attachmentDownloadList) {
              fileIds.push(...this.config.tableData.filter(v => v[item.prop]).map(v => v[item.prop]));
            }
            const data = {
              fileIds: fileIds.map((item) => (item = Number(item)))
            };
            this.$store.dispatch('publicApi/getFilepath', data).then(res => {
              this.gridDownloadData = res.results;
            });
          }
          this.toggleSelection(this.config.selectedList);
        });
      },
      immediate: true
    },
    'config.tableList': {
      handler () {
        this.loading = true;
        this.$nextTick(() => {
          // this.$refs.queryTable && this.$refs.queryTable.doLayout();
          this.loading = false;
        });
      },
      deep: true
    },
    // 多选
    'config.selectedList': {
      handler () {
        this.$nextTick(() => {
          this.config.selectedList && (this.checkList = this.$clone(this.config.selectedList));
          this.toggleSelection(this.config.selectedList);
        });
      },
      immediate: true
    },
    // 多选是删除某一行后，取消勾选
    'config.deleteObj': {
      handler () {
        this.setDeleteTableStatus(this.config.deleteObj);
      },
      immediate: true
    }
  },
  methods: {
    setFilename (fileId) {
      if (!fileId) return '';
      const info = this.gridDownloadData.find(v => `${v.id}` === `${fileId}`);
      if (info) {
        return this.fileNameFilvalter(info);
      }
    },
    // 文件名称
    fileNameFilvalter (item) {
      const fileName = item.fileName ? item.fileName.substr(0, item.fileName.lastIndexOf('_')) : '';
      return fileName ? `${fileName}.${item.fileSuffix}` : '';
    },
    // 下载图片资源
    downFilePath (fileId) {
      const info = this.gridDownloadData.find(v => `${v.id}` === `${fileId}`);
      if (info) {
        const url = `${this.$utils.config.fileCmsUrl}${fileId}`;
        const link = document.createElement('a');
        link.style.display = 'none';
        link.target = '_Blank';
        link.href = url;
        link.target = '_Blank';
        const fileName = this.fileNameFilvalter(info);
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      }
    },
    // 判断是否能预览
    judgeFile (fileId) {
      const item = this.gridDownloadData.find(v => `${v.id}` === `${fileId}`);
      if (!item) return false;
      const fileSuffix = item.fileSuffix.toLowerCase();
      return /jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga|ppt|doc|xls|xlsx|docx|pptx|txt|pdf/.test(fileSuffix);
    },
    // 文件预览
    handleViewer (fileId) {
      const item = this.gridDownloadData.find(v => `${v.id}` === `${fileId}`);
      this.imgUrlList = [item];
      const fileSuffix = item.fileSuffix.toLowerCase();
      // 为图片预览
      if (/jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga/.test(fileSuffix)) {
        this.handleImageViewer(item);
      }
      if (/ppt|doc|xls|xlsx|docx|pptx|txt|pdf/.test(fileSuffix)) {
        this.handleFileInfo(item);
      }
    },
    handleImageViewer (item) {
      this.currentImg = this.$utils.config.imageUrl + item.filePath;
      this.visible = true;
    },
    getClearImg () {
      this.visible = false;
    },
    // 文件预览
    handleFileInfo (row) {
      const url = `${this.$utils.config.fileViewUrl}${row.id}`;
      window.open(url);
    },
    // 行拖拽
    rowDrop () {
      this.$nextTick(() => {
        const table = this.$refs.queryTable.$el;
        const tbody = table.querySelector('.el-table__body-wrapper tbody');
        /* eslint-disable */
        const _this = this;
        Sortable.create(tbody, {
          onEnd ({ newIndex, oldIndex }) {
            const currRow = _this.tableData.splice(oldIndex, 1)[0];
            _this.tableData.splice(newIndex, 0, currRow);
          },
        });
      });
    },
    getCellClassName ({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'operate') {
        return 'operate';
      }
      if (row[`isRuddy-${column.property}`]) {
        return 'error'
      }
      return '';
    },
    // 对 Table 进行重新布局
    tableDoLayout () {
      this.$refs.queryTable && this.$refs.queryTable.doLayout();
    },
    // 展开行
    tableToggleRowExpansion (row, status) {
      this.$refs.queryTable && this.$refs.queryTable.toggleRowExpansion(row, status);
      this.$refs.queryTable && this.$refs.queryTable.doLayout();
    },
    toggleRowExpansionAll (data, isExpandAll) {
      data.forEach((item) => {
          this.$refs.queryTable.toggleRowExpansion(item, isExpandAll);
          if (item.children !== undefined && item.children !== null) {
            this.toggleRowExpansionAll(item.children, isExpandAll);
          }
      });
    },
    // 设置某一行的状态
    setRowStatus (row) {
      for (const v of this.config.tableData) {
        if (row[this.config.rowKey || this.localConfig.rowKey] === v[this.config.rowKey || this.localConfig.rowKey]) {
          this.$refs.queryTable && this.$refs.queryTable.toggleRowSelection(v, false);
        }
      }
    },
    // 清除全部勾选状态
    clearSelectionTable () {
      this.$refs.queryTable && this.$refs.queryTable.clearSelection();
    },
    // 切换选中状态
    toggleAllSelectionStatus (type) {
      this.$refs.queryTable && this.$refs.queryTable.toggleAllSelection(type);
    },
    // 删除某一行后取消勾选
    setDeleteTableStatus (deleteObj) {
      if (deleteObj && deleteObj[this.config.rowKey || this.localConfig.rowKey]) {
        this.$nextTick(() => {
          const index = this.config.tableData.findIndex(v => v[this.config.rowKey || this.localConfig.rowKey] === this.config.deleteObj[this.config.rowKey || this.localConfig.rowKey]);
          if (index >= 0) {
            this.$refs.queryTable && this.$refs.queryTable.toggleRowSelection(this.config.tableData[index], false);
          }
        });
      }
    },
    // 禁止勾选
    selectable (row, index) {
      if (this.config.selectable) {
        return this.config.selectable(row, index);
      }
      if (this.config.doNotCheck && this.config.doNotCheck.length) {
        for (const item of this.config.doNotCheck) {
          if (row[this.config.rowKey || this.localConfig.rowKey] === item[this.config.rowKey || this.localConfig.rowKey]) {
            return false;
          } else {
            return true;
          }
        }
      } else if (row.doNotCheck) {
        return false;
      } else {
        return true;
      }
    },
    // 勾选
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.toggleSelectionChildren(row[this.config.rowKey || this.localConfig.rowKey], this.config.tableData);
        });
      } else {
        this.$refs.queryTable && this.$refs.queryTable.clearSelection();
      }
    },
    toggleSelectionChildren (rowKey, arr) {
      for (const v of arr) {
        if (rowKey === v[this.config.rowKey || this.localConfig.rowKey]) {
          this.$refs.queryTable && this.$refs.queryTable.toggleRowSelection(v, true);
        } else if (v.children && v.children.length) {
          this.toggleSelectionChildren(rowKey, v.children);
        }
      }
    },
    async selectionChange (val) {
      if (this.config.isRadio) { // 单选
        if (val.length > 1) {
          this.$refs.queryTable && this.$refs.queryTable.clearSelection();
          this.$refs.queryTable && this.$refs.queryTable.toggleRowSelection(val[val.length - 1]);
        }
        if (val.length > 1) {
          this.selectionChangeList = [val[val.length - 1]];
        } else {
          this.selectionChangeList = val;
        }
        this.$emit('update:tableList', this.selectionChangeList);
        this.$emit('tableList', this.selectionChangeList);
      } else if (this.config.isCheckbox) {
        // const checkList = this.$clone(this.checkList);
        // for (const item of val) {
        //   const index = await checkList.findIndex(v => v[this.config.rowKey || this.localConfig.rowKey] === item[this.config.rowKey || this.localConfig.rowKey]);
        //   if (index >= 0) {
        //     await checkList.splice(index, 1);
        //   }
        // }
        // this.checkList = this.$clone(checkList);
        // const data = this.unique(val);
        // const selectionChangeList = data.concat(this.checkList);
        // this.selectionChangeList = this.unique(selectionChangeList);

        const data = this.unique(val);
        this.selectionChangeList = data;
        const tableList = this.selectionChangeList;
        this.$emit('update:tableList', tableList);
        this.$emit('tableList', tableList);
      }
    },
    clickRow (row, column, event) {
      if (this.config.selectableMessage) {
        this.config.selectableMessage(row); // 自定义提示
      }
      if (this.config.selectable) {
        if (!this.config.selectable(row)) return; // 自定义禁止勾选
      }
      if (row.doNotCheck) {
        return;
      }
      if (this.config.doNotCheck && this.config.doNotCheck.length) {
        for (const item of this.config.doNotCheck) {
          if (row[this.config.rowKey || this.localConfig.rowKey] === item[this.config.rowKey || this.localConfig.rowKey]) {
            return;
          }
        }
        this.$emit('rowClick', row);
        if (this.config.isRadio) { // 单选
          this.$refs.queryTable && this.$refs.queryTable.clearSelection();
          this.$refs.queryTable && this.$refs.queryTable.toggleRowSelection(row);
        } else if (this.config.isCheckbox) {
          row.children && row.children.forEach(item => {
            this.$refs.queryTable && this.$refs.queryTable.toggleRowSelection(item);
          });
          this.$refs.queryTable && this.$refs.queryTable.toggleRowSelection(row);
        }
      } else {
        this.$emit('rowClick', row);
        if (this.config.isRadio) { // 单选
          this.$refs.queryTable && this.$refs.queryTable.clearSelection();
          this.$refs.queryTable && this.$refs.queryTable.toggleRowSelection(row);
        } else if (this.config.isCheckbox) {
          row.children && row.children.forEach(item => {
            this.$refs.queryTable && this.$refs.queryTable.toggleRowSelection(item);
          });
          this.$refs.queryTable && this.$refs.queryTable.toggleRowSelection(row);
        }
      }
    },
    unique (arr) {
      const list = []; // 选中
      arr.forEach(item => {
        const index = list.findIndex(v => v[this.config.rowKey || this.localConfig.rowKey] === item[this.config.rowKey || this.localConfig.rowKey]);
        if (index < 0) {
          list.push(item);
        }
      });
      return list;
    },
    // 操作
    setFn (btnParameter, row) {
      this.$emit('fnName', {
        row,
        btnParameter
      });
    },
    // 查看附件
    handleViewAttachment (value, item, row) {
      if (!value) {
        return;
      }
      this.isEdit = item.isEdit;
      this.isUpload = item.isUpload;
      const attachmentIdList = value.split(',');
      const data = {
        fileIds: attachmentIdList.map((item) => (item = Number(item)))
      };
      this.$store.dispatch('publicApi/getFilepath', data).then(res => {
        this.gridData = res.results;
        this.dialogAttachment = true;
      });
    },
    // 数据字典
    setDicData (value, selectList, item) {
      const index = selectList && selectList.findIndex(v => v.dataCode === value);
      if (index < 0) return '';
      return selectList ? item.isTranslate ? this.$t(selectList[index].dataName) : selectList[index].dataName : '';
    },
    // 系统状态
    statusFilter (status) {
      const index = this.$store.state.constant.statusList.findIndex(v => v.dataCode === status);
      if (index >= 0) {
        return this.$t(this.$store.state.constant.statusList[index].dataName);
      } else {
        return '';
      }
    },
    // 审批状态
    flowStatusFilter (flowStatus) {
      const index = this.$store.state.constant.flowStatusList.findIndex(v => v.dataCode === flowStatus);
      if (index >= 0) {
        return this.$t(this.$store.state.constant.flowStatusList[index].dataName);
      } else {
        return '';
      }
    },
    // 默认选中第一行
    handleCurrentChange (val) {
      this.rowIndex = this.config.tableData.findIndex(v => v[this.config.rowKey] === val[this
        .config.rowKey]);
      this.$emit('update:tableRow', val);
    },
    // 有流程时禁用,
    handleFlowStatus(row, but) {
      if (but.enable) return false;
      if (!this.disbaleCreateBy(row, but)) return true;
      // 自定义禁用条件
      if (but.enableStatus && but.enableStatus.length > 0) {
        for (const item of but.enableStatus) {
          return !item.value.includes(row[item.receive]);
        }
      }
      if (but.code === 'sysHandleInfo') return false;
      if (but.isFlowStatus) return false; // 不受流程状态控制
      if (!row.flowStatus) return false;
      if (row.flowStatus === '0') return false;
      return true;
    },

    // 表格事件
    eventEmit (eventName, params) {
      this.$emit('onTableEvent', { event: eventName, params });
    },
    // 操作列业务事件
    onEvent (option, row) {
      this.$store.commit('saveOperationId', option.id);
      this.$emit('onEvent', { event: option.event, option, params: row });
    },
    // 按钮禁用的方法
    // 是否是本人禁用
    disbaleCreateBy (row, but) {
      if (!but.isCreateBy) return true;
      if (!row.createBy) return true;
      const createBy = row.createBy;
      const userId = Auth.hasUserInfo().userId;
      return createBy === userId;
    },
    // 流程状态禁用
    disableFlowStatus (row, but) {
      if (!row.flowStatus) return false;
      if (row.flowStatus === '0') return false;
      return true;
    },
    // 将上传文件传出
    attachmentUpdata (attachment, row) {
      this.$emit('fnName', {
        row,
        btnParameter: { fn: 'attachmentUpdataSave' },
      });
    },
    // 对表格进行排序
    sortChangeMethod (column) {
      this.$emit('sortChangeColumn', column);
    }
  }
};

</script>
<style lang="scss" scoped>
.file-list {
  display: flex;
  justify-content: space-around;
}
/deep/ .el-table {
  thead {
    .cell {
      height: 23px;
    }
  }
  tbody {
    .cell {
      min-height: 23px;
      height: auto;
    }
  }
}
.attachmentUpdata {
  display: flex;
  justify-content: space-between;
}
/deep/.el-progress-bar__innerText {
    color: #fff!important;
    line-height: 25px !important;
    margin-bottom: 9px;
}
  /deep/.el-progress-bar__outer {
    border-radius: 5px!important;
}
/deep/.el-progress-bar__inner {
    border-radius: 5px!important;
}
</style>
