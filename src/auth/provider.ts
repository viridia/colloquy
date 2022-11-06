export interface IProfileData {
  email: string;
  name: string | undefined;
  avatar: string | undefined;
  profile: Record<string, string>;
}

export interface ILoginProvider {
  id: string;
  getAuthUri(state: string): URL;
  fetchProfile(code: string): Promise<IProfileData>;
}

const loginProviders: Record<string, ILoginProvider> = {};

export function addLoginProvider(provider: ILoginProvider) {
  loginProviders[provider.id] = provider;
}

export function getLoginProvider(provider: string) {
  return loginProviders[provider];
}
