class TransactionsController < ApplicationController
  before_action :authorize_request
  before_action :find_transaction, only: %[show destroy]

  def index
    @transactions = Transaction.sent_and_received_transactions(@current_user)
  end

  def create
    transaction = Transaction.new(transaction_params)
    if transaction.save
      render json: transaction, status: :created
    else
      render json: { errors: transaction.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def find_transaction
    @transaction = Transaction.find_by(params[:id])
    return render json: { error: 'No such transaction' }, status: :not_found unless @transaction

    unless @transaction.sender == @current_user || @transaction.receiver == @current_user
      render json: { error: 'unauthorized' }, status: :unauthorized
    end
  end

  def transaction_params
    params.permit(:sender_id, :receiver_id, :amount).merge(confirmed: false)
  end
end
