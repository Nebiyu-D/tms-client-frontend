import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
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

  async submit(): Promise<void> {
    if (!this.email || !this.password || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    try {
      await this.auth.login({ email: this.email, password: this.password });
      await this.router.navigate(['/dashboard']);
    } catch {
      this.errorMessage.set('Check your details and try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}