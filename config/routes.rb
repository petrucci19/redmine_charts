Project1::Application.routes.draw do
  # The priority is based upon order of creation:
  # first created -> highest priority.
  resources :authors
  match '/signup',  to: 'author#new'
  match "/author/create" => "author#create"
  match "/author/show/:id" => "author#show"

  match "/test_case/list" => 'test_case#list'
  match "/test_case/new" => 'test_case#new'
  match "/test_case/edit" => 'test_case#edit'
  match "/test_case/create" => 'test_case#create'
  match "/test_case/update" => 'test_case#update'
  match "/test_case/delete" => 'test_case#delete'
  match "/test_case/new" => 'test_case#new'
  match "/test_case/Add%20test%20case" => 'test_case#create'
  match "/test_case/show/:id" => "test_case#show"
  match "/calendar" => "test_case#calendar"
  match "/calendar/:select" => "test_case#calendar"
  match "/tooltip" => "test_case#calendar_tooltip"
  match "/bar" => "test_case#bar"
  match "/bar1" => "test_case#bar1"
  get "/my_calendar/(:year_from/(to/:year_to))" => "test_case#my_calendar"
  get "/my_month/(:month/(and/:year))" => "test_case#my_month"
  match "/ten_days" => "test_case#ten_days"

  #match "/author/list" => "author#list"
  match "/author/list/:aid" => "author#list"
  match "/project/list/:pid" => "project#list"

  

  resources :sessions, only: [:new, :create, :destroy]

  match '/signin',  to: 'sessions#new'
  match '/signout', to: 'sessions#destroy', via: :delete

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
