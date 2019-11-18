function update() {
	console.log("test")
  	$.get('/sensor_module/distance', function(json_data) {
    	$("#distace").text('Distance: ' + json_data.distace);
  }); 
}