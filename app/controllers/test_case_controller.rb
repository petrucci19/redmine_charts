class TestCaseController < ApplicationController
	before_filter :signed_in_author, only: [:new, :create, :update, :delete, :edit, :destroy]
	include TestCaseHelper

	def new
		@testcase = TestCase.new
		#@testcase.author_id = 2
		#@authors = Author.find(:all)
		@projects = Project.find(:all)
		@statuses = Status.find(:all)
	end

	def create
		@testcase = TestCase.new(params[:testcase])
		@testcase.author_id = @current_author.id
		if @testcase.save
			redirect_to :action => 'list'
		else
			@authors = Author.find(:all)
			@projects = Project.find(:all)

			render :action => 'new'
		end
	end

	def edit
		@testcase = TestCase.find(params[:id])
		#@authors = Author.find(:all)
		@projects = Project.find(:all)
	end

	def update
		@testcase = TestCase.find(params[:id])
		if @testcase.update_attributes(params[:testcase])
			redirect_to :action => 'show', :id => @testcase
		else
			@testcases = TestCase.find(:all)
			render :action => 'edit'
		end
	end

	def list
		@testcases = TestCase.find(:all)
	end

	def delete
		TestCase.find(params[:id]).destroy
		#del vs destroy
		redirect_to :action => 'list'
	end

	def show
      @testcase = TestCase.find(params[:id])
    end

    def show_authors
      @author = Author.find(params[:id])
      @projects = Project.find(:all)
    end

    
    def calendar
    	ten_days = Date.today - 9.days
		#month_end = Date.today
		ten_weeks = Date.today - 9.weeks
		#week_end = Date.today
		#@testcases_return = ActiveSupport::OrderedHash.new
		if params[:select] == 'days'	
			@testcases_return = TestCase.where("created_at >= ?", ten_days).group('date(created_at)').count     		#use sum SQL -> faster
			@arr = get_periods("day",Date.today)

			@arr.each do |x| 
				if @testcases_return[x] == nil
						@testcases_return[x] = 0
				end
			end
			@testcases_return =  "{" + @testcases_return.sort.map{|k,v| "#{k.inspect}" + ":" + "#{v.inspect}" }.join(",") + "}"
		
		
		elsif params[:select] == 'weeks'	
			@testcases_return = TestCase.where("created_at >= ?", ten_weeks).group_by{ |u| u.created_at.end_of_week.to_date.strftime("%Y-%W") }
			@output_hash = {}
			@testcases_return.each do |key,value|
				
				@output_hash[key] = value.count
			end
			@testcases_return = @output_hash
			
			@arr = get_periods("week",Date.today,)
			@arr.each do |x| 
				if @testcases_return[x] == nil
						@testcases_return[x] = 0
				end
			end
			@testcases_return =  "{" + @testcases_return.sort.map{|k,v| "#{k.inspect}" + ":" + "#{v.inspect}" }.join(",") + "}"


		end

		respond_to do |format|
		    format.html
		    format.xml { render :xml => @testcases_return }
		    format.json { render :json => @testcases_return }
		end
		

		
    end


    def my_calendar
    	Rails.logger.info params
    	data = {"2013-01-25"=>"5","2013-05-26"=>"8","2013-04-03"=>"9","2013-06-25"=>"3","2013-07-02"=>"6","2013-02-15"=>"1","2013-01-05"=>"2","2013-01-25"=>"4"};
    	respond_to do |format|
    		format.html #{render :text => params}
		    format.xml { render :xml => data }
		    format.json { render :json => data }
		end
    end


    def my_month
    	data = {"2013-02-25"=>"5","2013-02-26"=>"8","2013-02-03"=>"9","2013-02-21"=>"3","2013-02-02"=>"6","2013-02-15"=>"1","2013-02-05"=>"2","2013-02-28"=>"4"};
    	respond_to do |format|
    		format.html
		    format.xml { render :xml => data }
		    format.json { render :json => data }
		end
    end

    def ten_days
    	data = {"2013-02-01"=>"5","2013-02-02"=>"8","2013-02-03"=>"9","2013-02-04"=>"3","2013-02-05"=>"6","2013-02-06"=>"1","2013-01-31"=>"2","2013-01-30"=>"4"};
    	respond_to do |format|
    		format.html
		    format.xml { render :xml => data }
		    format.json { render :json => data }
		end
    end

    def bar1	
    	s = {"Day 1" => [2, 6, 7] , "Day 2" => [4.6, 2.1, 6.9], "Day 3" => [2.6, 4.4, 3.2], "Day 4" => [4,5,2]};

    	respond_to do |format|
		    format.xml { render :xml => s }
		    format.json { render :json => s }
		end

	end

	def activity
		dataset = 
			{"20-Dec-11"=>95.95,
			"19-Dec-11"=>82.21,
			"18-Dec-11"=>87.93,
			"17-Dec-11"=>87.93,
			"16-Dec-11"=>81.02,
			"15-Dec-11"=>8.94,
			"14-Dec-11"=>80.19,
			"13-Dec-11"=>88.81,
			"12-Dec-11"=>91.84,
			"11-Dec-11"=>87.93,
			"10-Dec-11"=>87.93,
			"9-Dec-11"=>3.62,
			"8-Dec-11"=>39.6,
			"7-Dec-11"=>38.0,
			"6-Dec-11"=>9.95,
			"5-Dec-11"=>93.01,
			"4-Dec-11"=>87.93,
			"3-Dec-11"=>87.93,
			"2-Dec-11"=>89.70,
			"1-Dec-11"=>87.93,
			"30-Nov-11"=>0,
			"29-Nov-11"=>0,
			"28-Nov-11"=>0,
			"27-Nov-11"=>66.99,
			"26-Nov-11"=>66.99,
			"25-Nov-11"=>63.57,
			"24-Nov-11"=>66.99,
			"23-Nov-11"=>66.99,
			"22-Nov-11"=>76.51,
			"21-Nov-11"=>69.01,
			"20-Nov-11"=>0,
			"19-Nov-11"=>0,
			"18-Nov-11"=>0,
			"17-Nov-11"=>0,
			"16-Nov-11"=>0,
			"15-Nov-11"=>68.83,
			"14-Nov-11"=>0}
		respond_to do |format|
			format.html
		    format.xml { render :xml => dataset }
		    format.json { render :json => dataset }
		end
	end


	def calendar_tooltip
		@tooltip_date = params[:date].split("-")
		
		if @tooltip_date[0] == "week" 
			#week_no = @tooltip_date[1].to_i - 1
			week_no = @tooltip_date[2]
			year = @tooltip_date[1]
			Rails.logger.info(params)
			Rails.logger.info(params[:date].split("-"))
			@tooltip_return = TestCase.where(" strftime('%W',created_at) = ? AND strftime('%Y',created_at) = ? ", week_no, year).group('status_id').count
		end

		if @tooltip_date[0] == "day"
			year = @tooltip_date[1]
			month = @tooltip_date[2]
			day = @tooltip_date[3]
			@tooltip_return = TestCase.where(" strftime('%Y',created_at) = ? AND strftime('%m',created_at) = ? AND strftime('%d',created_at) = ? ", year, month, day).group('status_id').count
		end
		

		respond_to do |format|
			format.html
		    format.xml { render :xml => @tooltip_return }
		    format.json { render :json => @tooltip_return }
		end
	end


end
