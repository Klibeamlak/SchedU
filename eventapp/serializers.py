from rest_framework import serializers
from .models import User, Event, EventDate, Event

class EventSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())  # Represents the owner as its primary key

    class Meta:
        model = Event
        fields = ('ID', 'owner', 'title', 'duration', 'recurring', 'min_start_time', 'max_start_time')

class UserSerializer(serializers.ModelSerializer):
    events_available_for = EventSerializer(many=True, read_only=True)  # Nested representation of events

    class Meta:
        model = User
        fields = ('ID', 'username', 'email', 'events_available_for', 'encrypted_pw', 'salt')