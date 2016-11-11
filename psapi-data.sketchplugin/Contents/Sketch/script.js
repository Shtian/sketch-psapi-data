var onRun = function(context) {
  var selection = context.selection;

  var plugs = getPlugsFromAPI();
  var currentPlugImage = 0;
  var currentPlugText = 0;
  for (var j = 0; j < selection.length; j++) {
    layer = selection[j];
    if (isLayerText(layer)) {
      layer.setStringValue(plugs[currentPlugText].title);
      currentPlugText++;
    } else if (isLayerImage(layer) || isLayerShape(layer)) {
      var imagedata = getImageFromRemoteURL(plugs[currentPlugImage].image)
      var fill = layer.style().fills().firstObject()
      if (!fill) fill = layer.style().addStylePartOfType(0);
      fill.setFillType(4);
      fill.setPatternFillType(1);
      fill.setIsEnabled(true);
      fill.setImage(imagedata);
      currentPlugImage++;
    }
  }

  // Checks if the layer is a text layer.
  function isLayerText(layer) {
    return layer.isKindOfClass(MSTextLayer.class());
  }

  function isLayerImage(layer) {
    return layer.isKindOfClass(MSBitmapLayer.class());
  }

  function isLayerShape(layer) {
    return layer.isKindOfClass(MSShapeGroup.class());
  }

  function getJSON(url) {
    var request = NSURLRequest.requestWithURL(NSURL.URLWithString(url));
    var response = NSURLConnection.sendSynchronousRequest_returningResponse_error(request, null, null);
    return JSON.parse(NSString.alloc().initWithData_encoding(response, NSUTF8StringEncoding));
  }

  function getPlugsFromAPI() {
    var result = getJSON("http://psapi.nrk.no/medium/tv/plugs?maxnumber=50");
    var plugs = [];
    for (var i = 0; i < result.length; i++) {
      var currentPlug = result[i];
      var title = currentPlug.seriesTitle || currentPlug.programTitle;
      var plug = {
        image: currentPlug.image.webImages[5].imageUrl,
        title: title
      };
      plugs.push(plug);
    }
    return plugs;
  }

  function getImageFromRemoteURL(urlString) {
    //get data from url
    var url = NSURL.URLWithString(urlString)
    var data = url.resourceDataUsingCache(false)
    if (!data) return

    //create image from data
    var image = NSImage.alloc().initWithData(data)
    return MSImageData.alloc().initWithImage_convertColorSpace(image, false);
  }
}
