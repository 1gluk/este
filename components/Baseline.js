// @flow
import type { Node } from 'react';
import type { State } from '../types';
import React from 'react';
import { connect } from 'react-redux';
import withTheme, { type WithTheme } from './withTheme';

// Test vertical rhythm visually. Inspired by basehold.it

type BaselineProps = {|
  baselineShown: boolean,
  children?: Node,
|};

const styles = {
  container: {
    position: 'relative',
  },
  baseline: lineHeight => ({
    backgroundImage:
      'linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
    backgroundSize: `auto ${lineHeight}px`,
    bottom: 0,
    left: 0,
    marginTop: '-1px',
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 9999,
  }),
};

const Baseline = ({ theme, baselineShown, children }) => (
  <div style={styles.container}>
    {children}
    {baselineShown && (
      <div style={styles.baseline(theme.typography.lineHeight)} />
    )}
  </div>
);

const BaselineWithTheme: WithTheme<BaselineProps> = withTheme(Baseline);

export default connect((state: State) => ({
  baselineShown: state.app.baselineShown,
}))(BaselineWithTheme);
