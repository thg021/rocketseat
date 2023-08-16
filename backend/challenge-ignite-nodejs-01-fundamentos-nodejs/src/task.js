import { randomUUID } from 'node:crypto'

export default class Task {
    constructor({id, title, description, completedAt, createdAt, updatedAt }){
        Task.validate(title, description)
        this.id = id ?? randomUUID()
        this.title = title
        this.description = description
        this.completedAt = completedAt ?? null
        this.createdAt = createdAt ?? new Date()
        this.updatedAt = updatedAt ?? new Date()
    }

    static validate(title, description){
        if (!title) throw new Error('Title must be provided')
        if (!description) throw new Error('Description must be provided')
    }


    update(task){
        let { title, description, completedAt } = task

        Task.validate(title, description)
        this.title = title
        this.description = description
        this.completedAt = completedAt ?? null
        this.updatedAt = new Date()
    }

    complete(){
        this.completedAt = new Date()
    }

    toJSON(){
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            completedAt: this.completedAt,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }
}