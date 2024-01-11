from django.http import JsonResponse, Http404, HttpResponse
from django.core.exceptions import ValidationError
from .models import User, AvailableFor, Event
from django.contrib.auth import authenticate
from rest_framework_jwt.settings import api_settings
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.shortcuts import render
import json
from .utils import send_otp
import pyotp
from datetime import datetime, timedelta, time

# Starts the home page
def home(request, *args, **kwargs):
    return render(request, 'index.html')

# Registers a new user's account with a username, password, and email
@csrf_exempt
def register(request):
    if request.method == 'POST':
        # Get data from the request
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        # Ensures that all of the required fields were included
        if not all([username, email, password]):
            return JsonResponse({'error': 'Missing username, email or password'}, status=400)
        
        # Check if the email is already in use
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email is already in use'}, status=400)

        # Creates a new user
        user = User(username=username, email=email)

        # Encrypts and salts the password
        user.set_password(password)

        # Writes to the the DB for the first time
        user.save()

        return JsonResponse({'message': 'Registration successful!'})

    return JsonResponse({'error': 'Bad request'}, status=400)

# Allows users to login via a username and password that are entered

@csrf_exempt
def login(request):
    print("TEST\n");
    if request.method == 'POST':
        data = json.loads(request.body)

        email = data['email']
        password = data['password']

        user = authenticate(email=email, password=password)

        if user:
            if user.is_active:
                # Creates session tokens to keep the user authenticated
                request.session['user_email'] = email;
                jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
                jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

                payload = jwt_payload_handler(user)
                token = jwt_encode_handler(payload)

                return JsonResponse({'message': 'Login successful!', 'token': token})
            else:
                return JsonResponse({'message': 'Account is disabled.'}, status=403)
        else:
            return JsonResponse({'message': 'Invalid credentials'}, status=401)

    return JsonResponse({'error': 'Only POST method is allowed'}, status=400)

# Returns all of the availabilities for a given event
def get_availabilities_for_event(request, event_id):
    # Only allows the GET method to return availabilities
    if request.method != 'GET':
        return JsonResponse({'error': 'Only GET method is allowed'}, status=400)

    try:
        # Check if the event exists
        event = Event.objects.get(pk=event_id)
    except Event.DoesNotExist:
        return JsonResponse({'error': 'Event Not Found'}, status=404)

    availabilities = AvailableFor.objects.filter(event=event)
    
    # Loops through all availabilities and returns the result
    data = [
        {
            'user': availability.user.username, 
            'start_time': availability.start_time.strftime('%Y-%m-%d %H:%M:%S'),
            'end_time': availability.end_time.strftime('%Y-%m-%d %H:%M:%S')
        } for availability in availabilities
    ]
    
    return JsonResponse(data, safe=False)

# Create/Update/Get User Availability
def user_availability(request, availability_id=None):
        try:
            if request.method == 'GET':
                if availability_id:

                    # Returns the availability for a given user
                    availability = AvailableFor.objects.get(pk=availability_id)
                    return JsonResponse({
                        'user_id': availability.user_id,
                        'event_id': availability.event_id,
                        'start_time': availability.start_time,
                        'end_time': availability.end_time
                    })
            elif request.method == 'PUT': 
                data = json.loads(request.body)

                availability = AvailableFor.objects.get(pk=availability_id)
                availability.start_time = data['start_time']
                availability.end_time = data['end_time']

                # Writes to the database
                availability.save()

                return JsonResponse({'message': 'Availability updated successfully!'})
            elif request.method == 'POST':
                data = json.loads(request.body)
                user = User.objects.get(pk=data['user_id'])
                
                # Creates a new availability
                availability = AvailableFor(
                    user=user,
                    event=Event.objects.get(pk=data['event_id']),
                    start_time=data['start_time'],
                    end_time=data['end_time']
                )

                # Writes to the database
                availability.save()

                return JsonResponse({'message': 'Availability created successfully!'})
            elif request.method == 'DELETE':
                if availability_id:
                    availability = AvailableFor.objects.get(pk=availability_id)
                    availability.delete()
                    return JsonResponse({'message': 'No Content'}, status=204)
                else:
                    return JsonResponse({'error': 'Availability ID not provided.'}, status=400)
            else:
                return JsonResponse({'error': 'Invalid request method.'}, status=405)
            
        except ValueError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except AvailableFor.DoesNotExist:
            return JsonResponse({'error': 'Availability not found.'}, status=404)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=404)
        except Event.DoesNotExist:
            return JsonResponse({'error': 'Event not found.'}, status=404)
        except ValidationError:
            return JsonResponse({'error': 'Invalid data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=400)

# Create/Update/Get Data for an event       
@csrf_exempt
def event(request, event_id=None):
    try:
        if request.method == 'GET':
            if event_id:
                event = Event.objects.get(pk=event_id)
                event_data = {
                    #'owner_id': event.owner_id,
                    'title': event.title,
                    'min_start_time': event.min_start_time.isoformat() if event.min_start_time else None,
                    'max_start_time': event.max_start_time.isoformat() if event.max_start_time else None,
                }
                return JsonResponse(event_data)
        elif request.method == 'PUT': 
            # Extract data from the request
            data = json.loads(request.body)

            event = Event.objects.get(pk=event_id)
            event.title = data['title']
            event.min_start_time = data['min_start_time']
            event.max_start_time = data['max_start_time']

            # Writes to the database
            event.save()

            return JsonResponse({'message': 'Event updated successfully!'})
        elif request.method == 'POST':
            # Extract data from the request
            data = json.loads(request.body)
            title = data['title']
            earliest=data['min_start_time']
            latest=data['max_start_time']
            print("Test")
            print(title)
            print(earliest)
            print(latest)

            print("test21")
            # Find the owner User object
            #owner_email = request.session['user_email']
            #owner = User.objects.get(email=owner_email)
           # print(owner)
            print("test22")
            # Create the new Event
            event = Event(
               # owner=owner,
                title=title,
                min_start_time=earliest,
                max_start_time=latest
            )

            # Save the data to the database
            event.save()
            print(event.id)
            return JsonResponse({'message': 'Event created successfully'}, status=201)
        elif request.method == 'DELETE':
            if event_id:
                event = Event.objects.get(pk=event_id)
                event.delete()
                return JsonResponse({'message': 'No Content'}, status=204)
            else:
                return JsonResponse({'error': 'Event ID not provided.'}, status=400)

        else:
            return JsonResponse({'error': 'Invalid request method.'}, status=405)
        
    except ValueError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Event.DoesNotExist:
        return JsonResponse({'error': 'Event not found.'}, status=404)
    except ValidationError as e:
        return JsonResponse({'error': str(e)}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=400)

# Update/Get Data for a user -> User Creation is handled via registration
def user_detail(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User Not Found'}, status=404)

    if request.method == 'GET':
        user_data = {
            'username': user.username,
            'email': user.email,
            # IMPORTANT: never send the password over
        }
        return JsonResponse(user_data)

    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)
            if 'password' in data:
                user.set_password(data['password'])
            user.save()
        except (ValueError, KeyError):
            return JsonResponse({'error': 'Invalid data'}, status=400)
        return JsonResponse({'message': 'User updated successfully!'})

    elif request.method == 'DELETE':
        user.delete()
        return JsonResponse({'message': 'No Content'}, status=204)

    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def start_pw_reset(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        email = data['email']

        if not User.objects.filter(email=email).exists():
            return JsonResponse(request, {'error': 'Email not found'}, status=404)

        request = send_otp(request, email)
        return HttpResponse("Found account. Sending otp.")

@csrf_exempt
def finish_pw_reset(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        email = data['email']

        user = User.objects.get(email=email)
        if user is not None:
            otp = data['otp']
            otp_secret_key = request.session['otp_secret_key']
            otp_valid_until = request.session['otp_valid_until']
            if otp_secret_key and otp_valid_until is not None:
                valid_until = datetime.fromisoformat(otp_valid_until)
                if valid_until > datetime.now():
                    totp = pyotp.TOTP(otp_secret_key, interval=300)
                    if totp.verify(otp):
                        user.set_password(data['password'])
                        user.save()
                        return JsonResponse({'message': 'Password reset'})
                    else:
                        return JsonResponse({'error': 'Invalid OTP code'}, status=401)
                else:
                    return JsonResponse({'error': 'Expired OTP code'}, status=401)
            else:
                return JsonResponse({'error': 'OTP code not created'}, status=404)