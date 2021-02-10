Rails.application.routes.draw do
  scope :api, defaults: { format: :json } do
    get '/accounts', to: 'accounts#index'
    resources :users do
      get '/account', to: 'accounts#show'
      post '/account', to: 'accounts#create'
      delete '/account', to: 'accounts#destroy'
      resources :transactions
    end
    post '/auth/login', to: 'authentication#login'
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
