import React from 'react';
import PropTypes from 'prop-types';
import DetailsHeader from './components/DetailsHeader/DetailsHeader';
import SectionHeader from './components/SectionHeader/SectionHeader';
import {TextField} from '../../../../components/TextField/TextField';
import {VerticalContainer} from '../../../../styles/commonStyles';
import styled from 'styled-components';
import { useLazyTranslation } from '../../../../services/useLazyTranslation';
const WidgetContainer = styled(VerticalContainer)`
  min-height: 100%;
  background-color: white;
  box-shadow: 0px 1px 4px 1px #888888;
`;

const ContentContainer = styled.div`
  display: flex;
  padding-top: 15px;
  flex: 1;
`;

const SectionContainer = styled.div`
    width: 100%;
    padding: 0 12px 5px;
    min-height: 100%;
`;

const FieldsContainer = styled.div`
    margin-top: 6px;
`;

const Loading = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    flex-grow: 1;
`;

export default function DetailsView({resource}) {
    const {t, isLangLoading} = useLazyTranslation('DetailsView');
    const {name, description, resourceType, path} = resource;

    if (isLangLoading)
        return (
            <WidgetContainer>
                <Loading>Loading language...</Loading>
            </WidgetContainer>
    );

    const fields = [
        {
            value: name,
            label: t('FIELD_TITLE_NAME')
        },
        {
            value: description,
            label: t('FIELD_TITLE_DESCRIPTION')
        },
        {
            value: resourceType,
            label: t('FIELD_TITLE_RESOURCE_TYPE')
        },
        {
            value: path,
            label: t('FIELD_TITLE_RESOURCE_PATH')
        }
    ];

    return (
        <WidgetContainer>
            <DetailsHeader {...{name}} />
            <ContentContainer>
                <SectionContainer>
                    <SectionHeader {...{
                        headerText: t('TITLE')
                    }} />
                    <FieldsContainer>
                        {fields.map((props) => <TextField key={props.value} {...props}/>)}
                    </FieldsContainer>
                </SectionContainer>
            </ContentContainer>
        </WidgetContainer>
    );
}

DetailsView.propTypes = {
    resource: PropTypes.object
};
