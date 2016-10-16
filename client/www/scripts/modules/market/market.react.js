sm.MarketFilterList = React.createClass({
  displayName: "MarketFilterList",
  toggleCheckbox(item, event) {
    console.log('toggle checkbox');
    var scope = this.props.store;

    scope.$apply(function() {
      scope.toggleFilterChecked(item);
    });
  },
  render() {
    var that = this;
    var store = this.props.store;


    var options = [];
    if (store.filters) {
      store.filters.map(function(filterItem) {
        var thisPropDisabled = false;
        var checkedAttrib = {};
        if (filterItem.checked) {
          checkedAttrib = true;
        }
        else {
          checkedAttrib = false;
        }
        if (store.filter !== 'sellers') {
          if (store.data.counts[filterItem.value] === 0) {
            thisPropDisabled = true;
          }
        }
        options.push(
          React.createElement("li", null, 
            React.createElement("label", null, 
              React.createElement("input", {disabled: thisPropDisabled, value: filterItem.value, onChange: that.toggleCheckbox.bind(that, filterItem), checked: checkedAttrib, type: "checkbox"}), 
              React.createElement("span", null, filterItem.value), " - - ", React.createElement("span", null, store.data.counts[filterItem.value])
            )
          ))
      });
    }

    return (React.createElement("div", null, 
      React.createElement("ul", null, 
        options
      )
    ));
  }

});

//file:///Users/seanbrookes/Downloads/flag-icon-css-master/index.html
sm.MarketAskList = React.createClass({
  displayName: "MarketAskList",
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

    var gridItems = [];
    if (store.userMarketCtx.allAsks && store.userMarketCtx.allAsks.length > 0) {
      var gridRowClass = 'MarketGrid__Row';

     for (var i = 0;i < store.userMarketCtx.allAsks.length;i++) {

       if (isOdd(i)) {
         gridRowClass = 'MarketGrid__Row MarketGrid__Row--zebra';
       }
       else {
         gridRowClass = 'MarketGrid__Row';
       }
       var rowItem = store.userMarketCtx.allAsks[i];
       var rowElement = (
         React.createElement("tr", {key: rowItem.id, className: gridRowClass}, 
           React.createElement("td", null, 
             React.createElement("div", {className: "MarketGrid__Cell"}, rowItem.variant)
           ), 
           React.createElement("td", null, 
             React.createElement("div", {className: "MarketGrid__Cell"}, rowItem.sellerHandle)
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
        React.createElement("h3", null, "Market Asks"), 
        grid
      )
    );
  }
});
