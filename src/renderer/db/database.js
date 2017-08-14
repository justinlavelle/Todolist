import db from '../datastore'

let getTodos = (date) => {
  return new Promise((resolve, reject) => {
    db.find({ date: date }).sort({ hour: -1 }).exec((err, docs) => {
      if (err) { reject(err) } else { resolve(docs) }
    })
  })
}
let getColor = _ => {
  return new Promise((resolve, reject) => {
    db.find({ type: 'color' }).limit(1).exec((err, docs) => {
      if (err) { reject(err) } else { resolve(docs) }
    })
  })
}
let removeColors = _ => {
  db.remove({ type: 'color' }, { multi: true }, function (err, numRemoved) {
    if (err) { console.log(err) }
  })
}

let setCompleted = (todo) => {
  db.update({'name': todo.name}, { $set: {'completed': todo.completed} }, (err, docs) => {
    if (err) { console.error(err) }
  })
}
/* eslint-disable */
let isTodo = (date) => {
  return new Promise((resolve, reject) => {
    db.find({ date: date }).exec((err, docs) => {
      if (err) { reject(err) } else {
        resolve(docs)
      }
    })
  })
}

let setAllCompleted = _ => {
  db.update({}, { $set: { completed: true } }, { multi: true }, (err, docs) => {
    if (err) { console.error(err) }
  })
}

let updateTodo = (id, name, hour) => {
  db.update({_id: id}, {$set: {name: name}}, (err, docs) => {
    if (err) { console.error(err) }
  })
}

let addTodos = (name, hour, date) => {
  db.insert({
    completed: false,
    name: name,
    hour: hour,
    date: date
  }, function (err, newDoc) {
    if (err) { console.log(err) }
  })
}
let addColor = (color) => {
  db.insert({
    color: color,
    type: 'color'
  }, function (err, newDoc) {
    if (err) { console.log(err) }
  })
}

let deleteTodos = (todo) => {
  db.remove({ name: todo.name }, { multi: false }, function (err, numRemoved) {
    if (err) { console.log(err) }
  })
}

let deleteCompleted = _ => {
  db.remove({ completed: true }, { multi: true }, function (err, numRemoved) {
    if (err) { console.log(err) }
  })
}
export {removeColors, getColor, addColor, getTodos, isTodo, updateTodo, setCompleted, setAllCompleted, addTodos, deleteTodos, deleteCompleted}
