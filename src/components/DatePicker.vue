<template>
  <div class="agenda">
    <div
      class="triangle"
      :style="{
        borderColor: `transparent transparent ${colors.hex} transparent`,
      }"
    />
    <div class="header" :style="{ background: colors.hex }">
      <span class="year">{{ selectedDate.format('YYYY') }}</span>
      <span class="date">{{ selectedDate.format('dddd DD MMM') }}</span>
    </div>
    <div class="days">
      <div class="controls">
        <Next class="arrows" @click="prevMonth()" />
        <label>{{ month.getFormatted() }}</label>
        <Previous class="arrows" @click="nextMonth()" />
      </div>
      <div v-for="(day, index) in days" :key="index" class="weekdays">
        {{ day }}
      </div>
      <div class="daysWrapper">
        <div
          class="spacer"
          :style="{ width: month.getWeekStart() * 52 + 'px' }"
        />
        <div
          v-for="(day, index) in month.getDays()"
          :key="`day${index}`"
          class="day"
          :class="{ selected: isSelected(day) }"
          @click="selectDate(day)"
        >
          <span class="overlay" :style="{ background: colors.hex }"></span>
          <span v-if="dayHasTodos(day)" class="taskedOverlay" />
          <span class="text">{{ day.format('D') }}</span>
        </div>
      </div>
      <div class="buttons">
        <button
          :style="{
            background: colors.hex,
            border: '1px solid' + colors.hex,
          }"
          @click="$emit('selectedDate', localSelectedDate)"
        >
          Ok
        </button>
        <button
          :style="{
            background: colors.hex,
            border: '1px solid' + colors.hex,
          }"
          @click="$emit('cancel')"
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
    },
  },
}
</script>

<style lang="sass" scoped>
.daysWrapper
  display: inline-flex
  flex-wrap: wrap

.agenda
  background: white
  position: absolute
  box-shadow: 2px 6px 8px 3px rgba(black, 0.1)
  top: 130px
  width: 392px
  left: 0
  right: 0
  margin: auto
  z-index: 2
  .triangle
    content: ''
    position: absolute
    top: -17px
    left: 0
    right: 0
    margin: auto
    width: 0
    height: 0
    border-style: solid
    border-width: 0 17.5px 17px 17.5px
  .header
    color: white
    padding: 1.5em
    .year
      display: block
      opacity: 0.7
    .date
      font-size: 1.5em
  .days
    width: 392px
    padding: 0 14px 14px 14px
    .controls
      position: relative
      display: flex
      align-items: center
      height: 56px
      justify-content: center
      line-height: 56px
      .arrows
        flex: 2
        width: 24px
        height: 24px
        fill: rgba(black, 0.2)
        vertical-align: middle
      label
        white-space: nowrap
        flex: 2
        color: #757575
    .weekdays
      border-bottom: 1px solid #c2c2c2
      text-align: center
      color: #757575
      padding: 14px
      width: 52px
      display: inline-block
    .spacer
      height: 52px
      vertical-align: top
      text-align: center
      display: inline-block
    .day
      display: inline-flex
      align-items: center
      justify-content: center
      position: relative
      cursor: pointer
      height: 52px
      width: 52px
      &.selected
        .text
          color: white
        .overlay
          opacity: 1
          transform: scale(1)
      &:hover
        .text
          color: white
        .overlay
          transform: scale(1)
          opacity: 0.6
      .overlay
        transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1)
        position: absolute
        transform: scale(0)
        opacity: 0
        z-index: 0
        top: 0
        left: 0
        height: 100%
        width: 100%
        border-radius: 50%
      .taskedOverlay
        transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1)
        position: absolute
        z-index: -1
        box-shadow: 0px 0px 0px 1px #c2c2c2
        top: 0
        left: 0
        height: 100%
        width: 100%
        border-radius: 50%
      .text
        transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1)
        position: relative
        color: #757575
  .buttons
    text-align: right
    button
      background: #55C9FF
      cursor: pointer
      outline: none
      border: 1px solid #55C9FF
      padding: .6em 1em
      border-radius: .2em
      margin-left: 1em
      color: white
      text-transform: uppercase
</style>
