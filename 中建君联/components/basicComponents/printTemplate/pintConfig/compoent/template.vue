<template>
  <div class="businessWrap EnterpriseConfiguration">
    <div class="main_title">
      <div class="addTitle">
        <div v-show="!isPrint && showButtons">
          <el-button type="primary" icon="el-icon-check" size="mini"
            @click="handleExcessive('PersonFormSave')">{{$t('print.preservation')}}
          </el-button>
        </div>
        <div v-show="isPrint&& showButtons">
          <!-- 下载pdf -->
          <el-button type="primary" icon="iconfont icon-xiazaidaoru" size="mini"
            @click="handleDownloadPdf">{{$t('print.downloadPdf')}}
          </el-button>
          <!-- 上传pdf -->
          <el-button type="primary" icon="el-icon-upload2" size="mini" style="margin-right: 8px;"
            @click="handleUploadPdf">{{$t('print.uploadPdf')}}
          </el-button>
          <el-popover placement="top-start" width="400" trigger="hover">
            <div>
              <span>{{$t('print.uploadPdfTitle')}}</span>
            </div>
            <i class="el-icon-question" slot="reference"></i>
          </el-popover>
          <el-divider direction="vertical"></el-divider>
          <!-- 启用页码-->
          <div class="isPaperNumber">
            <el-checkbox style="line-height: 36px; margin-right: 10px; color: #009F3A;" v-model="isPaperNumber">
              {{$t('print.isPaperNumber')}}
            </el-checkbox>
          </div>
          <el-divider direction="vertical"></el-divider>
          <!-- 字体大小 -->
          <div class="borderSet">
            <span>{{$t('print.fontSize')}}:</span>
            <el-radio-group v-model="fontSize" style="margin: 0 10px;">
              <el-radio label="12">{{$t('print.small')}}</el-radio>
              <el-radio label="14">{{$t('print.in')}}</el-radio>
              <el-radio label="16">{{$t('print.large')}}</el-radio>
            </el-radio-group>
          </div>
          <el-divider direction="vertical"></el-divider>
          <el-radio-group v-model="isPortrait" style="margin: 0 10px;">
            <!-- 纵向打印 -->
            <el-radio :label="true" v-if="formCode !== 'receiptTracking'">{{$t('print.verticalPrinting')}}</el-radio>
            <!-- 横向打印 -->
            <el-radio :label="false">{{$t('print.landscapePrinting')}}</el-radio>
          </el-radio-group>
          <el-divider direction="vertical"></el-divider>
          <!-- 有无边框 -->
          <el-radio-group v-model="isBoder" style="margin: 0 10px;" v-if="false">
            <!-- 有边框 -->
            <el-radio :label="hasBorderStyle">{{$t('print.hasBorder')}}</el-radio>
            <!-- 无边框 -->
            <el-radio :label="noBorderStyle">{{$t('print.noBorder')}}</el-radio>
          </el-radio-group>
          <el-divider direction="vertical"></el-divider>
          <!-- 是否打印子表 -->
          <div class="borderSet">
            <span>{{$t('print.isTableShow')}}:</span>
            <el-switch v-model="isTableShow" active-color="#13ce66" inactive-color="#C0CCDA">
            </el-switch>
          </div>
          <el-divider direction="vertical"></el-divider>
          <!-- 边框 -->
          <div class="borderSet">
            <span>{{$t('print.border')}}:</span>
            <el-select v-model="borderList" size="small" multiple collapse-tags clearable>
              <el-option :label="$t('print.mainDate')" value="01" />
              <el-option :label="$t('print.detailData')" value="02" />
              <el-option :label="$t('dialog.approvalRecord')" value="03" />
              <el-option :label="$t('print.tableFooter')" value="04" />
            </el-select>
          </div>
          <el-divider direction="vertical"></el-divider>
          <el-button type="primary" icon="el-icon-printer" size="mini"
            @click="handleExcessive('handlePrintPreview')">{{$t('print.print')}}
          </el-button>
          <!-- 获取审批签名 -->
          <el-button type="primary" icon="el-icon-edit-outline" size="mini"
            v-if="printBottomList.length && approvalRecordShow"
            @click="handleExcessive('getApprovalSignature')">{{$t('print.getApprovalSignature')}}
          </el-button>
          <!-- 打印预览 -->
          <!-- <el-button type="primary" icon="el-icon-third-excel" size="mini"
                     @click="handleExcessive('handlePrintDesign')">{{$t('print.printView')}}
          </el-button> -->
        </div>
      </div>
    </div>
    <div class="rolCons" v-if="!isPrint">
      <div class="businessCons" style="min-width: 450px;flex: 1">
        <div class="businessCons_fix">
          <div ref="col" class="contents">
            <div class="title">
              <!-- 打印字段设置 -->
              {{$t('print.fieldSettings')}}
              <el-button type="primary" size="mini" @click="handlePrintReset">
                <!-- 恢复默认 -->
                {{$t('print.restoreDefault')}}
              </el-button>
            </div>
            <div class="printForm editTable">
              <h4>
                <!-- 表头 -->
                {{$t('print.header')}}
              </h4>
              <el-table :data="printMainList" stripe class="printMainTable" style="width: 100%;">
                <template slot="empty">
                  <img class="data-pic" src="static/images/no-data.png" alt="">
                </template>
                <!-- 选中 Select -->
                <el-table-column prop="taskName" width="50" :label="$t('print.select')">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.flag">
                    </el-checkbox>
                  </template>
                </el-table-column>
                <!-- 排序 -->
                <el-table-column type="index" :label="$t('print.index')" width="50px">
                </el-table-column>
                <!-- 名称 -->
                <el-table-column show-overflow-tooltip prop="columnName" :label="$t('print.columnName')">
                </el-table-column>
                <!-- 属性 -->
                <el-table-column show-overflow-tooltip :label="$t('print.status')">
                  <template slot-scope="scope">
                    <span>{{setStatus(scope.row.status)}}</span>
                  </template>
                </el-table-column>
                <!-- 值 -->
                <el-table-column prop="columnValue" show-overflow-tooltip min-width="140"
                  :label="$t('print.columnValue')">
                  <template slot-scope="scope"
                    v-if="scope.row.columnCode !== 'approvalRecord' && scope.row.columnCode !== 'logoShow'">
                    <el-input size="small" :maxlength="32" v-model.trim="scope.row.columnValue">
                    </el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="printForm editTable">
              <!-- 主数据 保存后可拖拽排序 -->
              <h4>{{$t('print.mainDate')}} <span>({{$t('print.afterSaving')}})</span></h4>
              <el-table :data="processList" row-key="id" stripe class="printHeadTable" style="width: 100%;">
                <template slot="empty">
                  <img class="data-pic" src="static/images/no-data.png" alt="">
                </template>
                <el-table-column prop="taskName" width="50" :label="$t('print.select')">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.flag">
                    </el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column type="index" :label="$t('print.index')" width="50px">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="columnName" :label="$t('print.columnName')">
                </el-table-column>
                <el-table-column show-overflow-tooltip :label="$t('print.status')">
                  <template slot-scope="scope">
                    <span>{{setStatus(scope.row.status)}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="width" show-overflow-tooltip :label="$t('print.width')">
                  <template slot-scope="scope">
                    <el-select v-model.trim="scope.row.width" size="small" style="width:100%">
                      <el-option label="6" :value="6"></el-option>
                      <el-option label="8" :value="8"></el-option>
                      <el-option label="16" :value="16"></el-option>
                      <el-option label="24" :value="24"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="printForm editTable">
              <!-- 明细数据 -->
              <h4>{{$t('print.detailData')}} <span>({{$t('print.afterSaving')}})</span></h4>
              <el-table :data="list" row-key="id" stripe class="printListTable" style="width: 100%;">
                <template slot="empty">
                  <img class="data-pic" src="static/images/no-data.png" alt="">
                </template>
                <el-table-column prop="taskName" width="50" :label="$t('print.select')">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.flag">
                    </el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column type="index" :label="$t('print.index')" width="50px">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="columnName" :label="$t('print.columnName')">
                </el-table-column>
                <el-table-column show-overflow-tooltip :label="$t('print.status')">
                  <template slot-scope="scope">
                    <span>{{setStatus(scope.row.status)}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="width" show-overflow-tooltip :label="$t('print.width')">
                  <template slot-scope="scope">
                    <el-number controls-position="right" size="small" :max="100" :min="5" :precision="0"
                      v-model.trim="scope.row.width">
                    </el-number>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="printForm editTable">
              <!-- 表尾 -->
              <h4>{{$t('print.tableFooter')}} <span>({{$t('print.afterSaving')}})</span>
                <span @click="printShow=true" class="add"><i class="el-icon-plus"></i></span>
                <span @click="handleDelete" class="add"><i class="el-icon-delete"></i></span>
              </h4>
              <el-table :data="printFooterList" row-key="columnCode" @row-click='handleChangeRole'
                :row-class-name="tableRowClassName" class="printBottomTable" style="width: 100%;">
                <template slot="empty">
                  <img class="data-pic" src="static/images/no-data.png" alt="">
                </template>
                <el-table-column prop="taskName" width="50" :label="$t('print.select')">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.flag">
                    </el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column type="index" :label="$t('print.index')" width="50px">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="columnName" :label="$t('print.columnName')">
                </el-table-column>
                <el-table-column show-overflow-tooltip :label="$t('print.status')">
                  <template slot-scope="scope">
                    <span>{{setStatus(scope.row.status)}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="columnValue" show-overflow-tooltip :label="$t('print.columnValue')">
                </el-table-column>
                <el-table-column prop="width" show-overflow-tooltip :label="$t('print.width')">
                  <template slot-scope="scope">
                    <el-select v-model.trim="scope.row.width" size="small" style="width:100%">
                      <el-option label="8" :value="8"></el-option>
                      <el-option label="16" :value="16"></el-option>
                      <el-option label="24" :value="24"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 底部隐藏 -->
            <div v-if="false" class="printForm editTable">
              <!-- 底部 -->
              <h4>{{$t('print.footerData')}} <span>({{$t('print.afterSaving')}})</span></h4>
              <el-table :data="printFooterList" row-key="columnCode" stripe class="printFooterTable"
                style="width: 100%;">
                <template slot="empty">
                  <img class="data-pic" src="static/images/no-data.png" alt="">
                </template>
                <el-table-column prop="taskName" width="50" :label="$t('print.select')">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.flag">
                    </el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column type="index" :label="$t('print.index')" width="50px">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="columnName" :label="$t('print.columnName')">
                </el-table-column>
                <el-table-column show-overflow-tooltip :label="$t('print.status')">
                  <template slot-scope="scope">
                    <span>{{setStatus(scope.row.status)}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="columnValue" show-overflow-tooltip :label="$t('print.columnValue')">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="businessCons" style="flex: 3">
        <div class="businessCons_fix">
          <div ref="col" class="contents cons-info">
            <div class="title">
              <!-- 效果预览 -->
              {{$t('print.effectPreview')}}
            </div>
            <div class="print-content">
              <div v-show="item.flag" :style="h4Style" style="line-height: 32px;font-weight: bold;"
                v-for="(item,index) in printMainList" :key="index">
                {{item.columnValue}}
                <img :src="logoUrl" class="printLogo" :style="logoStyle"
                  v-if="item.columnCode === 'logoShow' && item.flag && logoUrl">
              </div>
              <div style="overflow: hidden" v-if="list.length">
                <div :style="mainFormStyle + isBoder">
                  <div :style="isBoder + mainItemStyle + pStyle+'width:'+(item.width/8*(100/3))+'%'" v-show="item.flag"
                    v-for="(item, index) in processList" :key="`${item.columnCode}-${index}`">
                    <div style="width:150px;display: block;float: left;font-weight: bold;border-right:1px solid rgb(51, 51, 51);
                            box-sizing: border-box;padding:8px 5px;height: auto;" :style="isBoder">
                      {{item.columnName}}
                    </div>
                    <div :style="`${isBoder}font-size: ${fontSize}px;`"
                      style="width:calc(100% - 150px);float: left;font-weight: normal;box-sizing: border-box;
                            padding:8px 5px;height: 100%;border-left:1px solid rgb(51, 51, 51);margin-left:-1px;box-sizing: border-box;word-wrap:break-word;word-break:break-all;">
                      {{item.columnValue}}
                    </div>
                  </div>
                </div>
              </div>
              <!-- 无子表 -->
              <div v-else class="print-cons" ref="cons" style="overflow: hidden;">
                <div v-if="formCode !== 'inquiryBidReport' && formCode !== 'inquireCalibra'"
                  style="text-align: center;margin-top: 10px;border: 1px solid; border-bottom: none;line-height: 40px;"
                  :style="isBoder">
                  <!-- <div
                    v-show="item.flag && (item.columnCode !== 'approvalRecord' || item.columnCode !== 'logoShow')" v-for="(item,index) in printMainList" :key="index"
                    :style="h4StylePay">
                    <span style="padding: 0 5px;">{{item.columnValue}}</span>
                  </div> -->
                </div>
                <div style="overflow: hidden;">
                  <div :style="mainFormStyle">
                    <div :style="mainItemStyle + pStyle+'width:'+(item.width/8*(100/3))+'%'" v-show="item.flag"
                      v-for="(item, index) in processList" :key="`${item.columnCode}-${index}`">
                      <div
                        style="width:150px;display: block;float: left;font-weight: bold;border-right:1px solid rgb(51, 51, 51);box-sizing: border-box;padding:8px 5px;height: auto;">
                        {{item.columnName}}
                      </div>
                      <div :style="`font-size: ${fontSize}px;`"
                        style="width:calc(100% - 150px);float: left;font-weight: normal;box-sizing: border-box;
                            padding:8px 5px;height:100%;border-left:1px solid rgb(51, 51, 51);margin-left:-1px;box-sizing: border-box;word-wrap:break-word;word-break:break-all;">
                        {{item.columnValue}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tableCons" style="padding: 0;margin-top: 0 !important;">
                <table border=0 cellSpacing=0 cellPadding=0 width="100%" style="border-collapse:collapse;">
                  <thead v-if="list.length">
                    <tr>
                      <td :style="`${tableTdStyle + isBoder}font-size: ${fontSize}px;`" style="width: 5%;">
                        {{$t('print.index')}}</td>
                      <td :style="isBoder + 'width:'+(item.width)+'%'" v-show="item.flag"
                        style="padding: 10px 0;text-align: center;" v-for="(item,index) in list" :key="index">
                        {{item.columnName}}
                      </td>
                    </tr>
                  </thead>
                  <tbody v-if="list.length">
                    <tr>
                      <td :style="`${tableTdStyle + isBoder}font-size: ${fontSize}px;`">1</td>
                      <td v-show="item.flag" :style="`${tableTdStyle + isBoder}font-size: ${fontSize}px;`"
                        v-for="(item,index) in list" :key="index">
                      </td>
                    </tr>
                    <tr>
                      <td :style="`${tableTdStyle}font-size: ${fontSize}px;`">2</td>
                      <td v-show="item.flag" :style="`${tableTdStyle}font-size: ${fontSize}px;`"
                        v-for="(item,index) in list" :key="index">
                      </td>
                    </tr>
                    <tr>
                      <td :style="`${tableTdStyle}font-size: ${fontSize}px;`">3</td>
                      <td v-show="item.flag" :style="`${tableTdStyle}font-size: ${fontSize}px;`"
                        v-for="(item,index) in list" :key="index">
                      </td>
                    </tr>
                    <tr v-if="approvalRecordShow"
                      style="border:1px solid rgb(51, 51, 51);height: 30px;line-height: 30px;text-align:left;"
                      :style="isBoder">
                      <td :colspan="list.length+1" :style="processTitleStyle"
                        style="padding-left:30px;font-weight:bold;">
                        <!-- 审批记录 -->
                        {{$t('dialog.approvalRecord')}}
                      </td>
                    </tr>
                    <tr v-if="approvalRecordShow" :style="processTitleStyle + isBoder"
                      style="border:1px solid rgb(51, 51, 51);">
                      <td :colspan="list.length+1">
                        <div :style="processTitleStyle"
                          style="display: flex;align-items: center;justify-content: center;">
                          <!-- 序号 -->
                          <span :style="processTitlSpanIndexStyle">{{$t('fConfig.serialNumber')}}</span>
                          <!-- 节点名称 -->
                          <span :style="processTitlSpanNameStyle">{{$t('dialog.nodeName')}}</span>
                          <!-- 审批人 -->
                          <span :style="processTitlSpanPersonStyle">{{$t('dialog.approvedBy')}}</span>
                          <!-- 签名 -->
                          <span :style="processTitlSpanSignStyle">{{$t('dialog.autograph')}}</span>
                          <!-- 审批时间 -->
                          <span :style="processTitlSpanTimeStyle">{{$t('dialog.approvalTime')}}</span>
                          <!-- 意见 -->
                          <span :style="processTitlSpanCommentStyle">{{$t('dialog.opinion')}}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                  <!-- 底部分页隐藏 -->
                  <tfoot class="table-footer" :style="`${tableConsStyle}font-size: ${fontSize}px;`"
                    style="padding: 0 30px;border: 0 !important;">
                    <tr v-if="false">
                      <th :style="`${tableTdStyle1 + isBoder}font-size: ${fontSize}px;`" :colspan="list.length+1">
                        <h3 v-show="item.flag" :style="`${h3Style1}font-size: ${fontSize}px;`"
                          v-for="(item,index) in printBottomList" :key="index">
                          {{item.columnName}}：
                          <img :src="item.url" :style="signPicStyle" v-if="item.url">
                        </h3>
                      </th>
                    </tr>
                    <tr>
                      <th :style="`${tableTdStyle1 + isBoder}font-size: ${fontSize}px;`" :colspan="list.length+1">
                        <h3 v-show="item.flag"
                          :style="`${h3Style1}font-size: ${fontSize}px;width:${(item.width || 24)/8*(100/3)}%;`"
                          v-for="(item,index) in printFooterList" :key="index">
                          <span :style="`font-size: ${fontSize}px;`" style="font-weight: normal;">{{item.columnName}}
                            &nbsp;&nbsp; {{item.columnValue}}
                          </span>
                        </h3>
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rolCons" v-else>
      <div class="businessCons" v-if="formCode === 'inquiryBidReport' || formCode === 'inquireCalibra'" ref="print"
        style="flex: 3">
        <div class="businessCons_fix">
          <div ref="col" class="contents cons-info">
            <div class="print-content" style="border: 0;">
              <!-- 有子表 -->
              <div class="print-cons" v-if="customList.firstHead && customList.firstHead.length" ref="cons"
                style="overflow: hidden;">
                <div v-show="item.flag && (item.columnCode !== 'approvalRecord' || item.columnCode !== 'logoShow')"
                  :style="h4Style" style="font-weight: bold;height: 30px;" v-for="(item,index) in printMainList"
                  :key="index">
                  {{item.columnValue}}
                  <img :src="logoUrl" class="printLogo" :style="logoStyle"
                    v-if="item.columnCode === 'logoShow' && item.flag && logoUrl">
                </div>
                <div style="overflow: hidden">
                  <div :style="mainFormStyle + mainDateBorder">
                    <div
                      :style="mainDateBorder + mainItemStyle + pStyle+'width:'+(item.width/8*(100/3))+'%;'+'font-size:'+fontSize+'px'"
                      v-show="item.flag" v-for="(item, index) in processList" :key="`${item.columnCode}-${index}`"
                      style="height: 100%;">
                      <div style="width:150px;display: block;float: left;font-weight: bold;border-right:1px solid rgb(51, 51, 51);
                            box-sizing: border-box;padding:8px 5px;height: auto;" :style="mainDateBorder">
                        {{item.columnName}}
                      </div>
                      <div :style="`${mainDateBorder}font-size: ${fontSize}px;`" style="width:calc(100% - 150px);float: left;font-weight: normal;box-sizing:
                            border-box;padding:8px 5px; height: 100%;border-left:1px solid rgb(51, 51, 51);margin-left:-1px;
                            box-sizing: border-box;word-wrap:break-word;word-break:break-all;">
                        {{item.columnValue | systemFilters(item)}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 无子表 -->
              <div v-else class="print-cons" ref="cons" style="overflow: hidden;">
                <div
                  style="text-align: center;margin-top: 10px;border: 1px solid; border-bottom: none;line-height: 40px;"
                  :style="mainDateBorder">
                  <div v-show="item.flag && (item.columnCode !== 'approvalRecord' || item.columnCode !== 'logoShow')"
                    v-for="(item,index) in printMainList" :key="index" :style="h4StylePay">
                    <span style="padding: 0 5px;">
                      {{item.columnValue}}
                    </span>
                    <img :src="logoUrl" class="printLogo" :style="logoStyle"
                      v-if="item.columnCode === 'logoShow' && item.flag && logoUrl">
                  </div>
                </div>
                <div style="overflow: hidden;">
                  <div :style="mainFormStyle + mainDateBorder">
                    <div :style="mainItemStyle + mainDateBorder + pStyle+'width:'+(item.width/8*(100/3))+'%'"
                      v-show="item.flag" v-for="(item, index) in processList" :key="`${item.columnCode}-${index}`"
                      style="height: 100%;">
                      <div style="width:150px;display: block;float: left;font-weight: bold;border-right:1px solid rgb(51, 51, 51);
                            box-sizing: border-box;padding:8px 5px;height: auto;" :style="mainDateBorder">
                        {{item.columnName}}
                      </div>
                      <div :style="`${mainDateBorder}font-size: ${fontSize}px;`" style="width:calc(100% - 150px);float: left;font-weight: normal;box-sizing: border-box;
                            padding:8px 5px; height: 100%;border-left:1px solid rgb(51, 51, 51);margin-left:-1px;box-sizing: border-box;
                            word-wrap:break-word;word-break:break-all;">
                        {{item.columnValue | systemFilters(item)}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div :style="`${tableConsStyle}font-size: ${fontSize}px;`" class="tableCons"
                style="margin-top: 0 !important;" ref="table">
                <table border=0 cellSpacing=0 cellPadding=0 width="100%" style="border-collapse:collapse;"
                  :style="borderList.filter(v => v === '01').length === 0 && 'border:none;'">
                  <thead v-if="isTableShow">
                    <tr class="firstHead">
                      <td v-for="(item,index) in customList.firstHead" :key="index" :colspan="item.colspan"
                        :rowspan="item.rowspan"
                        :style="`${tableTdStyle + detailDataBorder}font-size: ${fontSize}px;width: ${item.width}%`"
                        style="width: 5%;font-weight: bold;" v-show="item.flag">
                        {{item.columnName}}
                      </td>
                    </tr>
                    <tr class="twoHead">
                      <td v-for="(item,index) in customList.twoHead" :key="index"
                        :style="`${tableTdStyle + detailDataBorder}font-size: ${fontSize}px;width: ${item.width}%`"
                        style="width: 5%;font-weight: bold;" v-show="item.flag">
                        <span>{{item.columnName}}</span>
                      </td>
                    </tr>
                  </thead>
                  <tbody v-if="customList.firstHead && customList.firstHead.length">
                    <template v-if="tableList.length && isTableShow">
                      <tr v-for="(item,index) in tableList" :key="index">
                        <template v-for="(child,key) in item">
                          <template>
                            <td :style="`${tableTdStyle + detailDataBorder}font-size: ${fontSize}px;`"
                            style="width: 5%;font-weight: bold;" :key="key">
                            <span>
                              {{child | systemFilters({filterName: filterSubTable[key]})}}
                            </span>
                          </td>
                          </template>
                        </template>
                      </tr>
                    </template>
                    <tr style="border:1px solid rgb(51, 51, 51);height: 30px;line-height: 30px;text-align:left;"
                      v-if="showPrintBottomList()" :style="approvalBorder">
                      <td :colspan="customListColspan(customList)" :style="processTitleStyle + approvalBorder"
                        style="font-weight:bold;">
                        <!-- 审批记录 -->
                        <div :style="approvalBorder" style="border-top:1px solid rgb(51, 51, 51);padding-left:30px;">
                          {{$t('dialog.approvalRecord')}}</div>
                        <!-- <img :style="processNodepanSignImgStyle"
                        :src="require('https://static.junnysoft.cn/backstage/signPic_1601188525721.png')" alt="url" /> -->
                      </td>
                    </tr>
                    <tr :style="processTitleStyle + approvalBorder" style="border:1px solid rgb(51, 51, 51);"
                      v-if="showPrintBottomList()">
                      <td :colspan="customListColspan(customList)" :style="approvalBorder">
                        <div :style="processTitleStyle"
                          style="display: flex;align-items: center;justify-content: center;">
                          <!-- 序号 -->
                          <span :style="processTitlSpanIndexStyle">{{$t('fConfig.serialNumber')}}</span>
                          <!-- 节点名称 -->
                          <span :style="processTitlSpanNameStyle">{{$t('dialog.nodeName')}}</span>
                          <!-- 审批人 -->
                          <span :style="processTitlSpanPersonStyle">{{$t('dialog.approvedBy')}}</span>
                          <!-- 签名 -->
                          <span :style="processTitlSpanSignStyle">{{$t('dialog.autograph')}}</span>
                          <!-- 审批时间 -->
                          <span :style="processTitlSpanTimeStyle">{{$t('dialog.approvalTime')}}</span>
                          <!-- 意见 -->
                          <span :style="processTitlSpanCommentStyle">{{$t('dialog.opinion')}}</span>
                        </div>
                      </td>
                    </tr>
                    <template v-if="showPrintBottomList()">
                      <tr v-for="(item,index) in printBottomList" :key="item.id"
                        style="border:1px solid rgb(51, 51, 51);" :style="approvalBorder">
                        <td :colspan="customListColspan(customList)" :style="approvalBorder">
                          <div :style="processNodeStyle" v-show="item.flag">
                            <span :style="processNodepanIndexStyle">{{Number(index) + 1}}</span>
                            <span :style="processNodepanNameStyle">{{item.columnName}}</span>
                            <span :style="processNodepanPersonStyle">{{item.columnValue}}</span>
                            <span :style="processNodepanSignStyle">
                              <img :style="processNodepanSignImgStyle" :src="item.url" v-if="item.url" alt="url" />
                            </span>
                            <span :style="processNodepanTimeStyle">{{item.executeDate | setTime}}</span>
                            <span :style="processNodepanCommentStyle">{{item.comment}}</span>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
              <div ref="tfoot" class="tfootCon">
                <table border=0 cellSpacing=0 cellPadding=0 width="100%" style="border-collapse:collapse;"
                  :style="borderList.filter(v => v === '01').length === 0 && 'border:none;'">
                  <tfoot v-if="printFooterList.length" class="table-footer"
                    :style="`${tableConsStyle}font-size: ${fontSize}px;`" style="padding: 0 30px;border: 0 !important;">
                    <!-- isPortraitArray 是否纵向排列 -->
                    <tr v-if="isPortraitArray" :style="tableFooterBorder" style="border:1px solid rgb(51, 51, 51);">
                      <th :style="`${tableTdStyle1 + tableFooterBorder + noFooterBorder}font-size: ${fontSize}px;`"
                        :colspan="list.length+1" style="border:1px solid rgb(51, 51, 51);">
                        <h3 v-show="item.flag"
                          :style="`${h3Style1}font-size: ${fontSize}px;width:${(item.width || 24)/8*(100/3)}%;`"
                          v-for="(item,index) in printFooterList" :key="index">
                          <span :style="`font-size: ${fontSize}px;`" style="font-weight: normal;">{{item.columnName}}
                            &nbsp;&nbsp; {{item.columnValue}}
                          </span>
                        </h3>
                      </th>
                    </tr>
                    <tr v-else :style="tableFooterBorder" style="border:1px solid rgb(51, 51, 51);">
                      <th :style="`${tableTdStyle1 + tableFooterBorder + noFooterBorder}font-size: ${fontSize}px;`"
                        :colspan="list.length+1" style="border:1px solid rgb(51, 51, 51);">
                        <h3 v-show="item.flag"
                          :style="`${h3Style1Transverse}font-size: ${fontSize}px;width:${(item.width || 24)/8*(100/3)}%;`"
                          v-for="(item,index) in printFooterList" :key="index">
                          <span :style="`font-size: ${fontSize}px;`" style="font-weight: normal;">{{item.columnName}}
                            &nbsp;&nbsp; {{item.columnValue}}
                          </span>
                        </h3>
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="businessCons" v-else style="flex: 3" ref="print">
        <div class="businessCons_fix">
          <div ref="col" class="contents cons-info">
            <div class="print-content" ref="printContent" style="border: 0;">
              <!-- 有子表 -->
              <div class="print-cons" v-if="list.length" style="overflow: hidden;">
                <div ref="print-head">
                  <div v-show="item.flag && (item.columnCode !== 'approvalRecord' || item.columnCode !== 'logoShow')"
                    :style="h4Style" style="font-weight: bold;height: 30px;" v-for="(item,index) in printMainList"
                    :key="index">
                    {{item.columnValue}}
                    <img :src="logoUrl" class="printLogo" :style="logoStyle"
                      v-if="item.columnCode === 'logoShow' && item.flag && logoUrl">
                  </div>
                </div>
                <div style="overflow: hidden" ref="cons">
                  <div :style="mainFormStyle + mainDateBorder">
                    <table border=0 cellSpacing=0 cellPadding=0 width="100%" style="border-collapse:collapse;"
                      :style="borderList.filter(v => v === '01').length === 0 && 'border:none;'">
                      <tbody>
                        <tr v-for="(item, index) in processList" :key="`${item.columnCode}-${index}`"
                          :style="mainDateBorder + mainItemStyle + pStyle+'width:'+(item.width/8*(100/3))+'%;'+'font-size:'+fontSize+'px'"
                          v-show="item.flag" style="height: 100%;border:none;" ref="print-cons">
                          <td style="width:150px;display: block;float: left;font-weight: bold;border:none;border-right:1px solid rgb(51, 51, 51);
                              box-sizing: border-box;padding:8px 5px;height: auto;" :style="mainDateBorder">
                            {{item.columnName}}
                          </td>
                          <td :style="`${mainDateBorder}font-size: ${fontSize}px;`" style="width:calc(100% - 150px);float: left;font-weight: normal;box-sizing:
                              border-box;padding:8px 5px; height: 100%;border:none;border-left:1px solid rgb(51, 51, 51);margin-left:-1px;
                              box-sizing: border-box;word-wrap:break-word;word-break:break-all;">
                            {{item.columnValue | systemFilters(item)}}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <!-- 无子表 -->
              <div v-else class="print-cons" ref="cons" style="overflow: hidden;">
                <div ref="print-head">
                  <div
                    style="text-align: center;margin-top: 10px;border: 1px solid; border-bottom: none;line-height: 40px;"
                    :style="mainDateBorder">
                    <div v-show="item.flag && (item.columnCode !== 'approvalRecord' || item.columnCode !== 'logoShow')"
                      v-for="(item,index) in printMainList" :key="index" :style="h4StylePay">
                      <span style="padding: 0 5px;">{{item.columnValue}}</span>
                    </div>
                  </div>
                </div>
                <div style="overflow: hidden;">
                  <div :style="mainFormStyle + mainDateBorder">
                    <table border=0 cellSpacing=0 cellPadding=0 width="100%" style="border-collapse:collapse;"
                      :style="borderList.filter(v => v === '01').length === 0 && 'border:none;'">
                      <tbody>
                        <tr :style="mainItemStyle + mainDateBorder + pStyle+'width:'+(item.width/8*(100/3))+'%'"
                          v-show="item.flag" v-for="(item, index) in processList" :key="`${item.columnCode}-${index}`"
                          style="height: 100%;border:none;border-bottom:1px solid rgb(51, 51, 51);">
                          <td style="width:150px;display: block;float: left;font-weight: bold;border:none;border-right:1px solid rgb(51, 51, 51);
                              box-sizing: border-box;padding:8px 5px;height: auto;" :style="mainDateBorder">
                            {{item.columnName}}
                          </td>
                          <td :style="`${mainDateBorder}font-size: ${fontSize}px;`" style="width:calc(100% - 150px);float: left;font-weight: normal;box-sizing: border-box;
                              padding:8px 5px; height: 100%;border:none;border-left:1px solid rgb(51, 51, 51);margin-left:-1px;box-sizing: border-box;
                              word-wrap:break-word;word-break:break-all;">
                            {{item.columnValue | systemFilters(item)}}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div :style="`${tableConsStyle}font-size: ${fontSize}px;`" class="tableCons"
                style="margin-top: 0 !important;" ref="table">
                <!-- <div style="height: 20px"></div> -->
                <table border=0 cellSpacing=0 cellPadding=0 width="100%" style="border-collapse:collapse;"
                  :style="borderList.filter(v => v === '01').length === 0 && 'border:none;'">
                  <thead v-if="list.length && isTableShow">
                    <td :style="`${tableTdStyle + detailDataBorder}font-size: ${fontSize}px;`"
                      style="width: 5%;font-weight: bold;border: 1px solid #333333">{{$t('print.index')}}</td>
                    <td :style="detailDataBorder + 'width:'+(item.width)+'%'"
                      style="font-weight: bold;padding: 10px 0;text-align: center;border: 1px solid #333333"
                      v-show="item.flag" v-for="(item,index) in list" :key="index">
                      {{item.columnName}}
                    </td>
                  </thead>
                  <tbody>
                    <template v-if="list.length && isTableShow">
                      <tr v-for="(item,index) in tableList" :key="index">
                        <!-- + (index + 1) === list.length ? lastDate : '' -->
                        <td :style="`${tableTdStyle + detailDataBorder}font-size: ${fontSize}px;`">{{index+1}}</td>
                        <template v-for="(child,key) in item">
                         <template>
                          <td :style="`${tableTdStyle + detailDataBorder}font-size: ${fontSize}px;`" :key="key">
                            {{child | systemFilters({filterName: filterSubTable[key]})}}
                          </td>
                         </template>
                        </template>
                      </tr>
                    </template>
                    <tr style="border:1px solid rgb(51, 51, 51);height: 30px;line-height: 30px;text-align:left;"
                      v-if="showPrintBottomList()" :style="approvalBorder">
                      <td :colspan="list.length+1" :style="processTitleStyle + approvalBorder"
                        style="font-weight:bold;">
                        <!-- 审批记录 -->
                        <div :style="approvalBorder" style="border-top:1px solid rgb(51, 51, 51);padding-left:30px;">
                          {{$t('dialog.approvalRecord')}}</div>
                        <!-- <img :style="processNodepanSignImgStyle"
                        :src="require('https://static.junnysoft.cn/backstage/signPic_1601188525721.png')" alt="url" /> -->
                      </td>
                    </tr>
                    <tr :style="processTitleStyle + approvalBorder" style="border:1px solid rgb(51, 51, 51);"
                      v-if="showPrintBottomList()">
                      <td :colspan="list.length+1" :style="approvalBorder">
                        <div :style="processTitleStyle"
                          style="display: flex;align-items: center;justify-content: center;">
                          <!-- 序号 -->
                          <span :style="processTitlSpanIndexStyle">{{$t('fConfig.serialNumber')}}</span>
                          <!-- 节点名称 -->
                          <span :style="processTitlSpanNameStyle">{{$t('dialog.nodeName')}}</span>
                          <!-- 审批人 -->
                          <span :style="processTitlSpanPersonStyle">{{$t('dialog.approvedBy')}}</span>
                          <!-- 签名 -->
                          <span :style="processTitlSpanSignStyle">{{$t('dialog.autograph')}}</span>
                          <!-- 审批时间 -->
                          <span :style="processTitlSpanTimeStyle">{{$t('dialog.approvalTime')}}</span>
                          <!-- 意见 -->
                          <span :style="processTitlSpanCommentStyle">{{$t('dialog.opinion')}}</span>
                        </div>
                      </td>
                    </tr>
                    <template v-if="showPrintBottomList()">
                      <tr v-for="(item,index) in printBottomList" :key="item.id"
                        style="border:1px solid rgb(51, 51, 51);" :style="approvalBorder">
                        <td :colspan="list.length+1" :style="approvalBorder">
                          <div :style="processNodeStyle" v-show="item.flag">
                            <span :style="processNodepanIndexStyle">{{Number(index) + 1}}</span>
                            <span :style="processNodepanNameStyle">{{item.columnName}}</span>
                            <span :style="processNodepanPersonStyle">{{item.columnValue}}</span>
                            <span :style="processNodepanSignStyle">
                              <img :style="processNodepanSignImgStyle" :src="item.url" v-if="item.url" alt="url" />
                            </span>
                            <span :style="processNodepanTimeStyle">{{item.executeDate | setTime}}</span>
                            <span :style="processNodepanCommentStyle">{{item.comment}}</span>
                          </div>
                        </td>
                      </tr>
                    </template>
                    <tr v-if="isPortraitArray && printFooterList.length" :style="tableFooterBorder"
                      style="border:1px solid rgb(51, 51, 51);">
                      <th :style="`${tableTdStyle1 + tableFooterBorder + noFooterBorder}font-size: ${fontSize}px;`"
                        :colspan="list.length+1" style="border:1px solid rgb(51, 51, 51);">
                        <h3 v-show="item.flag"
                          :style="`${h3Style1}font-size: ${fontSize}px;width:${(item.width || 24)/8*(100/3)}%;`"
                          v-for="(item,index) in printFooterList" :key="index">
                          <span :style="`font-size: ${fontSize}px;`" style="font-weight: normal;">{{item.columnName}}
                            &nbsp;&nbsp; {{item.columnValue}}
                          </span>
                        </h3>
                      </th>
                    </tr>
                    <tr v-else-if="printFooterList.length" :style="tableFooterBorder"
                      style="border:1px solid rgb(51, 51, 51);">
                      <th :style="`${tableTdStyle1 + tableFooterBorder + noFooterBorder}font-size: ${fontSize}px;`"
                        :colspan="list.length+1" style="border:1px solid rgb(51, 51, 51);">
                        <h3 v-show="item.flag"
                          :style="`${h3Style1Transverse}font-size: ${fontSize}px;width:${(item.width || 24)/8*(100/3)}%;`"
                          v-for="(item,index) in printFooterList" :key="index">
                          <span :style="`font-size: ${fontSize}px;`" style="font-weight: normal;">{{item.columnName}}
                            &nbsp;&nbsp; {{item.columnValue}}
                          </span>
                        </h3>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--添加弹窗-->
    <el-dialog v-dialogDrag :visible.sync="printShow" v-if="printShow" :title="$t('print.addTableFooter')" center
      top="35vh" width="30%">
      <el-form :model="printForm" :rules="rules" status-icon class="demo-ruleForm dialog-form" ref="printForm">
        <!-- 表尾名称 -->
        <el-form-item :label="$t('print.columnNameFooter')" prop="columnName" label-width="100px">
          <el-input v-model="printForm.columnName" max="18">
          </el-input>
        </el-form-item>
        <!-- 表尾值 -->
        <el-form-item :label="$t('print.columnValueFooter')" prop="columnValue" label-width="100px">
          <el-input v-model="printForm.columnValue" max="18">
          </el-input>
        </el-form-item>
        <div style="text-align: center">
          <el-button size="small" icon="el-icon-circle-check" type="primary" :disabled="isDisable"
            @click.native.prevent="submitLoginPass('printForm')">{{$t('print.preservation')}}
          </el-button>
          <el-button icon="el-icon-circle-check" type="primary" class="urgent" size="small"
            @click.native.prevent="exitProcessForm">{{$t('print.close')}}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { closeRoute } from 'mixins/index';
import { printTemplate } from 'mixins/printMixins';

export default {
  mixins: [closeRoute, printTemplate],
  data () {
    return {
      isDisable: false, // 表单重复提交;
      printBottomList: [],
      value: '',
      isPortraitArray: true
      // printProcessList: []
    };
  },
  props: {
    printMainList: {
      type: Array,
      default: () => []
    },
    // 数据详情
    dataInfo: {
      type: Object,
      default: () => { }
    },
    // 单据编号
    dataCode: {
      type: String,
      default: ''
    },
    customList: {
      type: Object,
      default: () => { }
    },
    list: {
      type: Array,
      default: () => []
    },
    processList: {
      type: Array,
      default: () => []
    },
    formCode: {
      type: String,
      default: ''
    },
    id: {
      default: 0
    },
    taskId: {
      default: 0
    },
    isPrint: {
      type: Boolean,
      default: false
    },
    DetailList: {
      type: Array,
      default: () => []
    },
    flowStatus: {
      type: String,
      default: ''
    }
  },
  created () {
    // for (const item of this.processList) {
    //   if (item.columnName) {
    //     this.printProcessList.push(item);
    //   }
    // }
    // console.log(this.approvalRecordShow, 'this.approvalRecordShow');
  },
  methods: {
    showPrintBottomList () {
      return this.printBottomList.length && this.approvalRecordShow && this.flowStatus !== '0' && Number(this.taskId) > 0;
    }
  }
};
</script>

<style scoped lang="scss">
@page {
  size: A4 landscape;
}
.editTable {
  min-width: 100%;
  width: 100%;
}
.dialog-form {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.borderSet {
  font-size: 14px;
  color: #606266;
  display: inline-block;
  width: auto;
  height: 36px;
  span {
    margin-right: 8px;
  }
  /deep/ .el-select {
    width: 160px;
  }
}
.isPaperNumber {
  display: inline-block;
}
@import "components/basicComponents/styles/printTemplate.scss";
</style>
