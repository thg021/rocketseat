import fs from 'node:fs/promises'
import Task from './task.js'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []
    const isSearch = Object.keys(search).length === 0
    if (!isSearch) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].includes(value)
        })
      })
    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  update(table, id, data) {
    const task = this.findById(table, id)
    task.update(data)
    const rowIndex = this.#database[table].findIndex(row => row.id === task.id)

    if (rowIndex > -1) {
      this.#database[table][rowIndex] ={ ...task.toJSON()}
      this.#persist()
    }
  }

  delete(table, id) {
    const task = this.findById(table, id)
    const rowIndex = this.#database[table].findIndex(row => row.id === task.id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }

  findById(table, id){
    const item = this.#database[table].find((item) => item.id === id)
    if (!item) {
      throw new Error(`Task Not Found using ID ${id}`)
    }
    return new Task(item)
  }
}
