class User < ApplicationRecord
  has_secure_password

  has_one :account
  has_many :transactions_sent, class_name: :Transaction, foreign_key: :sender_id, inverse_of: :sender
  has_many :transactions_received, class_name: :Transaction, foreign_key: :receiver_id, inverse_of: :receiver

  validates :username, presence: true, uniqueness: true, format: { with: /\A\w{3,21}\z/, message: 'only allows letters between 3 and 21 in length.' }
  validates :email, presence: true, uniqueness: true,format: { with: /\A\S+@\S+\.\S+\z/, message: 'must be a valid email.' }  
end
