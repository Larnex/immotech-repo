# native-x-stack

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This modules helps you define stacked views in React Native application

## Install

### Yarn

```sh
yarn add native-x-stack
```

### NPM

```sh
npm install native-x-stack
```

## Usage

```tsx
import { Stack } from 'native-x-stack'

function MyComponent() {
  return <Stack fill>
    {...}
  </Stack>
}
```

## API

| Property                                      | Default Value | Usage                                                |
| --------------------------------------------- | ------------- | ---------------------------------------------------- |
| alignLeft?: boolean                           | false         | Align left horizontally                              |
| alignCenter?: boolean                         | false         | Align center horizontally                            |
| alignRight?: boolean                          | false         | Align right horizontally                             |
| alignTop?: boolean                            | false         | Align top vertically                                 |
| alignMiddle?: boolean                         | false         | Align middle vertically                              |
| alignBottom?: boolean                         | false         | Align bottom vertically                              |
| justifyAround?: boolean                       | false         | Justify around items in the stack                    |
| justifyBetween?: boolean                      | false         | Move items towards the corner of the stack           |
| reverse?: boolean                             | false         | Reverse the direction of flex                        |
| stack?: ReactNode[]                           |               | Content of stack                                     |
| horizontal?: boolean                          | false         | Stack items horizontally if true                     |
| fill?: boolean                                | false         | Fill parent container                                |
| fillHorizontal?: boolean                      | false         | Take the width of the container horizontally         |
| wrap?: boolean                                | false         | Wrap content once reached the end of the current row |
| zIndex?: number                               |               | Z-Index ordering                                     |
| width?: number                                |               | Width of the stack                                   |
| height?: number                               |               | Height of the stack                                  |
| minWidth?: number                             |               | Min width of the stack                               |
| minHeight?: number                            |               | Min height of the stack                              |
| maxWidth?: number                             |               | Max width of the stack                               |
| maxHeight?: number                            |               | Max height of the stack                              |
| overflowVisible?: boolean                     | false         | Make content visible beyond content borders          |
| onLayout?: (event: LayoutChangeEvent) => void | false         | Callback handler for layout changes                  |
| style: ViewStyle                              |               | Additional style                                     |

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
