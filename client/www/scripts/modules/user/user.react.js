sm.UserProfileContact = React.createClass({displayName: "UserProfileContact",
  getInitialState() {
    return {handle:''}
  },
  profilePropertyChange(propertyName, event) {
    var val = event.target.value;
    var scope = this.props.scope;
    scope.$apply(function() {
      scope.userProfileCtx.currentProfile[propertyName] = val;
    });
    console.log('I am changing');

    this.setState({handle:val});
  },
  saveContactEdit() {
    var scope = this.props.scope;
    scope.$apply(function() {
      scope.userProfileCtx.saveContact();
    });
  },
  cancelContactEdit() {
    var scope = this.props.scope;
    scope.$apply(function() {
      scope.userProfileCtx.cancelContactEdit();
    });
  },

  render: function() {
    var component = this;
    var scope = component.props.scope;
    var userProfile = scope.userProfileCtx.currentProfile;


    var contactComponent = (
      React.createElement("div", {className: "UserProfile_ContactView"}, 
        React.createElement("div", {className: "UserProfile__KeyPair Layout"}, 
          React.createElement("label", {className: "UserProfile__Label"}, "Handle"), 
          React.createElement("div", null, userProfile.handle)
        ), 
        React.createElement("div", {className: "UserProfile__KeyPair Layout"}, 
          React.createElement("label", {className: "UserProfile__Label"}, "First name"), 
           React.createElement("div", null, userProfile.firstName)
        ), 
        React.createElement("div", {className: "UserProfile__KeyPair Layout"}, 
          React.createElement("label", {className: "UserProfile__Label"}, "Last name"), 
          React.createElement("div", null, userProfile.lastName)
        ), 
        React.createElement("div", {className: "UserProfile__KeyPair Layout"}, 
          React.createElement("label", {className: "UserProfile__Label"}, "Phone"), 
          React.createElement("div", null, userProfile.phone)
        ), 
        React.createElement("div", {className: "UserProfile__KeyPair Layout"}, 
          React.createElement("label", {className: "UserProfile__Label"}, "Email"), 
          React.createElement("div", null, userProfile.email)
        )
      )
    );

    if (scope.userProfileCtx.isEditContactMode) {
      contactComponent = (
        React.createElement("div", {className: "UserProfile_ContactView"}, 
          React.createElement("div", {className: "UserProfile__KeyPair Layout"}, 
            React.createElement("label", {className: "UserProfile__Label"}, "Handle"), 
            React.createElement("div", null, userProfile.handle), "          "), 
          React.createElement("div", {className: "UserProfile__KeyPair Layout"}, 
            React.createElement("label", {className: "UserProfile__Label"}, "First name"), 
            React.createElement("input", {type: "text", onChange: this.profilePropertyChange.bind(this, 'firstName'), value: userProfile.firstName})
          ), 
          React.createElement("div", {className: "UserProfile__KeyPair Layout"}, 
            React.createElement("label", {className: "UserProfile__Label"}, "Last name"), 
            React.createElement("input", {type: "text", onChange: this.profilePropertyChange.bind(this, 'lastName'), value: userProfile.lastName})
          ), 
          React.createElement("div", {className: "UserProfile__KeyPair Layout"}, 
            React.createElement("label", {className: "UserProfile__Label"}, "Phone"), 
            React.createElement("input", {type: "text", onChange: this.profilePropertyChange.bind(this, 'phone'), value: userProfile.phone})
          ), 
          React.createElement("div", {className: "UserProfile__KeyPair Layout"}, 
            React.createElement("label", {className: "UserProfile__Label"}, "Email"), 
            React.createElement("input", {type: "text", onChange: this.profilePropertyChange.bind(this, 'email'), value: userProfile.email})
          ), 
          React.createElement("div", {className: "ButtonGroup ButtonGroup__Container"}, 
            React.createElement("button", {onClick: this.cancelContactEdit}, "cancel"), 
            React.createElement("button", {onClick: this.saveContactEdit}, "save")
          )
        )
      );
    }




    return contactComponent;
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
