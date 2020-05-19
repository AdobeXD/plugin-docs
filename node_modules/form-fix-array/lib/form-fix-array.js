var endsWith;

endsWith = function(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

module.exports = function(formFields) {
  var correctedFormFields, fieldKey, fieldValue, newKey;
  correctedFormFields = {};
  for (fieldKey in formFields) {
    fieldValue = formFields[fieldKey];
    newKey = (function() {
      switch (Array.isArray(fieldValue)) {
        case false:
          return fieldKey;
        case true:
          if (endsWith(fieldKey, "[]")) {
            return fieldKey;
          } else {
            return fieldKey + "[]";
          }
      }
    })();
    correctedFormFields[newKey] = fieldValue;
  }
  return correctedFormFields;
};
