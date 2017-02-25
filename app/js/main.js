// CONSTANTS
var SESSION_NAMESPACE = 'tv_';
var NUM_BACKGROUNDS = 2;
var _$grid = $('.grid:first');
var _$watchLater = $('#watchLater');

// NAMESPACED OBJECTS
var Main = {
	// Initializes all custom objects used by this app - this is executed at EOF
	Init : function() {
		WatchLater.Init();  // initialize before grid so that this special card can be sorted with the other cards
		Grid.Init();
		Filters.Init();
		Overlay.Init();
		Background.Init();
	},
};

var Grid = {
	// PUBLIC METHODS
	Init : function() {
		Grid.InitIsotope();
		//Grid.InitMasonry();  //note: switched masonry with isotope for its filter options
	},
	
	// use isotope plugin to initialize grid that programatically sorts cards within a responsive card layout
	InitIsotope : function() {
		_$grid.isotope({  // options:
			gutter: 10,
			itemSelector: '.grid-item',
			masonry: {
				columnWidth: '.grid-sizer',
				gutter: 10
			}
		});
	},
	// use masonry plugin to initialize grid that programatically sorts cards within a responsive card layout
	InitMasonry : function() {
		_$grid.masonry({  // options:
			gutter: 10,
			columnWidth: '.grid-sizer',
			itemSelector: '.grid-item'
		});
	},
};

var Overlay = {
	// PUBLIC METHODS
	Init : function() {
		Overlay.FadeOut();
	},

	// PRIVATE METHODS
	// fade out overlay to reveal grid
	FadeOut : function() {
		$('#overlay').fadeOut(function() {
			$(this).fadeOut();
		});
	}
};

var Background = {
	// PUBLIC METHODS
	Init : function() {
		Background.ShowRandom();
	},

	// PRIVATE METHODS
	// choose a random background
	ShowRandom : function() {
		var randBg = Math.floor((Math.random() * NUM_BACKGROUNDS) + 1);
		$('body:first').addClass('bg-'+randBg);
	}
};

var Filters = {
	// MEMBERS
	_$curButton : undefined,

	// PUBLIC METHODS
	Init : function() {
		Filters.InitEvents();
	},

	// PRIVATE METHODS
	InitEvents : function() {
		// isotope grid filter buttons
		$('#filters').on( 'click', 'button', function() {
			Filters._$curButton = $(this);
			Filters.ButtonClicked();
		});
	},
	ButtonClicked : function() {
		Filters.FilterIsotopeGrid();
		Filters.UpdateButtonStates();
	},
	// apply isotope grid filter using the data-filter attribute stored in the clicked button
	FilterIsotopeGrid : function() {
		var $button = Filters._$curButton;
		var filterValue = $button.attr('data-filter');  // NOTE: can also use filterFn if matches value - e.g: var filterValue = filterFns[ filterValue ] || filterValue;
		_$grid.isotope({ filter: filterValue });
	},
	// change is-checked class on buttons after a new filter button has been clicked
	UpdateButtonStates : function() {
		var $button = Filters._$curButton;
		var $buttonGroup = $button.closest('.button-group');
		$buttonGroup.find('.is-checked').removeClass('is-checked');
		$button.addClass('is-checked');
	},
};

var WatchLater = {
	// PRIVATE MEMBERS
	_watchLaterPlaceholder : 'watch later...',

	// PUBLIC METHODS
	Init : function() {
		WatchLater.InitEvents();
		WatchLater.Display();
	},

	// PRIVATE METHODS
	InitEvents : function() {
		// watch later items
		_$watchLater.on( 'click', '.pencil', function() {
			WatchLater.EditItem($(this));
		});
		// NOTE: a link icon appears on an existing item to optionally attach a URL to the watch later item
		_$watchLater.on( 'click', '.link', function() {
			WatchLater.EditItemURL($(this));
		});
		_$watchLater.on( 'click', '.trash', function() {
			WatchLater.DeleteItem($(this));
		});
		_$watchLater.on( 'keypress', '.list-item', function(e) {
			WatchLater.EditKeyPressed(e);
		});
	},
	Display : function() {
		var htmlWatchLater = JSON.parse(sessionStorage.getItem(SESSION_NAMESPACE + "watchLater"));
		if(htmlWatchLater === null || htmlWatchLater === "")
			htmlWatchLater = $('#template--li-watch-later li').clone();
		_$watchLater.html(htmlWatchLater);
		var $watchLaterFirstLi = _$watchLater.find('li:first');
		if($watchLaterFirstLi.text() !== WatchLater._watchLaterPlaceholder) {
			$watchLaterFirstLi.before($('#template--li-watch-later li').clone());
			WatchLater.SaveItem();
		}
		WatchLater.FixCorners();
	},
	// editing a watch later item begins with adding text - you may optionally add a URL to the item in a second editing step
	EditItem : function($this) {
		var $span = $this.siblings('.list-item:first');
		$span.prop('contenteditable', true).focus().selectText(); // uses custom jQuery.fn.selectText
		// update this watch later item when the editable item loses focus:
		$span.one('blur', function() {
			WatchLater.UpdateItemText($(this));
		});
	},
	// pressing [Enter] while editing a watch later item's text or URL will trigger an event so the editable item loses focus which in turn triggers an update
	EditKeyPressed : function(e) {
		if(e.keyCode == 13) {
			$(this).trigger('blur');
			e.preventDefault();
			return false;
		}
	},
	// stop editing the watch later item then save it - NOTE: the new/blank editable item area always stays at the start of the list.. upon update we add a cloned version to the list that contains the same editable area with the new content
	UpdateItemText : function($this) {
		$this.prop('contenteditable', false);
		if($this.text().trim() === '')
			$this.text(WatchLater._watchLaterPlaceholder);
		var isNewTxt = ($this.text() !== WatchLater._watchLaterPlaceholder && $this.text().trim() !== '') ? true : false;
		if(isNewTxt && $this.siblings('.pencil:first').length > 0)
			$this.siblings('.pencil:first').before($('#template .link:first').clone()).remove();
		clearTextSelection();
		WatchLater.SaveItem();
	},
	// attaching a URL to a watch later item is an optional second step in the editing process
	EditItemURL : function($this) {
		var $span = $this.siblings('.list-item:first');
		$span.before($('#template .list-item--href:first').clone()).hide();
		var $href = $this.siblings('.list-item--href:first');
		$href.prop('contenteditable', true).focus().selectText(); // uses custom jQuery.fn.selectText
		// update this watch later item URL when the editable item loses focus:
		$href.one('blur', function() {
			WatchLater.UpdateItemURL($(this));
		});
	},
	UpdateItemURL : function($this) {
		var strHref = $this.text();
		var $span = $this.siblings('.list-item:first');
		var isNewUrl = (strHref !== 'http://' && strHref.trim() !== '') ? true : false;
		if(isNewUrl)
			$this.siblings('.link:first').remove();
		$this.remove();
		$span.show();
		if(isNewUrl)
			$span.wrap('<a href="'+strHref+'" target="_blank" />');
		WatchLater.SaveItem();
	},
	DeleteItem : function($this) {
		var conf = confirm('delete this item?');
		if(conf) {
			$this.closest('li').remove();
			WatchLater.FixCorners();
			WatchLater.SaveItem();
		}
	},
	SaveItem : function() {
		sessionStorage.setItem(SESSION_NAMESPACE + "watchLater", JSON.stringify(_$watchLater.html()));
	},
	// apply classes to fix corners of watch later items after adding or removing items
	FixCorners : function() {
		_$watchLater.find('li').each(function() { $(this).find('.list-item:first').removeClass('first').removeClass('last'); });
		_$watchLater.find('li:first .list-item').addClass('first');
		_$watchLater.find('li:last .list-item').addClass('last');
	},
};


// Initialize everything:
Main.Init();


// UTITLIES:

/* functions */
jQuery.fn.selectText = function(){
   var doc = document;
   var element = this[0];
   console.log(this, element);
   if (doc.body.createTextRange) {
       var range = document.body.createTextRange();
       range.moveToElementText(element);
       range.select();
   } else if (window.getSelection) {
       var selection = window.getSelection();        
       var range = document.createRange();
       range.selectNodeContents(element);
       selection.removeAllRanges();
       selection.addRange(range);
   }
};
function clearTextSelection() {
    if ( document.selection ) {
        document.selection.empty();
    } else if ( window.getSelection ) {
        window.getSelection().removeAllRanges();
    }
}