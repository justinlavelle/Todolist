<template>
  <section>
    <header :style="{ background: colors.hex }">
      <div class="datepicker">
        <span class="dateFormatted">
          {{ selectedDate.format('YYYY-MM-DD') }}
        </span>
        <Datepicker
          v-if="datePickerVisible"
          :colors="colors"
          :selected-date="selectedDate"
          :tasked-days="taskedDays"
          @selectedDate="setDate"
          @cancel="datePickerVisible = false"
        />
        <div class="icons">
          <Calendar class="calendar" @click="datePickerVisible = true" />
          <ColorPicker class="picker" @click="colorPickerVisible = true" />
        </div>
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
        placeholder="Ajouter une tache"
        @keyup.enter="createTodo"
      />
    </header>
    <div class="taches">
      <h2 v-if="filteredTodos.length === 0">
        Il n'y a aucune tache
      </h2>
      <ul>
        <li
          v-for="(todo, index) in filteredTodos"
          :key="todo.date"
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
      <span>{{ remaining }} taches restantes</span>

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
        Supprimer
      </button>
    </footer>
  </section>
</template>

<script>
import Vue from 'vue'
import * as database from '../../db/database'
import Datepicker from '../datepicker'
import { Sketch } from 'vue-color'
import ColorPicker from '@/assets/color-picker.svg'
import Calendar from '@/assets/calendar.svg'
import moment from 'moment'
const DATE = 'date'
const ALL = 'all'

export default {
  components: {
    Datepicker,
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
      todos: database.getTodos(),
      colors: database.getColor() || {
        hex: '#5CBCE9',
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
      const todo = {
        name: this.newTodoName,
        date: moment(),
        completed: false,
      }
      database.addTodos(todo)
      this.todos.push(todo)
      this.newTodoName = ''
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

<style lang="sass" src="./todos.sass"></style>
