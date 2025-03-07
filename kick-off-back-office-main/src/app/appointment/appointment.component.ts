import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService } from '../Services/training.service';
import { Match, Reser, TrainingPlan } from '../models/training.model';
import { AuthService } from '../Services/auth/auth.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent {

  trainingPlans: TrainingPlan[] = [];
  trainingId !: string;
  matches: Match[] = [];
  evenements: Reser[] = [];
  nouveau: Reser = new Reser();
  currentPage: number = 1;
  itemsPerPage: number = 9;
  isSubMenuOpen: boolean = false;
  backgroundImageSrc: string = '../../../assets/images/fooball.jpg'; // Update this with the path to your image


  isUserSubMenuOpen: boolean = false;
  toggleUserSubMenu() {
    this.isUserSubMenuOpen = !this.isUserSubMenuOpen;
  }

  isPerformanceSubMenuOpen: boolean = false;

  togglePerformanceSubMenu() {
    this.isPerformanceSubMenuOpen = !this.isPerformanceSubMenuOpen;
  }

  toggleSubMenu(): void {
    this.isSubMenuOpen = !this.isSubMenuOpen;
  }

  constructor(private route: ActivatedRoute,
    private router: Router, private trainingService: TrainingService, private authService: AuthService,) { }


  ngOnInit() {
    this.getTrainingPlans();
    this.trainingId = this.route.snapshot.params['id'];
    this.getMatches();
    this.loadEvents();

  }

  loadEvents(): void {
    this.trainingService.getAllEvents().subscribe(
      (data: Reser[]) => {
        this.evenements = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des événements :', error);
      }
    );
  }
  logout(): void {
    this.authService.performLogout().subscribe(
      () => {
        console.log('Logout successful');
        // Redirect the user to the login page after successful logout
        window.location.href = 'http://localhost:4200/user/login'; // Assuming the other project is running on port 4201
      },
      error => {
        console.error('Logout error:', error);
      }
    );
  }

  getMatches() {
    this.trainingService.getAllMatches()
      .subscribe(
        matches => {
          this.matches = matches; // Stocker les matchs récupérés dans la variable du composant
        },
        error => {
          console.error('Erreur lors du chargement des matchs :', error);
        }
      );
  }
  navigateToArchive() {
    this.router.navigate(['/archivee']);
  }
  archivePlayer(id: string) {
    if (confirm('Are you sure you want to archive this meeting?')) {
      this.trainingService.archiveEvent(id).subscribe(
        () => {
          this.loadEvents();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  getTrainingPlans() {
    this.trainingService.getAllTrainingPlans()
      .subscribe(
        plans => {
          this.trainingPlans = plans;
        },
        error => {
          console.error('Error loading plans', error);
        }
      );
  }
  formaterDate(date: Date): string {
    return new Date(date).toLocaleDateString(); // Par exemple, "07/03/2024" pour le format "MM/JJ/AAAA"
  }

}

