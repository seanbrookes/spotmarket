sm.UserProfileContact = React.createClass({
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
      <div className="UserProfile_ContactView">
        <div className="UserProfile__KeyPair Layout">
          <label className="UserProfile__Label">Handle</label>
          <div>{userProfile.handle}</div>
        </div>
        <div className="UserProfile__KeyPair Layout">
          <label className="UserProfile__Label">First name</label>
           <div>{userProfile.firstName}</div>
        </div>
        <div className="UserProfile__KeyPair Layout">
          <label className="UserProfile__Label">Last name</label>
          <div>{userProfile.lastName}</div>
        </div>
        <div className="UserProfile__KeyPair Layout">
          <label className="UserProfile__Label">Phone</label>
          <div>{userProfile.phone}</div>
        </div>
        <div className="UserProfile__KeyPair Layout">
          <label className="UserProfile__Label">Email</label>
          <div>{userProfile.email}</div>
        </div>
      </div>
    );

    if (scope.userProfileCtx.isEditContactMode) {
      contactComponent = (
        <div className="UserProfile_ContactView">
          <div className="UserProfile__KeyPair Layout">
            <label className="UserProfile__Label">Handle</label>
            <div>{userProfile.handle}</div>          </div>
          <div className="UserProfile__KeyPair Layout">
            <label className="UserProfile__Label">First name</label>
            <input type="text" onChange={this.profilePropertyChange.bind(this, 'firstName')} value={userProfile.firstName} />
          </div>
          <div className="UserProfile__KeyPair Layout">
            <label className="UserProfile__Label">Last name</label>
            <input type="text" onChange={this.profilePropertyChange.bind(this, 'lastName')} value={userProfile.lastName} />
          </div>
          <div className="UserProfile__KeyPair Layout">
            <label className="UserProfile__Label">Phone</label>
            <input type="text" onChange={this.profilePropertyChange.bind(this, 'phone')} value={userProfile.phone} />
          </div>
          <div className="UserProfile__KeyPair Layout">
            <label className="UserProfile__Label">Email</label>
            <input type="text" onChange={this.profilePropertyChange.bind(this, 'email')} value={userProfile.email} />
          </div>
          <div className="ButtonGroup ButtonGroup__Container">
            <button onClick={this.cancelContactEdit}>cancel</button>
            <button onClick={this.saveContactEdit}>save</button>
          </div>
        </div>
      );
    }




    return contactComponent;
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
