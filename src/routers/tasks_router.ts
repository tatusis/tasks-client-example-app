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
                    .catch((error: any) => {
                        next(error.response || error)
                    })
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
                    .catch((error: any) => {
                        next(error.response || error)
                    })
            }
        )

        this.router.get(
            '/create',
            (req: Request, res: Response, next: NextFunction) => {
                res.render('tasks/create', {
                    contentTitle: 'Create',
                    task: {
                        name: null,
                        description: null,
                        isDone: false
                    }
                })
            }
        )

        this.router.post(
            '/create',
            [
                body('name').notEmpty().withMessage('Please provide a name.'),
                body('description')
                    .notEmpty()
                    .withMessage('Please provide a description.'),
                body('isDone').toBoolean()
            ],
            (req: Request, res: Response, next: NextFunction) => {
                const errors = validationResult(req).array()

                const nameErrors = errors.filter(error => {
                    return error.param == 'name'
                })

                const descriptionErrors = errors.filter(error => {
                    return error.param == 'description'
                })

                if (errors.length > 0) {
                    res.render('tasks/create', {
                        contentTitle: 'Create',
                        nameErrors: nameErrors,
                        descriptionErrors: descriptionErrors,
                        task: {
                            name: req.body.name,
                            description: req.body.description,
                            isDone: req.body.isDone
                        }
                    })
                } else {
                    this.instance
                        .post('/tasks', {
                            name: req.body.name,
                            description: req.body.description,
                            isDone: req.body.isDone
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
                    .catch((error: any) => {
                        next(error.response || error)
                    })
            }
        )

        this.router.post(
            '/edit/:id',
            [
                body('name').notEmpty().withMessage('Please provide a name.'),
                body('description')
                    .notEmpty()
                    .withMessage('Please provide a description.'),
                body('isDone').toBoolean()
            ],
            (req: Request, res: Response, next: NextFunction) => {
                const errors = validationResult(req).array()

                const nameErrors = errors.filter(error => {
                    return error.param == 'name'
                })

                const descriptionErrors = errors.filter(error => {
                    return error.param == 'description'
                })

                if (errors.length > 0) {
                    res.render('tasks/edit', {
                        contentTitle: 'Edit',
                        nameErrors: nameErrors,
                        descriptionErrors: descriptionErrors,
                        task: {
                            name: req.body.name,
                            description: req.body.description,
                            isDone: req.body.isDone
                        }
                    })
                } else {
                    this.instance
                        .put('/tasks/' + req.params.id, {
                            name: req.body.name,
                            description: req.body.description,
                            isDone: req.body.isDone
                        })
                        .then((result: AxiosResponse<any>) => {
                            res.redirect('/tasks')
                        })
                        .catch(next)
                }
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
                    .catch((error: any) => {
                        next(error.response || error)
                    })
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

        this.router.use((req: Request, res: Response, next: NextFunction) => {
            res.render('tasks/404', {
                contentTitle: 'Argh, no!',
                message: "Don't be mad, but that URL doesn't live here."
            })
        })

        this.router.use(
            (err: any, req: Request, res: Response, next: NextFunction) => {
                res.render('tasks/error', {
                    contentTitle: 'Error',
                    error: err.data || err
                })
            }
        )
    }
}

export { TasksRouter }
