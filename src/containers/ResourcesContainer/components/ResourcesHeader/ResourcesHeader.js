import React from 'react';
import styled from 'styled-components';
import {HeaderText, SubHeaderText} from '../../../../styles/commonStyles';
import { useLazyTranslation } from '../../../../services/useLazyTranslation';
const ResourceHeaderText = styled(HeaderText)`
    color: #686868;
    margin-bottom: 3px;
`;

export default function ResourcesHeader() {
    const {t} = useLazyTranslation('ResourcesHeader');

    return (
        <>
            <ResourceHeaderText>{t('TITLE')}</ResourceHeaderText>
            <SubHeaderText>{t('SUBTITLE')}</SubHeaderText>
        </>
    );
}
