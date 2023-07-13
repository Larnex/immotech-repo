# native-x-spinner

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This component adds space between to other components

## Install

### Yarn

```sh
yarn add native-x-spinner
```

### NPM

```sh
npm install native-x-spinner
```

## Usage

```tsx
import { Spinner } from 'native-x-spinner'

function MyComponent() {
  return (
    <Stack>
      ...
      <Spinner />
      ...
    </Stack>
  )
}
```

## API

| Property            | Default Value   | Usage                                                          |
| ------------------- | --------------- | -------------------------------------------------------------- |
| animating?: boolean | true            | Animate the spinner                                            |
| color?: string      | COLOR.SECONDARY | Color of spinner                                               |
| size?: string       | 'normal'        | Valid values: 'x-small', 'small', 'normal', 'large', 'x-large' |

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
