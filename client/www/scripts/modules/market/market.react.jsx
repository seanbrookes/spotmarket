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
          <li >
            <label>
              <input disabled={thisPropDisabled} value={filterItem.value} onChange={that.toggleCheckbox.bind(that, filterItem)} checked={checkedAttrib} type="checkbox" />
              <span>{filterItem.value}</span> - - <span>{store.data.counts[filterItem.value]}</span>
            </label>
          </li>)
      });
    }

    return (<div>
      <ul>
        {options}
      </ul>
    </div>);
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
          <li>
            <div className="MarketAskList__Card">
              <div className="Layout">
                <span className="MarketAskCard__Title">{askItem.productType} - {askItem.variant}</span>
              </div>
              <div className="Layout">
                <span className="MarketAskCard__SellerLabel">Seller</span>
                <a href="/#/user/{{ask.seller.handle}}" class="LinkButton">{askItem.seller.handle}</a>
                <span className=" img-thumbnail flag flag-icon-background flag-icon-gr"></span>
              </div>
              <div className="Layout Spread">
                <sm-geo-location-display address="ask.address"></sm-geo-location-display>
                <span className="MarketAskCard__Distance">{askItem.distance} kms</span>
              </div>
              <div className="Layout">
                <span className="MarketAskCard__Time" am-time-ago={askItem.lastUpdate}></span>
              </div>
            </div>
          </li>
        );
        items.push(element);
      });
    }
    var output = (
      <ul>
        {items}
      </ul>
    );



    var grid = (
      <table>
        <thead>
        <tr>
          <th>
            <button onClick={this.sortIt.bind(this, 'variant')}  className="CommandLink">variant</button>
          </th>
          <th>
            <button onClick={this.sortIt.bind(this, 'seller')}  className="CommandLink">seller</button>
          </th>
          <th>
            <button onClick={this.sortIt.bind(this, 'mode')}  className="CommandLink">mode</button>
          </th>
          <th>
            <button onClick={this.sortIt.bind(this, 'totalQuantity')}  className="CommandLink">quanity</button>
          </th>
        </tr>
        </thead>

      </table>
    );

    return (
      <div>
        {grid}
        <h3>Market Asks</h3>
        {output}
      </div>
    );
  }
});
