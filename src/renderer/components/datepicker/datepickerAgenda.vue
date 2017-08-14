<template lang="pug">
.agenda(v-if="visible")
  .triangle(:style="{ borderColor: 'transparent transparent rgba(' + this.color2.rgba.r + ', ' + this.color2.rgba.g + ', ' + this.color2.rgba.b + ', 0.8) transparent' }")
  .header(:style="{ background: this.color2.hex, opacity: 0.8 }")
      span.year {{ year }}
      span.date {{ date_formatted }}
  .days
    .controls
      label {{ month.getFormatted() }}
      button.next(@click="nextMonth()") 
        svg(viewBox="0 0 492.004 492.004")
          path(d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z")
      button.prev(@click="prevMonth()")
        svg(viewBox="0 0 492.004 492.004")
          path(d="M198.608,246.104L382.664,62.04c5.068-5.056,7.856-11.816,7.856-19.024c0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12C361.476,2.792,354.712,0,347.504,0s-13.964,2.792-19.028,7.864L109.328,227.008c-5.084,5.08-7.868,11.868-7.848,19.084c-0.02,7.248,2.76,14.028,7.848,19.112l218.944,218.932c5.064,5.072,11.82,7.864,19.032,7.864c7.208,0,13.964-2.792,19.032-7.864l16.124-16.12c10.492-10.492,10.492-27.572,0-38.06L198.608,246.104z")
    .weekdays(v-for="(day, index) in days", key="index")
      | {{day}}
    .spacer(:style="{width: (month.getWeekStart() * 52) + 'px'}")
    .day(v-for="day in month.getDays()", @click="selectDate(day)", :class="{tasked: isTasked(day.format('YYYY-MM-DD')), selected: isSelected(day)}")
      span.overlay(:style="{ background: color2.hex }") 
      // span {{ isTasked(day.format('YYYY-MM-DD')) }}
      span.text {{ day.format('D') }}
    .buttons
      button(@click="submit", :style="{ background: this.color2.hex, border: '1px solid' + this.color2.hex }") Ok
      button(@click="cancel", :style="{ background: this.color2.hex, border: '1px solid' + this.color2.hex }") Cancel
</template>

<script>
import Month from './month.js'

import * as db from '../../db/database.js'

export default {
  props: {
    date: {},
    visible: { type: Boolean, default: true },
    color2: { type: Object }
  },
  data () {
    return {
      test: false,
      mutableDate: this.date,
      days: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      month: new Month(this.date.month(), this.date.year())
    }
  },
  methods: {
    nextMonth () {
      let month = this.month.month + 1
      let year = this.month.year
      if (month > 11) {
        year += 1
        month = 0
      }
      this.month = new Month(month, year)
    },
    prevMonth () {
      let month = this.month.month - 1
      let year = this.month.year
      if (month < 0) {
        year -= 1
        month = 11
      }
      this.month = new Month(month, year)
    },
    /* eslint-disable */

    isTasked: async function (day) {
      return await db.isTodo(day).then((response) => {
        if (response.length > 0) {
          return true
        } else {
          return false
        }
      })
    },
    isSelected (day) {
      return this.mutableDate.unix() === day.unix()
    },
    selectDate (day) {
      this.mutableDate = day
    },
    submit () {
      this.$emit('change', this.mutableDate)
    },
    cancel () {
      this.$emit('cancel')
    }
  },
  computed: {
    year () {
      return this.mutableDate.format('YYYY')
    },
    date_formatted () {
      return this.mutableDate.format('dddd DD MMM')
    }
  }
}
</script>

<style lang="sass" scoped>
.agenda
  background: rgba(white, 0.8)
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
      height: 56px
      line-height: 56px
      text-align: center
      label
        position: absolute
        top: 0
        left: 0
        right: 0
        bottom: 0
      button
        position: relative
        border: none
        background: transparent
        user-select: none
        outline: none
        cursor: pointer
        svg
          margin-top: 1.1em
          width: 24px
          height: 24px
          fill: rgba(black, 0.2)
          vertical-align: middle
        &.next
          float: right
        &.prev
          float: left
    .weekdays
      text-align: center
      border-bottom: 1px solid #c2c2c2
      margin-bottom: 1.5em
      padding: 14px
      width: 52px
      display: inline-block
    .spacer
      height: 52px
      vertical-align: top
      text-align: center
      display: inline-block
    .day
      position: relative
      cursor: pointer
      height: 52px
      width: 52px
      vertical-align: top
      text-align: center
      display: inline-block
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
        top: -8px
        left: 8px
        height: 36px
        width: 36px
        border-radius: 50%
        //background: #55C9FF
      .text
        transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1)
        position: relative
        color: black
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
