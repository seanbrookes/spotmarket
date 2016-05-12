var TrackedCommand = React.createClass({displayName: "TrackedCommand",

  /*
  *
  * tracked calls may:
  * - have no arguments
  * - be a dot notated context eg: registrationCtx.methodName
  *
  * */
  handleClick: function() {
    var component = this;
    if (component.props.scope && component.props.scope.action) {
      var scope = component.props.scope;
      // confirm if there is more than one argument
      var action = component.props.scope.action;
      var actionMethod = action;
      // check to see if there are arguments to the main method
      if (scope.action.indexOf(',') > -1) {
        action = scope.action.split(',');
        actionMethod = _.trim(action[action.length-1]);
        action.pop();
      }
      scope.$apply(function() {
        scope.$root.trackRequest({action:actionMethod, options:action.toString()});
        // if the method is compounded on a namespace we need to drill down to the method call
        var actionContext = actionArray[0];
        var actionContext2 = actionArray[1];
        var trimmedArg = _.trim(action.toString());
        var aMethod = scope.$parent[actionContext];
        var bMethod = aMethod[actionContext2];
        bMethod(trimmedArg);
      });
    }
    else {
      scope.$root.trackRequest({action:'badTrackCmd', options:''});
    }
  },

  render: function() {
    var component = this;
    var scope = component.props.scope;
    var child;
    var isDisabled = false;
    if (scope.disabled) {
      if (scope.disabled !== 'false') {
        isDisabled = true;
      }
    }
    if (scope.childTag) {
      child = React.createElement(scope.childTag, scope.childAttributes);
    }
    else {
      child = scope.label;
    }

    return (React.createElement("button", {className: scope.class, disabled: isDisabled, onClick: this.handleClick}, child))
  }

});
