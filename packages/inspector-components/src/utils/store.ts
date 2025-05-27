import {
  createStore as solidCreateStore,
  produce,
  type StoreSetter,
} from 'solid-js/store';

export interface Store<State> {
  state: State;
  set: (partialState: Partial<State>) => void;
  update: (fn: (state: State) => void) => void;
}

type StateSetter<State> = (
  setter: ((state: State) => Partial<State>) | Partial<State>
) => void;
type StateGetter<State> = () => State;
type StateMutate<State> = (mutator: (state: State) => void) => void;

type StateCreator<State> = (params: {
  set: StateSetter<State>;
  get: StateGetter<State>;
  update: StateMutate<State>;
}) => State;

type PureObject = Record<string, any>;

/**
 * create a Zustand similar store
 */
export const createStore = <State extends PureObject>(
  initializer: State | StateCreator<State>
): State => {
  let _setState: StateSetter<State>;
  let _getState: StateGetter<State>;
  let _updateState: StateMutate<State>;

  const setState: StateSetter<State> = (setter) => {
    return _setState(setter);
  };

  const getState: StateGetter<State> = () => {
    return _getState();
  };

  const updateState: StateMutate<State> = (mutator) => {
    return _updateState(mutator);
  };

  const [store, setStore] = solidCreateStore<State>(
    typeof initializer === 'function'
      ? initializer({
          set: setState,
          get: getState,
          update: updateState,
        })
      : initializer
  );

  _setState = (setter) => {
    setStore(((state: State) =>
      typeof setter === 'function'
        ? setter(state)
        : setter) as any as StoreSetter<State, []>);
  };

  _getState = () => {
    return store;
  };

  _updateState = (mutator) => {
    setStore(produce(mutator));
  };

  return store;
};
