const MAX_NODES = 10;
const MIN_NODES = 7;
const MAX_VALUE = 60;
const MIN_VALUE = 1;
var i = 0;
// Node class
class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

// Binary Search tree class
class BinarySearchTree {
  constructor() {
    // root of a binary seach tree
    this.root = null;
  }

  // insert(data)
  insert(data) {
    // Creating a node and initailising
    // with data
    var newNode = new Node(data);

    // root is null then node will
    // be added to the tree and made root.
    if (this.root === null) this.root = newNode;
    // find the correct position in the
    // tree and add the node
    else this.insertNode(this.root, newNode);
  }

  // Method to insert a node in a tree
  // it moves over the tree to find the location
  // to insert a node with a given data
  insertNode(node, newNode) {
    // if the data is less than the node
    // data move left of the tree
    var nodeText = "e" + i;
    var HiddenNode = new Node(nodeText);
    if (node === null) {
      node = newNode;
    } else if (newNode.data < node.data) {
      // if left is null insert node here
      if (node.left === null || isNaN(node.left.data)) {
        node.left = newNode;
        if (node.right === null) {
          node.right = HiddenNode;
          i++;
        }
      }
      // if left is not null recur until
      // null is found
      else this.insertNode(node.left, newNode);
    }

    // if the data is more than the node
    // data move right of the tree
    else {
      // if right is null insert node here
      if (node.right === null || isNaN(node.right.data)) {
        if (node.left === null) {
          node.left = HiddenNode;
          i++;
        }
        node.right = newNode;
      } else {
        // if right is not null recur until
        // null is found
        this.insertNode(node.right, newNode);
      }
    }
  }
  // remove(data)
  remove(data) {
    // root is re-initialized with
    // root of a modified tree.
    this.root = this.removeNode(this.root, data);
  }

  // Method to remove node with a
  // given data
  // it recur over the tree to find the
  // data and removes it
  removeNode(node, key) {
    // if the root is null then tree is
    // empty
    if (node === null) return null;
    // if data to be delete is less than
    // roots data then move to left subtree
    else if (key < node.data) {
      node.left = this.removeNode(node.left, key);
      return node;
    }

    // if data to be delete is greater than
    // roots data then move to right subtree
    else if (key > node.data) {
      node.right = this.removeNode(node.right, key);
      return node;
    }

    // if data is similar to the root's data
    // then delete this node
    else {
      // deleting node with no children
      if (node.left === null && node.right === null) {
        node = null;
        return node;
      }

      // deleting node with one children
      if (node.left === null) {
        node = node.right;
        return node;
      } else if (node.right === null) {
        node = node.left;
        return node;
      }

      // Deleting node with two children
      // minumum node of the rigt subtree
      // is stored in aux
      var aux = this.findMinNode(node.right);
      node.data = aux.data;

      node.right = this.removeNode(node.right, aux.data);
      return node;
    }
  }

  inorder(node) {
    if (node !== null) {
      this.inorder(node.left);
      console.log(node.data);
      this.inorder(node.right);
    }
  }
  postorder(node) {
    if (node !== null) {
      this.postorder(node.left);
      this.postorder(node.right);
      console.log(node.data);
    }
  }

  preorder(node) {
    if (node !== null) {
      console.log(node.data);
      this.preorder(node.left);
      this.preorder(node.right);
      
    }
  }

  findMinNode(node) {
    // if left of a node is null
    // then it must be minimum node
    if (node.left === null) return node;
    else return this.findMinNode(node.left);
  }

  // returns root of the tree
  getRootNode() {
    return this.root;
  }

  // search for a node with given data
  search(node, data) {
    // if trees is empty return null
    if (node === null) return null;
    // if data is less than node's data
    // move left
    else if (data < node.data) return this.search(node.left, data);
    // if data is less than node's data
    // move left
    else if (data > node.data) return this.search(node.right, data);
    // if data is equal to the node data
    // return node
    else return node;
  }
}

/* FUNCTIONS TO CREATE THE BST, RANDOM OR MANUAL  
    arrayData --> vector [numbers].
    BST --> BST instance (new BinarySearchTree)
*/
function createBST(arrayData, BST) {
  arrayData.forEach((n) => {
    BST.insert(n);
  });
}
/* FILL THE arratData with random values */
function randomBST(arrayData) {
  var n_nodos = Math.floor(Math.random() * (MAX_NODES - MIN_NODES)) + MIN_NODES;
  for (var i = 0; i < n_nodos; i++) {
    var randomValue = Math.floor(Math.random() * MAX_VALUE) + 1;
    if (!arrayData.includes(randomValue)) {
      arrayData.push(randomValue);
    }
  }
  return arrayData;
}

function generateRandomBST(BST, divClass) {
  d3.select('svg').remove();
  var random = []; // RANDOM ARRAY
  //BST = new BinarySearchTree();
  randomBST(random); // FILLING THE ARRAY WITH RANDOM NUMBERS
  console.log(random);
  createBST(random, BST); // CREATING THE BST

  /* LET'S DRAW THE BINARY SEARCH TREE WITH D3.js */
  var dataNodes = []; // LET'S GIVE FORMAT TO OUR DATA
  var rootNode = BST.getRootNode(); // WE GET THE ROOT NODE OF OUR TREE

  var id = rootNode.data;
  var parentId = null;

  dataNodes.push({ id, parentId }); // WE NEED TO ADD MANUALLY THE ROOT ELEMENT
  transformData(rootNode, dataNodes);

  /* ------------------------ PARSING THE DATA --------------------------------------------------- */
  const idMapping = dataNodes.reduce((acc, el, i) => {
    acc[el.id] = i;
    return acc;
  }, {});

  dataNodes.forEach((el) => {
    // Handle the root element
    if (el.parentId === null) {
      root = el;
      return;
    }
    // Use our mapping to locate the parent element in our dataNodes array
    const parentEl = dataNodes[idMapping[el.parentId]];
    // Add our current el to its parent's `children` array
    parentEl.children = [...(parentEl.children || []), el];
  });
  drawBST(divClass);
}

function generateFixedBST(BST, arrayNumbers ,divClass) {
  d3.select('svg').remove();
  createBST(arrayNumbers, BST); // CREATING THE BST

  /* LET'S DRAW THE BINARY SEARCH TREE WITH D3.js */
  var dataNodes = []; // LET'S GIVE FORMAT TO OUR DATA
  var rootNode = BST.getRootNode(); // WE GET THE ROOT NODE OF OUR TREE

  var id = rootNode.data;
  var parentId = null;

  dataNodes.push({ id, parentId }); // WE NEED TO ADD MANUALLY THE ROOT ELEMENT
  transformData(rootNode, dataNodes);

  /* ------------------------ PARSING THE DATA --------------------------------------------------- */
  const idMapping = dataNodes.reduce((acc, el, i) => {
    acc[el.id] = i;
    return acc;
  }, {});

  dataNodes.forEach((el) => {
    // Handle the root element
    if (el.parentId === null) {
      root = el;
      return;
    }
    // Use our mapping to locate the parent element in our dataNodes array
    const parentEl = dataNodes[idMapping[el.parentId]];
    // Add our current el to its parent's `children` array
    parentEl.children = [...(parentEl.children || []), el];
  });
  drawBST(divClass);
}
/* -------------------------------------------------------------------------------- */

/* ----------------------- PARSING THE DATA TO JSON VALID FORMAT ------------------ */
function transformData(node, dataNodes) {
  var parentId, id;
  if (node == null) return;
  parentId = node.data;
  if (node.left != null) {
    id = node.left.data;
    dataNodes.push({ id, parentId });
  }
  if (node.right != null) {
    id = node.right.data;
    dataNodes.push({ id, parentId });
  }
  transformData(node.left, dataNodes);
  transformData(node.right, dataNodes);
}
/*
vector[1,2,3,...] --->  {id - parent}
var treeData = [
        { id: 56, parentId: 62 },
        { id: 81, parentId: 80 },
        { id: 74, parentId: null },
        { id: 76, parentId: 80 },
        { id: 63, parentId: 62 },
        { id: 80, parentId: 86 },
        { id: 87, parentId: 86 },
        { id: 62, parentId: 74 },
        { id: 86, parentId: 74 },
      ];*/

/* -------------------------------------------------------------------------------- */
/* ----------------------- ANIMATED ALGORITMHS ------------------------------------ */
const ANIMATION_TIME = 750;
const COLOR_FILL = "#000058"; // when algorithms paints
const COLOR_STROKE = "darkorange"; // current position of algorithms
const COLOR_NORMAL = "rgb(55, 109, 179)";
const STROKE_NORMAL = "white";
var timeInt = 0;

function inOrderAnimation(node) {
  if (node !== null && !isNaN(node.data)) {
    var circleOrder = "#c" + node.data + "";
    var xOrder = d3.select(circleOrder);

    setTimeout(function () {
      xOrder.transition().duration(300).style("stroke", COLOR_STROKE);
    }, ANIMATION_TIME * timeInt++);
    inOrderAnimation(node.left);
    // code here
    var circleId = "#c" + node.data + "";
    var x = d3.select(circleId);

    setTimeout(function () {
      x.transition().duration(150).style("fill", COLOR_FILL);
      //document.getElementById("output").innerHTML += node.data + " ";
    }, ANIMATION_TIME * timeInt++);

    inOrderAnimation(node.right);
  }
}

function postOrderAnimation(node) {
  if (node !== null && !isNaN(node.data)) {
    var circleOrder = "#c" + node.data + "";
    var xOrder = d3.select(circleOrder);

    setTimeout(function () {
      xOrder.transition().duration(300).style("stroke", COLOR_STROKE);
    }, ANIMATION_TIME * timeInt++);
    postOrderAnimation(node.left);
    postOrderAnimation(node.right);

    var circleId = "#c" + node.data + "";
    var x = d3.select(circleId);

    setTimeout(function () {
      x.transition().duration(150).style("fill", COLOR_FILL);
    }, ANIMATION_TIME * timeInt++);
  }
}
function preOrderAnimation(node) {
  if (node !== null && !isNaN(node.data)) {
    var circleOrder = "#c" + node.data + "";
    var xOrder = d3.select(circleOrder);

    setTimeout(function () {
      xOrder.transition().duration(300).style("stroke", COLOR_STROKE);
    }, ANIMATION_TIME * timeInt++);
    var circleId = "#c" + node.data + "";
    var x = d3.select(circleId);

    setTimeout(function () {
      x.transition().duration(150).style("fill", COLOR_FILL);
    }, ANIMATION_TIME * timeInt++);
    
    preOrderAnimation(node.left);
    preOrderAnimation(node.right);
  }
}

function getBackToNormal(node) {
  d3.selectAll("circle")
    .style("fill", function (d) {
      if (!this.id.includes("e")) {
        return COLOR_NORMAL;
      }
    })
    .style("stroke", function (d) {
      if (!this.id.includes("e")) {
        return STROKE_NORMAL;
      }
    });
}
/* -------------------------------------------------------------------------------- */

/* ------------------------------- ANIMATE HANDLERS ------------------------------- */
const COLOR_MOUSE_OVER = "#000058";
const COLOR_MOUSE_OUT = "rgb(55, 109, 179)";
const FONT_SIZE_MOUSE_OVER = "20px";
const FONT_SIZE_MOUSE_OUT = "14px";

function handleMouseOver(d, i) {
  var idCircle = "#c" + d.id + "";
  if (this.id.includes("e")) {
    return;
  }
  d3.select(idCircle)
    .attr({
      r: 20 * 1.5,
    })
    .style("fill", COLOR_MOUSE_OVER);
  var idText = "#t-" + d.id + "";

  d3.select(idText).style("font-size", FONT_SIZE_MOUSE_OVER);
}
function handleMouseOut(d, i) {
  var idCircle = "#c" + d.id + "";
  if (this.id.includes("e")) {
    return;
  }
  d3.select(idCircle)
    .attr({
      r: 20,
    })
    .style("fill", COLOR_MOUSE_OUT);
  var idText = "#t-" + d.id + "";

  d3.select(idText).style("font-size", FONT_SIZE_MOUSE_OUT);
}

/* -------------------------------------------------------------------------------- */
/* -------------------------------- DRAW THE BST ---------------------------------- */
const MARGIN_TOP = 40;
const MARGIN_RIGHT = 0;
const MARGIN_BOTTOM = 20;
const MARGIN_LEFT = 0;
const WIDTH_VALUE = 700;
const HEIGTH_VALUE = 600;
const DEPTH_VALUE = 55;

function drawBST(div_class) {
  var margin = {
      top: MARGIN_TOP,
      right: MARGIN_RIGHT,
      bottom: MARGIN_BOTTOM,
      left: MARGIN_LEFT,
    },
    width = WIDTH_VALUE - margin.right - margin.left,
    height = HEIGTH_VALUE - margin.top - margin.bottom;

  var i = 0;

  var tree = d3.layout.tree().size([height, width]);

  var diagonal = d3.svg.diagonal().projection(function (d) {
    return [d.x, d.y];
  });

  var svg = d3
    .select(div_class)
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  update(root);

  function update(source) {
    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);
    //console.log(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
      d.y = d.depth * DEPTH_VALUE;
    });

    nodes.forEach(function separation(a, b) {
      return a.parent == b.parent ? 1 : 3;
    });
    // Declare the nodes…
    var dNode = svg.selectAll("g.node").data(nodes, function (d) {
      return d.id;
    });

    // Enter the nodes.
    var nodeEnter = dNode
      .enter()
      .append("g")
      .attr("class", function (d) {
        if (isNaN(d.id)) {
          return "nhidden";
        }
        return "node";
      })
      .attr("id", function (d) {
        return "n-" + d.id;
      })
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    nodeEnter
      .append("circle")
      .attr("r", 20)
      .attr("id", function (d) {
        return "c" + d.id;
      })
      .style("fill", function (d) {
        if (isNaN(d.id)) {
          return "#f3e9dc";
        }
        return "rgb(55, 109, 179)";
      });

    nodeEnter
      .append("text")
      .attr("y", function (d) {
        return d.children || d._children ? 0 : 0;
      })
      .attr("dy", ".35em")
      .attr("id", function (d) {
        return "t-" + d.id;
      })
      .attr("class", "textId")
      .attr("text-anchor", "middle")
      .text(function (d) {
        if (!isNaN(d.id)) return d.id;
      })
      .style("fill-opacity", 1)
      .style("fill", "orange")
      .style("font-size", "14px");

    // Declare the links…
    var link = svg.selectAll("path.link").data(links, function (d) {
      return d.target.id;
    });

    // Enter the links.
    link
      .enter()
      .insert("path", "g")
      .attr("class", function (d) {
        if (isNaN(d.target.id)) {
          return "lhidden"; /* WE HAVE TO INSERT EMPTY NODES TO GET A BST NICE VIEW :), THEN JUST HIDDE THEM*/
        }
        return "link";
      })
      .attr("d", diagonal)
      .attr("id", function (d) {
        return "l" + d.source.id + "-" + d.target.id;
      });
  }
}

/* --------------------------------------------------------------------------------- */


