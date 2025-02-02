import i18n from 'i18next';

// Slight adjustments to the i18next initializer to allow for:
// 1. Lazy loading of translations
// 2. Multiple languages (en & es)
export const init = ({lang}) => {
    return new Promise(async (resolve, reject) => {

        // language defaults
        const response = await fetch(`/locales/${lang}/strings.json`);
        const translation = await response.json();

        i18n.init({
            lng: lang,
            fallbackLng: 'en-US',
            supportedLngs: ['en-US', 'es-ES'],
            resources: {
                [lang]: {translation}
            }
        }, (err, t) => {
            if (err) return reject(err);

            global.t = t;
            resolve();
        });
    });
};

// Safe language change utility so in case we have additional 
// side effects for language change, we can handle them here
export const changeLanguage = async (lang) => {
    try {
        await i18n.changeLanguage(lang);
      } catch (error) {
        console.error(`Error switching language to ${lang}:`, error);
      }
};