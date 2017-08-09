import Moment from 'moment'
import { extendMoment } from 'moment-range'
import 'jquery'

const moment = extendMoment(Moment)

export default class month {
  constructor (month, year) {
    this.start = moment([year, month])
    this.end = this.start.clone().endOf('month')
    this.month = month
    this.year = year
  }

  getWeekStart () {
    return this.start.weekday()
  }

  getDays () {
    return moment.range(this.start, this.end).toArray('days')
  }
}
