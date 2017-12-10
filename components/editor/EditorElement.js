// @flow
import * as React from 'react';
import EditorElementBox from './EditorElementBox';
import EditorElementText from './EditorElementText';
import type { EditorDispatch, Element, Path, Theme } from './Editor';
import Color from 'color';
import arrayEqual from 'array-equal';
import { activeElementProp } from './Editor';

type EditorElementProps = {|
  element: Element,
  theme: Theme,
  path: Path,
  dispatch: EditorDispatch,
  parents: Array<Element>,
  activePath: Path,
|};

type EditorElementState = {|
  flashAnimationShown: boolean,
  flashAnimationColor: string,
|};

// React key prop has to be unique string. No cheating. But for arbitrary JSON,
// we don't have any unique id and JSON.stringify is too slow.
// Fortunately, we use immutable data, so we can leverage WeakMap.
export const getElementKey = (() => {
  const map = new WeakMap();
  let idx = 0;
  return (element: Element): string => {
    const maybeValue = map.get(element);
    if (typeof maybeValue === 'string') return maybeValue;
    const value = (idx++).toString();
    map.set(element, value);
    return value;
  };
})();

const getInheritedBackgroundColor = (elements, themeBackgroundColor) => {
  for (const { props } of elements.reverse()) {
    if (props.style && props.style.backgroundColor)
      return props.style.backgroundColor;
  }
  return themeBackgroundColor;
};

const FlashAnimation = ({ color, onEnd }) => (
  <div onAnimationEnd={onEnd}>
    <style jsx>{`
      @keyframes activated {
        0% {
          opacity: 0.5;
        }
        100% {
          opacity: 0;
        }
      }
      div {
        position: absolute;
        z-index: 2147483647; /* max */
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        background-color: ${color};
        animation: activated 0.5s;
      }
    `}</style>
  </div>
);

// TODO: | 'TextInput' | 'Button',
const EditorElements = {
  Box: EditorElementBox,
  Text: EditorElementText,
};

export type ElementType = $Keys<typeof EditorElements>;

class EditorElement extends React.Component<
  EditorElementProps,
  EditorElementState,
> {
  constructor(props: EditorElementProps) {
    super(props);
    this.state = {
      flashAnimationShown: false,
      flashAnimationColor: props.theme.colors.background,
    };
  }

  componentWillReceiveProps(nextProps: EditorElementProps) {
    const isGoingToBeActive =
      !arrayEqual(nextProps.activePath, this.props.activePath) &&
      arrayEqual(nextProps.activePath, this.props.path);
    if (isGoingToBeActive) this.runFlashAnimation();
  }

  shouldComponentUpdate(
    nextProps: EditorElementProps,
    nextState: EditorElementState,
  ) {
    const shouldUpdate =
      nextProps.element !== this.props.element ||
      nextProps.theme !== this.props.theme ||
      nextState.flashAnimationShown !== this.state.flashAnimationShown ||
      nextState.flashAnimationColor !== this.state.flashAnimationColor ||
      !arrayEqual(nextProps.activePath, this.props.activePath);
    return shouldUpdate;
  }

  runFlashAnimation() {
    const backgroundColor = getInheritedBackgroundColor(
      [...this.props.parents, this.props.element],
      this.props.theme.colors.background,
    );
    this.setState({
      flashAnimationShown: true,
      // Wow. I didn't know I can use CSS filter effects grayscale and invert.
      // But keep current JS approach. I will reuse it for React Native.
      flashAnimationColor: Color(backgroundColor)
        .grayscale()
        .negate(),
    });
  }

  isActive() {
    return arrayEqual(this.props.path, this.props.activePath);
  }

  handleClick = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.isActive()) this.runFlashAnimation();
    this.props.dispatch({ type: 'SET_ACTIVE_PATH', path: this.props.path });
  };

  handleFlashAnimationEnd = () => {
    this.setState({ flashAnimationShown: false });
  };

  render() {
    const { theme, element, path, dispatch, parents, activePath } = this.props;
    const Component = EditorElements[element.type];
    if (!Component) return null;

    const componentProps = {
      style: element.props.style,
      theme,
      onClick: this.handleClick,
      ...(this.isActive() ? { [activeElementProp]: true } : null),
    };

    const componentChildren = element.props.children.map((child, i) => {
      if (typeof child === 'string') return child;
      return (
        <EditorElement
          key={getElementKey(child)}
          element={child}
          theme={theme}
          path={path.concat(i)}
          dispatch={dispatch}
          parents={parents.concat(element)}
          activePath={activePath}
        />
      );
    });

    return (
      <Component {...componentProps}>
        {componentChildren}
        {this.state.flashAnimationShown && (
          <FlashAnimation
            color={this.state.flashAnimationColor}
            onEnd={this.handleFlashAnimationEnd}
          />
        )}
      </Component>
    );
  }
}

export default EditorElement;
