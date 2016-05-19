var RecentTracks = React.createClass({displayName: "RecentTracks",
  getInitialState: function() {
    return {
      titleSearchValue:''
    }
  },
  componentWillReceiveProps: function(nextProps) {
    var component = this;
    if (!nextProps.scope.titleSearchValue) {
      component.setState({titleSearchValue:nextProps.scope.titleSearchValue});

    }
  },
  sortIt: function(colName) {
    if (colName) {
      var component = this;
      var scope = component.props.scope;
      scope.$apply(function() {
        scope.sortTracks(colName);
      });
    }
  },


  clearTitleSearch: function(comp) {
    var component = this;
    var scope = component.props.scope;
    scope.$apply(function() {
      scope.clearTitleSearchInput();
    });
  },
  updateTitleSearchValue: function(event) {
    var component = this;
    component.setState({titleSearchValue: event.target.value});
    var scope = component.props.scope;
    scope.$apply(function() {
      scope.updateTitleSearchValue(component.state.titleSearchValue);
    });
  },
  render: function () {
    var component = this;
    var scope = component.props.scope;
    var titleSearchValue = this.state.titleSearchValue;
    var contactRowItems = [];
    if (scope.currentTracks && scope.currentTracks.map) {
      contactRowItems = scope.currentTracks.map(function(track) {

        return (
          React.createElement("tr", {key: track.timestamp}, 
            React.createElement("td", {className: "PrimaryCol"}, 
                track.action
            ), 
            React.createElement("td", null, 
              track.options
            ), 
            React.createElement("td", null, 
              track.email
            ), 
            React.createElement("td", {className: "TrackTable__ClipCol"}, 
              React.createElement("div", {className: "TrackTable__ClipContainer"}, 
                track.userAgent
              )
            ), 
            React.createElement("td", {className: "TrackTable__ClipCol"}, 
              React.createElement("div", {className: "TrackTable__ClipContainer"}, 
              track.sessionId
                )
            ), 
            React.createElement("td", {className: "TrackTable__ClipCol"}, 
              React.createElement("div", {className: "TrackTable__ClipContainer"}, 
              track.language
                )
            ), 
            React.createElement("td", null, 
              track.userName
            ), 
            React.createElement("td", {className: "TrackTable__ClipCol"}, 
              React.createElement("div", {className: "TrackTable__ClipContainer"}, 
              track.referer
              )
            ), 
            React.createElement("td", null, 
              track.timestamp
            )
          ));
      });
    }


    return (
      React.createElement("div", {className: "post-summary-list-container"}, 
        React.createElement("div", {className: "flex-container"}

        ), 
        React.createElement("table", {className: "TrackTable"}, 
          React.createElement("thead", null, 
            React.createElement("tr", null, 
              React.createElement("th", null, 
                React.createElement("button", {onClick: component.sortIt.bind(null, 'action'), className: "CommandButton"}, "Action")
              ), 
              React.createElement("th", null, 
                React.createElement("button", {onClick: component.sortIt.bind(null, 'options'), className: "CommandButton"}, "Options")
              ), 
              React.createElement("th", null, 
                React.createElement("button", {onClick: component.sortIt.bind(null, 'email'), className: "CommandButton"}, "Email")
              ), 
              React.createElement("th", null, 
                React.createElement("button", {onClick: component.sortIt.bind(null, 'userAgent'), className: "CommandButton"}, "Browser")
              ), 
              React.createElement("th", null, 
                React.createElement("button", {onClick: component.sortIt.bind(null, 'sessionId'), className: "CommandButton"}, "Session")
              ), 
              React.createElement("th", null, 
                React.createElement("button", {onClick: component.sortIt.bind(null, 'language'), className: "CommandButton"}, "Language")
              ), 
              React.createElement("th", null, 
                React.createElement("button", {onClick: component.sortIt.bind(null, 'userName'), className: "CommandButton"}, "User Name")
              ), 
              React.createElement("th", null, 
                React.createElement("button", {onClick: component.sortIt.bind(null, 'referer'), className: "CommandButton"}, "Referer")
              ), 
              React.createElement("th", null, 
                React.createElement("button", {onClick: component.sortIt.bind(null, 'timestamp'), className: "CommandButton"}, "Timestamp")
              )
            )
          ), 
          React.createElement("tbody", null, 
            contactRowItems
          )
        )

      )
    );
  }
});
