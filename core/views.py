from .serializers import RegisterSerializer, LoginSerializer, CompanyProfileSerializer, OfferSerializer, ApplicationSerializer, StudentProfileSerializer, ApplySerializer, ReviewSerializer
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
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from .models import User, CompanyProfile, Offer, Application, Notification, StudentProfile, SavedOffer, Review, University, WebsiteReview, PublicReview, ContactMessage



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
                'user_id': user.id,
                'full_name': user.full_name, 
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Wrong password!'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================
#           COMPANY PROFILE VIEW
# ============================================
@api_view(['GET', 'PUT'])
@permission_classes([AllowAny])
def company_profile(request):
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded = AccessToken(token)
        user = User.objects.get(id=decoded['user_id'])
    except Exception:
        return Response({'error': 'Invalid token'}, status=401)

    try:
        profile = CompanyProfile.objects.get(user=user)
    except CompanyProfile.DoesNotExist:
        profile = None

    if request.method == 'GET':
        if profile is None:
            return Response({'message': 'Profile not found'}, status=404)
        serializer = CompanyProfileSerializer(profile)
        return Response(serializer.data)

    if request.method == 'PUT':
        if profile is None:
            serializer = CompanyProfileSerializer(data=request.data)
        else:
            serializer = CompanyProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response({'message': 'Profile saved successfully!'})
        return Response(serializer.errors, status=400)


# ============================================
#           MY OFFERS VIEW
# ============================================
# ============================================
#           MY OFFERS (COMPANY)
# ============================================
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def my_offers(request):
    # decode token manually — same pattern as apply_to_offer
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return Response({'error': 'Token required'}, status=401)
    token = auth_header.split(' ')[1]

    try:
        decoded = AccessToken(token)
        user    = User.objects.get(id=decoded['user_id'])
        company = CompanyProfile.objects.get(user=user)
    except Exception as e:
        return Response({'error': 'Invalid token or company not found'}, status=401)

    if request.method == 'GET':
        offers = Offer.objects.filter(company=company)
        serializer = OfferSerializer(offers, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = OfferSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(company=company)
            return Response({
                'message': 'Offer created successfully!',
                'offer': serializer.data
            }, status=201)
        return Response(serializer.errors, status=400)
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
@permission_classes([AllowAny])
def view_applicants(request):
    # read from token instead
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded = AccessToken(token)
        user    = User.objects.get(id=decoded['user_id'])
        company = CompanyProfile.objects.get(user=user)
    except Exception:
        return Response({'error': 'Invalid token'}, status=401)

    offers       = Offer.objects.filter(company=company)
    applications = Application.objects.filter(offer__in=offers)
    serializer   = ApplicationSerializer(applications, many=True)
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
#        SEARCH OFFERS + RECOMMENDATIONS
# ============================================
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Offer, StudentProfile
from .serializers import OfferSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def offer_list(request):
    # ← decode token manually like apply_to_offer
    auth_header = request.headers.get('Authorization', '')
    student = None
    if auth_header.startswith('Bearer '):
        try:
            token   = auth_header.split(' ')[1]
            decoded = AccessToken(token)
            user    = User.objects.get(id=decoded['user_id'])
            student = StudentProfile.objects.get(user=user)
        except Exception:
            student = None

    offers = Offer.objects.filter(is_active=True)

    wilaya = request.GET.get('wilaya')
    skills = request.GET.get('skills')
    type_  = request.GET.get('type')
    search = request.GET.get('search')

    if wilaya:
        offers = offers.filter(wilaya__icontains=wilaya)
    if skills:
        offers = offers.filter(skills__icontains=skills)
    if type_:
        offers = offers.filter(type__icontains=type_)
    if search:
        offers = offers.filter(title__icontains=search)

    # smart recommendations — case-insensitive, score-ranked
    if student and student.skills:
        student_skills = [s.strip().lower() for s in student.skills.split(',') if s.strip()]
        scored = []
        others = []
        for offer in offers:
            offer_skills = [s.strip().lower() for s in (offer.skills or '').split(',') if s.strip()]
            score = sum(
                1 for ss in student_skills
                if any(ss in os or os in ss for os in offer_skills)
            )
            if score > 0:
                scored.append((score, offer))
            else:
                others.append(offer)
        scored.sort(key=lambda x: x[0], reverse=True)
        recommended = [offer for _, offer in scored]
        return Response({
            'recommended': OfferSerializer(recommended, many=True).data,
            'others':      OfferSerializer(others, many=True).data
        })

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
    missing = []
    if not student_profile.skills or not student_profile.skills.strip():
        missing.append('skills')
    if not student_profile.wilaya or not student_profile.wilaya.strip():
        missing.append('wilaya')
    if not student_profile.university:  # ← FIXED: no .strip() on ForeignKey
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
@permission_classes([AllowAny])
def admin_pending_internships(request):
    # ← get the admin from token
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded    = AccessToken(token)
        admin_user = User.objects.get(id=decoded['user_id'])
    except Exception:
        return Response({'error': 'Unauthorized'}, status=401)

    accepted_apps = Application.objects.filter(status='accepted')
    existing_ids  = Agreement.objects.values_list('application_id', flat=True)
    pending_apps  = accepted_apps.exclude(id__in=existing_ids)

    # ← filter by university
    if admin_user.university:
        pending_apps = pending_apps.filter(
            student__university=admin_user.university
        )
    else:
        # admin with no university linked → sees nothing
        pending_apps = pending_apps.none()

    data = []
    for app in pending_apps:
        student = app.student
        is_complete, missing = is_student_file_complete(student)
        data.append({
            'application_id':     app.id,
            'student_name':       student.user.full_name,
            'student_email':      student.user.email,
            'student_skills':     student.skills,
            'student_wilaya':     student.wilaya,
            'student_university': student.university.name if student.university else '—',
            'student_github':     student.github_link,
            'offer_title':        app.offer.title,
            'company_name':       app.offer.company.company_name,
            'applied_at':         app.applied_at,
            'file_complete':      is_complete,
            'missing_fields':     missing,
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

    # --- create Agreement + mark application as validated ---
    agreement = Agreement.objects.create(
        application=application,
        validated_by=admin_user,
        status='validated'
    )
    application.status = 'validated'
    application.save()

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
        f"Download your PDF: /media/{agreement.pdf_file.name}"
    )
)
    Notification.objects.create(
    recipient=application.offer.company.user,
    message=(
        f"The internship convention for {application.student.user.full_name} "
        f"applying to '{application.offer.title}' has been validated by the administration! ✅"
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

    Notification.objects.create(
        recipient=application.offer.company.user,
        message=(
            f"The internship convention for {application.student.user.full_name} "
            f"applying to '{application.offer.title}' was rejected by the administration. "
            f"Reason: {reason}"
        )
    )

    return Response({'message': 'Internship rejected and student notified.'}, status=status.HTTP_200_OK)


# ============================================
#   ADMIN: STATISTICS
# ============================================
@api_view(['GET'])
@permission_classes([AllowAny])
def admin_statistics(request):
    from django.db.models import Count

    # get admin from token
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded    = AccessToken(token)
        admin_user = User.objects.get(id=decoded['user_id'])
    except Exception:
        return Response({'error': 'Unauthorized'}, status=401)

    # filter students by admin's university
    if admin_user.university:
        students = StudentProfile.objects.filter(university=admin_user.university)
        student_users = students.values_list('user_id', flat=True)
        applications = Application.objects.filter(student__in=students)
    else:
        students     = StudentProfile.objects.none()
        student_users = []
        applications  = Application.objects.none()

    total_students = students.count()
    total_companies = User.objects.filter(role='company').count()
    total_offers    = Offer.objects.count()
    active_offers   = Offer.objects.filter(is_active=True).count()

    total_applications = applications.count()
    pending_apps       = applications.filter(status='pending').count()
    accepted_apps      = applications.filter(status='accepted').count()
    refused_apps       = applications.filter(status='refused').count()

    validated_agreements = Agreement.objects.filter(
        application__in=applications, status='validated'
    ).count()
    rejected_agreements = Agreement.objects.filter(
        application__in=applications, status='rejected'
    ).count()

    placed_student_ids = Agreement.objects.filter(
        application__in=applications, status='validated'
    ).values_list('application__student__user_id', flat=True)
    placed_count   = len(set(placed_student_ids))
    unplaced_count = total_students - placed_count

    top_wilayat = (
        applications
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

    offer_id     = request.data.get('offer_id')
    cover_letter = request.data.get('cover_letter', '')  # ← added!

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

    # ── Overlap check ──────────────────────────────────────────────────────────
    # Block if the student already has a pending/accepted application for an
    # offer whose internship period overlaps with the new offer's period.
    # Two date ranges [A_start, A_end] and [B_start, B_end] overlap when:
    #   A_start <= B_end  AND  A_end >= B_start
    # We only run the check when BOTH offers have start_date + end_date set.
    if offer.start_date and offer.end_date:
        conflicting = Application.objects.filter(
            student=student,
            status__in=['pending', 'accepted'],
            offer__start_date__isnull=False,
            offer__end_date__isnull=False,
            offer__start_date__lte=offer.end_date,
            offer__end_date__gte=offer.start_date,
        ).select_related('offer').exclude(offer=offer)

        if conflicting.exists():
            conflict_titles = ", ".join(
                [app.offer.title for app in conflicting[:3]]
            )
            return Response({
                'error': (
                    f"You already have an active application with overlapping dates: "
                    f'"{conflict_titles}". '
                    f"You can only apply to internships with non-overlapping periods, "
                    f"or after one of your existing applications is rejected."
                )
            }, status=400)
    # ──────────────────────────────────────────────────────────────────────────

    application = Application.objects.create(
        student      = student,
        offer        = offer,
        cover_letter = cover_letter,  # ← added!
        status       = 'pending'
    )

    # notify the company ← added!
    Notification.objects.create(
        recipient = offer.company.user,
        message   = f"New application from {student.user.full_name} for '{offer.title}'"
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


# ============================================
#           SAVE / UNSAVE OFFER
# ============================================
@api_view(['POST'])
@permission_classes([AllowAny])
def save_offer(request):
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded = AccessToken(token)
        user    = User.objects.get(id=decoded['user_id'])
        student = StudentProfile.objects.get(user=user)
    except Exception:
        return Response({'error': 'Invalid token or student not found'}, status=401)

    offer_id = request.data.get('offer_id')
    try:
        offer = Offer.objects.get(id=offer_id)
    except Offer.DoesNotExist:
        return Response({'error': 'Offer not found'}, status=404)

    existing = SavedOffer.objects.filter(student=student, offer=offer).first()
    if existing:
        existing.delete()
        return Response({'message': 'Offer removed from favorites!'})
    else:
        SavedOffer.objects.create(student=student, offer=offer)
        return Response({'message': 'Offer saved to favorites!'})


# ============================================
#           GET SAVED OFFERS
# ============================================
@api_view(['GET'])
@permission_classes([AllowAny])
def get_saved_offers(request):
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded = AccessToken(token)
        user    = User.objects.get(id=decoded['user_id'])
        student = StudentProfile.objects.get(user=user)
    except Exception:
        return Response({'error': 'Invalid token'}, status=401)

    from .serializers import SavedOfferSerializer
    saved = SavedOffer.objects.filter(student=student)
    serializer = SavedOfferSerializer(saved, many=True)
    return Response(serializer.data)

# ============================================
#           LEAVE A REVIEW
# ============================================
@api_view(['POST'])
def leave_review(request):
    student_id    = request.data.get('student_id')
    company_id    = request.data.get('company_id')
    agreement_id  = request.data.get('agreement_id')
    rating        = request.data.get('rating')
    comment       = request.data.get('comment')

    try:
        student   = StudentProfile.objects.get(user_id=student_id)
        company   = CompanyProfile.objects.get(id=company_id)
        agreement = Agreement.objects.get(id=agreement_id)
    except:
        return Response({'error': 'Student, company or agreement not found!'},
                        status=status.HTTP_404_NOT_FOUND)

    # check if already reviewed
    existing = Review.objects.filter(student=student, company=company).first()
    if existing:
        return Response({'error': 'You already reviewed this company!'},
                        status=status.HTTP_400_BAD_REQUEST)

    # create review
    Review.objects.create(
        student   = student,
        company   = company,
        agreement = agreement,
        rating    = rating,
        comment   = comment
    )

    return Response({'message': 'Review submitted successfully! ⭐'})


# ============================================
#           GET COMPANY REVIEWS
# ============================================
@api_view(['GET'])
def get_company_reviews(request):
    company_id = request.data.get('company_id')

    try:
        company = CompanyProfile.objects.get(id=company_id)
    except CompanyProfile.DoesNotExist:
        return Response({'error': 'Company not found!'},
                        status=status.HTTP_404_NOT_FOUND)

    reviews = Review.objects.filter(company=company)

    # calculate average rating
    if reviews.exists():
        avg_rating = sum([r.rating for r in reviews]) / reviews.count()
        avg_rating = round(avg_rating, 1)
    else:
        avg_rating = 0

    serializer = ReviewSerializer(reviews, many=True)
    return Response({
        'company_name': company.company_name,
        'average_rating': avg_rating,
        'total_reviews': reviews.count(),
        'reviews': serializer.data
    })



class OfferDetailPublicView(APIView):
    # GET /api/offers/<id>/detail/ — student views offer → increments views_count
    def get(self, request, offer_id):
        try:
            offer = Offer.objects.get(id=offer_id, is_active=True)
            offer.views_count += 1
            offer.save()
            serializer = OfferSerializer(offer)
            return Response(serializer.data)
        except Offer.DoesNotExist:
            return Response({'error': 'Offer not found'}, status=status.HTTP_404_NOT_FOUND)





# ============================================
#           GET NOTIFICATIONS
# ============================================
@api_view(['GET'])
@permission_classes([AllowAny])
def get_notifications(request):
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return Response({'error': 'Token required'}, status=401)
    token = auth_header.split(' ')[1]
    try:
        decoded = AccessToken(token)
        user    = User.objects.get(id=decoded['user_id'])
    except Exception:
        return Response({'error': 'Invalid token'}, status=401)

    notifications = Notification.objects.filter(
        recipient=user
    ).order_by('-created_at')[:20]

    data = [{
        'id':         n.id,
        'message':    n.message,
        'is_read':    n.is_read,
        'created_at': n.created_at,
    } for n in notifications]

    return Response(data)


# ============================================
#           MARK NOTIFICATIONS AS READ
# ============================================
@api_view(['POST'])
@permission_classes([AllowAny])
def mark_notifications_read(request):
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded = AccessToken(token)
        user    = User.objects.get(id=decoded['user_id'])
    except Exception:
        return Response({'error': 'Invalid token'}, status=401)

    Notification.objects.filter(recipient=user, is_read=False).update(is_read=True)
    return Response({'message': 'All marked as read'})



@api_view(['GET'])
@permission_classes([AllowAny])
def get_my_agreement(request):
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded = AccessToken(token)
        user    = User.objects.get(id=decoded['user_id'])
        student = StudentProfile.objects.get(user=user)
    except Exception:
        return Response({'error': 'Invalid token'}, status=401)

    # find validated agreement for this student
    agreement = Agreement.objects.filter(
        application__student=student,
        status='validated'
    ).first()

    if not agreement:
        return Response({'error': 'No validated agreement found'}, status=404)

    return Response({
    'agreement_id': agreement.id,
    'offer_title':  agreement.application.offer.title,
    'company_name': agreement.application.offer.company.company_name,
    'company_id':   agreement.application.offer.company.id,
    'validated_at': agreement.validated_at,
    'pdf_url':      f'http://127.0.0.1:8000/media/{agreement.pdf_file.name}',
    'status':       agreement.status,
})



# ============================================
#   GET ALL UNIVERSITIES (public - for register dropdown)
# ============================================
@api_view(['GET'])
@permission_classes([AllowAny])
def get_universities(request):
    universities = University.objects.filter(is_active=True)
    data = [{
        'id':     u.id,
        'name':   u.name,
        'wilaya': u.wilaya,
    } for u in universities]
    return Response(data)


# ============================================
#   SUPERADMIN: ADD UNIVERSITY
# ============================================
@api_view(['POST'])
@permission_classes([AllowAny])
def superadmin_add_university(request):
    # verify superadmin
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded = AccessToken(token)
        user    = User.objects.get(id=decoded['user_id'], role='superadmin')
    except Exception:
        return Response({'error': 'Unauthorized'}, status=401)

    name   = request.data.get('name')
    wilaya = request.data.get('wilaya')
    email  = request.data.get('email', '')

    if not name or not wilaya:
        return Response({'error': 'Name and wilaya are required'}, status=400)

    if University.objects.filter(name=name).exists():
        return Response({'error': 'University already exists'}, status=400)

    university = University.objects.create(
        name=name, wilaya=wilaya, email=email
    )
    return Response({
        'message': f'University {name} added successfully!',
        'id':      university.id,
        'name':    university.name,
        'wilaya':  university.wilaya,
    }, status=201)


# ============================================
#   SUPERADMIN: CREATE ADMIN FOR UNIVERSITY
# ============================================
@api_view(['POST'])
@permission_classes([AllowAny])
def superadmin_create_admin(request):
    # verify superadmin
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded = AccessToken(token)
        user    = User.objects.get(id=decoded['user_id'], role='superadmin')
    except Exception:
        return Response({'error': 'Unauthorized'}, status=401)

    from django.contrib.auth.hashers import make_password

    full_name     = request.data.get('full_name')
    email         = request.data.get('email')
    password      = request.data.get('password')
    university_id = request.data.get('university_id')

    if not all([full_name, email, password, university_id]):
        return Response({'error': 'All fields are required'}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists'}, status=400)

    try:
        university = University.objects.get(id=university_id)
    except University.DoesNotExist:
        return Response({'error': 'University not found'}, status=404)

    admin = User.objects.create(
        full_name  = full_name,
        email      = email,
        password   = make_password(password),
        role       = 'admin',
        university = university
    )
    return Response({
        'message':    f'Admin created for {university.name}!',
        'admin_id':   admin.id,
        'full_name':  admin.full_name,
        'email':      admin.email,
        'university': university.name,
    }, status=201)


# ============================================
#   SUPERADMIN: LIST ALL UNIVERSITIES + STATS
# ============================================
@api_view(['GET'])
@permission_classes([AllowAny])
def superadmin_universities(request):
    # verify superadmin
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded = AccessToken(token)
        user    = User.objects.get(id=decoded['user_id'], role='superadmin')
    except Exception:
        return Response({'error': 'Unauthorized'}, status=401)

    universities = University.objects.all()
    data = []
    for u in universities:
        data.append({
            'id':        u.id,
            'name':      u.name,
            'wilaya':    u.wilaya,
            'email':     u.email,
            'is_active': u.is_active,
            'admins':    User.objects.filter(university=u, role='admin').count(),
            'students':  StudentProfile.objects.filter(university=u).count(),
            'added_at':  u.added_at,
        })
    return Response(data)


# ============================================
#   SUPERADMIN: TOGGLE UNIVERSITY ACTIVE
# ============================================
@api_view(['PATCH'])
@permission_classes([AllowAny])
def superadmin_toggle_university(request, university_id):
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded = AccessToken(token)
        user    = User.objects.get(id=decoded['user_id'], role='superadmin')
    except Exception:
        return Response({'error': 'Unauthorized'}, status=401)

    try:
        university = University.objects.get(id=university_id)
    except University.DoesNotExist:
        return Response({'error': 'University not found'}, status=404)

    university.is_active = not university.is_active
    university.save()
    return Response({
        'message':   f'University {"activated" if university.is_active else "deactivated"}!',
        'is_active': university.is_active
    })


# ============================================
#   SUPERADMIN: LIST ALL ADMINS
# ============================================
@api_view(['GET'])
@permission_classes([AllowAny])
def superadmin_admins(request):
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded = AccessToken(token)
        user    = User.objects.get(id=decoded['user_id'], role='superadmin')
    except Exception:
        return Response({'error': 'Unauthorized'}, status=401)

    admins = User.objects.filter(role='admin').select_related('university')
    data = [{
        'id':         a.id,
        'full_name':  a.full_name,
        'email':      a.email,
        'university': a.university.name if a.university else '—',
        'university_id': a.university.id if a.university else None,
    } for a in admins]
    return Response(data)



@api_view(['GET'])
@permission_classes([AllowAny])
def public_companies(request):
    companies = CompanyProfile.objects.all()
    data = []
    for c in companies:
        student_reviews = Review.objects.filter(company=c)
        public_revs     = PublicReview.objects.filter(company=c)
        all_ratings = [r.rating for r in student_reviews] + [r.rating for r in public_revs]
        avg = round(sum(all_ratings) / len(all_ratings), 1) if all_ratings else 0
        data.append({
            'id':            c.id,
            'company_name':  c.company_name,
            'description':   c.description,
            'location':      c.location,
            'website':       c.website,
            'initial':       c.company_name[0].upper() if c.company_name else 'C',
            'avg_rating':    avg,
            'total_reviews': len(all_ratings),
        })
    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def public_reviews(request):
    reviews = Review.objects.all().order_by('-created_at')[:6]
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


# ============================================
#   PUBLIC: ALL COMPANIES + THEIR REVIEWS
# ============================================


# ============================================
#   PUBLIC: REVIEWS FOR ONE COMPANY
# ============================================
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def company_public_reviews(request, company_id):
    try:
        company = CompanyProfile.objects.get(id=company_id)
    except CompanyProfile.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

    if request.method == 'GET':
        # Verified student reviews (from completed & validated internships)
        verified = [{
            'student_name': r.student.user.full_name,
            'rating':       r.rating,
            'comment':      r.comment,
            'verified':     True,
        } for r in Review.objects.filter(company=company).order_by('-created_at')]

        # Anonymous public reviews
        public = [{
            'student_name': r.name,
            'rating':       r.rating,
            'comment':      r.comment,
            'verified':     False,
        } for r in PublicReview.objects.filter(company=company).order_by('-created_at')]

        return Response(verified + public)

    if request.method == 'POST':
        name    = request.data.get('name', 'Anonymous')
        rating  = int(request.data.get('rating', 5))
        comment = request.data.get('comment', '')
        if not comment.strip():
            return Response({'error': 'Comment is required'}, status=400)
        PublicReview.objects.create(company=company, name=name, rating=rating, comment=comment)
        return Response({'message': 'Review submitted!'}, status=201)



# ============================================
#   WEBSITE REVIEWS — leave + get
# ============================================
@api_view(['POST'])
@permission_classes([AllowAny])
def leave_website_review(request):
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded = AccessToken(token)
        user    = User.objects.get(id=decoded['user_id'])
    except Exception:
        return Response({'error': 'Invalid token'}, status=401)

    rating  = request.data.get('rating')
    comment = request.data.get('comment')

    if not rating or not comment:
        return Response({'error': 'Rating and comment are required'}, status=400)

    WebsiteReview.objects.create(user=user, rating=rating, comment=comment)
    return Response({'message': 'Thank you for your review! ⭐'})


@api_view(['GET'])
@permission_classes([AllowAny])
def get_website_reviews(request):
    from .serializers import WebsiteReviewSerializer
    reviews    = WebsiteReview.objects.all().order_by('-created_at')
    avg_rating = round(sum(r.rating for r in reviews) / reviews.count(), 1) if reviews.exists() else 0
    serializer = WebsiteReviewSerializer(reviews, many=True)
    return Response({
        'average_rating': avg_rating,
        'total_reviews':  reviews.count(),
        'reviews':        serializer.data,
    })


# ============================================
#   COMPANY PUBLIC PROFILE + OFFERS + REVIEWS
# ============================================
@api_view(['GET'])
@permission_classes([AllowAny])
def company_public_profile(request, company_id):
    try:
        company = CompanyProfile.objects.get(id=company_id)
    except CompanyProfile.DoesNotExist:
        return Response({'error': 'Company not found'}, status=404)

    # reviews
    reviews = Review.objects.filter(company=company).order_by('-created_at')
    avg_rating = round(sum(r.rating for r in reviews) / reviews.count(), 1) if reviews.exists() else 0

    # active offers
    offers = Offer.objects.filter(company=company, is_active=True)
    offers_data = OfferSerializer(offers, many=True).data

    reviews_data = [{
        'id':           r.id,
        'student_name': r.student.user.full_name,
        'rating':       r.rating,
        'comment':      r.comment,
        'created_at':   r.created_at,
    } for r in reviews]

    return Response({
        'id':            company.id,
        'company_name':  company.company_name,
        'description':   company.description,
        'location':      company.location,
        'website':       company.website,
        'avg_rating':    avg_rating,
        'total_reviews': reviews.count(),
        'reviews':       reviews_data,
        'offers':        offers_data,
        'total_offers':  offers.count(),
    })



# public_reviews defined above (line ~1257)





# ── STUDENT LEAVE REVIEW (token-based) ──
@api_view(['POST'])
@permission_classes([AllowAny])
def leave_review_token(request):
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded = AccessToken(token)
        user    = User.objects.get(id=decoded['user_id'])
        student = StudentProfile.objects.get(user=user)
    except Exception:
        return Response({'error': 'Invalid token or not a student'}, status=401)

    company_id = request.data.get('company_id')
    rating     = request.data.get('rating')
    comment    = request.data.get('comment', '')

    if not company_id or not rating:
        return Response({'error': 'company_id and rating are required'}, status=400)

    try:
        company = CompanyProfile.objects.get(id=company_id)
    except CompanyProfile.DoesNotExist:
        return Response({'error': 'Company not found'}, status=404)

    # check if already reviewed
    if Review.objects.filter(student=student, company=company).exists():
        return Response({'error': 'You already reviewed this company'}, status=400)

    # check if student had a validated agreement with this company
    agreement = Agreement.objects.filter(
        application__student=student,
        application__offer__company=company,
        status='validated'
    ).first()

    if not agreement:
        return Response({'error': 'You can only review companies where you completed an internship'}, status=403)

    Review.objects.create(
        student=student, company=company,
        agreement=agreement,
        rating=rating, comment=comment
    )
    return Response({'message': 'Review submitted successfully!'}, status=201)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_my_agreements(request):
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded = AccessToken(token)
        user    = User.objects.get(id=decoded['user_id'])
        student = StudentProfile.objects.get(user=user)
    except Exception:
        return Response({'error': 'Invalid token'}, status=401)

    agreements = Agreement.objects.filter(
        application__student=student,
        status='validated'
    )

    data = []
    for a in agreements:
        company = a.application.offer.company
        already_reviewed = Review.objects.filter(student=student, company=company).exists()
        data.append({
            'agreement_id':   a.id,
            'company_id':     company.id,
            'company_name':   company.company_name,
            'offer_title':    a.application.offer.title,
            'pdf_url':        f'http://127.0.0.1:8000/media/{a.pdf_file.name}' if a.pdf_file else None,
            'has_reviewed':   already_reviewed,
        })

    return Response(data)



@api_view(['GET'])
@permission_classes([AllowAny])
def superadmin_recent_activity(request):
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded = AccessToken(token)
        user    = User.objects.get(id=decoded['user_id'], role='superadmin')
    except Exception:
        return Response({'error': 'Unauthorized'}, status=401)

    activity = []

    # Recent applications
    for app in Application.objects.select_related(
        'student__user', 'offer__company'
    ).order_by('-applied_at')[:10]:
        activity.append({
            'type':    'application',
            'message': f"{app.student.user.full_name} applied to '{app.offer.title}' at {app.offer.company.company_name}",
            'time':    app.applied_at,
            'status':  app.status,
        })

    # Recent offers posted
    for offer in Offer.objects.select_related('company').order_by('-created_at')[:10]:
        activity.append({
            'type':    'offer',
            'message': f"{offer.company.company_name} posted a new offer: '{offer.title}'",
            'time':    offer.created_at,
            'status':  'new',
        })

    # Recent agreements
    for ag in Agreement.objects.select_related(
        'application__student__user', 'application__offer__company'
    ).order_by('-validated_at')[:10]:
        activity.append({
            'type':    'agreement',
            'message': f"Convention validated for {ag.application.student.user.full_name} at {ag.application.offer.company.company_name}",
            'time':    ag.validated_at,
            'status':  ag.status,
        })

    # Sort by time descending
    activity.sort(key=lambda x: x['time'], reverse=True)
    activity = activity[:8]

    # Convert datetime to string AFTER sorting
    for a in activity:
        a['time'] = a['time'].strftime('%b %d, %Y · %H:%M')

    return Response(activity)



@api_view(['POST'])
@permission_classes([AllowAny])
def upload_cv(request):
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded = AccessToken(token)
        user    = User.objects.get(id=decoded['user_id'])
        student = StudentProfile.objects.get(user=user)
    except Exception:
        return Response({'error': 'Invalid token'}, status=401)

    cv_file = request.FILES.get('cv_file')
    if not cv_file:
        return Response({'error': 'No file provided'}, status=400)
    if not cv_file.name.endswith('.pdf'):
        return Response({'error': 'Only PDF files are allowed'}, status=400)

    student.cv_file = cv_file
    student.save()
    return Response({
        'message': 'CV uploaded successfully!',
        'cv_url': f'http://127.0.0.1:8000/media/{student.cv_file.name}'
    })



@api_view(['GET'])
@permission_classes([AllowAny])
def superadmin_messages(request):
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ')[1] if ' ' in auth_header else ''
    try:
        decoded = AccessToken(token)
        user    = User.objects.get(id=decoded['user_id'], role='superadmin')
    except Exception:
        return Response({'error': 'Unauthorized'}, status=401)

    messages = ContactMessage.objects.order_by('-created_at')
    data = [{
        'id':         m.id,
        'name':       m.name,
        'email':      m.email,
        'subject':    m.subject,
        'message':    m.message,
        'created_at': m.created_at,
    } for m in messages]
    return Response(data)


@api_view(['POST'])
@permission_classes([AllowAny])
def contact_message(request):
    name    = request.data.get('name')
    email   = request.data.get('email')
    subject = request.data.get('subject', 'No subject')
    message = request.data.get('message')

    if not name or not email or not message:
        return Response({'error': 'Name, email and message are required'}, status=400)

    ContactMessage.objects.create(name=name, email=email, subject=subject, message=message)

    superadmins = User.objects.filter(role='superadmin')
    for admin in superadmins:
        Notification.objects.create(
            recipient=admin,
            message=f"📩 New message from {name} ({email}): \"{subject}\""
        )

    return Response({'message': 'Message received!'}, status=201)