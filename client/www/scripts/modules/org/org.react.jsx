sm.ProfileContact = React.createClass({
  render: function() {
    var component = this;
    var store = component.props.store;
    var child;

    var output = (

        <div className="OrgProfile_ContactView">
          <div className="OrgProfile__KeyPair Layout">
            <label className="OrgProfile__Label">Handle</label>
            <div>{store.handle}</div>
          </div>
          <div className="OrgProfile__KeyPair Layout">
            <label className="OrgProfile__Label">Name</label>
            <div>{store.name}</div>
          </div>
          <div className="OrgProfile__KeyPair Layout">
            <label className="OrgProfile__Label">Phone</label>
            <div>{store.phone}</div>
          </div>
          <div className="OrgProfile__KeyPair Layout">
            <label className="OrgProfile__Label">Url</label>
            <div>{store.url}</div>
          </div>
          <div className="OrgProfile__KeyPair Layout">
            <label className="OrgProfile__Label">Email</label>
            <div>{store.email}</div>
          </div>
        </div>

    );

    return output;
  }

});

sm.OrgListView = React.createClass({
  render: function() {
    var component = this;
    var store = component.props.store;
    var child;


    var output = [];
    if (store.map) {
      store.map(function(org) {
        var orgLink = '/#/org/' + org.handle;
        output.push(
          <li ng-repeat="org in orgListCtx.currentOrgList">
            Name: <a href={orgLink}>{org.handle}</a>
          </li>
        );
      });
    }


    return (
      <div>
        <ul>
          {output}
        </ul>

      </div>
    );
  }

});

