class Authors < ActiveRecord::Migration
  def up
  	create_table :Authors do |t|
  		t.column :name, :string
  	end
  	Author.create :name => "A"
  	Author.create :name => "B"
  	Author.create :name => "C"
  end

  def down
  	drop_table :Authors
  end
end
