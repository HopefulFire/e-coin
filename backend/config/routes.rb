Rails.application.routes.draw do
  scope :api, defaults: { format: :json } do
    get '/accounts', to: 'account#index'
    resources :users do
      get '/account', to: 'account#show'
      post '/account', to: 'account#create'
      delete '/account', to: 'account#destroy'
      resources :transactions
    end
    post '/auth/login', to: 'authentication#login'
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
