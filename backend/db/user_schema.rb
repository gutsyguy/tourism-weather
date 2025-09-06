ActiveRecord::Schema[7.1].define(version: 1) do   
create_table :users do |t|
    t.string :email, null: false, index: { unique: true }
    t.string :name
    t.timestamps
  end
end
  