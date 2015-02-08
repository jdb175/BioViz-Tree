/*
	Take the given JSON data and process it into a tree
*/
function process(d) {
	var nodeCounter = 0; //how many nodes we've creates (for naming)
	var parentlessNodes = []; 
	var allNodes = [];
	var root = null;

	//first we create parentless nodes with the numerical value of each item
	for( var i = 0; i < d.length; ++i ) {
		var node = { num: numericValue(d[i]), name : d[i].name, parent : "null"};
		parentlessNodes.push(node);
		allNodes.push(node);
	}

	//Then the first pass of the algorithm creates the simple binary tree of closest nodes
	while(parentlessNodes.length > 1) {
		var minDist = Number.MAX_VALUE;
		var index_i; //the closest index from 'i' loop
		var index_j; //the closest index from 'j' loop
		var node_i; //the closest node from 'i' loop
		var node_j; //the closest node from 'j' loop

		//loop through all parentless nodes
		for( var i = 0; i < parentlessNodes.length-1; ++i ) {
			//and compare to all other parentless nodes
			for (var j = i+1; j < parentlessNodes.length; ++j) {
				//get distance between current comparator nodes
				var n_i = parentlessNodes[i];
				var n_j = parentlessNodes[j];
				dist = Math.abs(n_i.num - n_j.num);

				if(dist < minDist) {
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
		var avgDist =  (node_i.num + node_j.num)/2;
		node_i["parent"] = "Node"+nodeCounter;
		node_j["parent"] = "Node"+nodeCounter;
		var newNode = {num: avgDist, name: "Node"+nodeCounter, children: [node_i, node_j], parent:"null"};
		nodeCounter++;

		//insert into array
		parentlessNodes.push(newNode);
		allNodes.push(newNode);

		//save as current best guess at root
		root = newNode;
	}

	//The second pass combines equivalent children and compresses
	//chains of single equivalent children and parents
	var changes = 1;
	while(changes > 0) {
	changes = 0;
	for( var i = 0; i < allNodes.length; ++i ) {
		curNode = allNodes[i];
		if(curNode.children == null)
			continue;
		if(curNode.children.length == 1) {
			var dist = Math.abs(curNode.num - curNode.children[0].num);
			if(dist == 0) {
				curNode.children = curNode.children[0].children;
				changes++;
			}
		} else {
			for(var j = 0; j < curNode.children.length-1; j++) {
				for(var k = j+1; k < curNode.children.length; k++) {
					var n_j = curNode.children[j];
					var n_k = curNode.children[k];

					var dist = Math.abs(n_j.num - n_k.num);
					if(dist == 0) {
						if(n_j.children != null) {
							if(n_k.children != null) {
								curNode.children.splice(k, 1);
								n_j.children = n_j.children.concat(n_k.children);
								k--;
								changes++;
								console.log(changes);
							} else {
								curNode.children.splice(k, 1);
								k--;
								n_j.children.push(n_k);
								changes++;
							}
						} else if (n_k.children != null) {
							curNode.children.splice(j, 1);
							j--;
							n_k.children.push(n_j);
							changes++;
						}
					}
				}
			}
		}
	}
	console.log(changes);
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