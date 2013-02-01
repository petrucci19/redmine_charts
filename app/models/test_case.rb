class TestCase < ActiveRecord::Base
  attr_accessible :content, :author_id, :project_id, :title, :status_id, :created_at
  belongs_to :author
  belongs_to :project
  belongs_to :status
  validates_presence_of :content

end
