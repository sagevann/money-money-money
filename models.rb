require 'bundler'
Bundler.require

# Figure out the database we're using.
unless ENV['DATABASE_URL']  # This variable is set on Heroku.
  Dir.mkdir 'tmp' unless File.exist? 'tmp'
  
  ENV['DATABASE_URL'] = "sqlite://#{Dir.pwd}/tmp/dev.sqlite3"
  
end
DataMapper::Logger.new($stdout, :error)
DataMapper.setup :default, ENV['DATABASE_URL']

# Load up the models and sync the database schema.
Dir['./models/*.rb'].each { |file| require file }
DataMapper.finalize
DataMapper.auto_upgrade!