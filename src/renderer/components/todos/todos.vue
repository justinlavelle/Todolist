<template lang="pug" src="./todos.pug"></template>

<script>
import Vue from 'vue'
import * as database from '../../db/database'
import datepicker from '../datepicker/datepicker'

export default {
  components: { datepicker },
  data () {
    return {
      todos: {},
      changeddate: this.getDate(),
      newTodo: '',
      filter: 'all',
      transition: false,
      editing: null
    }
  },
  asyncData: {
    todos () {
      return database.getTodos(this.changeddate)
    }
  },
  methods: {
    date (date) {
      this.transition = false
      this.changeddate = date
      this.asyncReload('todos')
    },
    addTodo () {
      this.transition = true
      database.addTodos(this.newTodo, this.getHour(), this.changeddate)
      this.asyncReload('todos')
      this.newTodo = ''
    },
    deleteTodo (todo) {
      this.transition = false
      database.deleteTodos(todo)
      this.asyncReload('todos')
    },
    editTodo (todo) {
      this.editing = todo
    },
    completed (todo) {
      todo.completed = !todo.completed
      database.setCompleted(todo)
    },
    deleteCompleted () {
      database.deleteCompleted()
      this.asyncReload('todos')
    },
    getHour () {
      let date = new Date()
      let hh = date.getHours()
      let mm = date.getMinutes()
      let ss = date.getSeconds()

      hh = hh < 10 ? '0' + hh : hh
      mm = mm < 10 ? '0' + mm : mm
      ss = ss < 10 ? '0' + ss : ss

      return hh + ':' + mm + ':' + ss
    },
    doneEdit (id, todo) {
      database.updateTodo(id, todo, this.getHour())
      this.asyncReload('todos')
    },
    getDate () {
      let today = new Date()
      let dd = today.getDate()
      let mm = today.getMonth() + 1
      let yyyy = today.getFullYear()

      dd = dd < 10 ? '0' + dd : dd
      mm = mm < 10 ? '0' + mm : mm

      return yyyy + '-' + mm + '-' + dd
    }
  },
  computed: {
    allDone: {
      get () {
        return this.remaining === 0
      },
      set (value) {
        this.todos.forEach(todo => {
          todo.completed = value
        })
        database.setAllCompleted()
      }
    },
    remaining () {
      return this.todos.filter(todo => !todo.completed).length
    },
    filteredTodos () {
      if (this.filter === 'completed') {
        return this.todos.filter(todo => todo.completed)
      } else if (this.filter === 'todo') {
        return this.todos.filter(todo => !todo.completed)
      }
      return this.todos
    }
  },
  directives: {
    focus (el, value) {
      if (value) {
        Vue.nextTick(() => {
          el.focus()
        })
      }
    }
  }
}
</script>

<style lang="sass" src="./todos.sass"></style>
