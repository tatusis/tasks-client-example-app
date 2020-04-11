import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { Router, Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'

class TasksRouter {
    public router: Router
    private instance: AxiosInstance

    public constructor() {
        this.router = Router()
        this.instance = axios.create({
            baseURL: 'http://localhost:3000'
        })

        this.router.get(
            '/',
            (req: Request, res: Response, next: NextFunction) => {
                this.instance
                    .get('/tasks')
                    .then((result: AxiosResponse<any>) => {
                        res.render('tasks/index', {
                            contentTitle: 'Index',
                            tasks: result.data
                        })
                    })
                    .catch(next)
            }
        )

        this.router.get(
            '/details/:id',
            (req: Request, res: Response, next: NextFunction) => {
                this.instance
                    .get('/tasks/' + req.params.id)
                    .then((result: AxiosResponse<any>) => {
                        res.render('tasks/details', {
                            contentTitle: 'Details',
                            task: result.data
                        })
                    })
                    .catch(next)
            }
        )

        this.router.get(
            '/create',
            (req: Request, res: Response, next: NextFunction) => {
                res.render('tasks/create', {
                    contentTitle: 'Create'
                })
            }
        )

        this.router.post(
            '/create',
            [
                body('name')
                    .not()
                    .isEmpty()
                    .withMessage('Please provide a name.'),
                body('description')
                    .not()
                    .isEmpty()
                    .withMessage('Please provide a description.')
                    .isLength({ min: 2 })
                    .withMessage('Message is too short.'),
                body('isDone')
                    .not()
                    .isEmpty()
                    .withMessage('Please provide a status.')
            ],
            (req: Request, res: Response, next: NextFunction) => {
                const errors = validationResult(req).array()

                const nameErrors = errors.filter(error => {
                    if (error.param == 'name') {
                        return true
                    }
                })

                const descriptionErrors = errors.filter(error => {
                    if (error.param == 'description') {
                        return true
                    }
                })

                const isDoneErrors = errors.filter(error => {
                    if (error.param == 'isDone') {
                        return true
                    }
                })

                if (errors.length > 0) {
                    res.render('tasks/create', {
                        contentTitle: 'Create',
                        nameErrors: nameErrors,
                        descriptionErrors: descriptionErrors,
                        isDoneErrors: isDoneErrors
                    })
                } else {
                    this.instance
                        .post('/tasks', {
                            name: req.body.name,
                            description: req.body.description,
                            isDone: req.body.isDone ? true : false
                        })
                        .then((result: AxiosResponse<any>) => {
                            res.redirect('/tasks')
                        })
                        .catch(next)
                }
            }
        )

        this.router.get(
            '/edit/:id',
            (req: Request, res: Response, next: NextFunction) => {
                this.instance
                    .get('/tasks/' + req.params.id)
                    .then((result: AxiosResponse<any>) => {
                        res.render('tasks/edit', {
                            contentTitle: 'Edit',
                            task: result.data
                        })
                    })
                    .catch(next)
            }
        )

        this.router.post(
            '/edit/:id',
            (req: Request, res: Response, next: NextFunction) => {
                this.instance
                    .put('/tasks/' + req.params.id, {
                        name: req.body.name,
                        description: req.body.description,
                        isDone: req.body.isDone ? true : false
                    })
                    .then((result: AxiosResponse<any>) => {
                        res.redirect('/tasks')
                    })
                    .catch(next)
            }
        )

        this.router.get(
            '/delete/:id',
            (req: Request, res: Response, next: NextFunction) => {
                this.instance
                    .get('/tasks/' + req.params.id)
                    .then((result: AxiosResponse<any>) => {
                        res.render('tasks/delete', {
                            contentTitle: 'Delete',
                            task: result.data
                        })
                    })
                    .catch(next)
            }
        )

        this.router.post(
            '/delete/:id',
            (req: Request, res: Response, next: NextFunction) => {
                this.instance
                    .delete('/tasks/' + req.params.id)
                    .then((result: AxiosResponse<any>) => {
                        res.redirect('/tasks')
                    })
                    .catch(next)
            }
        )

        this.router.use(
            (err: any, req: Request, res: Response, next: NextFunction) => {
                res.status(500).send(err)
            }
        )
    }
}

export { TasksRouter }
