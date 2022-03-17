import isEqual from "lodash.isequal";
import { defineComponent, h, onBeforeUnmount, inject, ref } from "vue";

import mapStateToPropsFactories from "./mapStateToProps";
import { toHandlerKey } from "./utils";

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
    const childProps = children.props || children.childProps;

    return defineComponent({
      name: "Connnect",
      childProps,
      isFunctionnal: typeof children === "function",
      setup(_, { attrs }) {
        let currentStateValue;
        const store = inject("store");
        const props = ref({});
        const initState = initMapStateToProps(store.getState(), attrs);

        const handleStoreUpdate = () => {
          const previousStateValue = currentStateValue;
          const state = store.getState();
          const childPropsArray = Array.isArray(childProps)
            ? childProps
            : Object.keys(childProps);

          currentStateValue = Object.entries(
            initState(
              // not sure about that
              state,
              attrs,
            ) || {},
          ).reduce((acc, [key, value]) => {
            return childPropsArray.includes(key)
              ? { ...acc, [key]: value }
              : acc;
          }, {});

          const actions = mapActionsToProps(store.dispatch, state, attrs) || {};

          if (isEqual(previousStateValue, currentStateValue)) {
            return;
          }

          const actionsListeners = Object.entries(actions).reduce(
            (acc, [key, value]) => {
              return {
                ...acc,
                [toHandlerKey(key)]: value,
              };
            },
            {},
          );

          props.value = {
            ...currentStateValue,
            ...actionsListeners,
          };
        };

        const unsubscribeStore = store.subscribe(handleStoreUpdate);

        onBeforeUnmount(() => {
          unsubscribeStore();
        });

        return () => {
          handleStoreUpdate();

          return h(children, { ...props.value, ...attrs });
        };
      },
    });
  };
}
