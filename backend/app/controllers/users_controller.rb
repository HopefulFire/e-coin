class UsersController < ApplicationController
  before_action :authorize_request, except: :create
  before_action :find_user, only: %i[show update destroy]

  def index
    @users = User.all
  end

  def create
    user = User.new(user_params)
    if user.save
      render json: user, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      render json: @user, status: :accepted
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy
  end

  private

  def find_user
    @user = User.find_by(id: params[:id])
    return render json: { error: 'No such user' }, status: :not_found unless @user
    
    render json: { error: 'unauthorized' }, status: :unauthorized unless @user == @current_user
  end

  def user_params
    params.permit(:username, :email, :password, :password_confirmation)
  end
end
