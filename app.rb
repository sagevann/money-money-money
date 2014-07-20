require 'rubygems'
require 'sinatra/base'
require 'sinatra/content_for'
require 'json'
require 'byebug'
require 'rack-flash'


class SinatraBootstrap < Sinatra::Base
  helpers Sinatra::ContentFor

  use Rack::Session::Pool, :expire_after => 2592000
  use Rack::Flash

  get '/' do
    erb :index
  end

  get '/buyitnow' do
    erb :can_we_buy
  end

  get '/savings' do
    erb :savings
  end
  
  get '/about' do
    erb :about
  end
  

  # start the server if ruby file executed directly
  run! if app_file == $0
end
