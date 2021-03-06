sm.BannerImageUpload = React.createClass({
  displayName: "BannerImageUpload",
  getInitialState() { return {currentImage:{}, rangeVal: 100}; },
  updateRange: function(e) {
    // update textual value
    this.setState({ rangeVal: e.currentTarget.valueAsNumber });
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
      imageTag =  (<img className="BannerImagePreview__Image BannerImagePreview__Image--landscape" src={currImg.url} />);

      if (scope.bannerImageCtx.isShowImageStats) {
        imageStatsList = (
          <div className="BannerImagePreviewStats BannerImagePreviewStats__Container">
            <h2 className="BannerImagePreviewStats__Title">Image stats</h2><button onClick={this.closeStatsDialog}>(x)</button>
            <ul className="BannerImagePreviewStats__List">
              <li>
                <div className="Layout">
                  <label className="BannerImagePreviewStats__Label">type</label>
                  <div className="BannerImagePreviewStats__Value">{currImg.type}</div>
                </div>
              </li>
              <li>
                <div className="Layout">
                  <label className="BannerImagePreviewStats__Label">name</label>
                  <div className="BannerImagePreviewStats__Value">{currImg.name}</div>
                </div>
              </li>
              <li>
                <div className="Layout">
                  <label className="BannerImagePreviewStats__Label">size</label>
                  <div className="BannerImagePreviewStats__Value">{currImg.size}kb</div>
                </div>
              </li>
              <li>
                <div className="Layout">
                  <label className="BannerImagePreviewStats__Label">height</label>
                  <div className="BannerImagePreviewStats__Value">{currImg.height}</div>
                </div>
              </li>
              <li>
                <div className="Layout">
                  <label className="BannerImagePreviewStats__Label">width</label>
                  <div className="BannerImagePreviewStats__Value">{currImg.width}</div>
                </div>
              </li>
            </ul>
          </div>
        );
      }


    }


    return (
      <div className="BannerImageUpload BannerImageUpload__Container">
        <div>
          <div className="BannerImagePreview BannerImagePreview__Container">
            {imageTag}
          </div>
          <div className="BannerImagePreview__Controls">
            <input type="file" name="file" onChange={this.previewFile} ref="file" defaultValue={this.state.file} /><br />
            <input type="range" min="0" max="100"
                   onChange={this.updateRange}
                   value={this.state.rangeVal} />
          </div>

        </div>
        <div className="BannerImageUploadStats BannerImageUploadStats__Container">
          {imageStatsList}
        </div>

      </div>
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
      imageTag =  (<img className="AvatarPreview__Image AvatarPreview__Image--landscape" src={currImg.url} />);

      imageStatsList = (
        <div className="AvatarPreviewStats AvatarPreviewStats__Container">
          <ul className="AvatarPreviewStats__List">
            <li>
              <div className="Layout">
                <label className="AvatarPreviewStats__Label">type</label>
                <div className="AvatarPreviewStats__Value">{currImg.type}</div>
              </div>
            </li>
            <li>
              <div className="Layout">
                <label className="AvatarPreviewStats__Label">name</label>
                <div className="AvatarPreviewStats__Value">{currImg.name}</div>
              </div>
            </li>
            <li>
              <div className="Layout">
                <label className="AvatarPreviewStats__Label">size</label>
                <div className="AvatarPreviewStats__Value">{currImg.size}kb</div>
              </div>
            </li>
            <li>
              <div className="Layout">
                <label className="AvatarPreviewStats__Label">height</label>
                <div className="AvatarPreviewStats__Value">{currImg.height}</div>
              </div>
            </li>
            <li>
              <div className="Layout">
                <label className="AvatarPreviewStats__Label">width</label>
                <div className="AvatarPreviewStats__Value">{currImg.width}</div>
              </div>
            </li>
          </ul>
        </div>
      );

    }


    return (
      <div className="Layout">
        <div>
          <input type="file" name="file" onChange={this.previewFile} ref="file" defaultValue={this.state.file} /><br />
          <div className="AvatarPreview AvatarPreview__Container">
            {imageTag}
          </div>
        </div>
        <div className="AvatarUploadStats AvatarUploadStats__Container">
          {imageStatsList}
        </div>

      </div>
    );
  }
});





//fileUpload.set({
//  file: output.target.result
//});
//$.when(fileUpload.save()).done(function(){
//  this.setState({uploaded: true});
//});

