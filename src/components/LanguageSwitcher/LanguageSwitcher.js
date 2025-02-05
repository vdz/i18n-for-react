import { useLanguageSwitcher } from '../../services/useLanguageSwitcher';
import { changeLanguage } from '../../services/translation';
import styled from 'styled-components';


const LanguageSwitcherContainer = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`;

const LanguageButton = styled.button`
    appearance: none;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 16px;
    color: #ccc;
    text-decoration: underline;

    &:disabled {
        color: #686868;
        text-decoration: none;
    }

    &:hover {
        color: #000;
    }
`;
// Simple language switcher, that will cause i18n on 'languageChanged' event to be triggered.
// We have event handlers registered with our translated components to load new strings if language changes.
export default function LanguageSwitcher() {
    const {language} = useLanguageSwitcher();

    return (
        <LanguageSwitcherContainer>
            <LanguageButton onClick={() => changeLanguage('en-US')}
                disabled={language === 'en-US'}>English</LanguageButton>
            <LanguageButton onClick={() => changeLanguage('es-ES')}
                disabled={language === 'es-ES'}>Spanish</LanguageButton>
        </LanguageSwitcherContainer>
    );
}