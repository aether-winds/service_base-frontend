import { Response } from 'express';
import { stub } from 'sinon';

class ResponseOptions implements Response {
  public headersSent = false;

  public attachment = stub();
  public contentType = stub();
  public download = stub();
  public format = stub();
  public get = stub();
  public header = stub();
  public links = stub();
  public json = stub();
  public jsonp = stub();
  public send = stub();
  public sendFile = stub();
  public sendStatus = stub();
  public set = stub();
  public status = stub();
  public type = stub();
}

export const MockResponse = (overrides: Partial<ResponseOptions> = {}): Response => ({
  ...new ResponseOptions(),
  ...overrides,
});
