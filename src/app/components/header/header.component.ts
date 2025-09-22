import { Component } from '@angular/core';
import { User } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userIsLoggedIn: boolean = false;
  user!: User

  ngOnInit() {
    // If the token is saved in the storage that means that the user is logged in
    const stored = localStorage.getItem('token')
    const token = stored ? JSON.parse(stored) : null
    this.userIsLoggedIn = token? true : false

    const storedUser = localStorage.getItem('user')
    this.user = storedUser ? JSON.parse(storedUser) : null
    console.log('The user object inside the header: ', this.user)
  }
}
