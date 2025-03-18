import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';

import { EnvironmentService } from './core/services/environment.service';
import { CategoryMockService } from './feature/products/services/mocks/category-mock.service';
import { CategoryService } from './feature/products/services/category.service';
import { CATEGORY_SERVICE_TOKEN } from './feature/products/services/interfaces/category.service.interface';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrderService } from './feature/products/services/order.service';
import { OrderMockService } from './feature/products/services/mocks/order-mock.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom([BrowserAnimationsModule, HttpClientModule]),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    {
      provide: CATEGORY_SERVICE_TOKEN,
      useFactory: (envService: EnvironmentService, httpClient: HttpClient) => {
        const useMocks = envService.getEnvVar('USE_MOCKS') === 'true';
        return useMocks
          ? new CategoryMockService()
          : new CategoryService(httpClient, envService);
      },
      deps: [EnvironmentService, HttpClient],
    },
    {
      provide: OrderService,
      useFactory: (envService: EnvironmentService, httpClient: HttpClient) => {
        const useMocks = envService.getEnvVar('USE_MOCKS') === 'true';
        return useMocks
          ? new OrderService(httpClient, envService)
          : new OrderService(httpClient, envService);
      },
      deps: [EnvironmentService, HttpClient],
    },
  ],
};
