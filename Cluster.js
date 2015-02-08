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
		var node = { name : d[i].name, parent : "null", values:d[i].data};
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
				dist = distance(n_i, n_j);

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

		//create a parent node with their average values
		if(nodeCounter == 47) {
			console.log(node_i);
			console.log(node_j);
		}
		node_i["parent"] = "Node"+nodeCounter;
		node_j["parent"] = "Node"+nodeCounter;
		var newNode = { values: average(node_i, node_j), name: "Node"+nodeCounter, children: [node_i, node_j], parent:"null"};
		nodeCounter++;

		//insert into array
		parentlessNodes.push(newNode);
		allNodes.push(newNode);

		//save as current best guess at root
		root = newNode;
	}

	//The second pass combines equivalent children and compresses
	//chains of single equivalent children and parents
	//We use a closure algorithm, so track changes
	var changes = 1;
	while(changes > 0) {
		changes = 0;
		//Iterate over every node
		for( var i = 0; i < allNodes.length; ++i ) {
			curNode = allNodes[i];
			//If it has no children, ignore it (since children have no
			//reference back to their parents leaves are useless)
			if(curNode.children == null)
				continue;

			//If it has only one child, this node is a candidate for compression
			//if it is the same as its child
			if(curNode.children.length == 1) {
				var dist = distance(curNode, curNode.children[0]);
				if(dist == 0) {
					curNode.children = curNode.children[0].children;
					changes++;
				}
			} else {
				//Otherwise iterate through all pairs of children
				for(var j = 0; j < curNode.children.length-1; j++) {
					for(var k = j+1; k < curNode.children.length; k++) {
						var n_j = curNode.children[j];
						var n_k = curNode.children[k];

						//If the children are the same, we combine them
						var dist = distance(n_j, n_k);
						if(dist == 0) {
							if(n_j.children != null) {
								//if both are branches, combine their children and delete
								//the other branch
								if(n_k.children != null) {
									curNode.children.splice(k, 1);
									n_j.children = n_j.children.concat(n_k.children);
									k--;
									changes++;
								//if one is a leaf, add it as a child of this branch
								} else {
									curNode.children.splice(k, 1);
									k--;
									n_j.children.push(n_k);
									changes++;
								}
							//if both are branches, combine their children and delete
							//the other branch
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
	}

	return root;
}

/*
	Returns an array consisting of the averages of the values from 
	the data arrays of nodes a and b.
*/
function average(a, b) {
	var data = [];
	var use_a = false;
	for(var i = 0; i < a.values.length; ++i){
		data.push((Number(a.values[i])+Number(b.values[i]))/2);
	}
	return data;
}

/*
	Returns the distance between nodes and and b
*/
function distance(a, b) {
	var sum = 0;
	for(var i = 0; i < a.values.length; ++i){
		sum+= Math.abs(Number(a.values[i])-Number(b.values[i]));
	}
	return sum;
}