import { inject, Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private envService = inject(EnvironmentService);
  private apiUrl: string;

  constructor() {
    this.apiUrl = this.envService.getEnvVar('IMAGES_CONTAINER_URL') || 'http://localhost:9999';    
  }

  getImageContainerUrl(): string {
    return this.apiUrl;
  }
}
