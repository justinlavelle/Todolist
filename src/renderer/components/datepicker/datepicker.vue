<template lang="pug">
.datepicker
  span.dateFormatted(type="text", @click="showDatePicker") {{ date_formatted }}
  transition(name="slideUp")
    datepicker-agenda(:date="date", :visible="isVisible", @change="selectDate", @cancel="hideDatePicker")
</template>

<script>
import moment from 'moment'
import datepickerAgenda from './datepickerAgenda'

moment.locale('fr')

export default {
  components: { datepickerAgenda },
  props: {
    value: { type: String, required: true },
    format: { type: String, default: 'YYYY-MM-DD' }
  },
  data () {
    return {
      isVisible: false,
      date: moment(this.value, 'YYYY-MM-DD')
    }
  },
  methods: {
    hideDatePicker () {
      this.isVisible = false
    },
    showDatePicker () {
      this.isVisible = true
    },
    selectDate (date) {
      this.date = date
      this.hideDatePicker()
      this.$emit('selecteddate', this.date_formatted)
    }
  },
  computed: {
    date_formatted () {
      return this.date.format(this.format)
    },
    date_raw () {
      return this.date.format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="sass">
.dateFormatted
  cursor: pointer
.slideUp-enter-active
  transition: all .5s cubic-bezier(0,.54,.5,1)
.slideUp-enter
  opacity: 0
  transform: scale(0) translateY(-400px)
.slideUp-enter-to
  opacity: 1
  transform: scale(1) translateY(0)
</style>
