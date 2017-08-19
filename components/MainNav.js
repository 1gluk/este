// @flow
import type { IntlShape } from 'react-intl';
import A from './A';
import Box from './Box';
import PropTypes from 'prop-types';
import React from 'react';
import sitemap from '../lib/sitemap';
import { FormattedMessage, injectIntl } from 'react-intl';

const { me, signIn, ...pages } = sitemap;

const NavA = ({ intl, page, title, ...props }) =>
  <A
    backgroundColor="primary"
    bold
    isActive={title === intl.formatMessage(page.title)}
    color="white"
    href={page.path}
    paddingHorizontal={0.5}
    paddingVertical={0.5}
    prefetch
    {...props}
  >
    <FormattedMessage {...page.title} />
  </A>;

type MainNavProps = {|
  intl: IntlShape,
  title: string,
|};

const MainNav = ({ intl, title }: MainNavProps, { isAuthenticated }) => {
  const authPage = isAuthenticated ? me : signIn;
  return (
    <Box
      backgroundColor="primary"
      flexDirection="row"
      flexWrap="wrap"
      marginVertical={0.5}
      paddingHorizontal={0.5}
    >
      {Object.keys(pages).map(pageName => {
        const page = pages[pageName];
        return <NavA intl={intl} key={page.path} page={page} title={title} />;
      })}
      <NavA intl={intl} key={authPage.path} page={authPage} title={title} />
    </Box>
  );
};

MainNav.contextTypes = { isAuthenticated: PropTypes.bool };

// TODO: Enforce title. Blocked by obsolete react-intl types.
export default injectIntl(MainNav);
