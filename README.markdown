Radiant *Wym Editor Filter* Extension
===================================

<table>
    <tr>
        <td>Author</td>
        <td>Benny Degezelle - <a href="http://www.gorilla-webdesign.be">Gorilla Webdesign</a></td>
    </tr>
    <tr>
        <td>Version</td>
        <td>0.4</td>
    </tr>
    <tr>
        <td>Contact:</td>
        <td>benny AT gorilla-webdesign DOT be</td>
    </tr>
</table>

This filter adds a [WYSIWYM](http://en.wikipedia.org/wiki/WYSIWYM) editor to [Radiant](http://www.radiantcms.org/).

### Integration

The WYMeditor is aware of and interacts with the following extensions, but these are not required:

- [Paperclipped](http://github.com/kbingman/paperclipped/tree/master) 
   - Open the asset bucket from the WYMeditor toolbar
   - Adding asset with drag'n'drop from the bucket
- [Page Preview](http://github.com/tricycle/radiant-page-preview-extension/tree/master)
   - Open preview from the WYMeditor toolbar

About WYMeditor
---------------

WYMeditor's main concept is to leave details of the document's visual layout, and to concentrate on its structure and
meaning, while trying to give the user as much comfort as possible (at least as WYSIWYG editors).

WYMeditor has been created to generate perfectly structured XHTML strict code, to conform to the [W3C XHTML](http://www.w3.org/TR/xhtml1/)
specifications and to facilitate further processing by modern applications.

Find out more about WYM editor at [http://www.wymeditor.org](http://www.wymeditor.org).

<img src="../raw/master/wym_editor_filter.png" width="587" height="574" alt="WymEditor in action">

Installation
------------

Run this `rake` command to copy all needed files into the public folder:

	rake radiant:extensions:wym_editor_filter:install

That's it! You should now have "Wym Editor" in the filters dropdown on the page edit screen.
Selecting this will spawn a WYMeditor instance.

It's a good idea to manage your extensions with [Ray](http://github.com/johnmuhl/radiant-ray-extension/tree/master).

Update
------

Run this `rake` command to update all files in public folder:

    rake radiant:extensions:wym_editor_filter:update

Changelog
---------

### 0.4

- On long pages, the toolbar, container and classes selector boxes follows the page scrolling for easier editing.
- Pop-ups are replaced with [BlockUI](http://malsup.com/jquery/block/), except for Internet Explorer (see [Ticket](http://trac.wymeditor.org/trac/ticket/63)).
- The insert image button uses [Paperclipped](http://github.com/kbingman/paperclipped/tree/master) if installed.
- Radius tags are now editable in WYMeditor.
- Fixed the problem where WYMeditor 'cleaned' the XHTML when Radius tags have been placed within block elements.
- Generated XHTML code will be formatted using [js-beatuty](http://github.com/einars/js-beautify/tree/master)

### 0.3.5

- Updated to WYMeditor 0.5b-2
- Move javascript into extension folder.
- Updated editor & dialogs CSS to better fit into Radiant.
- Auto-growing the editor when content gets longer than it can show.
- Preview button uses [Page Preview](http://github.com/tricycle/radiant-page-preview-extension/tree/master) if installed.

### 0.3.4

- Updated to WYMeditor 0.5a-2
- Fixed bug where on_save, all edits made after switching to a different filter were lost.

### 0.3.3

- Removed svn:external to wymeditor, managed through braid now.
- Updated to WYMeditor 0.5a-1
- Fixed empty <td> problem.

### 0.3.2

- Updated to work with radiant 0.6.5

### 0.3.1

- Fixed includes for Opera & Safari, now works fine on those browsers too.

### 0.3

- Radius tags are now handled properly. They are replaced with an image that holds the respective tag in it's alt attribute.

### 0.2

- Now uses shards to alter the admin interface, so it doesn't interfere with other extensions

Contributors
------------

* [Bermi Ferrer](http://www.bermi.org/)
* [Jean-François Hovinne](http://www.hovinne.com/)
* Bjørn Arild Mæland
* [David Piehler](http://basicsgroup.com/)
* [Tim Blair](http://tim.bla.ir/)
* [Michael Kessler](http://blog.netzpiraten.ch/)

Sponsors
--------

Some work has been kindly sponsored by:

* [Gorilla Webdesign](http://www.gorilla-webdesign.be)
* [ScreenConcept](http://www.screenconcept.ch)

License
-------

This extension is released under the MIT license, see the [LICENSE](master/LICENSE) for more
information.
