# Bundler and models.
require './models.rb'
require './app'

# Middleware.
use Rack::Session::Cookie, secret: 'dev_secret'

# Controllers setup.
require './app.rb'
Dir['./controllers/*.rb'].each { |file| require file }
run SinatraBootstrap