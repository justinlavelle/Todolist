import { remote } from 'electron'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'

const adapter = new FileSync(
  path.join(remote.app.getPath('userData'), '/data.json'),
)
const db = low(adapter)

db.defaults({ todos: [], color: null, userId: null }).write()

export default db
