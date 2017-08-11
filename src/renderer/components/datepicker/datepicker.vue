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
  transition: all .1s ease-in-out
.slideUp-enter
  transform: translateY(-400px)
.slideUp-enter-t0
  transform: translateY(0)
</style>
