class ApplicationController < ActionController::Base
  protect_from_forgery
  include SessionsHelper
  #config.action_view.javascript_expansions[:defaults] = %w(jquery rails)
end
