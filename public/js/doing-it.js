(function($,_) {
	window.DoingIt = function($editor) {
		var self = {
			types: {
				'-': 'pending',
				'/': 'finished',
				'#': 'blocked',
				'!': 'important'
			}
		};
				
		self.init = function() {
			restoreFromLocalStorage();
			self.doIt();
		};
		
		self.doIt = function() {
			wrapAnyRawTextInADiv();
			unwrapInappropriatelyNestedContent();
			decorateLines();
			saveToLocalStorage();
		};
		
		var wrapAnyRawTextInADiv = function() {
			//Webkit wraps each newline in a div, except it always leaves the first one naked
			$editor.contents().filter(function(){ return this.nodeType == 3; }).wrap('<div></div>');
		}
		
		var unwrapInappropriatelyNestedContent = function() {
			//Webkit will also wrap text in spans if a user backspaces a styled line into the line above it
			$editor.find('> div span').contents().unwrap();
		}
		
		var decorateLines = function() {
			removeAllExistingClasses()
			render(tasks);
			render(groups);
			render(comments);
		};
		
		var render = function(thingToRender) {
			rows().each(function(i,el) {
				thingToRender($(el));
			});
		};
		
		var removeAllExistingClasses = function() {
			//Safari will otherwise keep appending the classes of the previous ones
			rows().each(function(i,el) {
				$(el).removeClass();
			});
		}
		
		var tasks = function($row) {
			var type = self.types[$row.text().charAt(0)];
			if(type) {
				$row.addClass(type).addClass('task');
			}
		};
		
		var groups = function($row) {
			if(!$row.hasClass('task') && looksLikeAGroup($row)) {
				$row.addClass('group');
				var $nextSiblings = $row.find('~ *');
				for (var i=0; i < $nextSiblings.length; i++) {
					var $currentSibling = $nextSiblings.filter(':eq('+i+')');
					if(!$currentSibling.text()) {
						break;
					} else {
						$currentSibling.addClass('indent');
					}
				};
			}
		};
		
		var looksLikeAGroup = function($row) {
			var text = $.trim($row.text());
			return text.charAt(text.length-1) === ':';
		};
		
		var comments = function($row) {
			if(!$row.hasClass('task') && !$row.hasClass('group')) {
				$row.addClass('comment');
			}
		}
		
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
		var $editor = $('#editor');
		if($.browser.webkit) {
			var doingIt = DoingIt($editor);
			doingIt.init();
			$editor.live('keyup',doingIt.doIt);
		} else {
			$('#editor').replaceWith($('#apology'));
		}
	});
})(jQuery,_);