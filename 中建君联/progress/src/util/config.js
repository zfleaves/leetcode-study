/*
 * @Author: your name
 * @Date: 2020-06-28 09:08:48
 * @LastEditTime: 2021-04-14 16:30:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration-施工云企业信息及配置\src\util\config.js
 */
// 线下 测试 URL

// const url = 'http://47.114.95.78:8087'; // 测试
const url = 'http://47.114.99.205:88'; // 生产

// const jumpUrl = 'http://47.114.95.78'; // 测试
const jumpUrl = 'http://47.114.76.65'; // 生产

const releaseUrl = url; // 发布
const Config = {

    url: releaseUrl,
    jumpUrl,
    // 后台文件上传 用户logo 用户头像 签名
    fileUrl: `${releaseUrl}/basic/file/backstage/upload`,
    // 租户文件上传 用于业务
    fileTenantUrl: `${releaseUrl}/basic/file/tenant/upload`,
    // 文件下载
    fileCmsUrl: `${releaseUrl}/basic/file/download?fileId=`,
    // 文件预览
    fileViewUrl: `${releaseUrl}/basic/file/view?fileId=`,
    // 预览 Url
    fileViewerUrl: 'http://47.110.65.236:8060/onlinePreview?url=',
    // 图片预览
    imageUrl: 'https://static.junnysoft.cn/',
    // 系统名称
    subSystemCode: 'proprogress',
    // 基础系统
    basicSystemCode: 'basic',
    // 菜单
    pageMenuCode: 'menu',
    // 数据字典
    dataList: [
        {name: '项目类型', id: 12, code: 'projectTypeCode'},
        {name: '项目状态', id: 13, code: 'projectStatus'},
        {name: '流程状态', id: 14, code: 'flowStatus'},
        {name: '季度需求', id: 15, code: 'seasonStatus'},
        {name: '拟采购方式', id: 16, code: 'purchaseMethod'},
        {name: '订单类型', id: 17, code: 'orderType'},
        {name: '合同类型', id: 18, code: 'contractType'},
        {name: '标评方法', id: 19, code: 'tenderingStatus'},
        {name: '开标结果', id: 20, code: 'bidResult'},
        {name: '付款类型', id: 21, code: 'payType'},
        {name: '单位性质', id: 22, code: 'property'},
        {name: '供应商等级', id: 23, code: 'level'},
        {name: '是否合格', id: 24, code: 'appraiseStatus'},
        {name: '评价等级', id: 25, code: 'appraiseLevels'},
        {name: '资质', id: 26, code: 'qualifications'},
        {name: '许可', id: 27, code: 'permit'},
        {name: '产品质量', id: 28, code: 'productQuality'},
        {name: '用户反馈意见', id: 29, code: 'reputation'},
        {name: '生产/供货能力', id: 30, code: 'throughputEvaluation'},
        {name: '产品价格', id: 31, code: 'productPriceEvaluation'},
        {name: '产品价格', id: 32, code: 'productQualityEvaluation'},
        {name: '业绩/信誉', id: 33, code: 'reputationEvaluation'},
        {name: '服务水平', id: 34, code: 'serviceEvaluation'},
        {name: '税率（%）', id: 35, code: 'taxRate'},
        {name: '计税方式', id: 36, code: 'taxMethod'},
        {name: '发票类型', id: 37, code: 'invoiceType'},
        {name: '支付方式', id: 38, code: 'payMethodType'},
        {name: '费用类型', id: 39, code: 'costType'},
        {name: '盘亏原因', id: 41, code: 'reasonType'},
        {name: '租赁类型', id: 43, code: 'supplyMethodLease'},
        {name: '结算类型', id: 44, code: 'settleType'},
        {name: '租赁合同类型', id: 45, code: 'contractTypeLease'},
        {name: '周期类型', id: 46, code: 'cycleType'},
        {name: '保养级别', id: 47, code: 'careLevel'},
        {name: '维修级别', id: 48, code: 'repairLevel'},
        {name: '作业类别', id: 49, code: 'workType'},
        {name: '工程属性', id: 50, code: 'attribute'},
        {name: '消息类型', id: 51, code: 'messageType'},
        {name: '供货订单状态', id: 52, code: 'supperStatus'},
        {name: '运输方式', id: 53, code: 'arrivalMethod'},
        {name: '计量规则', id: 54, code: 'calcRules'},
        {name: '结算方式', id: 55, code: 'sellteMethod'},
        {name: '任职状态', id: 62, code: 'officeStatus'},
        {name: '角色类型', id: 63, code: 'rolesType'},
        {name: '变更事项', id: 64, code: 'changeMatter'},
        {name: '纳税人类型', id: 65, code: 'taxPayerType'},
        {name: '开具类型', id: 66, code: 'billingType'},
        {name: '标签', id: 67, code: 'tagCode'},
        {name: '发标状态', id: 68, code: 'biddingStatus'},
        {name: '回标有效性', id: 69, code: 'returnBidding'},
        {name: '询价类型', id: 70, code: 'inquireType'},
        {name: '币种', id: 71, code: 'currencyType'},
        {name: '计价方式', id: 78, code: 'valuationCode'},
        {name: '合同性质', id: 89, code: 'contractNatureCode'},
        {name: '是否开具发票', id: 79, code: 'whether'},
        {name: '仓库状态', id: 82, code: 'warStatus'},
        {name: '入库类型', id: 87, code: 'incomingType'},
        {name: '出库类型', id: 88, code: 'outboundType'},
        {name: '质保金比例(%)', id: 103, code: 'qualityDepositScale'},
        {name: '采购策略', id: 108, code: 'purchaseStrategyCode'},
        { name: '拟租赁方式', id: 111, code: 'purchaseMethodCode' },
        { name: '进场类型', id: 113, code: 'incomingTypeCode' },
        { name: '限制类型', id: 120, code: 'limitTypeCode' },
        { name: '连线类型', id: 121, code: 'linkType' },
        { name: '调整类型', id: 126, code: 'adjustTypeCode' },
        { name: '整体完成情况', id: 127, code: 'overallCompleteCode' },
        { name: '预警状态', id: 148, code: 'warnStatus' },
        { name: '取数来源', id: 149, code: 'accountType' }
    ]

};

export default Config;

