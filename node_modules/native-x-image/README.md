# native-x-image

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Wrap this component around another component to enable user interaction

## Install

### Yarn

```sh
yarn add native-x-image
```

### NPM

```sh
npm install native-x-image
```

Note: This module uses react-native-fast-image internally. Make sure you have it configured.

See: [`react-native-fast-image`](https://github.com/DylanVann/react-native-fast-image#usage)

## Usage

```tsx
import { Image } from 'native-x-image'

function MyComponent() {
  const onTap = () => {
    // handle action
  }
  return <Image source={{ uri: 'https://' }} />
}

// or with local

function MyComponent({ user }: { user: User }) {
  const onTapUser = (user: User) => {
    // handle action
  }
  return <Image source={require('./local-image.png')} />
}
```

## API

| Property               | Default Value | Usage                                         |
| ---------------------- | ------------- | --------------------------------------------- |
| source: Source         |               | Image to show                                 |
| fill?: boolean         | false         | Fill width of the container                   |
| width?: number         |               | Width of the image                            |
| height?: number        |               | Height of the image                           |
| resizeMode: ResizeMode | 'fill'        | Valid values: contain, cover, stretch, center |
| fallbackSource: Source |               | Image to show when the image is not available |

And all properties from:

- [`react-native-fast-image`](https://github.com/DylanVann/react-native-fast-image#properties)

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
