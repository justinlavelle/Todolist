<template lang="pug">
.agenda
  .header
      span.year {{ year }}
      span.date {{ date_formatted }}
  .days
    .weekdays(v-for="(day, index) in days", key="index")
      | {{day}}
    .spacer(:style="{width: (month.getWeekStart() * 41) + 'px'}")
    .day(v-for="day in month.getDays()")
      span.overlay
      span.text {{ day.format('D') }}
</template>

<script>
import Month from './month.js'

export default {
  props: ['date'],
  data () {
    return {
      days: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      month: new Month(this.date.month(), this.date.year())
    }
  },
  computed: {
    year () {
      return this.date.format('YYYY')
    },
    date_formatted () {
      return this.date.format('dddd DD MMM')
    }
  }
}
</script>

<style lang="sass" scoped>
.agenda
  background: white
  border: 1px solid #000
  position: absolute
  top: 100%
  z-index: 5
  .header
    background: red
    color: white
    padding: 1.5em
    .year
      display: block
      opacity: 0.7
    .date
      font-size: 1.5em
  .days
    width: 294px
    .weekdays
      text-align: center
      padding: 14px
      width: 41px
      display: inline-block
    .spacer
      height: 41px
      vertical-align: top
      text-align: center
      display: inline-block
    .day
      position: relative
      cursor: pointer
      height: 41px
      width: 41px
      vertical-align: top
      text-align: center
      display: inline-block
      .overlay
        position: absolute
        top: -7px
        left: 3px
        height: 36px
        width: 36px
        border-radius: 50%
        background: red
      .text
        position: relative
        color: white

</style>
