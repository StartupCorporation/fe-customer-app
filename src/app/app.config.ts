import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';

import { EnvironmentService } from './core/services/environment.service';
import { CategoryMockService } from './feature/products/services/mocks/category-mock.service';
import { CategoryService } from './feature/products/services/category.service';
import { CATEGORY_SERVICE_TOKEN } from './feature/products/services/interfaces/category.service.interface';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    {
      provide: CATEGORY_SERVICE_TOKEN,
      useFactory: (envService: EnvironmentService, httpClient: HttpClient) => {
        const envType = envService.getEnvVar('USE_MOCKS') === 'true';
        return envType
          ? new CategoryService(httpClient, envService)
          : new CategoryMockService();
      },
      deps: [EnvironmentService, HttpClient],
    },
  ],
};
