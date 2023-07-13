# native-x-theme

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This modules helps you define the theme for all `native-x` components.

## Install

### Yarn

```sh
yarn add native-x-theme
```

### NPM

```sh
npm install native-x-theme
```

## Usage

```tsx
import { COLOR, THEME, ThemeProvider } from '@native-x/theme'

export const THEMES = {
  [THEME.LIGHT]: {
    [COLOR.PRIMARY]: '#FFFFFF',
    [COLOR.SECONDARY]: '#212121',
    [COLOR.TERTIARY]: '#707070',
    [COLOR.ACCENT]: '#0AD572',
    [COLOR.DIVIDER]: '#BDBDBD',
    [COLOR.DISABLED]: '#F5F5F5',
    [COLOR.INPUT]: '#F5F5F5',
    [COLOR.SUCCESS]: '#63D471',
    [COLOR.ERROR]: '#ED2733',
    [COLOR.WARNING]: '#F9D101',
    [COLOR.TRANSPARENT]: 'transparent',
  },
  [THEME.DARK]: {
    [COLOR.PRIMARY]: '#212121',
    [COLOR.SECONDARY]: '#FFFFFF',
    [COLOR.TERTIARY]: '#F3E8C0',
    [COLOR.ACCENT]: '#71F28F',
    [COLOR.DIVIDER]: '#707070',
    [COLOR.DISABLED]: '#252525',
    [COLOR.INPUT]: '#F5F5F5',
    [COLOR.SUCCESS]: '#63D471',
    [COLOR.ERROR]: '#ED2733',
    [COLOR.WARNING]: '#F9D101',
    [COLOR.TRANSPARENT]: 'transparent',
  },
}

function App() {
  return <ThemeProvider theme={'dark'} themes={themes}>
    {...}
  </ThemeProvider>
}
```

### `useTheme()`

```tsx
function MyComponent() {
  const {
    // current theme
    currentTheme,

    // name of the current theme
    themeName,

    // all the declared themes by name
    themes,

    // get a color by name `getColor(name: string, theme?: string)`
    getColor,

    // get text color by name `getTextColor(name: string, theme?: string)`
    getTextColor,

    // get background color by name `getBackgroundColor(name: string, theme?: string)`
    getBackgroundColor,

    // get border color by name `getBorderColor(name: string, side?: BorderSide, theme?: string)
    getBorderColor,
  } = useTheme()

  const accentBackgroundStyle = getBackgroundColor(COLOR.ACCENT)

  return <View style={accentBackgroundStyle}>
    {...}
  </View>
}
```

### `useContainerStyle()`

```tsx
import { ContainerStyleProps, useContainerStyle } from '@native-x/theme'

interface Props extends ContainerStyleProps {
  ...
}

function MyComponent({
  backgroundColor,
  border,
  borderBottomColor,
  borderColor,
  borderLeftColor,
  borderRadius,
  borderRightColor,
  borderTopColor,
  opacity,
  padding,
}: Props) {
  const style = useContainerStyle({
    backgroundColor,
    border,
    borderBottomColor,
    borderColor,
    borderLeftColor,
    borderRadius,
    borderRightColor,
    borderTopColor,
    opacity,
    padding,
  })
  return <View style={style}>
    {...}
  </View>
}
```

You can also extend specific style types:

```tsx
interface Props extends BackgroundColorStyleProps,
  BorderColorStyleProps,
  BorderSizeStyleProps,
  OpacityStyleProps,
  ShadowStyleProps,
  PaddingStyleProps {
  ...
}
```

### `useTextStyle()`

```tsx
import { TextStyleProps, useTextStyle } from '@native-x/theme'

interface Props extends TextStyleProps {
  ...
}

function MyComponent({ fontSize, lineHeight, textColor }: Props) {
  const style = useTextStyle({ fontSize, lineHeight, textColor })
  return <Text style={style}>{...}</Text>
}
```

Or use individual styles as below

```tsx
interface Props extends FontSizeStyleProps,
  LineHeightStyleProps,
  TextColorStyleProps {
  ...
}
```

### `useShadowStyle()`

```tsx
import { ShadowProps, useShadowStyle } from '@native-x/theme'

interface Props extends ShadowProps {}

function MyComponent({ shadow, shadowColor }: Props) {
  const style = useShadowStyle({ shadow, shadowColor })
  return <Text style={style}>{...}</Text>
}
```

### `autoSwitchTheme`

`ThemeProvider` will automatically switch between `dark` and `light` theme depending on system
appearance. By default this value is set to `false`. Auto theme switching won't work if you don't
have themes by name `dark` (THEME.DARK) and `light` (THEME.LIGHT).

### `autoSwitchStatusBar`

`ThemeProvider` will automatically switch status bar content to `dark-content` or `light-content`
depending on system appearance. By default this value is set to `false` and works only when both
`autoSwitchStatusBar` and `autoSwitchTheme` is set to true.

## Automatic Release

Here is an example of the release type that will be done based on a commit messages:

| Commit message      | Release type          |
| ------------------- | --------------------- |
| fix: [comment]      | Patch Release         |
| feat: [comment]     | Minor Feature Release |
| perf: [comment]     | Major Feature Release |
| doc: [comment]      | No Release            |
| refactor: [comment] | No Release            |
| chore: [comment]    | No Release            |
