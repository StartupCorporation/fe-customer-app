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
      API_ORDER_URL: process.env['API_ORDER_URL'] || '',
      API_COMMENTS_URL: process.env['API_COMMENTS_URL'] || '',
      API_CALLBACK_URL: process.env['API_CALLBACK_URL'] || '',
      IMAGES_CONTAINER_URL: process.env['IMAGES_CONTAINER_URL'] || '',
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
    }),
    {
      provide: 'TRANSFER_STATE_INITIALIZER',
      useFactory: transferStateFactory,
      deps: [TransferState],
      multi: true,
    },
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
