// @flow
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { type WebListItem_web } from './__generated__/WebListItem_web.graphql';
import Text from './Text';
import Box from './Box';
import { FormattedRelative } from 'react-intl';
import Set from './Set';
import { DeleteButton } from './buttons';
import AreYouSureConfirm from './AreYouSureConfirm';
import withMutation, { getClientMutationId } from './withMutation';
import DeleteWebMutation from '../mutations/DeleteWebMutation';
import withAuth, { type AuthContext } from './withAuth';

const DeleteWeb = ({ onPress, disabled }) => (
  <AreYouSureConfirm
    render={confirm => (
      <DeleteButton
        color="warning"
        disabled={disabled}
        onPress={() => {
          if (confirm()) onPress();
        }}
        paddingHorizontal={0}
        size={-1}
      />
    )}
  />
);

type Props = {
  web: WebListItem_web,
  mutate: *,
};

type State = {
  pending: boolean,
};

const initialState = {
  pending: false,
};

class WebListItem extends React.Component<Props, State> {
  state = initialState;

  context: AuthContext;

  handleCompleted = () => {
    this.setState(initialState);
  };

  handleError = () => {
    this.setState({ pending: false });
  };

  deleteWeb = () => {
    const { userId } = this.context;
    if (!userId) return;

    const variables = {
      input: {
        id: this.props.web.id,
        clientMutationId: getClientMutationId(),
      },
    };
    this.setState({ pending: true });
    this.props.mutate(
      DeleteWebMutation.commit(userId),
      variables,
      this.handleCompleted,
      this.handleError,
    );
  };

  render() {
    const { web } = this.props;
    const { pending } = this.state;
    return (
      <Box>
        <Text>{web.name}</Text>
        <Set>
          <Text color="gray" size={-1}>
            <Text>{web.domain}</Text>
            {', '}
            <DeleteWeb disabled={pending} onPress={this.deleteWeb} />
            {', '}
            <FormattedRelative value={web.updatedAt} />
          </Text>
        </Set>
      </Box>
    );
  }
}

withAuth(WebListItem);

const WebListItemWithMutation = withMutation(WebListItem);

export default createFragmentContainer(WebListItemWithMutation, {
  web: graphql`
    fragment WebListItem_web on Web {
      updatedAt
      domain
      id
      name
    }
  `,
});
