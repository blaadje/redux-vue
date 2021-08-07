"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = connect;

var _vue = require("vue");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @param mapStateToProps
 * @param mapActionsToProps
 * @returns Object
 */
function connect(mapStateToProps, mapActionsToProps) {
  mapStateToProps = mapStateToProps || noop;
  mapActionsToProps = mapActionsToProps || noop;
  return function (children) {
    return (0, _vue.defineComponent)({
      name: 'Connnect',
      setup: function setup(_, _ref) {
        var attrs = _ref.attrs;
        var store = (0, _vue.inject)("store");
        var props = (0, _vue.reactive)({});

        var handleStoreUpdate = function handleStoreUpdate() {
          var state = mapStateToProps(store.getState(), attrs) || {};
          var actions = mapActionsToProps(store.dispatch, attrs) || {};
          var actionNames = Object.keys(actions);
          var stateNames = Object.keys(state);

          for (var i = 0; i < actionNames.length; i++) {
            props[actionNames[i]] = actions[actionNames[i]];
          }

          for (var _i = 0; _i < stateNames.length; _i++) {
            props[stateNames[_i]] = state[stateNames[_i]];
          }
        };

        handleStoreUpdate();
        var unsubscribeStore = store.subscribe(handleStoreUpdate);
        (0, _vue.onBeforeUnmount)(function () {
          return unsubscribeStore();
        });
        return function () {
          return (0, _vue.h)(children, _objectSpread(_objectSpread({}, props), attrs));
        };
      }
    });
  };
}