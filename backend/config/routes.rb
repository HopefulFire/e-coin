Rails.application.routes.draw do
  resources :transactions
  scope :api, defaults: { format: :json } do
    resources :accounts
    resources :users
    post '/auth/login', to: 'authentication#login'
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
