import React, { useState } from 'react';
import { ACTION } from '@/utils';
import { ActionFormBody } from '../';
import { ModalBody } from '@/styles';
import { useActionCRUD, useActionFormData } from '@/hooks/actions';
import { ACTION_OPTIONS, useKeyDown, type ActionOption } from '@odigos/ui-utils';
import { AutocompleteInput, CenterThis, Divider, FadeLoader, Modal, NavigationButtons, SectionTitle } from '@odigos/ui-components';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ActionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  useKeyDown({ key: 'Enter', active: isOpen }, () => handleSubmit());

  const { createAction, loading } = useActionCRUD({ onSuccess: handleClose });
  const { formData, formErrors, handleFormChange, resetFormData, validateForm } = useActionFormData();

  const [selectedItem, setSelectedItem] = useState<ActionOption | undefined>(undefined);

  function handleClose() {
    resetFormData();
    setSelectedItem(undefined);
    onClose();
  }

  const handleSelect = (item?: ActionOption) => {
    resetFormData();
    handleFormChange('type', item?.type || '');
    setSelectedItem(item);
  };

  const handleSubmit = async () => {
    const isFormOk = validateForm({ withAlert: true, alertTitle: ACTION.CREATE });
    if (!isFormOk) return null;

    await createAction(formData);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      header={{ title: 'Add Action' }}
      actionComponent={
        <NavigationButtons
          buttons={[
            {
              variant: 'primary',
              label: 'DONE',
              onClick: handleSubmit,
              disabled: !selectedItem || loading,
            },
          ]}
        />
      }
    >
      <ModalBody>
        <SectionTitle title='Select Action' description='Select an action to modify telemetry data before it`s sent to destinations. Choose an action type and configure its details.' />
        <AutocompleteInput options={ACTION_OPTIONS} selectedOption={selectedItem} onOptionSelect={handleSelect} style={{ marginTop: '24px' }} autoFocus={!selectedItem?.type} />

        {!!selectedItem?.type ? (
          <div>
            <Divider margin='16px 0' />

            {loading ? (
              <CenterThis>
                <FadeLoader scale={2} />
              </CenterThis>
            ) : (
              <ActionFormBody action={selectedItem} formData={formData} formErrors={formErrors} handleFormChange={handleFormChange} />
            )}
          </div>
        ) : null}
      </ModalBody>
    </Modal>
  );
};
