
sm.AskHistoryView = React.createClass({
  displayName: "AskHistoryView",
  sortIt: function(colName) {
    if (colName) {
      var scope = this.props.store;
      scope.$apply(function() {
        scope.sortEntities(colName);
      });
    }
  },
  render() {
    var store = this.props.store;


    function isOdd(num) { return num % 2;}

    var profileAskHistory = this.props.store.profileAskHistory;
    var tempList = [];
    if (profileAskHistory && profileAskHistory.map) {
      profileAskHistory.map(function(askItem) {
        var item = (React.createElement("div", null, askItem.productType));
        tempList.push(item);
      });
    }

    var gridItems = [];
    if (profileAskHistory && profileAskHistory.length > 0) {
      var gridRowClass = 'MarketGrid__Row';

      for (var i = 0;i < profileAskHistory.length;i++) {

        if (isOdd(i)) {
          gridRowClass = 'MarketGrid__Row MarketGrid__Row--zebra';
        }
        else {
          gridRowClass = 'MarketGrid__Row';
        }
        var rowItem = profileAskHistory[i];
        var sellerLink = '/#/user/' + rowItem.sellerHandle;
        var rowElement = (
          React.createElement("tr", {key: rowItem.id, className: gridRowClass}, 
            React.createElement("td", null, 
              React.createElement("div", {className: "MarketGrid__Cell"}, rowItem.variant)
            ), 
            React.createElement("td", null, 
              React.createElement("div", {className: "MarketGrid__Cell"}, 
                React.createElement("a", {href: sellerLink}, rowItem.sellerHandle)
              )
            ), 
            React.createElement("td", null, 
              React.createElement("div", {className: "MarketGrid__Cell"}, rowItem.productMode)
            ), 
            React.createElement("td", null, 
              React.createElement("div", {className: "MarketGrid__Cell"}, rowItem.price, "/", rowItem.measure, "(", rowItem.currency, ")")
            ), 
            React.createElement("td", null, 
              React.createElement("div", {className: "MarketGrid__Cell"}, rowItem.cropYear)
            ), 
            React.createElement("td", null, 
              React.createElement("div", {className: "MarketGrid__Cell"}, rowItem.quantity, " ", rowItem.quantityMeasure)
            ), 
            React.createElement("td", null, 
              React.createElement("div", {className: "MarketGrid__Cell"}, rowItem.grower)
            ), 
            React.createElement("td", null, 
              React.createElement("div", {className: "MarketGrid__Cell"}, rowItem.distance)
            ), 
            React.createElement("td", null, 
              React.createElement("div", {className: "MarketGrid__Cell"}, rowItem.lastUpdate)
            ), 
            React.createElement("td", null, 
              React.createElement("div", {className: "MarketGrid__Cell"}, rowItem.countryOfOrigin)
            ), 
            React.createElement("td", null, 
              React.createElement("div", {className: "MarketGrid__Cell"}, rowItem.analysis.toString())
            )
          )
        );
        gridItems.push(rowElement);

      }

    }





    var grid = (
      React.createElement("table", null, 
        React.createElement("thead", null, 
        React.createElement("tr", null, 
          React.createElement("th", null, 
            React.createElement("button", {onClick: this.sortIt.bind(this, 'variant'), className: "LinkButton"}, "variant")
          ), 
          React.createElement("th", null, 
            React.createElement("button", {onClick: this.sortIt.bind(this, 'sellerHandle'), className: "LinkButton"}, "seller")
          ), 
          React.createElement("th", null, 
            React.createElement("button", {onClick: this.sortIt.bind(this, 'productMode'), className: "LinkButton"}, "mode")
          ), 
          React.createElement("th", null, 
            React.createElement("button", {onClick: this.sortIt.bind(this, 'price'), className: "LinkButton"}, "price")
          ), 
          React.createElement("th", null, 
            React.createElement("button", {onClick: this.sortIt.bind(this, 'cropYear'), className: "LinkButton"}, "crop year")
          ), 
          React.createElement("th", null, 
            React.createElement("button", {onClick: this.sortIt.bind(this, 'quantity'), className: "LinkButton"}, "quanity")
          ), 
          React.createElement("th", null, 
            React.createElement("button", {onClick: this.sortIt.bind(this, 'grower'), className: "LinkButton"}, "grower")
          ), 
          React.createElement("th", null, 
            React.createElement("button", {onClick: this.sortIt.bind(this, 'distance'), className: "LinkButton"}, "distance")
          ), 
          React.createElement("th", null, 
            React.createElement("button", {onClick: this.sortIt.bind(this, 'postedTime'), className: "LinkButton"}, "posted time")
          ), 
          React.createElement("th", null, 
            React.createElement("button", {onClick: this.sortIt.bind(this, 'countryOfOrigin'), className: "LinkButton"}, "origin country")
          ), 
          React.createElement("th", null, 
            React.createElement("button", {onClick: this.sortIt.bind(this, 'analysis'), className: "LinkButton"}, "analysis")
          )
        )
        ), 
        React.createElement("tbody", null, 
        gridItems
        )

      )
    );

    return (
      React.createElement("div", null, 
        React.createElement("h3", null, "Active Ask History"), 
        grid
      )
    );
  }
});
