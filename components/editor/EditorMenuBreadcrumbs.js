// @flow
import * as React from 'react';
import Box from '../Box';
import {
  EditorMenuButton,
  EditorMenuSeparator,
  type SectionName,
} from './EditorMenu';
import type { Web, Path, EditorDispatch } from './Editor';
import { getElementKey } from './EditorElement';
import { pathEqual } from './Editor';

type ChildrenProps = {
  pathChildren: *,
  handleOnPress: *,
  activePath: Path,
};

class Children extends React.Component<ChildrenProps> {
  getChildPath(child) {
    const index = this.props.pathChildren.findIndex(item => item === child);
    return this.props.activePath.concat(index);
  }

  handleChildrenButtonOnPress = child => () => {
    const path = this.getChildPath(child);
    this.props.handleOnPress(path)();
  };

  renderChildren(elementChildren) {
    return elementChildren.map((child, index) => (
      <React.Fragment key={getElementKey(child)}>
        {index !== 0 && <EditorMenuSeparator type="sibling" />}
        <EditorMenuButton onPress={this.handleChildrenButtonOnPress(child)}>
          {child.type}
        </EditorMenuButton>
      </React.Fragment>
    ));
  }

  render() {
    // Only elements, not strings.
    const elementChildren = this.props.pathChildren.filter(
      item => typeof item !== 'string',
    );
    if (elementChildren.length === 0) return null;

    return (
      <React.Fragment>
        <EditorMenuSeparator />
        {this.renderChildren(elementChildren)}
      </React.Fragment>
    );
  }
}

const PathButtons = ({ activePath, elements, dispatch, buttonProps }) => {
  let pathChildren = elements;
  let stringFound = false;
  let buttonPath = [];

  const handleOnPress = path => () =>
    dispatch({ type: 'SET_ACTIVE_PATH', path });

  const buttons = activePath.reduce((buttons, pathIndex, index) => {
    const child = pathChildren[pathIndex];
    // Written like this because of Flow type refinements.
    if (stringFound || typeof child === 'string') {
      stringFound = true;
      return buttons;
    }
    pathChildren = child.props.children;
    const key = getElementKey(child);
    const isLast = index === activePath.length - 1;
    buttonPath = buttonPath.concat(pathIndex);
    const active = buttonProps.active && pathEqual(activePath, buttonPath);
    return [
      ...buttons,
      <React.Fragment key={key}>
        <EditorMenuSeparator />
        <EditorMenuButton
          active={active}
          autoFocus={isLast ? activePath : false}
          onPress={handleOnPress(buttonPath)}
        >
          {child.type}
        </EditorMenuButton>
      </React.Fragment>,
    ];
  }, []);

  return [
    ...buttons,
    <Children
      key="children"
      handleOnPress={handleOnPress}
      pathChildren={pathChildren}
      activePath={activePath}
    />,
  ];
};

type EditorMenuBreadcrumbsProps = {|
  activePath: Path,
  activeSection: SectionName,
  dispatch: EditorDispatch,
  pageName: string,
  web: Web,
  webName: string,
  setActiveSection: *,
|};

const EditorMenuBreadcrumbs = ({
  activePath,
  activeSection,
  dispatch,
  pageName,
  web,
  webName,
  setActiveSection,
}: EditorMenuBreadcrumbsProps) => {
  const buttonProps = section => ({
    active: activeSection === section,
    onPress: () => setActiveSection(section),
  });

  return (
    <Box flexDirection="row" justifyContent="space-between">
      <Box flexDirection="row" flexWrap="wrap">
        <EditorMenuButton autoFocus {...buttonProps('web')}>
          {webName}
        </EditorMenuButton>
        <EditorMenuSeparator />
        <EditorMenuButton {...buttonProps('page')}>{pageName}</EditorMenuButton>
        <PathButtons
          activePath={activePath}
          elements={web.pages[pageName]}
          dispatch={dispatch}
          buttonProps={buttonProps('element')}
        />
      </Box>
      <EditorMenuButton flexDirection="row" {...buttonProps('hamburger')}>
        ☰
      </EditorMenuButton>
    </Box>
  );
};

export default EditorMenuBreadcrumbs;
