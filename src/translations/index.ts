import type { DataType as Common } from './en-US/common';
import type { DataType as ModalAuth } from './en-US/modal.auth';
import type { DataType as PageHome } from './en-US/page.home';

export type Index = {
  common: Common;
  'modal.auth': ModalAuth;
  'page.home': PageHome;
};

export const files = import.meta.glob('./*/*.ts');
