from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('company/profile/', views.company_profile, name='company-profile'),

    # My Offers
    path('my-offers/', views.MyOffersView.as_view(), name='my-offers'),
    path('offers/<int:offer_id>/', views.OfferDetailView.as_view(), name='offer-detail'),
    path('company/applicants/', views.view_applicants, name='view-applicants'),
    path('company/decide/', views.decide_candidate, name='decide-candidate'),
]