"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.capitalize = capitalize;
exports.toHandlerKey = toHandlerKey;
exports.verifyPlainObject = exports.isPlainObject = exports.warning = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var warning = function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== "undefined" && typeof console.error === "function") {
    console.error(message);
  }
  /* eslint-enable no-console */


  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */

};

exports.warning = warning;

var isPlainObject = function isPlainObject(obj) {
  if (_typeof(obj) !== "object" || obj === null) return false;
  var proto = Object.getPrototypeOf(obj);
  if (proto === null) return true;
  var baseProto = proto;

  while (Object.getPrototypeOf(baseProto) !== null) {
    baseProto = Object.getPrototypeOf(baseProto);
  }

  return proto === baseProto;
};

exports.isPlainObject = isPlainObject;

var verifyPlainObject = function verifyPlainObject(value, displayName, methodName) {
  if (!isPlainObject(value)) {
    warning("".concat(methodName, "() in ").concat(displayName, " must return a plain object. Instead received ").concat(value, "."));
  }
};

exports.verifyPlainObject = verifyPlainObject;

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toHandlerKey(str) {
  return str ? "on".concat(capitalize(str)) : "";
}