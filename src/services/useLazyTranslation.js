import { useState, useEffect } from 'react';
import i18n from 'i18next';
import { useLanguage } from './LanguageProvider';

export function useLazyTranslation(namespace) {
    const [isLoaded, setIsLoaded] = useState(false);
    const { language } = useLanguage();

    useEffect(() => {
        const fetchLocales = async () => {
            setIsLoaded(false);
            // if resource was not already loaded and added with a unique namespace, use it
            if (!i18n.hasResourceBundle(language, namespace)) {
                try {
                    const path = buildImportPath(namespace, language);
                    // the only viable way I found to actually make this work, 
                    // is to use this (useLazyTranslation.js) file's relative location: 
                    // not ideal, requires deeper research
                    const resources = await import(`../${path}`);
                    i18n.addResourceBundle(language, namespace, resources.default);
                } catch (error) {
                    console.error(`Error loading ${namespace} translations for language ${language}:`, error);
                }
            }
            setIsLoaded(true); // Finish loading
        };

        fetchLocales();
    }, [namespace, language]);  // the lang dependency will be responsible for re-fetching the translations for the new language
    
    return isLoaded;
}

function buildImportPath(namespace, language) {
    return namespace.substring(1,namespace.lastIndexOf('/')+1) + `locales/${language}/strings.json`;
}