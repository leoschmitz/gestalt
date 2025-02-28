// @flow strict
import {
  Fragment,
  forwardRef,
  useImperativeHandle,
  useRef,
  type Node,
  type AbstractComponent,
} from 'react';
import classnames from 'classnames';
import { type AbstractEventHandler } from './AbstractEventHandler.js';
import { useColorScheme } from './contexts/ColorSchemeProvider.js';
import { useDefaultLabelContext } from './contexts/DefaultLabelProvider.js';
import Flex from './Flex.js';
import focusStyles from './Focus.css';
import Icon, { type IconColor } from './Icon.js';
import icons from './icons/index.js';
import InternalLink from './InternalLink.js';
import NewTabAccessibilityLabel, { getAriaLabel } from './NewTabAccessibilityLabel.js';
import styles from './Button.css';
import Text from './Text.js';
import touchableStyles from './TapArea.css';
import useFocusVisible from './useFocusVisible.js';
import useTapFeedback from './useTapFeedback.js';

const DEFAULT_TEXT_COLORS = {
  blue: 'inverse',
  gray: 'default',
  red: 'inverse',
  transparent: 'default',
  semiTransparentWhite: 'default',
  transparentWhiteText: 'inverse',
  white: 'default',
};

const SIZE_NAME_TO_PIXEL = {
  sm: 10,
  md: 12,
  lg: 12,
};

type Target = null | 'self' | 'blank';

type BaseButton = {|
  accessibilityLabel?: string,
  color?:
    | 'gray'
    | 'red'
    | 'blue'
    | 'transparent'
    | 'semiTransparentWhite'
    | 'transparentWhiteText'
    | 'white',
  dataTestId?: string,
  disabled?: boolean,
  iconEnd?: $Keys<typeof icons>,
  fullWidth?: boolean,
  name?: string,
  onClick?: AbstractEventHandler<
    | SyntheticMouseEvent<HTMLButtonElement>
    | SyntheticMouseEvent<HTMLAnchorElement>
    | SyntheticKeyboardEvent<HTMLAnchorElement>
    | SyntheticKeyboardEvent<HTMLButtonElement>,
    {| dangerouslyDisableOnNavigation: () => void |},
  >,
  tabIndex?: -1 | 0,
  size?: 'sm' | 'md' | 'lg',
  text: string,
|};

type ButtonType = {|
  ...BaseButton,
  accessibilityControls?: string,
  accessibilityExpanded?: boolean,
  accessibilityHaspopup?: boolean,
  selected?: boolean,
  type?: 'button',
  role?: 'button',
|};

type SubmitButtonType = {|
  ...BaseButton,
  type: 'submit',
  role?: 'button',
|};

type LinkButtonType = {|
  ...BaseButton,
  href: string,
  rel?: 'none' | 'nofollow',
  role: 'link',
  target?: Target,
|};

type unionProps = ButtonType | SubmitButtonType | LinkButtonType;

type unionRefs = HTMLButtonElement | HTMLAnchorElement;

function InternalButtonContent({
  target,
  text,
  textColor,
  icon,
  size,
}: {|
  target?: Target,
  text: Node,
  textColor: IconColor,
  icon?: $Keys<typeof icons>,
  size: string,
|}): Node {
  return (
    <Fragment>
      <Flex alignItems="center" gap={{ row: 2, column: 0 }} justifyContent="center">
        {text}
        {icon ? (
          <Icon
            accessibilityLabel=""
            color={textColor}
            icon={icon}
            size={SIZE_NAME_TO_PIXEL[size]}
          />
        ) : null}
      </Flex>
      <NewTabAccessibilityLabel target={target} />
    </Fragment>
  );
}

/**
 * [Buttons](https://gestalt.pinterest.systems/web/button) allow users to perform actions within a surface. They can be used alone for immediate action, or as a trigger for another component, like [Dropdown](https://gestalt.pinterest.systems/web/dropdown) or [Popover](https://gestalt.pinterest.systems/web/popover).
 *
 * ![Button light mode](https://raw.githubusercontent.com/pinterest/gestalt/master/playwright/visual-test/Button.spec.mjs-snapshots/Button-chromium-darwin.png)
 * ![Button dark mode](https://raw.githubusercontent.com/pinterest/gestalt/master/playwright/visual-test/Button-dark.spec.mjs-snapshots/Button-dark-chromium-darwin.png)
 *
 */
const ButtonWithForwardRef: AbstractComponent<unionProps, unionRefs> = forwardRef<
  unionProps,
  unionRefs,
>(function Button(props: unionProps, ref): Node {
  const {
    accessibilityLabel,
    color = 'gray',
    dataTestId,
    disabled = false,
    fullWidth = false,
    iconEnd,
    onClick,
    tabIndex = 0,
    selected = false,
    size = 'md',
    text,
  } = props;

  const innerRef = useRef(null);
  // When using both forwardRef and innerRef, React.useimperativehandle() allows a parent component
  // that renders <Button ref={inputRef} /> to call inputRef.current.focus()
  useImperativeHandle(ref, () => innerRef.current);

  const {
    compressStyle,
    isTapping,
    handleBlur,
    handleMouseDown,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchCancel,
    handleTouchEnd,
  } = useTapFeedback({
    height: innerRef?.current?.clientHeight,
    width: innerRef?.current?.clientWidth,
  });

  const { accessibilityNewTabLabel } = useDefaultLabelContext('Link');

  const { name: colorSchemeName } = useColorScheme();
  // We need to make a few exceptions for accessibility reasons in darkMode for red buttons
  const isDarkMode = colorSchemeName === 'darkMode';
  const isDarkModeRed = isDarkMode && color === 'red';
  const isDarkModeBlue = isDarkMode && color === 'blue';

  let colorClass = color === 'transparentWhiteText' ? 'transparent' : color;

  if (isDarkModeRed) {
    colorClass = 'darkModeRed';
  }

  const { isFocusVisible } = useFocusVisible();

  const sharedTypeClasses = classnames(styles.button, focusStyles.hideOutline, {
    [styles.inline]: props.role !== 'link' && !fullWidth,
    [styles.block]: props.role !== 'link' && fullWidth,
    [focusStyles.accessibilityOutline]: !disabled && isFocusVisible,
  });

  const baseTypeClasses = classnames(sharedTypeClasses, touchableStyles.tapTransition, {
    [styles.sm]: size === 'sm',
    [styles.md]: size === 'md',
    [styles.lg]: size === 'lg',
    [styles[colorClass]]: !disabled && !selected,
    [styles.selected]: !disabled && selected,
    [styles.disabled]: disabled,
    [styles.enabled]: !disabled,
    [touchableStyles.tapCompress]: props.role !== 'link' && !disabled && isTapping,
  });

  const parentButtonClasses = classnames(sharedTypeClasses, styles.parentButton);

  const childrenDivClasses = classnames(baseTypeClasses, styles.childrenDiv);

  const textColor =
    (disabled && 'subtle') ||
    (selected && 'inverse') ||
    ((isDarkModeRed || isDarkModeBlue) && 'default') ||
    DEFAULT_TEXT_COLORS[color];

  const buttonText = (
    <Text align="center" color={textColor} overflow="normal" weight="bold">
      {text}
    </Text>
  );

  const handleClick = (event, dangerouslyDisableOnNavigation) =>
    onClick
      ? onClick({
          event,
          dangerouslyDisableOnNavigation: dangerouslyDisableOnNavigation ?? (() => {}),
        })
      : undefined;

  const handleLinkClick = ({ event, dangerouslyDisableOnNavigation }) =>
    handleClick(event, dangerouslyDisableOnNavigation);

  if (props.role === 'link') {
    const { href, rel = 'none', target = null } = props;

    const ariaLabel = getAriaLabel({ target, accessibilityLabel, accessibilityNewTabLabel });

    return (
      <InternalLink
        accessibilityLabel={ariaLabel}
        colorClass={colorClass}
        dataTestId={dataTestId}
        disabled={disabled}
        fullWidth={fullWidth}
        href={href}
        onClick={handleLinkClick}
        ref={innerRef}
        rel={rel}
        tabIndex={tabIndex}
        selected={selected}
        size={size}
        target={target}
        wrappedComponent="button"
      >
        <InternalButtonContent
          target={target}
          text={buttonText}
          textColor={textColor}
          icon={iconEnd}
          size={size}
        />
      </InternalLink>
    );
  }

  if (props.type === 'submit') {
    const { name } = props;

    return (
      <button
        aria-label={accessibilityLabel}
        className={baseTypeClasses}
        data-test-id={dataTestId}
        disabled={disabled}
        name={name}
        onBlur={handleBlur}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchCancel={handleTouchCancel}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        ref={innerRef}
        style={compressStyle || undefined}
        tabIndex={disabled ? null : tabIndex}
        type="submit"
      >
        <InternalButtonContent text={buttonText} textColor={textColor} icon={iconEnd} size={size} />
      </button>
    );
  }

  const { accessibilityControls, accessibilityExpanded, accessibilityHaspopup, name } = props;

  return (
    <button
      aria-controls={accessibilityControls}
      aria-expanded={accessibilityExpanded}
      aria-haspopup={accessibilityHaspopup}
      aria-label={accessibilityLabel}
      className={parentButtonClasses}
      data-test-id={dataTestId}
      disabled={disabled}
      name={name}
      onBlur={handleBlur}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchCancel={handleTouchCancel}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      ref={innerRef}
      tabIndex={disabled ? null : tabIndex}
      type="button"
    >
      <div className={childrenDivClasses} style={compressStyle || undefined}>
        {iconEnd ? (
          <InternalButtonContent
            text={buttonText}
            textColor={textColor}
            icon={iconEnd}
            size={size}
          />
        ) : (
          buttonText
        )}
      </div>
    </button>
  );
});

ButtonWithForwardRef.displayName = 'Button';

export default ButtonWithForwardRef;
