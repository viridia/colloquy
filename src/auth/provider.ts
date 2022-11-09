export interface IProfileData {
  email: string;
  name: string | undefined;
  avatar: string | undefined;
  profile: Record<string, string>;
}

export interface ILoginProvider {
  id: string;
  getAuthUri(state: string, nonce: string): URL;
  fetchProfile(code: string, nonce: string): Promise<IProfileData>;
}

const loginProviders: Record<string, ILoginProvider> = {};

export function addLoginProvider(provider: ILoginProvider) {
  loginProviders[provider.id] = provider;
}

export function getLoginProvider(provider: string) {
  return loginProviders[provider];
}

export function getAuthUri(providerId: string, state: string, nonce: string) {
  const provider = getLoginProvider(providerId);
  if (!provider) {
    throw new Error(`Invalid login provider id: ${providerId}`);
  }

  return provider.getAuthUri(state, nonce);
}

export function fetchProfile(
  providerId: string,
  code: string,
  nonce: string
): Promise<IProfileData> {
  if (!code) {
    throw new Error('Missing authentication code');
  }

  const provider = getLoginProvider(providerId);
  if (!provider) {
    throw new Error(`Invalid login provider id: ${providerId}`);
  }

  return provider.fetchProfile(code, nonce);
}
