


import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const en = {
  translation: {
    loading: "Loading...",
    play: "Play",
    settings: "Settings",
    math: {
      addition: "Addition",
      subtraction: "Subtraction",
      correct: "Correct! 🎉",
      incorrect: "Try again!",
      timeUp: "Time's up!",
      score: "Score: {{score}}",
      level: "Level {{level}}"
    },
    rewards: {
      coins: "{{count}} coin",
      coins_plural: "{{count}} coins",
      sticker: "New sticker!",
      critter: "New critter!"
    },
    overworld: {
      welcome: "Welcome to Math Adventure!",
      select: "Select a math challenge",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard"
    },
    accessibility: {
      textSize: "Text Size",
      sound: "Sound",
      contrast: "High Contrast"
    }
  }
};

// Thai translations
const th = {
  translation: {
    loading: "กำลังโหลด...",
    play: "เล่น",
    settings: "ตั้งค่า",
    math: {
      addition: "การบวก",
      subtraction: "การลบ",
      correct: "ถูกต้อง! 🎉",
      incorrect: "ลองอีกครั้ง!",
      timeUp: "หมดเวลา!",
      score: "คะแนน: {{score}}",
      level: "ระดับ {{level}}"
    },
    rewards: {
      coins: "{{count}} เหรียญ",
      coins_plural: "{{count}} เหรียญ",
      sticker: "สติกเกอร์ใหม่!",
      critter: "สัตว์เลี้ยงใหม่!"
    },
    overworld: {
      welcome: "ยินดีต้อนรับสู่การผจญภัยคณิตศาสตร์!",
      select: "เลือกแบบฝึกหัดคณิตศาสตร์",
      easy: "ง่าย",
      medium: "ปานกลาง",
      hard: "ยาก"
    },
    accessibility: {
      textSize: "ขนาดตัวอักษร",
      sound: "เสียง",
      contrast: "ความคมชัดสูง"
    }
  }
};

export class I18nManager {
  static initialize() {
    i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources: {
          en,
          th
        },
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
          escapeValue: false
        },
        detection: {
          order: ['localStorage', 'navigator'],
          caches: ['localStorage']
        }
      });
  }

  static changeLanguage(lng: string) {
    return i18n.changeLanguage(lng);
  }

  static getCurrentLanguage(): string {
    return i18n.language;
  }

  static t(key: string, options?: any): string {
    return i18n.t(key, options);
  }
}

export default i18n;


