import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  role = 'Student';
  showPassword = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  async submit(): Promise<void> {
    if (
      !this.firstName ||
      !this.lastName ||
      !this.email ||
      !this.password ||
      !this.confirmPassword ||
      this.isSubmitting()
    ) {
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      this.successMessage.set('');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      await this.auth.register({
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        role: this.role,
      });

      this.successMessage.set('Account created successfully. Redirecting to sign in...');
      setTimeout(async () => {
        await this.router.navigate(['/login']);
      }, 1200);
    } catch (error) {
      this.errorMessage.set(this.getRegistrationError(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private getRegistrationError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const errors = error.error?.errors;
      if (Array.isArray(errors) && errors.length > 0) {
        return errors.join(' ');
      }
    }

    return 'Unable to create your account right now. Please try again.';
  }
}
