var CurrentLocationDisplay = React.createClass(
  {
    displayName: "CurrentLocationDisplay",
    render:function() {
      var component = this;
      var store = component.props.store;
      return (React.createElement("label", null, "Your current position is ", store.currentLocationString));
    }
  }
);
