
from .serializers import RegisterSerializer, LoginSerializer, CompanyProfileSerializer, OfferSerializer, ApplicationSerializer, StudentProfileSerializer
from .models import StudentProfile
from .serializers import StudentProfileSerializer
import os
from io import BytesIO
from django.conf import settings
from django.core.files.base import ContentFile
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from .models import Agreement
from .serializers import AgreementSerializer
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from .models import User, CompanyProfile, Offer, Application, Notification, StudentProfile



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

# ============================================
#        SEARCH OFFERS
# ============================================
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Offer
from .serializers import OfferSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def offer_list(request):
    offers = Offer.objects.filter(is_active=True)

    wilaya = request.GET.get('wilaya')
    skills = request.GET.get('skills')
    type_  = request.GET.get('type')

    if wilaya:
        offers = offers.filter(wilaya__icontains=wilaya)
    if skills:
        offers = offers.filter(skills__icontains=skills)
    if type_:
        offers = offers.filter(type__icontains=type_)

    serializer = OfferSerializer(offers, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def offer_detail(request, pk):
    try:
        offer = Offer.objects.get(pk=pk, is_active=True)
    except Offer.DoesNotExist:
        return Response({'error': 'Offre introuvable'}, status=404)

    serializer = OfferSerializer(offer)
    return Response(serializer.data)
 


# ============================================
#   HELPER: CHECK IF STUDENT FILE IS COMPLETE
# ============================================
def is_student_file_complete(student_profile):
    """
    Returns (is_complete: bool, missing_fields: list)
    A file is complete if the student has filled:
    skills, wilaya, university (github_link is optional)
    """
    missing = []
    if not student_profile.skills or not student_profile.skills.strip():
        missing.append('skills')
    if not student_profile.wilaya or not student_profile.wilaya.strip():
        missing.append('wilaya')
    if not student_profile.university or not student_profile.university.strip():
        missing.append('university')
    return (len(missing) == 0, missing)


# ============================================
#   HELPER: GENERATE PDF CONVENTION DE STAGE
# ============================================
def generate_convention_pdf(agreement):
    app     = agreement.application
    student = app.student
    company = app.offer.company
    offer   = app.offer

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2*cm, leftMargin=2*cm,
        topMargin=2*cm,   bottomMargin=2*cm
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'Title', parent=styles['Heading1'],
        fontSize=16, alignment=TA_CENTER, spaceAfter=6
    )
    subtitle_style = ParagraphStyle(
        'Subtitle', parent=styles['Normal'],
        fontSize=11, alignment=TA_CENTER, spaceAfter=20, textColor=colors.grey
    )
    section_style = ParagraphStyle(
        'Section', parent=styles['Heading2'],
        fontSize=12, spaceBefore=14, spaceAfter=6,
        textColor=colors.HexColor('#1a3c5e')
    )
    body_style = ParagraphStyle(
        'Body', parent=styles['Normal'],
        fontSize=10, leading=16
    )

    story = []

    # Header
    story.append(Paragraph("CONVENTION DE STAGE", title_style))
    story.append(Paragraph("Établie dans le cadre du projet Stag.io — Université / Entreprise", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1a3c5e')))
    story.append(Spacer(1, 0.5*cm))

    # Article 1 — Parties
    story.append(Paragraph("Article 1 — Les Parties", section_style))
    parties_data = [
        ["", "Étudiant(e)", "Entreprise"],
        ["Nom / Raison sociale", student.user.full_name, company.company_name],
        ["Email",               student.user.email,      "—"],
        ["Université / Wilaya", f"{student.university} — {student.wilaya}", company.location],
        ["Site / GitHub",       student.github_link or "—", company.website or "—"],
    ]
    parties_table = Table(parties_data, colWidths=[4.5*cm, 7.5*cm, 5.5*cm])
    parties_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a3c5e')),
        ('TEXTCOLOR',  (0, 0), (-1, 0), colors.white),
        ('FONTNAME',   (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE',   (0, 0), (-1, -1), 9),
        ('BACKGROUND', (0, 1), (0, -1), colors.HexColor('#eef2f7')),
        ('FONTNAME',   (0, 1), (0, -1), 'Helvetica-Bold'),
        ('GRID',       (0, 0), (-1, -1), 0.5, colors.HexColor('#c0c8d0')),
        ('ROWBACKGROUNDS', (1, 1), (-1, -1), [colors.white, colors.HexColor('#f7f9fb')]),
        ('ALIGN',      (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN',     (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING',    (0, 0), (-1, -1), 6),
    ]))
    story.append(parties_table)
    story.append(Spacer(1, 0.4*cm))

    # Article 2 — Stage
    story.append(Paragraph("Article 2 — Objet du Stage", section_style))
    story.append(Paragraph(
        f"L'étudiant(e) <b>{student.user.full_name}</b> effectuera un stage intitulé "
        f"<b>« {offer.title} »</b> au sein de l'entreprise <b>{company.company_name}</b>, "
        f"localisée à <b>{company.location}</b>. "
        f"Le stage est de type <b>{offer.get_type_display()}</b>.",
        body_style
    ))
    story.append(Spacer(1, 0.3*cm))

    # Article 3 — Compétences
    story.append(Paragraph("Article 3 — Compétences Requises", section_style))
    story.append(Paragraph(
        f"Compétences de l'étudiant(e) : <b>{student.skills or '—'}</b>",
        body_style
    ))
    story.append(Paragraph(
        f"Compétences demandées par l'offre : <b>{offer.skills or '—'}</b>",
        body_style
    ))
    story.append(Spacer(1, 0.3*cm))

    # Article 4 — Validation
    story.append(Paragraph("Article 4 — Validation Administrative", section_style))
    validated_by_name = agreement.validated_by.full_name if agreement.validated_by else "Administration"
    story.append(Paragraph(
        f"La présente convention a été validée par <b>{validated_by_name}</b> "
        f"via la plateforme Stag.io.",
        body_style
    ))
    story.append(Spacer(1, 1*cm))

    # Signatures
    story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#c0c8d0')))
    story.append(Spacer(1, 0.4*cm))
    sig_data = [
        ["Signature de l'Étudiant(e)", "Cachet de l'Entreprise", "Visa de l'Administration"],
        ["\n\n\n", "\n\n\n", "\n\n\n"],
    ]
    sig_table = Table(sig_data, colWidths=[5.5*cm, 5.5*cm, 5.5*cm])
    sig_table.setStyle(TableStyle([
        ('FONTNAME',  (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE',  (0, 0), (-1, -1), 9),
        ('ALIGN',     (0, 0), (-1, -1), 'CENTER'),
        ('BOX',       (0, 0), (0, -1), 0.5, colors.grey),
        ('BOX',       (1, 0), (1, -1), 0.5, colors.grey),
        ('BOX',       (2, 0), (2, -1), 0.5, colors.grey),
        ('TOPPADDING',(0, 0), (-1, -1), 8),
    ]))
    story.append(sig_table)

    doc.build(story)
    return buffer.getvalue()


# ============================================
#   ADMIN: LIST PENDING INTERNSHIPS
# ============================================
@api_view(['GET'])
def admin_pending_internships(request):
    """
    Returns all applications that were accepted by a company
    but not yet validated by admin (no Agreement yet, or Agreement is pending).
    """
    # Accepted applications that have no agreement yet
    accepted_apps = Application.objects.filter(status='accepted')
    existing_agreement_app_ids = Agreement.objects.values_list('application_id', flat=True)
    pending_apps = accepted_apps.exclude(id__in=existing_agreement_app_ids)

    data = []
    for app in pending_apps:
        student  = app.student
        is_complete, missing = is_student_file_complete(student)
        data.append({
            'application_id':  app.id,
            'student_name':    student.user.full_name,
            'student_email':   student.user.email,
            'student_skills':  student.skills,
            'student_wilaya':  student.wilaya,
            'student_university': student.university,
            'student_github':  student.github_link,
            'offer_title':     app.offer.title,
            'company_name':    app.offer.company.company_name,
            'applied_at':      app.applied_at,
            'file_complete':   is_complete,
            'missing_fields':  missing,
        })

    return Response(data, status=status.HTTP_200_OK)


# ============================================
#   ADMIN: VALIDATE INTERNSHIP → GENERATE PDF
# ============================================
@api_view(['POST'])
def admin_validate_internship(request):
    """
    Body: { "application_id": X, "admin_user_id": Y }
    - Checks if student file is complete
    - Creates Agreement with status 'validated'
    - Generates and saves PDF convention
    - Notifies student and company
    """
    application_id = request.data.get('application_id')
    admin_user_id  = request.data.get('admin_user_id')

    # --- fetch objects ---
    try:
        application = Application.objects.get(id=application_id, status='accepted')
    except Application.DoesNotExist:
        return Response({'error': 'Application not found or not accepted yet.'}, status=status.HTTP_404_NOT_FOUND)

    try:
        admin_user = User.objects.get(id=admin_user_id, role='admin')
    except User.DoesNotExist:
        return Response({'error': 'Admin user not found.'}, status=status.HTTP_403_FORBIDDEN)

    if Agreement.objects.filter(application=application).exists():
        return Response({'error': 'This internship was already processed.'}, status=status.HTTP_400_BAD_REQUEST)

    # --- check file completeness ---
    is_complete, missing = is_student_file_complete(application.student)
    if not is_complete:
        return Response({
            'error': 'Student file is incomplete. Cannot validate.',
            'missing_fields': missing
        }, status=status.HTTP_400_BAD_REQUEST)

    # --- create Agreement ---
    agreement = Agreement.objects.create(
        application=application,
        validated_by=admin_user,
        status='validated'
    )

    # --- generate PDF ---
    pdf_bytes = generate_convention_pdf(agreement)
    filename  = f"convention_{application.student.user.full_name.replace(' ', '_')}_{application.id}.pdf"
    agreement.pdf_file.save(filename, ContentFile(pdf_bytes), save=True)

    # --- notify student ---
    Notification.objects.create(
        recipient=application.student.user,
        message=(
            f"Your internship convention for '{application.offer.title}' at "
            f"{application.offer.company.company_name} has been validated! "
            f"Your PDF agreement is now available."
        )
    )

    return Response({
        'message': 'Internship validated and PDF generated successfully!',
        'agreement_id': agreement.id,
        'pdf_url': agreement.pdf_file.url,
    }, status=status.HTTP_201_CREATED)


# ============================================
#   ADMIN: REJECT INTERNSHIP
# ============================================
@api_view(['POST'])
def admin_reject_internship(request):
    """
    Body: { "application_id": X, "admin_user_id": Y, "reason": "..." }
    Creates an Agreement with status 'rejected' and notifies student.
    """
    application_id = request.data.get('application_id')
    admin_user_id  = request.data.get('admin_user_id')
    reason         = request.data.get('reason', 'No reason provided.')

    try:
        application = Application.objects.get(id=application_id, status='accepted')
    except Application.DoesNotExist:
        return Response({'error': 'Application not found or not accepted.'}, status=status.HTTP_404_NOT_FOUND)

    try:
        admin_user = User.objects.get(id=admin_user_id, role='admin')
    except User.DoesNotExist:
        return Response({'error': 'Admin user not found.'}, status=status.HTTP_403_FORBIDDEN)

    if Agreement.objects.filter(application=application).exists():
        return Response({'error': 'This internship was already processed.'}, status=status.HTTP_400_BAD_REQUEST)

    Agreement.objects.create(
        application=application,
        validated_by=admin_user,
        status='rejected'
    )

    # Reset application status so student can re-apply if needed
    application.status = 'refused'
    application.save()

    Notification.objects.create(
        recipient=application.student.user,
        message=(
            f"Your internship convention for '{application.offer.title}' was rejected by the administration. "
            f"Reason: {reason}"
        )
    )

    return Response({'message': 'Internship rejected and student notified.'}, status=status.HTTP_200_OK)


# ============================================
#   ADMIN: STATISTICS
# ============================================
@api_view(['GET'])
def admin_statistics(request):
    from django.db.models import Count

    total_students  = User.objects.filter(role='student').count()
    total_companies = User.objects.filter(role='company').count()
    total_offers    = Offer.objects.count()
    active_offers   = Offer.objects.filter(is_active=True).count()

    total_applications = Application.objects.count()
    pending_apps    = Application.objects.filter(status='pending').count()
    accepted_apps   = Application.objects.filter(status='accepted').count()
    refused_apps    = Application.objects.filter(status='refused').count()

    validated_agreements = Agreement.objects.filter(status='validated').count()
    rejected_agreements  = Agreement.objects.filter(status='rejected').count()

    # Students who got a validated agreement = placed
    placed_student_ids = Agreement.objects.filter(status='validated').values_list(
        'application__student__user_id', flat=True
    )
    placed_count   = len(set(placed_student_ids))
    unplaced_count = total_students - placed_count

    # Top wilayat with most applications
    top_wilayat = (
        Application.objects
        .values('offer__wilaya')
        .annotate(count=Count('id'))
        .order_by('-count')[:5]
    )

    return Response({
        'students': {
            'total':   total_students,
            'placed':  placed_count,
            'unplaced': unplaced_count,
        },
        'companies': {
            'total': total_companies,
        },
        'offers': {
            'total':  total_offers,
            'active': active_offers,
        },
        'applications': {
            'total':    total_applications,
            'pending':  pending_apps,
            'accepted': accepted_apps,
            'refused':  refused_apps,
        },
        'agreements': {
            'validated': validated_agreements,
            'rejected':  rejected_agreements,
        },
        'top_wilayat': list(top_wilayat),
    }, status=status.HTTP_200_OK)  

    # ============================================
#           APPLY TO OFFER
# ============================================
@api_view(['POST'])
def apply_to_offer(request):
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return Response({'error': 'Token required'}, status=401)
    token = auth_header.split(' ')[1]
    try:
        from rest_framework_simplejwt.tokens import AccessToken
        decoded = AccessToken(token)
        user = User.objects.get(id=decoded['user_id'])
    except Exception:
        return Response({'error': 'Invalid token'}, status=401)

    offer_id = request.data.get('offer_id')
    try:
        student = StudentProfile.objects.get(user=user)
    except StudentProfile.DoesNotExist:
        return Response({'error': 'Student profile not found'}, status=404)

    try:
        offer = Offer.objects.get(id=offer_id, is_active=True)
    except Offer.DoesNotExist:
        return Response({'error': 'Offer not found'}, status=404)

    if Application.objects.filter(student=student, offer=offer).exists():
        return Response({'error': 'You already applied to this offer'}, status=400)

    application = Application.objects.create(
        student=student, offer=offer, status='pending'
    )
    return Response({
        'message': 'Application submitted successfully!',
        'application_id': application.id,
        'status': application.status
    }, status=201)


# ============================================
#           MY APPLICATIONS
# ============================================
@api_view(['GET'])
def my_applications(request):
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return Response({'error': 'Token required'}, status=401)
    token = auth_header.split(' ')[1]
    try:
        from rest_framework_simplejwt.tokens import AccessToken
        decoded = AccessToken(token)
        user = User.objects.get(id=decoded['user_id'])
    except Exception:
        return Response({'error': 'Invalid token'}, status=401)

    try:
        student = StudentProfile.objects.get(user=user)
    except StudentProfile.DoesNotExist:
        return Response({'error': 'Student profile not found'}, status=404)

    applications = Application.objects.filter(student=student).order_by('-applied_at')
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)