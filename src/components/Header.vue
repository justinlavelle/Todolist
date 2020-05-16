<template>
  <header :class="$style.wrapper" :style="{ background: colors.hex }">
    <div :class="$style.menu">
      <span :class="$style.dateFormatted">
        {{ selectedDate.format('YYYY-MM-DD') }}
      </span>
      <div :class="$style.icons">
        <CalendarIcon
          :class="$style.calendar"
          @click="datePickerVisible = true"
        />
        <ColorPickerIcon
          :class="$style.picker"
          @click="colorPickerVisible = true"
        />
      </div>
      <DatePicker
        v-if="datePickerVisible"
        :colors="colors"
        :selected-date="selectedDate"
        :tasked-days="taskedDays"
        @close="datePickerVisible = false"
        @selectedDate="handleSelectedDate"
      />
    </div>
    <Transition name="slideUp">
      <div v-if="colorPickerVisible" :class="$style.pickerContent">
        <Sketch :class="$style.sketch" :value="colors" @input="handleSketch" />
        <button
          :style="{
            background: colors.hex,
            border: '1px solid' + colors.hex,
          }"
          :class="$style.sketchButton"
          @click="
            () => {
              colorPickerVisible = false
              $emit('saveColor')
            }
          "
        >
          Ok
        </button>
      </div>
    </Transition>
    <input
      v-if="isInputAvailable"
      v-model="newTodoName"
      :class="$style.newTodo"
      type="text"
      placeholder="Create a task"
      @keyup.enter="
        () => {
          if (!newTodoName) {
            return
          }

          $emit('createTodo', newTodoName)
          newTodoName = ''
        }
      "
    />
  </header>
</template>

<script>
import DatePicker from './DatePicker'
import { Sketch } from 'vue-color'
import ColorPickerIcon from '@assets/color-picker.svg'
import CalendarIcon from '@assets/calendar.svg'
import moment from 'moment'

export default {
  components: {
    DatePicker,
    Sketch,
    ColorPickerIcon,
    CalendarIcon,
  },
  props: {
    colors: {
      type: Object,
      required: true,
    },
    selectedDate: {
      type: Object,
      required: true,
    },
    taskedDays: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      newTodoName: '',
      colorPickerVisible: false,
      datePickerVisible: false,
    }
  },
  computed: {
    isInputAvailable() {
      return (
        this.selectedDate.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
      )
    },
  },
  methods: {
    handleSketch(color) {
      return this.$emit('selectedColor', color)
    },
    handleSelectedDate(date) {
      return this.$emit('selectedDate', date)
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  width: 100%;
  margin: 0;
  top: 0;
  position: sticky;
  padding: 0;
  z-index: 2;
  -webkit-app-region: drag;
}

.icons {
  flex: 5;
}

.calendar {
  margin: 0 2rem;
}

.sketch {
  box-shadow: none !important;
  position: absolute;
  left: 0;
  border: none !important;
  box-shadow: none;
  border-radius: 0 !important;
  right: 0;
  margin: auto;
  background: transparent !important;
}

.sketchButton {
  position: absolute;
  right: 1em;
  bottom: 1em;
  cursor: pointer;
  outline: none;
  padding: 0.6em 1em;
  border-radius: 0.2em;
  color: white;
  text-transform: uppercase;
}

.pickerContent {
  position: absolute;
  box-shadow: 2px 6px 8px 3px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.8);
  width: 230px;
  height: 350px;
  text-align: right;
  left: 0;
  display: inline-block;
  right: 0;
  margin: auto;
}

.calendar,
.picker {
  -webkit-app-region: no-drag;
  width: 20px;
  height: 20px;
  fill: black;
  transition: 0.8s all cubic-bezier(0, 0.54, 0.5, 1);
  cursor: pointer;
}

.calendar.calendar,
.picker.calendar {
  left: 69%;
  top: 40%;
}

.calendar.picker,
.picker.picker {
  left: 75%;
}

.calendar:hover,
.picker:hover {
  transform: scale(1.3) rotate(5deg);
}

.menu {
  position: relative;
  padding: 2.5em 1em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu:before {
  content: '';
  width: 100%;
  flex: 5;
}

.dateFormatted {
  white-space: nowrap;
  flex: 1;
  word-wrap: none;
  font-size: 1.7em;
  font-weight: 100;
  color: white;
}

.newTodo {
  -webkit-app-region: no-drag;
  border: none;
  font-size: 1.5em;
  font-weight: 200;
  padding: 1em;
  width: 100%;
  margin: 0;
  outline: none;
  box-shadow: 0 5px 10px 1px rgba(0, 0, 0, 0.06);
}
</style>
