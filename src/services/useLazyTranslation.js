import { useState, useEffect } from 'react';
import i18n from 'i18next';
export function useLazyTranslation(namespace) {
    const [isLangLoading, setIsLangLoading] = useState(true);
    // create a local translations state to avoid re-fetching the translations for the same language
    const [translations, setTranslations] = useState({});
    const [lang, setLang] = useState(i18n.language);

    useEffect(() => {
        const fetchLocales = async () => {
            setIsLangLoading(true);
            try {
                // if resource was not already loaded and added with a unique namespace, use it
                if (!i18n.hasResourceBundle(i18n.language, namespace)) {
              
                    // We are going to extend the namespace for the sake further extensibility
                    // If "Resources.DetailsView" is passed, it will be translated to:
                    // "containers/ResourcesContainer/components/DetailsView/locales/en/strings.json"
                    // if no prefix, like "DetailsView", it will be translated to:
                    // "components/DetailsView/locales/en/strings.json"
                    // for flexibility
                    const {container, component} = translateNamespace(namespace);

                    // This is used for Webpack's static path detection (a quirk of Webpack)
                    // I'd rather havea constructor function here (added below)
                    const resources = await import(
                        /* webpackInclude: /\.json$/ */
                        /* webpackMode: "lazy" */
                        `../${container ? `containers/${container}Container/` : ''}components/${component}/locales/${i18n.language}/strings.json` 
                        // like so: 
                        // buildImportPath({container, component, lang: i18n.language})
                    );
                    i18n.addResourceBundle(i18n.language, namespace, resources.default);
                }

                setTranslations(i18n.getResourceBundle(i18n.language, namespace) ?? {});
             } catch (error) {
                console.error(`Error loading ${namespace} translations for language ${i18n.language}:`, error);
            } finally {
                setIsLangLoading(false); // Finish loading
            }
        };

        fetchLocales();

        // manage language change notification using i18n to be listened to in other react components
        // can be recoded using i18nextreact.
        i18n.on('languageChanged', handleLanguageChange);
        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };

        function handleLanguageChange(lang) {
            setLang(lang);
        }
    }, [namespace, lang]);  // the lang dependency will be responsible for re-fetching the translations for the new language
    
    return {
        t: (key) => translations[key] ?? key, // fallback to key if no translation is found, 
                                              // can add basic i18n.t here as a fallback as well
                                              // i18n.t(key) ?? key or i18n.getFixedT(i18n.language, namespace)(key) ?? key
        isLangLoading
    };
}
    
function translateNamespace(namespace) {
    const parts = namespace.split('.');
    if (parts.length === 1) {
        return {
            component: parts[0],
            container: ''
        };
    }   
    return {
        component: parts[1],
        container: parts[0]
    };
}

function buildImportPath({
    container,
    component,
    lang
}) {
    let path = '..';
    if (container) {
        path += `/containers/${container}Container`;
    }
    path += `/components/${component}`;
    path += `/locales/${lang}/strings.json`;
    
    return path;
}