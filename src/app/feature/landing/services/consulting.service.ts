import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from 'src/app/core/services/environment.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { ConsultingModel } from '../models/consulting.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsultingService extends ApiService {
  private urlPath = 'callback_request' as const;

  constructor(httpClient: HttpClient, envService: EnvironmentService) {
    super(httpClient, envService);
    const consultingApiUrl = this.envService.getEnvVar('API_CALLBACK_URL')!;
    this.setApiUrl(consultingApiUrl);
  }

  createConsultingRequest(consultingModel: ConsultingModel) { 
    const url = `${this.urlPath}`;
    return this.post<ConsultingModel,ConsultingModel>(url, consultingModel).pipe(
      map((response) => {
        const company = ConsultingModel.fromJson(response);

        return company;
      }) 
    );
  }
}
