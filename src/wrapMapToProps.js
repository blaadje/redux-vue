import { verifyPlainObject } from "./utils";

export function wrapMapToPropsConstant(getConstant) {
  return function initConstantSelector(dispatch) {
    const constant = getConstant(dispatch);

    function constantSelector() {
      return constant;
    }
    constantSelector.dependsOnOwnProps = false;
    return constantSelector;
  };
}

export function getDependsOnOwnProps(mapToProps) {
  return mapToProps.dependsOnOwnProps
    ? Boolean(mapToProps.dependsOnOwnProps)
    : mapToProps.length !== 1;
}

export function wrapMapToPropsFunc(mapToProps, methodName) {
  return (dispatch, { displayName }) => {
    const proxy = (stateOrDispatch, ownProps) => {
      return proxy.dependsOnOwnProps
        ? proxy.mapToProps(stateOrDispatch, ownProps)
        : proxy.mapToProps(stateOrDispatch, undefined);
    };

    // allow detectFactoryAndVerify to get ownProps
    proxy.dependsOnOwnProps = true;

    proxy.mapToProps = (stateOrDispatch, ownProps) => {
      proxy.mapToProps = mapToProps;
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
      let props = proxy(stateOrDispatch, ownProps);

      if (typeof props === "function") {
        proxy.mapToProps = props;
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
        props = proxy(stateOrDispatch, ownProps);
      }

      if (process.env.NODE_ENV !== "production")
        verifyPlainObject(props, displayName, methodName);

      return props;
    };

    return proxy;
  };
}
