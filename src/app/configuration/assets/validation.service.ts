import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  isValidPhoneNumber(phoneNumber: string): boolean {
    // Phone number should have 11 characters and start with '09'
    const phoneNumberPattern = /^09\d{9}$/;
    return phoneNumberPattern.test(phoneNumber);
  }

  replaceNicknameFirstPart(
    nickname: string,
    separators: string,
    replacement: string
  ): string {
    const separatorIndex = nickname.indexOf(separators);
    if (separatorIndex !== -1) {
      const suffix = nickname.substring(separatorIndex);
      return replacement + suffix;
    }
    return nickname;
  }

  isValidAge(age: number): boolean {
    return age >= 18 && age <= 100;
  }
}
