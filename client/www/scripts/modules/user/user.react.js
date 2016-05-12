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


      var actionArgArray = [];
      var action = scope.action;
      var trackingArgCount = 0;
      var options;
      var actionMethod;
      var methodNameArray =[];
      var isNameSpacedMethodName = false;

      if (action) {
        // there is more than one argument
        // we have a method and arguments to pass to the method
        // the name of the method is the last argument
        // split the string into arguments
        // grab the last one as the method name
        // remove the method name (last argument )
        // join the remaining array items together if there is more than one
        // process the method name to determine if it is namespaced
        // assemble the method call execution structure
        // track the event
        // call the method
        if (action.indexOf(',') > -1) {
          // create an array of arguments and method
          actionArgArray = action.split(',');
          // update the argument count
          trackingArgCount = actionArgArray.length;
          // assign method name to action variable
          actionMethod = _.trim(actionArgArray[actionArgArray.length - 1]);
          // remove method name from arguments
          actionArgArray.pop();
          // join arguments back together if necessary
          if (actionArgArray.length > 1) {
            options = actionArgArray.join();
          }
          else {
            options = actionArgArray[0];
          }
        }
        // one one argment was passed in track event (no options)
        else {
          actionMethod = action;
        }
        // process the method name in case it is namespaced
        if (actionMethod.indexOf('.') > -1) {
          // we have a compound method call
          isNameSpacedMethodName = true;
          methodNameArray = actionMethod.split('.');
        }
        if (isNameSpacedMethodName) {

          if (methodNameArray.length === 2) {
            scope.$parent[methodNameArray[0]][methodNameArray[1]](options);
          }
          else if (methodNameArray.length === 3) {
            scope.$parent[methodNameArray[0]][methodNameArray[1]][methodNameArray[2]](options);
          }
          else {
            scope.$root.trackError({action:'badTrackCmd', options:'namepaced method name has too many levels' + methodNameArray.join()});
          }
        }
        else {
          scope.$parent[actionMethod](options);
        }
        scope.$root.trackRequest({action:actionMethod, options:options});
      }// no action suplied

    }
    else {
      scope.$root.trackError({action:'badTrackCmd', options:''});
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

    return (React.createElement("button", {className: scope.className, disabled: isDisabled, onClick: this.handleClick}, child))
  }

});
