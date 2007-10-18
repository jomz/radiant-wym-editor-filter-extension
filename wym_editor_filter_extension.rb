class WymEditorFilterExtension < Radiant::Extension
  version "0.3"
  description "Provides WYSIWYM (What You See Is What You Mean) rich text editing capabilities. Read all about WYMeditor at http://www.wymeditor.org/en/"
  url "http://gorilla-webdesign.be/"
  
  def activate
    WymEditorFilter
    admin.page.edit.add :main, 'wym_includes', :before => 'edit_header'
    admin.page.edit.add :part_controls, 'wym_part'
  end
  
  def deactivate
    
  end
  
end