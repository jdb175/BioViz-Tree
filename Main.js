var tree;
var root;
var height;
var width;
var selectedNode;

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
	if(selectedNode == node) {
		selectedNode = null;
		 d3.selectAll("path.link").transition().style("stroke-opacity", 1)
		.style("stroke-width", 1.5);
	} else {
		selectedNode = node;
		//fade all elements
		var nodesToShow = getAllParentNodes(node);
	    d3.selectAll("path.link").transition().style("stroke-opacity", function(o) {
			return contains(nodesToShow, o.source) && contains(nodesToShow, o.target) ? 1 : 0.3;
		})
		.style("stroke-width", function(o) {
			return contains(nodesToShow, o.source) && contains(nodesToShow, o.target) ? 4 : 1.5;
		});
	}
}

function getAllParentNodes(node) {
	var nodesToShow = [];
	var toVisit = [node];
	while(toVisit.length > 0) {
		var cur = toVisit.pop();
		nodesToShow.push(cur);
		console.log("adding " + cur.name);
		if(cur.parent != "null") {
			console.log("  --toVisit " + cur.parent.name);
			toVisit.push(cur.parent);
		}
	}
	return nodesToShow;
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
