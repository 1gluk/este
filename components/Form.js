// @flow
import React from 'react';
import Box, { type BoxProps } from './Box';
import withTheme, { type WithTheme } from './withTheme';

// Render form as form in browser, because auth data or whatever pre-filling.
const BrowserForm = ({ onSubmit, ...restProps }: { onSubmit: () => void }) => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
  <form
    {...restProps}
    onKeyPress={(e: KeyboardEvent) => {
      if (e.target.tagName !== 'INPUT') return;
      if (e.key !== 'Enter') return;
      if (typeof onSubmit !== 'function') return;
      onSubmit();
    }}
    onSubmit={(e: Event) => {
      e.preventDefault();
    }}
  />
);

type FormProps = {
  onSubmit?: () => any,
} & BoxProps;

const Form = ({
  theme,
  as = BrowserForm,
  marginBottom = theme.form.marginBottom,
  maxWidth = theme.form.maxWidth,
  ...props
}) => (
  <Box as={as} marginBottom={marginBottom} maxWidth={maxWidth} {...props} />
);

const FormWithTheme: WithTheme<FormProps> = withTheme(Form);

export default FormWithTheme;
