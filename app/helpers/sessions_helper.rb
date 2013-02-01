module SessionsHelper
	def sign_in(author)
	    cookies.permanent[:remember_token] = author.remember_token
	    self.current_author = author
	end

	def sign_out
	    self.current_author = nil
	    cookies.delete(:remember_token)
	end

	def signed_in?
    	!current_author.nil?
  	end

    def current_author=(author)
	    @current_author = author
  	end

  	def current_author
    	@current_author ||= Author.find_by_remember_token(cookies[:remember_token])
  	end

  	def current_author?(author)
	    author == current_author
	end

	def signed_in_author
	    unless signed_in?
	      #store_location
	      redirect_to signin_url, notice: "Please sign in."
	    end
	end
	
end
