// eslint-disable-next-line import/no-extraneous-dependencies
import 'jest-canvas-mock';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as ResizeObserverModule from 'resize-observer-polyfill';

import React from 'react';

(global as any).ResizeObserver = ResizeObserverModule.default;
// @ts-ignore
window.URL.createObjectURL = function () {
};

// @ts-ignore
const MockResponsiveContainer = props => <div {...props} />;

jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: MockResponsiveContainer,
}));
