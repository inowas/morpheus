import React from 'react';

interface ObjectEventsType<T>  {
  [key: string]: (event: React.KeyboardEvent<T>) => boolean | void;
}

const handleKey = <T>(handlers: ObjectEventsType<T>, prevent = true) => (event: React.KeyboardEvent<T>): void => {
  if ('function' === typeof handlers[event.key]) {
    const result = handlers[event.key](event);
    if (false === result) {
      return;
    }
    if (prevent) {
      event.preventDefault();
    }
  }
};

export  default handleKey;
