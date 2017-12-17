// @flow
import * as React from 'react';
import Box from '../Box';
import { EditorMenuButton, Separator } from './EditorMenu';
import type { Web, Path, EditorDispatch, SectionName } from './Editor';
import { getElementKey } from './EditorElement';
import { pathEqual } from './Editor';

type EditorMenuBreadcrumbsProps = {|
  activePath: Path,
  activeSection: SectionName,
  dispatch: EditorDispatch,
  pageName: string,
  web: Web,
  webName: string,
|};

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
        {index !== 0 && <Separator type="circle" />}
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
        <Separator />
        {this.renderChildren(elementChildren)}
      </React.Fragment>
    );
  }
}

const PathButtons = ({ activePath, elements, dispatch, button }) => {
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
    const active = button.active && pathEqual(activePath, buttonPath);
    return [
      ...buttons,
      <React.Fragment key={key}>
        <Separator />
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

const EditorMenuBreadcrumbs = ({
  activePath,
  activeSection,
  dispatch,
  pageName,
  web,
  webName,
}: EditorMenuBreadcrumbsProps) => {
  const button = section => ({
    active: activeSection === section,
    onPress: () => dispatch({ type: 'SET_ACTIVE_SECTION', section }),
  });

  return (
    <Box flexDirection="row" justifyContent="space-between">
      <Box flexDirection="row" flexWrap="wrap">
        <EditorMenuButton autoFocus {...button('web')}>
          {webName}
        </EditorMenuButton>
        <Separator />
        <EditorMenuButton {...button('page')}>{pageName}</EditorMenuButton>
        <PathButtons
          activePath={activePath}
          elements={web.pages[pageName]}
          dispatch={dispatch}
          button={button('element')}
        />
      </Box>
      <EditorMenuButton flexDirection="row" {...button('hamburger')}>
        ☰
      </EditorMenuButton>
    </Box>
  );
};

export default EditorMenuBreadcrumbs;
