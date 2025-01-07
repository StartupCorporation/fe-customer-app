import { mergeApplicationConfig, ApplicationConfig, makeStateKey, TransferState, APP_INITIALIZER, provideAppInitializer, inject } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRoutesConfig } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const envStateKey = makeStateKey<{ [key: string]: string }>('env');

/**
 * Read environment variables and set them in the transfer state.
 */
export function transferStateFactory(transferState: TransferState) {
  return () => {
    const envVars = {
      API_URL: process.env['API_URL'] || '',
      USE_MOCKS: process.env['USE_MOCKS'] || '',
    };
    transferState.set(envStateKey, envVars);
  };
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRoutesConfig(serverRoutes),
    provideAppInitializer(() => {
      const initFunction = transferStateFactory(inject(TransferState));
      return initFunction();
    })
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
