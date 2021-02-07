json.id @user.id
json.username @user.username
json.email @user.email
json.passwordDigest @user.password_digest
json.account do |account|
  account.id @user.account&.id
  account.balance @user.account&.balance
  account.user_id @user.account&.user&.id
end