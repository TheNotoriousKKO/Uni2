import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginCredentials } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-bg">
      <div id="app" class="academic-animation">
        <div class="papers" style="--total: 5">
          <div class="paper -rogue" style="--i: 0">
            <div class="segment">
              <div class="segment">
                <div class="segment">
                  <div class="segment">
                    <div class="segment"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="paper" style="--i: 1">
            <div class="segment">
              <div class="segment">
                <div class="segment">
                  <div class="segment">
                    <div class="segment"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="paper" style="--i: 2">
            <div class="segment">
              <div class="segment">
                <div class="segment">
                  <div class="segment">
                    <div class="segment"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="paper" style="--i: 3">
            <div class="segment">
              <div class="segment">
                <div class="segment">
                  <div class="segment">
                    <div class="segment"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="paper" style="--i: 4">
            <div class="segment">
              <div class="segment">
                <div class="segment">
                  <div class="segment">
                    <div class="segment"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="shadow">
          <div class="paper-shadow" style="--i: 0"></div>
          <div class="paper-shadow" style="--i: 1"></div>
          <div class="paper-shadow" style="--i: 2"></div>
          <div class="paper-shadow" style="--i: 3"></div>
          <div class="paper-shadow" style="--i: 4"></div>
        </div>
      </div>
      <div class="login-content">
        <div class="login-card fade-in">
          <h1>Login</h1>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="username">Username</label>
              <input 
                type="text" 
                id="username" 
                formControlName="username" 
                class="form-control"
                [class.error]="isFieldInvalid('username')"
                autocomplete="username"
              >
              <div class="error-message" *ngIf="isFieldInvalid('username')">
                Username is required
              </div>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                formControlName="password" 
                class="form-control"
                [class.error]="isFieldInvalid('password')"
                autocomplete="current-password"
              >
              <div class="error-message" *ngIf="isFieldInvalid('password')">
                Password is required
              </div>
            </div>
            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>
            <button 
              type="submit" 
              class="btn btn-primary" 
              [disabled]="loginForm.invalid || isLoading"
            >
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </form>
          <div class="register-link">
            <p>Don't have an account? <a routerLink="/register">Register here</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Open+Sans:wght@400;600&display=swap');
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }
    .login-bg {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      z-index: 0;
      background: rgb(5, 69, 29);
    }
    /* Animation color palette (scoped to animation only) */
    .academic-animation {
      --color-blue:rgb(128, 156, 88); /* Primary */
      --color-shadow:rgb(21, 60, 39); /* Accent */
      --color-bg:rgb(255, 255, 255); /* Ivory White */
      --color-accent:rgb(74, 156, 32); /* Accent for borders */
      --duration: 3.2s;
      --stagger: .65s;
      --easing: cubic-bezier(.36,.07,.25,1);
      --offscreen: 130vmax;
    }
    *, *:before, *:after {
      box-sizing: border-box;
      position: relative;
    }
    * {
      transform-style: preserve-3d;
    }
    .academic-animation {
      height: 70vmin;
      width: 40vmin;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 50vw;
      top: 50vh;
      transform: translate(-25vw, -50%) rotateX(-20deg) rotateY(-55deg);
      background: var(--color-blue);
      border-radius: 2vmin;
      perspective: 10000px;
      z-index: 1;
    }
    .academic-animation:before {
      border: 10vmin solid var(--color-bg);
      border-left-width: 2vmin;
      border-right-width: 2vmin;
      border-radius: inherit;
      content: '';
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      background: var(--color-blue);
    }
    .academic-animation > .papers, .academic-animation:before {
      transform: translateZ(3vmin);
    }
    .academic-animation:after {
      content: '';
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      background: inherit;
      border-radius: inherit;
      transform: translateZ(1.5vmin);
    }
    .academic-animation > .shadow {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform-origin: bottom center;
      transform: rotateX(90deg);
      background: var(--color-shadow);
      border-radius: inherit;
    }
    .paper-shadow {
      background: var(--color-shadow);
      height: 50%;
      width: 100%;
      position: absolute;
      top: calc(100% + 3vmin);
      left: 0;
      transform-origin: top center;
      animation: shadow-in var(--duration) var(--easing) infinite;
      animation-delay: calc(var(--i) * var(--stagger));
      animation-fill-mode: both;
    }
    @keyframes shadow-in {
      0%,5% {
        transform: scale(.8, 1) translateY(var(--offscreen));
      }
      100% {
        transform: scale(.8,0);
      }
    }
    .papers {
      width: 30vmin;
      height: 40vmin;
      background: var(--color-bg);
    }
    .paper {
      --segments: 5;
      --segment: calc(100% * 1 / var(--segments));
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      animation: fly-in var(--duration) var(--easing) infinite;
      animation-delay: calc((var(--i) * var(--stagger)));
    }
    @keyframes fly-in {
      0%, 2% {
        transform: translateZ(var(--offscreen)) translateY(80%) rotateX(30deg);
      }
      80%, 100% {
        transform: translateZ(0px) translateY(0%) rotateX(0deg);
      }
    }
    .paper > .segment {
      height: var(--segment);
    }
    .segment {
      --rotate: 20deg;
      height: 100%;
      transform-origin: top center;
      background: var(--color-bg);
      border: 1px solid var(--color-accent);
      border-top: none;
      border-bottom: none;
    }
    .segment > .segment {
      top: 98%;
    }
    .segment {
      animation: inherit;
      animation-name: curve-paper;
    }
    @keyframes curve-paper {
      0%, 2% { transform: rotateX(var(--rotate,0deg)); }
      90%, 100% { transform: rotateX(0deg); }
    }
    .paper.-rogue {
      transform-origin: top center -5vmin;
    }
    .paper.-rogue .segment {
      --rotate: 30deg;
      animation-name: curve-rogue-paper;
    }
    @keyframes curve-rogue-paper {
      0%, 50% { transform: rotateX(var(--rotate)); }
      100% { transform: rotateX(0deg); }
    }
    .paper.-rogue > .segment {
      animation: inherit;
      animation-name: rogue-paper;
      transform-origin: left top 20vmin;
    }
    @keyframes rogue-paper {
      0%, 2% {
        transform: rotateX(1.5turn)
      }
      80%, 100% {
        transform: rotateX(0turn);
      }
    }
    /* Overlay content */
    .login-content {
      position: fixed;
      inset: 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      z-index: 2;
      pointer-events: none;
    }
    .login-card {
      background: #F5F5F0;
      padding: 2rem 2.5rem;
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
      text-align: center;
      pointer-events: auto;
      max-width: 450px;
      min-width: 320px;
      width: 100%;
      margin-right: 8vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: fadeIn 1.1s cubic-bezier(.36,.07,.25,1);
    }
    @media (max-width: 900px) {
      .login-card {
        margin-right: 0;
        margin-left: auto;
        margin-right: auto;
        align-items: center;
        text-align: center;
      }
      .login-content {
        justify-content: center;
      }
    }
    @media (max-width: 600px) {
      .login-card {
        padding: 1.25rem 0.5rem;
        min-width: 0;
        max-width: 98vw;
      }
      h1 {
        font-size: 1.5rem;
      }
    }
    .fade-in {
      opacity: 0;
      animation: fadeIn 1.1s cubic-bezier(.36,.07,.25,1) forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(32px) scale(.98); }
      to { opacity: 1; transform: none; }
    }
    h1 {
      font-family: 'Merriweather', serif;
      font-size: 2.25rem;
      font-weight: 700;
      color: #3A6351;
      margin-bottom: 0.5rem;
      letter-spacing: -1px;
    }
    .form-group {
      margin-bottom: 1rem;
      width: 100%;
      text-align: left;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #3A6351;
      font-family: 'Open Sans', sans-serif;
    }
    .form-control {
      width: 100%;
      padding: 0.7rem 1rem;
      border: 1.5px solid #B9C4A7;
      border-radius: 7px;
      font-size: 1rem;
      font-family: 'Open Sans', sans-serif;
      background: #F5F5F0;
      color: #3A6351;
      transition: border 0.2s, box-shadow 0.2s;
    }
    .form-control:focus {
      outline: none;
      border: 1.5px solid #3A6351;
      box-shadow: 0 0 0 2px #B9C4A7bb;
    }
    .form-control.error {
      border-color: #dc3545;
    }
    .error-message {
      color: #dc3545;
      font-size: 0.95rem;
      margin-top: 0.25rem;
      text-align: left;
      width: 100%;
    }
    .btn {
      font-family: 'Open Sans', sans-serif;
      padding: 0.75rem 2rem;
      font-size: 1.05rem;
      text-decoration: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      transition: background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s, transform 0.15s;
      outline: none;
      border: none;
      box-shadow: none;
      display: inline-block;
      width: 100%;
      margin-top: 0.5rem;
    }
    .btn-primary {
      background: #3A6351;
      color: #fff;
      border: 1px solid #3A6351;
    }
    .btn-primary:hover, .btn-primary:focus {
      background: #2F5244;
      color: #fff;
      border: 1.5px solid #2F5244;
      box-shadow: 0 0 0 3px #B9C4A7aa;
      transform: translateY(-2px) scale(1.03);
    }
    .register-link {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
      width: 100%;
    }
    .register-link a {
      color: #3A6351;
      text-decoration: none;
      font-weight: 600;
      font-family: 'Open Sans', sans-serif;
      transition: color 0.2s;
    }
    .register-link a:hover {
      color: #2F5244;
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials: LoginCredentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.redirectBasedOnRole();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  private redirectBasedOnRole(): void {
    const role = this.authService.getUserRoleFromToken();
    
    switch (role) {
      case 'STUDENT':
        this.router.navigate(['/student']);
        break;
      case 'TEACHER':
        this.router.navigate(['/teacher']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
} 