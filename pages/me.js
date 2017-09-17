// @flow
import Image from '../components/Image';
import P from '../components/P';
import Page from '../components/Page';
import React from 'react';
import Set from '../components/Set';
import ToggleBaseline from '../components/ToggleBaseline';
import ToggleDark from '../components/ToggleDark';
import app from '../components/app';
import gravatar from 'gravatar';
import sitemap from '../lib/sitemap';
import type { meQueryResponse } from './__generated__/meQuery.graphql';
import { SignOutButton } from '../components/buttons';
import { graphql } from 'react-relay';
import CreateWeb from '../components/CreateWeb';
import Heading from '../components/Heading';
import { FormattedMessage } from 'react-intl';
import { deleteCookie } from '../lib/cookie';

const getGravatarUrl = email =>
  gravatar.url(email, {
    d: 'retro',
    protocol: 'https',
    r: 'x',
    s: '100',
  });

const signOut = () => {
  deleteCookie();
  // Force full reload. Purging Relay environment and Redux store is not enough.
  // Sensitive session data can be stored in NEXT_PROPS or elsewhere.
  // eslint-disable-next-line no-undef
  location.href = '/';
};

type Props = {
  data: meQueryResponse,
  intl: *,
  userId: *,
};

const Me = ({ data, intl, userId }: Props) => {
  const { viewer: { user } } = data;
  // Note we can get current userId from cookie.
  if (!user || !userId) return null;
  return (
    <Page title={intl.formatMessage(sitemap.me.title)}>
      <Heading size={1}>
        <FormattedMessage id="yourWebs" defaultMessage="Your Webs" />
      </Heading>
      <CreateWeb ownerId={userId} />
      <Heading size={1}>
        <FormattedMessage id="profile" defaultMessage="Profile" />
      </Heading>
      <Image
        marginBottom={1}
        size={{ height: 100, width: 100 }}
        src={getGravatarUrl(user.email)}
        title={user.email}
      />
      <P bold>{user.email}</P>
      <Set>
        <SignOutButton danger onPress={signOut} />
      </Set>
      <Heading size={1}>
        <FormattedMessage defaultMessage="Dev Tools" id="devTools" />
      </Heading>
      <Set>
        <ToggleBaseline />
        <ToggleDark />
      </Set>
    </Page>
  );
};

export default app(Me, {
  requireAuth: true,
  query: graphql`
    query meQuery($filter: WebFilter) {
      viewer {
        user {
          email
        }
        allWebs(filter: $filter, orderBy: updatedAt_DESC) {
          edges {
            node {
              id
              domain
              name
              owner {
                id
              }
            }
          }
        }
      }
    }
  `,
  queryVariables: (query, userId) => ({
    filter: {
      owner: {
        id: userId,
      },
    },
  }),
});
