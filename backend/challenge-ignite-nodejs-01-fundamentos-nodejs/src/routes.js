import { buildRoutePath } from './utils/build-route-path.js'
import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import Task  from './task.js'

const database = new Database()
const TABLE_TASKS = 'tasks'

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/'),
        handler: (req, res) => {
            return res.end('ok vamos nesta')
        }
    }, 
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
          const { search } = req.query
          let options = {}
          if(search){
            options = {
                title: search,
                description: search
            }
          }
    
          const tasks = database.select(TABLE_TASKS, options)
    
          return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
           const { title, description } = req.body;
            try {
                const task = new Task({
                    title, 
                    description
                })
                database.insert(TABLE_TASKS, task.toJSON())
            } catch (e) {
                const error = {
                    status: 400, 
                    error: e.message
                }
                return res.writeHead(400).end(JSON.stringify(error))
            }
            return res.writeHead(201).end()
        }
    },
    {
      method: 'PUT',
      path: buildRoutePath('/tasks/:id'),
      handler: (req, res) => {
        const { id } = req.params
        const { title, description  } = req.body
        try {
            database.update(TABLE_TASKS, id, {
                title,
                description
              })
        } catch (e) {
            const error = {
                status: 404, 
                error: e.message
            }
            return res.writeHead(404).end(JSON.stringify(error))
        } 
        return res.writeHead(204).end()
      }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
          const { id } = req.params
          try {

            const taskFound = database.findById(TABLE_TASKS, id)
            const isTaskCompleted = !!taskFound.completedAt
            const completed_at = isTaskCompleted ? null : new Date()
            database.update(TABLE_TASKS, id, {
                ...taskFound.toJSON(), 
                completedAt: completed_at
            })
          } catch (e) {
              const error = {
                  status: 404, 
                  error: e.message
              }
              return res.writeHead(404).end(JSON.stringify(error))
          } 
          return res.writeHead(204).end()
        }
      },
    {
      method: 'DELETE',
      path: buildRoutePath('/tasks/:id'),
      handler: (req, res) => {
        const { id } = req.params
        try {
            database.delete(TABLE_TASKS, id)
        } catch (e) {
            const error = {
                status: 404, 
                error: e.message
            }
            return res.writeHead(404).end(JSON.stringify(error))
        }
       
  
        return res.writeHead(204).end()
      }
    }
]
