// boot jQuery
var $j = jQuery.noConflict();

// add load event
Event.observe(window, 'load', init_load_wym_editor, false);

// These tokens are for Radiant CMS radius tags  
//XhtmlLexer.prototype.addTokens = function()
//{
//  this.addEntryPattern("</?r:", 'Text', 'Text');
//  this.addExitPattern(">", 'Text'); 
//  
//  this.addCommentTokens('Text');
//  this.addScriptTokens('Text');
//  this.addCssTokens('Text');
//  this.addTagTokens('Text');
//}

function text_input_method(index, filter) {
	if (index != null) {
		// control for page parts
		var elem = $('part_'+(index)+'_content');
		if (filter == "WymEditor") {
			boot_wym(elem);
		} else {
			for(var i=0;i<WYMeditor.INSTANCES.length;i++) { WYMeditor.INSTANCES[i].update(); };
			unboot_wym(elem)
		}
	} else {
		// control for snippets
		var elem = $$('.textarea');
		if (filter == "WymEditor") {
			boot_wym(elem[0]);
		} else {
			for(var i=0;i<WYMeditor.INSTANCES.length;i++) { WYMeditor.INSTANCES[i].update(); };
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
  if ($('part_0_filter_id'))
  {
    var parts = $j('.textarea');
    for (var i = 0; i < parts.length; i++)
    {
      if ($F('part_' + i + '_filter_id') == 'WymEditor') {
				// mark textarea's that need to be wymified
				$('part_'+i+'_content').addClassName('wymified');
      }
    }
		// boot wym on marked textarea's
		ta = $$(".wymified");
		for (var i = 0; i < ta.length; i++){
			boot_wym(ta[i]);
		}
		
  } else if ($('snippet_filter')) {
    if ($F('snippet_filter') == 'WymEditor') {
			boot_wym($j('.textarea')[0]);
    }
  }
}

function boot_wym(elem){	
  $j(elem).wymeditor({
				lang: 'nl',

			 //classes panel
	      classesItems: [
	        {'name': 'float_left', 'title': 'PARA: left', 'expr': 'p'},
	        {'name': 'float_right', 'title': 'PARA: right', 'expr': 'p'},
	        {'name': 'maxwidth', 'title': 'PARA: maxwidth', 'expr': 'p'},
	        {'name': 'narrow', 'title': 'PARA: narrow', 'expr': 'p'}
	      ],

	      //editor css values for visual feedback
	      editorStyles: [
	        {'name': '.float_left',
	         'css': 'color: #999; border: 2px solid #ccc;'},
	         {'name': '.float_right',
	          'css': 'color: #999; border: 2px solid #ccc;'},
	         {'name': '.maxwidth',
	          'css': 'color: #333; border: 2px solid #ccc;'},
	         {'name': '.narrow',
	          'css': 'color: #666; border: 2px solid #CCC;'},
					{'name': '.radius_tag',
						'css': 'height:31px; background:url(/images/admin/wef_radiustag_bg.gif) no-repeat 0 0;'},
						// Make div element stand out visually, add label
 				{'name': 'div',
 					'css': 'background:#fafceb url(/images/admin/lbl-div.png) no-repeat 2px 2px; margin:10px; padding:10px;'}
	      ],

     //function called when WYMeditor instance is ready
     //wym is the WYMeditor instance
     postInit: function(wym) {
       // change the index of this instance into the id string of the parent it has replaced;
			 wym._index = elem.id;
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

	// fix urls to page attachments
	var regex = new RegExp('src="([\.\/]+)/page_attachments', 'g');
	var m = content.match(regex);
	if(!(m == null)) {
		for(var i=0; i<m.length; i++){
			var match = unescape(m[i].replace(regex, 'src="/page_attachments'));
			var content = content.replace(m[i], match)
		}
	}
	elem.value = content;
	
	// show textarea again
  $j(elem).show();
}

function unboot_all_wym() {
	// wym.update() for all!
	for(var i=0;i<WYMeditor.INSTANCES.length;i++) { 
		// don't update if the filter for this part is no longer set to wym
		s = WYMeditor.INSTANCE[i]._index // i.e. part_0_content
		filter_select = $("part_" + s.split('_')[1] + "_filter_id")
		if(filter_select.value != 'WymEditor'){next;}
		// if it's still set to Wym, send the html back to the original textarea
		WYMeditor.INSTANCES[i].update(); 
		};
	var ta = $$('.textarea');
	for(var i = 0; i < ta.length; i++){
		unboot_wym(ta[i]);
	}
	return true;
}