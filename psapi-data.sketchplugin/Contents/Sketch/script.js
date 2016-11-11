var onRun = function(context) {
  var doc = context.document;
  var selection = context.selection;

  // Ask for some info
  var options = ['Truncate words', 'Truncate characters']
  var choices = createDialog('How many lines do you need?', options, 0)
  var lines = choices[1];
  var go = choices[0] == 1000 ? true : false;
  var truncateMode = choices[2];

  if(lines && go) {

    selection.forEach(function(layer){
      if(isLayerText(layer)) {
        layer.setStringValue(lines);
      }
    });
  }


  // Checks if the layer is a text layer.
  function isLayerText(layer) {
    return layer.isKindOfClass(MSTextLayer.class());
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

  function createDialog(msg, items, selectedItemIndex) {
    selectedItemIndex = selectedItemIndex || 0

    var accessoryInput = NSView.alloc().initWithFrame(NSMakeRect(0,0,300,25));
    var input = NSTextField.alloc().initWithFrame(NSMakeRect(0,0,300,25));
    input.editable = true;
    input.stringValue = '2';
    accessoryInput.addSubview(input);

    var accessoryList = NSComboBox.alloc().initWithFrame(NSMakeRect(0,0,160,25));
    accessoryList.addItemsWithObjectValues(items);
    accessoryList.selectItemAtIndex(selectedItemIndex);

    var alert = COSAlertWindow.alloc().init();
    alert.setMessageText(msg);
    alert.addButtonWithTitle('OK');
    alert.addButtonWithTitle('Cancel');
    alert.addAccessoryView(accessoryInput);
    alert.addAccessoryView(accessoryList);

    var responseCode = alert.runModal();

    return [responseCode, input.stringValue(), accessoryList.indexOfSelectedItem()];
  }

}
