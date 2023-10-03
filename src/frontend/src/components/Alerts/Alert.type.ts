type AlertType = 'success' | 'error' | 'debug' | 'info' | 'warning';

export interface IAlert {
  uuid: string,
  type: AlertType,
  messages: string[],
  delayMs: number,
  args?: {},
}

export interface ISuccessMessage extends IAlert {
  type: 'success'
}

export interface IErrorMessage extends IAlert {
  type: 'error',
}

export interface IDebugMessage extends IAlert {
  type: 'debug',
}
