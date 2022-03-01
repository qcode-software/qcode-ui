/*
  Find the element whose DOM location relative to otherRoot
  is the same as element's postion relative to root.
  eg. If element is the 3rd child of the 5th child of root,
  find the 3rd child of the 5th child of otherRoot
*/

qcode.equivalentDescendant = function(root, element, otherRoot) {
    "use strict";
    const path = qcode.indexPath(root, element);
    if ( path instanceof Array ) {
        return qcode.getElementByIndexPath(otherRoot, path);
    } else {
        return null
    }
};

qcode.indexPath = function(root, element) {
    "use strict";
    if ( root == element ) {
        return [];
    }
    const path = [qcode.index(element)];
    let parent = element.parentElement;
    while ( true ) {
        if ( parent == root ) {
            return path
        }
        if ( parent.parentElement instanceof HTMLElement ) {
            path.unshift(qcode.index(parent));
            parent = parent.parentElement;
        } else {
            return null
        }
    }
};

qcode.getElementByIndexPath = function(root, indexPath) {
    "use strict";
    let result = root;
    for (const index of indexPath) {
        result = result.children[index];
    }
    return result;
};
