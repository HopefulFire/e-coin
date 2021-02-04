class User < ApplicationRecord
  validates(
    :username,
    format: {
      with: /\A[\w\-]{3,21}\z/,
      message: 'Username must be between 3 and 21 word or number characters.'
    }
  )
  validates(
    :password,
    format: {
      with: /\A(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])[\S]{8,21}\z/,
      message: 'Password must be between 8 and 21 characters and must have one upper and lowercase letter and one number.'
    }
  )
  validates(
    :email,
    format: {
      with: /\A\S+@\S+\.\S+\a/,
      message: 'Email must be valid.'
    }
  )
end
