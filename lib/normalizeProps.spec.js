"use strict";

var _expect = _interopRequireDefault(require("expect"));

var _normalizeProps = _interopRequireDefault(require("./normalizeProps"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('normalize props', function () {
  it('should normalize array props', function () {
    (0, _expect["default"])((0, _normalizeProps["default"])(['a', 'b'])).toEqual({
      a: null,
      b: null
    });
  });
  it('should normalize object props', function () {
    var props = {
      'a': {
        type: String
      },
      'b': null
    };
    (0, _expect["default"])((0, _normalizeProps["default"])(props)).toEqual(props);
  });
});