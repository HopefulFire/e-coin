json.user do |user|
  user.partial! 'users/user', user: current_user
end