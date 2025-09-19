import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginCredentials {
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseURL = 'https://api.redseam.redberryinternship.ge/api'

  constructor(private http: HttpClient, private router: Router) { }

  async signup(credentials: FormData) {
    try {
      const res = await firstValueFrom(this.http.post<any>(`${this.baseURL}/register`, credentials))
      return res
    } catch (err) {
      console.log("Couldn't sign up: ", err)
      throw err
    }
  }

  async login(credentials: LoginCredentials) {
    try {
      const res = await firstValueFrom(this.http.post<any>(`${this.baseURL}/login`, credentials))
      return res
    } catch (err) {
      console.log("Couldn't log in: ", err)
      throw err
    }
  }

  saveTokenToStorage(token: string) {
    localStorage.setItem('token', JSON.stringify(token))
  }
}
