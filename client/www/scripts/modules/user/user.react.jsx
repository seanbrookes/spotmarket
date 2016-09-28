sm.UserProfileContact = React.createClass({
  render: function() {
    var component = this;
    var store = component.props.store;
    var child;

    var output = (

      <div className="UserProfile_ContactView">
        <div className="UserProfile__KeyPair Layout">
          <label className="UserProfile__Label">Handle</label>
          <div>{store.handle}</div>
        </div>
        <div className="UserProfile__KeyPair Layout">
          <label className="UserProfile__Label">First name</label>
          <div>{store.firstName}</div>
        </div>
        <div className="UserProfile__KeyPair Layout">
          <label className="UserProfile__Label">Last name</label>
          <div>{store.lasttName}</div>
        </div>
        <div className="UserProfile__KeyPair Layout">
          <label className="UserProfile__Label">Phone</label>
          <div>{store.phone}</div>
        </div>
        <div className="UserProfile__KeyPair Layout">
          <label className="UserProfile__Label">Email</label>
          <div>{store.email}</div>
        </div>
      </div>

    );

    return output;
  }

});
sm.TrackedCommand = React.createClass({

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

    return (<button className={scope.className} disabled={isDisabled} onClick={this.handleClick}>{scope.label}</button>)
  }

});
