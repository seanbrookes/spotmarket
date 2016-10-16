sm.AskHistoryView = React.createClass({
  displayName: "AskHistoryView",
  render() {
    var profileAskHistory = this.props.store.profileAskHistory;
    var tempList = [];
    if (profileAskHistory && profileAskHistory.map) {
      profileAskHistory.map(function(askItem) {
        var item = (<div>{askItem.productType}</div>);
        tempList.push(item);
      });
    }

    return (
      <div>
        <div>Ask History View</div>
        <table>
          <thead>
          <tr>
            <th>

            </th>
          </tr>
          </thead>
        </table>
        {tempList}
      </div>
    );
  }
});

