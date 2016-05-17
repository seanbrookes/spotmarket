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
          <tr>
            <td className="PrimaryCol">
                {track.action}
            </td>
            <td >
              {track.options}
            </td>
            <td >
              {track.email}
            </td>
            <td className="TrackTable__ClipCol">
              <div className="TrackTable__ClipContainer">
                {track.userAgent}
              </div>
            </td>
            <td  className="TrackTable__ClipCol">
              <div className="TrackTable__ClipContainer">
              {track.sessionId}
                </div>
            </td>
            <td  className="TrackTable__ClipCol">
              <div className="TrackTable__ClipContainer">
              {track.language}
                </div>
            </td>
            <td >
              {track.userName}
            </td>
            <td  className="TrackTable__ClipCol">
              <div className="TrackTable__ClipContainer">
              {track.referer}
              </div>
            </td>
            <td >
              {track.timestamp}
            </td>
          </tr>);
      });
    }


    return (
      <div className="post-summary-list-container">
        <div className="flex-container">
          <input placeholder="search" value={titleSearchValue} onChange={component.updateTitleSearchValue} type="text" className="form-control" />
          <button onClick={component.clearTitleSearch.bind(component)} className="link-cmd">
            <span className="glyphicon glyphicon-remove-circle"></span>
          </button>
        </div>
        <table className="TrackTable">
          <thead>
            <tr>
              <th>
                <button onClick={component.sortIt.bind(component, 'action')} className="CommandButton">Action</button>
              </th>
              <th>
                <button onClick={component.sortIt.bind(component, 'options')} className="CommandButton">Options</button>
              </th>
              <th>
                <button onClick={component.sortIt.bind(component, 'email')} className="CommandButton">Email</button>
              </th>
              <th>
                <button onClick={component.sortIt.bind(component, 'userAgent')}  className="CommandButton">Browser</button>
              </th>
              <th>
                <button onClick={component.sortIt.bind(component, 'sessionId')}  className="CommandButton">Session</button>
              </th>
              <th>
                <button onClick={component.sortIt.bind(component, 'language')}  className="CommandButton">Language</button>
              </th>
              <th>
                <button onClick={component.sortIt.bind(component, 'userName')}  className="CommandButton">User Name</button>
              </th>
              <th>
                <button onClick={component.sortIt.bind(component, 'referer')}  className="CommandButton">Referer</button>
              </th>
              <th>
                <button onClick={component.sortIt.bind(component, 'timestamp')}  className="CommandButton">Timestamp</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {contactRowItems}
          </tbody>
        </table>

      </div>
    );
  }
});
