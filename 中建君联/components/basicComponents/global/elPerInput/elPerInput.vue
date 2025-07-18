<template>
  <div
    @dragstart.prevent
    :class="[
      'el-number',
      inputNumberSize ? 'el-number--' + inputNumberSize : '',
      { 'is-disabled': inputNumberDisabled },
      { 'is-without-controls': !controls },
      { 'is-controls-right': controlsAtRight }
    ]">
    <span
      class="el-number__decrease"
      role="button"
      v-if="controls"
      v-repeat-click="decrease"
      :class="{'is-disabled': minDisabled}"
      @keydown.enter="decrease">
      <i :class="`el-icon-${controlsAtRight ? 'arrow-down' : 'minus'}`"></i>
    </span>
    <span
      class="el-number__increase"
      role="button"
      v-if="controls"
      v-repeat-click="increase"
      :class="{'is-disabled': maxDisabled}"
      @keydown.enter="increase">
      <i :class="`el-icon-${controlsAtRight ? 'arrow-up' : 'plus'}`"></i>
    </span>
    <el-input
      ref="input"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="inputNumberDisabled"
      :size="inputNumberSize"
      :max="max"
      :min="min"
      :name="name"
      :maxlength="maxlength"
      :label="label"
      @keydown.up.native.prevent="increase"
      @keydown.down.native.prevent="decrease"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
      @change="handleInputChange">
    </el-input>
  </div>
</template>
<script>
  import Focus from 'element-ui/src/mixins/focus';
  import RepeatClick from 'element-ui/src/directives/repeat-click';

  export default {
    name: 'elPerInput',
    mixins: [Focus('input')],
    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },
    directives: {
      repeatClick: RepeatClick
    },
    props: {
      step: {
        type: Number,
        default: 1
      },
      max: {
        type: Number,
        default: Infinity
      },
      min: {
        type: Number,
        default: -Infinity
      },
      value: {},
      disabled: Boolean,
      size: String,
      controls: {
        type: Boolean,
        default: false
      },
      controlsPosition: {
        type: String,
        default: ''
      },
      name: String,
      label: String,
      placeholder: String,
      maxlength: {}
    },
    data () {
      return {
        currentValue: '',
        userInput: null
      };
    },
    watch: {
      value: {
        immediate: true, // 立即执行
        handler (value) {
          value = value === null || value === undefined ? '' : value ;
          const newVal = value;
          this.currentValue = value !== '' ? newVal : '';
          this.userInput = null;
          this.$emit('input', newVal);
        }
      }
    },
    computed: {
      minDisabled () {
        return this._decrease(this.value, this.step) < this.min;
      },
      maxDisabled () {
        return this._increase(this.value, this.step) > this.max;
      },
      controlsAtRight () {
        return this.controls && this.controlsPosition === 'right';
      },
      _elFormItemSize () {
        return (this.elFormItem || {}).elFormItemSize;
      },
      inputNumberSize () {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      inputNumberDisabled () {
        return this.disabled || (this.elForm || {}).disabled;
      },
      displayValue () {
        if (this.userInput !== null) {
          return this.userInput;
        }
        const currentValue = this.currentValue;
        return currentValue;
      }
    },
    methods: {
      toPrecision (num) {
        return '';
      },
      getPrecision (value) {
        return '';
      },
      _increase (val, step) {
        if (typeof val !== 'number' && val !== undefined) return this.currentValue;

        const precisionFactor = Math.pow(10, this.numPrecision);
        // Solve the accuracy problem of JS decimal calculation by converting the value to integer.
        return this.toPrecision((precisionFactor * val + precisionFactor * step) / precisionFactor);
      },
      _decrease (val, step) {
        if (typeof val !== 'number' && val !== undefined) return this.currentValue;

        const precisionFactor = Math.pow(10, this.numPrecision);

        return this.toPrecision((precisionFactor * val - precisionFactor * step) / precisionFactor);
      },
      increase () {
        if (this.inputNumberDisabled || this.maxDisabled) return;
        const value = this.value || 0;
        const newVal = this._increase(value, this.step);
        this.setCurrentValue(newVal);
      },
      decrease () {
        if (this.inputNumberDisabled || this.minDisabled) return;
        const value = this.value || 0;
        const newVal = this._decrease(value, this.step);
        this.setCurrentValue(newVal);
      },
      handleBlur (event) {
        this.$emit('blur', event);
      },
      handleFocus (event) {
        this.$emit('focus', event);
      },
      setCurrentValue (newVal) {
        const oldVal = this.currentValue;
        if (oldVal === newVal) return;
        this.userInput = null;
        this.$emit('input', newVal);
        this.$emit('change', newVal, oldVal);
        this.currentValue = newVal;
      },
      handleInput (value) {
        this.userInput = value;
      },
      handleInputChange (value) {
        const newVal = value;
        this.setCurrentValue(newVal);
        this.userInput = null;
      },
      select () {
        this.$refs.input.select();
      }
    },
    mounted () {
      const innerInput = this.$refs.input.$refs.input;
      innerInput.setAttribute('role', 'spinbutton');
      innerInput.setAttribute('aria-valuemax', this.max);
      innerInput.setAttribute('aria-valuemin', this.min);
      innerInput.setAttribute('aria-valuenow', this.currentValue);
      innerInput.setAttribute('aria-disabled', this.inputNumberDisabled);
    },
    updated () {
      if (!this.$refs || !this.$refs.input) return;
      const innerInput = this.$refs.input.$refs.input;
      innerInput.setAttribute('aria-valuenow', this.currentValue);
    }
  };
</script>
