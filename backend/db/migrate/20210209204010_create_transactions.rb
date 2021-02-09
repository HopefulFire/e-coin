class CreateTransactions < ActiveRecord::Migration[6.1]
  def change
    create_table :transactions do |t|
      t.integer :amount
      t.integer :sender_id
      t.integer :receiver_id
      t.boolean :confirmed

      t.timestamps
    end
  end
end
