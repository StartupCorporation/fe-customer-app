import { Injectable, TransferState, makeStateKey } from '@angular/core';
const envStateKey = makeStateKey<{ [key: string]: string }>('env');

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  private envVars: { [key: string]: string };

  constructor(private transferState: TransferState) {
    this.envVars = this.transferState.get(envStateKey, {});
  }

  getEnvVar(key: string): string | undefined {
    const value = this.envVars[key];
    return value;
  }
}
