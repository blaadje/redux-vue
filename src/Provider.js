import { Fragment, h, provide } from "vue";

export default {
  name: "Provider",
  props: {
    store: {
      type: Object,
      required: true,
    },
  },
  setup(props, { slots }) {
    provide("store", props.store);

    return () => {
      return h(Fragment, {}, slots.default());
    };
  },
};
