import isEqual from "lodash.isequal";
import { defineComponent, h, onBeforeUnmount, inject, ref } from "vue";

import mapDispatchToPropsFactories from "./mapDispatchToProps";
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
export default function connect(ownMapStateToProps, ownMapDispatchToProps) {
  const initMapStateToProps = match(
    ownMapStateToProps,
    mapStateToPropsFactories,
    "mapStateToProps",
  );

  const initMapDispatchToProps = match(
    ownMapDispatchToProps,
    mapDispatchToPropsFactories,
    "mapDispatchToProps",
  );

  return (children) => {
    const childProps = children.props || children.childProps;

    return defineComponent({
      name: "Connnect",
      childProps,
      setup(_, { attrs }) {
        let currentStateValue;
        const store = inject("store");
        const props = ref({});
        const initState = initMapStateToProps(store.getState(), attrs);

        function handleStoreUpdate() {
          const previousStateValue = currentStateValue;
          const mapDispatchToProps = initMapDispatchToProps(
            store.dispatch,
            attrs,
          );
          const childPropsArray = Array.isArray(childProps)
            ? childProps
            : Object.keys(childProps);

          currentStateValue = Object.entries(
            initState(store.getState(), attrs) || {},
          ).reduce((acc, [key, value]) => {
            return childPropsArray.includes(key)
              ? { ...acc, [key]: value }
              : acc;
          }, {});

          const actions = mapDispatchToProps(store.dispatch, attrs) || {};

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
        }

        const unsubscribeStore = store.subscribe(handleStoreUpdate);

        onBeforeUnmount(() => {
          unsubscribeStore();
        });

        return function render() {
          handleStoreUpdate();

          return h(children, { ...props.value, ...attrs });
        };
      },
    });
  };
}
