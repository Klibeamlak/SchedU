import pyotp
from datetime import datetime, timedelta
from django.core.mail import send_mail

def send_otp(request, email):
    totp = pyotp.TOTP(pyotp.random_base32(), interval=300)
    otp = totp.now()
    request.session['otp_secret_key'] = totp.secret
    valid_date = datetime.now() + timedelta(minutes=5)
    request.session['otp_valid_until'] = str(valid_date)
    request.session.modified = True
    message = "Your one-time password reset code is " + otp + ". This code is valid for 5 minutes.\n"
    send_mail(
        "SchedU password reset code",
        message,
        "schedurecovery@gmail.com",
        [email]
    )
    return request
