class Project < ActiveRecord::Base
  attr_accessible :name
  has_many :test_case

end
