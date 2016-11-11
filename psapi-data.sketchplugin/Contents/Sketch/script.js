var onRun = function(context) {
  var doc = context.document;
  var selection = context.selection;

  var result = getJSON("http://psapi.nrk.no/medium/tv/plugs?maxnumber=50");
  var plugs = [];
  for (var i = 0; i < result.length; i++) {
    var plug = {
      image: result[i].image.webImages[5].imageUrl,
      title: result[i].title
    };
    plugs.push(plug);
  }

  for (var j = 0; j < selection.length; j++) {
    layer = selection[j];
    if (isLayerText(layer)) {
      layer.setStringValue(plugs[j].title);
    } else if (isLayerImage(layer) || isLayerShape(layer)) {
      var url = getImageFromRemoteURL(plugs[j].image)
      var imagedata = MSImageData.alloc().initWithImage_convertColorSpace(url, false);
      var fill = layer.style().fills().firstObject()
      if (!fill) fill = layer.style().addStylePartOfType(0);
      fill.setFillType(4);
      fill.setPatternFillType(1);
      fill.setIsEnabled(true);
      fill.setImage(imagedata);
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

  function getImageFromRemoteURL(urlString) {
    //get data from url
    var url = NSURL.URLWithString(urlString)
    var data = url.resourceDataUsingCache(false)
    if (!data) return

    //create image from data
    var image = NSImage.alloc().initWithData(data)
    return image
  }

  // Refreshes text layer boundaries after setting text.
  function refreshTextLayer(layer) {
    layer.setHeightIsClipped(0);
    layer.adjustFrameToFit();
    layer.select_byExpandingSelection(true, false);
    layer.setIsEditingText(true);
    layer.setIsEditingText(false);
    layer.select_byExpandingSelection(false, false);
  }
}
