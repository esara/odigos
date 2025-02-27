import React from 'react';
import { INPUT_TYPES } from '@/utils';
import type { DynamicField } from '@/types';
import { compareCondition, safeJsonParse } from '@odigos/ui-utils';
import { Checkbox, Dropdown, Input, InputList, KeyValueInputsList, TextArea } from '@odigos/ui-components';

interface Props {
  fields: DynamicField[];
  onChange: (name: string, value: any) => void;
  formErrors: Record<string, string>;
}

export const DestinationDynamicFields: React.FC<Props> = ({ fields, onChange, formErrors }) => {
  return fields?.map((field) => {
    const { componentType, renderCondition, ...rest } = field;

    // @ts-ignore
    const shouldRender = compareCondition(renderCondition, fields);
    if (!shouldRender) return null;

    switch (componentType) {
      case INPUT_TYPES.INPUT:
        return <Input key={field.name} {...rest} onChange={(e) => onChange(field.name, e.target.value)} errorMessage={formErrors[field.name]} />;
      case INPUT_TYPES.DROPDOWN:
        return (
          <Dropdown
            key={field.name}
            {...rest}
            value={{ id: rest.value, value: rest.value }}
            options={rest.options || []}
            onSelect={(option) => onChange(field.name, option.value)}
            errorMessage={formErrors[field.name]}
          />
        );
      case INPUT_TYPES.MULTI_INPUT:
        return (
          <InputList
            key={field.name}
            {...rest}
            value={typeof rest.value === 'string' ? safeJsonParse(rest.value, []) : rest.value}
            onChange={(value) => onChange(field.name, JSON.stringify(value))}
            errorMessage={formErrors[field.name]}
          />
        );
      case INPUT_TYPES.KEY_VALUE_PAIR:
        return (
          <KeyValueInputsList
            key={field.name}
            {...rest}
            value={typeof rest.value === 'string' ? safeJsonParse(rest.value, []) : rest.value}
            onChange={(value) => onChange(field.name, JSON.stringify(value))}
            errorMessage={formErrors[field.name]}
          />
        );
      case INPUT_TYPES.TEXTAREA:
        return <TextArea key={field.name} {...rest} onChange={(e) => onChange(field.name, e.target.value)} errorMessage={formErrors[field.name]} />;
      case INPUT_TYPES.CHECKBOX:
        return <Checkbox key={field.name} {...rest} value={rest.value == 'true'} onChange={(bool) => onChange(field.name, String(bool))} errorMessage={formErrors[field.name]} />;
      default:
        return null;
    }
  });
};
