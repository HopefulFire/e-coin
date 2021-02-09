json.amount transaction.amount
json.id transaction.id
json.confirmed transaction.confirmed
json.receiver do |receiver|
  receiver.id transaction.receiver.id
  receiver.username transaction.receiver.username
end
json.sender do |sender|
  sender.id transaction.sender.id
  sender.username transaction.sender.username
end