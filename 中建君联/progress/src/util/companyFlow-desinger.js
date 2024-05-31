
/* eslint-disable */
import go from 'assets/gojs/go'
import {Message} from 'element-ui'
import store from 'store'

export function FlowDesigner(diagramDiv, processCode) {
  let G = go.GraphObject.make;
  let _this = {};
  let This = this;
  let _designer = {};
  let _flowData = {};
  let _jsonNewStep = {key: guid(), text: "新步骤", remark: ''};
  let IsCanConnect = true;
  /** --------public method----------------------------------------**/
  /**
   * 初始化图例面板
   * @returns {*}
   */
  this.initToolbar = (div, arr) => {
    let myPalette =
      G(go.Palette, div, // 必须是DIV元素
        {
          maxSelectionCount: 3,
          nodeTemplateMap: _designer.nodeTemplateMap, // 跟设计图共同一套样式模板
          model: new go.GraphLinksModel(arr
            // [
            //   {key: guid(), text: "开始", figure: "Circle", fill: "#4fba4f", stepType: 1},
            //   {key: "Diamond:" + guid(), text: "判断", figure: 'Diamond', remark: 'dadsfdsf'},
            //   _jsonNewStep,
            //     {key: guid(), text: "开始", figure: "Triangle", fill: "#4fba4f", stepType: 1},
            //     {key: guid(), text: "开始", figure: "Rectangle", fill: "#4fba4f", stepType: 1},
            //     {key: guid(), text: "开始", figure: "Square", fill: "#4fba4f", stepType: 1},
            //   {key: guid(), text: "结束", figure: "Hexagon", fill: "#CE0620", stepType: 4}
            // ]
          )
        });

    // 创建 节点  PartCreated
    myPalette.addDiagramListener("PartCreated", (e) => {
      console.log(e);
    });

    return myPalette;
  };

  /**
   * 在设计面板中显示流程图
   * @param flowData  流程图json数据
   */
  this.displayFlow = (flowData) => {

    if (!flowData) return;
    _flowData = flowData;

    _designer.model = go.Model.fromJson(flowData);

    let pos = _designer.model.modelData.position;
    if (pos) _designer.initialPosition = go.Point.parse(pos);

    // 更改所有连线中间的文本背景色
    setLinkTextBg();
  };

  /**
   * 创建新步骤
   */
  this.createStep = () => {
    let jsonNewStep = {key: _jsonNewStep.key, text: _jsonNewStep.text};
    jsonNewStep.loc = "270 140";// “新步骤”显示的位置
    _designer.model.addNodeData(jsonNewStep);
  };

  /**
   * 获取流程图数据
   * @returns {*}
   */
  this.getFlowData = () => {
    _designer.model.modelData.position = go.Point.stringify(_designer.position);
    return _designer.model.toJson();
  };

  // 更新流程图数据
  this.UpdateFlowDataNode = (model) => {
    // model = _designer.model.toJson();
    _designer.model = go.Model.fromJson(model);
    // _designer.model.modelData.position = go.Point.stringify(_designer.position);
    // return _designer.model.toJson();
  };

  /**
   * 检验流程图是否规范
   */
  this.checkData = () => {
    let errMsg = "";

    // 检查：每个步骤必须包含角色
    if (!_designer.model.nodeDataArray) return '请绘制流程图';

    $.each(_designer.model.nodeDataArray, (i, item) => {
      if (!item.hasOwnProperty("remark") || item.remark === "") {
        errMsg = "请为步骤【" + item.text + "】设置备注~";
        return false;
      }
    });

    return errMsg;
  };

  /** --------public method-------------end---------------------------**/

  init(diagramDiv);

  /** --------private method----------------------------------------**/

  /**
   * 初始化流程设计器
   * @param divId 设计器Div
   */
  function init(divId) {
    _designer = G(go.Diagram, divId, // must name or refer to the DIV HTML element
      {
        grid: G(go.Panel, "Grid",
          G(go.Shape, "LineH", {stroke: "lightgray", strokeWidth: 0.5}),
          G(go.Shape, "LineH", {stroke: "gray", strokeWidth: 0.5, interval: 10}),
          G(go.Shape, "LineV", {stroke: "lightgray", strokeWidth: 0.5}),
          G(go.Shape, "LineV", {stroke: "gray", strokeWidth: 0.5, interval: 10})
        ),
        allowDrop: true, // must be true to accept drops from the Palette
        allowTextEdit: false,
        allowHorizontalScroll: true,
        allowZoom: true,
        allowCopy: false,
        allowVerticalScroll: true,
        // "clickCreatingTool.archetypeNodeData": _jsonNewStep, // 双击创建新步骤
        "draggingTool.dragsLink": true,
        "draggingTool.isGridSnapEnabled": true,
        "linkingTool.isUnconnectedLinkValid": true,
        "linkingTool.portGravity": 20,
        "relinkingTool.isUnconnectedLinkValid": true,
        "relinkingTool.portGravity": 20,
        "relinkingTool.fromHandleArchetype":
          G(go.Shape, "Diamond", {
            segmentIndex: 0,
            cursor: "pointer",
            desiredSize: new go.Size(8, 8),
            fill: "tomato",
            stroke: "darkred",
          }),
        "relinkingTool.toHandleArchetype":
          G(go.Shape, "Diamond", {
            segmentIndex: -1,
            cursor: "pointer",
            desiredSize: new go.Size(8, 8),
            fill: "darkred",
            stroke: "tomato",
          }),
        "linkReshapingTool.handleArchetype":
          G(go.Shape, "Diamond", {desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue"}),
        "undoManager.isEnabled": true,
        "grid.visible": false, //画布上面是否出现网格
      });
    // 监听新拖拽到画布的节点
    _designer.addModelChangedListener((evt) => {
      // ignore unimportant Transaction events
      if (!evt.isTransactionFinished) return;
      let txn = evt.object;  // a Transaction
      if (txn === null) return;
      // iterate over all of the actual ChangedEvents of the Transaction
      txn.changes.each((e) => {
        // ignore any kind of change other than adding/removing a node
        if (e.modelChange !== "nodeDataArray") return;
        // record node insertions and removals
        // 新增节点
        if (e.change === go.ChangedEvent.Insert) {
          console.log(e.newValue);
          let nodeCode = e.newValue.nodeCode;
          let indexX = e.newValue.loc.split(' ')[0];
          let indexY = e.newValue.loc.split(' ')[1];
          const data = {
            processCode,
            nodeCode,
            indexX,
            indexY
          };
          store.dispatch('processTemplate/initProcessNode', data).then(res => {
            // if(res.results===0){
            //
            let results = res.results;
            let node = e.newValue;
            node.canRemove = 1;  // 允许删除
            node.processCode = results.processCode;
            node.processNodeCode = results.processNodeCode;
            node.formCode = results.formCode;
            let key = results.processNodeCode;
            _designer.startTransaction("vacate");
            _designer.model.setDataProperty(node, "key", key);
            _designer.commitTransaction("vacate");

            // }
            // This.updateCreateNodeData(node);
            // store.commit('user/setUpdateNode', data);
          })
          // console.log(evt.propertyName + " added node with key: " + e.newValue.key);
        } else if (e.change === go.ChangedEvent.Remove) {
          // 删除节点
          console.log(evt.propertyName + " removed node with key: " + e.oldValue.key);
        }
      });
    });

    // 流程图如果有变动，则提示用户保存
    _designer.addDiagramListener("Modified", onDiagramModified);

    // 双击事件
    _designer.addDiagramListener("ObjectDoubleClicked", onObjectDoubleClicked);

    // _designer.addDiagramListener("ObjectDoubleClicked", makePartContextMenu);

    // 连线完成事件
    _designer.addDiagramListener("LinkDrawn", (e) => {
      // console.log(e.subject.dg.data);
      // console.log(e.subject.ba.data);
      // console.log(e.subject.data);
      // dg
      let data = e.subject.data;
      if (!data.to || !data.from) {   // 连线没有尾节点
        e.diagram.commandHandler.deleteSelection();
      } else {
        const params = {
          fromNodeCode: data.from,
          toNodeCode: data.to,
          processCode
        };
        store.dispatch('processTemplate/checkProcessesConnect', params).then(res => {
          let status = res.results.status;
          if (status === 1) {
            Message({
              message: res.results.errorMsg,
              type: 'error'
            });
            IsCanConnect = false;
            e.diagram.commandHandler.deleteSelection();
          }
        })
      }

    });

    // 创建 节点  PartCreated
    _designer.addDiagramListener("PartCreated", (e) => {
      console.log(e);
    });

    // 删除节点  PartCreated
    // SelectionDeleting
    _designer.addDiagramListener("SelectionDeleting", (e) => {
      e.subject.each((n) => {
        let data = n.data;
        if(!IsCanConnect){
          IsCanConnect = true;
          return
        }
        //n为删除节点或线的对象
        if (n.data.canRemove === 0) {
          Message({
            message: `该节点不能删除~`,
            type: 'error'
          });
          e.cancel = true;
          return
        }
        // console.log(n.data);
        if (n.data.text === "开始" || n.data.text === "结束") {
          //不允许删除，给e.cancel赋值,只能在gojs 2.0以下使用
          //在gojs 2.0中，cancel是不赞成的，有关更多信息，请参见GoJS更改日志。
          Message({
            message: `开始和结束步骤不能删除~`,
            type: 'error'
          });
          e.cancel = true;
        } else if (!n.data.key) {
          // 删除连线
          if (n.data.from && n.data.to) {
            store.dispatch('processTemplate/removeProcessNodeLine', {
              fromNodeCode: n.data.from,
              toNodeCode: n.data.to
            }).then(res => {
              if (res.status === 1) {
                Message({
                  message: res.results.message,
                  type: 'error'
                });
                e.cancel = true;
              } else {
                Message({
                  message: `连线删除成功`,
                  type: 'success'
                });
              }
            })
          }
        } else {
          store.dispatch('processTemplate/removeProcessNode', {processNodeCode: n.data.key}).then(res => {
            if (res.status === 1) {
              Message({
                message: res.results.message,
                type: 'error'
              });
              e.cancel = true;
            } else {
              Message({
                message: `节点删除成功`,
                type: 'success'
              });
              if (data.nodeCode !== 'APPROVAL' && data.nodeCode !== 'COUNTERSIGN') {
                store.commit('user/setUpdateNode', data);
              }
            }
          })
        }
      });
    });

    // SelectionMoved 拖拽节点
    _designer.addDiagramListener("SelectionMoved", (e) => {
      e.subject.each((n) => {
        //n为删除节点或线的对象
        if (!n.data.key) {
          e.cancel = true;
          return;
        }
        if (n.data.loc) {
          let indexX = n.data.loc.split(' ')[0];
          let indexY = n.data.loc.split(' ')[1];
          const params = {
            processNodeCode: n.data.key,
            indexX,
            indexY,
          };
          store.dispatch('processTemplate/moveProcessNode', params).then(res => {
            if (res.status === 0) {
            } else {
              this.$message.error(res.errorMessage);
            }

          })
        }
      });
    });

    // 流程步骤的样式模板
    _designer.nodeTemplate = makeNodeTemplate();

    // 流程连接线的样式模板
    _designer.linkTemplate = makeLinkTemplate();

  };

  /**
   * 生成GUID
   * @returns {string}
   */
  function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * 步骤图的样式模板
   * @returns {*}
   */
  function makeNodeTemplate() {
    return G(go.Node, "Spot",
      {locationSpot: go.Spot.Center},
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      {selectable: true, selectionAdornmentTemplate: makeNodeSelectionAdornmentTemplate()},
      new go.Binding("angle").makeTwoWay(),
      // the main object is a Panel that surrounds a TextBlock with a Shape
      G(go.Panel, "Auto",
        {name: "PANEL"},
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
        G(go.Shape, "RoundedRectangle", // default figure
          {
            portId: "", // the default port: if no spot on link data, use closest side
            fromLinkable: true,
            toLinkable: true,
            cursor: "pointer",
            fill: "#7e7e7f", // 默认背景色
            strokeWidth: 1,
            // category:"nodeStyleOne",
            maxSize: new go.Size(160, 160),
            stroke: "#DDDDDD"
          },
          new go.Binding("figure"),
          new go.Binding("fill")),
        G(go.TextBlock,
          {
            font: "bold 11pt Helvetica, Arial, sans-serif",
            margin: 8,
            maxSize: new go.Size(160, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: true,
            stroke: "white"
          },
          new go.Binding("text").makeTwoWay()), // the label shows the node data's text
        {
          toolTip: // this tooltip Adornment is shared by all nodes
            G(go.Adornment, "Auto",
              G(go.Shape, {fill: "rgb(48,49,51)"}),
              G(go.TextBlock, {
                  margin: 4,
                  width: 100,
                  height: 'auto',
                  stroke: '#fff'
                }, // the tooltip shows the result of calling nodeInfo(data)
                new go.Binding("text", "", nodeInfo))
            ),
          // 绑定上下文菜单
          contextMenu: makePartContextMenu()
        }
      ),
      // 4个连接点
      makeNodePort("T", go.Spot.Top, false, true),
      makeNodePort("L", go.Spot.Left, true, true),
      makeNodePort("R", go.Spot.Right, true, true),
      makeNodePort("B", go.Spot.Bottom, true, false),
      {
        mouseEnter: (e, node) => {
          showNodePort(node, true);
        },
        mouseLeave: (e, node) => {
          showNodePort(node, false);
        }
      }
    );
  }

  /**
   * 选中节点的样式
   * @returns {*}
   */
  function makeNodeSelectionAdornmentTemplate() {
    return G(go.Adornment, "Auto",
      G(go.Shape, {fill: null, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2]}),
      G(go.Placeholder)
    );
  }

  /**
   * 创建连接点
   * @param name
   * @param spot
   * @param output
   * @param input
   * @returns {*}
   */
  function makeNodePort(name, spot, output, input) {
    // the port is basically just a small transparent square
    return G(go.Shape, "Circle",
      {
        fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
        stroke: null,
        desiredSize: new go.Size(7, 7),
        alignment: spot, // align the port on the main Shape
        alignmentFocus: spot, // just inside the Shape
        portId: name, // declare this object to be a "port"
        fromSpot: spot,
        toSpot: spot, // declare where links may connect at this port
        fromLinkable: output,
        toLinkable: input, // declare whether the user may draw links to/from here
        cursor: "pointer" // show a different cursor to indicate potential link point
      });
  };

  /**
   * tooltip上显示的信息
   * @param d
   * @returns {string}
   */
  let tipsList = [
    {nodeCode: 'APPROVAL', title: '审批人员（一人或多人）中有一人审批完成，此节点完成'},
    {nodeCode: 'COUNTERSIGN', title: '审批人员（一人或多人）全部审批完成后，此节点完成'},
    {nodeCode: 'DECIDE', title: '必须存在对应的分支合并节点；必须对分支设置正确的判断条件'},
    {nodeCode: 'TOLERANCE', title: '必须存在对应的分支合并节点；发送下一步时审批节点可以选择1-N'},
    {nodeCode: 'EXCLUSION', title: '必须存在对应的分支合并节点；发送下一步时的审批节点只能多选一'},
    {nodeCode: 'PARALLEL', title: '必须存在对应的分支合并节点；所有后续分支节点全部发送待办事项'},
    {nodeCode: 'MERGE', title: '用于对分支节点进行合并，与不同类型的分支节点一对一出现'}
  ]

  function nodeInfo(e) {
    console.log(e);
    let index = tipsList.findIndex(v => v.nodeCode === e.nodeCode);
    let title = tipsList[index].title || '双击或单击右键可编辑';
    if (e.type === 'tool') {
      return title;
    } else {
      return '双击或单击右键可编辑'
    }
  }

  /**
   * 右键菜单
   * @returns {*}
   */
  function makePartContextMenu() {
    return G(go.Adornment, "Vertical",
      makeMenuItem("编辑",
        (e, obj) => { // OBJ is this Button
          let contextmenu = obj.part; // the Button is in the context menu Adornment
          let part = contextmenu.adornedPart; // the adornedPart is the Part that the context menu adorns
          // now can do something with PART, or with its data, or with the Adornment (the context menu)
          showEditNode(part);
        }, (o) => {
          return o.diagram.commandHandler.canDeleteSelection();
        }),
      // makeMenuItem("剪切",
      //     function(e, obj) { e.diagram.commandHandler.cutSelection(); },
      //     function(o) { return o.diagram.commandHandler.canCutSelection(); }),
      // makeMenuItem("复制",
      //     function(e, obj) { e.diagram.commandHandler.copySelection(); },
      //     function(o) { return o.diagram.commandHandler.canCopySelection(); }),
      makeMenuItem("删除",
        (e, obj) => {
          e.diagram.commandHandler.deleteSelection();
        },
        (o) => {
          return o.diagram.commandHandler.canDeleteSelection();
        })
    );
  };

  /**
   * 生成右键菜单项
   * @param text
   * @param action
   * @param visiblePredicate
   * @returns {*}
   */
  function makeMenuItem(text, action, visiblePredicate) {
    return G("ContextMenuButton",
      G(go.TextBlock, text, {
        margin: 5,
        textAlign: "left",
        stroke: "#555555"
      }),
      {click: action},
      // don't bother with binding GraphObject.visible if there's no predicate
      visiblePredicate ? new go.Binding("visible", "", visiblePredicate).ofObject() : {});
  };

  /**
   * 是否显示步骤的连接点
   * @param node
   * @param show
   */
  function showNodePort(node, show) {
    node.ports.each((port) => {
      if (port.portId !== "") { // don't change the default port, which is the big shape
        port.fill = show ? "rgba(255,0,0,.5)" : null;
      }
    });
  };

  /**
   * 连接线的选中样式
   * @returns {*}
   */
  function makeLinkSelectionAdornmentTemplate() {
    return G(go.Adornment, "Link",
      G(go.Shape,
        // isPanelMain declares that this Shape shares the Link.geometry
        {isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0}) // use selection object's strokeWidth
    );
  };

  /**
   * 定义连接线的样式模板
   * @returns {*}
   */
  function makeLinkTemplate() {
    return G(go.Link, // the whole link panel
      {selectable: true, selectionAdornmentTemplate: makeLinkSelectionAdornmentTemplate()},
      {relinkableFrom: true, relinkableTo: true, reshapable: true},
      {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        corner: 5,
        toShortLength: 4
      },
      G(go.Shape, // 线条
        {stroke: "black"}),
      G(go.Shape, // 箭头
        {toArrow: "standard", stroke: null}),
      G(go.Panel, "Auto",
        G(go.Shape, // 标签背景色
          {
            fill: null,
            stroke: null
          }, new go.Binding("fill", "pFill")),
        G(go.TextBlock, // 标签文本
          {
            textAlign: "center",
            font: "10pt helvetica, arial, sans-serif",
            stroke: "#555555",
            margin: 4
          },
          new go.Binding("text", "text")), // the label shows the node data's text
        {
          // toolTip:// this tooltip Adornment is shared by all nodes
          //   G(go.Adornment, "Auto",
          //     G(go.Shape, {fill: "#FFFFCC"}),
          //     G(go.TextBlock, {margin: 4}, // the tooltip shows the result of calling nodeInfo(data)
          //       new go.Binding("text", "", nodeInfo))
          //   ),
          // this context menu Adornment is shared by all nodes
          contextMenu: makePartContextMenu()
        }
      )
    );
  };

  /**
   * 流程图元素的双击事件
   * @param ev
   */
  function onObjectDoubleClicked(ev) {
    let part = ev.subject.part;
    showEditNode(part);
  };

  /**
   * 流程图如果有变动，则提示用户保存
   * @param e
   */
  function onDiagramModified(e) {
    let button = document.getElementById("btnSaveFlow");
    if (button) button.disabled = !_designer.isModified;
    let idx = document.title.indexOf("*");
    if (_designer.isModified) {
      if (idx < 0) document.title += "*";
    } else {
      if (idx >= 0) document.title = document.title.substr(0, idx);
    }
  };

  /**
   * 编辑节点信息
   */
  function showEditNode(node) {
    console.log(node.data);
    if (!node.data.key) return;
    if (!node.data.processNodeCode) return;
    // nodeCode = 'END'
    if (node.data.nodeCode === '"END"') {
      // layer.msg("开始和结束步骤不可编辑~");
      Message({
        message: `结束步骤不可编辑~`,
        type: 'error'
      });
      return;
    }
    // if ((node instanceof go.Node) && node.data.figure === 'Circle') {
    //   // layer.msg("开始和结束步骤不可编辑~");
    //   Message({
    //     message: `开始和结束步骤不可编辑~`,
    //     type: 'error'
    //   });
    //   return;
    // }

    store.commit('user/setNode', node);

    // layer.prompt({
    //   formType: 3,
    //   value: node.data.text,
    //   title: '编辑步骤'
    // }, function(value, index, elem){
    //   updateNodeData(node,value);
    //   layer.close(index);
    // });
  }

  this.updateCreateNodeData = (node) => {
    _designer.startTransaction("vacate");
    _designer.model.updateTargetBindings(node);
    _designer.commitTransaction("vacate");
  };

  /**
   * 更新节点信息
   * @param oldData
   * @param newData
   */
  this.updateNodeData = (node, text) => {
    _designer.startTransaction("vacate");
    _designer.model.setDataProperty(node.data, "text", text);
    _designer.commitTransaction("vacate");
  }
  // function updateNodeData(node, text) {
  //
  // };

  /**
   * 更改所有连线中间的文本背景色
   */
  function setLinkTextBg() {
    _designer.links.each((link) => {
      _designer.startTransaction("vacate");
      if (link.data.text) {
        _designer.model.setDataProperty(link.data, "pFill", window.go.GraphObject.make(go.Brush, "Radial", {
          0: "rgb(240, 240, 240)",
          0.3: "rgb(240, 240, 240)",
          1: "rgba(240, 240, 240, 0)"
        }));
      }
      _designer.commitTransaction("vacate");
    });
  };

  /** --------private method------------------end----------------------**/

  return this;
};
