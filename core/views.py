from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import RegisterSerializer, LoginSerializer


# ============================================
#              REGISTER VIEW
# ============================================
@api_view(['POST'])
def register(request):
    # → receives data from React/Postman
    serializer = RegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        # → data is correct → save to database
        user = serializer.save()
        
        # → generate JWT token
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'User created successfully!',
            'token': str(refresh.access_token),
            'role': user.role,
            'user_id': user.id
        }, status=status.HTTP_201_CREATED)
    
    # → data has errors → send back errors
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
        
        # → find user by email in database
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({
                'error': 'Email not found!'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # → check if password is correct
        if check_password(password, user.password):
            # → password correct → generate token
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Login successful!',
                'token': str(refresh.access_token),
                'role': user.role,
                'user_id': user.id
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Wrong password!'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)