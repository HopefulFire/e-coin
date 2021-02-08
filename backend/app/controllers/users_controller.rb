class UsersController < ApplicationController
  before_action :authorize_request, except: :create
  before_action :find_user, only: %i[show update destroy]

  def index
    @users = User.all
  end

  def destroy
    @user.destroy
  end

  private

  def find_user
    @user = User.find_by(id: params[:id])
    render json: { error: 'No such user', status: :not_found } unless @user
  end
end
