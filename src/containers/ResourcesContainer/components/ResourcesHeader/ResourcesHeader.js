import React from 'react';
import styled from 'styled-components';
import {HeaderText, SubHeaderText} from '../../../../styles/commonStyles';
import { useLazyTranslation } from '../../../../services/useLazyTranslation';
import { useTranslation } from 'react-i18next';
import { getNamespace } from '../../../../services/getNamespace';
const ResourceHeaderText = styled(HeaderText)`
    color: #686868;
    margin-bottom: 3px;
`;

export default function ResourcesHeader() {
    const namespace = getNamespace(import.meta.url);
    const isTranslationsLoaded = useLazyTranslation(namespace);
    const {t} = useTranslation(namespace);

    return (
        <>
            <ResourceHeaderText>{t('TITLE')}</ResourceHeaderText>
            <SubHeaderText>{t('SUBTITLE')}</SubHeaderText>
        </>
    );
}
