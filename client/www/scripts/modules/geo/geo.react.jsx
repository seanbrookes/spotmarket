var CurrentLocationDisplay = React.createClass(
  {
    displayName: "CurrentLocationDisplay",
    render:function() {
      var component = this;
      var store = component.props.store;
      return (<label >Your current position is {store}</label>);
    }
  }
);
