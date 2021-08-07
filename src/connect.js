import { defineComponent, h, onBeforeUnmount, inject, reactive } from "vue";

/**
 * @param mapStateToProps
 * @param mapActionsToProps
 * @returns Object
 */
export default function connect(mapStateToProps, mapActionsToProps) {
  mapStateToProps = mapStateToProps || noop;
  mapActionsToProps = mapActionsToProps || noop;

  return (children) =>
    defineComponent({
      name: 'Connnect',
      setup(_, { attrs }) {
        const store = inject("store");
        const props = reactive({});

        const handleStoreUpdate = () => {
          const state = mapStateToProps(store.getState(), attrs) || {};
          const actions = mapActionsToProps(store.dispatch, attrs) || {};
          const actionNames = Object.keys(actions);
          const stateNames = Object.keys(state);

          for (let i = 0; i < actionNames.length; i++) {
            props[actionNames[i]] = actions[actionNames[i]];
          }

          for (let i = 0; i < stateNames.length; i++) {
            props[stateNames[i]] = state[stateNames[i]];
          }
        };

        handleStoreUpdate();
        const unsubscribeStore = store.subscribe(handleStoreUpdate);

        onBeforeUnmount(() => unsubscribeStore());

        return () => h(children, { ...props, ...attrs });
      },
    });
}
