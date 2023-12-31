import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TextService {
  extractStylesAndText(dataText: string): {
    styles: { [key: string]: string };
    innerHTML: string;
  } {
    const separatorIndex = dataText.indexOf('=>');
    const styleText = dataText.substring(0, separatorIndex);
    const innerHTML = dataText.substring(separatorIndex + 2);

    const styles = this.parseStyles(styleText);

    return { styles, innerHTML };
  }

  parseStyles(styleText: string): { [key: string]: string } {
    const styles: { [key: string]: string } = {};

    styleText.split(';').forEach((declaration) => {
      const [property, value] = declaration.split(':').map((str) => str.trim());
      if (property && value) {
        styles[property] = value;
      }
    });

    return styles;
  }

  setNickName(index: number, nickname: any, newData: any) {
    const nicknameParts = nickname.split('~!@#$%^&*()-=_+[]{}|;:,.<>?');

    if (index == 0 || index == 1) {
      nicknameParts[index] = newData;
      return nicknameParts.join('~!@#$%^&*()-=_+[]{}|;:,.<>?');
    }
  }

  getNickname(nickname: string): string {
    return nickname.split('~!@#$%^&*()-=_+[]{}|;:,.<>?')[0];
  }

  getNicknameEnableAndDisable(nickname: string): boolean {
    const value = nickname.split('~!@#$%^&*()-=_+[]{}|;:,.<>?')[1];
    return JSON.parse(value);
  }

  calculateAge(selectedDate: string): number {
    const birthDate = new Date(selectedDate);
    const currentDate = new Date();

    const ageInMilliseconds = currentDate.getTime() - birthDate.getTime();
    const ageInYears = Math.floor(
      ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000)
    ); // 365.25 days in a year

    return ageInYears;
  }

  getMonths() {
    const monthNames = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];

    return monthNames;
  }
}
