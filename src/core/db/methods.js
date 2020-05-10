import db from './datastore'

const getColor = () => db.getState().color

const addColor = color => db.set('color', color).write()

const getTodos = () => db.getState().todos

const getUserId = () => db.getState().userId

const setUserId = userId => db.set('userId', userId).write()

const addTodos = todo =>
  db
    .get('todos')
    .push(todo)
    .write()

const updateTodo = todo =>
  db
    .get('todos')
    .find({ name: todo.name })
    .assign(todo)
    .write()

const deleteTodos = todo =>
  db
    .get('todos')
    .remove(todo)
    .write()

const setAllCompleted = _ =>
  db
    .get('todos')
    .find({ completed: false })
    .assign({ completed: true })
    .write()

const deleteCompleted = _ => {
  db.get('todos')
    .remove({ completed: true })
    .write()
}

export {
  getColor,
  getUserId,
  setUserId,
  addColor,
  getTodos,
  addTodos,
  updateTodo,
  deleteTodos,
  setAllCompleted,
  deleteCompleted,
}
