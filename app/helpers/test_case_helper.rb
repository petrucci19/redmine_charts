module TestCaseHelper
	def get_periods(columns,to,nbr=9)
	    periods = []
	    case columns
	    when 'month'
	      from = to-nbr.months
	    when 'week'
	      from = to-nbr.weeks
	    when 'day'
	      from = to - nbr.days
	    else
	      from = to - 1.year
	    end
	    date_from = from.to_time
	    while date_from <= to.to_time && periods.length <= 100
	        case columns
	        when 'year'
	          periods << "#{date_from.year}"
	          date_from = (date_from + 1.year).at_beginning_of_year
	        when 'month'
	          periods << "#{date_from.year}-#{date_from.month}"
	          date_from = (date_from + 1.month).at_beginning_of_month
	        
	        when 'week'
	          l = periods.last.to_s
	          last = l.split("-")
	          if last[1]=="52"
	          	year = (last[0].to_i + 1).to_s
	          	periods << "#{year}-00"
	          	periods << "#{year}-01"
	          	date_from = (date_from + 2.week).at_beginning_of_week
	          	next
	          end
	          d = sprintf '%02d', (date_from.to_date.strftime("%W").to_i)

	          periods << "#{date_from.year}-#{d}"
	          date_from = (date_from + 1.week).at_beginning_of_week
	        
	        when 'day'
	          periods << "#{date_from.to_date}"
	          date_from = date_from + 1.day
	        end
	    end
	    periods
	end
end
