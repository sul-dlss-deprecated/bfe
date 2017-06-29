set :application, 'bfe-dev'
set :repo_url, 'https://github.com/sul-dlss/bfe.git'
set :user, 'bibframe'
set :profiles, 'ld4p-loc-profiles-dev.stanford.edu:~/profile-edit/source/profiles'

# Default branch is :master
ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, "/var/www/my_app_name"
set :deploy_to, "/opt/app/#{fetch(:user)}/#{fetch(:application)}"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# append :linked_files, "config/database.yml", "config/secrets.yml"

# Default value for linked_dirs is []
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"
set :linked_dirs, ['static/profiles']

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

set :npm_target_path, (-> { release_path })
set :npm_flags, '--silent --no-progress'
set :npm_roles, :all
set :npm_env_variables, {}

namespace :deploy do
  desc 'Start server'
  after :finished, :restart do
    on roles(:app) do
      within release_path do
        execute "cd #{release_path} && grunt --force && forever stopall && sleep 5 && forever start server-bfe.js"
        execute 'pkill php && sleep 5; true'
        execute "cd #{release_path.join('include')} && forever start -c sh phpServer.sh && sleep 5"
        execute 'cd /opt/app/bibframe/verso && forever start server/server.js'
        execute 'forever list'
      end
    end
  end
end
