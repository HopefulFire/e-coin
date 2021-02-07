class AccountsController < ApplicationController
  before_action :find_account, only: %i[show edit update destroy]

  def index
    @accounts = Account.all
  end

  def destroy
    @account.destroy
  end

  private

  def find_account
    @account = Account.find_by(id: params[:id])
  end
end
