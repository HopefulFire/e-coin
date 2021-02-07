class ApplicationController < ActionController::API
  private

  def jwt_encode(payload)
    JWT.encode(payload, Rails.application.secrets.secret_key_base, 'HS265')
  end

  def jwt_decode(token)
    body, = JWT.decode(token, Rails.application.secrets.secret_key_base, true, algorithm: 'HS265')
    HashWithIndifferentAccess.new(body)
  rescue JWT::ExpiredSignature
      nil    
  end
end
