class ProjectController < ApplicationController

	def list
		
		@p_testcases_ns = TestCase.where(["project_id = ? AND status_id = 1", params[:pid]], ).find(:all)
		@p_testcases_f = TestCase.where(["project_id = ? AND status_id = 2", params[:pid]], ).find(:all)
		@p_testcases_p = TestCase.where(["project_id = ? AND status_id = 3", params[:pid]], ).find(:all)
		
		@pie_data = { ns: @p_testcases_ns.length, p: @p_testcases_p.length, f: @p_testcases_f.length }

		respond_to do |format|
	      format.html
	      format.xml { render :xml => @pie_data }
	      format.json { render :json => @pie_data }
	    end
	end
end
