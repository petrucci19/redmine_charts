class CreateAuthors < ActiveRecord::Migration
  def change
  	drop_table :authors
    create_table :authors do |t|
    	t.column :name, :string
    	t.column :email, :string
      t.column :password_digest, :string
  	end
  end
end
