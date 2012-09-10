
ko.extenders.integerOnly = function(target, config) {
  return ko.computed({
    read: target,
    write: function(newValue) {
      var current, valueToWrite;
      current = target();
      valueToWrite = parseInt(newValue);
      if (isNaN(valueToWrite) || valueToWrite < 0) {
        valueToWrite = 0;
      }
      if (config === "adult" && valueToWrite < 1) {
        valueToWrite = 1;
      }
      if (config === "infant" && valueToWrite > 4) {
        valueToWrite = 4;
      }
      if (valueToWrite !== current) {
        target(valueToWrite);
      }
      if (newValue !== current) {
        return target.notifySubscribers(valueToWrite);
      }
    }
  });
};
