import { Injectable, TransferState, makeStateKey } from '@angular/core';
const envStateKey = makeStateKey<{ [key: string]: string }>('env');

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  private envVars: { [key: string]: string };
  // Default environment variables
  private defaultEnvVars: { [key: string]: string } = {
    'API_URL': 'http://localhost:8080/api',
    'USE_MOCKS': 'false'
  };

  constructor(private transferState: TransferState) {
    this.envVars = this.transferState.get(envStateKey, {});
    
    // If we don't have an API_URL, set a default one for development
    if (!this.envVars['API_URL']) {
      this.envVars['API_URL'] = this.defaultEnvVars['API_URL'];
    }
  }

  getEnvVar(key: string): string | undefined {
    const value = this.envVars[key] || this.defaultEnvVars[key];
    return value;
  }
}
