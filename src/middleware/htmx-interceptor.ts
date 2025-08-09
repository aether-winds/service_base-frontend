import { Handler, Request, Response, NextFunction } from 'express';

const CACHE_CONTROL_HEADER = 'no-cache, no-store, must-revalidate';

const isHtmxRequest = (request: Request): boolean => !!request.get('HX-Request');
const pathStartsWithAssets = (request: Request): boolean => request.path.startsWith('/assets');

export default function htmxInterceptor(): Handler {
  return (request: Request, response: Response, next: NextFunction): void => {
    if (!isHtmxRequest(request) && !pathStartsWithAssets(request)) {
      response.append('Cache-Control', CACHE_CONTROL_HEADER);
      response.render('base', {
        ...response.locals,
      });
    } else {
      next();
    }
  }
}
