from django.urls import path, re_path
from eventapp import views
from rest_framework_simplejwt.views import TokenVerifyView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('', views.home, name='home'),  # First Page
    path('api/register', views.register, name='register'),
    path('api/login', views.login, name='login'),
    path('api/find_user', views.start_pw_reset, name='start_pw_reset'),
    path('api/update_password', views.finish_pw_reset, name='finish_pw_reset'),
    path('api/events/<int:event_id>/availabilities/', views.get_availabilities_for_event, name='event_availabilities'),
    path('api/availabilities/<int:availability_id>/', views.user_availability, name='user_availability'),
    path('api/events', views.event, name='event_detail'),
    path('api/events/<int:event_id>', views.event, name='event_detail'),
    path('api/users/<int:user_id>/', views.user_detail, name='user_detail'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    re_path(r"^$", views.home),
    re_path(r"^(?:.*)/?$", views.home),
]