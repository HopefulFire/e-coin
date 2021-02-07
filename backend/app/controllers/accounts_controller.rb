class AccountsController < ApplicationController
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
    render json: { error: "No such account" } unless @account
  end
end
