/**
 * WYMeditor integration into Radiant.
 */

// boot jQuery
jQuery.noConflict();

// add window load event
Event.observe(window, 'load', init_load_wym_editor, false);

// references to the WYMeditor instances
var editors = new Array();

// references to the content height adjustment timers
var timers = new Array();

// These tokens are for Radiant CMS radius tags
WYMeditor.XhtmlLexer.prototype.addTokens = function()
{
  this.addEntryPattern("</?r:", 'Text', 'Text');
  this.addExitPattern(">", 'Text');

  this.addCommentTokens('Text');
  this.addScriptTokens('Text');
  this.addCssTokens('Text');
  this.addTagTokens('Text');
}


/**
 * Loads the WYMeditor for page parts where "WymEditor" is the selected text
 * filter and observe the Radiant buttons for saving the page.
 */
function init_load_wym_editor(){
	// add "wymupdate" class to the save buttons:
	var buttons = $$("p.buttons > .button")
	for (var i = 0; i < buttons.length; i++){
		//$($$(".button")[i]).addClassName('wymupdate');
		// on save, run wymupdate and unboot on all instances;
		Event.observe(buttons[i], 'click', unboot_all_wym)
	}

  // check to see if we are working with a page or with a snippet
  if ($('pages'))
  {
    var parts = $$('.part');
    for (var i = 0; i < parts.length; i++)
    {
      if (/part-([\w\d-]+)/i.test(parts[i].id))
        var part_name = RegExp.$1;
      if ($('part_' + part_name + '_filter_id') && $F('part_' + part_name + '_filter_id') == 'WymEditor') {
        // mark textarea's that need to be wymified
        $('part_'+part_name+'_content').addClassName('wymified');
      }
    }
		// boot wym on marked textarea's
		ta = $$(".wymified");
		for (var i = 0; i < ta.length; i++){
			boot_wym(ta[i]);
		}

  } else {
    if ($F('snippet_filter') == 'WymEditor') {
			boot_wym(jQuery('.textarea')[0]);
    }
  }
}

/**
 * A new text filter has been set on a text area, so boot/unboot visual
 * editor instances
 *
 * @param index - the page part number
 * @param filter - the new page part filter
 */
function text_input_method(index, filter) {
	if (index != null) {
		// control for page parts
		var elem = $('part_'+(index)+'_content');
		if (filter == "WymEditor") {
			boot_wym(elem);
		} else {
			unboot_wym(elem)
		}
	} else {
		// control for snippets
		var elem = $$('.textarea')[0];
		if (filter == "WymEditor") {
			boot_wym(elem);
		} else {
			unboot_wym(elem);
		}
	}
}

/**
* Boots a single WYMeditor instance
*
* @param elem - the textarea with the content to visualize
*/
function boot_wym(elem) {
	// this prevents loading new instances below eachother when clicking i.e. "show assets bucket"
	if(jQuery(elem.siblings().first()).hasClass('wym_box'))
		return false
  // construct a wymeditor with overridden values and functions
  jQuery(elem).wymeditor({

    lang: 'en',
    skin: 'radiant',
    iframeBasePath: '/wymeditor/wymeditor/iframe/radiant/',

    classesItems: [
          {'name': 'float_left', 'title': 'PARA: left', 'expr': 'p'},
          {'name': 'float_right', 'title': 'PARA: right', 'expr': 'p'},
          {'name': 'maxwidth', 'title': 'PARA: maxwidth', 'expr': 'p'},
          {'name': 'narrow', 'title': 'PARA: narrow', 'expr': 'p'}
		],

    editorStyles: [
		  {'name': '.float_left',
		   'css': 'color: #999; border: 2px solid #ccc;'},
		  {'name': '.float_right',
		   'css': 'color: #999; border: 2px solid #ccc;'},
		  {'name': '.maxwidth',
		   'css': 'color: #333; border: 2px solid #ccc;'},
		  {'name': '.narrow',
		   'css': 'color: #666; border: 2px solid #CCC;'},
          {'name': 'div',
           'css': 'background:#fafceb url(/images/admin/lbl-div.png) no-repeat 2px 2px; margin:10px; padding:10px;'}
        ],

    dialogLinkHtml:  "<body class='wym_dialog wym_dialog_link'"
               + " onload='WYMeditor.INIT_DIALOG(" + WYMeditor.INDEX + ")'"
               + ">"
               + "<form>"
               + "<fieldset>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMeditor.DIALOG_LINK
               + "' />"
               + "<legend>{Link}</legend>"
               + "<div class='row'>"
               + "<label>{URL}</label><br/>"
               + "<input type='text' class='wym_href' value='' size='40' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Title}</label><br/>"
               + "<input type='text' class='wym_title' value='' size='40' />"
               + "</div>"
               + "<div class='row row-indent'>"
               + "<input class='wym_submit' type='button'"
               + " value='{Submit}' />"
               + "<a href='#' class='wym_cancel'>{Cancel}</a>"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</body>",

   dialogImageHtml:  "<body class='wym_dialog wym_dialog_image'"
               + " onload='WYMeditor.INIT_DIALOG(" + WYMeditor.INDEX + ")'"
               + ">"
               + "<form>"
               + "<fieldset>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMeditor.DIALOG_IMAGE
               + "' />"
               + "<legend>{Image}</legend>"
               + "<div class='row'>"
               + "<label>{URL}</label><br/>"
               + "<input type='text' class='wym_src' value='' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Alternative_Text}</label><br/>"
               + "<input type='text' class='wym_alt' value='' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Title}</label><br/>"
               + "<input type='text' class='wym_title' value='' />"
               + "</div>"
               + "<div class='row row-indent'>"
               + "<input class='wym_submit' type='button'"
               + " value='{Submit}' />"
               + "<a href='#' class='wym_cancel'>{Cancel}</a>"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</body>",

    dialogTableHtml:  "<body class='wym_dialog wym_dialog_table'"
               + " onload='WYMeditor.INIT_DIALOG(" + WYMeditor.INDEX + ")'"
               + ">"
               + "<form>"
               + "<fieldset>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMeditor.DIALOG_TABLE
               + "' />"
               + "<legend>{Table}</legend>"
               + "<div class='row'>"
               + "<label>{Caption}</label><br/>"
               + "<input type='text' class='wym_caption' value='' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Summary}</label><br/>"
               + "<input type='text' class='wym_summary' value=''/>"
               + "</div>"
               + "<div class='row row-rows'>"
               + "<label>{Number_Of_Rows}</label>"
               + "<input type='text' class='wym_rows' value='3' size='3' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Number_Of_Cols}</label>"
               + "<input type='text' class='wym_cols' value='2' size='3' />"
               + "</div>"
               + "<div class='row row-indent'>"
               + "<input class='wym_submit' type='button'"
               + " value='{Submit}' />"
               + "<a href='#' class='wym_cancel'>{Cancel}</a>"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</body>",

    dialogPasteHtml:  "<body class='wym_dialog wym_dialog_paste'"
               + " onload='WYMeditor.INIT_DIALOG(" + WYMeditor.INDEX + ")'"
               + ">"
               + "<form>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMeditor.DIALOG_PASTE
               + "' />"
               + "<fieldset>"
               + "<legend>{Paste_From_Word}</legend>"
               + "<div class='row'>"
               + "<textarea class='wym_text' rows='10'></textarea>"
               + "</div>"
               + "<div class='row'>"
               + "<input class='wym_submit' type='button'"
               + " value='{Submit}' />"
               + "<a href='#' class='wym_cancel'>{Cancel}</a>"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</body>",

    /**
     * Enhance the visual editor after construction:
     *
     * - accept asset dropping
     * - auto adjust iframe
     *
     * @param wym - the editor
     */
    postInit: function(wym) {
        
      // map the index of this instance to it's page_part
      editors[elem.id] = wym._index;

      // bind assets dropping if paperclipped bucket is present
      if($$('#show-bucket a'))
        bind_droppability(wym._iframe);

      // grow iframe on typing
      timers[elem.id] = setInterval(function(){ adjustFramesize(wym._iframe); }, 20);

      //assign ids
      jQuery(wym._box).find("div.wym_area_top").parent().attr("id", "wym_box_" + elem.id);
      jQuery(wym._box).find("div.wym_area_top").attr("id","wym_area_top_" + elem.id);
      jQuery(wym._box).find("div.wym_area_right").attr("id","wym_area_right_" + elem.id);

      // scroll right box
      jQuery('#wym_area_right_' + elem.id).scrollFollow({ speed: 100, container: "wym_box_" + elem.id, offset: -1 });
      jQuery('#wym_area_top_' + elem.id).scrollFollow({ speed: 100, container: "wym_box_" + elem.id, offset: -1  });

     },

    /**
     * Initialize the editor before construction of the visual editor:
     *
     * - convert radius tags to special editable tags
     *
     * @param wym - the editor
     */
    preInit: function(wym) {

      // get editor content
      var content = (wym._html);

      // convert radius tags to wym_radius_edit tags
      var m = content.match(/(<r:([^>]*)?\/?>)|(<\/r:([^>]*)?>)/g);
      if (!(m == null)) {
        for (var i=0; i < m.length; i++) {
          var tag = m[i].replace(/"/g, "'");
          var code = tag.replace(/^<\/?r:/g, "").replace(/\/?>$/g, "");
          var match = escape(m[i].substring(1,m[i].length - 1));
          var regex = new RegExp('(' + m[i] + ')', 'i');
          if (tag.substring(tag.length-2,tag.length)=='/>') {
            // empty element tag
            var content = content.replace(regex, '<r:wym_radius_edit class="radius_tag radius_code radius_empty_tag">' + code + '</r:wym_radius_edit>');
          } else if (tag.substring(0,2)=='</') {
            // end tag
            var content = content.replace(regex, '<r:wym_radius_edit class="radius_tag radius_code radius_end_tag">' + code + '</r:wym_radius_edit></r:wym_radius_edit>');
          } else {
            // start tag
            var content = content.replace(regex, '<r:wym_radius_edit class="radius_tag radius_start_tag"><r:wym_radius_edit class="radius_tag radius_code">' + code + '</r:wym_radius_edit>');
          }
        }
      }

      // save converted html
      wym._html = content;
        
    }

  });
}

/**
 * Unboots the WYMeditor:
 *
 *  - remove the wym editor div element
 *  - convert wym editor radius edit areas back to normal radius tags
 *  - fix page attachments and assets URLs.
 *
 * @param elem - the original text area
 */
function unboot_wym(elem){

  // stop auto resize timer
  clearInterval(timers[elem.id]);

  // hide wym
  jQuery(elem).parent().find(".wym_box").remove();

  // get visual editor content
  var id = editors[elem.id];
  var content = WYMeditor.INSTANCES[id].xhtml();

  // convert wym_radius_edit empty tags back to radius tags
  var regex = new RegExp('<r:wym_radius_edit class="radius_tag radius_code radius_empty_tag">(.*?)</r:wym_radius_edit>', 'gi');
  var m = content.match(regex);
  if (!(m == null)) {
    for (var i=0; i<m.length; i++) {
      var match = unescape(m[i].replace(regex, '<r:$1 />'));
      var content = content.replace(m[i], match);
    }
  }

  // convert wym_radius_edit empty tags back to radius tags
  var regex = new RegExp('<r:wym_radius_edit class="radius_tag radius_code radius_end_tag">(.*?)</r:wym_radius_edit></r:wym_radius_edit>', 'gi');
  var m = content.match(regex);
  if (!(m == null)) {
    for (var i=0; i<m.length; i++) {
      var match = unescape(m[i].replace(regex, '</r:$1>'));
      var content = content.replace(m[i], match);
    }
  }

  // convert wym_radius_edit end tags back to radius tags
  var regex = new RegExp('<r:wym_radius_edit class="radius_tag radius_start_tag"><r:wym_radius_edit class="radius_tag radius_code">(.*?)</r:wym_radius_edit>', 'gi');
  var m = content.match(regex);
  if (!(m == null)) {
    for (var i=0; i<m.length; i++) {
      var match = unescape(m[i].replace(regex, '<r:$1>'));
      var content = content.replace(m[i], match);
    }
  }

  // fix urls to page attachments
  var regex = new RegExp('src="((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?([\.\/]+)|([\.\/]+))page_attachments', 'g');
  var m = content.match(regex);
  if(!(m == null)) {
    for(var i=0; i<m.length; i++) {
      var match = unescape(m[i].replace(regex, 'src="/page_attachments'));
      var content = content.replace(m[i], match)
    }
  }

  // fix urls to assets
  var regex = new RegExp('src="((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?([\.\/]+)|([\.\/]+))assets', 'g');
  var m = content.match(regex);
  if(!(m == null)) {
    for(var i=0; i<m.length; i++) {
      var match = unescape(m[i].replace(regex, 'src="/assets'));
      var content = content.replace(m[i], match)
    }
  }

  // TODO: convert <img src="/assets/x/foo" alt="foo" /> to
  // <r:assets:image title="foo" /> (but must keep image resizing from the visual editor)

  // update textarea content
  elem.value = style_html(content);

  // show textarea again
  jQuery(elem).show();
}

/**
 * The page will be saved, unboot all WYMeditor instances:
 *
 * - update the editor
 *
 * @return true if successfull
 */
function unboot_all_wym() {
// save button clicked, update all wym instances
  if ($('pages'))        		                // We're on the page edit screen
	{
		var parts = $$('.part');
    for(var i=0;i< parts.length;i++) {
			if (/part-([\w\d-]+)/i.test(parts[i].id))
	      var part_name = RegExp.$1;
      // Find all parts that have WYM set as filter
      if ($F('part_' + part_name + '_filter_id') == 'WymEditor')
        unboot_wym($('part_'+ part_name +'_content'));
    }
  } else if ($('snippet_filter')) {                // We're on the snippet edit screen
    if ($F('snippet_filter') == 'WymEditor') {
      unboot_wym($$('.textarea')[0]);
    }
  }
  return true;
}

/**
 * Accept assets droping to the visual editor
 *
 * @param box - the drop box (visual editor iframe)
 */
function bind_droppability(box) {

  Droppables.add(box, {

    accept: 'asset',

    /* An element has been dropped into the iframe
     *
     * @param element - the dropped element
     */
    onDrop: function(element) {

      // get asset information
      var classes = element.className.split(' ');
      var tag_type = classes[0];
      var link = element.select('a.bucket_link')[0];

      if(tag_type == 'image') {
        // copy the original image to WYM
        var tag = '<img src="'+ link.href +'" alt="'+ link.title +'" />';
      }
      else {
        // copy a link to WYM
        var asset_id = element.id.split('_').last();
        var tag = '<a href="'+ link.href +'">'+ link.title +'</a>'
      }
      if (/(part-|page\_)([\w\d-]+)/i.test(box.ancestors()[2].ancestors()[1].id))
        var wym_index = editors["part_" + RegExp.$2  + "_content"];
      var wymm = WYMeditor.INSTANCES[wym_index];
      wymm.insert(tag);
    }
  });
}

/**
 * Adjusts the height of the iframe when the content of the visual editor is
 * changed.
 */
function adjustFramesize(iframe) {
  if (jQuery.browser.msie) {
    height = (iframe.contentWindow.document.body.scrollHeight + 35) + "px";
  } else {
    height = (iframe.contentWindow.document.body.offsetHeight + 35) + "px";
  }
  iframe.style.height = height;
  jQuery("#wym_right").css({'height': height});
}

/**
 * Overwrite command execution of WYMeditor to use
 * the page preview extension if installed
 *
 * @param cmd - the command to execute
 */
WYMeditor.editor.prototype.exec = function(cmd) {

  //open a dialog or exec
  switch(cmd) {
    case WYMeditor.CREATE_LINK:
      var container = this.container();
      if(container || this._selected_image) this.dialog(WYMeditor.DIALOG_LINK);
    break;

    case WYMeditor.INSERT_IMAGE:
      if (jQuery('#show-bucket').length > 0) {
        var element = $('asset-bucket');
        element.centerInViewport();
        element.toggle();
        Asset.MakeDroppables();
      } else {
        this.dialog(WYMeditor.DIALOG_IMAGE);
      }
    break;

    case WYMeditor.INSERT_TABLE:
      this.dialog(WYMeditor.DIALOG_TABLE);
    break;

    case WYMeditor.PASTE:
      this.dialog(WYMeditor.DIALOG_PASTE);
    break;

    case WYMeditor.TOGGLE_HTML:
      this.update();
      this.toggleHtml();

      //partially fixes #121 when the user manually inserts an image
      if(!jQuery(this._box).find(this._options.htmlSelector).is(':visible'))
        this.listen();
    break;

    case WYMeditor.PREVIEW:
      if (jQuery('input[name="preview_page"]')) {
        // page_preview is installed, use it
        jQuery('input[name="preview_page"]').click();
      } else {
        // use built-in preview dialog
        this.dialog(WYMeditor.PREVIEW);
      }
    break;

    default:
      this._exec(cmd);
    break;
  }
};

/* Overwrite dialog creation of WYM editor. If the prowser is not IE,
 * we use nice BlockUI dialogs instead of popups
 *
 * @param dialogType - the type of the dialog
 * @param bodyHtml - the html for the body of the dialog
 */
WYMeditor.editor.prototype.dialog = function(dialogType, bodyHtml) {

  if (jQuery.browser.msie) {
    // IE must use pop-ups http://trac.wymeditor.org/trac/ticket/63
    var wDialog = window.open(
      '',
      'dialog',
      this._wym._options.dialogFeatures);
  }

  var sBodyHtml = "";

  switch( dialogType ) {

    case(WYMeditor.DIALOG_LINK):
      sBodyHtml = this._options.dialogLinkHtml;
    break;
    case(WYMeditor.DIALOG_IMAGE):
      sBodyHtml = this._options.dialogImageHtml;
    break;
    case(WYMeditor.DIALOG_TABLE):
      sBodyHtml = this._options.dialogTableHtml;
    break;
    case(WYMeditor.DIALOG_PASTE):
      sBodyHtml = this._options.dialogPasteHtml;
    break;
    case(WYMeditor.PREVIEW):
      sBodyHtml = this._options.dialogPreviewHtml;
    break;

    default:
      sBodyHtml = bodyHtml;
  }

  if(jQuery.browser.msie) {
    var h = WYMeditor.Helper;

    //construct the full dialog for IE
    var dialogHtml = this._options.dialogHtml;
    dialogHtml = h.replaceAll(dialogHtml, WYMeditor.BASE_PATH, this._options.basePath);
    dialogHtml = h.replaceAll(dialogHtml, WYMeditor.DIRECTION, this._options.direction);
    dialogHtml = h.replaceAll(dialogHtml, WYMeditor.CSS_PATH, this._options.skinPath + WYMeditor.SKINS_DEFAULT_CSS);
    dialogHtml = h.replaceAll(dialogHtml, WYMeditor.WYM_PATH, this._options.wymPath);
    dialogHtml = h.replaceAll(dialogHtml, WYMeditor.JQUERY_PATH, this._options.jQueryPath);
    dialogHtml = h.replaceAll(dialogHtml, WYMeditor.DIALOG_TITLE, this.encloseString( dialogType ));
    dialogHtml = h.replaceAll(dialogHtml, WYMeditor.DIALOG_BODY, sBodyHtml);
    dialogHtml = h.replaceAll(dialogHtml, WYMeditor.INDEX, this._index);

    dialogHtml = this.replaceStrings(dialogHtml);

    if (wDialog) {
      // write to pop-up
      var doc = wDialog.document;
      doc.write(dialogHtml);
      doc.close();
    }

  } else {
    // use BlockUI to show dialog for all non-msie browsers
    dialogHtml = this.replaceStrings(sBodyHtml);
    dialogHtml = dialogHtml.replace(/<body class='(.*)' onload='WYMeditor.INIT_DIALOG\(\{Wym_Index\}\)'>/, "<div class='$1'>");
    dialogHtml = dialogHtml.replace("</body>", '</div>');
    jQuery.blockUI({ message: dialogHtml });
    initBlockUI(this, dialogType);
  }

/**
 * BlockUI key hadnling
 *
 * @param e - the key event
 */
 function blockUIKeys(e) {
    if( e.which == 27) {  // escape, close box
      jQuery.unblockUI();
      jQuery(document).unbind("keypress", blockUIKeys);
    }
}

/**
 * BlockUI Version for INIT_DIALOG
 *
 * @param wym - the wym editor opened the dialog
 */
function initBlockUI(wym, dialogType) {

  jQuery(document).keypress(blockUIKeys);

  var doc = window.document;

  var selected = wym.selected();
  var sStamp = wym.uniqueStamp();

  switch(dialogType) {

  case WYMeditor.DIALOG_LINK:
    //ensure that we select the link to populate the fields
    if(selected && selected.tagName && selected.tagName.toLowerCase != WYMeditor.A)
      selected = jQuery(selected).parentsOrSelf(WYMeditor.A);

    //fix MSIE selection if link image has been clicked
    if(!selected && wym._selected_image)
      selected = jQuery(wym._selected_image).parentsOrSelf(WYMeditor.A);
      break;

  }

  //pre-init functions
  if(jQuery.isFunction(wym._options.preInitDialog))
    wym._options.preInitDialog(wym);

  //add css rules from options
  var styles = doc.styleSheets[0];
  var aCss = eval(wym._options.dialogStyles);

  wym.addCssRules(doc, aCss);

  //auto populate fields if selected container (e.g. A)
  if(selected) {
    jQuery(wym._options.hrefSelector).val(jQuery(selected).attr(WYMeditor.HREF));
    jQuery(wym._options.srcSelector).val(jQuery(selected).attr(WYMeditor.SRC));
    jQuery(wym._options.titleSelector).val(jQuery(selected).attr(WYMeditor.TITLE));
    jQuery(wym._options.altSelector).val(jQuery(selected).attr(WYMeditor.ALT));
  }

  //auto populate image fields if selected image
  if(wym._selected_image) {
    jQuery(wym._options.dialogImageSelector + " " + wym._options.srcSelector)
      .val(jQuery(wym._selected_image).attr(WYMeditor.SRC));
    jQuery(wym._options.dialogImageSelector + " " + wym._options.titleSelector)
      .val(jQuery(wym._selected_image).attr(WYMeditor.TITLE));
    jQuery(wym._options.dialogImageSelector + " " + wym._options.altSelector)
      .val(jQuery(wym._selected_image).attr(WYMeditor.ALT));
  }

  jQuery(wym._options.dialogLinkSelector + " "
    + wym._options.submitSelector).click(function() {

      var sUrl = jQuery(wym._options.hrefSelector).val();
      if(sUrl.length > 0) {

        wym._exec(WYMeditor.CREATE_LINK, sStamp);

        jQuery("a[@href=" + sStamp + "]", wym._doc.body)
            .attr(WYMeditor.HREF, sUrl)
            .attr(WYMeditor.TITLE, jQuery(wym._options.titleSelector).val());

      }

      jQuery.unblockUI();
      jQuery(document).unbind("keypress", blockUIKeys);
  });

  jQuery(wym._options.dialogImageSelector + " "
    + wym._options.submitSelector).click(function() {

      var sUrl = jQuery(wym._options.srcSelector).val();
      if(sUrl.length > 0) {

        wym._exec(WYMeditor.INSERT_IMAGE, sStamp);

        jQuery("img[@src=" + sStamp + "]", wym._doc.body)
            .attr(WYMeditor.SRC, sUrl)
            .attr(WYMeditor.TITLE, jQuery(wym._options.titleSelector).val())
            .attr(WYMeditor.ALT, jQuery(wym._options.altSelector).val());
      }
      jQuery.unblockUI();
      jQuery(document).unbind("keypress", blockUIKeys);
  });

  jQuery(wym._options.dialogTableSelector + " "
    + wym._options.submitSelector).click(function() {

      var iRows = jQuery(wym._options.rowsSelector).val();
      var iCols = jQuery(wym._options.colsSelector).val();

      if(iRows > 0 && iCols > 0) {

        var table = wym._doc.createElement(WYMeditor.TABLE);
        var newRow = null;
		var newCol = null;

		var sCaption = jQuery(wym._options.captionSelector).val();

		//we create the caption
		var newCaption = table.createCaption();
		newCaption.innerHTML = sCaption;

		//we create the rows and cells
		for(x=0; x<iRows; x++) {
			newRow = table.insertRow(x);
			for(y=0; y<iCols; y++) {newRow.insertCell(y);}
		}

        //set the summary attr
        jQuery(table).attr('summary',
            jQuery(wym._options.summarySelector).val());

        //append the table after the selected container
        var node = jQuery(wym.findUp(wym.container(),
          WYMeditor.MAIN_CONTAINERS)).get(0);
        if(!node || !node.parentNode) jQuery(wym._doc.body).append(table);
        else jQuery(node).after(table);
      }
      jQuery.unblockUI();
      jQuery(document).unbind("keypress", blockUIKeys);
  });

  jQuery(wym._options.dialogPasteSelector + " "
    + wym._options.submitSelector).click(function() {

      var sText = jQuery(wym._options.textSelector).val();
      wym.paste(sText);
      jQuery.unblockUI();
      jQuery(document).unbind("keypress", blockUIKeys);
  });

  jQuery(wym._options.dialogPreviewSelector + " "
    + wym._options.previewSelector)
    .html(wym.xhtml());

  //cancel button

  jQuery(wym._options.cancelSelector).mousedown(function() {
      jQuery.unblockUI();
      jQuery(document).unbind("keypress", blockUIKeys);
  });

  //pre-init functions
  if(jQuery.isFunction(wym._options.postInitDialog))
    wym._options.postInitDialog(wym);

  };
};