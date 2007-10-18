class WymEditorFilter < TextFilter
  filter_name "WymEditor"
  description_file File.dirname(__FILE__) + "/../wymeditor.html"
  def filter(text)
    text
  end
end