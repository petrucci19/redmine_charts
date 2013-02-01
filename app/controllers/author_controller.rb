class AuthorController < ApplicationController
	before_filter :signed_in_author, only: [:list, :show]

	def list
		@a_testcases = TestCase.where(["author_id = ?", params[:aid]]).find(:all)
	end

	def show
    	@author = Author.find(params[:id])
  	end

	def new
    	@author = Author.new
  	end

  	def create
	    @author = Author.new(params[:author])
	    if @author.save
	    	sign_in @author
      		flash[:success] = "Welcome to ... !"
	      	redirect_to :action => 'show', :id => @author
	    else
	      render 'new'
	    end
  	end

  	

end
