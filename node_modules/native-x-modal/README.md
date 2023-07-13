# native-x-modal

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This component adds space between to other components

## Install

### Yarn

```sh
yarn add native-x-modal
```

### NPM

```sh
npm install native-x-modal
```

## Usage

```tsx
import { Modal } from 'native-x-modal'

function MyComponent() {
  const [visible, setVisible] = React.useState(false)
  return (
    <Modal visible={visible} onClose={() => setVisible(false)}>
      ...
    </Modal>
  )
}
```

## API

| Property             | Default Value | Usage              |
| -------------------- | ------------- | ------------------ |
| children?: string    |               | Content            |
| visible?: boolean    |               | Show modal         |
| showClose?: boolean  |               | Show close button  |
| width?: number       |               | Width of the modal |
| onClose?: () => void |               | On close modal     |

## Confirmation Modal

```tsx
import { ConfirmationModal } from 'native-x-modal'

function MyComponent() {
  const [visible, setVisible] = React.useState(false)
  return (
    <ConfirmationModal
      visible={visible}
      onOk={onOkFn}
      onCancel={onCancelFn}
      okText='OK'
      cancelText='Cancel'
      onClose={() => setVisible(false)}>
      ...
    </Modal>
  )
}
```

| Property                             | Default Value | Usage                             |
| ------------------------------------ | ------------- | --------------------------------- |
| children?: string                    |               | Content                           |
| visible?: boolean                    |               | Show modal                        |
| showClose?: boolean                  |               | Show close button                 |
| width?: number                       |               | Width of the modal                |
| onClose?: () => void                 |               | On close modal                    |
| onOk?: () => void                    |               | On click on ok button             |
| onCancel?: () => void                |               | On click on cancel button         |
| okText?: string                      | OK            | Label of ok button                |
| okButtonBackgroundColor?: string     |               | Background color of ok button     |
| okTextColor?: string                 |               | Text color of ok button           |
| cancelText?: string                  | Cancel        | Label of cancel button            |
| cancelButtonBackgroundColor?: string |               | Background color of cancel button |
| cancelTextColor?: string             |               | Text color of cancel button       |

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
