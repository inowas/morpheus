// eslint-disable-next-line import/no-extraneous-dependencies
import 'jest-canvas-mock';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as ResizeObserverModule from 'resize-observer-polyfill';

(global as any).ResizeObserver = ResizeObserverModule.default;
// @ts-ignore
window.URL.createObjectURL = function () {
};
