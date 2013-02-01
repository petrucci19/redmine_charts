class SessionsController < ApplicationController
	

	def create
	    author = Author.find_by_email(params[:session][:email].downcase)
	    if author && author.authenticate(params[:session][:password])
	      sign_in author
	      redirect_to '/test_case/list'
	    else
	      flash.now[:error] = 'Invalid email/password combination'
	      render 'new'
	    end
  	end

  	def destroy
	    sign_out
	    redirect_to '/test_case/list'
	end


end
