import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/blog-home/blog-home').then(m => m.BlogHome),
        canActivate: [authGuard]
    },
    {
        path: 'blog/detail/:id',
        loadComponent: () => import('./components/blog-item-details/blog-item-details')
            .then(m => m.BlogItemDetailsComponent)
    },
    {
        path: 'favorites',
        loadComponent: () => import('./components/favorites/favorites').then(m => m.Favorites),
    },
    {
        path: 'home',
        loadComponent: () => import('./components/home/home').then(m => m.HomeComponent),
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
    },
    {
        path: 'signup',
        loadComponent: () => import('./components/signup/signup').then(m => m.SignupComponent)
    }
];
