// 命名空间一个最明确的目的就是解决重名问题

namespace SomeNameSpaceName {
  export interface ISomeInterfaceName {}
  export class SomeClassName {}
}

// 使用方式如下：
SomeNameSpaceName.SomeClassName
