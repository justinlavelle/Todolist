<template lang="pug">
.datepicker
  span.dateFormatted(type="text") {{ date_formatted }}
  transition(name="slideUp")
    datepicker-agenda(:date="date", :color2="color1", :visible="isVisible", @change="selectDate", @cancel="hideDatePicker")
  img(src="../../assets/calendar.svg", @click="showDatePicker").calendar
</template>

<script>
import moment from 'moment'
import datepickerAgenda from './datepickerAgenda'

moment.locale('fr')

export default {
  components: { datepickerAgenda },
  props: {
    value: { type: String, required: true },
    format: { type: String, default: 'YYYY-MM-DD' },
    color1: { type: Object, required: true }
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
