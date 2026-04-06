from django.db import models

# ============================================
#                 USER TABLE
# ============================================
class User(models.Model):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('company', 'Company'),
        ('admin', 'Admin'),
    ]
    full_name  = models.CharField(max_length=255)
    email      = models.EmailField(unique=True)
    password   = models.CharField(max_length=255)
    role       = models.CharField(max_length=20, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


# ============================================
#            STUDENT PROFILE TABLE
# ============================================
class StudentProfile(models.Model):
    user        = models.OneToOneField(User, on_delete=models.CASCADE)
    skills      = models.TextField(blank=True)
    github_link = models.URLField(blank=True)
    wilaya      = models.CharField(max_length=100, blank=True)
    university  = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Profile of {self.user.full_name}"


# ============================================
#            COMPANY PROFILE TABLE
# ============================================
class CompanyProfile(models.Model):
    user         = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    description  = models.TextField(blank=True)
    location     = models.CharField(max_length=255, blank=True)
    website      = models.URLField(blank=True)

    def __str__(self):
        return self.company_name


# ============================================
#                OFFER TABLE
# ============================================
class Offer(models.Model):
    TYPE_CHOICES = [
        ('presentiel', 'Présentiel'),
        ('remote', 'Remote'),
        ('hybride', 'Hybride'),
    ]
    company     = models.ForeignKey(CompanyProfile, on_delete=models.CASCADE)
    title       = models.CharField(max_length=255)
    description = models.TextField()
    skills      = models.TextField()
    wilaya      = models.CharField(max_length=100)
    type        = models.CharField(max_length=20, choices=TYPE_CHOICES)
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# ============================================
#             APPLICATION TABLE
# ============================================
class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('refused', 'Refused'),
    ]
    student    = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    offer      = models.ForeignKey(Offer, on_delete=models.CASCADE)
    status     = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'offer')

    def __str__(self):
        return f"{self.student} → {self.offer}"


# ============================================
#             AGREEMENT TABLE
# ============================================
class Agreement(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('validated', 'Validated'),
        ('rejected', 'Rejected'),
    ]
    application  = models.OneToOneField(Application, on_delete=models.CASCADE)
    validated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    validated_at = models.DateTimeField(auto_now_add=True)
    pdf_file     = models.FileField(upload_to='agreements/', blank=True)
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Agreement for {self.application}"


# ============================================
#           NOTIFICATION TABLE
# ============================================
class Notification(models.Model):
    recipient  = models.ForeignKey(User, on_delete=models.CASCADE)
    message    = models.TextField()
    is_read    = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification → {self.recipient.full_name}"