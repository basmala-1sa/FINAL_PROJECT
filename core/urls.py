from django.urls import path
from . import views
from .views import StudentProfileView

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('company/profile/', views.company_profile, name='company-profile'),

    # My Offers
    path('my-offers/', views.MyOffersView.as_view(), name='my-offers'),
    path('offers/<int:offer_id>/', views.OfferDetailView.as_view(), name='offer-detail'),
    path('company/applicants/', views.view_applicants, name='view-applicants'),
    path('company/decide/', views.decide_candidate, name='decide-candidate'),

    # Student Profile
    path('profile/', StudentProfileView.as_view(), name='student-profile'),


    # Admin routes
    path('admin/pending/',  views.admin_pending_internships, name='admin-pending'),
    path('admin/validate/', views.admin_validate_internship, name='admin-validate'),
    path('admin/reject/',   views.admin_reject_internship,   name='admin-reject'),
    path('admin/stats/',    views.admin_statistics,          name='admin-stats'),
    path('student/save-offer/', views.save_offer, name='save-offer'),        
    path('student/saved-offers/', views.get_saved_offers, name='saved-offers'), 


    # Search offers
    path('api/offers/', views.offer_list, name='offer-list'),
    path('api/offers/<int:pk>/', views.offer_detail, name='offer-detail-student'),

    # apply to offer
    path('api/apply/', views.apply_to_offer, name='apply-to-offer'),
   
   
    # my applications
    path('api/my-applications/', views.my_applications, name='my-applications'), 


    # reviews
    path('student/review/', views.leave_review, name='leave-review'),
    path('company/reviews/', views.get_company_reviews, name='company-reviews'),
]