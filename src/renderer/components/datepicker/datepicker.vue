<template lang="pug">
.datepicker
  input(type="text", :value="date_formatted", @click="showDatePicker")
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
      this.$emit('selecteddate', date)
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
