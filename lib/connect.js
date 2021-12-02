"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = connect;

var _lodash = _interopRequireDefault(require("lodash.isequal"));

var _vue = require("vue");

var _mapStateToProps = _interopRequireDefault(require("./mapStateToProps"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var match = function match(arg, factories, name) {
  for (var i = factories.length - 1; i >= 0; i -= 1) {
    var result = factories[i](arg);

    if (result) {
      return result;
    }
  }

  return function (dispatch, options) {
    throw new Error("Invalid value of type ".concat(_typeof(arg), " for ").concat(name, " argument when connecting component ").concat(options.wrappedComponentName, "."));
  };
};
/**
 * @param mapStateToProps
 * @param mapActionsToProps
 * @returns Object
 */


function connect(mapStateToProps, mapActionsToProps) {
  var initMapStateToProps = match(mapStateToProps, _mapStateToProps["default"], "mapStateToProps");
  return function (children) {
    return (0, _vue.defineComponent)({
      name: "Connnect",
      setup: function setup(_, _ref) {
        var attrs = _ref.attrs;
        var currentStateValue;
        var store = (0, _vue.inject)("store");
        var props = (0, _vue.reactive)({});
        var initState = initMapStateToProps(store.getState(), attrs);

        var handleStoreUpdate = function handleStoreUpdate() {
          var previousStateValue = currentStateValue;
          var state = store.getState();
          currentStateValue = initState( // not sure about that
          state, attrs) || {};
          var actions = mapActionsToProps(store.dispatch, state, attrs) || {};
          var actionNames = Object.keys(actions);
          var stateNames = Object.keys(currentStateValue);

          if ((0, _lodash["default"])(previousStateValue, currentStateValue)) {
            return;
          }

          for (var i = 0; i < actionNames.length; i += 1) {
            props[actionNames[i]] = actions[actionNames[i]];
          }

          for (var _i = 0; _i < stateNames.length; _i += 1) {
            props[stateNames[_i]] = currentStateValue[stateNames[_i]];
          }
        };

        var unsubscribeStore = store.subscribe(handleStoreUpdate);
        (0, _vue.onBeforeUnmount)(function () {
          unsubscribeStore();
        });
        return function () {
          handleStoreUpdate();
          return (0, _vue.h)(children, _objectSpread(_objectSpread({}, props), attrs));
        };
      }
    });
  };
}