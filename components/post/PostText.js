// @flow
import * as React from 'react';
import { TextInput } from 'react-native';
import withTheme, { type Theme } from '../core/withTheme';
import { injectIntl, defineMessages, type IntlShape } from 'react-intl';
import throttle from 'lodash/throttle';
import { onChangeTextThrottle } from '../core/TextInput';
import withMutation from '../core/withMutation';
import withStore, { type Store } from '../core/withStore';
import { pipe } from 'ramda';
import SetPostTextMutation, {
  type SetPostTextCommit,
} from '../../mutations/SetPostTextMutation';
import { createFragmentContainer, graphql } from 'react-relay';
import * as generated from './__generated__/PostText.graphql';

export const messages = defineMessages({
  placeholder: {
    defaultMessage: 'write',
    id: 'postText.textInput.placeholder',
  },
  // TODO: [Home](/) | [About](/)
  example: {
    defaultMessage: `
# Example

Markdown is a simple way to *format* text that looks **great** on any device.

* List
* List

1. One
2. Two

> Blockquote

made by [steida](https://twitter.com/steida)
`,
    id: 'postText.textInput.example',
  },
});

type Selection = { start: number, end: number };

type PostTextProps = {|
  data: generated.PostText,
  theme: Theme,
  intl: IntlShape,
  commit: SetPostTextCommit,
  store: Store,
  disabled?: boolean,
  onSelectionChange?: (selection: Selection) => void,
|};

type PostTextState = {|
  selection: Selection,
|};

class PostText extends React.PureComponent<PostTextProps, PostTextState> {
  handleOnChangeTextThrottled = throttle((text: string) => {
    const input = {
      id: this.props.data.id,
      text,
    };
    this.props.commit(input);
  }, onChangeTextThrottle);

  inputRef = React.createRef();

  state = {
    selection: {
      start: this.props.data.draftText.length,
      end: this.props.data.draftText.length,
    },
  };

  componentDidMount() {
    this.adjustHeight();
  }

  componentDidUpdate(prevProps) {
    if (this.props.data.draftText !== prevProps.data.draftText) {
      this.adjustHeight();
    }
  }

  handleTextInputChangeText = (text: string) => {
    this.props.store(store => {
      const record = store.get(this.props.data.id);
      if (!record) return;
      record.setValue(text, 'draftText');
    });
    this.handleOnChangeTextThrottled(text);
  };

  handleTextInputSelectionChange = ({ nativeEvent: { selection } }) => {
    this.setState({ selection });
    const { onSelectionChange } = this.props;
    if (onSelectionChange) onSelectionChange(selection);
  };

  adjustHeight() {
    const { current } = this.inputRef;
    if (!current) return;
    current.setNativeProps({
      style: { height: 0 },
    });
    current.setNativeProps({
      // eslint-disable-next-line no-underscore-dangle
      style: { height: current._node.scrollHeight },
    });
  }

  render() {
    const { theme, intl } = this.props;

    return (
      <TextInput
        multiline
        value={this.props.data.draftText}
        onChangeText={this.handleTextInputChangeText}
        onSelectionChange={this.handleTextInputSelectionChange}
        placeholderTextColor={theme.placeholderTextColor}
        placeholder={intl.formatMessage(messages.placeholder)}
        ref={this.inputRef}
        // https://github.com/facebook/draft-js/issues/616#issuecomment-343596615
        // It breaks tab navigation.
        // TODO: Maybe we don't need it anymore. Grammarly is nice to have.
        // Update1: Still required.
        data-enable-grammarly="false"
        style={[
          theme.styles.postTextTextInput,
          theme.typography.fontSizeWithLineHeight(0),
          this.props.disabled === true && theme.styles.stateDisabled,
        ]}
        selection={this.state.selection}
      />
    );
  }
}

export default createFragmentContainer(
  pipe(
    injectIntl,
    withTheme,
    withStore,
    withMutation(SetPostTextMutation),
  )(PostText),
  graphql`
    fragment PostText on Post {
      id
      # Probably bug. text @__clientField correctly sets draftText, but it also
      # makes text field unusable, because it sets it to undefined. Why?
      # Possible workaround is to pass text field from parent explicitly.
      text @__clientField(handle: "draftText")
      draftText
    }
  `,
);
