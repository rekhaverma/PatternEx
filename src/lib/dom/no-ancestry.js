/**
 * @param {Object} node       Current DOM node
 * @param {Object} ancestor   Ancestor DOM node
 * @return {Boolean}
 */
const noAncestry = (node, ancestor) => {
  if (!node) {
    return true;
  }

  if (node === ancestor) {
    return false;
  }

  return noAncestry(node.parentNode, ancestor);
};

export default noAncestry;
