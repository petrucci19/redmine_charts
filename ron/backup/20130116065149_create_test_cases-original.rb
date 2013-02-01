class CreateTestCases < ActiveRecord::Migration
  def change
    create_table :test_cases do |t|

      t.timestamps
    end
  end
end
