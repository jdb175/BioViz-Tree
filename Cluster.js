/*
	Take the given JSON data and process it into a tree
*/
function process(d) {
	var nodeCounter = 0; //how many nodes we've creates (for naming)
	var parentlessNodes = []; 
	var root = null;

	//first we create parentless nodes with the numerical value of each item
	for( var i = 0; i < d.length; ++i ) {
		var node = { dist: numericValue(d[i]), name : d[i].name, parent : "null"};
		parentlessNodes.push(node);
	}
	var p = 0;
	while(parentlessNodes.length > 1 && p < 15) {
		var minDist = Number.MAX_VALUE;
		var index_i; //the closest index from 'i' loop
		var index_j; //the closest index from 'j' loop
		var node_i; //the closest node from 'i' loop
		var node_j; //the closest node from 'j' loop

		//loop through all parentless nodes
		for( var i = 0; i < parentlessNodes.length; ++i ) {
			//and compare to all other parentless nodes
			for (var j = i+1; j < parentlessNodes.length; ++j) {
				//get distance between current comparator nodes
				var n_i = parentlessNodes[i];
				var n_j = parentlessNodes[j];
				dist = Math.abs(n_i.dist - n_j.dist);

				//first we handle adding children to existing equivalent parents
				//if there is no distance. In these cases we just add the node as
				//a child and remove it, without having to change the looping
				//aside from decrementing a counter due to element removal
				if(dist == 0 && n_j.children != null) {
					n_i.parent = n_j.name;
					n_j.children.push(n_i);
					parentlessNodes.splice(i, 1);
					i--;
				} else if(dist == 0 && n_i.children != null) {
					n_j.parent = n_i.name;
					n_i.children.push(n_j);
					parentlessNodes.splice(j, 1);
					j--;
				//otherwise we compare to see the closest pair to combine
				} else if(dist < minDist) {
					minDist = dist;
					index_i = i;
					index_j = j; 
				}
			}
		}
		//remove closest pair from list
		node_i = parentlessNodes[index_i];
		node_j = parentlessNodes[index_j];

		parentlessNodes.splice(index_i, 1);
		parentlessNodes.splice(index_j-1, 1);

		//create a parent node with their average distance
		var avgDist =  (node_i.dist + node_j.dist)/2;
		node_i["parent"] = "Node"+nodeCounter;
		node_j["parent"] = "Node"+nodeCounter;
		var newNode = {dist: avgDist, name: "Node"+nodeCounter, children: [node_i, node_j], parent:"null"};
		nodeCounter++;

		//insert into array
		parentlessNodes.push(newNode);

		//save as current best guess at root
		root = newNode;
	}
	return root;
}

function numericValue(item) {
	var sum = 0;
	for(var i = 0; i < item.data.length; ++i){
		sum += item.data[i];
	}
	return sum;
}