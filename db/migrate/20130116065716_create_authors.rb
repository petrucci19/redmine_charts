class CreateAuthors < ActiveRecord::Migration
  def change
    create_table :authors do |t|
    	t.column :name, :string
    	t.column :email, :string
      t.column :password_digest, :string
  	end
  end
end
