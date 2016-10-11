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
        var checkedAttrib = {};
        if (filterItem.checked) {
          checkedAttrib = true;
        }
        else {
          checkedAttrib = false;
        }
        options.push(
          <li >
            <label>
              <input value={filterItem.value} onChange={that.toggleCheckbox.bind(that, filterItem)} checked={checkedAttrib} type="checkbox" />
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
