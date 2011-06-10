(function($,_) {
	window.DoingIt = function($editor) {
		var self = {
			types: {
				'-': 'pending',
				'/': 'finished',
				'#': 'blocked'
			}
		};
		
		
		self.init = function() {
			restoreFromLocalStorage();
			self.doIt();
		};
		
		self.doIt = function() {
			wrapAnyRawTextInADiv();
			decorateLines();
			saveToLocalStorage();
		};
		
		var wrapAnyRawTextInADiv = function() {
			//Safari wraps each newline in a div, except it always leaves the first one naked
			$editor.contents().filter(function(){ return this.nodeType == 3; }).wrap('<div></div>');
		}
		
		var decorateLines = function() {
			rows().each(function(i,el) {
				var $row = $(el);
				$row.removeClass(); //Safari will otherwise keep appending the classes of the previous ones
				var type = self.types[$row.text().charAt(0)];
				if(type) {
					$row.addClass(type).addClass('task');
				}
			});
		};
		
		var saveToLocalStorage = function() {
			var items = [];
			rows().each(function(i,item) {
				items.push($(item).text());
			});
			localStorage['items'] = JSON.stringify(items);
		};
		
		var restoreFromLocalStorage = function() {
			if(localStorage['items']) {
				var items = JSON.parse(localStorage['items']);
				_(items).each(function(item) {
					item = !item ? "<br/>" : item;
					$editor.append('<div>'+item+'</div>');
				});
			} else {
				$editor.append('<div><br/></div>');
			}
		};
		
		var rows = function() {
			return $editor.find('> div');
		}
		
		return self;
	};
	
	$(function() {
		var doingIt = DoingIt($('#editor'));
		doingIt.init();
		$('#editor').live('keydown',doingIt.doIt);
	});
})(jQuery,_);