from rest_framework import serializers
from .models import Agreement
from .models import User, CompanyProfile, Offer, Application, StudentProfile


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'role']

    def create(self, validated_data):
        from django.contrib.auth.hashers import make_password
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

    class Meta:
        model = Offer
        fields = [
            'id', 'title', 'description', 'skills',
            'wilaya', 'type', 'is_active', 'created_at',
            'applicants_count'
        ]
        read_only_fields = ['id', 'created_at', 'applicants_count']

    def get_applicants_count(self, obj):
        return Application.objects.filter(offer=obj).count()


class ApplicationSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_skills = serializers.SerializerMethodField()
    student_github = serializers.SerializerMethodField()
    offer_title = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = ['id', 'student_name', 'student_skills',
                  'student_github', 'offer_title', 'status', 'applied_at']

    def get_student_name(self, obj):
        return obj.student.user.full_name

    def get_student_skills(self, obj):
        return obj.student.skills

    def get_student_github(self, obj):
        return obj.student.github_link

    def get_offer_title(self, obj):
        return obj.offer.title


        # ============================================
#        STUDENT PROFILE SERIALIZER
# ============================================
from rest_framework import serializers
from .models import StudentProfile

class StudentProfileSerializer(serializers.ModelSerializer):
    # Read-only: pulled from the User table automatically
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email     = serializers.EmailField(source='user.email',     read_only=True)

    class Meta:
        model  = StudentProfile
        fields = [
            'full_name',    # from User table (read only)
            'email',        # from User table (read only)
            'skills',       # "React, Python, Django..."
            'github_link',  # URL
            'wilaya',       # text
            'university',   # text
        ]




# ============================================
#        AGREEMENT SERIALIZER
# ============================================
class AgreementSerializer(serializers.ModelSerializer):
    student_name    = serializers.CharField(source='application.student.user.full_name', read_only=True)
    student_email   = serializers.EmailField(source='application.student.user.email', read_only=True)
    student_skills  = serializers.CharField(source='application.student.skills', read_only=True)
    student_wilaya  = serializers.CharField(source='application.student.wilaya', read_only=True)
    student_university = serializers.CharField(source='application.student.university', read_only=True)
    company_name    = serializers.CharField(source='application.offer.company.company_name', read_only=True)
    company_location= serializers.CharField(source='application.offer.company.location', read_only=True)
    offer_title     = serializers.CharField(source='application.offer.title', read_only=True)
    validated_by_name = serializers.SerializerMethodField()

    class Meta:
        model  = Agreement
        fields = [
            'id', 'status', 'validated_at', 'pdf_file',
            'student_name', 'student_email', 'student_skills',
            'student_wilaya', 'student_university',
            'company_name', 'company_location', 'offer_title',
            'validated_by_name',
        ]

    def get_validated_by_name(self, obj):
        return obj.validated_by.full_name if obj.validated_by else None


class AgreementSerializer(serializers.ModelSerializer):
    student_name       = serializers.CharField(source='application.student.user.full_name', read_only=True)
    student_email      = serializers.EmailField(source='application.student.user.email', read_only=True)
    student_skills     = serializers.CharField(source='application.student.skills', read_only=True)
    student_wilaya     = serializers.CharField(source='application.student.wilaya', read_only=True)
    student_university = serializers.CharField(source='application.student.university', read_only=True)
    company_name       = serializers.CharField(source='application.offer.company.company_name', read_only=True)
    company_location   = serializers.CharField(source='application.offer.company.location', read_only=True)
    offer_title        = serializers.CharField(source='application.offer.title', read_only=True)
    validated_by_name  = serializers.SerializerMethodField()

    class Meta:
        model  = Agreement
        fields = [
            'id', 'status', 'validated_at', 'pdf_file',
            'student_name', 'student_email', 'student_skills',
            'student_wilaya', 'student_university',
            'company_name', 'company_location', 'offer_title',
            'validated_by_name',
        ]

    def get_validated_by_name(self, obj):
        return obj.validated_by.full_name if obj.validated_by else None