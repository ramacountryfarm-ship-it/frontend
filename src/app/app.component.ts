import { Component, OnInit } from '@angular/core';
import { PushNotificationService } from './core/services/push-notification.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Rama Country Farm';

  constructor(
    private pushService: PushNotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Init push notifications once user is logged in
    if (this.authService.isLoggedIn()) {
      this.pushService.init();
    }
  }
}
