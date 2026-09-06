import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';


export interface TmsUser {
  email: string;
  displayName: string;
  role: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService  {
  private http = inject(HttpClient);
  private accessToken = signal<string | null>(null);
  currentUser = signal<TmsUser | null>(null);


  getAccessToken(): string | null {
    return this.accessToken() ?? localStorage.getItem('accessToken');
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    const userRole = user?.role?.trim().toLowerCase();
    const requiredRole = role.trim().toLowerCase();

    return userRole === requiredRole || userRole === 'admin';
  }

  async login(credentials: LoginRequest): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>('/api/auth/login', credentials),
    );
    this.accessToken.set(res.accessToken);
    localStorage.setItem('accessToken', res.accessToken);
    this.setCurrentUser();
  }

  async register(request: RegisterRequest): Promise<void> {
    await firstValueFrom(this.http.post<{ message: string }>('/api/auth/register', request));
  }

  setCurrentUser(){
    const token = this.accessToken() ?? localStorage.getItem('accessToken');
    
    const payload = JSON.parse(atob(token!.split('.')[1]));
    this.currentUser.set({
      email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload.email ||payload.sub,
      displayName: payload.FirstName || payload.name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || 'User',
      role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role || 'Student',
    });
  }

  logout(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('accessToken');
  }
}
