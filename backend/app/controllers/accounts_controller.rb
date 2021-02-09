class AccountsController < ApplicationController
  before_action :authorize_request
  before_action :find_account, only: %i[show update destroy]

  def index
    @accounts = Account.all
  end

  def destroy
    @account.destroy
  end

  private

  def find_account
    @account = Account.find_by(id: params[:id])
    return render json: { error: 'No such account' }, status: :not_found unless @account

    return render json: { error: 'Not your account'}
  end
end
