import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment.model';
import { Observable, Subject, finalize, takeUntil } from 'rxjs';
import { MessageService } from 'src/app/core/services/message.service';
import { MessageModel } from 'src/app/shared/models/message-model';
import { MessageTypeEnum } from 'src/app/shared/enums/message-type-enum';

@Component({
  selector: 'app-product-detail-comments',
  templateUrl: './product-detail-comments.component.html',
  styleUrls: ['./product-detail-comments.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ProductDetailCommentsComponent implements OnInit {
  @Input() productId!: string;
  
  private commentService = inject(CommentService);
  private formBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);
  private destroy$ = new Subject<void>();
  
  comments: Comment[] = [];
  commentForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  
  ngOnInit(): void {
    this.initForm();
    this.loadComments();
  }
  
  private initForm(): void {
    this.commentForm = this.formBuilder.group({
      author: ['', [Validators.required, Validators.maxLength(50)]],
      content: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }
  
  private loadComments(): void {
    if (!this.productId) {
      return;
    }
    
    this.isLoading = true;
    this.commentService.getProductComments(this.productId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (comments) => {
          this.comments = comments;
        },
        error: (error) => {
          console.error('Error loading comments:', error);
          this.showErrorMessage('Виникла помилка при завантаженні коментарів');
        }
      });
  }
  
  submitComment(): void {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }
    
    const formValue = this.commentForm.value;
    const comment = {
      productId: this.productId,
      author: formValue.author,
      content: formValue.content
    };
    
    this.isSubmitting = true;
    this.commentService.createComment(comment)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: (newComment) => {
          // Add the new comment to the list optimistically
          this.comments = [newComment, ...this.comments];
          this.commentForm.reset();
          this.showSuccessMessage('Відгук створено успішно');
          
          // Refresh the comments list from the server
          setTimeout(() => this.loadComments(), 500);
        },
        error: (error) => {
          // Extract the error detail if available, otherwise use a generic message
          const errorMessage = error.error?.detail || error.detail || 'Виникла помилка при створенні коментара';
          this.showErrorMessage(errorMessage);
        }
      });
  }
  
  private showErrorMessage(text: string): void {
    const message = new MessageModel(
      400,
      [text],
      MessageTypeEnum.Error
    );
    this.messageService.addMessage(message);
  }
  
  private showSuccessMessage(text: string): void {
    const message = new MessageModel(
      200,
      [text],
      MessageTypeEnum.Success
    );
    this.messageService.addMessage(message);
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 