import db from '../datastore'

const getTodos = () => db.getState().todos

const getColor = () => db.getState().color

const addColor = color => db.set('color', color).write()

const addTodos = todo =>
  db
    .get('todos')
    .push(todo)
    .write()

const updateTodo = todo => {
  db.get('todos')
    .find({ name: todo.name })
    .assign(todo)
    .write()
}

const deleteTodos = todo =>
  db
    .get('todos')
    .remove(todo)
    .write()

const setAllCompleted = _ =>
  db
    .get('posts')
    .find({ completed: false })
    .assign({ completed: true })
    .write()

const deleteCompleted = _ => {
  db.get('todos')
    .remove({ completed: true })
    .write()
}
export {
  removeColors,
  getColor,
  addColor,
  getTodos,
  isTodo,
  updateTodo,
  setCompleted,
  setAllCompleted,
  addTodos,
  deleteTodos,
  deleteCompleted,
}
