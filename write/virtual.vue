<template>
  <div 
    class="virtual-list" 
    :style="{ height: containerHeight + 'px' }"
    @scroll="handleScroll"
  >
    <!-- 占位容器：撑开滚动高度 -->
    <div 
      class="virtual-list-phantom"
      :style="{ height: totalHeight + 'px' }"
    ></div>
    
    <!-- 实际渲染的列表 -->
    <div 
      class="virtual-list-content"
      :style="{ transform: `translateY(${offsetY}px)` }"
    >
      <div 
        v-for="item in visibleItems" 
        :key="item.id"
        class="virtual-list-item"
        :data-index="item.index"
        :ref="(el) => setItemRef(el, item.index)"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  estimatedItemHeight: {
    type: Number,
    default: 50
  },
  containerHeight: {
    type: Number,
    default: 600
  },
  bufferSize: {
    type: Number,
    default: 5
  }
});

const scrollTop = ref(0);
const itemHeights = ref(new Map()); // 存储每个项的实际高度
const itemOffsets = ref(new Map()); // 存储每个项的偏移量
const itemRefs = ref(new Map()); // 存储每个项的 DOM 引用
const isInitialized = ref(false); // 是否已初始化

// 计算位置信息
const calculatePositions = () => {
  let offset = 0;
  
  props.items.forEach((_, index) => {
    const height = itemHeights.value.get(index) || props.estimatedItemHeight;
    itemOffsets.value.set(index, offset);
    offset += height;
  });
};

// 总高度
const totalHeight = computed(() => {
  let height = 0;
  props.items.forEach((_, index) => {
    height += itemHeights.value.get(index) || props.estimatedItemHeight;
  });
  return height;
});

// 二分查找起始索引
const findStartIndex = (scrollTop) => {
  let start = 0;
  let end = props.items.length - 1;
  
  while (start < end) {
    const mid = Math.floor((start + end) / 2);
    const offset = itemOffsets.value.get(mid) || mid * props.estimatedItemHeight;
    
    if (offset < scrollTop) {
      start = mid + 1;
    } else {
      end = mid;
    }
  }
  
  return start;
};

// 起始索引
const startIndex = computed(() => {
  if (itemOffsets.value.size === 0) {
    return Math.floor(scrollTop.value / props.estimatedItemHeight);
  }
  return findStartIndex(scrollTop.value);
});

// 可见项数
const visibleCount = computed(() => Math.ceil(props.containerHeight / props.estimatedItemHeight));

// 结束索引
const endIndex = computed(() => {
  let end = startIndex.value + visibleCount.value;
  let currentHeight = 0;
  
  for (let i = startIndex.value; i < props.items.length; i++) {
    const height = itemHeights.value.get(i) || props.estimatedItemHeight;
    currentHeight += height;
    
    if (currentHeight >= props.containerHeight) {
      end = i + 1;
      break;
    }
  }
  
  return Math.min(end, props.items.length);
});

// 实际渲染的索引
const renderStartIndex = computed(() => Math.max(0, startIndex.value - props.bufferSize));
const renderEndIndex = computed(() => Math.min(
  endIndex.value + props.bufferSize,
  props.items.length - 1
));

// 可见项
const visibleItems = computed(() => {
  const items = [];
  for (let i = renderStartIndex.value; i <= renderEndIndex.value; i++) {
    items.push({
      ...props.items[i],
      index: i
    });
  }
  return items;
});

// 偏移量
const offsetY = computed(() => {
  if (itemOffsets.value.size === 0) {
    return renderStartIndex.value * props.estimatedItemHeight;
  }
  return itemOffsets.value.get(renderStartIndex.value) || 0;
});

// ⭐ 关键：设置元素引用并测量高度
const setItemRef = (el, index) => {
  if (el) {
    itemRefs.value.set(index, el);
    
    // 获取元素的实际高度
    const height = el.offsetHeight;
    
    // 如果高度发生变化，更新缓存
    if (height !== itemHeights.value.get(index)) {
      itemHeights.value.set(index, height);
      
      // 重新计算所有位置
      calculatePositions();
    }
  } else {
    // 元素被卸载时，清除引用
    itemRefs.value.delete(index);
  }
};

// 滚动处理
const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop;
};

// 滚动到指定位置
const scrollToIndex = (index) => {
  const container = document.querySelector('.virtual-list');
  if (container) {
    const offset = itemOffsets.value.get(index) || index * props.estimatedItemHeight;
    container.scrollTop = offset;
  }
};

// 初始化：先渲染第一批元素以获取实际高度
const initializeHeights = async () => {
  // 等待首次渲染完成
  await nextTick();
  
  // 获取所有已渲染元素的高度
  for (const [index, el] of itemRefs.value) {
    const height = el.offsetHeight;
    if (height > 0) {
      itemHeights.value.set(index, height);
    }
  }
  
  // 重新计算位置
  calculatePositions();
  
  isInitialized.value = true;
};

// 监听可见项变化，确保新渲染的元素高度被测量
watch(visibleItems, async () => {
  if (!isInitialized.value) {
    await initializeHeights();
  } else {
    // 已初始化后，使用 nextTick 确保新元素已渲染
    await nextTick();
    // 新渲染的元素会通过 setItemRef 自动更新高度
  }
}, { immediate: true });

// 组件挂载时初始化
onMounted(() => {
  calculatePositions();
});

defineExpose({
  scrollToIndex
});
</script>
