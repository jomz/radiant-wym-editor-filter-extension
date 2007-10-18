require File.dirname(__FILE__) + '/../test_helper'

class WymEditorFilterExtensionTest < Test::Unit::TestCase
  
  # Replace this with your real tests.
  def test_this_extension
    flunk
  end
  
  def test_initialization
    assert_equal File.join(File.expand_path(RAILS_ROOT), 'vendor', 'extensions', 'wym_editor_filter'), WymEditorFilterExtension.root
    assert_equal 'Wym Editor Filter', WymEditorFilterExtension.extension_name
  end
  
end
