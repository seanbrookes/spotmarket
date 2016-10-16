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
         <tr key={rowItem.id} className={gridRowClass}>
           <td>
             <div className="MarketGrid__Cell">{rowItem.variant}</div>
           </td>
           <td>
             <div className="MarketGrid__Cell">{rowItem.sellerHandle}</div>
           </td>
           <td>
             <div className="MarketGrid__Cell">{rowItem.productMode}</div>
           </td>
           <td>
             <div className="MarketGrid__Cell">{rowItem.price}/{rowItem.measure}({rowItem.currency})</div>
           </td>
           <td>
             <div className="MarketGrid__Cell">{rowItem.cropYear}</div>
           </td>
           <td>
             <div className="MarketGrid__Cell">{rowItem.quantity} {rowItem.quantityMeasure}</div>
           </td>
           <td>
             <div className="MarketGrid__Cell">{rowItem.grower}</div>
           </td>
           <td>
             <div className="MarketGrid__Cell">{rowItem.distance}</div>
           </td>
           <td>
             <div className="MarketGrid__Cell">{rowItem.lastUpdate}</div>
           </td>
           <td>
             <div className="MarketGrid__Cell">{rowItem.countryOfOrigin}</div>
           </td>
           <td>
             <div className="MarketGrid__Cell">{rowItem.analysis.toString()}</div>
           </td>
         </tr>
       );
       gridItems.push(rowElement);

     }

    }





    var grid = (
      <table>
        <thead>
        <tr>
          <th>
            <button onClick={this.sortIt.bind(this, 'variant')}  className="LinkButton">variant</button>
          </th>
          <th>
            <button onClick={this.sortIt.bind(this, 'sellerHandle')}  className="LinkButton">seller</button>
          </th>
          <th>
            <button onClick={this.sortIt.bind(this, 'productMode')}  className="LinkButton">mode</button>
          </th>
          <th>
            <button onClick={this.sortIt.bind(this, 'price')}  className="LinkButton">price</button>
          </th>
          <th>
            <button onClick={this.sortIt.bind(this, 'cropYear')}  className="LinkButton">crop year</button>
          </th>
          <th>
            <button onClick={this.sortIt.bind(this, 'quantity')}  className="LinkButton">quanity</button>
          </th>
          <th>
            <button onClick={this.sortIt.bind(this, 'grower')}  className="LinkButton">grower</button>
          </th>
          <th>
            <button onClick={this.sortIt.bind(this, 'distance')}  className="LinkButton">distance</button>
          </th>
          <th>
            <button onClick={this.sortIt.bind(this, 'postedTime')}  className="LinkButton">posted time</button>
          </th>
          <th>
            <button onClick={this.sortIt.bind(this, 'countryOfOrigin')}  className="LinkButton">origin country</button>
          </th>
          <th>
            <button onClick={this.sortIt.bind(this, 'analysis')}  className="LinkButton">analysis</button>
          </th>
        </tr>
        </thead>
        <tbody>
        {gridItems}
        </tbody>

      </table>
    );

    return (
      <div>
        <h3>Market Asks</h3>
        {grid}
      </div>
    );
  }
});
