class AbstractStore {
  actions = {}
  #state = {}

  constructor(state = {}, actions = {}) {
    this.#state = state;
    Object.keys(actions).map((name) => this.addAction(name, actions[name]));
    this.subscribers = [];
  }

  addAction(name, fn) {
    this.actions[name] = fn.bind(this);
  }

  subscribe(subscriber, props = []) {
    this.subscribers.push({
      target: subscriber,
      props: this.propsNames(props),
    });
  }

  get state() {
    return this.#state
  }

  setState(newState) {
    this.#state = { ...this.#state, ...newState };
    this.notify();
  }

  getSelectedState(props = []) {
    return props.reduce((selectedState, prop) => {
      if (prop in this.#state) {
        selectedState[prop] = this.#state[prop];
      }
      return selectedState
    }, {})
  }

  propsNames(props) {
    return Array.isArray(props) ? props : Object.keys(props)
  }

  notify() {
    this.subscribers.forEach(({ target, props }) => {
      this.notifyCall(target, this.getSelectedState(props));
      target.render(this.getSelectedState(props));
    });
  }

  /**
   * This method is specific to your project and should be overridden.
   * @param {*} target object that has the method to be called.
   * @param Array props list of state properties to send.
   */
  notifyCall(target, props) {
    throw new Error("notifyCall() is not implemented!")
  }

  dispatch(actionName, ...payload) {
    const action = this.actions[actionName];
    if (!action) throw new Error(`action "${actionName}" does not exist!`)
    action(...payload);
  }
}

class LegoStore extends AbstractStore {
  subscribe(subscriber, props = []) {
    super.subscribe(subscriber, props);
    subscriber.setState(this.getSelectedState(this.propsNames(props)));
  }
  notifyCall(target, props) {
    target.render(props);
  }
}

export { AbstractStore, LegoStore };
