# Aplikacja Blogowa

Aplikacja blogowa typu full-stack zbudowana w oparciu o Angular (Frontend) i Node.js/Express (Backend).

## Struktura Projektu

*   `blog/`: Aplikacja frontendowa (Angular)
*   `server/`: API backendowe (Node.js + Express + TypeScript)

## Wymagania wstępne

*   [Node.js](https://nodejs.org/) (Zalecana najnowsza wersja LTS)
*   [MongoDB](https://www.mongodb.com/) (Upewnij się, że MongoDB działa lokalnie lub przygotuj string połączeniowy)

## Instalacja

### 1. Konfiguracja Backendu

Przejdź do katalogu `server` i zainstaluj zależności:

```bash
cd server
npm install
```

Stwórz plik `.env` w katalogu `server` z poniższą konfiguracją (przykład):

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/blog-db
JWT_SECRET=twoj_sekretny_klucz_jwt
```

### 2. Konfiguracja Frontendu

Przejdź do katalogu `blog` i zainstaluj zależności:

```bash
cd blog
npm install
```

## Uruchomienie Aplikacji

### Uruchomienie Backendu (API)

Tryb deweloperski (z hot-reload):

```bash
cd server
npm run dev
```

Tryb produkcyjny (zbudowanie i uruchomienie):

```bash
cd server
npm run build
npm start
```

Serwer domyślnie uruchomi się pod adresem `http://localhost:3000` (zależnie od ustawienia PORT w .env).

### Uruchomienie Frontendu (Angular)

Aby uruchomić serwer deweloperski:

```bash
cd blog
npm start
```

Otwórz w przeglądarce `http://localhost:4200/`. Aplikacja będzie automatycznie odświeżać się po wprowadzeniu zmian w plikach źródłowych.

## Budowanie wersji produkcyjnej

### Backend

```bash
cd server
npm run build
```

Skompilowane pliki JavaScript znajdą się w katalogu `server/dist`.

### Frontend

```bash
cd blog
npm run build
```

Zbudowana aplikacja znajdzie się w katalogu `blog/dist/`.

## Funkcjonalności

*   **Frontend:** Angular 17+, stylowanie Bootstrap, wsparcie dla Angular SSR (Server-Side Rendering).
*   **Backend:** TypeScript, Express.js, Mongoose (modelowanie obiektów MongoDB).
*   **Uwierzytelnianie:** Logowanie użytkowników oparte o JWT.
