module.exports = function(content) {
  this.cacheable && this.cacheable();
  this.value = content;

  // Escape backticks and backslashes: “`” ⇒ “\`”, “\” ⇒ “\\”
  var escapedContent = content.replace(/[`\\]/g, function(match) {
    return "\\" + match;
  });

  return "import css from 'styled-jsx/css';\n\nexport default css`" + escapedContent + "`;";
};