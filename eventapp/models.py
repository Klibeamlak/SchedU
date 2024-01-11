from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def get_user(request):
        from django.contrib.auth.models import AnonymousUser
        try:
            user_id = request.session[SESSION_KEY]
            backend_path = request.session[BACKEND_SESSION_KEY]
            backend = load_backend(backend_path)
            user = backend.get_user(user_id) or AnonymousUser()
        except KeyError:
            user = AnonymousUser()
        return user

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField('email address', unique=True)
    username = models.CharField('username', max_length=255)
    is_active = models.BooleanField('active', default=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'user'

    def __str__(self):
        return self.email

class Event(models.Model):
    #owner = models.ForeignKey(User, on_delete=models.CASCADE, db_column='ownerid')
    title = models.CharField(max_length=255)

    # Time Details
    min_start_time = models.TimeField(null=True, blank=True, db_column='MinStartTime')
    max_start_time = models.TimeField(null=True, blank=True, db_column='MaxStartTime')
    
    class Meta:
        db_table = 'event'

class AvailableFor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='UserID')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, db_column='EventID')
    start_time = models.DateTimeField(null=True, blank=True, db_column='StartTime')
    end_time = models.DateTimeField(null=True, blank=True, db_column='EndTime')

    class Meta:
        db_table = 'availablefor'
        constraints = [
            models.UniqueConstraint(fields=['user', 'event', 'start_time', 'end_time'], name='unique_available_for_slot')
        ]

class EventDate(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, db_column='EventID')
    date = models.DateField(null = True, blank = True, db_column='Date')

    class Meta:
        db_table = 'eventdate'
        constraints = [
            models.UniqueConstraint(fields=['event', 'date'], name = 'unique_date_for_event')
        ]