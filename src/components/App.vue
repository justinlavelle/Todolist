<template>
  <section>
    <Header
      :selectedDate="selectedDate"
      :colors="colors"
      :taskedDays="taskedDays"
      :tags="tags"
      @saveColor="saveColor"
      @selectedDate="setDate"
      @selectedColor="setColor"
      @createTodo="createTodo"
    />
    <div :class="$style.tasks">
      <div
        v-if="filteredTodos.length !== 0"
        :class="[$style.allCompletedWrapper, { [$style.isSelected]: allDone }]"
        @click="setAllCompleted"
      >
        <AllCompletedIcon :class="$style.allCompletedIcon" />
        <span :class="$style.allCompletedText">Toggle all completed</span>
      </div>
      <h2 v-if="filteredTodos.length === 0">
        There's no task
      </h2>
      <TransitionGroup
        v-if="filteredTodos.length"
        tag="ul"
        :appear="false"
        :enter-class="$style.transitionEnter"
        :enter-active-class="$style.transitionEnterActive"
      >
        <li
          v-for="(todo, index) in filteredTodos"
          :key="moment(todo.date).unix()"
          :class="[
            $style.todo,
            {
              [$style.editing]: todo === editing,
              [$style.first]: index === todos.length - todos.length,
            },
          ]"
        >
          <div :class="$style.view">
            <input
              :id="`toggle-${index}`"
              type="checkbox"
              :class="$style.toggle"
              :checked="todo.completed"
              @click="completed(todo)"
            />
            <label :class="$style.toggleIconsWrapper" :for="`toggle-${index}`">
              <CompletedTask v-if="todo.completed" />
              <RunningTask v-else />
            </label>
            <div
              :class="$style.textWrapper"
              v-if="todo !== editing"
              @dblclick="editTodo(todo)"
            >
              <span :class="$style.date">
                {{ moment(todo.date).format('h:mm:ss a') }}
              </span>
              <label
                :class="[$style.label, { [$style.completed]: todo.completed }]"
              >
                {{ todo.name }}
              </label>
            </div>
            <span
              :class="$style.tag"
              :style="{ background: getTagColor(todo.tagId) }"
            />
            <CrossIcon
              :class="$style.destroy"
              @click.prevent="deleteTodo(todo)"
            />
          </div>
          <input
            v-if="todo === editing"
            v-model="todo.name"
            v-focus="todo === editing"
            :class="$style.edit"
            type="text"
            @keyup.enter="doneEdit(todo)"
            @blur="editing = false"
          />
        </li>
      </TransitionGroup>
    </div>
    <Filters
      :remaining="remaining"
      :colors="colors"
      :tags="tags"
      :todos="todos"
      :filter="filter"
      :status="status"
      @filterByTag="handleFilterTag"
      @filterByAll="handleFilterAll"
      @filterByDate="handleFilterDate"
      @statusByAll="handleStatusAll"
      @statusByTodo="handleStatusTodo"
      @statusByCompleted="handleStatusCompleted"
      @deleteCompleted="deleteCompleted"
    />
  </section>
</template>

<script>
import Vue from 'vue'
import * as database from '@core/db/methods'
import moment from 'moment'
import Header from './Header'
import Filters from './Filters'
import RunningTask from '../assets/runningTask.svg'
import CompletedTask from '../assets/completedTask.svg'
import AllCompletedIcon from '../assets/allcompleted.svg'
import ua from 'universal-analytics'
import CrossIcon from '@assets/cross.svg'

const DATE = 'date'
const ALL = 'all'
const CATEGORY_TASK = 'category-task'
const ACTION_CREATE = 'action-create'
const ACTION_DELETE = 'action-delete'
const ACTION_EDIT = 'action-edit'

export default {
  components: {
    Header,
    Filters,
    RunningTask,
    CompletedTask,
    AllCompletedIcon,
    CrossIcon,
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
      user: null,
      todos: [],
      colors: database.getColor() || {
        hex: '#5CBCE9',
        rgb: {
          r: 44,
          g: 190,
          b: 238,
        },
      },
      tags: [
        { color: '#FF675D', id: 0, name: null },
        { color: '#F9A74D', id: 1, name: null },
        { color: '#F5CE53', id: 2, name: null },
        { color: '#72CC57', id: 3, name: null },
        { color: '#57B9F4', id: 4, name: null },
        { color: '#D289E2', id: 5, name: null },
        { color: '#A5A5A7', id: 6, name: null },
      ],
      selectedDate: moment(),
      selectedTag: null,
      filter: DATE,
      status: ALL,
      editing: null,
    }
  },
  computed: {
    moment() {
      return moment
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
      return this.todos
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .filter(todo =>
          this.filter === DATE
            ? moment(todo.date).format('YYYY-MM-DD') ===
              this.selectedDate.format('YYYY-MM-DD')
            : true,
        )
        .filter(todo =>
          this.selectedTag
            ? todo.tagId && todo.tagId === this.selectedTag.id
            : true,
        )
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
    allDone() {
      return this.remaining === 0
    },
  },
  mounted() {
    this.todos = database.getTodos()
    const userId = database.getUserId()

    if (!userId) {
      const generateId = this.generateId()
      this.user = ua(process.env.GOOGLE_ANALYTICS_ID, userId)
      database.setUserId(generateId)
      return
    }
    this.user = ua(process.env.GOOGLE_ANALYTICS_ID, userId)
  },
  methods: {
    getTagColor(tagId) {
      const tags = this.tags.find(({ id }) => id === tagId)

      return tags && tags.color
    },
    handleFilterTag(tag) {
      this.selectedTag = tag
    },
    handleFilterAll() {
      this.filter = 'all'
    },
    handleFilterDate() {
      this.filter = 'date'
    },
    handleStatusAll() {
      this.status = 'all'
    },
    handleStatusTodo() {
      this.status = 'todo'
    },
    handleStatusCompleted() {
      this.status = 'completed'
    },
    generateId() {
      let d = moment().unix()

      d += window.performance.now()

      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)

        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
      })
    },
    setAllCompleted() {
      this.todos = this.todos.map(todo => ({
        ...todo,
        completed: !this.allDone,
      }))
      database.setAllCompleted()
    },
    saveColor() {
      database.addColor(this.colors)
    },
    setDate(date) {
      this.datePickerVisible = false
      this.selectedDate = date
    },
    setColor(color) {
      this.colors = color
    },
    createTodo(newTodo, tagId) {
      this.user.event(CATEGORY_TASK, ACTION_CREATE).send()

      const todo = {
        name: newTodo,
        date: moment(),
        tagId,
        completed: false,
      }
      this.todos = [...this.todos, todo]
      database.addTodos(todo)
    },
    deleteTodo(todo) {
      this.user.event(CATEGORY_TASK, ACTION_DELETE).send()
      database.deleteTodos(todo)
      this.todos = this.todos.filter(item => item !== todo)
    },
    editTodo(todo) {
      this.user.event(CATEGORY_TASK, ACTION_EDIT).send()
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

<style lang="scss" module>
@import url('https://fonts.googleapis.com/css?family=Nunito:200,300,400');

$clearBlue: #62bafe;
$darkBlue: #6ef1fe;
$grey: #c2c2c2;
$lightGrey: #757575;

body,
h1,
h2 {
  font-family: 'Nunito', sans-serif;
  background: white;
  padding: 0;
  margin: 0;
}

* {
  box-sizing: border-box;
}

.label {
  color: #757575;
  font-size: 1.2em;
  font-weight: 100;
  display: inline;
  position: relative;
  &.completed {
    color: #e4e4e4;
    text-decoration: line-through;
  }
}

section {
  margin: 0;
  padding: 0;
}

.edit {
  outline: none;
  padding: 0.5em;
  width: 100%;
  color: $lightGrey;
  font-weight: 100;
  font-size: 1.2em;
  display: block !important;
}

.tasks {
  position: relative;
  z-index: 1;
}

.allCompletedWrapper {
  display: flex;
  cursor: pointer;
  padding: 1.5rem;
  padding-left: 25px;
  align-items: center;

  &.isSelected {
    .allCompletedIcon {
      fill: #ededed;
    }
  }
}

.allCompletedIcon {
  transition: fill 1s ease-in-out;
  width: 40px;
  display: inline-block;
}

.allCompletedText {
  user-select: none;
  margin-left: 15px;
  font-weight: 100;
  color: grey;
}

h2 {
  margin: 2em;
  color: grey;
  font-weight: 100;
  font-size: 1.2em;
}

ul {
  padding: 0;
  margin: 0;
}

.todo {
  position: relative;
  margin: 0;
  padding: 1em 3rem;
  list-style-type: none;
}

.editing .view {
  display: none;
}

.view {
  display: flex;
  align-items: center;
}

.textWrapper {
  margin-left: 1.3rem;
  display: flex;
  width: 100%;
  flex-direction: column;
}

.date {
  color: #c2c2c2;
  display: block;
  margin: 0.3em 0;
}

.todo:hover {
  .destroy {
    fill: #ededed;
  }
}

.todo:not(:last-child) {
  border-bottom: 1px solid #ededed;
}

.tag {
  cursor: pointer;
  height: 20px;
  width: 20px;
  margin: 0.3rem;
  border-radius: 0.2rem;
  display: block;
  flex-shrink: 0;
}

.todo:first-child {
  padding-top: 0;
}

.toggleIconsWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.toggle {
  display: none;
  -webkit-appearance: none;
}

.inputIcon {
  position: absolute;
  top: 0;
}

.destroy {
  margin-left: 1rem;
  fill: white;
  background: transparent;
  height: 25px;
  width: 25px;
  cursor: pointer;
}

.dateFormatted {
  cursor: default;
  white-space: nowrap;
}

.slideUp-enter-active {
  transition: all 0.5s cubic-bezier(0, 0.54, 0.5, 1);
}

.slideUp-enter {
  opacity: 0;
  transform: translateY(-400px);
}

.slideUp-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.transitionEnterActive {
  transition: transform 0.5s cubic-bezier(0, 0.54, 0.5, 1);
  transform: translateX(0);
}

.transitionEnter {
  transform: translateX(-400px);
}
</style>
