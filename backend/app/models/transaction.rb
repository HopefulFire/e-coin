class Transaction < ApplicationRecord
  validates :amount, presence: true, numericality: { only_integer: true, other_than: 0}

  scope :sent_and_received_transactions, -> (user) do
    where(
      'sender_id = ? OR receiver_id = ? AND confirmed = ?',
      user.id,
      user.id,
      true
    ).order(created_at: :desc)
  end
end
