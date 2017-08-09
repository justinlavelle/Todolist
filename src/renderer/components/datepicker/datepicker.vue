<template lang="pug">
.datepicker
  input(type="text", :value="date_formatted")
  datepicker-agenda(:date="date", @update:date="val => date = val")
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
      date: moment(this.value, 'YYYY-MM-DD')
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
