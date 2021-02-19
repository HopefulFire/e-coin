class TransactionsController < ApplicationController
  before_action :authorize_request
  before_action :find_transaction, only: %i[show update destroy]

  def index
    @transactions = Transaction.sent_and_received_transactions(@current_user)
    render json: @transactions, status: :ok
  end

  def show
    render json: @transaction, status: :ok
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
    if created_transaction_params[:blocked]
      @transaction.blocked = true
      return render json: { message: 'transaction successfully blocked' }, status: :accepted if @transaction.save

      return render json: { errors: @transaction.errors.full_messages }, status: :internal_server_error
    end

    if created_transaction_params[:confirmed]
      return render json: { error: 'forbidden' }, status: :forbidden if @transaction.confirmed

      @transaction.sender.account.balance -= @transaction.amount
      @transaction.receiver.account.balance += @transaction.amount
      @transaction.confirmed = true
      unless @transaction.save && @transaction.sender.account.save && @transaction.receiver.account.save
        @transaction.receiver.account.balance -= @transaction.amount
        @transaction.sender.account.balance += @transaction.amount
        @transaction.receiver.account.save
        @transaction.sender.account.save
        return render json: { errors: @transaction.errors.full_messages }, status: :internal_server_error
      end
      return render json: @transaction, status: :accepted
    end
    render json: { error: 'no valid params' }, status: :expectation_failed
  end

  def destroy
    return render json: { error: 'already went through' }, status: :forbidden if @transaction.confirmed

    @transaction.destroy
    render json: { message: 'successfully cancelled' }, status: :accepted
  end

  private

  def find_transaction
    @transaction = Transaction.find_by(id: created_transaction_params[:id])
    return render json: { error: 'No such transaction' }, status: :not_found unless @transaction

    unless @transaction.sender == @current_user || @transaction.receiver == @current_user
      render json: { error: 'unauthorized' }, status: :unauthorized
    end
  end

  def transaction_params
    params.permit(:receiver_id, :amount).merge(sender_id: @current_user.id, confirmed: false, blocked: false)
  end

  def created_transaction_params
    params.permit(:id, :confirmed, :blocked)
  end
end
