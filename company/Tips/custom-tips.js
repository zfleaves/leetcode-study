import ElTooltip from 'element-ui/packages/tooltip'
import debounce from 'throttle-debounce/debounce'

export default {
  name: 'CustomTips',
  components: {
    ElTooltip
  },
  props: {
    effect: {
      type: String,
      default: 'light'
    },
    lineClass: {
      type: String,
      default: 'one'
    },
    content: {
      type: String,
      default: ''
    },
    html: {
      type: String,
      default: ''
    },
    tooltipClass: {
      type: String,
      default: ''
    }
  },
  render(h) {
    const span = h('span', {
      domProps: {
        className: 'g-custom-span',
        innerHTML: this.html
      }
    })
    const className = `custom-tip-wrap ${this.lineClass}`
    const popperClassName = `tool-tip-content ${this.tooltipClass}`
    if (this.html) {
      return (
        <div
          class={className}
          on-mouseenter={($event) => this.handleCellMouseEnter($event)}
          on-mouseleave={this.handleCellMouseLeave}
        >
          {this.$slots.default}
          <el-tooltip
            effect={this.effect}
            placement="top"
            ref="tooltip"
            popper-class={popperClassName}
            content={this.tooltipContent}
          >
            <div slot="content">{span}</div>
          </el-tooltip>
        </div>
      )
    }
    return (
      <div
        class={className}
        on-mouseenter={($event) => this.handleCellMouseEnter($event)}
        on-mouseleave={this.handleCellMouseLeave}
      >
        {this.$slots.default}
        <el-tooltip
          effect={this.effect}
          placement="top"
          ref="tooltip"
          popper-class={popperClassName}
          content={this.tooltipContent}
        >
        </el-tooltip>
      </div>
    )
  },
  data() {
    return {
      tooltipContent: ''
    }
  },
  created() {
    this.activateTooltip = debounce(50, (tooltip) => tooltip.handleShowPopper())
  },
  methods: {
    handleCellMouseEnter(event) {
      let cellChild = null
      if (event.target.className) {
        cellChild = event.target
      } else {
        event.target.querySelector('.custom-tip-wrap')
      }
      if (!cellChild) return
      if (this.lineClass === 'one') {
        const range = document.createRange()
        range.setStart(cellChild, 0)
        range.setEnd(cellChild, cellChild.childNodes.length)
        const rangeWidth = range.getBoundingClientRect().width
        // console.log('rangeWidth: ', rangeWidth)
        // rangeWidth > cellChild.offsetWidth ||
        if (
          cellChild.scrollWidth > cellChild.offsetWidth &&
          this.$refs.tooltip
        ) {
          const tooltip = this.$refs.tooltip
          // TODO 会引起整个 Table 的重新渲染，需要优化
          this.tooltipContent = this.html ||
          this.content || cellChild.innerText || cellChild.textContent
          tooltip.referenceElm = cellChild
          tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none')
          tooltip.doDestroy()
          tooltip.setExpectedState(true)
          this.activateTooltip(tooltip)
        }
        return
      }
      const computedStyle = window.getComputedStyle(cellChild)
      const lineHeight = parseInt(
        computedStyle.getPropertyValue('line-height'),
        10
      )
      var contentHeight = cellChild.scrollHeight
      if (
        contentHeight > parseInt(computedStyle.height, 10) &&
        this.$refs.tooltip
      ) {
        const tooltip = this.$refs.tooltip
        // TODO 会引起整个 Table 的重新渲染，需要优化
        this.tooltipContent = this.html ||
          this.content || cellChild.innerText || cellChild.textContent
        tooltip.referenceElm = cellChild
        tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none')
        tooltip.doDestroy()
        tooltip.setExpectedState(true)
        this.activateTooltip(tooltip)
      }
    },
    handleCellMouseLeave(event) {
      const tooltip = this.$refs.tooltip
      if (tooltip) {
        tooltip.setExpectedState(false)
        tooltip.handleClosePopper()
      }
    }
  }
}
