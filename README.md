# BioViz-Tree
Biovisualization Assignment 2: Tree of Life


## Hierarchical Clustering
I based my clustering algorithm on the bottom-up agglomerative clustering approach described in the assignment. I started out by simply implementing the binary version outlined there, and then began to iteratively modify it to *remove the binary constraint*. My final approach was to modify the handling of closest nodes to make parent nodes adopt close children rather than create a new node above them. Parents take on the average values of all of their children.

The distance between two nodes is the number of differences between their values, multiplied by the weight of each respective attribute.

## Basic Tree Visualization
The clustering algorithm rturns the root of the resulting tree, which is made into a radial cluster dendrogram with d3's cluster and siagonal classes. The basic tree was based on [this example](http://bl.ocks.org/mbostock/4339607). I don't know exactly what happens behind the scenes, but those classes provide me with a set of nodes and paths which can be rendered. I heavily modified the tree to introduce my own css styling, transitions and updating, and several interactions discussed in the next section.

## Additions
I made several additions beyond the basic requirements of this assignment. All of them were focused on increasing the interaction, analysis, and clustering quality of the tree.

* The clustering algorithm allows nodes to have more than two children.
	* This is biologically significant because it provides a much clearer view of how the animals are related.

* Hovering or selecting a leaf node highlights its path from the root, and shows its attributes in the table.
	* Users can see all relevant information on the node of interest : both it's characteristics and its tree location.

* Hovering over a second leaf node while one is selected highlights the shortest path between the two nodes, and shows both sets of values in the table (bolding whichever ones have the same value).
	* This allows the user to directly compare animals that they're interested in, in terms of both characteristics and position in the tree.

* Hovering over a branch node highlights all of its children, and shows the values shared between those children in the table.
	* Highlighting all of its children effectively shows the significance of this node to the structure of the tree.
	* Showing the shared characteristics allows the user to easily trace how the tree is being split.

* Selecting a branch node refocuses the tree to only show the children of that node. 
	* This allows a user to see a specific area of interest in more detail.
	* This follows the filter unit of the interaction taxonomy.
	* When only part of the tree is visible, a small guide of the entire tree appears in the top left corner (highlighting the selected section). This prevents the user from losing sight of how what they are looking at connects to the tree as a whole, which is especially important because the shape changes when filtered.

* Leaf distance is scaled by similarity (roughly).
	* This makes the shape of the tree more accurately depict the characteristics of its data.

* The weight of each attribute can be changed, and the tree regenerated.
	* Users can reconfigure the clustering to see how the resulting tree will change, and see which configurations lead to the most significant or correct clusterings.

## Running it
Open index.html in a modern web browser.