import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginCredentials {
  email: string,
  password: string
}

export interface User {
  avatar: string,
  email: string,
  id: number,
  is_admin: number,
  remember_token: any,
  username: string
}

export interface UserResponse {
  token: string,
  user: User
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseURL = 'https://api.redseam.redberryinternship.ge/api'

  constructor(private http: HttpClient, private router: Router) { }

  async signup(credentials: FormData) {
    try {
      const res = await firstValueFrom(this.http.post<UserResponse>(`${this.baseURL}/register`, credentials))
      console.log('The user is: ', res)
      return res
    } catch (err) {
      console.log("Couldn't sign up: ", err)
      throw err // Rethrow error to allow the error message to be displayed on the page
    }
  }

  async login(credentials: LoginCredentials) {
    try {
      const res = await firstValueFrom(this.http.post<UserResponse>(`${this.baseURL}/login`, credentials))
      console.log('The user is: ', res)
      return res
    } catch (err) {
      console.log("Couldn't log in: ", err)
      throw err
    }
  }

  saveToStorage(name: string, token: string) {
    localStorage.setItem(name, JSON.stringify(token))
  }
}
