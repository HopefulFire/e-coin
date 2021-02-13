class Transaction < ApplicationRecord
  validates :amount, presence: true, numericality: { only_integer: true, other_than: 0}

  belongs_to :sender, class_name: :User, inverse_of: :transactions_sent
  belongs_to :receiver, class_name: :User, inverse_of: :transactions_received

  scope :sent_and_received_transactions, -> (user) do
    where(
      'sender_id = ? OR receiver_id = ?',
      user.id,
      user.id,
    ).order(created_at: :desc)
  end
end
