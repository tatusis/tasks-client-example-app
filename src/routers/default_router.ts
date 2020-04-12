import { Router, Request, Response, NextFunction } from 'express'

class DefaultRouter {
    public router: Router

    public constructor() {
        this.router = Router()

        this.router.use((req: Request, res: Response, next: NextFunction) => {
            res.redirect('/tasks')
        })
    }
}

export { DefaultRouter }
