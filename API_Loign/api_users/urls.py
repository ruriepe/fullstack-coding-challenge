from django.urls import path
from .views import UsersView,RegisterView,LoginView

urlpatterns=[

    path('user/<str:email>', UsersView.as_view(),name='users_list'),
    path('register',RegisterView.as_view(),name='register'),
    path('login',LoginView.as_view(),name='login'),  
]