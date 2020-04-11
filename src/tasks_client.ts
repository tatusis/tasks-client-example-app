import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import fs from 'fs'
import http from 'http'
import logger from 'morgan'
import path from 'path'

import { TasksRouter } from './routers/tasks_router'

class TasksClient {
    public app: express.Application
    public server: http.Server

    public constructor() {
        this.app = express()
        this.app.use(logger('tiny', { stream: this.getStream() }))
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cookieParser())
        this.app.use(cors())
        this.app.use(
            '/css',
            express.static(
                path.join(process.cwd(), '/node_modules/bootstrap/dist/css')
            )
        )
        this.app.use(
            '/js',
            express.static(
                path.join(
                    process.cwd(),
                    '/node_modules/node_modules/jquery/dist'
                )
            )
        )
        this.app.use(
            '/js',
            express.static(
                path.join(
                    process.cwd(),
                    '/node_modules/@popperjs/core/dist/umd'
                )
            )
        )
        this.app.use(
            '/js',
            express.static(
                path.join(process.cwd(), '/node_modules/bootstrap/dist/js')
            )
        )
        this.app.set('view engine', 'pug')
        this.app.set('views', path.join(__dirname, 'views'))
    }

    private getStream(): fs.WriteStream {
        const filePath = path.join(__dirname, 'log')
        fs.mkdirSync(filePath, { recursive: true })
        return fs.createWriteStream(path.join(filePath, 'tasks_api.log'), {
            flags: 'a'
        })
    }

    public start(): void {
        const tasksRouter = new TasksRouter()
        this.app.use('/tasks', tasksRouter.router)
        this.server = http.createServer(this.app)
        this.server.listen('3001')
    }
}

export { TasksClient }
