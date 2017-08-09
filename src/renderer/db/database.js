import db from '../datastore'

let getTodos = _ => {
  return new Promise((resolve, reject) => {
    db.find({}).sort({ hour: -1 }).exec((err, docs) => {
      if (err) { reject(err) } else { resolve(docs) }
    })
  })
}

let setCompleted = (todo) => {
  db.update({'name': todo.name}, { $set: {'completed': todo.completed} }, (err, docs) => {
    if (err) { console.error(err) }
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

let addTodos = (name, hour) => {
  db.insert({
    completed: false,
    name: name,
    hour: hour
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
export {getTodos, updateTodo, setCompleted, setAllCompleted, addTodos, deleteTodos, deleteCompleted}
