# native-x-text

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This component adds space between to other components

## Install

### Yarn

```sh
yarn add native-x-text
```

### NPM

```sh
npm install native-x-text
```

## Usage

```tsx
import { Text } from 'native-x-text'

function MyComponent() {
  return (
    <Stack>
      ...
      <Text fontSize='xx-large' bold>
        Header 1
      </Text>
      <Text fontSize='x-large' bold>
        Header 2
      </Text>
      <Text fontSize='large' bold>
        Header 3
      </Text>
      <Text>Body Text</Text>
      <Text fontSize='small'>Secondary Text</Text>
      <Text fontSize='x-small'>Caption</Text>
      <Text fontSize='xx-small'>Footer</Text>
      ...
    </Stack>
  )
}
```

## Style Inheritance

```tsx
<Text semiBold fontSize={'x-small'} textColor={COLOR.ERROR}>
  Hello, <Text bold>world!</Text>
</Text>
```

The text "world!" will inherit all properties of the parent "Hello,"

## API

| Property               | Default Value | Usage                                                                      |
| ---------------------- | ------------- | -------------------------------------------------------------------------- |
| fill?: boolean         | false         | Fill container or available space                                          |
| bold?: boolean         | false         | Show text in bold                                                          |
| semiBold?: boolean     | false         | Show text in semi-bold (works only if bold is set to false)                |
| thin?: boolean         | false         | Show text in think font (works only if bold and semiBold are set to false) |
| italic?: boolean       | false         | Show text in italic                                                        |
| alignLeft?: boolean    | false         | Align left                                                                 |
| alignCenter?: boolean  | false         | Align center                                                               |
| alignRight?: boolean   | false         | Align right                                                                |
| children?: string      |               | Content                                                                    |
| upperCase?: boolean    | false         | Show content in upper case                                                 |
| style?: TextStyle      |               | Additional style                                                           |
| numberOfLines?: number |               | Total number of lines to show                                              |
| onPress?: () => void   |               | Callback on tap                                                            |

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
