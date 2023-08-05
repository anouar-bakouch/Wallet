// guard for checking if user is logged in

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable( {
    providedIn: 'root'
    })

export class IsUserGuard implements CanActivate {
    constructor( private auth: AuthService, private router: Router ) {}

    canActivate() {
        if ( this.auth.isAuthenticated() ) {
            return true;
        } else {
            this.router.navigate( ['/login'] );
            return false;
        }
    }
}

