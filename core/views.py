from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from .models import User, CompanyProfile, Offer, Application, Notification, StudentProfile
from .serializers import RegisterSerializer, LoginSerializer, CompanyProfileSerializer, OfferSerializer, ApplicationSerializer, StudentProfileSerializer


# ============================================
#              REGISTER VIEW
# ============================================
@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'User created successfully!',
            'token': str(refresh.access_token),
            'role': user.role,
            'user_id': user.id
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================
#               LOGIN VIEW
# ============================================
@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email    = serializer.validated_data['email']
        password = serializer.validated_data['password']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Email not found!'}, status=status.HTTP_404_NOT_FOUND)
        if check_password(password, user.password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Login successful!',
                'token': str(refresh.access_token),
                'role': user.role,
                'user_id': user.id
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Wrong password!'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================
#           COMPANY PROFILE VIEW
# ============================================
@api_view(['GET', 'PUT'])
def company_profile(request):
    try:
        profile = CompanyProfile.objects.get(user_id=request.data.get('user_id'))
    except CompanyProfile.DoesNotExist:
        profile = None

    if request.method == 'GET':
        if profile is None:
            return Response({'message': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CompanyProfileSerializer(profile)
        return Response(serializer.data)

    if request.method == 'PUT':
        if profile is None:
            serializer = CompanyProfileSerializer(data=request.data)
        else:
            serializer = CompanyProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save(user_id=request.data.get('user_id'))
            return Response({'message': 'Profile saved successfully!'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================
#           MY OFFERS VIEW
# ============================================
class MyOffersView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        company = CompanyProfile.objects.get(user_id=user_id)
        offers = Offer.objects.filter(company=company)
        serializer = OfferSerializer(offers, many=True)
        return Response(serializer.data)

    def post(self, request):
        user_id = request.data.get('user_id')
        company = CompanyProfile.objects.get(user_id=user_id)
        serializer = OfferSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(company=company)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================
#         OFFER DETAIL VIEW
# ============================================
class OfferDetailView(APIView):
    def get_object(self, offer_id, user_id):
        try:
            company = CompanyProfile.objects.get(user_id=user_id)
            return Offer.objects.get(id=offer_id, company=company)
        except (Offer.DoesNotExist, CompanyProfile.DoesNotExist):
            return None

    def put(self, request, offer_id):
        offer = self.get_object(offer_id, request.data.get('user_id'))
        if not offer:
            return Response({'error': 'Offer not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = OfferSerializer(offer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, offer_id):
        offer = self.get_object(offer_id, request.data.get('user_id'))
        if not offer:
            return Response({'error': 'Offer not found'}, status=status.HTTP_404_NOT_FOUND)
        offer.delete()
        return Response({'message': 'Offer deleted'}, status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, offer_id):
        offer = self.get_object(offer_id, request.data.get('user_id'))
        if not offer:
            return Response({'error': 'Offer not found'}, status=status.HTTP_404_NOT_FOUND)
        offer.is_active = not offer.is_active
        offer.save()
        return Response({'is_active': offer.is_active})


# ============================================
#           VIEW APPLICANTS
# ============================================
@api_view(['GET'])
def view_applicants(request):
    company_id = request.data.get('company_id')
    offers = Offer.objects.filter(company_id=company_id)
    applications = Application.objects.filter(offer__in=offers)
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)


# ============================================
#         ACCEPT / REFUSE CANDIDATE
# ============================================
@api_view(['PUT'])
def decide_candidate(request):
    application_id = request.data.get('application_id')
    decision = request.data.get('decision')

    try:
        application = Application.objects.get(id=application_id)
    except Application.DoesNotExist:
        return Response({'error': 'Application not found!'}, status=status.HTTP_404_NOT_FOUND)

    application.status = decision
    application.save()

    if decision == 'accepted':
        try:
            admin = User.objects.get(role='admin')
            Notification.objects.create(
                recipient=admin,
                message=f"New internship to validate: {application.student.user.full_name} at {application.offer.company.company_name}"
            )
        except User.DoesNotExist:
            pass
        Notification.objects.create(
            recipient=application.student.user,
            message=f"Congratulations! Your application for '{application.offer.title}' was accepted!"
        )

    if decision == 'refused':
        Notification.objects.create(
            recipient=application.student.user,
            message=f"Unfortunately your application for '{application.offer.title}' was refused."
        )

    return Response({
        'message': f'Candidate {decision} successfully!',
        'application_id': application_id,
        'status': decision
    })


# ============================================
#        STUDENT PROFILE VIEW
# ============================================
class StudentProfileView(APIView):

    def get_user_from_token(self, request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None
        token = auth_header.split(' ')[1]
        try:
            decoded  = AccessToken(token)
            user_id  = decoded['user_id']
            return User.objects.get(id=user_id)
        except Exception as e:
            print('TOKEN ERROR:', e)
            return None

    def get(self, request):
        user = self.get_user_from_token(request)
        if not user:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)
        profile, created = StudentProfile.objects.get_or_create(user=user)
        serializer = StudentProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        user = self.get_user_from_token(request)
        if not user:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)
        profile, created = StudentProfile.objects.get_or_create(user=user)
        serializer = StudentProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Profile updated successfully ✅",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)