import isEqual from "lodash.isequal";
import { defineComponent, h, onBeforeUnmount, inject, reactive } from "vue";

import mapStateToPropsFactories from "./mapStateToProps";

const match = (arg, factories, name) => {
  for (let i = factories.length - 1; i >= 0; i -= 1) {
    const result = factories[i](arg);

    if (result) {
      return result;
    }
  }

  return (dispatch, options) => {
    throw new Error(
      `Invalid value of type ${typeof arg} for ${name} argument when connecting component ${
        options.wrappedComponentName
      }.`,
    );
  };
};

/**
 * @param mapStateToProps
 * @param mapActionsToProps
 * @returns Object
 */
export default function connect(mapStateToProps, mapActionsToProps) {
  const initMapStateToProps = match(
    mapStateToProps,
    mapStateToPropsFactories,
    "mapStateToProps",
  );

  return (children) => {
    return defineComponent({
      name: "Connnect",
      setup(_, { attrs }) {
        let currentStateValue;
        const store = inject("store");
        const props = reactive({});
        const initState = initMapStateToProps(store.getState(), attrs);

        const handleStoreUpdate = () => {
          const previousStateValue = currentStateValue;
          const state = store.getState();

          currentStateValue =
            initState(
              // not sure about that
              state,
              attrs,
            ) || {};
          const actions = mapActionsToProps(store.dispatch, state, attrs) || {};

          const actionNames = Object.keys(actions);
          const stateNames = Object.keys(currentStateValue);

          if (isEqual(previousStateValue, currentStateValue)) {
            return;
          }

          for (let i = 0; i < actionNames.length; i += 1) {
            props[actionNames[i]] = actions[actionNames[i]];
          }

          for (let i = 0; i < stateNames.length; i += 1) {
            props[stateNames[i]] = currentStateValue[stateNames[i]];
          }
        };

        const unsubscribeStore = store.subscribe(handleStoreUpdate);

        onBeforeUnmount(() => {
          unsubscribeStore();
        });

        return () => {
          handleStoreUpdate();

          return h(children, { ...props, ...attrs });
        };
      },
    });
  };
}
