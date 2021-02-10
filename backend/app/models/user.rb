class User < ApplicationRecord
  has_secure_password
  has_one :account
  validates(
    :username,
    presence: true,
    uniqueness: true,
    format: {
      with: /\A\w{3,21}\z/,
      message: 'only allows letters between 3 and 21 in length.'
    }
  )
  validates(
    :email,
    presence: true,
    uniqueness: true,
    format: {
      with: /\A\S+@\S+\.\S+\z/,
      message: 'must be a valid email.'
    }
  )
end
