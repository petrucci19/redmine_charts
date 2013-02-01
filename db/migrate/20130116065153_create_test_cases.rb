class CreateTestCases < ActiveRecord::Migration
  def change
    drop_table :test_cases
    create_table :test_cases do |t|
    	t.text :title
    	t.text :content, :null => false
  		t.integer :author_id
  		t.integer :project_id
      t.integer :status_id
  		t.timestamp :created_at
  	end
  end
end