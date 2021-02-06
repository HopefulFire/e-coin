class User < ApplicationRecord
  has_secure_password
  validates :username, presence: true, format: { with: /\A\w{3,21}\z/, message: 'only allows letters between 3 and 21 in length.' }
  validates :email, presence: true, format: { with: /\A\S+@\S+\.\S+\z/, message: 'must be a valid email.' }
  validates :password, presence: true, format: { with: /\A(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8, 21}\z/, message: 'must be a strong password.' }
end
