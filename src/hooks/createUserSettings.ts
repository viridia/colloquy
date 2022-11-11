import { createContext, useContext } from 'solid-js';
import { SetStoreFunction, Store } from 'solid-js/store';
import { createCookieStore } from './createCookieStore';

export interface ISettings {
  theme?: string;
  composeSide?: 'left' | 'right' | 'bottom';
  composeSize?: number;
}

export const UserSettingsContext =
  createContext<[get: Store<ISettings>, set: SetStoreFunction<ISettings>]>();

export const useUserSettings = () => {
  const settings = useContext(UserSettingsContext);
  if (!settings) {
    throw new Error('Missing context: UserSettings');
  }
  return settings;
};

export const createUserSettings = () => createCookieStore<ISettings>('settings', {});
