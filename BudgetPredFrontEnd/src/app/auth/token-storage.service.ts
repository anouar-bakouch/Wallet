import { Injectable } from '@angular/core';
import {
  REFRESH_TOKEN_KEY,
  TOKEN_INSERT_DATE_TIME,
  TOKEN_KEY,
} from '../utils/constants';
import { getDaysDelta } from '../utils/date';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor() {}

  public checkIfTokenIsOld() {
    const lastTkInsert = window.localStorage.getItem(TOKEN_INSERT_DATE_TIME);
    if (!lastTkInsert) return true;
    const days = Math.abs(getDaysDelta(Date.parse(lastTkInsert), new Date()));
    if (days > 0) return true;
    return false;
  }

  public storeTokens(
    token: string,
    refreshToken: string | undefined = undefined
  ) {
    window.localStorage.setItem(TOKEN_KEY, token);
    refreshToken &&
      window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    refreshToken &&
      window.localStorage.setItem(
        TOKEN_INSERT_DATE_TIME,
        new Date().toString()
      );
  }
  public getAuthToken(): string | undefined | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }
  public getRefreshToken(): string | undefined | null {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  public updateAuthToken(token: string) {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
  public clearTokens() {
    window.localStorage.clear();
  }

  public getUser() {
    const user = window.localStorage.getItem('user');
    if (user) return JSON.parse(user);
    return null;
  }

  public storeUser(user: any) {
    window.localStorage.setItem('user', JSON.stringify(user));
  }

  public clearUser() {
    window.localStorage.removeItem('user');
  }

  public storeUserPhoto(photo: string) {
    window.localStorage.setItem('photo', photo);
  }

  public getUserPhoto() {
    return window.localStorage.getItem('photo');
  }

  public clearUserPhoto() {
    window.localStorage.removeItem('photo');
  }

  

     
}