import type { Keys as CommonKeys } from './en-US/common';
import type { Keys as ModalAuthKeys } from './en-US/modal.auth';
import type { Keys as PageHomeKeys } from './en-US/page.home';

export type Index = readonly [
  ['common', CommonKeys],
  ['modal.auth', ModalAuthKeys],
  ['page.home', PageHomeKeys],
];
