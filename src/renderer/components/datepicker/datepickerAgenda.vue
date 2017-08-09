<template lang="pug">
.agenda
  .header
      span.year {{ year }}
      span.date {{ date_formatted }}
  .days
    .weekdays(v-for="(day, index) in days", key="index")
      | {{day}}
    .day(:style="{width: (month.getWeekStart() * 41) + 'px'}")
    .day(v-for="day in month.getDays()")
      | {{ day.format('DD') }}
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
    .weekdays
      text-align: center
      padding: 14px
      width: 41px
      display: inline-block
    .day
      width: 41px
      height: 41px
      vertical-align: top
      text-align: center
      display: inline-block
</style>
