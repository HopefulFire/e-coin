class ApplicationController < ActionController::API
  respond_to :json
  before_action :underscore_params
  before_action :configure_permitted_parameters, if: :devise_controller?
  
  private
  
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[username])
  end

  def underscore_params!
    params.deep_transform_keys!(&:underscore)
  end
end
