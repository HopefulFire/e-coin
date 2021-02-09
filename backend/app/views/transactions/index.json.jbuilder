json.array! @transactions do |transaction|
  json.amount transaction.amount
  json.id transaction.id
  json.confirmed transaction.confirmed
  json.receiver transaction.receiver.username
  json.sender transaction.sender.username
end