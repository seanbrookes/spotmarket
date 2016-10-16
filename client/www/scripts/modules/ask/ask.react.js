sm.AskHistoryView = React.createClass({
  displayName: "AskHistoryView",
  render() {
    var profileAskHistory = this.props.store.profileAskHistory;
    var tempList = [];
    if (profileAskHistory && profileAskHistory.map) {
      profileAskHistory.map(function(askItem) {
        var item = (React.createElement("div", null, askItem.productType));
        tempList.push(item);
      });
    }

    return (
      React.createElement("div", null, 
        React.createElement("div", null, "Ask History View"), 
        React.createElement("table", null, 
          React.createElement("thead", null, 
          React.createElement("tr", null, 
            React.createElement("th", null

            )
          )
          )
        ), 
        tempList
      )
    );
  }
});

