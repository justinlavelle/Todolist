<template>
  <footer :class="$style.wrapper" v-if="todos.length !== 0">
    <input
      @click="$emit('setAllCompleted', allDone)"
      :value="allDone"
      :class="$style.toggleAll"
      type="checkbox"
    />
    <span :class="$style.remainingTasks">{{ remaining }} remaining tasks</span>
    <div :class="$style.filtersWrapper">
      <div :class="$style.filters">
        <div :class="$style.filterWrapper">
          <label :class="[$style.dateLabel, $style.statusTitle]">Date:</label>
          <button
            :class="$style.filterButton"
            :style="buttonsFilter('all')"
            @click.prevent="$emit('filterByAll')"
          >
            All
          </button>
          <button
            :class="$style.filterButton"
            :style="buttonsFilter('date')"
            @click.prevent="$emit('filterByDate')"
          >
            Selected Date
          </button>
        </div>
        <div :class="$style.statusWrapper">
          <label :class="$style.statusTitle">Status:</label>
          <button
            :class="$style.filterButton"
            :style="buttonsStatus('all')"
            @click.prevent="$emit('statusByAll')"
          >
            All
          </button>
          <button
            :class="$style.filterButton"
            :style="buttonsStatus('todo')"
            @click.prevent="$emit('statusByTodo')"
          >
            Todo
          </button>
          <button
            :class="$style.filterButton"
            :style="buttonsStatus('completed')"
            @click.prevent="$emit('statusByCompleted')"
          >
            Completed
          </button>
        </div>
      </div>
    </div>
    <button
      :class="$style.deleteButton"
      :style="{ background: colors.hex }"
      @click.prevent="$emit('deleteCompleted')"
    >
      Delete selected tasks
    </button>
  </footer>
</template>

<script>
export default {
  props: {
    todos: {
      type: Array,
      required: true,
    },
    colors: {
      type: Object,
      required: true,
    },
    remaining: {
      type: Number,
      required: true,
    },
    filter: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  computed: {
    allDone() {
      return this.remaining === 0
    },
  },
  methods: {
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
  },
}
</script>

<style lang="scss" module>
.wrapper {
  box-shadow: 0 -5px 10px 1px rgba(0, 0, 0, 0.1);
  background: white;
  z-index: 1;
  width: 100%;
  position: fixed;
  bottom: 0;
  border-top: 1px solid #c2c2c2;
  padding: 0.5em 0.5em;
}

.filtersWrapper {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.statusTitle {
  font-size: 0.9rem;
  font-weight: 100;
  color: #757575;
}

.filters {
  display: inline-flex;
  margin: 0 auto;
  width: auto;
  flex-direction: column;
}

.remainingTasks {
  margin-right: 1em;
  color: #c2c2c2;
  font-size: 0.8em;
  display: block;
  text-align: center;
}

.filterWrapper,
.statusWrapper {
  display: flex;
  align-items: center;
}

.filterWrapper {
  margin-bottom: 1rem;
}

.dateLabel {
  margin-right: 0.6rem;
}

.filterButton {
  background: transparent;
  outline: none;
  border: 1px solid #c2c2c2;
  white-space: nowrap;
  padding: 0.5em 1em;
  margin-left: 1rem;
  border-radius: 0;
  font-size: 0.8em;
  color: #c2c2c2;
  text-decoration: none;
}

.deleteButton {
  border: none;
  border-radius: 0.2em;
  outline: none;
  cursor: pointer;
  width: 100%;
  font-weight: 100;
  color: white;
  font-size: 1.5em;
  display: inline-block;
  text-align: center;
  padding: 0.5em;
}

.footer label[for='toggle-all'] {
  display: none;
}

.toggleAll {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 20px;
  left: 25px;
  text-align: center;
  border: none;
  transform: rotate(90deg);
  -webkit-appearance: none;
  appearance: none;
  outline: none;
}

.toggleAll:before {
  position: absolute;
  top: 0;
  left: 0;
  content: '❯';
  font-size: 30px;
  color: #e6e6e6;
}

.toggleAll:checked:before {
  color: #737373;
}

.toggleAll:checked:before span {
  margin-right: 1em;
  color: #c2c2c2;
  font-size: 0.8em;
  display: block;
  text-align: center;
}
</style>