sm.ProfileContact = React.createClass({displayName: "ProfileContact",
  render: function() {
    var component = this;
    var store = component.props.store;
    var child;

    var output = (

        React.createElement("div", {className: "OrgProfile_ContactView"}, 
          React.createElement("div", {className: "OrgProfile__KeyPair Layout"}, 
            React.createElement("label", {className: "OrgProfile__Label"}, "Handle"), 
            React.createElement("div", null, store.handle)
          ), 
          React.createElement("div", {className: "OrgProfile__KeyPair Layout"}, 
            React.createElement("label", {className: "OrgProfile__Label"}, "Name"), 
            React.createElement("div", null, store.name)
          ), 
          React.createElement("div", {className: "OrgProfile__KeyPair Layout"}, 
            React.createElement("label", {className: "OrgProfile__Label"}, "Phone"), 
            React.createElement("div", null, store.phone)
          ), 
          React.createElement("div", {className: "OrgProfile__KeyPair Layout"}, 
            React.createElement("label", {className: "OrgProfile__Label"}, "Url"), 
            React.createElement("div", null, store.url)
          ), 
          React.createElement("div", {className: "OrgProfile__KeyPair Layout"}, 
            React.createElement("label", {className: "OrgProfile__Label"}, "Email"), 
            React.createElement("div", null, store.email)
          )
        )

    );

    return output;
  }

});

sm.OrgListView = React.createClass({displayName: "OrgListView",
  render: function() {
    var component = this;
    var store = component.props.store;
    var child;


    var output = [];
    if (store.map) {
      store.map(function(org) {
        var orgLink = '/#/org/' + org.handle;
        output.push(
          React.createElement("li", {"ng-repeat": "org in orgListCtx.currentOrgList"}, 
            "Name: ", React.createElement("a", {href: orgLink}, org.handle)
          )
        );
      });
    }


    return (
      React.createElement("div", null, 
        React.createElement("ul", null, 
          output
        )

      )
    );
  }

});

