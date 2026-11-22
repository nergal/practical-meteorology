import { Capacitor, registerPlugin } from '@capacitor/core';
import { createRoot } from 'react-dom/client';
import App from './App';
import { locales, type Locale } from './atlas';
import './styles.css';

const root = createRoot(document.getElementById('root')!);
const android = Capacitor.getPlatform() === 'android';
const systemLanguages = registerPlugin<{ getPreferred(): Promise<{ tags: string }> }>('SystemLanguages');

function preferredLocale(tags: readonly string[]): Locale {
  for (const tag of tags) {
    const language = tag.split('-')[0].toLowerCase();
    const supported = locales.find(locale => locale === language);
    if (supported) return supported;
  }
  return 'en';
}

let latestRequest = 0;
async function renderInSystemLanguage() {
  const request = ++latestRequest;
  let tags: readonly string[] = navigator.languages?.length ? navigator.languages : [navigator.language];
  if (android) {
    try {
      tags = (await systemLanguages.getPreferred()).tags.split(',');
    } catch {
      // The WebView language list is still available if the native bridge fails.
    }
  }
  if (request === latestRequest) root.render(<App locale={preferredLocale(tags)} />);
}

window.addEventListener(android ? 'atlasConfigurationChanged' : 'languagechange', renderInSystemLanguage);
void renderInSystemLanguage();
