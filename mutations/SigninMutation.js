// @flow
import { graphql, commitMutation } from 'react-relay';
import type { Commit } from '../components/core/Mutation';
import * as generated from './__generated__/SigninMutation.graphql';

const mutation = graphql`
  mutation SigninMutation($input: AuthInput!) {
    signin(input: $input) {
      token
    }
  }
`;

const commit: Commit<generated.AuthInput, generated.SigninMutationResponse> = (
  environment,
  input,
  onCompleted,
  onError,
) =>
  commitMutation(environment, {
    mutation,
    // $FlowFixMe Wrong libdef.
    variables: { input },
    onCompleted,
    onError,
  });

export default { commit };
