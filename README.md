# Application State Store

Store is a lightweight and flexible state management library for JavaScript applications, designed with compatibility in mind for Lego and other libraries/frameworks. It provides a simple and intuitive API to manage application state and facilitate communication between components.

A store is like a state for an entire app. Meaning that it holds the key/values
that are shared among the components of an app.

It is as **light** as **0.4Kb** 🪶

## Features

- Centralized store to manage application state
- Subscription-based model to listen for state changes
- Support for custom actions and mutations
- Compatibility with Lego and other libraries/frameworks

## Installating The Store

## Usage For a Lego App

It's an abstract class that you should implement:

_/my/custom/store.js_

```javascript
import { LegoStore } from './your/path/to-the/store.min.js'


const store = new LegoStore(
  // Describe the state of the store with defaults
  {
    user: { firstname: '', lastname: '' },
    isAuthenticated: false,
  },

  // Describe the actions
  {
    signIn(username, password) {
      if(username && password) {
        this.setState({ user: { firstname: 'John', lastname: 'Doe' }, isAuthenticated: true })
      }
    }
  }
)

// export the instance that will be shared across all your components
export default store
```

Now you can connect your Lego components to the store:

_/bricks/user-profile.html_

```html
<script>
  import store from '/my/custom/store.js'

  function setup() {
    store.subscribe(this, ['user', 'isAuthenticated'])
  }

  function mySignInMethod() {
    store.actions.signIn('John', 'safesecretcode')
  }
</script>

<template>
  <p :if="state.isAuthenticated">Welcome ${state.user.firstname}</p>

  <button :if="!state.isAuthenticated" @click="mySignInMethod">Sign in</button>
</template>
```

## Usage For Non-Lego Apps

```javascript
import { AbstractStore } from './your/path/to-the/store.min.js'

class MyStore extends AbstractStore {
  notifyCall(target, props) {
    // implement here what should happen to "target" when a change occurs with the "props".
  }
}

const store = new MyStore(
  // Describe the state of the store with defaults
  {
    user: { firstname: '', lastname: '' },
    isAuthenticated: false,
  },

  // Describe the actions
  {
    signIn(username, password) {
      if(username && password) {
        this.setState({ user: { firstname: 'John', lastname: 'Doe' }, isAuthenticated: true })
      }
    }
  }
)

export default store
```

You can now import that `store` and use it specifically to your needs.

## Usage

### Subscribing to State Changes

Components can subscribe to state changes by providing a render method that will be called whenever the state updates. Use the subscribe method to subscribe a component to the store:

```
store.subscribe(component, props)
```

- `component`: The component instance subscribing to the store.
- `props`: An array or object specifying the properties of the state that the component is interested in. Only these properties will be passed to the render method of the component when the state updates.

Example: `store.subscribe(this, ['user', 'currentItem'])` will notify `this` of the changes when the state change with the `user` and `currentItem` properties.

### Updating the State

To update the state, use the setState method:

```
store.setState(newState)
```

- `newState`: An object containing the updated state properties. The new state will be merged with the existing state, triggering the notification of subscribers.

Example: `store.setState({ user: { username: 'johndoe', password: 'secretpassword' }, currentItem: 'profile' })`

### Defining Custom Actions

You can define custom actions to perform specific operations or mutations on the state. Use the addAction method to register an action:

```
store.addAction(name, fn)
```

- `name`: A unique name for the action.
- `fn`: The action function to be invoked when the action is dispatched. The function has access to the store's state and methods for performing mutations or operations.

Example: `store.addAction('signIn', function(username, password) { … }`

### Dispatching Actions

To dispatch an action, use the dispatch method:

```
store.dispatch(actionName, ...payload)
```

- `actionName`: The name of the action to dispatch.
- `payload`: Optional data to be passed to the action function.

Example for a `signIn` action with 2 username and password attributes: `store.dispatch('signIn', 'johndoe', 'mysecretpassword')`

`dispatch` is implemented for confirmity with other Redux-like stores but calling an action can be done directly (see below).

### Calling an Action

Dispatching or calling an action behave the same way.
With the previous example you can also call a `signIn` action this way:

```
store.actions.signIn(username, password)
```

## Compatibility

This Store is designed to be compatible with Lego (https://lego.js.org) and other libraries/frameworks. Its lightweight nature and flexible API make it adaptable to different project requirements.
