class AccountsController < ApplicationController
  before_action :authorize_request
  before_action :find_account, only: %i[show destroy]

  def index
    @accounts = Account.all
  end

  def create
    @current_user.account = Account.new(balance: 1000) unless @current_user.account
  end

  def destroy
    if @account.balance <= 0
      render json: { message: 'Account destroyed' }, status: :accepted if @account.destroy
    else
      render json: { error: 'Account not zeroed or better' }, status: :forbidden
    end
  end

  private

  def find_account
    @account = @current_user.account
    render json: { error: 'No such account' }, status: :not_found unless @account
  end
end
