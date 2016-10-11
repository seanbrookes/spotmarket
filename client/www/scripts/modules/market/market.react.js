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
          React.createElement("li", null, 
            React.createElement("label", null, 
              React.createElement("input", {value: filterItem.value, onChange: that.toggleCheckbox.bind(that, filterItem), checked: checkedAttrib, type: "checkbox"}), 
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
