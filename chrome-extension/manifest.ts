import { readFileSync } from 'node:fs';
import type { ManifestType } from '@extension/shared';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

/**
 * @prop default_locale
 * if you want to support multiple languages, you can use the following reference
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
 *
 * @prop browser_specific_settings
 * Must be unique to your extension to upload to addons.mozilla.org
 * (you can delete if you only want a chrome extension)
 *
 * @prop permissions
 * Firefox doesn't support sidePanel (It will be deleted in manifest parser)
 *
 * @prop content_scripts
 * css: ['content.css'], // public folder
 */
const manifest = {
  manifest_version: 3,
  default_locale: 'en',
  name: '__MSG_extensionName__',
  version: packageJson.version,
  description: '__MSG_extensionDescription__',
  permissions: ['storage'],
  background: {
    service_worker: 'background.js',
    type: 'module',
  },
  action: {
    default_popup: 'popup/index.html',
    default_icon: 'icon-32.png',
  },
  icons: {
    '128': 'icon-128.png',
  },
  content_scripts: [
    {
      matches: ['https://linkedin.com/*', 'https://www.linkedin.com/*'],
      js: ['content/linkedin.iife.js'],
      css: ['content.css'],
    },
  ],
  externally_connectable: {
    matches: ['http://localhost:5173/*', 'https://localhost:5173/*', 'https://surface-up.web.app/*'],
  },
  web_accessible_resources: [
    {
      resources: ['icon-128.png', 'icon-32.png', 'content/*', 'content.css'],
      matches: ['*://*/*'],
    },
  ],
  key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4gCTv548P2QBqSwvsH0OAJzli7tqvpTJjs+CHuSNJNwpwFWOzChGJFfme+LMK/SEpOXAonz2TXsby9zpxSH4C/GdL8C+SoXE91neG0D/hih9DirhciDpqxEQ9Mbk9/lsCPIdxpO56mcVwrJy//e1nUzDotdWuBbVlwrnwADFTDM9R2a75NSDJ85h5qUXtMTBMu6nOTmqkawL+0VZdriz3O2eB4BJscEFwzY564yonBYY/69kuHquf45keVfNtRo9j858vNIPV7Sjy5JyuNQjrF3X3R49XP5tYH2jfcyk/+cWsAwMHk3xsm8fHIKIGTCqPYvr4emJQyMIARm1+WvbsQIDAQAB',
} satisfies ManifestType;

export default manifest;
