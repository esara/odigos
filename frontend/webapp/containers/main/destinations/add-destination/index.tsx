import React, { useState } from 'react';
import { ROUTES } from '@/utils';
import { useAppStore } from '@/store';
import { SetupHeader } from '@/components';
import { useRouter } from 'next/navigation';
import styled, { useTheme } from 'styled-components';
import { NOTIFICATION_TYPE } from '@odigos/ui-utils';
import { ArrowIcon, PlusIcon } from '@odigos/ui-icons';
import { DestinationModal } from '../destination-modal';
import { useDestinationCRUD, useSourceCRUD } from '@/hooks';
import { ConfiguredDestinationsList } from './configured-destinations-list';
import { Button, CenterThis, FadeLoader, NotificationNote, SectionTitle, Text } from '@odigos/ui-components';

const ContentWrapper = styled.div`
  width: 640px;
  padding-top: 64px;
`;

const HeaderWrapper = styled.div`
  width: 100vw;
`;

const NotificationNoteWrapper = styled.div`
  margin-top: 24px;
`;

const AddDestinationButtonWrapper = styled.div`
  width: 100%;
  margin-top: 24px;
`;

const StyledAddDestinationButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
`;

export function AddDestinationContainer() {
  const theme = useTheme();
  const router = useRouter();
  const { persistSources } = useSourceCRUD();
  const { createDestination } = useDestinationCRUD();
  const { configuredSources, configuredFutureApps, configuredDestinations, resetState } = useAppStore((state) => state);

  // we need this state, because "loading" from CRUD hooks is a bit delayed, and allows the user to double-click, as well as see elements render in the UI when they should not be rendered.
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const clickBack = () => {
    router.push(ROUTES.CHOOSE_SOURCES);
  };

  const clickDone = async () => {
    setIsLoading(true);

    // configuredSources & configuredFutureApps are set in store from the previous step in onboarding flow
    await persistSources(configuredSources, configuredFutureApps);
    await Promise.all(configuredDestinations.map(async ({ form }) => await createDestination(form)));

    resetState();
    router.push(ROUTES.OVERVIEW);
  };

  const isSourcesListEmpty = () => !Object.values(configuredSources).some((sources) => !!sources.length);

  return (
    <>
      <HeaderWrapper>
        <SetupHeader
          buttons={[
            {
              label: 'BACK',
              icon: ArrowIcon,
              variant: 'secondary',
              onClick: clickBack,
              disabled: isLoading,
            },
            {
              label: 'DONE',
              variant: 'primary',
              onClick: clickDone,
              disabled: isLoading,
            },
          ]}
        />
      </HeaderWrapper>
      <ContentWrapper>
        <SectionTitle title='Configure destinations' description='Select destinations where telemetry data will be sent and configure their settings.' />

        {!isLoading && isSourcesListEmpty() && (
          <NotificationNoteWrapper>
            <NotificationNote
              type={NOTIFICATION_TYPE.WARNING}
              message='No sources selected. Please go back to select sources.'
              action={{
                label: 'Select sources',
                onClick: () => router.push(ROUTES.CHOOSE_SOURCES),
              }}
            />
          </NotificationNoteWrapper>
        )}

        <AddDestinationButtonWrapper>
          <StyledAddDestinationButton variant='secondary' disabled={isLoading} onClick={() => handleOpenModal()}>
            <PlusIcon />
            <Text color={theme.colors.secondary} size={14} decoration='underline' family='secondary'>
              ADD DESTINATION
            </Text>
          </StyledAddDestinationButton>

          <DestinationModal isOnboarding isOpen={isModalOpen && !isLoading} onClose={handleCloseModal} />
        </AddDestinationButtonWrapper>

        {isLoading ? (
          <CenterThis>
            <FadeLoader scale={2} cssOverride={{ marginTop: '3rem' }} />
          </CenterThis>
        ) : (
          <ConfiguredDestinationsList data={configuredDestinations} />
        )}
      </ContentWrapper>
    </>
  );
}
