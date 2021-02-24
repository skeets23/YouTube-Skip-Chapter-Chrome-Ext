function save_options(e) {
	e.preventDefault();
	var options = {regex:document.getElementById('use-regex').checked,skip_words:document.getElementById('skip_words').value};
	var status = document.getElementById('status');
	status.textContent = '';
	chrome.storage.local.set({"options": JSON.stringify(options)}, function() {
		
		status.textContent = 'Settings saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 5000);
  });
}

function restore_options(){
	chrome.storage.local.get(["options"], function(result) {
		var options = JSON.parse(result.options);
		if(options.regex){
			document.getElementById('use-regex').checked = true;
		}else{
			document.getElementById('use-regex').checked = false;
		}
		document.getElementById('skip_words').value = options.skip_words;
	});
}

restore_options();

document.getElementById('options-form').addEventListener('submit', save_options);

