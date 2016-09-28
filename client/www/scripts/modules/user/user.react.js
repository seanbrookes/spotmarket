sm.UserProfileContact = React.createClass({displayName: "UserProfileContact",
  render: function() {
    var component = this;
    var store = component.props.store;
    var child;

    var output = (

      React.createElement("div", {className: "UserProfile_ContactView"}, 
        React.createElement("div", {className: "UserProfile__KeyPair Layout"}, 
          React.createElement("label", {className: "UserProfile__Label"}, "Handle"), 
          React.createElement("div", null, store.handle)
        ), 
        React.createElement("div", {className: "UserProfile__KeyPair Layout"}, 
          React.createElement("label", {className: "UserProfile__Label"}, "First name"), 
          React.createElement("div", null, store.firstName)
        ), 
        React.createElement("div", {className: "UserProfile__KeyPair Layout"}, 
          React.createElement("label", {className: "UserProfile__Label"}, "Last name"), 
          React.createElement("div", null, store.lasttName)
        ), 
        React.createElement("div", {className: "UserProfile__KeyPair Layout"}, 
          React.createElement("label", {className: "UserProfile__Label"}, "Phone"), 
          React.createElement("div", null, store.phone)
        ), 
        React.createElement("div", {className: "UserProfile__KeyPair Layout"}, 
          React.createElement("label", {className: "UserProfile__Label"}, "Email"), 
          React.createElement("div", null, store.email)
        )
      )

    );

    return output;
  }

});
sm.TrackedCommand = React.createClass({displayName: "TrackedCommand",

  handleClick: function() {
    var component = this;
    if (component.props.scope && component.props.scope.action) {
      var scope = component.props.scope;
      var action = scope.action.split(',');
      var actionMethod = _.trim(action[action.length-1]);
      action.pop();
      scope.$apply(function() {
        scope.$parent[actionMethod](_.trim(action.toString()));
      });
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
    //if (scope.childTag) {
    //  child = React.createElement(scope.childTag, scope.childAttributes);
    //}
    //else {
    //  child = scope.label;
    //}

    return (React.createElement("button", {className: scope.className, disabled: isDisabled, onClick: this.handleClick}, scope.label))
  }

});
