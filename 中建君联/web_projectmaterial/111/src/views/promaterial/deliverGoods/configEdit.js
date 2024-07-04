
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    // info
    infoUrl: {
      url: 'supplyOrder/getDeliverInfo',
      params: 'supplyOrderDeliverId'
    }
  },
    // 数据字典
    dictionary: [],
    // 接口数据
    selectList: [],
    // 主表
    mainFormConfig: {
        formList: [
          // 订单信息
          {
            label: 'supplyOrder.orderInformation', prop: 'orderInformation', span: 24, formType: 'divisionTitle', inputStatus: 'disable'
          },
          // 订单名称
          { label: 'fConfig.orderName', prop: 'orderName', span: 8, formType: 'slot', inputStatus: 'edit', isRule: true, isRelation: true,
            relationList: [
              {receive: 'projectName', value: 'projectName'},
              {receive: 'projectId', value: 'projectId'},
              {receive: 'receiver', value: 'orgName'},
              {receive: 'address', value: 'address'},
              {receive: 'deliver', value: 'deliver'}
            ],
            relationTable: ['deliverGoodsDetail'],
            key: 'supplyOrderId'
          },
          // 订单编号
          {
             label: 'supplyOrder.supplyOrderDocNo', prop: 'supplyOrderDocNo', span: 8, formType: 'input', inputStatus: 'disable'
          },
          // 订单下达单位名称
          {
             label: 'supplyOrder.receiver', prop: 'receiver', span: 8, formType: 'input', inputStatus: 'disable'
            },
          // 项目名称
          {
            label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'input', inputStatus: 'disable'
          },
          // 收货地址
          {
            label: 'supplyOrder.areas', prop: 'areas', span: 8, formType: 'input', maxlength: 64, inputStatus: 'disable'
          },
          // 详细地址
          {
            label: 'supplyOrder.address', prop: 'address', span: 8, formType: 'input', inputStatus: 'disable'
          },
          // 税率
          {
            label: 'fConfig.taxRate', prop: 'taxRate', span: 8, formType: 'text', inputStatus: 'disable', filterName: 'taxRate'
          },
          // 发票类型
          {
            label: 'fConfig.invoiceTypeCode', prop: 'invoiceValue', span: 8, formType: 'input', inputStatus: 'disable'
          },
          // 业务联系人
          {
            label: 'fConfig.contactName', prop: 'contactName', span: 8, formType: 'input', inputStatus: 'disable'
          },
          // 联系人号码
          {
            label: 'fConfig.contactMobile', prop: 'contactMobile', span: 8, formType: 'input', inputStatus: 'disable'
          },
          // 收货人
          {
            label: 'supplyOrder.receiveUserName', prop: 'receiveUserName', span: 8, formType: 'input', inputStatus: 'disable'
          },
          // 收货人电话
          {
            label: 'supplyOrder.receiveUserContactMobile', prop: 'receiveUserContactMobile', span: 8, formType: 'input', inputStatus: 'disable'
          },
          // 备注
          { label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'textarea', maxlength: 256, inputStatus: 'disable'},
          // 附件
          { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload', inputStatus: 'disable'},

          // 送货信息
          {
            label: 'supplyOrder.shippingInformation', prop: 'shippingInformation', span: 24, formType: 'divisionTitle', inputStatus: 'disable'
          },
          // 填写日期
          {
            label: 'fConfig.createTime', prop: 'createTime', span: 8, formType: 'date', inputStatus: 'disable'
          },
          // 填写人
          {
            label: 'fConfig.createByName', prop: 'createByName', span: 8, formType: 'input', inputStatus: 'disable'
          },

          // 电子发货单编号
          { label: 'supplyOrder.deliverCode', prop: 'deliverCode', span: 8, formType: 'input', inputStatus: 'disable'},
          // 发货人
          {
            label: 'supplyOrder.consignor', prop: 'consignor', span: 8, formType: 'input', maxlength: 32
          },
          // 发货人联系方式
          {
             label: 'supplyOrder.consignorMobile', prop: 'consignorMobile', span: 8, formType: 'input', maxlength: 32
          },
          // 发货单位
          {
            label: 'supplyOrder.deliver', prop: 'deliver', span: 8, formType: 'input', maxlength: 64, isRule: true
          },

          // 送货方式 自有物流送货、外部物流送货
          {
            label: 'supplyOrder.deliveryMethodValue', prop: 'deliveryMethodCode', span: 8, formType: 'dicSelect', selectList: [
              {dataCode: '01', dataName: 'supplyOrder.ownDelivery'}, // 自有物流送货
              {dataCode: '02', dataName: 'supplyOrder.outDelivery'} // 外部物流送货
             ], isTranslate: true, isRule: true,
             isRelation: true, relationList: [{receive: 'deliveryMethodValue', value: 'dataName'}], pintIdName: 'deliveryMethodValue',
             otherOperate: true, otherOperateFun: 'deliveryMethodFun'
          },

          // 送货人
          {
            label: 'supplyOrder.deliverName', prop: 'deliverName', span: 8, formType: 'input', maxlength: 32, isRule: true
          },
          // 送货人联系方式
          {
            label: 'supplyOrder.deliverMobile', prop: 'deliverMobile', span: 8, formType: 'input', maxlength: 32, isRule: true
          },
          // 运输目的地
          {
            label: 'supplyOrder.transportDestination', prop: 'transportDestination', span: 8, formType: 'input', maxlength: 128, isRule: true
          },

          // 车辆GPS定位IMEI
          // {
          //   label: 'supplyOrder.gps', prop: 'gps', span: 8, formType: 'input', maxlength: 64
          // },
          // 送货车牌号码
          {
            label: 'supplyOrder.carId', prop: 'carId', span: 8, formType: 'input', maxlength: 16
          },
          //  物流/快递单号 ,
          {
            label: 'supplyOrder.logisticsOrderNo', prop: 'logisticsOrderNo', span: 8, formType: 'input', maxlength: 32
          },
          // 出发日期
          {
            label: 'supplyOrder.setOutDate', prop: 'setOutDate', span: 8, formType: 'date', inputStatus: 'edit'
          },
          // 送货备注
          {
           label: 'supplyOrder.deliveryRemarks', prop: 'deliveryRemarks', span: 16, formType: 'input', maxlength: 255
          },
          // 送货单盖章
          { label: 'supplyOrder.deliveryAttachment', prop: 'deliveryAttachment', span: 24, formType: 'upload', maxlength: 32, isRule: true}
        ],
        oldRelationList: []
    },
    subTableMatch: [
      {value: 'details', assignment: 'deliverGoodsDetail'}
    ],
    // 子表
    subTableConfig: {
      // 明细清单
      deliverGoodsDetail: {
          subTableName: 'deliverGoodsDetail',
          // 子表按钮
          subTableButton: [],
          tableList: {
              // 表头配置
              slaveColumns: [
                // 材料名称
                { label: 'fConfig.varietiesName', prop: 'varietiesName', formType: 'text'},
                // 规格
                { label: 'fConfig.standards', prop: 'standards', formType: 'text'},
                // 计量单位
                { label: 'fConfig.unit', prop: 'unit', formType: 'text', minWidth: 50},
                // 型号
                { label: 'fConfig.models', prop: 'models', formType: 'text'},
                // 品牌
                { label: 'fConfig.brand', prop: 'brand', formType: 'text'},
                //  订单数量
                { label: 'supplyOrder.orderQuantity', prop: 'orderQuantity', formType: 'text', minWidth: 120},
                //  已发货数量
                { label: 'supplyOrder.alreadyShipQuantity', prop: 'alreadyShipQuantity', formType: 'text', minWidth: 120},
                //  本次发货数量
                { label: 'supplyOrder.shippedQuantity', prop: 'shippedQuantity', formType: 'number', operateData: true, precision: 4, maxlength: 17, minWidth: 120},
                //  单价
                { label: 'fConfig.price', prop: 'price', formType: 'number', operateData: true, precision: 2, maxlength: 12, minWidth: 80},
                // 金额
                { label: 'fConfig.amount', prop: 'amount', formType: 'number', precision: 2, maxlength: 12, minWidth: 80},
                //  需用日期
                { label: 'supplyOrder.requiredDate', prop: 'requiredDate', formType: 'text', filterName: 'date', minWidth: 120, inputStatus: 'disable'},
                // 供货备注
                { label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255}
            ],
              // 校验
              rules: {},
              // 初始化行数据
              tableDataRow: {}
          }, // 子表配置
          tableData: [] // 子表数据
      }
    }
};
class Page {
  constructor() {
    this.PageConfig = JSON.parse(JSON.stringify(PageConfig));
    this.init();
  }
  init () {
    Utils.commonUtil.getSelectList(this.PageConfig.selectList, this);
    Utils.commonUtil.getDicAllDataList(this.PageConfig.dictionary, this);
  }
}
export default Page;
