class Transaction < ApplicationRecord
  validates :amount, presence: true, numericality: { only_integer: true, other_than: 0 }

  belongs_to :sender, class_name: :User, inverse_of: :transactions_sent
  belongs_to :receiver, class_name: :User, inverse_of: :transactions_received

  scope :sent_and_received_transactions, lambda { |user|
    where(
      '(sender_id = ? OR receiver_id = ?) AND blocked = ?',
      user.id,
      user.id,
      false
    ).order(created_at: :desc)
  }
end
