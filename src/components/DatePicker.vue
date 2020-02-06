<template>
  <div :class="$style.agenda">
    <div
      :class="$style.triangle"
      :style="{
        borderColor: `transparent transparent ${colors.hex} transparent`,
      }"
    />
    <div :class="$style.header" :style="{ background: colors.hex }">
      <span :class="$style.year">{{ selectedDate.format('YYYY') }}</span>
      <span :class="$style.date">{{ selectedDate.format('dddd DD MMM') }}</span>
    </div>
    <div :class="$style.days">
      <div :class="$style.controls">
        <Next :class="$style.arrows" @click="prevMonth()" />
        <label>{{ month.getFormatted() }}</label>
        <Previous :class="$style.arrows" @click="nextMonth()" />
      </div>
      <div v-for="(day, index) in days" :key="index" :class="$style.weekdays">
        {{ day }}
      </div>
      <div :class="$style.daysWrapper">
        <div
          :class="$style.spacer"
          :style="{ width: month.getWeekStart() * 52 + 'px' }"
        />
        <div
          v-for="(day, index) in month.getDays()"
          :key="`day${index}`"
          :class="[$style.day, { [$style.selected]: isSelected(day) }]"
          @click="selectDate(day)"
        >
          <span
            :class="$style.overlay"
            :style="{ background: colors.hex }"
          ></span>
          <span v-if="dayHasTodos(day)" :class="$style.taskedOverlay" />
          <span v-if="isToday(day)" :class="$style.todayOverlay" />
          <span :class="$style.text">{{ day.format('D') }}</span>
        </div>
      </div>
      <div :class="$style.buttons">
        <button
          :style="{
            background: colors.hex,
            border: '1px solid' + colors.hex,
          }"
          @click="$emit('close')"
        >
          Ok
        </button>
        <button
          :style="{
            background: colors.hex,
            border: '1px solid' + colors.hex,
          }"
          @click="$emit('close')"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Month from '@core/month.js'
import Next from '@assets/next.svg'
import Previous from '@assets/previous.svg'
import moment from 'moment'

export default {
  components: {
    Next,
    Previous,
  },
  props: {
    taskedDays: {
      type: Array,
      required: true,
    },
    selectedDate: {
      type: Object,
      required: true,
    },
    colors: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localSelectedDate: this.selectedDate,
      days: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      month: new Month(this.selectedDate.month(), this.selectedDate.year()),
    }
  },
  methods: {
    dayHasTodos(day) {
      return this.taskedDays.some(item => item === day.format('YYYY-MM-DD'))
    },
    isToday(day) {
      return moment().format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
    },
    nextMonth() {
      let month = this.month.month + 1
      let year = this.month.year
      if (month > 11) {
        year += 1
        month = 0
      }
      this.month = new Month(month, year)
    },
    getMonth() {
      let mm = this.month.month + 1
      let yy = this.month.year

      mm = mm < 10 ? '0' + mm : mm

      return yy + '-' + mm
    },
    prevMonth() {
      let month = this.month.month - 1
      let year = this.month.year
      if (month < 0) {
        year -= 1
        month = 11
      }
      this.month = new Month(month, year)
    },
    isSelected(day) {
      return (
        this.localSelectedDate.format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
      )
    },
    selectDate(day) {
      this.localSelectedDate = day
      this.$emit('selectedDate', day)
    },
  },
}
</script>

<style lang="scss" module>
.daysWrapper {
  display: inline-flex;
  flex-wrap: wrap;
}

.agenda {
  background: rgba(white, 0.8);
  position: absolute;
  box-shadow: 2px 6px 8px 3px rgba(0, 0, 0, 0.1);
  top: 130px;
  width: 392px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 2;
}

.agenda .triangle {
  content: '';
  position: absolute;
  top: -17px;
  left: 0;
  right: 0;
  margin: auto;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 17.5px 17px 17.5px;
}

.agenda .header {
  color: white;
  padding: 1.5em;
}

.agenda .header .year {
  display: block;
  opacity: 0.7;
}

.agenda .header .date {
  font-size: 1.5em;
}

.agenda .days {
  width: 392px;
  padding: 0 14px 14px 14px;
}

.agenda .days .controls {
  position: relative;
  display: flex;
  align-items: center;
  height: 56px;
  justify-content: center;
  line-height: 56px;
}

.agenda .days .controls .arrows {
  flex: 2;
  width: 24px;
  height: 24px;
  fill: rgba(0, 0, 0, 0.2);
  vertical-align: middle;
}

.agenda .days .controls label {
  white-space: nowrap;
  flex: 2;
  color: #757575;
}

.agenda .days .weekdays {
  border-bottom: 1px solid #c2c2c2;
  text-align: center;
  color: #757575;
  padding: 14px;
  width: 52px;
  display: inline-block;
}

.agenda .days .spacer {
  height: 52px;
  vertical-align: top;
  text-align: center;
  display: inline-block;
}

.agenda .days .day {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  height: 52px;
  width: 52px;
}

.agenda .days .day.selected .text {
  color: white;
}

.agenda .days .day.selected .overlay {
  opacity: 1;
  transform: scale(1);
}

.agenda .days .day:hover .text {
  color: white;
}

.agenda .days .day:hover .overlay {
  transform: scale(1);
  opacity: 0.6;
}

.agenda .days .day .overlay {
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1);
  position: absolute;
  transform: scale(0);
  opacity: 0;
  z-index: 0;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 50%;
}

.agenda .days .day .taskedOverlay {
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1);
  position: absolute;
  z-index: -1;
  box-shadow: 0px 0px 0px 1px #c2c2c2;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 50%;
}

.todayOverlay {
  position: absolute;
  top: 0;
  left: 0;
  background: #c2c2c2;
  z-index: -1;
  height: 100%;
  width: 100%;
  border-radius: 50%;
}

.agenda .days .day .text {
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  color: #757575;
}

.agenda .buttons {
  text-align: right;
}

.agenda .buttons button {
  cursor: pointer;
  outline: none;
  padding: 0.6em 1em;
  border-radius: 0.2em;
  margin-left: 1em;
  color: white;
  text-transform: uppercase;
}
</style>
