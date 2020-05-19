endsWith = (str, suffix) -> str.indexOf(suffix, str.length - suffix.length) != -1

module.exports = (formFields) ->
	correctedFormFields = {}

	for fieldKey, fieldValue of formFields
		newKey = switch Array.isArray fieldValue
			when false then fieldKey
			when true
				if endsWith(fieldKey, "[]")
					fieldKey
				else
					fieldKey + "[]"

		correctedFormFields[newKey] = fieldValue

	return correctedFormFields
