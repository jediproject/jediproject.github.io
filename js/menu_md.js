function openMd(componentName) {
	var URL = 'https://raw.githubusercontent.com/jediproject/'+componentName+'/master/README.md';
	$.get(URL, function(content) {
		$('#content').html(marked(content));
	});
}