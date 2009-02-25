Wym Editor Filter
=================

<table>
    <tr>
        <td>Author</td>
        <td>Benny Degezelle - [gorilla-webdesign.be](gorilla-webdesign.be)</td>
    </tr>
    <tr>
        <td>Version</td>
        <td>0.3.5</td>
    </tr>
    <tr>
        <td>Contact:</td>
        <td>benny AT gorilla-webdesign DOT be</td>
    </tr>
</table>

This filter adds a WYSIWYM editor to Radiant.

It is aware of and interacts with the paperclipped and preview extension, but these are not required.

About WYMeditor
---------------

WYMeditor's main concept is to leave details of the document's visual layout, and to concentrate on its structure and
meaning, while trying to give the user as much comfort as possible (at least as WYSIWYG editors).

WYMeditor has been created to generate perfectly structured XHTML strict code, to conform to the W3C XHTML
specifications and to facilitate further processing by modern applications.

Find out more about WYM editor at [http://www.wymeditor.org](http://www.wymeditor.org)

<img src="master/wym_editor_filter.png" width="587" height="574" alt="WymEditor in action">

Requirements
------------

If your Radiant is pre-0.6.7, you need the [shards extension](http://groups.google.com/group/radiantcms-dev/browse_frm/thread/d07f7fffd84b3ce0/5efa6fd6c2e1668e?lnk=gst&q=shards#5efa6fd6c2e1668e)


Installation
------------

Run this `rake command to copy all needed files into the public folder:

	rake radiant:extensions:wym_editor_filter:install

That's it! You should now have "Wym Editor" in the filters dropdown on the page edit screen.
Selecting this will spawn a WYMeditor instance.

Changelog
---------

### 0.3.5

- Updated to wym 0.5b-2
- Move javascript into extension folder
- Updated editor & dialogs CSS to better fit into Radiant.
- Auto-growing the editor when content gets longer than it can show.
- Preview button uses radiant-preview-extension if installed.

Big thanks for all that to netzpirat (Michael Kessler)!!

### 0.3.4

- Updated to wym 0.5a-2
- Fixed bug where on_save, all edits made after switching to a different filter were lost.

### 0.3.3

- Removed svn:external to wymeditor, managed through braid now.
- Updated to wym 0.5a-1
- Fixed empty <td> problem

### 0.3.2

- Updated to work with radiant 0.6.5 (Thanks to David Piehler and Tim Blair)

### 0.3.1

- Fixed includes for opera & safari, now works fine on those browsers too.

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
* [ScreenConcept](http://www.screenconcept.ch).

License
-------

This extension is released under the MIT license, see the [LICENSE](master/LICENSE) for more
information.