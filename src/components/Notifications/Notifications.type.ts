type NotificationsType = 'success' | 'error' | 'debug' | 'info' | 'warning';

export interface INotification {
  uuid: string,
  type: NotificationsType,
  messages: string[],
  delayMs: number,
  timeoutId?: ReturnType<typeof setTimeout>,
  args?: {},
}

export interface ISuccessMessage extends INotification {
  type: 'success'
}

export interface IErrorMessage extends INotification {
  type: 'error',
}

export interface IDebugMessage extends INotification {
  type: 'debug',
}
