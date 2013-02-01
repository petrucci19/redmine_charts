class TestCases < ActiveRecord::Migration
  def up
  	create_table :TestCases do |t|
  		t.column :content, :null => false
  		t.column :author_id, :integer
  		t.column :created_at, :timestamp
  	end
  end

  def down
  	drop_table :TestCases
  end
end
