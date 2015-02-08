var tree;
var selectedNode;
var selectedD3;
var svg;
var cluster;
var diagonal;
var root;
var radius = 800 / 2;

d3.selection.prototype.moveToFront = function() {
return this.each(function(){
this.parentNode.appendChild(this);
});
};

window.onload = function () {
	root = process(data);

	// ************** Generate the tree diagram  *****************
	// from example http://bl.ocks.org/mbostock/4339607

	cluster = d3.layout.cluster()
		.size([360, radius - 80]);

	diagonal = d3.svg.diagonal.radial()
		.projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

	svg = d3.select("svg")
		.attr("width", radius * 2)
		.attr("height", radius * 2)

	//add click plane for deselecting
	svg.append("rect")
        .attr({"class": "overlay" , "width": radius*2 , "height": radius*2})
        .attr("opacity", 0)
        .on({
          "click": clickSvg, 
        });

    svg = svg.append("g")
		.attr("transform", "translate(" + radius + "," + radius + ")");

	updateTree(root);
}

function updateTree(newRoot) {
	curRoot = newRoot;
	var nodes = cluster.nodes(newRoot);

	//handle links
	svg.selectAll(".link").remove();

	var link = svg.selectAll("path.link")
		.data(cluster.links(nodes));
	link.enter().append("path")
		.attr("class", "link")
		.attr("d", diagonal)
		.attr("opacity", 0)
		.transition()
		.attr("opacity", 1);

	//Handle nodes
	var node = svg.selectAll("g.node")
		.moveToFront()
		.data(nodes, function(d) { return d.name + "-" + (d.parent ? d.parent.name : "root");});

	//Apply Basic Styles
	var enter = node.enter()
		.append("g");
	enter
		.append("circle")
		.attr("r", 4.5);

	//Apply leaf styles
	enter.filter(function(d) { return d.children==null; })
		.attr("class", "node leaf")
		.on({
			"click": clickLeaf,
			"mouseover": hoverLeaf,
			"mouseout": hoverOff
		})
		.append("text")
		.attr("dy", ".31em")
		.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
		.attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
		.text(function(d) { return d.name; });;

	//Apply branch styles
	enter.filter(function(d) { return d.children!=null; })
		.on({
			"click": clickNode,
			"mouseover": hoverNode,
			"mouseout": hoverOff
		});

	//Apply positions for all nodes
	node.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
	//apply root style for branch root
	node.filter(function(d) { return d.children!=null; })
		.attr("class", function(d) { return d.name==curRoot.name ? "node root" : "branch node" })
	
	//Remove old
	node.exit().remove();


	d3.select(self.frameElement).style("height", radius * 2 + "px");
}

/********* LISTENERS *********/

/*
	When a branch node is clicked, recreate the tree with that node as root
*/
function clickNode(node) {
	resetPathHighlighting();
	selectedNode = null;
	updateTree(node);
	document.getElementById("BackToRoot").setAttribute("active", true);
}

/* 
	When a leaf is clicked, highlight the path to that node from the root,
	or deselect it if we clicked the selected node
 */
function clickLeaf(node) {
	d3.event.stopPropagation();
	if(selectedNode == node) {
		selectedNode = null;
		resetPathHighlighting();
		document.getElementById("Node1").innerHTML = "";
		document.getElementById("Node2").innerHTML = "";
		document.getElementById("Distance").innerHTML = "";
	} else {
		selectedNode = node;
		selectedD3 = d3.select(this);
		highlightPathSubsetWithColor(getAllParentNodes(node));
		document.getElementById("Node1").innerHTML = "<em>" + selectedNode.name + "</em> : " + selectedNode.data;
		document.getElementById("Node2").innerHTML = "";
		document.getElementById("Distance").innerHTML = "";
	}	
}

/*
	When hovering on a leaf, either lightly highlight the path to the node
	(if no node is selected), or highlight the shorest path between the hovered
	node and the selected node (if a node is selected)
*/
function hoverLeaf(node) {
	if(selectedNode == null) {
		highlightPathSubsetWithColor(getAllParentNodes(node));
		document.getElementById("Node1").innerHTML = "<em>" + node.name + "</em> : " + node.data;
	} else if(selectedNode != node) {
		document.getElementById("Distance").innerHTML = "<em>Distance</em> : " + Math.abs(node.num - selectedNode.num);
		document.getElementById("Node1").innerHTML = "<em>" + selectedNode.name + "</em> : " + selectedNode.data;
		document.getElementById("Node2").innerHTML = "<em>" + node.name + "</em> : " + node.data;
		highlightPathSubsetWithColor(getClosestConnection(node, selectedNode), "lightcoral");
	}
}

/*
	When exiting hover reset to the state before the hover
*/
function hoverOff(node) {
	document.getElementById("Distance").innerHTML = "";
	document.getElementById("Node2").innerHTML = "";

	if(selectedNode == null) {
		document.getElementById("Node1").innerHTML = "";
		resetPathHighlighting();
	} else {
		highlightPathSubsetWithColor(getAllParentNodes(selectedNode), "steelblue");
	}
}

/*
	When the background is clicked, deselect any selected leaf node
*/
function clickSvg(node) {
	selectedNode = null;
	resetPathHighlighting();
}

/*
	When hovering on a branch, highlight all children of that branch
*/
function hoverNode(node) {
	highlightPathSubsetWithColor(getAllChildNodes(node), "steelblue", "2");
}

/*
	The back to root button resets the tree centered at the root
*/
function pressBackToRoot() {
	updateTree(root);
	document.getElementById("BackToRoot").setAttribute("active", false);
}

/********* UTILITIES *********/

/*
	Highlights connections between nodes in the given set to be bolder, and
	the given color. Connections including nodes not in the set are faded out.
*/
function highlightPathSubsetWithColor(set, color, width) {
	width = typeof width !== 'undefined' ? width : 4;
	color = typeof color !== 'undefined' ? color : "steelblue";
	d3.selectAll("path.link").transition().style("stroke-opacity", function(o) {
		return contains(set, o.source) && contains(set, o.target) ? 1 : 0.3;
	})
	.style("stroke-width", function(o) {
		return contains(set, o.source) && contains(set, o.target) ? width : 1.5;
	})
	.style("stroke", function(o) {
		return contains(set, o.source) && contains(set, o.target) ? color : "#ccc";}
	);

	d3.selectAll(".node circle").transition().style("stroke", function(o) {
		return contains(set, o) ? color : "#ccc";}
	)
	.style("fill", function(o) {
		return contains(set, o) ? color : "#ccc";}
	);

	d3.selectAll(".root circle").transition().style("stroke", function(o) {
		return contains(set, o) ? color : "#ccc";}
	);

	d3.selectAll(".leaf circle").transition().style("stroke", function(o) {
		return contains(set, o) ? color : "#ccc";}
	);

	d3.selectAll(".leaf text").transition().style("fill", function(o) {
		return contains(set, o) ? color : "#ccc";}
	);
}

/*
	Resets all connections to their default style
*/
function resetPathHighlighting() {
	d3.selectAll("path.link").transition().style("stroke-opacity", 1)
		.style("stroke", "#ccc")
		.style("stroke-width", 1.5);

	d3.selectAll(".node circle")
		.transition().style("stroke", "steelblue")
		.style("fill", "steelblue");

	d3.selectAll(".root circle")
		.transition().style("stroke", "steelblue");

	d3.selectAll(".leaf circle")
		.transition().style("stroke", "steelblue");

	d3.selectAll(".leaf text").transition().style("fill", "black");
}

/*
	Returns all nodes constituting the shortest connecting path
	between the two given nodes
*/
function getClosestConnection(node, node2) {
	//first get the parents of each node
	var parents1 = getAllParentNodes(node);
	var parents2 = getAllParentNodes(node2);

	//We will return the symmetric difference of both parent sets, plus the closest mutual parent
	//this will be the shortest path between them

	//first get the closest mutual parent
	var sharedParents = parents1.filter(function(obj){ return contains(parents2, obj);});
	sharedParents = sharedParents.filter(function(obj) { return !containsAny(obj.children, sharedParents)} )
	
	//then get the symmetric difference, which is the union of the complements
	var ret1 = parents1.filter(function(obj){ return !contains(parents2, obj)});
	var ret2 = parents2.filter(function(obj){ return !contains(parents1, obj)});

	//concatenate the complements and the shared parent
	return ret1.concat(ret2).concat(sharedParents);
}

/*
	Returns all nodes in the direct path from the root
	to the given node.
*/
function getAllParentNodes(node) {
	var nodesToShow = [];
	var toVisit = [node];
	while(toVisit.length > 0) {
		var cur = toVisit.pop();
		nodesToShow.push(cur);
		if(cur.parent != "null") {
			toVisit.push(cur.parent);
		}
	}
	return nodesToShow;
}

/*
	Returns all nodes in a direct path from the given
	node's children
*/
function getAllChildNodes(node) {
	var nodesToShow = [];
	var toVisit = [node];
	while(toVisit.length > 0) {
		var cur = toVisit.pop();
		nodesToShow.push(cur);
		if(cur.children != null) {
			toVisit = toVisit.concat(cur.children);
		}
	}
	return nodesToShow;
}

/*
	Returns whether array a contains any elements
	from array b
*/
function containsAny(a, b) {
	 var i = b.length;
    while (i--) {
       if (contains(a, b[i])) {
           return true;
       }
    }
    return false;
}

/*
	returns whether array a contains the given
	object
*/
function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}
