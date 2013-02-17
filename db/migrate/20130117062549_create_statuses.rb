class CreateStatuses < ActiveRecord::Migration
  def change
    create_table :statuses do |t|
    	t.column :name, :string
    end
    Status.create :name => "Not Started"
  	Status.create :name => "Failed"
  	Status.create :name => "Passed"
   end
end
