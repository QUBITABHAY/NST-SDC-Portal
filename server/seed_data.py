from django.contrib.auth import get_user_model
from club.models import Project

User = get_user_model()

def run():
    if User.objects.filter(username="admin").exists():
        print("Data already seeded.")
        return

    # Create admin user
    admin = User.objects.create_superuser(
        username="admin", 
        email="admin@example.com", 
        password="password123",
        first_name="Admin",
        last_name="User",
        is_club_admin=True
    )
    print("Created admin user.")

    # Create a project
    project = Project.objects.create(
        name="NST SDC Portal",
        description="The official portal for the NST Student Developer Club.",
        status="in_progress",
        tech_stack=["React", "Django", "TailwindCSS"],
        github_repo="https://github.com/nst-sdc/NST-SDC-Portal",
        lead=admin
    )
    project.contributors.add(admin)
    print("Created project: NST SDC Portal")

if __name__ == "__main__":
    run()
