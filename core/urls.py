from django.urls import path
from . import views
from .views import StudentProfileView, OfferDetailView, OfferDetailPublicView, superadmin_recent_activity, upload_cv, superadmin_messages, contact_message

urlpatterns = [
    # Auth
    path('register/', views.register, name='register'),
    path('login/',    views.login,    name='login'),

    # Company
    path('company/profile/',    views.company_profile,    name='company-profile'),
    path('company/applicants/', views.view_applicants,    name='view-applicants'),
    path('company/decide/',     views.decide_candidate,   name='decide-candidate'),
    path('company/reviews/',    views.get_company_reviews,name='company-reviews'),
    path('company/offers/',     views.my_offers,          name='my-offers'),
    path('company/<int:company_id>/profile/', views.company_public_profile, name='company-public-profile'),

    # Offers
    path('offers/',                          views.offer_list,            name='offer-list'),
    path('offers/<int:pk>/',                 views.offer_detail,          name='offer-detail'),
    path('offers/<int:offer_id>/manage/',    OfferDetailView.as_view(),   name='offer-manage'),
    path('offers/<int:offer_id>/detail/',    OfferDetailPublicView.as_view(), name='offer-public-detail'),

    # Student
    path('student/profile/',       StudentProfileView.as_view(), name='student-profile'),
    path('student/apply/',         views.apply_to_offer,         name='apply-to-offer'),
    path('student/applications/',  views.my_applications,        name='my-applications'),
    path('student/save-offer/',    views.save_offer,             name='save-offer'),
    path('student/saved-offers/',  views.get_saved_offers,       name='saved-offers'),
    path('student/review/',        views.leave_review_token,     name='leave-review'),
    path('student/agreement/',     views.get_my_agreement,       name='my-agreement'),
    path('student/agreements/',    views.get_my_agreements,      name='my-agreements'),

    # Admin
    path('admin/pending/',  views.admin_pending_internships, name='admin-pending'),
    path('admin/validate/', views.admin_validate_internship, name='admin-validate'),
    path('admin/reject/',   views.admin_reject_internship,   name='admin-reject'),
    path('admin/stats/',    views.admin_statistics,          name='admin-stats'),

    # Notifications
    path('notifications/',      views.get_notifications,       name='notifications'),
    path('notifications/read/', views.mark_notifications_read, name='notifications-read'),

    # Universities
    path('universities/', views.get_universities, name='universities'),

    # Superadmin
    path('superadmin/universities/',                             views.superadmin_universities,        name='superadmin-universities'),
    path('superadmin/universities/add/',                         views.superadmin_add_university,      name='superadmin-add-university'),
    path('superadmin/universities/<int:university_id>/toggle/',  views.superadmin_toggle_university,   name='superadmin-toggle-university'),
    path('superadmin/admins/',                                   views.superadmin_admins,              name='superadmin-admins'),
    path('superadmin/admins/create/',                            views.superadmin_create_admin,        name='superadmin-create-admin'),

    # Public
    path('public/reviews/',                                views.public_reviews,         name='public-reviews'),
    path('public/companies/',                              views.public_companies,       name='public-companies'),
    path('public/companies/<int:company_id>/reviews/',     views.company_public_reviews, name='company-public-reviews'),

    # Website reviews
    path('website-reviews/',     views.get_website_reviews,  name='website-reviews'),
    path('website-reviews/add/', views.leave_website_review, name='leave-website-review'),


    path('superadmin/activity/', superadmin_recent_activity),

    path('student/upload-cv/', upload_cv),

    path('superadmin/messages/', superadmin_messages),
    path('contact/', contact_message),
]
