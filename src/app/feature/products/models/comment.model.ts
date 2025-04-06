export interface Comment {
  id?: string;
  productId: string;
  author: string;
  content: string;
  createdAt?: string;
}

export interface CommentCreateRequest {
  productId: string;
  author: string;
  content: string;
} 