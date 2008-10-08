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
        is_svn_or_dir = proc {|path| path =~ /\.svn/ || File.directory?(path) }
        Dir[WymEditorFilterExtension.root + "/public/**/*"].reject(&is_svn_or_dir).each do |file|
          path = file.sub(WymEditorFilterExtension.root, '')
          directory = File.dirname(path)
          puts "Copying #{path}..."
          mkdir_p RAILS_ROOT + directory
          cp file, RAILS_ROOT + path
        end
      end
      
      desc "Update public files except wym.css"
      task :update => :environment do
        is_svn_or_dir = proc {|path| path =~ /\.svn/ || File.directory?(path) }
        Dir[WymEditorFilterExtension.root + "/public/**/*"].reject(&is_svn_or_dir).each do |file|
          next if file =~ /wym\.css/
          path = file.sub(WymEditorFilterExtension.root, '')
          directory = File.dirname(path)
          puts "Copying #{path}..."
          mkdir_p RAILS_ROOT + directory
          cp file, RAILS_ROOT + path
        end
      end
      

    end
  end
end