"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = connect;

var _lodash = _interopRequireDefault(require("lodash.isequal"));

var _vue = require("vue");

var _mapDispatchToProps = _interopRequireDefault(require("./mapDispatchToProps"));

var _mapStateToProps = _interopRequireDefault(require("./mapStateToProps"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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


function connect(ownMapStateToProps, ownMapDispatchToProps) {
  var initMapStateToProps = match(ownMapStateToProps, _mapStateToProps["default"], "mapStateToProps");
  var initMapDispatchToProps = match(ownMapDispatchToProps, _mapDispatchToProps["default"], "mapDispatchToProps");
  return function (children) {
    var childProps = children.props || children.childProps;
    return (0, _vue.defineComponent)({
      name: "Connnect",
      childProps: childProps,
      setup: function setup(_, _ref) {
        var attrs = _ref.attrs,
            slots = _ref.slots;
        var currentStateValue;
        var store = (0, _vue.inject)("store");
        var props = (0, _vue.ref)({});
        var initState = initMapStateToProps(store.getState(), attrs);

        function handleStoreUpdate() {
          var previousStateValue = currentStateValue;
          var mapDispatchToProps = initMapDispatchToProps(store.dispatch, attrs);
          var childPropsArray = Array.isArray(childProps) ? childProps : Object.keys(childProps);
          currentStateValue = Object.entries(initState(store.getState(), attrs) || {}).reduce(function (acc, _ref2) {
            var _ref3 = _slicedToArray(_ref2, 2),
                key = _ref3[0],
                value = _ref3[1];

            return childPropsArray.includes(key) ? _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, key, value)) : acc;
          }, {});
          var actions = mapDispatchToProps(store.dispatch, attrs) || {};

          if ((0, _lodash["default"])(previousStateValue, currentStateValue)) {
            return;
          }

          var actionsListeners = Object.entries(actions).reduce(function (acc, _ref4) {
            var _ref5 = _slicedToArray(_ref4, 2),
                key = _ref5[0],
                value = _ref5[1];

            return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, (0, _utils.toHandlerKey)(key), value));
          }, {});
          props.value = _objectSpread(_objectSpread({}, currentStateValue), actionsListeners);
        }

        var unsubscribeStore = store.subscribe(handleStoreUpdate);
        (0, _vue.onBeforeUnmount)(function () {
          unsubscribeStore();
        });
        return function render() {
          handleStoreUpdate();
          return (0, _vue.h)(children, _objectSpread(_objectSpread({}, props.value), attrs), slots);
        };
      }
    });
  };
}