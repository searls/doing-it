(function($,_) {
	window.DoingIt = function() {
		var self = {};
		
		self.init = function() {
			restoreFromLocalStorage();
			self.doIt();
		};
		
		self.doIt = function() {
			wrapAnyRawTextInADiv();
			saveToLocalStorage();
		};
		
		var wrapAnyRawTextInADiv = function() {
			//Safari wraps each newline in a div, but sometimes misses the first one
			$('#editor').contents().filter(function(){ return this.nodeType == 3; }).wrap('<div></div>');
		}
		
		var saveToLocalStorage = function() {
			var items = [];
			$('#editor > div').each(function(i,item) {
				items.push($(item).text());
			});
			localStorage['items'] = JSON.stringify(items);
		};
		
		var restoreFromLocalStorage = function() {
			if(localStorage['items']) {
				var items = JSON.parse(localStorage['items']);
				_(items).each(function(item) {
					item = !item ? "<br/>" : item;
					$('#editor').append('<div>'+item+'</div>')
				});
			}
		};
		
		return self;
	};
	
	$(function() {
		var doingIt = DoingIt();
		doingIt.init();
		$('#editor').live('keypress',doingIt.doIt);
	});
})(jQuery,_);