class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
    	t.column :name, :string
    end
    Project.create :name => "Project1"
  	Project.create :name => "Project2"
  	Project.create :name => "Project3"
  	Project.create :name => "Project4"
  	Project.create :name => "Project5"
   end
end
