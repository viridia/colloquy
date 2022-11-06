import { StartServer, createHandler, renderAsync } from 'solid-start/entry-server';
import { addLoginProvider } from './auth/provider';
import google from './auth/providers/google';
import github from './auth/providers/github';
import discord from './auth/providers/discord';

addLoginProvider(
  google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: `${process.env.AUTH_REDIRECT_URL}/auth/google`,
  })
);

addLoginProvider(
  github({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackUrl: `${process.env.AUTH_REDIRECT_URL}/auth/github`,
  })
);

addLoginProvider(
  discord({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackUrl: `${process.env.AUTH_REDIRECT_URL}/auth/discord`,
  })
);

export default createHandler(renderAsync(event => <StartServer event={event} />));
