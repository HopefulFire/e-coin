class TransactionsController < ApplicationController
  before_action :authorize_request
  before_action :find_transaction, only: %[show update destroy]

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

  def update
    return render json: { error: 'unauthorized' }, status: :unauthorized if @current_user != @transaction.receiver
    
    return render json: { error: 'forbidden' }, status: :forbidden if transaction.confirmed

    if params[:blocked]
      @transaction.blocked = true
      return render json: { message: 'transaction successfully blocked' }, status: :accepted if @transaction.save

      return render json: { errors: @transaction.errors.full_messages }, status: :internal_server_error
    end

    @transaction.sender.account.balance -= @transaction.amount
    @transaction.receiver.account.balance += @transaction.amount
    @transaction.confirmed = true
    unless @transaction.save
      @transaction.receiver.account.balance -= @transaction.amount
      @transaction.sender.account.balance += @transaction.amount
      return render json: { errors: @transaction.errors.full_messages }, status: :internal_server_error
    end

    render json: { message: 'success', balance: "#{@current_user.account.balance}" }, status: :accepted
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
