import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  showPassword = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal('');
  isLocked = signal(false);
  lockoutExpiresAt = signal<number | null>(null);

  private getRetryAfterSeconds(error: HttpErrorResponse): number {
    const retryHeader = error.headers?.get('Retry-After');
    const parsedHeader = retryHeader ? Number(retryHeader) : NaN;

    if (!Number.isNaN(parsedHeader) && parsedHeader > 0) {
      return parsedHeader;
    }

    return 60;
  }

  private applyLockout(error: HttpErrorResponse): void {
    const retryAfterSeconds = this.getRetryAfterSeconds(error);
    const expiresAt = Date.now() + retryAfterSeconds * 1000;

    this.lockoutExpiresAt.set(expiresAt);
    this.isLocked.set(true);

    const detail = error.error?.detail ?? error.error?.title ?? 'Too many requests. Retry after 60 seconds.';
    this.errorMessage.set(detail || 'Too many requests. Retry after 60 seconds.');
  }

  async submit(): Promise<void> {
    const lockoutExpiry = this.lockoutExpiresAt();
    if (lockoutExpiry && Date.now() < lockoutExpiry) {
      this.errorMessage.set('Too many requests. Retry after 60 seconds.');
      return;
    }

    if (this.isLocked()) {
      this.isLocked.set(false);
      this.lockoutExpiresAt.set(null);
    }

    if (!this.email || !this.password || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    try {
      await this.auth.login({ email: this.email, password: this.password });
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      const status = httpError?.status;
      const detail = httpError?.error?.detail ?? httpError?.error?.title ?? '';

      if (status === 429 || status === 423 || detail.toLowerCase().includes('too many requests') || detail.toLowerCase().includes('locked')) {
        this.applyLockout(httpError);
        return;
      }

      this.errorMessage.set('Check your details and try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}