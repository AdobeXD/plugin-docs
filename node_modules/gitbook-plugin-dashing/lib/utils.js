function replaceAll(text, find, replace) {
  return text.split(find).join(replace);
}

function dashify(text) {
  text = replaceAll(text, "---", "&mdash;")
  text = replaceAll(text, "--", "&ndash;");

  return text;
}

module.exports = {
  replaceAll: replaceAll,
  dashify: dashify
};
