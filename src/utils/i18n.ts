import * as fs from 'fs';
import * as path from 'path';
import { config } from '@/config/config';

type TranslationKeys = Record<string, any>;

export class I18n {
  private static instance: I18n;
  private translations: Map<string, TranslationKeys> = new Map();
  private currentLocale: string;

  private constructor() {
    this.currentLocale = 'en'; // Default to English
    this.loadTranslations();
  }

  public static getInstance(): I18n {
    if (!I18n.instance) {
      I18n.instance = new I18n();
    }
    return I18n.instance;
  }

  private loadTranslations(): void {
    const localesPath = path.join(__dirname, '../locales');
    
    try {
      const files = fs.readdirSync(localesPath);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const locale = file.replace('.json', '');
          const filePath = path.join(localesPath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          this.translations.set(locale, JSON.parse(content));
        }
      }
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  public setLocale(locale: string): void {
    if (this.translations.has(locale)) {
      this.currentLocale = locale;
    }
  }

  public t(key: string, params?: Record<string, any>): string {
    const translation = this.translations.get(this.currentLocale);
    if (!translation) {
      return key;
    }

    const keys = key.split('.');
    let value: any = translation;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters in the translation string
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match: string, param: string) => {
        return params[param] !== undefined ? String(params[param]) : match;
      });
    }

    return value;
  }

  public getCurrentLocale(): string {
    return this.currentLocale;
  }
}

export const i18n = I18n.getInstance();
