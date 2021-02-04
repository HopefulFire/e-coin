class User < ApplicationRecord
  has_secure_password
  has_one :account

  validates(
    :username,
    format: {
      with: /\A[\w\-]{3,21}\z/,
      message: 'must be between 3 and 21 word or number characters.'
    }
  )
  validates(
    :email_address,
    format: {
      with: /\A\S+@\S+\.\S+\a/,
      message: 'must be valid.'
    }
  )
end
