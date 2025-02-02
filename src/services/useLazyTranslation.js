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
                        `../${container ? `containers/${container}Container/` : ''}components/${component}/locales/${language}/strings.json` 
                        // like so: 
                        // buildImportPath({container, component, lang: i18n.language})
                    );
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
    
// Helper to get component namespace from stack trace
const getComponentNamespace = () => {
    const stack = new Error().stack;
    const callerLine = stack.split('\n')[3]; // Get caller component path
    console.log('callerLine', stack);
    // Extract component path and convert to namespace
    const match = callerLine.match(/(?:\/src\/)(.*?)\.(jsx?|tsx?):/);
    console.log('match', match);
    if (match) {
      return match[1]
        .replace(/\//g, '.') // Convert path separators to dots
        .replace(/\.(jsx?|tsx?)$/, ''); // Remove file extension
    }
    
    console.warn('Could not determine component namespace automatically');
    return null;
  };

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