/*
	Class which controls the right-hand-side table view. This is mostly just
	some really specific jquery stuff.
*/
function Table() {
	/*
		Displays shared values in the first column
	*/
	this.displayShared = function(n) {
		$("#1_name").html("Shared");
		for(var i = 0; i < weights.length; ++i) {
			if(n.shared[i] != "-1") {
				$("#1_"+i).html("<b>" + String(n.shared[i]) + "</b>");
			} else {
				$("#1_"+i).html("--");
			}
		}
	};

	/*
		Displays the given nodes in the appropriate columns
	*/
	this.displayNodeValues = function(n1, n2) {
		for(var i = 0; i < weights.length; ++i) {
			if(n1 != null) {
				$("#1_name").html(String(n1.name));
				if(n2 != null) {
					$("#2_name").html(String(n2.name));
					if(n1.values[i] == n2.values[i]) {
						$("#1_"+i).html("<b>" + String(n1.values[i]) + "</b>");
						$("#2_"+i).html("<b>" + String(n2.values[i]) + "</b>");
					} else {
						$("#1_"+i).html(String(n1.values[i]));
						$("#2_"+i).html(String(n2.values[i]));
					}
				} else {
					$("#1_"+i).html(String(n1.values[i]));
					$("#2_name").html("--");
					$("#2_"+i).html("--");
				}
			} else {
				$("#1_name").html("--");
				$("#1_"+i).html("--");
				if(n2 != null) {
					$("#2_name").html(String(n2.name));
					$("#2_"+i).html(String(n2.values[i]));
				} else {
					$("#2_name").html("--");
					$("#2_"+i).html("--");
				}
			}
		}
	}

	/*
		Creates a table for showing information about attributes, their values, and their weights
	*/
	this.initialize = function(updateCallback, resetCallback) {
		$('#weights').append("<tr><th>Attribute</th><th id=\"1_name\">--</th><th id=\"2_name\">--</th><th/><th>Weight</th></tr>");

		//Create weight sliders
		for(var i = 0; i < weights.length; ++i){
			$('#weights').append("<tr></tr>");
			$('#weights tr:last').append("<td>"+names[i]+"</td>");
			$('#weights tr:last').append("<td id=\"1_"+i+"\">--</td><td id=\"2_"+i+"\"/>--</td>");
			$('#weights tr:last').append("<td><input id=\"weights"+i+"\"type=\"range\"/ min=\"0\" max=\"10\" step=\".1\"></td>");
			$('#weights tr:last').append("<td id=\"weightlabels"+i+"\">1.0</td>");
			$("#weights"+i).val(1).change(generate_handler(i)).on('input', generate_continuous_handler(i));
		}

		//create update button
		$('#weights').append("<tr><td/><td/><td/><td/><td><button id=\"updateWeights\" disabled=\"true\">Update</button></td></tr>")
		$('#updateWeights').click(updateCallback);
		$('#weights').append("<tr><td/><td/><td/><td/><td><button id=\"resetWeights\" disabled=\"true\">Reset</button></td></tr>")
		$('#resetWeights').click(resetCallback);

		this.displayNodeValues(null, null);

		function generate_handler( i ) {
		    return function(event) { 
		    	$("#updateWeights").prop("disabled",false);
				$("#resetWeights").prop("disabled",false);
		    };
		}

		function generate_continuous_handler( i ) {
		    return function(event) { 
	    		$("#weightlabels"+i).html("<b>"+Number(this.value).toFixed(1) + "</b>");
	    	}
		}
	};
}