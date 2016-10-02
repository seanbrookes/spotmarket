sm.BannerImageCropper = React.createClass({
  displayName: "BannerImageCropper",
  getInitialState() { return {currentImage:{}, rangeVal: 100}; },
  scaleImageWidth(image, scale) {
    var originalImage = this.state.originalImage;
    if (originalImage) {
      var newWidth = originalImage.width * (scale / 100);
      if (newWidth < 1500) {
        image.width = 1500;
      }
      else {
        image.width = newWidth;
      }
      if (image.height < 380) {
        image.height = 380;
      }

      var currentImage = this.state.currentImage;

      currentImage.width = image.width;
      currentImage.height = image.height;

      this.setState({currentImage:currentImage});

    }

  },
  updateRange: function(e) {
    // update textual value
    this.setState({ rangeVal: e.currentTarget.valueAsNumber });
    var currentImage = this.state.currentImage;

    this.scaleImageWidth(currentImage, this.state.rangeVal);
  },
  previewFile(event) {

    var x = this.refs.file;
    var currFileObject = {};

    var file = ReactDOM.findDOMNode(x).files[0];
    if ( !(/\.(png|jpeg|jpg)$/i).test(file.name) ) {

      console.warn('Unsupported Image extension', file.name);
      return;

    }
    if (file && file.size) {
      currFileObject.name = file.name;
      currFileObject.size = Math.round(file.size/1024);
      currFileObject.type = file.type;
    }

    var reader = new FileReader();

    reader.readAsDataURL(file);

    reader.addEventListener("load", function (output) {

      currFileObject.url = output.target.result;


      var image  = new Image();
      image.addEventListener("load", function () {

        currFileObject.width = image.width;
        currFileObject.height = image.height;

        this.setState({currentImage:currFileObject, originalImage:currFileObject});


      }.bind(this));

      image.src = currFileObject.url;

    }.bind(this), false);

  },
  uploadFile(event) {
    event.preventDefault();
    var x = this.refs.file;

    //var file = x.getDOMNode(x).files[0];
    var file = ReactDOM.findDOMNode(x).files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);


    reader.addEventListener("load", function (output) {
      let imgSrcString = output.target.result;

      this.setState({currentImage:{url:imgSrcString}});
    }, false);


    reader.onload = function(output){

      let imgBlob = output.target.result;

      console.log('|  Image Blob:  ', imgBlob);
    }.bind(this);


  },
  closeStatsDialog() {
    var scope = this.props.scope;
    scope.$apply(function() {
      scope.bannerImageCtx.closeImageStats();
    });
  },
  getMinZoomLevel() {
    var scope = this.props.scope;

    return 0;
  },
  render() {
    var imagePreviewUrl = '';
    var currImg = this.state.currentImage;
    var scope = this.props.scope;
    var minZoom = this.getMinZoomLevel();


    var imageTag, imageStatsList;

    if (currImg && currImg.url) {
      imageTag =  (React.createElement("img", {className: "BannerImagePreview__Image BannerImagePreview__Image--landscape", src: currImg.url}));

      if (scope.bannerImageCtx && scope.bannerImageCtx.isShowImageStats) {
        imageStatsList = (
          React.createElement("div", {className: "BannerImagePreviewStats BannerImagePreviewStats__Container"}, 
            React.createElement("h2", {className: "BannerImagePreviewStats__Title"}, "Image stats"), React.createElement("button", {onClick: this.closeStatsDialog}, "(x)"), 
            React.createElement("ul", {className: "BannerImagePreviewStats__List"}, 
              React.createElement("li", null, 
                React.createElement("div", {className: "Layout"}, 
                  React.createElement("label", {className: "BannerImagePreviewStats__Label"}, "type"), 
                  React.createElement("div", {className: "BannerImagePreviewStats__Value"}, currImg.type)
                )
              ), 
              React.createElement("li", null, 
                React.createElement("div", {className: "Layout"}, 
                  React.createElement("label", {className: "BannerImagePreviewStats__Label"}, "name"), 
                  React.createElement("div", {className: "BannerImagePreviewStats__Value"}, currImg.name)
                )
              ), 
              React.createElement("li", null, 
                React.createElement("div", {className: "Layout"}, 
                  React.createElement("label", {className: "BannerImagePreviewStats__Label"}, "size"), 
                  React.createElement("div", {className: "BannerImagePreviewStats__Value"}, currImg.size, "kb")
                )
              ), 
              React.createElement("li", null, 
                React.createElement("div", {className: "Layout"}, 
                  React.createElement("label", {className: "BannerImagePreviewStats__Label"}, "height"), 
                  React.createElement("div", {className: "BannerImagePreviewStats__Value"}, currImg.height)
                )
              ), 
              React.createElement("li", null, 
                React.createElement("div", {className: "Layout"}, 
                  React.createElement("label", {className: "BannerImagePreviewStats__Label"}, "width"), 
                  React.createElement("div", {className: "BannerImagePreviewStats__Value"}, currImg.width)
                )
              )
            )
          )
        );
      }


    }


    return (
      React.createElement("div", {className: "BannerImageUpload BannerImageUpload__Container"}, 
        React.createElement("div", null, 
          React.createElement("div", {className: "BannerImagePreview BannerImagePreview__Container"}, 
            imageTag
          ), 
          React.createElement("div", {className: "BannerImagePreview__Controls"}, 
            React.createElement("input", {type: "file", name: "file", onChange: this.previewFile, ref: "file", defaultValue: this.state.file}), React.createElement("br", null), 
            React.createElement("input", {type: "range", min: "0", max: "100", 
                   onChange: this.updateRange, 
                   value: this.state.rangeVal})
          )

        ), 
        React.createElement("div", {className: "BannerImageUploadStats BannerImageUploadStats__Container"}, 
          imageStatsList
        )

      )
    );
  }
});
sm.SingleImageUpload = React.createClass({
  displayName: "SingleImageUpload",
  getInitialState() { return {currentImage:{}}; },

  previewFile(event) {

    var x = this.refs.file;
    var currFileObject = {};

    var file = ReactDOM.findDOMNode(x).files[0];
    if ( !(/\.(png|jpeg|jpg)$/i).test(file.name) ) {

      console.warn('Unsupported Image extension', file.name);
      return;

    }
    if (file && file.size) {
      currFileObject.name = file.name;
      currFileObject.size = Math.round(file.size/1024);
      currFileObject.type = file.type;
    }

    var reader = new FileReader();

    reader.readAsDataURL(file);

    reader.addEventListener("load", function (output) {

      currFileObject.url = output.target.result;


      var image  = new Image();
      image.addEventListener("load", function () {

        currFileObject.width = image.width;
        currFileObject.height = image.height;

        this.setState({currentImage:currFileObject});


      }.bind(this));

      image.src = currFileObject.url;

    }.bind(this), false);

  },
  uploadFile(event) {
    event.preventDefault();
    var x = this.refs.file;

    //var file = x.getDOMNode(x).files[0];
    var file = ReactDOM.findDOMNode(x).files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);


    reader.addEventListener("load", function (output) {
      let imgSrcString = output.target.result;

      this.setState({currentImage:{url:imgSrcString}});
    }, false);


    reader.onload = function(output){

      let imgBlob = output.target.result;

      console.log('|  Image Blob:  ', imgBlob);
    }.bind(this);


  },
  render() {
    var imagePreviewUrl = '';
    var currImg = this.state.currentImage;

    var imageTag, imageStatsList;

    if (currImg && currImg.url) {
      imageTag =  (React.createElement("img", {className: "AvatarPreview__Image AvatarPreview__Image--landscape", src: currImg.url}));

      imageStatsList = (
        React.createElement("div", {className: "AvatarPreviewStats AvatarPreviewStats__Container"}, 
          React.createElement("ul", {className: "AvatarPreviewStats__List"}, 
            React.createElement("li", null, 
              React.createElement("div", {className: "Layout"}, 
                React.createElement("label", {className: "AvatarPreviewStats__Label"}, "type"), 
                React.createElement("div", {className: "AvatarPreviewStats__Value"}, currImg.type)
              )
            ), 
            React.createElement("li", null, 
              React.createElement("div", {className: "Layout"}, 
                React.createElement("label", {className: "AvatarPreviewStats__Label"}, "name"), 
                React.createElement("div", {className: "AvatarPreviewStats__Value"}, currImg.name)
              )
            ), 
            React.createElement("li", null, 
              React.createElement("div", {className: "Layout"}, 
                React.createElement("label", {className: "AvatarPreviewStats__Label"}, "size"), 
                React.createElement("div", {className: "AvatarPreviewStats__Value"}, currImg.size, "kb")
              )
            ), 
            React.createElement("li", null, 
              React.createElement("div", {className: "Layout"}, 
                React.createElement("label", {className: "AvatarPreviewStats__Label"}, "height"), 
                React.createElement("div", {className: "AvatarPreviewStats__Value"}, currImg.height)
              )
            ), 
            React.createElement("li", null, 
              React.createElement("div", {className: "Layout"}, 
                React.createElement("label", {className: "AvatarPreviewStats__Label"}, "width"), 
                React.createElement("div", {className: "AvatarPreviewStats__Value"}, currImg.width)
              )
            )
          )
        )
      );

    }


    return (
      React.createElement("div", {className: "Layout"}, 
        React.createElement("div", null, 
          React.createElement("input", {type: "file", name: "file", onChange: this.previewFile, ref: "file", defaultValue: this.state.file}), React.createElement("br", null), 
          React.createElement("div", {className: "AvatarPreview AvatarPreview__Container"}, 
            imageTag
          )
        ), 
        React.createElement("div", {className: "AvatarUploadStats AvatarUploadStats__Container"}, 
          imageStatsList
        )

      )
    );
  }
});





//fileUpload.set({
//  file: output.target.result
//});
//$.when(fileUpload.save()).done(function(){
//  this.setState({uploaded: true});
//});

