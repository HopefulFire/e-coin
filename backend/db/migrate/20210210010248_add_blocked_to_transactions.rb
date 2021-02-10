class AddBlockedToTransactions < ActiveRecord::Migration[6.1]
  def change
    add_column :transactions, :blocked, :boolean
  end
end
