from django.contrib.auth import get_user_model
from club.models import Project, Task, Event, Attendance
from django.utils import timezone
import random

User = get_user_model()

def run():
    print("Seeding demo users...")
    
    # Create or retrieve the main admin/project for assignment
    admin_user = User.objects.filter(is_superuser=True).first()
    if not admin_user:
        print("Error: No admin user found. Run seed_data.py first or create a superuser.")
        # Fallback if needed, but assuming seed_data ran
        
    project, _ = Project.objects.get_or_create(
        name="NST SDC Portal", 
        defaults={
            "description": "The official portal.",
            "status": "in_progress"
        }
    )

    for i in range(1, 11):
        username = f"user{i}"
        email = f"user{i}@example.com"
        password = "password123"
        
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "first_name": f"Demo",
                "last_name": f"User {i}",
                "is_member": True,
                "points": random.randint(10, 500),
                "student_id": f"NST{2023000 + i}",
                "batch_year": 2025,
                "skill_level": random.choice(["beginner", "intermediate", "advanced"]),
            }
        )
        
        if created:
            user.set_password(password)
            user.save()
            print(f"Created {username} (pass: {password})")
        else:
            print(f"User {username} already exists")

        # Assign to project
        if project:
            project.contributors.add(user)
            
        # Create a sample task
        Task.objects.create(
            title=f"Fix issue #{random.randint(100, 999)}",
            description="Fix the reported bug in the system.",
            assigned_to=user,
            points=20,
            status=random.choice(["pending", "in_progress", "submitted"]),
            due_date=timezone.now() + timezone.timedelta(days=random.randint(1, 7))
        )

    print("Done! 10 users created/updated.")

if __name__ == "__main__":
    run()
