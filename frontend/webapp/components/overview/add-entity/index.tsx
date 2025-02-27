import React, { useState, useRef, useEffect } from 'react';
import { useModalStore } from '@/store';
import { Theme } from '@odigos/ui-theme';
import { PlusIcon } from '@odigos/ui-icons';
import styled, { css, useTheme } from 'styled-components';
import { Button, type DropdownProps, Text } from '@odigos/ui-components';
import { ENTITY_TYPES, getEntityIcon, useOnClickOutside } from '@odigos/ui-utils';

// Styled components for the dropdown UI
const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 160px;
  padding-right: 24px;
`;

const DropdownListContainer = styled.div`
  position: absolute;
  right: 0;
  top: 42px;
  border-radius: 24px;
  width: 200px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 9999;
  padding: 12px;
`;

const DropdownItem = styled.div<{ $selected: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 24px;
  gap: 8px;
  display: flex;
  align-items: center;
  &:hover {
    background: ${({ theme }) => theme.text.grey + Theme.hexPercent['050']};
  }
  ${({ $selected, theme }) =>
    $selected &&
    css`
      background: ${theme.colors.majestic_blue + Theme.hexPercent['024']};
    `}
`;

const ButtonText = styled(Text)`
  color: ${({ theme }) => theme.text.primary};
  font-family: ${({ theme }) => theme.font_family.secondary};
  font-weight: 600;
`;

// Default options for the dropdown
const DEFAULT_OPTIONS: DropdownProps['options'] = [
  { id: ENTITY_TYPES.INSTRUMENTATION_RULE, value: 'Instrumentation Rule' },
  { id: ENTITY_TYPES.SOURCE, value: 'Source' },
  { id: ENTITY_TYPES.ACTION, value: 'Action' },
  { id: ENTITY_TYPES.DESTINATION, value: 'Destination' },
];

interface Props {
  options?: DropdownProps['options'];
  placeholder?: string;
}

export const AddEntity: React.FC<Props> = ({ options = DEFAULT_OPTIONS, placeholder = 'ADD NEW' }) => {
  const theme = useTheme();
  const { currentModal, setCurrentModal } = useModalStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  useEffect(() => {
    if (dropdownRef.current) {
      const { current: c } = dropdownRef;

      const handleOpen = () => setIsDropdownOpen(true);
      const handleClose = () => setIsDropdownOpen(false);

      c.addEventListener('mouseenter', handleOpen);
      c.addEventListener('mouseleave', handleClose);

      return () => {
        c.removeEventListener('mouseenter', handleOpen);
        c.removeEventListener('mouseleave', handleClose);
      };
    }
  }, []);

  const handleSelect = (option: DropdownProps['options'][0]) => {
    setCurrentModal(option.id);
    setIsDropdownOpen(false); // ??? maybe remove this line (for fast-toggle between modals)
  };

  return (
    <Container ref={dropdownRef}>
      <StyledButton data-id='add-entity'>
        <PlusIcon fill={theme.colors.primary} />
        <ButtonText size={14}>{placeholder}</ButtonText>
      </StyledButton>

      {isDropdownOpen && (
        <DropdownListContainer>
          {options.map((option) => {
            const Icon = getEntityIcon(option.id as ENTITY_TYPES);

            return (
              <DropdownItem key={option.id} data-id={`add-${option.id}`} $selected={currentModal === option.id} onClick={() => handleSelect(option)}>
                <Icon fill={theme.text.primary} />
                <Text size={14} color={theme.text.primary}>
                  {option.value}
                </Text>
              </DropdownItem>
            );
          })}
        </DropdownListContainer>
      )}
    </Container>
  );
};
