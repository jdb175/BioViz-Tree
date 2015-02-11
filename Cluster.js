/*
	Take the given JSON data and process it into a clustered tree
*/
var nodeCounter = 0; //how many nodes we've creates (for naming)
var parentlessNodes = []; 
var root = null;
var maxDist;

var names = ["hair", "feathers", "eggs", "milk", "airborne", "aquatic", "predator", "toothed", "backbone", "breathes", "venomous", "fins", "legs", "tail", "domestic", "catsize"]; //names of each attribute
var weights = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]; //weights for each attribute


function process(d) {
	parentlessNodes = [];
	root = null;
	//calculate max distance
	maxDist = 0;
	for(var p = 0; p < weights.length; ++p) {
		maxDist += weights[p];
	}

	//first we create parentless nodes with the numerical value of each item
	for( var i = 0; i < d.length; ++i ) {
		var node = { name : d[i].name, parent : "null", values:d[i].data.slice(), shared: d[i].data.slice()};
		parentlessNodes.push(node);
	}

	while(parentlessNodes.length > 1) {
		var minDist = Number.MAX_VALUE;
		var index_i; //the closest index from 'i' loop
		var index_j; //the closest index from 'j' loop

		//loop through all parentless nodes
		for( var i = 0; i < parentlessNodes.length-1; ++i ) {
			var n_i = parentlessNodes[i];

			//and compare to all other parentless nodes
			for (var j = i+1; j < parentlessNodes.length; ++j) {
				//get distance between current comparator nodes
				var n_j = parentlessNodes[j];
				dist = distance(n_i, n_j);

				if(dist < minDist) {
					minDist = dist;
					index_i = i;
					index_j = j; 
				}
			}
		}

		//Once closest two are found, determine how to cluster them
		node_i = parentlessNodes[index_i];
		node_j = parentlessNodes[index_j];

		if(node_i.children != null) {
			if(node_j.children != null) {
				//if both nodes are branches
				if(minDist == 0) {
					//combine them if they are the same
					adoptChildren(index_i, index_j);
				} else {
					//otherwise add a parent above them
					createParentNode(index_i, index_j);
				}
			} else {
				//If node i is a branch and j is a leaf, add j as
				//a child of i
				insertChild(index_i, index_j);
			}
		} else {
			if(node_j.children != null) {
				//If node j  is a branch and i is a leaf, add i as
				//a child of j
				insertChild(index_j, index_i);
			} else {
				//If both i and j are leaves, create a node above them
				createParentNode(index_i, index_j);
			}
 		}
	}
	return root;
}

/*
	Adds node at child_index as a child of node at parent_index,
	removes child from parentlessnodes, and updates parent
	values to be an average of all children
*/
function insertChild(parent_index, child_index) {
	//Find nodes 
	parent = parentlessNodes[parent_index];
	child = parentlessNodes[child_index];

	//remove child from parentless
	parentlessNodes.splice(child_index, 1);

	//make it a child of parent
	child.parent = parent.name;
	parent.children.push(child);
	updateParentAverage(parent);
	root = parent;
}


/*
	Removes node at old_parent_index and makes node at new_parent_index
	adopt its children
*/
function adoptChildren(new_parent_index, old_parent_index) {
	//Find nodes 
	parent = parentlessNodes[new_parent_index];
	old_parent = parentlessNodes[old_parent_index];

	//remove old from parentless
	parentlessNodes.splice(old_parent_index, 1);

	for(var i = 0; i < old_parent.children.length; ++i){
		cur_child = old_parent.children[i];
		cur_child.parent = parent.name;
		parent.children.push(cur_child);
	}
	updateParentAverage(parent);
	root = parent;
}


/*
	Creates a new node which is the parent of nodes a and b, and removes
	a and b from parentlessNodes. index_b must be greater than index_a
*/
function createParentNode(index_a, index_b) {
	//get nodes and remove from parentless list
	a = parentlessNodes[index_a];
	b = parentlessNodes[index_b];
	parentlessNodes.splice(index_a, 1);
	parentlessNodes.splice(index_b-1, 1);

	//create a parent node with their average values
	a["parent"] = "Node"+nodeCounter;
	b["parent"] = "Node"+nodeCounter;
	var newNode = { values: [], name: "Node"+nodeCounter, children: [a, b], parent:"null"};
	updateParentAverage(newNode);
	nodeCounter++;

	//insert into array
	parentlessNodes.push(newNode);

	//save as current best guess at root
	root = newNode;
}

/*
	Returns an array consisting of the averages of the values from 
	the data arrays of nodes a and b.
*/
function updateParentAverage(a) {
	//for each value
	a.values = [];
	for(var i = 0; i < a.children[0].values.length; ++i){
		var curVal = Number(a.children[0].values[i]);
		for(var j = 1; j < a.children.length; ++j){
			curVal = curVal*j/(j+1) + Number(a.children[j].values[i])/(j+1)	
		}
		a.values.push(curVal);
	}
	updateShared(a);
}

/*
	Makes the "shared" array of the node be the intersection of all children's
	shared arrays
*/
function updateShared(a) {
	a.shared = null;
	for(var i = 0; i < a.children.length; ++i){
		if(a.shared == null) {
			a.shared = a.children[i].shared.slice();
		} else {
			for(var j = 0;  j < a.shared.length; ++j){
				if(a.shared[j] != a.children[i].shared[j]){
					a.shared[j] = -1;
				}
			}
		}
	}
}

/*
	Returns the distance between nodes and and b
*/
function distance(a, b) {
	var sum = 0;
	for(var i = 0; i < a.values.length; ++i){
		sum+= Math.abs(Number(a.values[i])-Number(b.values[i]))*weights[i];
	}
	return sum;
}