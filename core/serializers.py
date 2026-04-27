from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Agreement, User, CompanyProfile, Offer, Application, StudentProfile, SavedOffer, Review, WebsiteReview



class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'role']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class CompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = ['company_name', 'description', 'location', 'website']


class OfferSerializer(serializers.ModelSerializer):
    applicants_count = serializers.SerializerMethodField()
    days_left        = serializers.SerializerMethodField()
    company_name     = serializers.CharField(source='company.company_name', read_only=True)
    company_location = serializers.CharField(source='company.location', read_only=True)

    class Meta:
        model = Offer
        fields = [
            'id', 'title', 'description', 'skills',
            'wilaya', 'type', 'is_active', 'created_at',
            'deadline', 'days_left',
            'applicants_count', 'company_name', 'company_location',
            'views_count'       # ← ADD THIS
        ]
        read_only_fields = ['id', 'created_at', 'applicants_count', 'days_left', 'views_count']

    def get_applicants_count(self, obj):
        return Application.objects.filter(offer=obj).count()

    def get_days_left(self, obj):
        if obj.deadline is None:
            return None
        from django.utils import timezone
        today = timezone.now().date()
        delta = obj.deadline - today
        if delta.days < 0:
            return "Closed"
        return delta.days


class ApplicationSerializer(serializers.ModelSerializer):
    student_name   = serializers.SerializerMethodField()
    student_skills = serializers.SerializerMethodField()
    student_github = serializers.SerializerMethodField()
    student_email  = serializers.SerializerMethodField()
    offer_title    = serializers.SerializerMethodField()
    company_id     = serializers.IntegerField(source='offer.company.id', read_only=True)
    company_name   = serializers.CharField(source='offer.company.company_name', read_only=True)
    wilaya         = serializers.CharField(source='offer.wilaya', read_only=True)
    agreement_id   = serializers.SerializerMethodField()
    has_reviewed   = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            'id', 'student_name', 'student_skills', 'student_email',
            'student_github', 'offer_title', 'status', 'applied_at',
            'company_id', 'company_name', 'wilaya', 'agreement_id', 'has_reviewed',
        ]

    def get_student_name(self, obj):
        return obj.student.user.full_name

    def get_student_skills(self, obj):
        return obj.student.skills

    def get_student_github(self, obj):
        return obj.student.github_link

    def get_offer_title(self, obj):
        return obj.offer.title

    def get_student_email(self, obj):
        return obj.student.user.email

    def get_agreement_id(self, obj):
        from .models import Agreement
        ag = Agreement.objects.filter(application=obj).first()
        return ag.id if ag else None

    def get_has_reviewed(self, obj):
        from .models import Review
        return Review.objects.filter(
            student=obj.student,
            company=obj.offer.company
        ).exists()


class StudentProfileSerializer(serializers.ModelSerializer):
    full_name       = serializers.CharField(source='user.full_name', read_only=True)
    email           = serializers.EmailField(source='user.email', read_only=True)
    university_name = serializers.CharField(source='university.name', read_only=True)

    class Meta:
        model = StudentProfile
        fields = [
            'full_name',
            'email',
            'skills',
            'github_link',
            'wilaya',
            'university',      # ← ID for writing
            'university_name', # ← name for reading/display
            'cv_file',
        ]


class AgreementSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='application.student.user.full_name', read_only=True)
    student_email = serializers.EmailField(source='application.student.user.email', read_only=True)
    student_skills = serializers.CharField(source='application.student.skills', read_only=True)
    student_wilaya = serializers.CharField(source='application.student.wilaya', read_only=True)
    student_university = serializers.CharField(source='application.student.university', read_only=True)
    company_name = serializers.CharField(source='application.offer.company.company_name', read_only=True)
    company_location = serializers.CharField(source='application.offer.company.location', read_only=True)
    offer_title = serializers.CharField(source='application.offer.title', read_only=True)
    validated_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Agreement
        fields = [
            'id', 'status', 'validated_at', 'pdf_file',
            'student_name', 'student_email', 'student_skills',
            'student_wilaya', 'student_university',
            'company_name', 'company_location', 'offer_title',
            'validated_by_name',
        ]

    def get_validated_by_name(self, obj):
        return obj.validated_by.full_name if obj.validated_by else None 


class SavedOfferSerializer(serializers.ModelSerializer):
    offer_title    = serializers.SerializerMethodField()
    offer_company  = serializers.SerializerMethodField()
    offer_wilaya   = serializers.SerializerMethodField()
    offer_type     = serializers.SerializerMethodField()
    offer_skills   = serializers.SerializerMethodField()

    class Meta:
        model = SavedOffer
        fields = ['id', 'offer_id', 'offer_title', 'offer_company',
                  'offer_wilaya', 'offer_type', 'offer_skills', 'saved_at']

    def get_offer_title(self, obj):
        return obj.offer.title

    def get_offer_company(self, obj):
        return obj.offer.company.company_name

    def get_offer_wilaya(self, obj):
        return obj.offer.wilaya

    def get_offer_type(self, obj):
        return obj.offer.type

    def get_offer_skills(self, obj):
        return obj.offer.skills


class ApplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['student', 'offer', 'cover_letter']



class ReviewSerializer(serializers.ModelSerializer):
    student_name   = serializers.SerializerMethodField()
    company_name   = serializers.SerializerMethodField()

    class Meta:
        model  = Review
        fields = ['id', 'student_name', 'company_name', 
                  'rating', 'comment', 'created_at']

    def get_student_name(self, obj):
        return obj.student.user.full_name

    def get_company_name(self, obj):
        return obj.company.company_name


class WebsiteReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_role = serializers.CharField(source='user.role', read_only=True)

    class Meta:
        model  = WebsiteReview
        fields = ['id', 'user_name', 'user_role', 'rating', 'comment', 'created_at']