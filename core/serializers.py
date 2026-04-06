from rest_framework import serializers
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