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

    var items = [];
    if (store.userMarketCtx.allAsks && store.userMarketCtx.allAsks.length > 0) {
      store.userMarketCtx.allAsks.map(function(askItem) {
        var element = (
          React.createElement("li", null, 
            React.createElement("div", {className: "MarketAskList__Card"}, 
              React.createElement("div", {className: "Layout"}, 
                React.createElement("span", {className: "MarketAskCard__Title"}, askItem.productType, " - ", askItem.variant)
              ), 
              React.createElement("div", {className: "Layout"}, 
                React.createElement("span", {className: "MarketAskCard__SellerLabel"}, "Seller"), 
                React.createElement("a", {href: "/#/user/{{ask.seller.handle}}", class: "LinkButton"}, askItem.seller.handle), 
                React.createElement("span", {className: " img-thumbnail flag flag-icon-background flag-icon-gr"})
              ), 
              React.createElement("div", {className: "Layout Spread"}, 
                React.createElement("sm-geo-location-display", {address: "ask.address"}), 
                React.createElement("span", {className: "MarketAskCard__Distance"}, askItem.distance, " kms")
              ), 
              React.createElement("div", {className: "Layout"}, 
                React.createElement("span", {className: "MarketAskCard__Time", "am-time-ago": askItem.lastUpdate})
              )
            )
          )
        );
        items.push(element);
      });
    }
    var output = (
      React.createElement("ul", null, 
        items
      )
    );



    var grid = (
      React.createElement("table", null, 
        React.createElement("thead", null, 
        React.createElement("tr", null, 
          React.createElement("th", null, 
            React.createElement("button", {onClick: this.sortIt.bind(this, 'variant'), className: "CommandLink"}, "variant")
          ), 
          React.createElement("th", null, 
            React.createElement("button", {onClick: this.sortIt.bind(this, 'seller'), className: "CommandLink"}, "seller")
          ), 
          React.createElement("th", null, 
            React.createElement("button", {onClick: this.sortIt.bind(this, 'mode'), className: "CommandLink"}, "mode")
          ), 
          React.createElement("th", null, 
            React.createElement("button", {onClick: this.sortIt.bind(this, 'totalQuantity'), className: "CommandLink"}, "quanity")
          )
        )
        )

      )
    );

    return (
      React.createElement("div", null, 
        grid, 
        React.createElement("h3", null, "Market Asks"), 
        output
      )
    );
  }
});
