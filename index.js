module.exports = function(content) {
  this.cacheable && this.cacheable();
  this.value = content;
  return "import css from 'styled-jsx/css';\n\nexport default css`" + content + "`;";
};