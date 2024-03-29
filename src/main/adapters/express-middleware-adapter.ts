import { Middleware } from '$/presentation/protocols'
import { NextFunction, Request, Response } from 'express'

export const adaptMiddleware = (middleware: Middleware): any => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest = {
      accessToken: req.headers?.['x-access-token'],
      refreshToken: req.headers?.['x-refresh-token'],
      ...(req.headers)
    }
    const httpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      Object.assign(req.body, httpResponse.body)
      next()
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
