from django.urls import path
from . import views
from .views import StudentProfileView, OfferDetailView, OfferDetailPublicView

urlpatterns = [
    # Auth
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),

    # Company
    path('company/profile/', views.company_profile, name='company-profile'),
    path('company/applicants/', views.view_applicants, name='view-applicants'),
    path('company/decide/', views.decide_candidate, name='decide-candidate'),
    path('company/reviews/', views.get_company_reviews, name='company-reviews'),
    path('company/offers/', views.my_offers, name='my-offers'),

    # Offers
    path('offers/', views.offer_list, name='offer-list'),
    path('offers/<int:pk>/', views.offer_detail, name='offer-detail'),
    path('offers/<int:offer_id>/manage/', OfferDetailView.as_view(), name='offer-manage'),
    path('offers/<int:offer_id>/detail/', OfferDetailPublicView.as_view(), name='offer-public-detail'),

    # Student
    path('student/profile/', StudentProfileView.as_view(), name='student-profile'),
    path('student/apply/', views.apply_to_offer, name='apply-to-offer'),
    path('student/applications/', views.my_applications, name='my-applications'),
    path('student/save-offer/', views.save_offer, name='save-offer'),
    path('student/saved-offers/', views.get_saved_offers, name='saved-offers'),
    path('student/review/', views.leave_review, name='leave-review'),

    # Admin
    path('admin/pending/', views.admin_pending_internships, name='admin-pending'),
    path('admin/validate/', views.admin_validate_internship, name='admin-validate'),
    path('admin/reject/', views.admin_reject_internship, name='admin-reject'),
    path('admin/stats/', views.admin_statistics, name='admin-stats'),
]