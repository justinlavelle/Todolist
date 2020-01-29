<template>
  <section>
    <header :style="{ background: colors.hex }">
      <div class="datepicker">
        <span class="dateFormatted">
          {{ selectedDate.format('YYYY-MM-DD') }}
        </span>
        <div class="icons">
          <Calendar class="calendar" @click="datePickerVisible = true" />
          <ColorPicker class="picker" @click="colorPickerVisible = true" />
        </div>
        <DatePicker
          v-if="datePickerVisible"
          :colors="colors"
          :selected-date="selectedDate"
          :tasked-days="taskedDays"
          @selectedDate="setDate"
          @cancel="datePickerVisible = false"
        />
      </div>
      <Transition name="slideUp">
        <div v-if="colorPickerVisible" class="pickerContent">
          <Sketch v-model="colors" />
          <button
            :style="{
              background: colors.hex,
              border: '1px solid' + colors.hex,
            }"
            @click="saveColor"
          >
            Ok
          </button>
        </div>
      </Transition>
      <input
        v-model="newTodoName"
        class="new-todo"
        type="text"
        placeholder="Create a task"
        @keyup.enter="createTodo"
      />
    </header>
    <div class="taches">
      <h2 v-if="filteredTodos.length === 0">
        There's no task
      </h2>
      <ul>
        <li
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :class="{
            editing: todo === editing,
            completed: todo.completed,
            first: index === todos.length - todos.length,
          }"
        >
          <div class="view">
            <input
              class="toggle"
              type="checkbox"
              :checked="todo.completed"
              @click="completed(todo)"
            />
            <span @dblclick="editTodo(todo)">
              {{ moment(todo.date).format('h:mm:ss a') }}
            </span>
            <label @dblclick="editTodo(todo)">{{ todo.name }}</label>
            <button class="destroy" @click.prevent="deleteTodo(todo)" />
          </div>
          <input
            v-model="todo.name"
            v-focus="todo === editing"
            class="edit"
            type="text"
            @keyup.enter="doneEdit(todo)"
            @blur="editing = false"
          />
        </li>
      </ul>
    </div>
    <footer v-if="todos.length !== 0">
      <input v-model="allDone" class="toggle-all" type="checkbox" />
      <span>{{ remaining }} remaining tasks</span>
      <div class="filtersWrapper">
        <div class="filters">
          <div class="filterWrapper">
            <label class="dateLabel">Date:</label>
            <button
              class="filterButton"
              :style="buttonsFilter('all')"
              @click.prevent="filter = 'all'"
            >
              All
            </button>
            <button
              class="filterButton"
              :style="buttonsFilter('date')"
              @click.prevent="filter = 'date'"
            >
              Selected Date
            </button>
          </div>
          <div class="statusWrapper">
            <label>Status:</label>
            <button
              class="filterButton"
              :style="buttonsStatus('all')"
              @click.prevent="status = 'all'"
            >
              All
            </button>
            <button
              class="filterButton"
              :style="buttonsStatus('todo')"
              @click.prevent="status = 'todo'"
            >
              Todo
            </button>
            <button
              class="filterButton"
              :style="buttonsStatus('completed')"
              @click.prevent="status = 'completed'"
            >
              Completed
            </button>
          </div>
        </div>
      </div>
      <button
        class="deleteButton"
        :style="{ background: colors.hex }"
        @click.prevent="deleteCompleted()"
      >
        Delete selected tasks
      </button>
    </footer>
  </section>
</template>

<script>
import Vue from 'vue'
import * as database from '@core/db/methods'
import DatePicker from './DatePicker'
import { Sketch } from 'vue-color'
import ColorPicker from '@assets/color-picker.svg'
import Calendar from '@assets/calendar.svg'
import moment from 'moment'

const DATE = 'date'
const ALL = 'all'

export default {
  components: {
    DatePicker,
    Sketch,
    Calendar,
    ColorPicker,
  },
  directives: {
    focus(el, value) {
      if (value) {
        Vue.nextTick(() => {
          el.focus()
        })
      }
    },
  },
  data() {
    return {
      todos: [],
      colors: database.getColor() || {
        hex: '#2d2342',
        rgb: {
          r: 44,
          g: 190,
          b: 238,
        },
      },
      selectedDate: moment(),
      colorPickerVisible: false,
      datePickerVisible: false,
      newTodoName: '',
      filter: DATE,
      status: ALL,
      editing: null,
    }
  },
  computed: {
    moment() {
      return moment
    },
    allDone: {
      get() {
        return this.remaining === 0
      },
      set(value) {
        this.todos.map(todo => {
          todo.completed = value
        })
        database.setAllCompleted()
      },
    },
    remaining() {
      return this.filteredTodos.filter(todo => !todo.completed).length
    },
    filteredTodos() {
      switch (this.status) {
        case 'completed':
          return this.getTodos.filter(todo => todo.completed)
        case 'todo':
          return this.getTodos.filter(todo => !todo.completed)
        default:
          return this.getTodos
      }
    },
    getTodos() {
      return this.filter === DATE
        ? this.todos.filter(
            todo =>
              moment(todo.date).format('YYYY-MM-DD') ===
              this.selectedDate.format('YYYY-MM-DD'),
          )
        : this.todos
    },
    taskedDays() {
      return this.todos.reduce((acc, todo) => {
        if (
          acc.length &&
          acc.every(
            item =>
              moment(item).format('YYYY-MM-DD') ===
              moment(todo.date).format('YYYY-MM-DD'),
          )
        ) {
          return acc
        }
        return [...acc, moment(todo.date).format('YYYY-MM-DD')]
      }, [])
    },
  },
  mounted() {
    this.todos = database.getTodos()
  },
  methods: {
    buttonsFilter(element) {
      if (this.filter === element) {
        return {
          border: '1px solid' + this.colors.hex,
          color: this.colors.hex,
        }
      } else {
        return 'border: 1px solid #c2c2c2'
      }
    },
    buttonsStatus(element) {
      if (this.status === element) {
        return {
          border: '1px solid' + this.colors.hex,
          color: this.colors.hex,
        }
      } else {
        return 'border: 1px solid #c2c2c2'
      }
    },
    saveColor() {
      this.colorPickerVisible = false
      database.addColor(this.colors)
    },
    setDate(date) {
      this.datePickerVisible = false
      this.selectedDate = date
    },
    createTodo() {
      if (!this.newTodoName) {
        return
      }

      const todo = {
        name: this.newTodoName,
        date: moment(),
        completed: false,
      }
      this.todos = [...this.todos, todo]
      this.newTodoName = ''
      database.addTodos(todo)
    },
    deleteTodo(todo) {
      database.deleteTodos(todo)
      this.todos = this.todos.filter(item => item !== todo)
    },
    editTodo(todo) {
      this.editing = todo
    },
    completed(todo) {
      todo.completed = !todo.completed
      database.updateTodo(todo)
    },
    deleteCompleted() {
      this.todos = this.todos.filter(item => !item.completed)
      database.deleteCompleted()
    },
    doneEdit(todo) {
      this.editing = false
      database.updateTodo(todo)
    },
  },
}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Nunito:200,300,400')

$clearBlue: #62bafe
$darkBlue:  #6ef1fe
$grey:      #c2c2c2
$lightGrey: #757575

body, h1, h2
  font-family: 'Nunito', sans-serif
  background: white
  padding: 0
  margin: 0

*
  box-sizing: border-box

.cf:before,.cf:after
  content: ''
  display: table
.cf:after
  clear: both

label
  color: #757575
  font-size: 1.2em
  font-weight: 100

section
  margin: 0
  padding: 0
  header
    width: 100%
    margin: 0
    position: fixed
    padding: 0
    z-index: 2
    .calendar,
    .picker
      width: 20px
      height: 20px
      fill: black
      transition: .8s all cubic-bezier(0,.54,.5,1)
      cursor: pointer
      margin: auto
      &.calendar
        left: 69%
        top: 40%
      &.picker
        left: 75%
      &:hover
        transform: scale(1.3) rotate(5deg)
    .datepicker
      position: relative
      padding: 2.5em 1em
      display: flex
      align-items: center
      justify-content: center
      &:before
        content: ''
        width: 100%
        flex: 5
      .dateFormatted
        flex: 1 !important
        font-size: 1.7em
        font-weight: 100
        color: white
      .icons
        flex: 5 !important
      .calendar
        margin: 0 2rem
    .vc-sketch
      position: absolute
      left: 0
      border: none !important
      box-shadow: none
      border-radius: 0 !important
      right: 0
      margin: auto
      background: transparent !important
    .pickerContent
      position: absolute
      box-shadow: 2px 6px 8px 3px rgba(black, 0.1)
      background: rgba(white, 0.8)
      width: 230px
      height: 350px
      text-align: right
      left: 0
      display: inline-block
      right: 0
      margin: auto
      button
        position: absolute
        right: 1em
        bottom: 1em
        background: #55C9FF
        cursor: pointer
        outline: none
        border: 1px solid #55C9FF
        padding: .6em 1em
        border-radius: .2em
        color: white
        text-transform: uppercase
    .new-todo
      border: none
      font-size: 1.5em
      font-weight: 200
      padding: .5em 1em
      height: 65px
      width: 100%
      margin: 0
      outline: none
      box-shadow: 0 5px 10px 1px rgba(0,0,0,0.1)
  .taches
    padding-top: 178px
    margin-bottom: 135px
    position: relative
    z-index: 1

    h2
      margin: 2em
      color: grey
      font-weight: 100
      font-size: 1.2em
    ul
      padding: 0
      margin: 0
      li
        position: relative
        margin: 0
        padding: 1em
        list-style-type: none
        &.editing
          .view
            display: none
          .edit
            outline: none
            padding: .5em
            width: 100%
            color: $lightGrey
            font-weight: 100
            font-size: 1.2em
            display: block !important
        &.first
          &.slide-enter-active
            transition: transform .5s cubic-bezier(0,.54,.5,1)
          &.slide-enter
            transform: translateX(-400px)
          &.slide-enter-to
            transform: translateX(0)
        &:not(:last-child)
          border-bottom: 1px solid $grey
        &:hover
          box-shadow: inset 3px 0px 0px $clearBlue
          .destroy
            display: block
        .edit
          display: none
        span
          color: $grey
          display: block
          margin: .3em 0

        .toggle
          float: left
          margin-right: 2em
          outline: none
          width: 40px
          height: auto
          margin-top: .7em
          cursor: pointer
          border: none
          -webkit-appearance: none
          appearance: none
          &:after
            content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#ededed" stroke-width="3"/></svg>')
          &:checked:after
            content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#bddad5" stroke-width="3"/><path fill="#5dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>')

        .destroy
          display: none
          background: transparent
          position: absolute
          border: none
          top: 0
          right: 10px
          bottom: 0
          outline: none
          cursor: pointer
          &:after
            font-size: 4em
            font-weight: 100
            content: '\d7';
            color: $grey
        &.completed
          label
            position: relative
            color: #e4e4e4
            &:before
              position: absolute
              width: 100%
              height: 1px
              background: $grey
              top: 52%
              content: ''

  footer
    box-shadow: 0 -5px 10px 1px rgba(0,0,0,0.1)
    background: white
    z-index: 1
    width: 100%
    position: fixed
    bottom: 0
    border-top: 1px solid $grey
    padding: .5em .5em
    label[for='toggle-all']
      display: none
    .toggle-all
      width: 30px
      height: 30px
      position: absolute
      top: 20px
      left: 25px
      text-align: center
      border: none
      transform: rotate(90deg)
      -webkit-appearance: none
      appearance: none
      outline: none
      &:before
        position: absolute
        top: 0
        left: 0
        content: '❯'
        font-size: 30px
        color: #e6e6e6
      &:checked:before
        color: #737373

    span
      margin-right: 1em
      color: $grey
      font-size: .8em
      display: block
      text-align: center

    .filtersWrapper
      display: flex
      justify-content: center
      margin: 1rem 0

    .filters
      display: inline-flex
      margin: 0 auto
      width: auto
      flex-direction: column
      label
        font-size: 0.9rem

    .filterWrapper,
    .statusWrapper
      display: flex
      align-items: center

    .filterWrapper
      margin-bottom: 1rem

    .dateLabel
      margin-right: 0.6rem

    .filterButton
      background: transparent
      outline: none
      border: 1px solid $grey
      white-space: nowrap
      padding: .5em 1em
      margin-left: 1rem
      border-radius: 0
      font-size: .8em
      color: $grey
      text-decoration: none
      &.selected
        border: 1px solid #6ac7ff
        color: #6ac7ff

    .deleteButton
      border: none
      border-radius: .2em
      outline: none
      cursor: pointer
      width: 100%
      font-weight: 100
      color: white
      font-size: 1.5em
      display: inline-block
      text-align: center
      padding: .5em
  .dateFormatted
    cursor: default
    white-space: nowrap
  .slideUp-enter-active
    transition: all .5s cubic-bezier(0,.54,.5,1)
  .slideUp-enter
    opacity: 0
    transform: translateY(-400px)
  .slideUp-enter-to
    opacity: 1
    transform: translateY(0)
</style>
