
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
        var item = (<div>{askItem.productType}</div>);
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
          <tr key={rowItem.id} className={gridRowClass}>
            <td>
              <div className="MarketGrid__Cell">{rowItem.variant}</div>
            </td>
            <td>
              <div className="MarketGrid__Cell">
                <a href={sellerLink} >{rowItem.sellerHandle}</a>
              </div>
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
        <h3>Active Ask History</h3>
        {grid}
      </div>
    );
  }
});
