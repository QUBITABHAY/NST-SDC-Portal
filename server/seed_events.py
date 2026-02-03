from club.models import Event
from django.utils import timezone
import datetime

def run():
    print("Seeding events...")
    
    events = [
        {
            "title": "Weekly Sync",
            "description": "Weekly developers sync meeting.",
            "event_type": "meeting",
            "event_date": timezone.now() + datetime.timedelta(days=2),
            "location": "Room 303"
        },
        {
            "title": "Intro to Django",
            "description": "Workshop on Django framework basics.",
            "event_type": "workshop",
            "event_date": timezone.now() + datetime.timedelta(days=5),
            "location": "Auditorium"
        },
        {
            "title": "Hackathon 2026",
            "description": "Annual college hackathon.",
            "event_type": "competition",
            "event_date": timezone.now() + datetime.timedelta(days=20),
            "location": "Main Hall"
        }
    ]

    for event_data in events:
        Event.objects.create(**event_data)
        print(f"Created event: {event_data['title']}")

if __name__ == "__main__":
    run()
