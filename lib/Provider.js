"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = require("vue");

var _default = {
  name: "Provider",
  props: {
    store: {
      type: Object,
      required: true
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    (0, _vue.provide)("store", props.store);
    return function () {
      return (0, _vue.h)(_vue.Fragment, {}, slots["default"]());
    };
  }
};
exports["default"] = _default;