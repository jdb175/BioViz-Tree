var tree;
var root;
var height;
var width;
var selectedNode;
var shiftSelectedNode;

window.onload = function () {
	root = process(data);

	// ************** Generate the tree diagram  *****************
	// from example http://bl.ocks.org/mbostock/4339607
	var width = 960,
	height = 2200;

	var radius = 960 / 2;

	var cluster = d3.layout.cluster()
		.size([360, radius - 120]);

	var diagonal = d3.svg.diagonal.radial()
		.projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

	var svg = d3.select("body").append("svg")
		.attr("width", radius * 2)
		.attr("height", radius * 2)
	.append("g")
		.attr("transform", "translate(" + radius + "," + radius + ")");

	var nodes = cluster.nodes(root);

	var link = svg.selectAll("path.link")
		.data(cluster.links(nodes))
	.enter().append("path")
		.attr("class", "link")
		.attr("d", diagonal);

	var node = svg.selectAll("g.node")
		.data(nodes)
	.enter().append("g")
		.on("click", clickNode)
		.attr("class", "node")
		.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

	node.append("circle")
		.attr("r", 4.5);

	node.append("text")
		.attr("dy", ".31em")
		.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
		.attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
		.text(function(d) { return d.name; });

	d3.select(self.frameElement).style("height", radius * 2 + "px");
}

function clickNode(node) {
	var nodesToShow;
	var color;
	if (d3.event.shiftKey && (selectedNode != null || shiftSelectedNode != null)) {
		if(selectedNode == null){
			selectedNode = shiftSelectedNode;
		}
		shiftSelectedNode = node;
		nodesToShow=getClosestConnection(selectedNode, shiftSelectedNode);
		color = "red";
    } else {
    	shiftSelectedNode = null;
		if(selectedNode == node) {
			selectedNode = null;
			d3.selectAll("path.link").transition().style("stroke-opacity", 1)
				.style("stroke", "#ccc")
				.style("stroke-width", 1.5);
			return;
		} else {
			selectedNode = node;
			nodesToShow = getAllParentNodes(node);
			color = "steelblue";
		}
	}

	d3.selectAll("path.link").transition().style("stroke-opacity", function(o) {
		return contains(nodesToShow, o.source) && contains(nodesToShow, o.target) ? 1 : 0.3;
	})
	.style("stroke-width", function(o) {
		return contains(nodesToShow, o.source) && contains(nodesToShow, o.target) ? 4 : 1.5;
	})
	.style("stroke", function(o) {
			return contains(nodesToShow, o.source) && contains(nodesToShow, o.target) ? color : "#ccc";}
		);
}

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

function containsAny(a, b) {
	 var i = b.length;
    while (i--) {
       if (contains(a, b[i])) {
           return true;
       }
    }
    return false;
}

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}
