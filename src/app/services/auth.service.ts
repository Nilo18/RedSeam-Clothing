import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

// interface User {
//   email: string,
//   id: number,
//   username: string
// }

// interface Token {
//   token: string
// }

// interface RegisterSuccess {
//   token: string,
//   user: User
// }

// interface RegisterError {

// }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseURL = 'https://api.redseam.redberryinternship.ge/api'

  constructor(private http: HttpClient, private router: Router) { }

  async signup(credentials: FormData) {
    try {
      const res = await firstValueFrom(this.http.post<any>(`${this.baseURL}/register`, credentials))
      console.log(res)
      return res
    } catch (err) {
      console.log("Couldn't sign up: ", err)
      throw err
    }
  }
}
