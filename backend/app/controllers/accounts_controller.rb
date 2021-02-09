class AccountsController < ApplicationController
  before_action :authorize_request
  before_action :find_account, only: %i[show update destroy]

  def index
    @accounts = Account.all
  end

  def destroy
    if @account.balance == 0
      render json: { message: 'Account destroyed' }, status: :accepted if @account.destroy
    else
      render json: { error: 'Account not zeroed' }, status: :forbidden
    end
  end

  private

  def find_account
    @account = @current_user.account
    render json: { error: 'No such account' }, status: :not_found unless @account
  end
end
