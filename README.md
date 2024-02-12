# Node.js Cron Scheduler

## Opis
CronScheduler to elastyczny mechanizm harmonogramowania zadań w Node.js. Pozwala na uruchamianie zadań w określonych odstępach czasowych lub o konkretnej godzinie. Został zaprojektowany z myślą o prostocie i elastyczności, z możliwością użycia w środowiskach rozproszonych.

## Funkcje
- Uruchamianie zadań co określony interwał czasowy lub o konkretnych godzinach.
- Mechanizm blokad oparty na systemie plików do synchronizacji w środowiskach rozproszonych.
- Łatwa integracja z istniejącymi aplikacjami Node.js.
- Obsługa zadań asynchronicznych i synchronicznych.

## Instalacja
Brak zewnętrznych zależności. Wystarczy skopiować klasę `CronScheduler` do projektu.

## Szybki Start
1. Utwórz instancję `CronScheduler` z ścieżką do katalogu i interwałem odświeżania.
```javascript
const cronScheduler = new CronScheduler('ścieżka/do/katalogu', interwałOdświeżania);
