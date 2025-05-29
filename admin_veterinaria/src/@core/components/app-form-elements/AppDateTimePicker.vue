<!-- src/@core/components/app-form-elements/AppDateTimePicker.vue -->
<template>
  <div class="app-picker-field">
    <VInput
      v-bind="{ ...inputProps, ...rootAttrs }"
      :model-value="modelValue"
      :hide-details="props.hideDetails"
      :class="[
        {
          'v-text-field--prefixed': props.prefix,
          'v-text-field--suffixed': props.suffix,
          'v-text-field--flush-details': ['plain','underlined'].includes(props.variant),
        },
        props.class
      ]"
      class="position-relative v-text-field"
      :style="props.style"
    >
      <template #default="{ id, isDirty, isValid, isDisabled, isReadonly }">
        <VField
          v-bind="{ ...fieldProps }"
          :id="id.value"
          role="textbox"
          :active="focused || isDirty.value || isCalendarOpen"
          :focused="focused || isCalendarOpen"
          :dirty="isDirty.value || props.dirty"
          :error="isValid.value === false"
          :disabled="isDisabled.value"
          @click:clear="onClear"
        >
          <template #default="{ props: vFieldProps }">
            <div v-bind="vFieldProps">
              <!-- Pop-up FlatPickr -->
              <FlatPickr
                v-if="!isInlinePicker"
                v-bind="compAttrs"
                ref="refFlatPicker"
                :model-value="modelValue"
                :placeholder="props.placeholder"
                :readonly="isReadonly.value"
                class="flat-picker-custom-style"
                :disabled="isReadonly.value"
                @on-open="isCalendarOpen = true"
                @on-close="isCalendarOpen = false"
                @update:model-value="emitModelValue"
              />
              <!-- Fallback input in inline mode -->
              <input
                v-else
                :value="modelValue"
                :placeholder="props.placeholder"
                :readonly="isReadonly.value"
                class="flat-picker-custom-style"
                type="text"
              />
            </div>
          </template>
        </VField>
      </template>
    </VInput>

    <!-- FlatPickr en inline mode -->
    <FlatPickr
      v-if="isInlinePicker"
      v-bind="compAttrs"
      ref="refFlatPicker"
      :model-value="modelValue"
      @update:model-value="emitModelValue"
      @on-open="isCalendarOpen = true"
      @on-close="isCalendarOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted, useAttrs } from 'vue'
import FlatPickr from 'vue-flatpickr-component'
import { useTheme } from 'vuetify'
import {
  VField,
  filterFieldProps,
  makeVFieldProps,
} from 'vuetify/lib/components/VField/VField'
import {
  VInput,
  makeVInputProps,
} from 'vuetify/lib/components/VInput/VInput'
import { filterInputAttrs } from 'vuetify/lib/util/helpers'
import { useConfigStore } from '@core/stores/config'
import { useFocus } from 'vuetify/lib/composables/focus'

const props = defineProps({
  autofocus: Boolean,
  counter: [ Boolean, Number, String ],
  counterValue: Function,
  prefix: String,
  placeholder: String,
  persistentPlaceholder: Boolean,
  persistentCounter: Boolean,
  suffix: String,
  type: { type: String, default: 'text' },
  modelModifiers: Object,
  ...makeVInputProps({ density: 'comfortable', hideDetails: 'auto' }),
  ...makeVFieldProps({ variant: 'outlined', color: 'primary' }),
})

const emit = defineEmits([
  'click:control',
  'mousedown:control',
  'update:focused',
  'update:modelValue',
  'click:clear',
])

defineOptions({ inheritAttrs: false })

// Store & attrs
const configStore = useConfigStore()
const attrs       = useAttrs()
const [rootAttrs, compAttrs] = filterInputAttrs(attrs)

// Split props
const { modelValue: _ignore, ...inputProps } = VInput.filterProps(props)
const fieldProps = filterFieldProps(props)

// Refs & state
const refFlatPicker  = ref(null)
const { focused }    = useFocus(refFlatPicker)
const isCalendarOpen = ref(false)
const isInlinePicker = ref(false)

// Detect inline
if (compAttrs.config && compAttrs.config.inline) {
  isInlinePicker.value = compAttrs.config.inline
  Object.assign(compAttrs, { altInputClass: 'inlinePicker' })
}

// Inject year-jump buttons + dropdown
function addYearNav(fp) {
  const nav = fp.calendarContainer.querySelector('.flatpickr-months')
  if (!nav || nav.dataset.yearInjected) return
  nav.dataset.yearInjected = 'true'

  // ← año
  const btnPrevYear = document.createElement('span')
  btnPrevYear.classList.add('flatpickr-prev-year')
  btnPrevYear.innerHTML = '<i class="ri-arrow-left-s-line v-icon"></i>'
  btnPrevYear.addEventListener('click', () => fp.changeMonth(-12))
  nav.insertBefore(btnPrevYear, nav.firstChild)

  // selector de año
  const sel = document.createElement('select')
  sel.classList.add('flatpickr-year-dropdown')
  const curY = fp.currentYear
  const minY = fp.config.minDate?.getFullYear() ?? curY - 100
  const maxY = fp.config.maxDate?.getFullYear() ?? curY + 50
  for (let y = minY; y <= maxY; y++) {
    const opt = document.createElement('option')
    opt.value = y
    opt.textContent = y
    if (y === curY) opt.selected = true
    sel.appendChild(opt)
  }
  sel.addEventListener('change', e => fp.changeYear(+e.target.value))
  btnPrevYear.insertAdjacentElement('afterend', sel)

  // → año
  const btnNextYear = document.createElement('span')
  btnNextYear.classList.add('flatpickr-next-year')
  btnNextYear.innerHTML = '<i class="ri-arrow-right-s-line v-icon"></i>'
  btnNextYear.addEventListener('click', () => fp.changeMonth(12))
  nav.appendChild(btnNextYear)
}

// Extiende configuración de FlatPickr
compAttrs.config = {
  ...compAttrs.config,
  monthSelectorType: 'dropdown',
  allowInput: true,
  prevArrow: `<i class="ri-arrow-left-s-line v-icon" style="font-size:22px;height:22px;width:22px;"></i>`,
  nextArrow: `<i class="ri-arrow-right-s-line v-icon" style="font-size:22px;height:22px;width:22px;"></i>`,
  onReady:       [(_d,_s,fp) => addYearNav(fp)],
  onMonthChange: [(_d,_s,fp) => addYearNav(fp)],
}

const onClear = e => {
  e.stopPropagation()
  nextTick(() => {
    emit('update:modelValue','')
    emit('click:clear',e)
  })
}

// Sincroniza tema
const vuetifyTheme = useTheme()
const themeNames   = Object.keys(vuetifyTheme.themes.value)
function updateThemeClass() {
  const cal = refFlatPicker.value?.fp?.calendarContainer
  if (!cal) return
  themeNames.forEach(t => cal.classList.remove(`v-theme--${t}`))
  cal.classList.add(`v-theme--${vuetifyTheme.global.name.value}`)
}
watch(() => configStore.theme, updateThemeClass)
onMounted(updateThemeClass)

const emitModelValue = v => emit('update:modelValue', v)
</script>

<style lang="scss">
@use "flatpickr/dist/flatpickr.css";
@use "@core/scss/base/mixins";

.flat-picker-custom-style {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  padding-block: 0;
  padding-inline: var(--v-field-padding-start);
  color: inherit;
  outline: none;
}

// Oculta input en inline mode
input[altinputclass="inlinePicker"] {
  display: none;
}

.flatpickr-calendar {
  border-radius: 0.625rem;
  background-color: rgb(var(--v-theme-surface));
  inline-size: 16.875rem;
  @include mixins.elevation(6);

  .flatpickr-day:focus {
    border-color: rgba(var(--v-border-color), var(--v-border-opacity));
    background: rgba(var(--v-border-color), var(--v-border-opacity));
  }

  .flatpickr-rContainer {
    inline-size: 16.875rem;

    .flatpickr-weekdays {
      padding-inline: 0.5rem;
    }

    .flatpickr-days {
      font-size: 0.9375rem;
      min-inline-size: 16.875rem;

      .dayContainer {
        justify-content: center !important;
        inline-size: 16.875rem !important;
        min-inline-size: 16.875rem !important;
        padding-block: 0.75rem 0.5rem;

        .flatpickr-day {
          block-size: 36px;
          line-height: 36px;
          margin-block-start: 0 !important;
          max-inline-size: 36px;
        }
      }
    }
  }

  .flatpickr-day {
    color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));

    &.today {
      &, &:hover {
        border-color: transparent;
        background-color: rgb(var(--v-theme-primary), 0.24);
        color: rgba(var(--v-theme-primary));
      }
    }

    &.selected,
    &.selected:hover {
      border-color: rgb(var(--v-theme-primary));
      background: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-on-primary)) !important;
      @include mixins.elevation(2);
    }

    &.inRange,
    &.inRange:hover {
      border: none;
      background: rgba(var(--v-theme-primary), 0.1) !important;
      box-shadow: none !important;
      color: rgb(var(--v-theme-primary));
    }

    &.inRange.today {
      background: rgba(var(--v-theme-primary), 0.24) !important;
    }

    &.startRange,
    &.endRange {
      @include mixins.elevation(2);
    }

    &.startRange,
    &.endRange,
    &.startRange:hover,
    &.endRange:hover {
      border-color: rgb(var(--v-theme-primary));
      background: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-on-primary));
    }

    &.selected.startRange + .endRange:not(:nth-child(7n + 1)),
    &.startRange.startRange + .endRange:not(:nth-child(7n + 1)),
    &.endRange.startRange + .endRange:not(:nth-child(7n + 1)) {
      box-shadow: -10px 0 0 rgb(var(--v-theme-primary));
    }

    &.flatpickr-disabled,
    &.prevMonthDay:not(.startRange,.inRange),
    &.nextMonthDay:not(.endRange,.inRange) {
      color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity));
    }

    &:hover {
      border-color: transparent;
      background: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
      color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
    }
  }

  .flatpickr-weekday {
    color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
  }

  &::after, &::before { display: none; }

  .flatpickr-months {
    padding-block: 0.25rem;
    padding-inline: 2px;

    .flatpickr-prev-month,
    .flatpickr-next-month {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      block-size: 38px;
      inline-size: 38px;
      color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));

      svg {
        block-size: 13px;
        inline-size: 13px;
        stroke: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
      }

      &:hover i,
      &:hover svg {
        fill: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
      }
    }
  }

  .flatpickr-current-month {
    padding-block: 6px 0;
    padding-inline: 0;

    span.cur-month {
      font-weight: 400;
    }

    .flatpickr-monthDropdown-months {
      appearance: none;
      block-size: 24px;
    }

    .flatpickr-monthDropdown-months,
    .numInputWrapper {
      padding: 2px;
      border-radius: 4px;
      color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
      font-size: 0.9375rem;
      font-weight: 400;
      transition: all 0.15s ease-out;

      span { display: none; }

      input.cur-year {
        font-weight: 400 !important;
      }

      .flatpickr-monthDropdown-month {
        background-color: rgb(var(--v-theme-surface));
      }
    }
  }

  &.open { z-index: 2401; }

  &.hasTime.open .flatpickr-time { border: none; block-size: auto; }
  &.hasTime:first-child .flatpickr-time { border-color: transparent; }
}

// Time picker hover & focus
.flatpickr-time input:hover,
.flatpickr-time .flatpickr-am-pm:hover,
.flatpickr-time input:focus,
.flatpickr-time .flatpickr-am-pm:focus {
  background: transparent;
}

// Time picker layout
.flatpickr-time {
  input.flatpickr-hour { font-weight: 400; }
  .flatpickr-am-pm,
  .flatpickr-time-separator,
  input { color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity)); }
  .numInputWrapper span.arrowUp::after { border-block-end-color: rgb(var(--v-border-color)); }
  .numInputWrapper span.arrowDown::after { border-block-start-color: rgb(var(--v-border-color)); }
}

// readonly inputs bg
.flatpickr-input[readonly],
.flatpickr-input ~ .form-control[readonly],
.flatpickr-human-friendly[readonly] {
  background-color: inherit;
}

// Weekdays row spacing
.flatpickr-weekdays { margin-block: 0.375rem !important; }

// Disabled day styling
.flatpickr-day.flatpickr-disabled,
.flatpickr-day.flatpickr-disabled:hover {
  color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
}

// ==== Botones salto año ====
.flatpickr-prev-year,
.flatpickr-next-year {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  cursor: pointer;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}
.flatpickr-prev-year:hover,
.flatpickr-next-year:hover {
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

// ==== Selector de año ====
.flatpickr-year-dropdown {
  margin: 0 4px;
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  text-align: center;
  cursor: pointer;
  appearance: none;
}
</style>
