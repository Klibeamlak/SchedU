import re
from django.core.exceptions import ValidationError

class PasswordValidator:
    def __validate__(self, password, user=None):
        if (not re.search('[A-Z]', password) or
                not re.search('[!@#$%^&*(),.?":{}|<>]', password)):
            raise ValidationError(
                _("The password must contain at least one uppercase letter and one special character."),
                code='password_invalid',
            )
        
    def get_error_message(self):
        return _(
            "Your password must contain at least one uppercase letter and one special character."
        )


def validate_password(value):
    if not re.findall('[A-Z]'):
        raise ValidationError('The password must contain at least 1 uppercase letter.', code='no_uppercase')
    if not re.findall('[!@#$%^&*(),.<>|]', value):
        raise ValidationError('The password must contain at least 1 special character.', code='no_special')