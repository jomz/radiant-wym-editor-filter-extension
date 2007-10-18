namespace :radiant do
  namespace :extensions do
    namespace :wym_editor_filter do
      
      desc "Runs the migration of the Wym Editor Filter extension"
      task :migrate => :environment do
        require 'radiant/extension_migrator'
        if ENV["VERSION"]
          WymEditorFilterExtension.migrator.migrate(ENV["VERSION"].to_i)
        else
          WymEditorFilterExtension.migrator.migrate
        end
      end

      desc "Copy needed files to public dir"
      task :install => :environment do
        `rsync -a --exclude '.svn' #{WymEditorFilterExtension.root + "/public/"} #{RAILS_ROOT + "/public/"}`
      end

    end
  end
end