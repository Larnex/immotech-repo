# native-x-tappable

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Wrap this component around another component to enable user interaction

## Install

### Yarn

```sh
yarn add native-x-tappable
```

### NPM

```sh
npm install native-x-tappable
```

## Usage

```tsx
import { Tappable } from 'native-x-tappable'

function MyComponent() {
  const onTap = () => {
    // handle action
  }
  return <Tappable onTap={onTap}>
    {...}
  </Tappable>
}

// or with data

function MyComponent({ user }: { user: User}) {
  const onTapUser = (user: User) => {
    // handle action
  }
  return <Tappable data={user} onTap={onTapUser}>
    {...}
  </Tappable>
}
```

## API

| Property                     | Default Value | Usage                                                  |
| ---------------------------- | ------------- | ------------------------------------------------------ |
| disable?: boolean            | false         | Prevents all user interaction while this value is true |
| feedback?: boolean           | false         | Show a visible feedback                                |
| style: ViewStyle             |               | Additional style                                       |
| children: ReactNode/[]       |               | Content                                                |
| onTap: (data: TData) => void |               | Action handler for user interaction                    |
| data: TData                  | undefined     | Optional data                                          |

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
