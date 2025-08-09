import { expect } from 'chai';
import sinon from 'sinon';
import htmxInterceptor from './htmx-interceptor';
import { Request, Response, NextFunction } from 'express';

describe('htmxInterceptor middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: sinon.SinonSpy;

  beforeEach(() => {
    req = {
      get: sinon.stub(),
      path: '',
    };
    res = {
      append: sinon.spy(),
      render: sinon.spy(),
    };
    next = sinon.spy();
  });

  it('should call next() for HX-Request header present', () => {
    (req.get as sinon.SinonStub).withArgs('HX-Request').returns('true');
    req.path = '/some-path';

    htmxInterceptor()(req as Request, res as Response, next as NextFunction);

    expect(next.calledOnce).to.be.true;
    expect((res.append as sinon.SinonSpy).called).to.be.false;
    expect((res.render as sinon.SinonSpy).called).to.be.false;
  });

  it('should call next() for /assets path', () => {
    (req.get as sinon.SinonStub).withArgs('HX-Request').returns(undefined);
    req.path = '/assets/image.png';

    htmxInterceptor()(req as Request, res as Response, next as NextFunction);

    expect(next.calledOnce).to.be.true;
    expect((res.append as sinon.SinonSpy).called).to.be.false;
    expect((res.render as sinon.SinonSpy).called).to.be.false;
  });

  it('should set Cache-Control header and render base for non-HX and non-assets', () => {
    (req.get as sinon.SinonStub).withArgs('HX-Request').returns(undefined);
    req.path = '/home';

    htmxInterceptor()(req as Request, res as Response, next as NextFunction);

    expect((res.append as sinon.SinonSpy).calledOnceWith('Cache-Control', 'no-cache, no-store, must-revalidate')).to.be.true;
    expect((res.render as sinon.SinonSpy).calledOnceWith('base', {})).to.be.true;
    expect(next.called).to.be.false;
  });

  it('should not set Cache-Control or render for /assets even if HX-Request is missing', () => {
    (req.get as sinon.SinonStub).withArgs('HX-Request').returns(undefined);
    req.path = '/assets/styles.css';

    htmxInterceptor()(req as Request, res as Response, next as NextFunction);

    expect(next.calledOnce).to.be.true;
    expect((res.append as sinon.SinonSpy).called).to.be.false;
    expect((res.render as sinon.SinonSpy).called).to.be.false;
  });

  it('should handle empty path and no HX-Request', () => {
    (req.get as sinon.SinonStub).withArgs('HX-Request').returns(undefined);
    req.path = '';

    htmxInterceptor()(req as Request, res as Response, next as NextFunction);

    expect((res.append as sinon.SinonSpy).calledOnceWith('Cache-Control', 'no-cache, no-store, must-revalidate')).to.be.true;
    expect((res.render as sinon.SinonSpy).calledOnceWith('base', {})).to.be.true;
    expect(next.called).to.be.false;
  });
});
