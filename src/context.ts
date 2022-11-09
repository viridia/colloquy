import { Accessor, createContext } from 'solid-js';
import { IBoardInfo } from './db/client';

/** Global context for all pages. */
export interface ISiteContext {
  /** Which bulletin board we are viewing. */
  board: Accessor<IBoardInfo>;

  siteName: Accessor<string>;
}

export const SiteContext = createContext<ISiteContext>();
