// boot jQuery
var $j = jQuery.noConflict();

// add load event
Event.observe(window, 'load', init_load_wym_editor, false);

// These tokens are for Radiant CMS radius tags  
XhtmlLexer.prototype.addTokens = function()
{
  this.addEntryPattern("</?r:", 'Text', 'Text');
  this.addExitPattern(">", 'Text'); 
  
  this.addCommentTokens('Text');
  this.addScriptTokens('Text');
  this.addCssTokens('Text');
  this.addTagTokens('Text');
}

function text_input_method(index, filter) {
	if (index != null) {
		// control for page parts
		var elem = $('part['+(index - 1)+'][content]');
		if (filter == "WymEditor") {
			boot_wym(elem);
		} else {
			for(var i=0;i<WYM_INSTANCES.length;i++) { WYM_INSTANCES[i].update(); };
			unboot_wym(elem)
		}
	} else {
		// control for snippets
		var elem = $$('.textarea');
		if (filter == "WymEditor") {
			boot_wym(elem[0]);
		} else {
			for(var i=0;i<WYM_INSTANCES.length;i++) { WYM_INSTANCES[i].update(); };
			unboot_wym(elem[0]);
		}
	}
}

// loads WYMeditor for page parts where "WymEditor" is the selected text filter
function init_load_wym_editor(){
	// add "wymupdate" class to the save buttons:
	for (var i = 0; i < $$(".button").length; i++){
		//$($$(".button")[i]).addClassName('wymupdate');
		// on save, run wymupdate and unboot on all instances;
		Event.observe($$(".button")[i], 'click', unboot_all_wym)
	}

  // check to see if we are working with a page or with a snippet
  if ($('part[0][filter_id]'))
  {
    var parts = $j('.textarea');
    for (var i = 0; i < parts.length; i++)
    {
      if ($F('part[' + i + '][filter_id]') == 'WymEditor') {
				// mark textarea's that need to be wymified
				$('part['+i+'][content]').addClassName('wymified');
      }
    }
		// boot wym on marked textarea's
		ta = $$(".wymified");
		for (var i = 0; i < ta.length; i++){
			boot_wym(ta[i]);
		}
		
  } else if ($('snippet[filter_id]')) {
    if ($F('snippet[filter_id]') == 'WymEditor') {
			boot_wym($j('.textarea')[0]);
    }
  }
}

function boot_wym(elem){
   $j(elem).wymeditor({
				xhtmlParser: 'xhtml_parser.js',
			  cssParser:   'wym_css_parser.js',

 			 //classes panel
	      classesItems: [
	        {'name': 'float-left', 'title': 'PARA: left', 'expr': 'p'},
	        {'name': 'float-right', 'title': 'PARA: right', 'expr': 'p'}
	      ],

	      //editor css values for visual feedback
	      editorStyles: [
	        {'name': '.float-left',
	         'css': 'color: #999; border: 2px solid #ccc;'},
	         {'name': '.float-right',
	          'css': 'color: #999; border: 2px solid #ccc;'},
					{'name': '.radius_tag',
						'css': 'height:31px; background:url(/images/admin/wef_radiustag_bg.gif) no-repeat 0 0;'},
						// Make div element stand out visually, add label
  				{'name': 'div',
  					'css': 'background:#fafceb url(/images/admin/lbl-div.png) no-repeat 2px 2px; margin:10px; padding:10px;'}
	      ],

      //function called when WYMeditor instance is ready
      //wym is the WYMeditor instance
      postInit: function(wym) {
        //set the status bar value
        wym.status('&nbsp;');
        //activate 'hovertools' plugin, which gives more feedback to the user
        wym.hovertools();
      },

			preInit: function(wym) {
				//change_radius_to_imgs
				var content = (wym._html);
				var m = content.match(/(<r:([^\/><]*)?\/?>)|(<\/r:([^>]*)?>)/g);
				if (!(m == null)) {
					for (var i=0; i < m.length; i++) {
				  	var title = m[i].replace(/"/g, "'");
						title = title.substring(1,title.length-1);
				    var match = escape(m[i].substring(1,m[i].length - 1));
				    var regex = new RegExp('(' + m[i] + ')', 'i');
				    var content = content.replace(regex, '<hr class="radius_tag" title="' + title + '" />');
					}
				}
				wym._html = content;
			}
   });
}

function unboot_wym(elem){
	// hide wym
	$j(elem).parent().find(".wym_box").remove();
	// revert images to radius tags
	var content = elem.value;
	var regex = new RegExp('<hr class="radius_tag" title="(.*?)" />', 'gi');
	var m = content.match(regex);
	   if (!(m == null)) {
	       for (var i=0; i<m.length; i++) {
	           var match = unescape(m[i].replace(regex, '<$1>'));
	           var content = content.replace(m[i], match);
	       }
	   }
	elem.value = content
	// show textarea again
  $j(elem).show();
}

function unboot_all_wym() {
	// wym.update() for all!
	for(var i=0;i<WYM_INSTANCES.length;i++) { WYM_INSTANCES[i].update(); };
	var ta = $$('.textarea');
	for(var i = 0; i < ta.length; i++){
		unboot_wym(ta[i]);
	}
	return true;
}