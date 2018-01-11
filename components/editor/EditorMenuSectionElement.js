// @flow
import * as React from 'react';
import { EditorMenuSection, EditorMenuButton } from './EditorMenu';
import type { Path, EditorDispatch } from './Editor';

type Props = {|
  activePath: Path,
  dispatch: EditorDispatch,
|};

class EditorMenuSectionElement extends React.PureComponent<Props> {
  handleDeletePress = () => {
    this.props.dispatch({ type: 'DELETE_PATH', path: this.props.activePath });
  };

  render() {
    return (
      <EditorMenuSection>
        {/* <EditorMenuButton>style</EditorMenuButton> */}
        {/* <EditorMenuButton>clone</EditorMenuButton> */}
        {/* <EditorMenuButton>unwrap?</EditorMenuButton> */}
        <EditorMenuButton onPress={this.handleDeletePress}>
          delete
        </EditorMenuButton>
        <EditorMenuButton section="add">add</EditorMenuButton>
      </EditorMenuSection>
    );
  }
}

export default EditorMenuSectionElement;
