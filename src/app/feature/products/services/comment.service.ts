import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment, CommentCreateRequest } from '../models/comment.model';
import { ApiService } from '../../../shared/services/api.service';
import { EnvironmentService } from 'src/app/core/services/environment.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService extends ApiService {
  private commentsApiUrl: string;

  constructor() {
    super(inject(HttpClient), inject(EnvironmentService));
    this.commentsApiUrl = this.envService.getEnvVar('API_URL_COMMENTS') || 'http://localhost:8000';
    this.setApiUrl(this.commentsApiUrl);
  }

  getProductComments(productId: string): Observable<Comment[]> {
    return this.get<Comment[]>(`comment/?product_id=${productId}`);
  }

  createComment(comment: CommentCreateRequest): Observable<Comment> {
    return this.post<Comment, CommentCreateRequest>('comment/', comment);
  }
}