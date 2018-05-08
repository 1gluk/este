// @flow
import * as React from 'react';
import app from '../components/app';
import { graphql } from 'react-relay';
import * as generated from './__generated__/editQuery.graphql';
import Error from 'next/error';

const Edit = props => {
  const { web }: generated.editQueryResponse = props.data;
  if (!web) return <Error statusCode={404} />;
  return null;
};

export default app(Edit, {
  query: graphql`
    query editQuery($domain: String!) {
      web(domain: $domain) {
        name
      }
    }
  `,
});
