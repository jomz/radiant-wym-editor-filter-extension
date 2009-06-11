class WymEditorFilterExtension < Radiant::Extension
  version "0.4"
  description "Provides WYSIWYM (What You See Is What You Mean) rich text editing capabilities. Read all about WYMeditor at http://www.wymeditor.org/en/"
  url "http://gorilla-webdesign.be/artikel/48-WYM+on+Radiant"
  
  def activate
    raise "The Shards extension is required and must be loaded first!" unless defined?(admin.page)
    WymEditorFilter
    admin.page.edit.add :main, 'wym_includes', :before => 'edit_header'
    admin.page.edit.add :part_controls, 'wym_part'
    admin.snippet.edit.add :main, 'wym_includes', :before => 'edit_header'  
    admin.snippet.edit.add :main, 'wym_part', :after => 'edit_form'
  end
  
  def deactivate
    
  end
  
end